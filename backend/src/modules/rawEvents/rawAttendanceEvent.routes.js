
import { Router } from 'express';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { ROLES, PERMISSIONS } from '../../constants/index.js';
import rateLimit from 'express-rate-limit';
import {
  listEvents,
  getEventDetails,
  processEventManually,
  processPendingEvents,
  ingestEvent
} from './rawAttendanceEvent.controller.js';
import {
  validateListQuery,
  validateEventId,
} from './rawAttendanceEvent.validator.js';

const router = Router();

const ingestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP/Device to 100 requests per minute
  message: { error: 'Too many requests from this device, please try again later.' }
});

// Public / API Key endpoint for Biometric Machine to push data
router.post('/ingest', ingestLimiter, ingestEvent);

// Only Admins should manage the event pipeline
router.use(authenticate);
router.use(authorize(
  [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.ATTENDANCE_MANAGE]
));

// Process all pending events
router.post('/process-pending', processPendingEvents);

// Process a specific event manually
router.post('/process/:id', validateEventId, processEventManually);

// List raw events with filters
router.get('/', validateListQuery, listEvents);

// Get details of a specific raw event
router.get('/:id', validateEventId, getEventDetails);

export default router;

