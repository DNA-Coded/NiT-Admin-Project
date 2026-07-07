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
 * @swagger
 * /departments:
 *   get:
 *     summary: List departments
 *     description: Retrieve a paginated list of departments. Supports search, filtering, and sorting.
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name or code
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: A paginated list of departments
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StandardSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Department'
 *                     meta:
 *                       $ref: '#/components/schemas/Pagination'
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllDepartments
);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     description: Creates a new active department.
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Information Technology
 *               code:
 *                 type: string
 *                 example: IT
 *               description:
 *                 type: string
 *                 example: IT Dept
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StandardSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Department'
 */
router.post(
  '/',
  authenticate,
  validateCreateDepartment,
  createDepartmentHandler
);

// ─── Document routes ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StandardSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department
 *     description: Perform a partial update of a department.
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateDepartment,
  updateDepartmentHandler
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Soft-delete a department
 *     description: Deactivates a department.
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Department deactivated successfully
 *       404:
 *         description: Department not found
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteDepartmentHandler
);

/**
 * @swagger
 * /departments/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted department
 *     tags: [Departments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Department restored successfully
 *       404:
 *         description: Department not found
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreDepartmentHandler
);

export default router;
