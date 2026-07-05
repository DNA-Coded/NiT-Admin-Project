/**
 * Sync Constants
 */

export const SYNC_STATUS = Object.freeze({
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED:  'FAILED',
  PARTIAL: 'PARTIAL',
});

export const SYNC_STATUS_VALUES = Object.freeze(Object.values(SYNC_STATUS));

export const SYNC_SOURCE = Object.freeze({
  MANUAL:    'MANUAL',
  SCHEDULED: 'SCHEDULED',
  DEVICE:    'DEVICE',
});

export const SYNC_SOURCE_VALUES = Object.freeze(Object.values(SYNC_SOURCE));
