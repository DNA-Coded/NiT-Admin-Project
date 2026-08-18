/**
 * Employee Logger Utility
 *
 * Single source of truth for all employee-related log events.
 * Every emitted entry follows a consistent, machine-readable JSON shape:
 *
 *   {
 *     "level":              "info" | "warn" | "error",
 *     "message":            "EVENT_NAME",          ← SCREAMING_SNAKE_CASE event key
 *     "employeeEvent":       true,                  ← enables log-aggregator filtering
 *     "outcome":            "success" | "failure",
 *     "reason":             "...",                 ← failure reason (omitted on success)
 *     "employeeId":          "...",                 ← MongoDB _id when known
 *     "employeeId":         "...",                 ← institution employee ID when known
 *     "fullName":           "...",                 ← firstName + lastName when known
 *     "adminEmail":         "...",                 ← acting admin's email
 *     "method":             "POST",
 *     "path":               "/api/v1/employee",
 *     "ip":                 "...",
 *     "userAgent":          "...",
 *     "service":            "nit-admin-backend",   ← injected by Winston defaultMeta
 *     "timestamp":          "..."                  ← injected by Winston transport
 *   }
 *
 * Rules:
 *   ✗  Never log full request bodies
 *   ✗  Never log attendanceIdentity values in plaintext
 *   ✓  Log only the fields explicitly listed above
 */

import logger from '../../config/logger.config.js';

// ─── Core emitter ─────────────────────────────────────────────────────────────

/**
 * Internal — emit a structured employee event through Winston.
 * @param {'info'|'warn'|'error'} level
 * @param {string} event   - SCREAMING_SNAKE_CASE event key
 * @param {object} [meta]  - Contextual fields to attach
 */
const emit = (level, event, meta = {}) => {
  logger[level](event, { employeeEvent: true, ...meta });
};

// ─── List / Detail events ─────────────────────────────────────────────────────

/**
 * Employee list fetched successfully.
 * @param {{ total: number, page: number }} queryMeta
 * @param {object} [requestMeta]
 */
export const logEmployeeListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'EMPLOYEE_LIST_FETCHED', {
    outcome: 'success',
    total,
    page,
    ...requestMeta,
  });

/**
 * Single employee record fetched successfully.
 * @param {string} employeeId
 * @param {object} [requestMeta]
 */
export const logEmployeeFetched = (employeeId, requestMeta = {}) =>
  emit('info', 'EMPLOYEE_FETCHED', {
    outcome: 'success',
    employeeId,
    ...requestMeta,
  });

// ─── Mutation events ──────────────────────────────────────────────────────────

/**
 * New employee record created.
 * @param {{ id: string, employeeId: string, fullName: string }} employee
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logEmployeeCreated = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'EMPLOYEE_CREATED', {
    outcome:    'success',
    employeeId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Employee record updated.
 * @param {{ id: string, employeeId: string, fullName: string }} employee
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logEmployeeUpdated = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'EMPLOYEE_UPDATED', {
    outcome:    'success',
    employeeId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Employee record soft-deleted (deactivated).
 * @param {{ id: string, employeeId: string, fullName: string }} employee
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logEmployeeDeleted = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('warn', 'EMPLOYEE_DELETED', {
    outcome:    'success',
    employeeId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Soft-deleted employee record restored to active.
 * @param {{ id: string, employeeId: string, fullName: string }} employee
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logEmployeeRestored = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'EMPLOYEE_RESTORED', {
    outcome:    'success',
    employeeId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

// ─── Failure events ───────────────────────────────────────────────────────────

/**
 * Employee lookup by ID returned no result.
 * @param {string} employeeId
 * @param {object} [requestMeta]
 */
export const logEmployeeNotFound = (employeeId, requestMeta = {}) =>
  emit('warn', 'EMPLOYEE_NOT_FOUND', {
    outcome:   'failure',
    reason:    'employee_not_found',
    employeeId,
    ...requestMeta,
  });

/**
 * Conflict on a unique field (employeeId, email, attendanceIdentity).
 * @param {{ field: string, value: string }} conflict
 * @param {object} [requestMeta]
 */
export const logEmployeeConflict = ({ field, value }, requestMeta = {}) =>
  emit('warn', 'EMPLOYEE_CONFLICT', {
    outcome: 'failure',
    reason:  `duplicate_${field}`,
    field,
    value,
    ...requestMeta,
  });

/**
 * The referenced Department does not exist or is inactive.
 * @param {string} departmentId
 * @param {object} [requestMeta]
 */
export const logEmployeeDeptNotFound = (departmentId, requestMeta = {}) =>
  emit('warn', 'EMPLOYEE_DEPT_NOT_FOUND', {
    outcome:      'failure',
    reason:       'referenced_department_not_found',
    departmentId,
    ...requestMeta,
  });
