import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { validateReportFilters } from './reports.validator.js';
import {
  getAttendanceReport,
  getFacultyReport,

  getDeviceReport,
  getSynchronizationReport,
} from './reports.controller.js';

const router = Router();

/**
 * @swagger
 * /reports/attendance:
 *   get:
 *     summary: Generate attendance report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance report generated successfully
 */
router.get('/attendance', authenticate, validateReportFilters, getAttendanceReport);
/**
 * @swagger
 * /reports/faculty:
 *   get:
 *     summary: Generate faculty report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Faculty report generated successfully
 */
router.get('/faculty', authenticate, validateReportFilters, getFacultyReport);

/**
 * @swagger
 * /reports/devices:
 *   get:
 *     summary: Generate device report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Device report generated successfully
 */
router.get('/devices', authenticate, validateReportFilters, getDeviceReport);
/**
 * @swagger
 * /reports/synchronization:
 *   get:
 *     summary: Generate sync report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sync report generated successfully
 */
router.get('/synchronization', authenticate, validateReportFilters, getSynchronizationReport);

export default router;
