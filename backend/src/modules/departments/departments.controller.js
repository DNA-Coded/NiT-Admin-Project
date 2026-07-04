import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../auth/auth.logger.js';
import {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  softDeleteDepartment,
  restoreDepartment,
} from './departments.service.js';

/**
 * Department Controller
 *
 * Thin HTTP layer: receives validated request data, delegates to the service,
 * and returns standardized responses. No business logic lives here.
 *
 * Error handling convention (same as auth.controller.js):
 *   - Typed service errors (have `.statusCode`) → sendError with that code.
 *   - Unexpected errors (no `.statusCode`)      → re-throw for global errorHandler (500).
 */

// ─── GET /api/v1/departments ──────────────────────────────────────────────────
/**
 * @desc    List departments with pagination, search, and filtering
 * @route   GET /api/v1/departments
 * @access  Protected
 */
export const getAllDepartments = asyncHandler(async (req, res) => {
  const {
    page, limit, search,
    isActive, sortBy, sortOrder,
  } = req.query;

  const requestMeta = extractRequestMeta(req);

  try {
    const result = await listDepartments(
      { page, limit, search, isActive, sortBy, sortOrder },
      requestMeta
    );
    return sendSuccess(res, result, MESSAGES.DEPARTMENT_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── GET /api/v1/departments/:id ──────────────────────────────────────────────
/**
 * @desc    Get a single department by ID
 * @route   GET /api/v1/departments/:id
 * @access  Protected
 */
export const getDepartment = asyncHandler(async (req, res) => {
  const requestMeta = extractRequestMeta(req);

  try {
    const dept = await getDepartmentById(req.params.id, requestMeta);
    return sendSuccess(res, dept, MESSAGES.DEPARTMENT_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── POST /api/v1/departments ─────────────────────────────────────────────────
/**
 * @desc    Create a new department
 * @route   POST /api/v1/departments
 * @access  Protected — SUPER_ADMIN, ADMIN
 */
export const createDepartmentHandler = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;
  const adminEmail   = req.admin?.email ?? 'unknown';
  const requestMeta  = extractRequestMeta(req);

  try {
    const dept = await createDepartment(
      { name, code, description },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, dept, MESSAGES.DEPARTMENT_CREATED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── PUT /api/v1/departments/:id ──────────────────────────────────────────────
/**
 * @desc    Update a department's mutable fields
 * @route   PUT /api/v1/departments/:id
 * @access  Protected — SUPER_ADMIN, ADMIN
 */
export const updateDepartmentHandler = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const dept = await updateDepartment(
      req.params.id,
      { name, code, description },
      adminEmail,
      requestMeta
    );
    return sendSuccess(res, dept, MESSAGES.DEPARTMENT_UPDATED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── DELETE /api/v1/departments/:id ───────────────────────────────────────────
/**
 * @desc    Soft-delete a department (sets isActive: false)
 * @route   DELETE /api/v1/departments/:id
 * @access  Protected — SUPER_ADMIN, ADMIN
 */
export const deleteDepartmentHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    await softDeleteDepartment(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, null, MESSAGES.DEPARTMENT_DELETED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

// ─── PATCH /api/v1/departments/:id/restore ────────────────────────────────────
/**
 * @desc    Restore a soft-deleted department (sets isActive: true)
 * @route   PATCH /api/v1/departments/:id/restore
 * @access  Protected — SUPER_ADMIN, ADMIN
 */
export const restoreDepartmentHandler = asyncHandler(async (req, res) => {
  const adminEmail  = req.admin?.email ?? 'unknown';
  const requestMeta = extractRequestMeta(req);

  try {
    const dept = await restoreDepartment(req.params.id, adminEmail, requestMeta);
    return sendSuccess(res, dept, MESSAGES.DEPARTMENT_RESTORED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
