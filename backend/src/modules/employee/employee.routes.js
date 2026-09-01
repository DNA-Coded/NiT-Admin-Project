import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateEmployee,
  validateUpdateEmployee,
  validateObjectId,
} from './employee.validator.js';
import Department from '../departments/departments.model.js';
import EmployeeController from './employee.controller.js';

const router = Router();

/**
 * Employee Routes
 * Base path: /api/v1/employee (mounted in src/routes/index.js)
 *
 * Access: all routes require a valid JWT (authenticate middleware).
 * This is a single-admin system — no role-based route-level restrictions applied.
 */

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: List employee
 *     description: Retrieve a paginated list of employee members.
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A paginated list of employee
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  EmployeeController.getAllEmployee
);

/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Create a new employee record
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Employee created successfully
 */
router.post(
  '/',
  authenticate,
  validateCreateEmployee,
  EmployeeController.createEmployee
);

// ─── Document routes ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /employee/{id}:
 *   get:
 *     summary: Get a employee record by ID
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  EmployeeController.getEmployeeById
);

/**
 * @swagger
 * /employee/{id}:
 *   put:
 *     summary: Update a employee record
 *     tags: [Employee]
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
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateEmployee,
  EmployeeController.updateEmployee
);

/**
 * @swagger
 * /employee/{id}:
 *   delete:
 *     summary: Soft-delete a employee record
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee deactivated successfully
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  EmployeeController.deleteEmployee
);

/**
 * @swagger
 * /employee/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted employee record
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee restored successfully
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  EmployeeController.restoreEmployee
);

export default router;
