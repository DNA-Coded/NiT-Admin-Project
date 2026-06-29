/**
 * Attendance Constants
 *
 * Defines all possible status values and punch types for the attendance system.
 * These are used across models, controllers, and services to avoid magic strings.
 */

/**
 * Daily attendance status of an employee.
 */
export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'present',       // Arrived on time
  ABSENT: 'absent',         // No biometric record for the day
  LATE: 'late',             // Arrived after the configured grace period
  HALF_DAY: 'half_day',     // Left before minimum hours threshold
  ON_LEAVE: 'on_leave',     // Covered by an approved leave request
  HOLIDAY: 'holiday',       // Institutional holiday — no attendance required
  WEEKEND: 'weekend',       // Non-working day
});

/**
 * Biometric punch direction recorded by the device.
 */
export const PUNCH_TYPE = Object.freeze({
  IN: 'in',    // Entry punch
  OUT: 'out',  // Exit punch
});

/**
 * Leave types that may be applied to an attendance record.
 */
export const LEAVE_TYPE = Object.freeze({
  CASUAL: 'casual',
  SICK: 'sick',
  EARNED: 'earned',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid',
});
