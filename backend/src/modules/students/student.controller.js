import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  softDeleteStudent,
  restoreStudent,
} from './student.service.js';

export const getAllStudents = asyncHandler(async (req, res) => {
  const {
    page, limit, search, department, semester, section, batch,
    academicSession, status, isActive, sortBy, sortOrder,
  } = req.query;

  const requestMeta = extractRequestMeta(req);

  try {
    const result = await listStudents(
      { page, limit, search, department, semester, section, batch, academicSession, status, isActive, sortBy, sortOrder },
      requestMeta
    );
    return sendSuccess(res, result, MESSAGES.STUDENT_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getStudentHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const student = await getStudentById(req.params.id, requestMeta);
    return sendSuccess(res, student, MESSAGES.STUDENT_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const createStudentHandler = asyncHandler(async (req, res) => {
  const {
    rollNumber, registrationNumber, firstName, lastName,
    email, phone, profileImage, department, semester, section,
    batch, academicSession, attendanceIdentity, status,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const student = await createStudent(
      {
        rollNumber, registrationNumber, firstName, lastName,
        email, phone, profileImage, department, semester, section,
        batch, academicSession, attendanceIdentity, status,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, student, MESSAGES.STUDENT_CREATED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const updateStudentHandler = asyncHandler(async (req, res) => {
  const {
    rollNumber, registrationNumber, firstName, lastName,
    email, phone, profileImage, department, semester, section,
    batch, academicSession, attendanceIdentity, status,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const student = await updateStudent(
      req.params.id,
      {
        rollNumber, registrationNumber, firstName, lastName,
        email, phone, profileImage, department, semester, section,
        batch, academicSession, attendanceIdentity, status,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, student, MESSAGES.STUDENT_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const deleteStudentHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    await softDeleteStudent(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, null, MESSAGES.STUDENT_DELETED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const restoreStudentHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const student = await restoreStudent(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, student, MESSAGES.STUDENT_RESTORED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
