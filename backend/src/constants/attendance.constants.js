/**
 * Attendance Constants
 *
 * Domain-specific constants for the Attendance Engine.
 */

export const PERSON_TYPES = Object.freeze({
  FACULTY: 'FACULTY',
});

export const PERSON_TYPES_VALUES = Object.freeze(Object.values(PERSON_TYPES));

export const VERIFICATION_METHODS = Object.freeze({
  FINGERPRINT:      'FINGERPRINT',
  FACE_RECOGNITION: 'FACE_RECOGNITION',
  HYBRID:           'HYBRID',
  MANUAL:           'MANUAL',
});

export const VERIFICATION_METHODS_VALUES = Object.freeze(Object.values(VERIFICATION_METHODS));

export const ATTENDANCE_TYPES = Object.freeze({
  CHECK_IN:  'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT',
});

export const ATTENDANCE_TYPES_VALUES = Object.freeze(Object.values(ATTENDANCE_TYPES));

export const ATTENDANCE_RECORD_STATUS = Object.freeze({
  PRESENT:   'PRESENT',
  LATE:      'LATE',
  EARLY_OUT: 'EARLY_OUT',
  ABSENT:    'ABSENT',
  MANUAL:    'MANUAL',
  CORRECTED: 'CORRECTED',
});

export const ATTENDANCE_RECORD_STATUS_VALUES = Object.freeze(Object.values(ATTENDANCE_RECORD_STATUS));

export const ATTENDANCE_SORT_FIELDS = Object.freeze([
  'attendanceCode',
  'timestamp',
  'attendanceDate',
  'attendanceTime',
  'status',
  'personType',
  'verificationMethod',
  'attendanceType',
  'createdAt',
  'updatedAt',
]);

export const ATTENDANCE_SORT_ORDERS = Object.freeze(['asc', 'desc']);

export const ATTENDANCE_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     500, // Slightly higher limit for bulk fetching attendance tables
});
