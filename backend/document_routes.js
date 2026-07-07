import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseSrc = path.join(__dirname, 'src');

const replacements = [
  {
    file: 'modules/faculty/faculty.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/faculty[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty:
 *   get:
 *     summary: List faculty
 *     description: Retrieve a paginated list of faculty members.
 *     tags: [Faculty]
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
 *         description: A paginated list of faculty
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/faculty[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty:
 *   post:
 *     summary: Create a new faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       201:
 *         description: Faculty created successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/faculty\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty/{id}:
 *   get:
 *     summary: Get a faculty record by ID
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PUT\s+\/api\/v1\/faculty\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty/{id}:
 *   put:
 *     summary: Update a faculty record
 *     tags: [Faculty]
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
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       200:
 *         description: Faculty updated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+DELETE\s+\/api\/v1\/faculty\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty/{id}:
 *   delete:
 *     summary: Soft-delete a faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty deactivated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PATCH\s+\/api\/v1\/faculty\/:id\/restore[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /faculty/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted faculty record
 *     tags: [Faculty]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Faculty restored successfully
 */`
      }
    ]
  },
  {
    file: 'modules/students/student.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/students[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /students:
 *   get:
 *     summary: List students
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
 *     responses:
 *       200:
 *         description: A paginated list of students
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/students[\s\S]*?\*\//,
        replace: `/**
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
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/students\/:id[\s\S]*?\*\//,
        replace: `/**
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
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PUT\s+\/api\/v1\/students\/:id[\s\S]*?\*\//,
        replace: `/**
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
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+DELETE\s+\/api\/v1\/students\/:id[\s\S]*?\*\//,
        replace: `/**
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
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PATCH\s+\/api\/v1\/students\/:id\/restore[\s\S]*?\*\//,
        replace: `/**
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
 */`
      }
    ]
  },
  {
    file: 'modules/devices/device.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/devices[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices:
 *   get:
 *     summary: List devices
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: A paginated list of devices
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/devices[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Device created successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/devices\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Get a device by ID
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PUT\s+\/api\/v1\/devices\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Update a device
 *     tags: [Devices]
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
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: Device updated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PATCH\s+\/api\/v1\/devices\/:id\/status[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices/{id}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Devices]
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
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+DELETE\s+\/api\/v1\/devices\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Soft-delete a device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device deactivated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PATCH\s+\/api\/v1\/devices\/:id\/restore[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /devices/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted device
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device restored successfully
 */`
      }
    ]
  },
  {
    file: 'modules/attendance/attendance.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/attendance[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: List attendance records
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: A paginated list of attendance records
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/attendance[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create a new attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/attendance\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get an attendance record by ID
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PUT\s+\/api\/v1\/attendance\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update an attendance record
 *     tags: [Attendance]
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
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+DELETE\s+\/api\/v1\/attendance\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Soft-delete an attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record deactivated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+PATCH\s+\/api\/v1\/attendance\/:id\/restore[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /attendance/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendance record restored successfully
 */`
      }
    ]
  },
  {
    file: 'modules/dashboard/dashboard.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/dashboard\/overview[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview metrics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overview metrics retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/dashboard\/live-attendance[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /dashboard/live-attendance:
 *   get:
 *     summary: Get live attendance logs
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Live attendance logs retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/dashboard\/device-status[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /dashboard/device-status:
 *   get:
 *     summary: Get live device status
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Device status retrieved successfully
 */`
      }
    ]
  },
  {
    file: 'modules/reports/reports.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/reports\/attendance[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /reports/attendance:
 *   get:
 *     summary: Generate attendance report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance report generated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/reports\/faculty[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /reports/faculty:
 *   get:
 *     summary: Generate faculty report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Faculty report generated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/reports\/student[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /reports/student:
 *   get:
 *     summary: Generate student report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student report generated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/reports\/device[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /reports/device:
 *   get:
 *     summary: Generate device report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Device report generated successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/reports\/synchronization[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /reports/synchronization:
 *   get:
 *     summary: Generate sync report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sync report generated successfully
 */`
      }
    ]
  },
  {
    file: 'modules/exports/exports.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/exports\/history[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /exports/history:
 *   get:
 *     summary: List export history
 *     tags: [Exports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of export history
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/exports\/generate[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /exports/generate:
 *   post:
 *     summary: Generate a new export (PDF/Excel)
 *     tags: [Exports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType: { type: string }
 *               format: { type: string }
 *     responses:
 *       200:
 *         description: Export generated successfully
 */`
      }
    ]
  },
  {
    file: 'modules/activity/activity.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/activity[\s\S]*?\*\//,
        replace: `/**
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
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/activity\/:id[\s\S]*?\*\//,
        replace: `/**
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
 */`
      }
    ]
  },
  {
    file: 'modules/settings/settings.routes.js',
    replaces: [
      {
        find: /router\.get\('\/',\s*getSettings\);/,
        replace: `/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 */\nrouter.get('/', getSettings);`
      },
      {
        find: /router\.put\('\/',\s*updateSettings\);/,
        replace: `/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update system settings
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */\nrouter.put('/', updateSettings);`
      },
      {
        find: /router\.post\('\/reset',\s*resetSettings\);/,
        replace: `/**
 * @swagger
 * /settings/reset:
 *   post:
 *     summary: Reset settings to defaults
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings reset successfully
 */\nrouter.post('/reset', resetSettings);`
      }
    ]
  },
  {
    file: 'integrations/health/health.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/health\/devices[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /health/devices:
 *   get:
 *     summary: List device health statuses
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of device health statuses
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/health\/devices\/:deviceId[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /health/devices/{deviceId}:
 *   get:
 *     summary: Get health details for a specific device
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device health details retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/health\/devices\/:deviceId\/heartbeat[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /health/devices/{deviceId}/heartbeat:
 *   post:
 *     summary: Record a device heartbeat
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Heartbeat recorded successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/health\/devices\/:deviceId\/error[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /health/devices/{deviceId}/error:
 *   post:
 *     summary: Record a device error
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errorType: { type: string }
 *               errorMessage: { type: string }
 *     responses:
 *       200:
 *         description: Error recorded successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/health\/devices\/:deviceId\/reset[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /health/devices/{deviceId}/reset:
 *   post:
 *     summary: Reset health metrics for a device
 *     tags: [Health]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Health metrics reset successfully
 */`
      }
    ]
  },
  {
    file: 'integrations/sync/sync.routes.js',
    replaces: [
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/sync\/history[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /sync/history:
 *   get:
 *     summary: List sync history
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of sync history
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+GET\s+\/api\/v1\/sync\/history\/:id[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /sync/history/{id}:
 *   get:
 *     summary: Get sync details by ID
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sync details retrieved successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/sync\/device\/:deviceId[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /sync/device/{deviceId}:
 *   post:
 *     summary: Trigger sync for a specific device
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       202:
 *         description: Sync job started successfully
 */`
      },
      {
        find: /\/\*\*[\s\S]*?@route\s+POST\s+\/api\/v1\/sync\/device\/:deviceId\/retry[\s\S]*?\*\//,
        replace: `/**
 * @swagger
 * /sync/device/{deviceId}/retry:
 *   post:
 *     summary: Retry a failed sync for a device
 *     tags: [Synchronization]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       202:
 *         description: Sync job retry started successfully
 */`
      }
    ]
  }
];

replacements.forEach(rep => {
  const fullPath = path.join(baseSrc, rep.file);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found: ' + fullPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  rep.replaces.forEach(r => {
    content = content.replace(r.find, r.replace);
  });
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + rep.file);
  } else {
    console.log('No changes made to ' + rep.file);
  }
});
