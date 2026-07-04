import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateFaculty,
  validateUpdateFaculty,
  validateObjectId,
} from './faculty.validator.js';
import {
  getAllFaculty,
  getFacultyHandler,
  createFacultyHandler,
  updateFacultyHandler,
  deleteFacultyHandler,
  restoreFacultyHandler,
} from './faculty.controller.js';

const router = Router();

/**
 * Faculty Routes
 * Base path: /api/v1/faculty (mounted in src/routes/index.js)
 *
 * Access: all routes require a valid JWT (authenticate middleware).
 * This is a single-admin system — no role-based route-level restrictions applied.
 */

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/faculty
 * @desc    List faculty — supports pagination, search, filtering, sorting
 * @access  Protected
 * @query   page, limit, search, department, designation, isActive, sortBy, sortOrder
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllFaculty
);

/**
 * @route   POST /api/v1/faculty
 * @desc    Create a new faculty record
 * @access  Protected
 * @body    { employeeId, firstName, lastName, designation, department, attendanceIdentity, email?, phone? }
 */
router.post(
  '/',
  authenticate,
  validateCreateFaculty,
  createFacultyHandler
);

// ─── Document routes ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/faculty/:id
 * @desc    Get a single faculty record by ID
 * @access  Protected
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getFacultyHandler
);

/**
 * @route   PUT /api/v1/faculty/:id
 * @desc    Update a faculty record (partial update supported)
 * @access  Protected
 * @body    Any subset of { employeeId, firstName, lastName, designation, department,
 *          attendanceIdentity, email, phone } — at least one field required
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateFaculty,
  updateFacultyHandler
);

/**
 * @route   DELETE /api/v1/faculty/:id
 * @desc    Soft-delete a faculty record (sets isActive: false, stamps deletedAt/deletedBy)
 * @access  Protected
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteFacultyHandler
);

/**
 * @route   PATCH /api/v1/faculty/:id/restore
 * @desc    Restore a soft-deleted faculty record (clears deletedAt/deletedBy)
 * @access  Protected
 *
 * Note: registered before /:id to prevent 'restore' being parsed as a document ID.
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreFacultyHandler
);

export default router;
