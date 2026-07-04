import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateDevice,
  validateUpdateDevice,
  validateUpdateStatus,
  validateObjectId,
} from './device.validator.js';
import {
  getAllDevices,
  getDeviceHandler,
  createDeviceHandler,
  updateDeviceHandler,
  updateDeviceStatusHandler,
  deleteDeviceHandler,
  restoreDeviceHandler,
} from './device.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllDevices
);

router.post(
  '/',
  authenticate,
  validateCreateDevice,
  createDeviceHandler
);

router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getDeviceHandler
);

router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateDevice,
  updateDeviceHandler
);

router.patch(
  '/:id/status',
  authenticate,
  validateObjectId,
  validateUpdateStatus,
  updateDeviceStatusHandler
);

router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteDeviceHandler
);

router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreDeviceHandler
);

export default router;
