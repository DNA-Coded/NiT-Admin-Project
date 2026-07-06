import { emit } from '../../../utils/eventBus.js';

export const logReportRequested = (adminEmail, reportType, filters = {}, requestMeta = {}) =>
  emit('info', 'REPORT_REQUESTED', { adminEmail, reportType, filters, ...requestMeta });

export const logReportGenerated = (adminEmail, reportType, metrics = {}) =>
  emit('info', 'REPORT_GENERATED', { adminEmail, reportType, metrics });
