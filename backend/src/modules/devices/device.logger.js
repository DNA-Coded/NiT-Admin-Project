/**
 * Device Logger Utility
 *
 * Single source of truth for all device-related log events.
 * Network/hardware configurations can be logged, but passwords/keys
 * must be omitted if added to the schema in the future.
 */

import logger from '../../config/logger.config.js';

const emit = (level, event, meta = {}) => {
  logger[level](event, { deviceEvent: true, ...meta });
};

export const logDeviceListFetched = ({ total, page }, requestMeta = {}) =>
  emit('info', 'DEVICE_LIST_FETCHED', { outcome: 'success', total, page, ...requestMeta });

export const logDeviceFetched = (deviceId, requestMeta = {}) =>
  emit('info', 'DEVICE_FETCHED', { outcome: 'success', deviceId, ...requestMeta });

export const logDeviceCreated = ({ id, deviceCode, ipAddress }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_CREATED', {
    outcome:    'success',
    deviceId:   id,
    deviceCode,
    ipAddress,
    adminEmail,
    ...requestMeta,
  });

export const logDeviceUpdated = ({ id, deviceCode, ipAddress }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_UPDATED', {
    outcome:    'success',
    deviceId:   id,
    deviceCode,
    ipAddress,
    adminEmail,
    ...requestMeta,
  });

export const logDeviceAssignmentChanged = ({ id, deviceCode, oldDepartment, newDepartment }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_ASSIGNMENT_CHANGED', {
    outcome: 'success', deviceId: id, deviceCode, oldDepartment, newDepartment, adminEmail, ...requestMeta,
  });

export const logDeviceConfigUpdated = ({ id, deviceCode, connectionMode, heartbeatInterval }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_CONFIG_UPDATED', {
    outcome: 'success', deviceId: id, deviceCode, connectionMode, heartbeatInterval, adminEmail, ...requestMeta,
  });

export const logDeviceHeartbeatUpdated = ({ id, deviceCode }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_HEARTBEAT_UPDATED', {
    outcome: 'success', deviceId: id, deviceCode, adminEmail, ...requestMeta,
  });

export const logDeviceAttendanceToggled = ({ id, deviceCode, isAttendanceEnabled }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_ATTENDANCE_TOGGLED', {
    outcome: 'success', deviceId: id, deviceCode, isAttendanceEnabled, adminEmail, ...requestMeta,
  });

export const logDeviceDefaultChanged = ({ id, deviceCode, isDefaultDevice }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_DEFAULT_CHANGED', {
    outcome: 'success', deviceId: id, deviceCode, isDefaultDevice, adminEmail, ...requestMeta,
  });

export const logDeviceStatusChanged = ({ id, deviceCode, oldStatus, newStatus }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_STATUS_CHANGED', {
    outcome:    'success',
    deviceId:   id,
    deviceCode,
    oldStatus,
    newStatus,
    adminEmail,
    ...requestMeta,
  });

export const logDeviceDeleted = ({ id, deviceCode }, adminEmail, requestMeta = {}) =>
  emit('warn', 'DEVICE_DELETED', {
    outcome:    'success',
    deviceId:   id,
    deviceCode,
    adminEmail,
    ...requestMeta,
  });

export const logDeviceRestored = ({ id, deviceCode }, adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_RESTORED', {
    outcome:    'success',
    deviceId:   id,
    deviceCode,
    adminEmail,
    ...requestMeta,
  });

export const logDeviceNotFound = (deviceId, requestMeta = {}) =>
  emit('warn', 'DEVICE_NOT_FOUND', { outcome: 'failure', reason: 'device_not_found', deviceId, ...requestMeta });

export const logDeviceConflict = ({ field, value }, requestMeta = {}) =>
  emit('warn', 'DEVICE_CONFLICT', { outcome: 'failure', reason: `duplicate_${field}`, field, value, ...requestMeta });
