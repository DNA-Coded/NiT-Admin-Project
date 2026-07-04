import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  softDeleteAttendance,
  restoreAttendance,
} from './attendance.service.js';

export const getAllAttendance = asyncHandler(async (req, res) => {
  const {
    page, limit, search, personType, person, department, device,
    verificationMethod, attendanceType, status, attendanceDate,
    isActive, sortBy, sortOrder,
  } = req.query;

  const requestMeta = extractRequestMeta(req);

  try {
    const result = await listAttendance(
      { page, limit, search, personType, person, department, device, verificationMethod, attendanceType, status, attendanceDate, isActive, sortBy, sortOrder },
      requestMeta
    );
    return sendSuccess(res, result, MESSAGES.ATTENDANCE_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getAttendanceHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await getAttendanceById(req.params.id, requestMeta);
    return sendSuccess(res, record, MESSAGES.ATTENDANCE_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const createAttendanceHandler = asyncHandler(async (req, res) => {
  const {
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await createAttendance(
      {
        attendanceCode, personType, person, device, attendanceIdentity,
        verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
        status, remarks,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, record, MESSAGES.ATTENDANCE_CREATED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const updateAttendanceHandler = asyncHandler(async (req, res) => {
  const {
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await updateAttendance(
      req.params.id,
      {
        attendanceCode, personType, person, device, attendanceIdentity,
        verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
        status, remarks,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, record, MESSAGES.ATTENDANCE_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const deleteAttendanceHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    await softDeleteAttendance(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, null, MESSAGES.ATTENDANCE_DELETED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const restoreAttendanceHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await restoreAttendance(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, record, MESSAGES.ATTENDANCE_RESTORED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
