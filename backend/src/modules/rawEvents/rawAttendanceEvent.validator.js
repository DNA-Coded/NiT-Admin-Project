import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import { PROCESSING_STATUS_VALUES } from './rawAttendanceEvent.constants.js';

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const { page, limit, deviceId, status } = req.query ?? {};

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

  if (status !== undefined && !PROCESSING_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `status filter must be one of: ${PROCESSING_STATUS_VALUES.join(', ')}.` });
  }

  req.validationErrors = errors;
  next();
};

export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

const validateEventIdParam = (req, res, next) => {
  const errors = [];
  if (!req.params.id || typeof req.params.id !== 'string') {
    errors.push({ field: 'id', message: 'The provided event ID is invalid.' });
  }
  req.validationErrors = errors;
  next();
};

export const validateEventId = [
  validateEventIdParam,
  handleValidationErrors,
];
