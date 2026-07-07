import { Router } from 'express';
import { authenticate, authorize } from '../../modules/auth/auth.middleware.js';
import { ROLES, PERMISSIONS } from '../../constants/index.js';
import {
  listSyncHistory,
  getSyncJob,
  getLatestSync,
  startSync,
  retrySync,
  getDeviceSyncHistory
} from './sync.controller.js';
import {
  validateListQuery,
  validateSyncId,
  validateDeviceId,
  validateSyncTrigger,
} from './sync.validator.js';

const router = Router();

// Only Super Admins and Admins should manage syncs
router.use(authenticate);
router.use(authorize(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.DEVICES_MANAGE, PERMISSIONS.ATTENDANCE_MANAGE]
));

/**
 * @swagger
 * /sync/start:
 *   post:
 *     summary: Trigger sync for a device
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId: { type: string }
 *     responses:
 *       202:
 *         description: Sync job started successfully
 */
router.post('/start', validateSyncTrigger, startSync);

/**
 * @swagger
 * /sync/{id}/retry:
 *   post:
 *     summary: Retry a failed sync job
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       202:
 *         description: Sync job retry started successfully
 */
router.post('/:id/retry', validateSyncId, retrySync);

/**
 * @swagger
 * /sync/latest:
 *   get:
 *     summary: Get latest sync
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Latest sync retrieved
 */
router.get('/latest', validateListQuery, getLatestSync);

/**
 * @swagger
 * /sync:
 *   get:
 *     summary: List sync history globally
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of sync history
 */
router.get('/', validateListQuery, listSyncHistory);

/**
 * @swagger
 * /sync/device/{deviceId}:
 *   get:
 *     summary: List sync history for a specific device
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sync history for device
 */
router.get('/device/:deviceId', validateDeviceId, validateListQuery, getDeviceSyncHistory);
// Alias
router.get('/device/:deviceId/history', validateDeviceId, validateListQuery, getDeviceSyncHistory);

/**
 * @swagger
 * /sync/{id}:
 *   get:
 *     summary: Get details of a specific sync job
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sync details retrieved successfully
 */
router.get('/:id', validateSyncId, getSyncJob);

export default router;
