import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import {
  validateListQuery,
  validateCreateStudent,
  validateUpdateStudent,
  validateObjectId,
} from './student.validator.js';
import {
  getAllStudents,
  getStudentHandler,
  createStudentHandler,
  updateStudentHandler,
  deleteStudentHandler,
  restoreStudentHandler,
} from './student.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllStudents
);

router.post(
  '/',
  authenticate,
  validateCreateStudent,
  createStudentHandler
);

router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getStudentHandler
);

router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateStudent,
  updateStudentHandler
);

router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteStudentHandler
);

router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreStudentHandler
);

export default router;
