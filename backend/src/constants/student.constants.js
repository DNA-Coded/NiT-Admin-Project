/**
 * Student Constants
 *
 * Domain-specific constants for the Student module.
 * Centralised here so validators, services, and models all
 * reference the same source of truth.
 */

/**
 * Student operational status values.
 */
export const STUDENT_STATUS = Object.freeze({
  ACTIVE:    'ACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
  DROPPED:   'DROPPED',
  ALUMNI:    'ALUMNI',
});

/** Array form of STUDENT_STATUS values — used by validators and schema enum. */
export const STUDENT_STATUS_VALUES = Object.freeze(Object.values(STUDENT_STATUS));

/**
 * Standard 8 semesters for an engineering degree.
 */
export const SEMESTERS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);

/**
 * Allowable column names for the `sortBy` query parameter.
 */
export const STUDENT_SORT_FIELDS = Object.freeze([
  'firstName',
  'lastName',
  'rollNumber',
  'registrationNumber',
  'semester',
  'createdAt',
  'updatedAt',
]);

/**
 * Allowable sort direction values for the `sortOrder` query parameter.
 */
export const STUDENT_SORT_ORDERS = Object.freeze(['asc', 'desc']);

/**
 * Pagination defaults and hard limits for GET /students.
 */
export const STUDENT_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
