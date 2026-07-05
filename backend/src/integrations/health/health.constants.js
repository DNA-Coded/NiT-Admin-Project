/**
 * Health Constants
 * 
 * Enums and values for device health tracking.
 */

export const DEVICE_HEALTH_STATUS = Object.freeze({
  HEALTHY:     'HEALTHY',
  WARNING:     'WARNING',
  OFFLINE:     'OFFLINE',
  ERROR:       'ERROR',
  MAINTENANCE: 'MAINTENANCE',
});

export const DEVICE_HEALTH_STATUS_VALUES = Object.freeze(Object.values(DEVICE_HEALTH_STATUS));
