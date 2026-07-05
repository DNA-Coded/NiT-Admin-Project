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
    const device = await createDevice(
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
