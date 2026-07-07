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
 * @swagger
 * /faculty:
 *   get:
 *     summary: List faculty
 *     description: Retrieve a paginated list of faculty members.
 *     tags: [Faculty]
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
 *         description: A paginated list of faculty
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllFaculty
);

/**
 * @swagger
 * /faculty:
 *   post:
 *     summary: Create a new faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       201:
 *         description: Faculty created successfully
 */
router.post(
  '/',
  authenticate,
  validateCreateFaculty,
  createFacultyHandler
);

// ─── Document routes ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /faculty/{id}:
 *   get:
 *     summary: Get a faculty record by ID
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty retrieved successfully
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getFacultyHandler
);

/**
 * @swagger
 * /faculty/{id}:
 *   put:
 *     summary: Update a faculty record
 *     tags: [Faculty]
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
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       200:
 *         description: Faculty updated successfully
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateFaculty,
  updateFacultyHandler
);

/**
 * @swagger
 * /faculty/{id}:
 *   delete:
 *     summary: Soft-delete a faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty deactivated successfully
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteFacultyHandler
);

/**
 * @swagger
 * /faculty/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty restored successfully
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreFacultyHandler
);

export default router;
