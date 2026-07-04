/**
 * API Route Index — v1
 *
 * This is the single aggregation point for all versioned API routes.
 * All routes registered here are automatically prefixed with `/api/v1`
 * by app.js.
 *
 * ─── ADDING NEW FEATURE ROUTES ───────────────────────────────────────────────
 * 1. Create the feature router at `src/routes/<feature>.routes.js`
 * 2. Import it below and mount it with `router.use('/<feature>', featureRoutes)`
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { Router } from 'express';
import healthRoutes     from '../modules/health/health.routes.js';
import authRoutes       from '../modules/auth/auth.routes.js';
import departmentRoutes from '../modules/departments/departments.routes.js';
import facultyRoutes    from '../modules/faculty/faculty.routes.js';
import studentRoutes    from '../modules/students/student.routes.js';
import deviceRoutes     from '../modules/devices/device.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';

// Future routes — import and mount here as each module is built:
// import attendanceRoutes from './attendance.routes.js';
// import deviceRoutes     from './device.routes.js';
// import payrollRoutes    from './payroll.routes.js';
// import reportRoutes     from './report.routes.js';
// import settingsRoutes   from './settings.routes.js';

const router = Router();

router.use('/health',      healthRoutes);
router.use('/auth',        authRoutes);
router.use('/departments', departmentRoutes);
router.use('/faculty',     facultyRoutes);
router.use('/students',    studentRoutes);
router.use('/devices',     deviceRoutes);
router.use('/attendance',  attendanceRoutes);

// Future mounts:
// router.use('/attendance', attendanceRoutes);
// router.use('/devices',    deviceRoutes);
// router.use('/payroll',    payrollRoutes);
// router.use('/reports',    reportRoutes);
// router.use('/settings',   settingsRoutes);

export default router;
