import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateExportRequest } from './exports.validator.js';
import { getExport } from './exports.controller.js';

const router = Router();

router.get('/', authenticate, validateExportRequest, getExport);

export default router;
