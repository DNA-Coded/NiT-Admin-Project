import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateReportFilters } from './reports.validator.js';
import {
  getAttendanceReport,
  getFacultyReport,
  getStudentReport,
  getDeviceReport,
  getSynchronizationReport,
} from './reports.controller.js';

const router = Router();

router.get('/attendance', authenticate, validateReportFilters, getAttendanceReport);
router.get('/faculty', authenticate, validateReportFilters, getFacultyReport);
router.get('/students', authenticate, validateReportFilters, getStudentReport);
router.get('/devices', authenticate, validateReportFilters, getDeviceReport);
router.get('/synchronization', authenticate, validateReportFilters, getSynchronizationReport);

export default router;
