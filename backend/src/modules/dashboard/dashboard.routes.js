import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  getOverview,
  getLiveAttendance,
  getDeviceStatus,
} from './dashboard.controller.js';

const router = Router();

/**
 * Dashboard Routes
 * Base path: /api/v1/dashboard (mounted in src/routes/index.js)
 *
 * Access: all routes require a valid JWT (authenticate middleware).
 */

router.get('/overview', authenticate, getOverview);
router.get('/live-attendance', authenticate, getLiveAttendance);
router.get('/device-status', authenticate, getDeviceStatus);

export default router;
