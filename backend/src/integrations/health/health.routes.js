import { Router } from 'express';
import { authenticate, authorize } from '../../modules/auth/auth.middleware.js';
import { ROLES } from '../../constants/index.js';
import {
  getAllDevicesHealth,
  getDeviceHealth,
  updateHeartbeat,
  updateStatus,
  recordError,
  resetHealthMetrics,
} from './health.controller.js';
import {
  validateDeviceId,
  validateStatusUpdate,
  validateErrorRecord,
} from './health.validator.js';

const router = Router();



/**
 * @swagger
 * /health:
 *   get:
 *     summary: List device health statuses
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of device health statuses
 */
router.get('/', getAllDevicesHealth);

/**
 * @swagger
 * /health/{deviceId}:
 *   get:
 *     summary: Get health details for a specific device
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device health details retrieved successfully
 */
router.get('/:deviceId', validateDeviceId, getDeviceHealth);

// Only Super Admins and Admins should manage health configurations and status
router.use(authenticate);
router.use(authorize(
  ROLES.SUPER_ADMIN, ROLES.ADMIN
));

/**
 * @swagger
 * /health/{deviceId}/heartbeat:
 *   patch:
 *     summary: Record a device heartbeat
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Heartbeat recorded successfully
 */
router.patch('/:deviceId/heartbeat', validateDeviceId, updateHeartbeat);

/**
 * @swagger
 * /health/{deviceId}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
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
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch('/:deviceId/status', validateDeviceId, validateStatusUpdate, updateStatus);

/**
 * @swagger
 * /health/{deviceId}/error:
 *   patch:
 *     summary: Record a device error
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errorType: { type: string }
 *               errorMessage: { type: string }
 *     responses:
 *       200:
 *         description: Error recorded successfully
 */
router.patch('/:deviceId/error', validateDeviceId, validateErrorRecord, recordError);

/**
 * @swagger
 * /health/{deviceId}/reset:
 *   patch:
 *     summary: Reset health metrics for a device
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Health metrics reset successfully
 */
router.patch('/:deviceId/reset', validateDeviceId, resetHealthMetrics);

export default router;
