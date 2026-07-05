/**
 * Sync Validator
 * 
 * Validates manual sync trigger requests and query parameters.
 */
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import { SYNC_STATUS_VALUES, SYNC_SOURCE_VALUES } from './sync.constants.js';

const validateSyncTriggerFields = (req, res, next) => {
  const errors = [];
  const { deviceId, provider, source } = req.body ?? {};

  if (!deviceId || !mongoose.Types.ObjectId.isValid(deviceId)) {
    errors.push({ field: 'deviceId', message: 'Valid deviceId is required.' });
  }

  if (!provider || typeof provider !== 'string') {
    errors.push({ field: 'provider', message: 'provider is required.' });
  }

  if (source && !SYNC_SOURCE_VALUES.includes(source)) {
    errors.push({ field: 'source', message: `Invalid source. Allowed values: ${SYNC_SOURCE_VALUES.join(', ')}` });
  }

  req.validationErrors = errors;
  next();
};

export const validateSyncTrigger = [
  validateSyncTriggerFields,
  handleValidationErrors,
];

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const { page, limit, deviceId, status, source } = req.query ?? {};

  if (page !== undefined) {
    const p = parseInt(page, 10);
    if (isNaN(p) || p < 1) errors.push({ field: 'page', message: 'page must be a positive integer.' });
  }

  if (limit !== undefined) {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1) errors.push({ field: 'limit', message: 'limit must be a positive integer.' });
  }

  if (deviceId !== undefined && !mongoose.Types.ObjectId.isValid(deviceId)) {
    errors.push({ field: 'deviceId', message: 'Must be a valid device ID.' });
  }

  if (status !== undefined && !SYNC_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `status filter must be one of: ${SYNC_STATUS_VALUES.join(', ')}.` });
  }

  if (source !== undefined && !SYNC_SOURCE_VALUES.includes(source)) {
    errors.push({ field: 'source', message: `source filter must be one of: ${SYNC_SOURCE_VALUES.join(', ')}.` });
  }

  req.validationErrors = errors;
  next();
};

export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

const validateSyncIdParam = (req, res, next) => {
  const errors = [];
  if (!req.params.id || typeof req.params.id !== 'string') {
    errors.push({ field: 'id', message: 'The provided sync ID is invalid.' });
  }
  req.validationErrors = errors;
  next();
};

export const validateSyncId = [
  validateSyncIdParam,
  handleValidationErrors,
];

const validateDeviceIdParam = (req, res, next) => {
  const errors = [];
  if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
    errors.push({ field: 'deviceId', message: 'The provided device ID is not valid.' });
  }
  req.validationErrors = errors;
  next();
};

export const validateDeviceId = [
  validateDeviceIdParam,
  handleValidationErrors,
];
