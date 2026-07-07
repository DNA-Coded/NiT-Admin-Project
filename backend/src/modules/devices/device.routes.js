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

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: List devices
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: A paginated list of devices
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllDevices
);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Device created successfully
 */
router.post(
  '/',
  authenticate,
  validateCreateDevice,
  createDeviceHandler
);

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Get a device by ID
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device retrieved successfully
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getDeviceHandler
);

/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Update a device
 *     tags: [Devices]
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
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: Device updated successfully
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateDevice,
  updateDeviceHandler
);

/**
 * @swagger
 * /devices/{id}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Devices]
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
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch(
  '/:id/status',
  authenticate,
  validateObjectId,
  validateUpdateStatus,
  updateDeviceStatusHandler
);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Soft-delete a device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device deactivated successfully
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteDeviceHandler
);

/**
 * @swagger
 * /devices/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device restored successfully
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreDeviceHandler
);

export default router;
