import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import RawAttendanceEventService from './rawAttendanceEvent.service.js';

export const listEvents = asyncHandler(async (req, res) => {
  const { page, limit, deviceId, status, sortBy, sortOrder } = req.query;

  try {
    const result = await RawAttendanceEventService.listEvents({
      page, limit, deviceId, status, sortBy, sortOrder
    });
    return sendSuccess(res, result, MESSAGES.EVENT_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getEventDetails = asyncHandler(async (req, res) => {
  try {
    const event = await RawAttendanceEventService.getEventById(req.params.id);
    return sendSuccess(res, event, MESSAGES.EVENT_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const processEventManually = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';

  try {
    const result = await RawAttendanceEventService.processEvent(req.params.id, adminEmail);
    return sendSuccess(res, result, MESSAGES.EVENT_PROCESSED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const processPendingEvents = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';
  const { batchSize = 50 } = req.body;

  try {
    const result = await RawAttendanceEventService.processPendingEvents(adminEmail, batchSize);
    return sendSuccess(res, result, `Processed ${result.total} pending events.`, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
