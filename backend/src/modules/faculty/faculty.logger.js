/**
 * Faculty Logger Utility
 *
 * Single source of truth for all faculty-related log events.
 * Every emitted entry follows a consistent, machine-readable JSON shape:
 *
 *   {
 *     "level":              "info" | "warn" | "error",
 *     "message":            "EVENT_NAME",          ← SCREAMING_SNAKE_CASE event key
 *     "facultyEvent":       true,                  ← enables log-aggregator filtering
 *     "outcome":            "success" | "failure",
 *     "reason":             "...",                 ← failure reason (omitted on success)
 *     "facultyId":          "...",                 ← MongoDB _id when known
 *     "employeeId":         "...",                 ← institution employee ID when known
 *     "fullName":           "...",                 ← firstName + lastName when known
 *     "adminEmail":         "...",                 ← acting admin's email
 *     "method":             "POST",
 *     "path":               "/api/v1/faculty",
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
 * Internal — emit a structured faculty event through Winston.
 * @param {'info'|'warn'|'error'} level
 * @param {string} event   - SCREAMING_SNAKE_CASE event key
 * @param {object} [meta]  - Contextual fields to attach
 */
const emit = (level, event, meta = {}) => {
  logger[level](event, { facultyEvent: true, ...meta });
};

// ─── List / Detail events ─────────────────────────────────────────────────────

/**
 * Faculty list fetched successfully.
 * @param {{ total: number, page: number }} queryMeta
 * @param {object} [requestMeta]
 */
export const logFacultyListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'FACULTY_LIST_FETCHED', {
    outcome: 'success',
    total,
    page,
    ...requestMeta,
  });

/**
 * Single faculty record fetched successfully.
 * @param {string} facultyId
 * @param {object} [requestMeta]
 */
export const logFacultyFetched = (facultyId, requestMeta = {}) =>
  emit('info', 'FACULTY_FETCHED', {
    outcome: 'success',
    facultyId,
    ...requestMeta,
  });

// ─── Mutation events ──────────────────────────────────────────────────────────

/**
 * New faculty record created.
 * @param {{ id: string, employeeId: string, fullName: string }} faculty
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logFacultyCreated = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'FACULTY_CREATED', {
    outcome:    'success',
    facultyId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Faculty record updated.
 * @param {{ id: string, employeeId: string, fullName: string }} faculty
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logFacultyUpdated = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'FACULTY_UPDATED', {
    outcome:    'success',
    facultyId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Faculty record soft-deleted (deactivated).
 * @param {{ id: string, employeeId: string, fullName: string }} faculty
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logFacultyDeleted = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('warn', 'FACULTY_DELETED', {
    outcome:    'success',
    facultyId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

/**
 * Soft-deleted faculty record restored to active.
 * @param {{ id: string, employeeId: string, fullName: string }} faculty
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logFacultyRestored = ({ id, employeeId, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'FACULTY_RESTORED', {
    outcome:    'success',
    facultyId:  id,
    employeeId,
    fullName,
    adminEmail,
    ...requestMeta,
  });

// ─── Failure events ───────────────────────────────────────────────────────────

/**
 * Faculty lookup by ID returned no result.
 * @param {string} facultyId
 * @param {object} [requestMeta]
 */
export const logFacultyNotFound = (facultyId, requestMeta = {}) =>
  emit('warn', 'FACULTY_NOT_FOUND', {
    outcome:   'failure',
    reason:    'faculty_not_found',
    facultyId,
    ...requestMeta,
  });

/**
 * Conflict on a unique field (employeeId, email, attendanceIdentity).
 * @param {{ field: string, value: string }} conflict
 * @param {object} [requestMeta]
 */
export const logFacultyConflict = ({ field, value }, requestMeta = {}) =>
  emit('warn', 'FACULTY_CONFLICT', {
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
export const logFacultyDeptNotFound = (departmentId, requestMeta = {}) =>
  emit('warn', 'FACULTY_DEPT_NOT_FOUND', {
    outcome:      'failure',
    reason:       'referenced_department_not_found',
    departmentId,
    ...requestMeta,
  });
