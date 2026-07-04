/**
 * Department Logger Utility
 *
 * Single source of truth for all department-related log events.
 * Every emitted entry follows a consistent, machine-readable JSON shape:
 *
 *   {
 *     "level":        "info" | "warn" | "error",
 *     "message":      "EVENT_NAME",           ← SCREAMING_SNAKE_CASE event key
 *     "deptEvent":    true,                   ← enables log-aggregator filtering
 *     "outcome":      "success" | "failure",
 *     "reason":       "...",                  ← failure reason (omitted on success)
 *     "departmentId": "...",                  ← MongoDB _id when known
 *     "name":         "...",                  ← department name when relevant
 *     "code":         "...",                  ← department code when relevant
 *     "adminEmail":   "...",                  ← acting admin's email
 *     "method":       "POST",                 ← HTTP verb
 *     "path":         "/api/v1/departments",
 *     "ip":           "...",
 *     "userAgent":    "...",
 *     "service":      "nit-admin-backend",    ← injected by Winston defaultMeta
 *     "timestamp":    "..."                   ← injected by Winston transport
 *   }
 *
 * Rules enforced here:
 *   ✗  Never log full request bodies
 *   ✓  Log only the fields explicitly listed above
 */

import logger from '../../config/logger.config.js';

// ─── Core emitter ─────────────────────────────────────────────────────────────

/**
 * Internal — emit a structured department event through Winston.
 * All public log functions in this module call this.
 *
 * @param {'info'|'warn'|'error'} level
 * @param {string} event   - Short event identifier (SCREAMING_SNAKE_CASE)
 * @param {object} [meta]  - Contextual fields to attach
 */
const emit = (level, event, meta = {}) => {
  logger[level](event, { deptEvent: true, ...meta });
};

// ─── List / Detail events ─────────────────────────────────────────────────────

/**
 * Department list fetched successfully.
 * @param {{ total: number, page: number }} queryMeta
 * @param {object} [requestMeta]
 */
export const logDepartmentListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'DEPARTMENT_LIST_FETCHED', {
    outcome: 'success',
    total,
    page,
    ...requestMeta,
  });

/**
 * Single department fetched successfully.
 * @param {string} departmentId
 * @param {object} [requestMeta]
 */
export const logDepartmentFetched = (departmentId, requestMeta = {}) =>
  emit('info', 'DEPARTMENT_FETCHED', {
    outcome: 'success',
    departmentId,
    ...requestMeta,
  });

// ─── Mutation events ──────────────────────────────────────────────────────────

/**
 * New department created.
 * @param {{ id: string, name: string, code: string }} dept
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logDepartmentCreated = ({ id, name, code }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEPARTMENT_CREATED', {
    outcome:      'success',
    departmentId: id,
    name,
    code,
    adminEmail,
    ...requestMeta,
  });

/**
 * Department updated.
 * @param {{ id: string, name: string, code: string }} dept
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logDepartmentUpdated = ({ id, name, code }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEPARTMENT_UPDATED', {
    outcome:      'success',
    departmentId: id,
    name,
    code,
    adminEmail,
    ...requestMeta,
  });

/**
 * Department soft-deleted (deactivated).
 * @param {{ id: string, name: string, code: string }} dept
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logDepartmentDeleted = ({ id, name, code }, adminEmail, requestMeta = {}) =>
  emit('warn', 'DEPARTMENT_DELETED', {
    outcome:      'success',
    departmentId: id,
    name,
    code,
    adminEmail,
    ...requestMeta,
  });

/**
 * Soft-deleted department restored to active.
 * @param {{ id: string, name: string, code: string }} dept
 * @param {string} adminEmail
 * @param {object} [requestMeta]
 */
export const logDepartmentRestored = ({ id, name, code }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEPARTMENT_RESTORED', {
    outcome:      'success',
    departmentId: id,
    name,
    code,
    adminEmail,
    ...requestMeta,
  });

// ─── Failure events ───────────────────────────────────────────────────────────

/**
 * Department lookup by ID returned no result.
 * @param {string} departmentId
 * @param {object} [requestMeta]
 */
export const logDepartmentNotFound = (departmentId, requestMeta = {}) =>
  emit('warn', 'DEPARTMENT_NOT_FOUND', {
    outcome:      'failure',
    reason:       'department_not_found',
    departmentId,
    ...requestMeta,
  });

/**
 * Duplicate name or code conflict on create / update.
 * @param {{ field: string, value: string }} conflict  - Which field conflicted and with what value
 * @param {object} [requestMeta]
 */
export const logDepartmentConflict = ({ field, value }, requestMeta = {}) =>
  emit('warn', 'DEPARTMENT_CONFLICT', {
    outcome: 'failure',
    reason:  `duplicate_${field}`,
    field,
    value,
    ...requestMeta,
  });
