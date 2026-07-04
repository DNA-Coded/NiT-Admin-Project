import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  PERSON_TYPES_VALUES,
  VERIFICATION_METHODS_VALUES,
  ATTENDANCE_TYPES_VALUES,
  ATTENDANCE_RECORD_STATUS_VALUES,
  ATTENDANCE_SORT_FIELDS,
  ATTENDANCE_SORT_ORDERS,
  ATTENDANCE_PAGINATION,
} from '../../constants/index.js';

const validateStringField = (value, fieldName, min, max) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
  if (value.trim().length > max) return `${fieldName} cannot exceed ${max} characters.`;
  return null;
};

const validateCreateAttendanceFields = (req, res, next) => {
  const errors = [];
  const {
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
  } = req.body ?? {};

  // Required Strings
  const codeErr = validateStringField(attendanceCode, 'Attendance code', 1, 50);
  if (codeErr) errors.push({ field: 'attendanceCode', message: codeErr });

  const identErr = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
  if (identErr) errors.push({ field: 'attendanceIdentity', message: identErr });

  // Enums
  if (!PERSON_TYPES_VALUES.includes(personType)) {
    errors.push({ field: 'personType', message: `Invalid person type. Allowed values: ${PERSON_TYPES_VALUES.join(', ')}.` });
  }

  if (!VERIFICATION_METHODS_VALUES.includes(verificationMethod)) {
    errors.push({ field: 'verificationMethod', message: `Invalid verification method. Allowed values: ${VERIFICATION_METHODS_VALUES.join(', ')}.` });
  }

  if (!ATTENDANCE_TYPES_VALUES.includes(attendanceType)) {
    errors.push({ field: 'attendanceType', message: `Invalid attendance type. Allowed values: ${ATTENDANCE_TYPES_VALUES.join(', ')}.` });
  }

  if (!ATTENDANCE_RECORD_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `Invalid status. Allowed values: ${ATTENDANCE_RECORD_STATUS_VALUES.join(', ')}.` });
  }

  // ObjectIds
  if (!mongoose.Types.ObjectId.isValid(person)) {
    errors.push({ field: 'person', message: 'Must be a valid Person ObjectId.' });
  }

  if (!mongoose.Types.ObjectId.isValid(device)) {
    errors.push({ field: 'device', message: 'Must be a valid Device ObjectId.' });
  }

  // Dates and Times
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    errors.push({ field: 'timestamp', message: 'Must be a valid ISO 8601 date string.' });
  }

  if (!attendanceDate || typeof attendanceDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
    errors.push({ field: 'attendanceDate', message: 'Must be a valid date string (YYYY-MM-DD).' });
  }

  if (!attendanceTime || typeof attendanceTime !== 'string' || !/^\d{2}:\d{2}(:\d{2})?$/.test(attendanceTime)) {
    errors.push({ field: 'attendanceTime', message: 'Must be a valid time string (HH:MM or HH:MM:SS).' });
  }

  // Optional Remarks
  if (remarks !== undefined && remarks !== null && remarks !== '') {
    const remErr = validateStringField(remarks, 'Remarks', 1, 500);
    if (remErr) errors.push({ field: 'remarks', message: remErr });
  }

  req.validationErrors = errors;
  next();
};

export const validateCreateAttendance = [
  validateCreateAttendanceFields,
  handleValidationErrors,
];

const validateUpdateAttendanceFields = (req, res, next) => {
  const errors = [];
  const {
    attendanceCode, personType, person, device, attendanceIdentity,
    verificationMethod, attendanceType, timestamp, attendanceDate, attendanceTime,
    status, remarks,
  } = req.body ?? {};

  const knownFields = [
    'attendanceCode', 'personType', 'person', 'device', 'attendanceIdentity',
    'verificationMethod', 'attendanceType', 'timestamp', 'attendanceDate', 'attendanceTime',
    'status', 'remarks',
  ];
  
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f)
  );

  if (provided.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to update.' });
    req.validationErrors = errors;
    return next();
  }

  if (attendanceCode !== undefined) {
    const err = validateStringField(attendanceCode, 'Attendance code', 1, 50);
    if (err) errors.push({ field: 'attendanceCode', message: err });
  }

  if (attendanceIdentity !== undefined) {
    const err = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
    if (err) errors.push({ field: 'attendanceIdentity', message: err });
  }

  if (personType !== undefined && !PERSON_TYPES_VALUES.includes(personType)) {
    errors.push({ field: 'personType', message: `Invalid person type. Allowed values: ${PERSON_TYPES_VALUES.join(', ')}.` });
  }

  if (verificationMethod !== undefined && !VERIFICATION_METHODS_VALUES.includes(verificationMethod)) {
    errors.push({ field: 'verificationMethod', message: `Invalid verification method. Allowed values: ${VERIFICATION_METHODS_VALUES.join(', ')}.` });
  }

  if (attendanceType !== undefined && !ATTENDANCE_TYPES_VALUES.includes(attendanceType)) {
    errors.push({ field: 'attendanceType', message: `Invalid attendance type. Allowed values: ${ATTENDANCE_TYPES_VALUES.join(', ')}.` });
  }

  if (status !== undefined && !ATTENDANCE_RECORD_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `Invalid status. Allowed values: ${ATTENDANCE_RECORD_STATUS_VALUES.join(', ')}.` });
  }

  if (person !== undefined && !mongoose.Types.ObjectId.isValid(person)) {
    errors.push({ field: 'person', message: 'Must be a valid Person ObjectId.' });
  }

  if (device !== undefined && !mongoose.Types.ObjectId.isValid(device)) {
    errors.push({ field: 'device', message: 'Must be a valid Device ObjectId.' });
  }

  if (timestamp !== undefined && isNaN(new Date(timestamp).getTime())) {
    errors.push({ field: 'timestamp', message: 'Must be a valid ISO 8601 date string.' });
  }

  if (attendanceDate !== undefined && (typeof attendanceDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate))) {
    errors.push({ field: 'attendanceDate', message: 'Must be a valid date string (YYYY-MM-DD).' });
  }

  if (attendanceTime !== undefined && (typeof attendanceTime !== 'string' || !/^\d{2}:\d{2}(:\d{2})?$/.test(attendanceTime))) {
    errors.push({ field: 'attendanceTime', message: 'Must be a valid time string (HH:MM or HH:MM:SS).' });
  }

  if (remarks !== undefined && remarks !== null && remarks !== '') {
    const err = validateStringField(remarks, 'Remarks', 1, 500);
    if (err) errors.push({ field: 'remarks', message: err });
  }

  req.validationErrors = errors;
  next();
};

export const validateUpdateAttendance = [
  validateUpdateAttendanceFields,
  handleValidationErrors,
];

const validateCorrectAttendanceFields = (req, res, next) => {
  const errors = [];
  const { status, attendanceType, remarks, correctionReason } = req.body ?? {};
  
  const knownFields = ['status', 'attendanceType', 'remarks', 'correctionReason'];
  const providedKeys = Object.keys(req.body ?? {});
  
  const invalidFields = providedKeys.filter(f => !knownFields.includes(f));
  if (invalidFields.length > 0) {
    errors.push({ field: 'body', message: `Cannot modify protected fields. Only ${knownFields.join(', ')} are allowed in correction.` });
    req.validationErrors = errors;
    return next();
  }

  const err = validateStringField(correctionReason, 'Correction reason', 1, 500);
  if (err) errors.push({ field: 'correctionReason', message: err });

  if (status !== undefined && !ATTENDANCE_RECORD_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `Invalid status. Allowed values: ${ATTENDANCE_RECORD_STATUS_VALUES.join(', ')}.` });
  }

  if (attendanceType !== undefined && !ATTENDANCE_TYPES_VALUES.includes(attendanceType)) {
    errors.push({ field: 'attendanceType', message: `Invalid attendance type. Allowed values: ${ATTENDANCE_TYPES_VALUES.join(', ')}.` });
  }

  if (remarks !== undefined && remarks !== null && remarks !== '') {
    const rErr = validateStringField(remarks, 'Remarks', 1, 500);
    if (rErr) errors.push({ field: 'remarks', message: rErr });
  }

  req.validationErrors = errors;
  next();
};

export const validateCorrectAttendance = [
  validateCorrectAttendanceFields,
  handleValidationErrors,
];

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const {
    page, limit, search,
    personType, person, department, device,
    verificationMethod, attendanceType, status, attendanceDate,
    isActive, sortBy, sortOrder,
  } = req.query ?? {};

  if (page !== undefined) {
    const p = parseInt(page, 10);
    if (isNaN(p) || p < 1) {
      errors.push({ field: 'page', message: 'page must be a positive integer.' });
    }
  }

  if (limit !== undefined) {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1) {
      errors.push({ field: 'limit', message: 'limit must be a positive integer.' });
    } else if (l > ATTENDANCE_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${ATTENDANCE_PAGINATION.MAX_LIMIT}.`,
      });
    }
  }

  if (search !== undefined && search.trim().length > 100) {
    errors.push({ field: 'search', message: 'search term cannot exceed 100 characters.' });
  }

  if (personType !== undefined && !PERSON_TYPES_VALUES.includes(personType)) {
    errors.push({ field: 'personType', message: `personType filter must be one of: ${PERSON_TYPES_VALUES.join(', ')}.` });
  }

  if (person !== undefined && !mongoose.Types.ObjectId.isValid(person)) {
    errors.push({ field: 'person', message: 'Must be a valid ObjectId.' });
  }

  if (department !== undefined && !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: 'department', message: 'Must be a valid ObjectId.' });
  }

  if (device !== undefined && !mongoose.Types.ObjectId.isValid(device)) {
    errors.push({ field: 'device', message: 'Must be a valid ObjectId.' });
  }

  if (verificationMethod !== undefined && !VERIFICATION_METHODS_VALUES.includes(verificationMethod)) {
    errors.push({ field: 'verificationMethod', message: `verificationMethod filter must be one of: ${VERIFICATION_METHODS_VALUES.join(', ')}.` });
  }

  if (attendanceType !== undefined && !ATTENDANCE_TYPES_VALUES.includes(attendanceType)) {
    errors.push({ field: 'attendanceType', message: `attendanceType filter must be one of: ${ATTENDANCE_TYPES_VALUES.join(', ')}.` });
  }

  if (status !== undefined && !ATTENDANCE_RECORD_STATUS_VALUES.includes(status)) {
    errors.push({ field: 'status', message: `status filter must be one of: ${ATTENDANCE_RECORD_STATUS_VALUES.join(', ')}.` });
  }

  if (attendanceDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
    errors.push({ field: 'attendanceDate', message: 'Must be a valid YYYY-MM-DD date.' });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({ field: 'isActive', message: "isActive must be 'true', 'false', or 'all'." });
  }

  if (sortBy !== undefined && !ATTENDANCE_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${ATTENDANCE_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !ATTENDANCE_SORT_ORDERS.includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: "sortOrder must be 'asc' or 'desc'." });
  }

  req.validationErrors = errors;
  next();
};

export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

const validateObjectIdParam = (req, res, next) => {
  const errors = [];
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    errors.push({ field: 'id', message: 'The provided ID is not a valid resource identifier.' });
  }
  req.validationErrors = errors;
  next();
};

export const validateObjectId = [
  validateObjectIdParam,
  handleValidationErrors,
];
