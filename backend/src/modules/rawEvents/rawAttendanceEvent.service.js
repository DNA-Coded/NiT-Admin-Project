import RawAttendanceEvent from './rawAttendanceEvent.model.js';
import { PROCESSING_STATUS } from './rawAttendanceEvent.constants.js';
import { createAttendance } from '../attendance/attendance.service.js';
import Faculty from '../faculty/faculty.model.js';

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

      // 2. Normalize payload via Mapper
      const normalized = AttendanceMapper.mapRawToEvent(event.rawPayload, event.provider, device);
      event.normalizedPayload = normalized;
      logEventNormalized({ eventId: event.eventId, provider: event.provider });

      // 3. Find Identity Match
      const attendanceIdentity = normalized.userId || normalized.empId;
      if (!attendanceIdentity) throw new Error('No attendance identity found in normalized payload.');

      let person = await Faculty.findOne({ attendanceIdentity, isActive: true }).select('_id').lean();
      let personType = 'FACULTY';

      if (!person) throw new Error(`Unrecognized attendance identity: ${attendanceIdentity}`);

      // 4. Create Attendance Record
      const attendanceData = {
        attendanceCode: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        personType,
        person: person._id,
        device: device._id,
        attendanceIdentity,
        verificationMethod: normalized.verificationMethod || 'UNKNOWN',
        attendanceType: 'IN', // NOTE: Determine IN/OUT via device rules or payload if available
        timestamp: new Date(normalized.timestamp),
        attendanceDate: new Date(normalized.timestamp).toISOString().split('T')[0],
        attendanceTime: new Date(normalized.timestamp).toTimeString().split(' ')[0],
        status: 'PRESENT', // NOTE: Determine via Attendance Policies (Phase 5)
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
}

export default new RawAttendanceEventService();
