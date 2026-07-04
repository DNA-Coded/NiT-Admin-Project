import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateAttendance,
  validateUpdateAttendance,
  validateCorrectAttendance,
  validateObjectId,
} from './attendance.validator.js';
import {
  getAllAttendance,
  getAttendanceHandler,
  getAttendanceHistoryHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  restoreAttendanceHandler,
  correctAttendanceHandler,
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

router.get(
  '/:id/history',
  authenticate,
  validateObjectId,
  getAttendanceHistoryHandler
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

router.patch(
  '/:id/correct',
  authenticate,
  validateObjectId,
  validateCorrectAttendance,
  correctAttendanceHandler
);

export default router;
