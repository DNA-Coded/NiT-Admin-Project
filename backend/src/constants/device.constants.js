/**
 * Device Constants
 *
 * Domain-specific constants for the Device module.
 * Used for validation and database enums to ensure device-agnostic compatibility.
 */

export const DEVICE_TYPES = Object.freeze({
  FINGERPRINT:      'FINGERPRINT',
  FACE_RECOGNITION: 'FACE_RECOGNITION',
  HYBRID:           'HYBRID',
});

export const DEVICE_TYPES_VALUES = Object.freeze(Object.values(DEVICE_TYPES));

export const DEVICE_STATUS = Object.freeze({
  ONLINE:       'ONLINE',
  OFFLINE:      'OFFLINE',
  MAINTENANCE:  'MAINTENANCE',
  DISCONNECTED: 'DISCONNECTED',
});

export const DEVICE_STATUS_VALUES = Object.freeze(Object.values(DEVICE_STATUS));

export const DEVICE_SORT_FIELDS = Object.freeze([
  'deviceCode',
  'deviceName',
  'manufacturer',
  'building',
  'status',
  'lastSeen',
  'createdAt',
  'updatedAt',
]);

export const DEVICE_SORT_ORDERS = Object.freeze(['asc', 'desc']);

export const DEVICE_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
