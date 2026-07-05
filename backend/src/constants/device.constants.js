/**
 * Device Constants
 *
 * Domain-specific constants for the Device module.
 * Used for validation and database enums to ensure device-agnostic compatibility.
 */

export const DEVICE_CATEGORIES = Object.freeze({
  BIOMETRIC_TERMINAL: 'BIOMETRIC_TERMINAL',
  RFID_READER:        'RFID_READER',
  QR_SCANNER:         'QR_SCANNER',
  MOBILE_DEVICE:      'MOBILE_DEVICE',
  OTHER:              'OTHER',
});

export const DEVICE_CATEGORIES_VALUES = Object.freeze(Object.values(DEVICE_CATEGORIES));

export const VERIFICATION_METHODS = Object.freeze({
  FACE_RECOGNITION: 'FACE_RECOGNITION',
  FINGERPRINT:      'FINGERPRINT',
  RFID:             'RFID',
  PIN:              'PIN',
  QR_CODE:          'QR_CODE',
  MANUAL:           'MANUAL',
});

export const VERIFICATION_METHODS_VALUES = Object.freeze(Object.values(VERIFICATION_METHODS));

export const DEVICE_STATUS = Object.freeze({
  ONLINE:       'ONLINE',
  OFFLINE:      'OFFLINE',
  MAINTENANCE:  'MAINTENANCE',
  DISCONNECTED: 'DISCONNECTED',
});

export const DEVICE_STATUS_VALUES = Object.freeze(Object.values(DEVICE_STATUS));

export const DEVICE_CONNECTION_MODES = Object.freeze({
  LAN:   'LAN',
  WAN:   'WAN',
  CLOUD: 'CLOUD',
  USB:   'USB',
});

export const DEVICE_CONNECTION_MODES_VALUES = Object.freeze(Object.values(DEVICE_CONNECTION_MODES));

export const DEVICE_SORT_FIELDS = Object.freeze([
  'deviceCode',
  'deviceName',
  'manufacturer',
  'building',
  'status',
  'connectionMode',
  'lastSeen',
  'lastHeartbeat',
  'createdAt',
  'updatedAt',
]);

export const DEVICE_SORT_ORDERS = Object.freeze(['asc', 'desc']);

export const DEVICE_PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});
