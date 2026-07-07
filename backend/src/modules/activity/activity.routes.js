import { Router } from 'express';
import { getActivities, getActivityById, searchActivities, filterActivities } from './activity.controller.js';
import { validateQuery, validateParams } from './activity.validator.js';

const router = Router();

// Protect these routes as per the overall system authentication strategy
// For now we map them directly, normally we would add `protect, authorize(['ADMIN'])` here.
// Example: router.use(protect, authorize(['ADMIN']));

/**
 * @swagger
 * /activity/search:
 *   get:
 *     summary: Search activities
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 */
router.get('/search', validateQuery, searchActivities);

/**
 * @swagger
 * /activity/filter:
 *   get:
 *     summary: Filter activities
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Filtered activities
 */
router.get('/filter', validateQuery, filterActivities);

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: List activities / Audit logs
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: A paginated list of activities
 */
router.get('/', validateQuery, getActivities);

/**
 * @swagger
 * /activity/{id}:
 *   get:
 *     summary: Get an activity record by ID
 *     tags: [Activity]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Activity retrieved successfully
 */
router.get('/:id', validateParams, getActivityById);

export default router;
