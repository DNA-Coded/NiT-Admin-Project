/**
 * Raw Attendance Event Constants
 */

export const PROCESSING_STATUS = Object.freeze({
  PENDING:    'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED:  'PROCESSED',
  FAILED:     'FAILED',
  DUPLICATE:  'DUPLICATE',
});

export const PROCESSING_STATUS_VALUES = Object.freeze(Object.values(PROCESSING_STATUS));

export const RAW_EVENT_SORT_FIELDS = Object.freeze([
  'eventId',
  'provider',
  'processingStatus',
  'receivedAt',
  'processedAt',
]);

export const RAW_EVENT_SORT_ORDERS = Object.freeze(['asc', 'desc']);

export const RAW_EVENT_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
});
