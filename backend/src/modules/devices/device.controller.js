import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  updateDeviceStatus,
  softDeleteDevice,
  restoreDevice,
} from './device.service.js';

// backend/src/module/devices/device.controller.js
import { updateDeviceHeartbeat } from './device.service.js';

// ... existing imports and controllers ...

export const deviceHeartbeatHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);
  const payload = req.body;

  try {
    // 1. Update heartbeat in Database FIRST so `device` is defined
    const device = await updateDeviceHeartbeat(req.params.id, payload, requestMeta);

    // 2. Safely emit WebSocket event AFTER device is retrieved
    const io = req.app.get('io');
    if (io) {
      io.emit('device:status', {
        deviceId: device._id || req.params.id,
        deviceCode: device.deviceCode,
        status: device.status || 'ONLINE',
        healthStatus: device.healthStatus || 'HEALTHY',
      });
    }

    return sendSuccess(res, device, "Heartbeat acknowledged", 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

/**
 * 2. BIOMETRIC SCAN EVENT HANDLER
 * Triggered when a user scans a card, face, or fingerprint at a terminal
 */
export const createDeviceEventHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);
  const { userCode, verificationMethod, eventType, timestamp } = req.body;

  try {
    // Fetch device details to enrich event details
    const device = await getDeviceById(req.params.id, requestMeta);

    const eventData = {
      deviceCode: device.deviceCode,
      deviceName: device.deviceName,
      building: device.building,
      floor: device.floor,
      userCode,
      verificationMethod,
      eventType: eventType || 'CHECK_IN',
      timestamp: timestamp || new Date().toISOString(),
    };

    // Broadcast scan event to connected React frontend clients
    const io = req.app.get('io');
    if (io) {
      io.emit('device:event', eventData);
    }

    return sendSuccess(res, eventData, "Scan event recorded successfully", 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getAllDevices = asyncHandler(async (req, res) => {
  const {
    page, limit, search, deviceCategory, status, building, floor,
    assignedDepartment, connectionMode, isAttendanceEnabled, isDefaultDevice,
    isActive, sortBy, sortOrder,
  } = req.query;

  const requestMeta = extractRequestMeta(req);

  try {
    const result = await listDevices(
      { page, limit, search, deviceCategory, status, building, floor, assignedDepartment, connectionMode, isAttendanceEnabled, isDefaultDevice, isActive, sortBy, sortOrder },
      requestMeta
    );
    return sendSuccess(res, result, MESSAGES.DEVICE_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getDeviceHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const device = await getDeviceById(req.params.id, requestMeta);
    return sendSuccess(res, device, MESSAGES.DEVICE_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const createDeviceHandler = asyncHandler(async (req, res) => {
  // 1. Extract payload and auth data
  const deviceData = req.body;
  const adminEmail = req.admin?.email ?? 'unknown';
  const createdBy = req.user?.id; // Assuming your auth middleware sets req.user.id
  
  const requestMeta = extractRequestMeta(req);

  try {
    // 2. Pass the merged data to your service layer
    const device = await createDevice(
      {
        ...deviceData,
        createdBy, // Inject the ID here so the service can save it
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, device, MESSAGES.DEVICE_CREATED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
  });

export const updateDeviceHandler = asyncHandler(async (req, res) => {
  const {
    deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
    ipAddress, macAddress, port, campus, building, floor, room,
    locationDescription, firmwareVersion, status,
    assignedDepartment, connectionMode, heartbeatInterval,
    isAttendanceEnabled, isDefaultDevice,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const device = await updateDevice(
      req.params.id,
      {
        deviceCode, deviceName, deviceCategory, supportedVerificationMethods, manufacturer, model, serialNumber,
        ipAddress, macAddress, port, campus, building, floor, room,
        locationDescription, firmwareVersion, status,
        assignedDepartment, connectionMode, heartbeatInterval,
        isAttendanceEnabled, isDefaultDevice,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, device, MESSAGES.DEVICE_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const updateDeviceStatusHandler = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const adminEmail = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const device = await updateDeviceStatus(
      req.params.id,
      status,
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, device, MESSAGES.DEVICE_STATUS_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const deleteDeviceHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    await softDeleteDevice(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, null, MESSAGES.DEVICE_DELETED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const restoreDeviceHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const device = await restoreDevice(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, device, MESSAGES.DEVICE_RESTORED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
