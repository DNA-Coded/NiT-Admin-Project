import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  getOverview,
  getLiveAttendance,
  getDeviceStatus,
  getAnalytics,
  getLiveMonitoring,
  getFilteredSearch,
} from './dashboard.controller.js';

const router = Router();

/**
 * Dashboard Routes
 * Base path: /api/v1/dashboard (mounted in src/routes/index.js)
 *
 * Access: all routes require a valid JWT (authenticate middleware).
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview metrics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overview metrics retrieved successfully
 */
router.get('/overview', authenticate, getOverview);
/**
 * @swagger
 * /dashboard/live-attendance:
 *   get:
 *     summary: Get live attendance logs
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Live attendance logs retrieved successfully
 */
router.get('/live-attendance', authenticate, getLiveAttendance);
/**
 * @swagger
 * /dashboard/device-status:
 *   get:
 *     summary: Get live device status
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Device status retrieved successfully
 */
router.get('/device-status', authenticate, getDeviceStatus);
router.get('/analytics', authenticate, getAnalytics);
router.get('/live', authenticate, getLiveMonitoring);
router.get('/filtered', authenticate, getFilteredSearch);

export default router;
