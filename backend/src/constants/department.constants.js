/**
 * Department Constants
 *
 * Domain-specific constants for the Department module.
 * Centralised here so validators, services, and models all
 * reference the same source of truth — no magic strings.
 */

/**
 * Allowable column names for the `sortBy` query parameter.
 * Any value outside this set is rejected by the list validator.
 */
export const DEPARTMENT_SORT_FIELDS = Object.freeze([
  'name',
  'code',
  'createdAt',
  'updatedAt',
]);

/**
 * Allowable sort direction values for the `sortOrder` query parameter.
 */
export const DEPARTMENT_SORT_ORDERS = Object.freeze(['asc', 'desc']);

/**
 * Pagination defaults and hard limits for GET /departments.
 */
export const DEPARTMENT_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
