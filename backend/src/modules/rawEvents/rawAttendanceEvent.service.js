import RawAttendanceEvent from './rawAttendanceEvent.model.js';
import { PROCESSING_STATUS } from './rawAttendanceEvent.constants.js';
import { createAttendance } from '../attendance/attendance.service.js';
import Employee from '../employee/employee.model.js';

import Device from '../devices/device.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logEventReceived,
  logEventNormalized,
  logEventProcessed,
  logDuplicateEvent,
  logProcessingFailed,
} from './rawAttendanceEvent.logger.js';
import AttendanceMapper from '../../integrations/events/attendance.mapper.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

class RawAttendanceEventService {
  /**
   * List paginated events
   */
  async listEvents(query = {}) {
    const { page = 1, limit = 20, deviceId, status, sortBy = 'receivedAt', sortOrder = 'desc' } = query;
    const filter = {};

    if (deviceId) filter.device = deviceId;
    if (status) filter.processingStatus = status.toUpperCase();

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, docs] = await Promise.all([
      RawAttendanceEvent.countDocuments(filter),
      RawAttendanceEvent.find(filter)
        .populate('device', 'deviceCode deviceName')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      events: docs.map(doc => doc.toPublicJSON()),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  /**
   * Get Event details
   */
  async getEventById(id) {
    const event = await RawAttendanceEvent.findOne({ eventId: id }).populate('device', 'deviceCode deviceName');
    if (!event) throw makeError(MESSAGES.EVENT_NOT_FOUND, 404);
    return event.toPublicJSON();
  }

  /**
   * Process a specific event by ID
   */
  async processEvent(eventId, adminEmail = 'system') {
    const event = await RawAttendanceEvent.findOne({ eventId });
    if (!event) throw makeError(MESSAGES.EVENT_NOT_FOUND, 404);

    if (event.processingStatus === PROCESSING_STATUS.PROCESSED || event.processingStatus === PROCESSING_STATUS.DUPLICATE) {
      throw makeError(MESSAGES.EVENT_ALREADY_PROCESSED, 400);
    }

    event.processingStatus = PROCESSING_STATUS.PROCESSING;
    event.processingAttempts += 1;
    await event.save();

    try {
      // 1. Fetch Device Context
      const device = await Device.findById(event.device).lean();
      if (!device) throw new Error('Associated device not found.');

      // 2. Normalize payload via Mapper (MUST HAVE await)
      const normalized = await AttendanceMapper.mapRawToEvent(event.rawPayload, event.provider, device);
      event.normalizedPayload = normalized;
      logEventNormalized({ eventId: event.eventId, provider: event.provider });
      
      // 3. Find Identity Match
      const attendanceIdentity = normalized.attendanceIdentity || normalized.userId || normalized.empId;
      if (!attendanceIdentity) throw new Error('No attendance identity found in normalized payload.');
      
      const fullEmpId = attendanceIdentity.startsWith('NIT/') 
      ? attendanceIdentity 
      : `NIT/${attendanceIdentity}`;
      
      // ⚠️ Include identity fields in .select()
      let person = await Employee.findOne({
        $or: [
          { attendanceIdentity: attendanceIdentity },
          { attendanceIdentity: fullEmpId },
          { empId: fullEmpId },
          { empId: attendanceIdentity },
          { employeeId: fullEmpId },
          { employeeId: attendanceIdentity }
        ],
        isActive: true
      }).select('_id attendanceIdentity empId employeeId').lean();
      
      let personType = 'EMPLOYEE';
      
      if (!person) throw new Error(`Unrecognized attendance identity: ${attendanceIdentity}`);
      
      // 🎯 Use the exact identity stored on the employee record in DB
      const matchedIdentity = person.attendanceIdentity || person.empId || person.employeeId || fullEmpId;
      
      // 4. Create Attendance Record
      const attendanceData = {
        attendanceCode: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        personType,
        person: person._id,
        device: device._id,
        attendanceIdentity: matchedIdentity,
        verificationMethod: normalized.verificationMethod || 'FINGERPRINT',
        attendanceType: normalized.attendanceType || 'CHECK_IN', // 👈 Pull from normalized mapper!
        timestamp: new Date(normalized.timestamp),
        attendanceDate: new Date(normalized.timestamp).toISOString().split('T')[0],
        attendanceTime: new Date(normalized.timestamp).toTimeString().split(' ')[0],
        status: 'PRESENT',
        remarks: `Auto-generated via ${event.provider}`,
      };
      
      await createAttendance(attendanceData, adminEmail, { source: 'IntegrationPipeline' });

      // 5. Mark Processed
      event.processingStatus = PROCESSING_STATUS.PROCESSED;
      event.processedAt = new Date();
      event.error = null;
      await event.save();

      logEventProcessed({ eventId: event.eventId, personId: person._id });
      return event.toPublicJSON();

    } catch (error) {
      // Handle Duplicate specifically
      if (error.message === MESSAGES.ATTENDANCE_DUPLICATE_ENTRY || error.statusCode === 409) {
        event.processingStatus = PROCESSING_STATUS.DUPLICATE;
        event.processedAt = new Date();
        event.error = error.message;
        await event.save();
        logDuplicateEvent({ eventId: event.eventId, reason: error.message });
        return event.toPublicJSON();
      }

      // Handle generic Failure
      event.processingStatus = PROCESSING_STATUS.FAILED;
      event.processedAt = new Date();
      event.error = { message: error.message, stack: error.stack };
      await event.save();
      logProcessingFailed(error, { eventId: event.eventId });
      throw makeError(`Processing failed: ${error.message}`, 422);
    }
  }

  /**
   * Process all pending events
   */
  async processPendingEvents(adminEmail = 'system', batchSize = 50) {
    const events = await RawAttendanceEvent.find({
      processingStatus: PROCESSING_STATUS.PENDING
    })
      .sort({ receivedAt: 1 })
      .limit(batchSize);

    const results = {
      total: events.length,
      processed: 0,
      failed: 0,
      duplicates: 0,
    };

    for (const event of events) {
      try {
        const result = await this.processEvent(event.eventId, adminEmail);
        if (result.processingStatus === PROCESSING_STATUS.PROCESSED) results.processed++;
        if (result.processingStatus === PROCESSING_STATUS.DUPLICATE) results.duplicates++;
      } catch (err) {
        results.failed++;
      }
    }

    return results;
  }

  /**
   * Ingest a raw event from a physical biometric device webhook
   */
  async ingestEvent(payload, provider, deviceCode) {
    if (!payload || !provider || !deviceCode) {
      throw makeError('Payload, provider, and deviceCode are required for ingestion.', 400);
    }

    if (typeof deviceCode !== 'string') {
      throw makeError('deviceCode must be a string.', 400);
    }

    const sanitizedDeviceCode = deviceCode.trim();
    if (!sanitizedDeviceCode) {
      throw makeError('deviceCode must be a non-empty string.', 400);
    }

    const device = await Device.findOne({
      deviceCode: { $eq: sanitizedDeviceCode },
      isActive: true
    }).lean();
    if (!device) {
      throw makeError('Device not found or inactive.', 404);
    }

    const event = new RawAttendanceEvent({
      provider,
      device: device._id,
      rawPayload: payload,
      processingStatus: PROCESSING_STATUS.PENDING
    });

    await event.save();
    logEventReceived({ eventId: event.eventId, provider, device: device._id });
    
    // Asynchronously process the event right away, without awaiting
    this.processEvent(event.eventId, 'system_webhook').catch(err => {
      console.error(`[Webhook] Async processing failed for event ${event.eventId}: ${err.message}`);
    });

    return { message: 'Event ingested successfully', eventId: event.eventId };
  }
}

export default new RawAttendanceEventService();
