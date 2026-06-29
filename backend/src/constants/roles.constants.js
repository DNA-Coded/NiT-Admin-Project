/**
 * Roles Constants
 *
 * Defines the administrative roles available in the NiT Admin system.
 * These roles control access to different sections and actions via the
 * role-based authorization middleware in `src/modules/auth/auth.middleware.js`.
 */
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin', // Full system access — IT/system administrator
  ADMIN: 'admin',             // HR admin — manage employees, attendance, payroll
  HOD: 'hod',                 // Head of Department — view and manage own dept only
  FACULTY: 'faculty',         // Faculty member — read-only access to own records
});
