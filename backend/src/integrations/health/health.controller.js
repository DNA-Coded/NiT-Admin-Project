import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import HealthService from './health.service.js';

export const getAllDevicesHealth = asyncHandler(async (req, res) => {
  try {
    const result = await HealthService.getAllDevicesHealth();
    return sendSuccess(res, result, MESSAGES.HEALTH_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getDeviceHealth = asyncHandler(async (req, res) => {
  try {
    const result = await HealthService.getDeviceHealth(req.params.deviceId);
    return sendSuccess(res, result, MESSAGES.HEALTH_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const updateHeartbeat = asyncHandler(async (req, res) => {
  try {
    const result = await HealthService.updateHeartbeat(req.params.deviceId);
    return sendSuccess(res, result, MESSAGES.HEALTH_HEARTBEAT_RECORDED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const updateStatus = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';
  const { status } = req.body;

  try {
    const result = await HealthService.updateStatus(req.params.deviceId, status, adminEmail);
    return sendSuccess(res, result, MESSAGES.HEALTH_STATUS_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const recordError = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';
  const { error } = req.body;

  try {
    const result = await HealthService.recordError(req.params.deviceId, error, adminEmail);
    return sendSuccess(res, result, MESSAGES.HEALTH_ERROR_RECORDED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const resetHealthMetrics = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';

  try {
    const result = await HealthService.resetHealthMetrics(req.params.deviceId, adminEmail);
    return sendSuccess(res, result, MESSAGES.HEALTH_RESET, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
