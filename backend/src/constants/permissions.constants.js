/**
 * Permissions Constants
 *
 * Maps roles to the set of actions they are authorized to perform.
 * Enforcement middleware lives in `src/modules/auth/auth.middleware.js`.
 *
 * Action naming convention: `resource:action`
 */
export const PERMISSIONS = Object.freeze({
  // Employee resource
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_UPDATE: 'employee:update',

  // Attendance resource
  ATTENDANCE_READ: 'attendance:read',

  // Reports resource
  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate',

  // Devices resource
  DEVICES_READ: 'devices:read',
  DEVICES_PING: 'devices:ping',

  // Payroll resource
  PAYROLL_READ: 'payroll:read',
  PAYROLL_EXPORT: 'payroll:export',

  // Settings resource
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',

  // System-level
  SYSTEM_ADMIN: 'system:admin',
});

/**
 * Role → Permissions mapping.
 * Used by the RBAC middleware in `src/modules/auth/auth.middleware.js`.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.DEVICES_READ,
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_EXPORT,
    PERMISSIONS.SETTINGS_READ,
  ],
  hod: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.REPORTS_READ,
  ],
  faculty: [
    PERMISSIONS.ATTENDANCE_READ,
  ],
});
