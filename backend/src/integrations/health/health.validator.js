import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import { DEVICE_HEALTH_STATUS_VALUES } from './health.constants.js';

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

const validateStatusUpdateFields = (req, res, next) => {
  const errors = [];
  const { status } = req.body ?? {};

  if (!status) {
    errors.push({ field: 'status', message: 'status is required.' });
  } else if (!DEVICE_HEALTH_STATUS_VALUES.includes(status.toUpperCase())) {
    errors.push({ field: 'status', message: `status must be one of: ${DEVICE_HEALTH_STATUS_VALUES.join(', ')}.` });
  }

  req.validationErrors = errors;
  next();
};

export const validateStatusUpdate = [
  validateStatusUpdateFields,
  handleValidationErrors,
];

const validateErrorRecordFields = (req, res, next) => {
  const errors = [];
  const { error } = req.body ?? {};

  if (!error || typeof error !== 'string' || error.trim() === '') {
    errors.push({ field: 'error', message: 'A valid error message string is required.' });
  }

  req.validationErrors = errors;
  next();
};

export const validateErrorRecord = [
  validateErrorRecordFields,
  handleValidationErrors,
];
