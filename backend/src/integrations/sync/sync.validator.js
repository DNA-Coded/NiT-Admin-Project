/**
 * Sync Validator
 * 
 * Validates manual sync trigger requests from controllers, if implemented.
 */
import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';

const validateSyncTriggerFields = (req, res, next) => {
  const errors = [];
  const { deviceId, fromTime, toTime } = req.body ?? {};

  if (!deviceId || !mongoose.Types.ObjectId.isValid(deviceId)) {
    errors.push({ field: 'deviceId', message: 'Valid deviceId is required.' });
  }

  if (fromTime && isNaN(Date.parse(fromTime))) {
    errors.push({ field: 'fromTime', message: 'fromTime must be a valid ISO-8601 Date.' });
  }

  if (toTime && isNaN(Date.parse(toTime))) {
    errors.push({ field: 'toTime', message: 'toTime must be a valid ISO-8601 Date.' });
  }

  if (fromTime && toTime && new Date(fromTime) > new Date(toTime)) {
    errors.push({ field: 'fromTime', message: 'fromTime cannot be after toTime.' });
  }

  req.validationErrors = errors;
  next();
};

export const validateSyncTrigger = [
  validateSyncTriggerFields,
  handleValidationErrors,
];
