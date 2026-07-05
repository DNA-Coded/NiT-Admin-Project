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

// Start a new sync job
router.post('/start', validateSyncTrigger, startSync);

// Retry a failed sync job
router.post('/:id/retry', validateSyncId, retrySync);

// Get latest sync for a device
router.get('/latest', validateListQuery, getLatestSync);

// List sync history globally
router.get('/', validateListQuery, listSyncHistory);

// List sync history for a specific device
router.get('/device/:deviceId', validateDeviceId, validateListQuery, getDeviceSyncHistory);
// Alias
router.get('/device/:deviceId/history', validateDeviceId, validateListQuery, getDeviceSyncHistory);

// Get details of a specific sync job
router.get('/:id', validateSyncId, getSyncJob);

export default router;
