/**
 * Student Logger Utility
 *
 * Single source of truth for all student-related log events.
 * Every emitted entry follows a consistent, machine-readable JSON shape.
 */

import logger from '../../config/logger.config.js';

// ─── Core emitter ─────────────────────────────────────────────────────────────

/**
 * Internal — emit a structured student event through Winston.
 * @param {'info'|'warn'|'error'} level
 * @param {string} event   - SCREAMING_SNAKE_CASE event key
 * @param {object} [meta]  - Contextual fields to attach
 */
const emit = (level, event, meta = {}) => {
  logger[level](event, { studentEvent: true, ...meta });
};

// ─── List / Detail events ─────────────────────────────────────────────────────

export const logStudentListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'STUDENT_LIST_FETCHED', { outcome: 'success', total, page, ...requestMeta });

export const logStudentFetched = (studentId, requestMeta = {}) =>
  emit('info', 'STUDENT_FETCHED', { outcome: 'success', studentId, ...requestMeta });

// ─── Mutation events ──────────────────────────────────────────────────────────

export const logStudentCreated = ({ id, rollNumber, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'STUDENT_CREATED', {
    outcome:    'success',
    studentId:  id,
    rollNumber,
    fullName,
    adminEmail,
    ...requestMeta,
  });

export const logStudentUpdated = ({ id, rollNumber, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'STUDENT_UPDATED', {
    outcome:    'success',
    studentId:  id,
    rollNumber,
    fullName,
    adminEmail,
    ...requestMeta,
  });

export const logStudentDeleted = ({ id, rollNumber, fullName }, adminEmail, requestMeta = {}) =>
  emit('warn', 'STUDENT_DELETED', {
    outcome:    'success',
    studentId:  id,
    rollNumber,
    fullName,
    adminEmail,
    ...requestMeta,
  });

export const logStudentRestored = ({ id, rollNumber, fullName }, adminEmail, requestMeta = {}) =>
  emit('info', 'STUDENT_RESTORED', {
    outcome:    'success',
    studentId:  id,
    rollNumber,
    fullName,
    adminEmail,
    ...requestMeta,
  });

// ─── Failure events ───────────────────────────────────────────────────────────

export const logStudentNotFound = (studentId, requestMeta = {}) =>
  emit('warn', 'STUDENT_NOT_FOUND', { outcome: 'failure', reason: 'student_not_found', studentId, ...requestMeta });

export const logStudentConflict = ({ field, value }, requestMeta = {}) =>
  emit('warn', 'STUDENT_CONFLICT', { outcome: 'failure', reason: `duplicate_${field}`, field, value, ...requestMeta });

export const logStudentDeptNotFound = (departmentId, requestMeta = {}) =>
  emit('warn', 'STUDENT_DEPT_NOT_FOUND', { outcome: 'failure', reason: 'referenced_department_not_found', departmentId, ...requestMeta });
