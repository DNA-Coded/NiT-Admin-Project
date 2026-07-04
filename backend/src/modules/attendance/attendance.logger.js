/**
 * Attendance Logger Utility
 *
 * Single source of truth for all attendance-related log events.
 * Explicitly masks/omits attendanceIdentity to prevent biometric-adjacent data leaks.
 */

import logger from '../../config/logger.config.js';

const emit = (level, event, meta = {}) => {
  logger[level](event, { attendanceEvent: true, ...meta });
};

export const logAttendanceListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_LIST_FETCHED', { outcome: 'success', total, page, ...requestMeta });

export const logAttendanceFetched = (attendanceId, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_FETCHED', { outcome: 'success', attendanceId, ...requestMeta });

export const logAttendanceCreated = ({ id, attendanceCode, personId, deviceId }, adminEmail, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_CREATED', {
    outcome:        'success',
    attendanceId:   id,
    attendanceCode,
    personId,
    deviceId,
    adminEmail,
    ...requestMeta,
  });

export const logAttendanceUpdated = ({ id, attendanceCode }, adminEmail, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_UPDATED', {
    outcome:        'success',
    attendanceId:   id,
    attendanceCode,
    adminEmail,
    ...requestMeta,
  });

export const logAttendanceCorrected = ({ id, attendanceCode, oldStatus, newStatus }, adminEmail, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_CORRECTED', {
    outcome:        'success',
    attendanceId:   id,
    attendanceCode,
    oldStatus,
    newStatus,
    adminEmail,
    ...requestMeta,
  });

export const logAttendanceDeleted = ({ id, attendanceCode }, adminEmail, requestMeta = {}) =>
  emit('warn', 'ATTENDANCE_DELETED', {
    outcome:        'success',
    attendanceId:   id,
    attendanceCode,
    adminEmail,
    ...requestMeta,
  });

export const logAttendanceRestored = ({ id, attendanceCode }, adminEmail, requestMeta = {}) =>
  emit('info', 'ATTENDANCE_RESTORED', {
    outcome:        'success',
    attendanceId:   id,
    attendanceCode,
    adminEmail,
    ...requestMeta,
  });

export const logAttendanceNotFound = (attendanceId, requestMeta = {}) =>
  emit('warn', 'ATTENDANCE_NOT_FOUND', { outcome: 'failure', reason: 'attendance_not_found', attendanceId, ...requestMeta });

export const logAttendanceConflict = (attendanceCode, requestMeta = {}) =>
  emit('warn', 'ATTENDANCE_CONFLICT', { outcome: 'failure', reason: 'duplicate_attendance_code', attendanceCode, ...requestMeta });
