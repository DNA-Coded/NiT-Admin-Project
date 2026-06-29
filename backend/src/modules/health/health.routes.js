import { Router } from 'express';
import { getHealth } from './health.controller.js';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    System health check — returns server status, uptime, and DB state
 * @access  Public
 */
router.get('/', getHealth);

export default router;
