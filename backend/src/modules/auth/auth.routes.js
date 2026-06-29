import { Router } from 'express';
import { login, logout, getMe } from './auth.controller.js';
import { authenticate } from './auth.middleware.js';
import { validateLogin } from './auth.validator.js';

const router = Router();

/**
 * Auth Routes
 * Base path: /api/v1/auth (mounted in src/routes/index.js)
 */

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate admin — returns JWT access token
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    End current admin session (stateless — client discards token)
 * @access  Protected
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated admin profile
 * @access  Protected
 */
router.get('/me', authenticate, getMe);

export default router;

