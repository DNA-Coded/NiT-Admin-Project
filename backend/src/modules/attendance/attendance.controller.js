import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listAttendance,
  getDailyAttendanceRecords,
  getAttendanceSummary,
  exportAttendanceCSV,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  softDeleteAttendance,
  restoreAttendance,
  correctAttendance,
} from './attendance.service.js';

export const getAllAttendance = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);
  const { view } = req.query;

  try {
    // If raw view is requested, return individual raw punch logs
    if (view === 'raw') {
      const result = await listAttendance(req.query, requestMeta);
      return sendSuccess(res, result, MESSAGES.ATTENDANCE_FETCH_LIST, 200);
    }

    // Default: Return daily aggregated records (First In, Last Out, Total Hours)
    const result = await getDailyAttendanceRecords(req.query, requestMeta);
    return sendSuccess(res, result, MESSAGES.ATTENDANCE_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getAttendanceSummaryHandler = asyncHandler(async (req, res) => {
  try {
    const summary = await getAttendanceSummary(req.query.date);
    return sendSuccess(res, summary, 'Attendance summary retrieved successfully.', 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const exportAttendanceCSVHandler = asyncHandler(async (req, res) => {
  const { content, contentType, extension } = await exportAttendanceCSV(req.query);
  const filename = `attendance_export_${new Date().toISOString().split('T')[0]}.${extension}`;

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(content);
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

export const getAttendanceHistoryHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await getAttendanceById(req.params.id, requestMeta);
    return sendSuccess(res, record, 'Attendance history retrieved successfully.', 200);
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

export const correctAttendanceHandler = asyncHandler(async (req, res) => {
  const { status, attendanceType, remarks, correctionReason } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const record = await correctAttendance(
      req.params.id,
      { status, attendanceType, remarks, correctionReason },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, record, 'Attendance record corrected successfully.', 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});