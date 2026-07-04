import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateAttendance,
  validateUpdateAttendance,
  validateObjectId,
} from './attendance.validator.js';
import {
  getAllAttendance,
  getAttendanceHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  restoreAttendanceHandler,
} from './attendance.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllAttendance
);

router.post(
  '/',
  authenticate,
  validateCreateAttendance,
  createAttendanceHandler
);

router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getAttendanceHandler
);

router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateAttendance,
  updateAttendanceHandler
);

router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteAttendanceHandler
);

router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreAttendanceHandler
);

export default router;
