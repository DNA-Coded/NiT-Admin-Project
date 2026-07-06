/**
 * Dashboard Logger Utility
 */
import logger from '../../config/logger.config.js';

const emit = (level, event, meta = {}) => {
  logger[level](event, { dashboardEvent: true, ...meta });
};

export const logDashboardViewed = (adminEmail, requestMeta = {}) =>
  emit('info', 'DASHBOARD_OVERVIEW_REQUESTED', { adminEmail, ...requestMeta });

export const logLiveAttendanceRequested = (adminEmail, requestMeta = {}) =>
  emit('info', 'LIVE_ATTENDANCE_REQUESTED', { adminEmail, ...requestMeta });

export const logDeviceStatusRequested = (adminEmail, requestMeta = {}) =>
  emit('info', 'DEVICE_STATUS_REQUESTED', { adminEmail, ...requestMeta });
