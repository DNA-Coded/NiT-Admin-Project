import logger from '../../config/logger.config.js';

const emit = (level, event, meta = {}) => {
  logger[level](event, { exportEvent: true, ...meta });
};

export const logExportRequested = (adminEmail, reportType, format, requestMeta = {}) =>
  emit('info', 'EXPORT_REQUESTED', { adminEmail, reportType, format, ...requestMeta });

export const logExportGenerated = (adminEmail, reportType, format, metrics = {}) =>
  emit('info', 'EXPORT_GENERATED', { adminEmail, reportType, format, ...metrics });

export const logExportFailed = (adminEmail, reportType, format, error = {}) =>
  emit('error', 'EXPORT_FAILED', { adminEmail, reportType, format, error });

export const logExportHistoryCreated = (exportId) =>
  emit('info', 'EXPORT_HISTORY_CREATED', { exportId });
