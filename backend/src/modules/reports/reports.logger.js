import logger from '../../config/logger.config.js';

const emit = (level, event, meta = {}) => {
  logger[level](event, { reportEvent: true, ...meta });
};

export const logReportRequested = (adminEmail, reportType, filters = {}, requestMeta = {}) =>
  emit('info', 'REPORT_REQUESTED', { adminEmail, reportType, filters, ...requestMeta });

export const logReportGenerated = (adminEmail, reportType, metrics = {}) =>
  emit('info', 'REPORT_GENERATED', { adminEmail, reportType, metrics });
