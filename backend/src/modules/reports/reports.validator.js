import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import { REPORT_PAGINATION } from './reports.constants.js';

const validateObjectIdField = (value, fieldName) => {
  if (value && !mongoose.Types.ObjectId.isValid(value)) {
    return `${fieldName} must be a valid identifier.`;
  }
  return null;
};

const validateDateField = (value, fieldName) => {
  if (value) {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return `${fieldName} must be a valid date.`;
    }
  }
  return null;
};

export const validateReportFilters = (req, res, next) => {
  const errors = [];
  const {
    from, to, department, faculty, device,
    page, limit
  } = req.query;

  const fromErr = validateDateField(from, 'from');
  if (fromErr) errors.push({ field: 'from', message: fromErr });

  const toErr = validateDateField(to, 'to');
  if (toErr) errors.push({ field: 'to', message: toErr });

  const deptErr = validateObjectIdField(department, 'department');
  if (deptErr) errors.push({ field: 'department', message: deptErr });

  const facErr = validateObjectIdField(faculty, 'faculty');
  if (facErr) errors.push({ field: 'faculty', message: facErr });

  const devErr = validateObjectIdField(device, 'device');
  if (devErr) errors.push({ field: 'device', message: devErr });

  if (page !== undefined) {
    const p = parseInt(page, 10);
    if (isNaN(p) || p < 1) {
      errors.push({ field: 'page', message: 'page must be a positive integer.' });
    }
  }

  if (limit !== undefined) {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1 || l > REPORT_PAGINATION.MAX_LIMIT) {
      errors.push({ field: 'limit', message: `limit must be between 1 and ${REPORT_PAGINATION.MAX_LIMIT}.` });
    }
  }

  if (errors.length > 0) {
    req.validationErrors = errors;
    return handleValidationErrors(req, res, next);
  }

  next();
};
