import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { validateExportRequest } from './exports.validator.js';
import { getExport } from './exports.controller.js';

const router = Router();

/**
 * @swagger
 * /exports/history:
 *   get:
 *     summary: List export history
 *     tags: [Exports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of export history
 */
router.get('/', authenticate, validateExportRequest, getExport);

export default router;
