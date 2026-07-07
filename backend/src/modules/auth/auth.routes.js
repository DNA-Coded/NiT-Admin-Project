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
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate admin
 *     description: Authenticates an admin using email and password, returning a JWT access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@nit.ac.in
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccess'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account inactive
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: End current admin session
 *     description: Stateless logout. The client should discard the token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccess'
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated admin profile
 *     description: Returns the public profile of the currently logged-in admin.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: 'string' }
 *                 message: { type: 'string' }
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getMe);

export default router;

