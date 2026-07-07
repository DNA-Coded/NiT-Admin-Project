import { Router } from 'express';
import { getActivities, getActivityById, searchActivities, filterActivities } from './activity.controller.js';
import { validateQuery, validateParams } from './activity.validator.js';

const router = Router();

// Protect these routes as per the overall system authentication strategy
// For now we map them directly, normally we would add `protect, authorize(['ADMIN'])` here.
// Example: router.use(protect, authorize(['ADMIN']));

// GET /api/v1/activity/search
router.get('/search', validateQuery, searchActivities);

// GET /api/v1/activity/filter
router.get('/filter', validateQuery, filterActivities);

// GET /api/v1/activity
router.get('/', validateQuery, getActivities);

// GET /api/v1/activity/:id
router.get('/:id', validateParams, getActivityById);

export default router;
