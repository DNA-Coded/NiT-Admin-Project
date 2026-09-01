/**
 * Employee Constants
 *
 * Domain-specific constants for the Employee module.
 * Centralised here so validators, services, and models all
 * reference the same source of truth — no magic strings.
 */

/**
 * Allowed designations for employee members.
 * The validator and model both reference this list — add new designations here
 * and they will be automatically enforced everywhere.
 */
export const EMPLOYEE_DESIGNATIONS = [
  // Teaching
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Assistant Professor Dpty. (COE)',
  'Professor & COE',
  'Assistant Professor Asst. COE',
  'Assistant Professor (Training)',
  
  // Technical
  'Sr. Tech. Asst.',
  'Jr. Tech. Asst.',
  'Tech. Asst.',
  'Lab Attendant',
  'System Admin',
  
  // Administrative & Operations
  'Principal',
  'Registrar',
  'Site Supervisor',
  'Site Engineer',
  'Site Intern',
  'Assistant to Library',
  'Library Assistant',
  'Library-Assistant',
  'Jr. Office Assistant',
  'Office Assistant (Exam cell)',
  'Office Assistant (T & P)',
  'Office Executive',
  'Front Office Executive',
  'Store In-charge',
  'Executive Administration',
  'Executive in Accounts Department',
  'Executive- Accounts',
  'Accounts - Executive',
  'Training & Placement Officer',
  'Executive-Marketing & Business Development',
  'HR Executive',           
  'Head - Talent Transformation',
  'Telecaller cum Admission Assistant'
];

/**
 * Employee operational status values.
 *
 *   ACTIVE    — Currently teaching / on duty
 *   ON_LEAVE  — Temporarily absent (medical, maternity, sabbatical, etc.)
 *   RETIRED   — No longer employed; record kept for historical attendance
 *   SUSPENDED — Administratively suspended pending inquiry
 *
 * Note: `isActive` (boolean) handles soft-delete independently.
 *       A employee member can be ON_LEAVE and still have isActive: true (record visible).
 *       Soft-delete (isActive: false) hides the record from default listings entirely.
 */
export const EMPLOYEE_STATUS = Object.freeze({
  ACTIVE:    'ACTIVE',
  ON_LEAVE:  'ON_LEAVE',
  RETIRED:   'RETIRED',
  SUSPENDED: 'SUSPENDED',
});

/** Array form of EMPLOYEE_STATUS values — used by validators and schema enum. */
export const EMPLOYEE_STATUS_VALUES = Object.freeze(Object.values(EMPLOYEE_STATUS));

/**
 * Allowable column names for the `sortBy` query parameter.
 */
export const EMPLOYEE_SORT_FIELDS = Object.freeze([
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
export const EMPLOYEE_SORT_ORDERS = Object.freeze(['asc', 'desc']);

/**
 * Pagination defaults and hard limits for GET /employee.
 */
export const EMPLOYEE_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
