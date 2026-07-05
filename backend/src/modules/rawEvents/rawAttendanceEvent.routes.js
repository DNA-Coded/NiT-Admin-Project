import { Router } from 'express';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { ROLES, PERMISSIONS } from '../../constants/index.js';
import {
  listEvents,
  getEventDetails,
  processEventManually,
  processPendingEvents
} from './rawAttendanceEvent.controller.js';
import {
  validateListQuery,
  validateEventId,
} from './rawAttendanceEvent.validator.js';

const router = Router();

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
