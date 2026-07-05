import { Router } from 'express';
import { authenticate, authorize } from '../../modules/auth/auth.middleware.js';
import { ROLES, PERMISSIONS } from '../../constants/index.js';
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

// Only Super Admins and Admins should manage health configurations and status
router.use(authenticate);
router.use(authorize(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.DEVICES_MANAGE]
));

// Get overall health summary of all devices
router.get('/', getAllDevicesHealth);

// Get health specific to one device
router.get('/:deviceId', validateDeviceId, getDeviceHealth);

// Record a heartbeat (could be called internally or via a webhook without full auth in a real device scenario)
// Here, we maintain auth since it's a managed platform.
router.patch('/:deviceId/heartbeat', validateDeviceId, updateHeartbeat);

// Update status manually
router.patch('/:deviceId/status', validateDeviceId, validateStatusUpdate, updateStatus);

// Record an error
router.patch('/:deviceId/error', validateDeviceId, validateErrorRecord, recordError);

// Reset health metrics
router.patch('/:deviceId/reset', validateDeviceId, resetHealthMetrics);

export default router;
