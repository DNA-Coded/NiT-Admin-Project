import { Router } from 'express';
import { getSettings, updateSettings, resetSettings } from './settings.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 */
router.get('/', getSettings);
/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update system settings
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/', updateSettings);
/**
 * @swagger
 * /settings/reset:
 *   post:
 *     summary: Reset settings to defaults
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings reset successfully
 */
router.post('/reset', resetSettings);

export default router;
