import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateDepartment,
  validateUpdateDepartment,
  validateObjectId,
} from './departments.validator.js';
import {
  getAllDepartments,
  getDepartment,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
  restoreDepartmentHandler,
} from './departments.controller.js';

const router = Router();

/**
 * Department Routes
 * Base path: /api/v1/departments (mounted in src/routes/index.js)
 *
 * Access: all routes require a valid JWT (authenticate middleware).
 * This is a single-admin system — no role-based route-level restrictions
 * are applied here. Authorization is enforced at the application level.
 */

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/departments
 * @desc    List departments — supports pagination, search, filtering, sorting
 * @access  Protected
 * @query   page, limit, search, isActive, sortBy, sortOrder
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllDepartments
);

/**
 * @route   POST /api/v1/departments
 * @desc    Create a new department
 * @access  Protected
 * @body    { name, code, description? }
 */
router.post(
  '/',
  authenticate,
  validateCreateDepartment,
  createDepartmentHandler
);

// ─── Document routes ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/departments/:id
 * @desc    Get a single department by ID
 * @access  Protected
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getDepartment
);

/**
 * @route   PUT /api/v1/departments/:id
 * @desc    Update a department (partial update supported)
 * @access  Protected
 * @body    { name?, code?, description? } — at least one required
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateDepartment,
  updateDepartmentHandler
);

/**
 * @route   DELETE /api/v1/departments/:id
 * @desc    Soft-delete a department (sets isActive: false, stamps deletedAt/deletedBy)
 * @access  Protected
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteDepartmentHandler
);

/**
 * @route   PATCH /api/v1/departments/:id/restore
 * @desc    Restore a soft-deleted department (clears isActive, deletedAt, deletedBy)
 * @access  Protected
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreDepartmentHandler
);

export default router;
