/**
 * Faculty Constants
 *
 * Domain-specific constants for the Faculty module.
 * Centralised here so validators, services, and models all
 * reference the same source of truth — no magic strings.
 */

/**
 * Allowed designations for faculty members.
 * The validator and model both reference this list — add new designations here
 * and they will be automatically enforced everywhere.
 */
export const FACULTY_DESIGNATIONS = Object.freeze([
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Lab Instructor',
  'Lab Assistant',
  'Teaching Assistant',
  'Visiting Faculty',
  'Adjunct Faculty',
  'Head of Department',
  'Dean',
  'Director',
  'Other',
]);

/**
 * Faculty operational status values.
 *
 *   ACTIVE    — Currently teaching / on duty
 *   ON_LEAVE  — Temporarily absent (medical, maternity, sabbatical, etc.)
 *   RETIRED   — No longer employed; record kept for historical attendance
 *   SUSPENDED — Administratively suspended pending inquiry
 *
 * Note: `isActive` (boolean) handles soft-delete independently.
 *       A faculty member can be ON_LEAVE and still have isActive: true (record visible).
 *       Soft-delete (isActive: false) hides the record from default listings entirely.
 */
export const FACULTY_STATUS = Object.freeze({
  ACTIVE:    'ACTIVE',
  ON_LEAVE:  'ON_LEAVE',
  RETIRED:   'RETIRED',
  SUSPENDED: 'SUSPENDED',
});

/** Array form of FACULTY_STATUS values — used by validators and schema enum. */
export const FACULTY_STATUS_VALUES = Object.freeze(Object.values(FACULTY_STATUS));

/**
 * Allowable column names for the `sortBy` query parameter.
 */
export const FACULTY_SORT_FIELDS = Object.freeze([
  'firstName',
  'lastName',
  'employeeId',
  'designation',
  'joiningDate',
  'createdAt',
  'updatedAt',
]);

/**
 * Allowable sort direction values for the `sortOrder` query parameter.
 */
export const FACULTY_SORT_ORDERS = Object.freeze(['asc', 'desc']);

/**
 * Pagination defaults and hard limits for GET /faculty.
 */
export const FACULTY_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
