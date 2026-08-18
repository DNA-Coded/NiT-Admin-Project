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
  getAttendanceSummaryHandler,
  exportAttendanceCSVHandler,
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
 *     summary: List daily aggregated attendance records
 *     tags: [Attendance]
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllAttendance
);

/**
 * @swagger
 * /attendance/summary:
 *   get:
 *     summary: Get live attendance summary card metrics
 *     tags: [Attendance]
 */
router.get(
  '/summary',
  authenticate,
  getAttendanceSummaryHandler
);

/**
 * @swagger
 * /attendance/export:
 *   get:
 *     summary: Export attendance records as CSV
 *     tags: [Attendance]
 */
router.get(
  '/export',
  authenticate,
  exportAttendanceCSVHandler
);

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create a new attendance record
 *     tags: [Attendance]
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
 */
router.patch(
  '/:id/correct',
  authenticate,
  validateObjectId,
  validateCorrectAttendance,
  correctAttendanceHandler
);

export default router;