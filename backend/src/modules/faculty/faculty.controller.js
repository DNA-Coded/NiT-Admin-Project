import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  softDeleteFaculty,
  restoreFaculty,
} from './faculty.service.js';

/**
 * Faculty Controller
 *
 * Thin HTTP layer: receives validated request data, delegates to the service,
 * and returns standardized responses. No business logic lives here.
 *
 * Error handling convention (matches departments.controller.js):
 *   - Typed service errors (have `.statusCode`) → sendError with that code.
 *   - Unexpected errors (no `.statusCode`)      → re-throw for global errorHandler (500).
 */

// ─── GET /api/v1/faculty ──────────────────────────────────────────────────────
/**
 * @desc    List faculty with pagination, search, and filtering
 * @route   GET /api/v1/faculty
 * @access  Protected
 */
export const getAllFaculty = asyncHandler(async (req, res) => {
  const {
    page, limit, search,
    department, designation, status, isActive,
    sortBy, sortOrder,
  } = req.query;

  const requestMeta = extractRequestMeta(req);

  try {
    const result = await listFaculty(
      { page, limit, search, department, designation, status, isActive, sortBy, sortOrder },
      requestMeta
    );
    return sendSuccess(res, result, MESSAGES.FACULTY_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── GET /api/v1/faculty/:id ──────────────────────────────────────────────────
/**
 * @desc    Get a single faculty record by ID
 * @route   GET /api/v1/faculty/:id
 * @access  Protected
 */
export const getFacultyHandler = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const faculty = await getFacultyById(req.params.id, requestMeta);
    return sendSuccess(res, faculty, MESSAGES.FACULTY_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── POST /api/v1/faculty ─────────────────────────────────────────────────────
/**
 * @desc    Create a new faculty record
 * @route   POST /api/v1/faculty
 * @access  Protected
 */
export const createFacultyHandler = asyncHandler(async (req, res) => {
  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const faculty = await createFaculty(
      {
        employeeId, firstName, lastName, email, phone, designation,
        department, attendanceIdentity, status, joiningDate, profileImage,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, faculty, MESSAGES.FACULTY_CREATED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── PUT /api/v1/faculty/:id ──────────────────────────────────────────────────
/**
 * @desc    Update a faculty record (partial update supported)
 * @route   PUT /api/v1/faculty/:id
 * @access  Protected
 */
export const updateFacultyHandler = asyncHandler(async (req, res) => {
  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
  } = req.body;

  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const faculty = await updateFaculty(
      req.params.id,
      {
        employeeId, firstName, lastName, email, phone, designation,
        department, attendanceIdentity, status, joiningDate, profileImage,
      },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, faculty, MESSAGES.FACULTY_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── DELETE /api/v1/faculty/:id ───────────────────────────────────────────────
/**
 * @desc    Soft-delete a faculty record (sets isActive: false)
 * @route   DELETE /api/v1/faculty/:id
 * @access  Protected
 */
export const deleteFacultyHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    await softDeleteFaculty(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, null, MESSAGES.FACULTY_DELETED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── PATCH /api/v1/faculty/:id/restore ───────────────────────────────────────
/**
 * @desc    Restore a soft-deleted faculty record (sets isActive: true)
 * @route   PATCH /api/v1/faculty/:id/restore
 * @access  Protected
 */
export const restoreFacultyHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const faculty = await restoreFaculty(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, faculty, MESSAGES.FACULTY_RESTORED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
