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

/**
 * @swagger
 * /students:
 *   get:
 *     summary: List students
 *     description: Retrieve a paginated list of students.
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A paginated list of students
 */
router.get(
  '/',
  authenticate,
  validateListQuery,
  getAllStudents
);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 */
router.post(
  '/',
  authenticate,
  validateCreateStudent,
  createStudentHandler
);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student record by ID
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 */
router.get(
  '/:id',
  authenticate,
  validateObjectId,
  getStudentHandler
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId,
  validateUpdateStudent,
  updateStudentHandler
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Soft-delete a student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student deactivated successfully
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId,
  deleteStudentHandler
);

/**
 * @swagger
 * /students/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student restored successfully
 */
router.patch(
  '/:id/restore',
  authenticate,
  validateObjectId,
  restoreStudentHandler
);

export default router;
