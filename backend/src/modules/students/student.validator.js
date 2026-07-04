import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  STUDENT_STATUS_VALUES,
  SEMESTERS,
  STUDENT_SORT_FIELDS,
  STUDENT_SORT_ORDERS,
  STUDENT_PAGINATION,
} from '../../constants/index.js';

const validateStringField = (value, fieldName, min, max) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
  if (value.trim().length > max) return `${fieldName} cannot exceed ${max} characters.`;
  return null;
};

const validateObjectIdField = (value, fieldName) => {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} is required.`;
  }
  if (!mongoose.Types.ObjectId.isValid(value.trim())) {
    return `${fieldName} must be a valid identifier.`;
  }
  return null;
};

const validateCreateStudentFields = (req, res, next) => {
  const errors = [];
  const {
    rollNumber, registrationNumber, firstName, lastName,
    email, phone, profileImage, department, semester, section,
    batch, academicSession, attendanceIdentity, status,
  } = req.body ?? {};

  // Required Fields
  const rollErr = validateStringField(rollNumber, 'Roll number', 1, 50);
  if (rollErr) errors.push({ field: 'rollNumber', message: rollErr });

  const regErr = validateStringField(registrationNumber, 'Registration number', 1, 50);
  if (regErr) errors.push({ field: 'registrationNumber', message: regErr });

  const fNameErr = validateStringField(firstName, 'First name', 2, 50);
  if (fNameErr) errors.push({ field: 'firstName', message: fNameErr });

  const lNameErr = validateStringField(lastName, 'Last name', 2, 50);
  if (lNameErr) errors.push({ field: 'lastName', message: lNameErr });

  const deptErr = validateObjectIdField(department, 'Department');
  if (deptErr) errors.push({ field: 'department', message: deptErr });

  const batchErr = validateStringField(batch, 'Batch', 1, 50);
  if (batchErr) errors.push({ field: 'batch', message: batchErr });

  const sessionErr = validateStringField(academicSession, 'Academic session', 1, 50);
  if (sessionErr) errors.push({ field: 'academicSession', message: sessionErr });

  const attErr = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
  if (attErr) errors.push({ field: 'attendanceIdentity', message: attErr });

  if (semester === undefined || semester === null) {
    errors.push({ field: 'semester', message: 'Semester is required.' });
  } else if (!SEMESTERS.includes(Number(semester))) {
    errors.push({ field: 'semester', message: `Invalid semester. Allowed values: ${SEMESTERS.join(', ')}.` });
  }

  // Optional Fields
  if (section !== undefined && section !== null && section !== '') {
    const secErr = validateStringField(section, 'Section', 1, 20);
    if (secErr) errors.push({ field: 'section', message: secErr });
  }

  if (status !== undefined && status !== null) {
    if (!STUDENT_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${STUDENT_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  if (profileImage !== undefined && profileImage !== null && profileImage !== '') {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  req.validationErrors = errors;
  next();
};

export const validateCreateStudent = [
  validateCreateStudentFields,
  handleValidationErrors,
];

const validateUpdateStudentFields = (req, res, next) => {
  const errors = [];
  const {
    rollNumber, registrationNumber, firstName, lastName,
    email, phone, profileImage, department, semester, section,
    batch, academicSession, attendanceIdentity, status,
  } = req.body ?? {};

  const knownFields = [
    'rollNumber', 'registrationNumber', 'firstName', 'lastName',
    'email', 'phone', 'profileImage', 'department', 'semester', 'section',
    'batch', 'academicSession', 'attendanceIdentity', 'status',
  ];
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f)
  );

  if (provided.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to update.' });
    req.validationErrors = errors;
    return next();
  }

  if (rollNumber !== undefined) {
    const err = validateStringField(rollNumber, 'Roll number', 1, 50);
    if (err) errors.push({ field: 'rollNumber', message: err });
  }

  if (registrationNumber !== undefined) {
    const err = validateStringField(registrationNumber, 'Registration number', 1, 50);
    if (err) errors.push({ field: 'registrationNumber', message: err });
  }

  if (firstName !== undefined) {
    const err = validateStringField(firstName, 'First name', 2, 50);
    if (err) errors.push({ field: 'firstName', message: err });
  }

  if (lastName !== undefined) {
    const err = validateStringField(lastName, 'Last name', 2, 50);
    if (err) errors.push({ field: 'lastName', message: err });
  }

  if (department !== undefined) {
    const err = validateObjectIdField(department, 'Department');
    if (err) errors.push({ field: 'department', message: err });
  }

  if (batch !== undefined) {
    const err = validateStringField(batch, 'Batch', 1, 50);
    if (err) errors.push({ field: 'batch', message: err });
  }

  if (academicSession !== undefined) {
    const err = validateStringField(academicSession, 'Academic session', 1, 50);
    if (err) errors.push({ field: 'academicSession', message: err });
  }

  if (attendanceIdentity !== undefined) {
    const err = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
    if (err) errors.push({ field: 'attendanceIdentity', message: err });
  }

  if (semester !== undefined) {
    if (!SEMESTERS.includes(Number(semester))) {
      errors.push({ field: 'semester', message: `Invalid semester. Allowed values: ${SEMESTERS.join(', ')}.` });
    }
  }

  if (section !== undefined && section !== null && section !== '') {
    const secErr = validateStringField(section, 'Section', 1, 20);
    if (secErr) errors.push({ field: 'section', message: secErr });
  }

  if (status !== undefined && status !== null) {
    if (!STUDENT_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${STUDENT_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  if (profileImage !== undefined && profileImage !== null && profileImage !== '') {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  req.validationErrors = errors;
  next();
};

export const validateUpdateStudent = [
  validateUpdateStudentFields,
  handleValidationErrors,
];

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const {
    page, limit, search,
    department, semester, section, batch, academicSession, status, isActive,
    sortBy, sortOrder,
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
    } else if (l > STUDENT_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${STUDENT_PAGINATION.MAX_LIMIT}.`,
      });
    }
  }

  if (search !== undefined && search.trim().length > 100) {
    errors.push({ field: 'search', message: 'search term cannot exceed 100 characters.' });
  }

  if (department !== undefined && !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: 'department', message: 'department must be a valid identifier.' });
  }

  if (semester !== undefined) {
    if (!SEMESTERS.includes(Number(semester))) {
      errors.push({ field: 'semester', message: `semester filter must be one of: ${SEMESTERS.join(', ')}.` });
    }
  }

  if (section !== undefined && section.trim().length > 20) {
    errors.push({ field: 'section', message: 'section filter cannot exceed 20 characters.' });
  }
  
  if (batch !== undefined && batch.trim().length > 50) {
    errors.push({ field: 'batch', message: 'batch filter cannot exceed 50 characters.' });
  }

  if (academicSession !== undefined && academicSession.trim().length > 50) {
    errors.push({ field: 'academicSession', message: 'academicSession filter cannot exceed 50 characters.' });
  }

  if (status !== undefined && !STUDENT_STATUS_VALUES.includes(status)) {
    errors.push({
      field: 'status',
      message: `status filter must be one of: ${STUDENT_STATUS_VALUES.join(', ')}.`,
    });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({ field: 'isActive', message: "isActive must be 'true', 'false', or 'all'." });
  }

  if (sortBy !== undefined && !STUDENT_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${STUDENT_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !STUDENT_SORT_ORDERS.includes(sortOrder)) {
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
