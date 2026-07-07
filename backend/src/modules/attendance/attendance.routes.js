import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateAttendance,
  validateUpdateAttendance,
  validateCorrectAttendance,
  validateObjectId,
} from './attendance.validator.js';
import {
  getAllAttendance,
  getAttendanceHandler,
  getAttendanceHistoryHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  restoreAttendanceHandler,
  correctAttendanceHandler,
} from './attendance.controller.js';

const router = Router();

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: List attendance records
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: A paginated list of attendance records
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllAttendance
);

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create a new attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 */
router.post(
  '/',
  authenticate,
  validateCreateAttendance,
  createAttendanceHandler
);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get an attendance record by ID
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getAttendanceHandler
);

/**
 * @swagger
 * /attendance/{id}/history:
 *   get:
 *     summary: Get attendance correction history
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */
router.get(
  '/:id/history',
  authenticate,
  validateObjectId,
  getAttendanceHistoryHandler
);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update an attendance record
 *     tags: [Attendance]
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
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateAttendance,
  updateAttendanceHandler
);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Soft-delete an attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record deactivated successfully
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteAttendanceHandler
);

/**
 * @swagger
 * /attendance/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record restored successfully
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreAttendanceHandler
);

/**
 * @swagger
 * /attendance/{id}/correct:
 *   patch:
 *     summary: Correct an attendance record manually
 *     tags: [Attendance]
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
 *               status: { type: string }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record corrected successfully
 */
router.patch(
  '/:id/correct',
  authenticate,
  validateObjectId,
  validateCorrectAttendance,
  correctAttendanceHandler
);

export default router;
