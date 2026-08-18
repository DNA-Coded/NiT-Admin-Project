/**
 * Employee Validators
 *
 * Validates request body, query parameters, and route params for employee endpoints.
 * Each export is an Express middleware array placed between the route and controller.
 */

import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  EMPLOYEE_DESIGNATIONS,
  EMPLOYEE_STATUS_VALUES,
  EMPLOYEE_SORT_FIELDS,
  EMPLOYEE_SORT_ORDERS,
  EMPLOYEE_PAGINATION,
} from '../../constants/index.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

// ─── POST /api/v1/employee ─────────────────────────────────────────────────────

const validateCreateEmployeeFields = (req, res, next) => {
  const errors = [];
  
  // Clean empty strings sent from the frontend form fields to avoid breaking unique key constraints
  if (req.body) {
    if (req.body.email === '') req.body.email = undefined;
    if (req.body.phone === '') req.body.phone = undefined;
    if (req.body.profileImage === '') req.body.profileImage = undefined;
    if (req.body.joiningDate === '') req.body.joiningDate = undefined;
  }

  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
    isHOD,
  } = req.body ?? {};

  // employeeId — required
  const empIdErr = validateStringField(employeeId, 'Employee ID', 1, 50);
  if (empIdErr) errors.push({ field: 'employeeId', message: empIdErr });

  // firstName — required, 2–50 chars
  const firstNameErr = validateStringField(firstName, 'First name', 2, 50);
  if (firstNameErr) errors.push({ field: 'firstName', message: firstNameErr });

  // lastName — required, 2–50 chars
  const lastNameErr = validateStringField(lastName, 'Last name', 2, 50);
  if (lastNameErr) errors.push({ field: 'lastName', message: lastNameErr });

  // designation — required, must match whitelisted dropdown array
  if (!designation || typeof designation !== 'string' || designation.trim() === '') {
    errors.push({ field: 'designation', message: 'Designation is required.' });
  } else if (!EMPLOYEE_DESIGNATIONS.includes(designation.trim())) {
    errors.push({
      field:   'designation',
      message: `Invalid designation. Allowed values: ${EMPLOYEE_DESIGNATIONS.join(', ')}.`,
    });
  }

  // department — required, valid ObjectId string
  if (department !== undefined && department !== null && department !== '') {
    const deptErr = validateObjectIdField(department, 'Department');
    if (deptErr) {
      errors.push({ field: 'department', message: deptErr });
    }
  }

  // attendanceIdentity — required
  const attErr = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
  if (attErr) errors.push({ field: 'attendanceIdentity', message: attErr });

  // status — optional
  if (status !== undefined && status !== null) {
    if (!EMPLOYEE_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${EMPLOYEE_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  // joiningDate — optional
  if (joiningDate !== undefined && joiningDate !== null) {
    if (isNaN(Date.parse(joiningDate))) {
      errors.push({ field: 'joiningDate', message: 'joiningDate must be a valid date (e.g. 2020-08-01).' });
    }
  }

  // profileImage — optional
  if (profileImage !== undefined && profileImage !== null) {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  // email — optional
  if (email !== undefined && email !== null) {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  // phone — optional
  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  // isHOD — optional, must be boolean if provided
  if (isHOD !== undefined && typeof isHOD !== 'boolean') {
    errors.push({ field: 'isHOD', message: 'isHOD must be a boolean value.' });
  }

  req.validationErrors = errors;
  next();
};

export const validateCreateEmployee = [
  validateCreateEmployeeFields,
  handleValidationErrors,
];

// ─── PUT /api/v1/employee/:id ──────────────────────────────────────────────────

const validateUpdateEmployeeFields = (req, res, next) => {
  const errors = [];

  // Normalize blank input fields to undefined for dynamic query object resolution
  if (req.body) {
    if (req.body.email === '') req.body.email = undefined;
    if (req.body.phone === '') req.body.phone = undefined;
    if (req.body.profileImage === '') req.body.profileImage = undefined;
    if (req.body.joiningDate === '') req.body.joiningDate = undefined;
  }

  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
    isHOD,
  } = req.body ?? {};

  const knownFields = [
    'employeeId', 'firstName', 'lastName', 'email',
    'phone', 'designation', 'department', 'attendanceIdentity',
    'status', 'joiningDate', 'profileImage', 'isHOD',
  ];
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f) && req.body[f] !== undefined
  );

  if (provided.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to update.' });
    req.validationErrors = errors;
    return next();
  }

  if (employeeId !== undefined) {
    const err = validateStringField(employeeId, 'Employee ID', 1, 50);
    if (err) errors.push({ field: 'employeeId', message: err });
  }

  if (firstName !== undefined) {
    const err = validateStringField(firstName, 'First name', 2, 50);
    if (err) errors.push({ field: 'firstName', message: err });
  }

  if (lastName !== undefined) {
    const err = validateStringField(lastName, 'Last name', 2, 50);
    if (err) errors.push({ field: 'lastName', message: err });
  }

  if (designation !== undefined) {
    if (typeof designation !== 'string' || designation.trim() === '') {
      errors.push({ field: 'designation', message: 'Designation must be a non-empty string.' });
    } else if (!EMPLOYEE_DESIGNATIONS.includes(designation.trim())) {
      errors.push({
        field:   'designation',
        message: `Invalid designation. Allowed values: ${EMPLOYEE_DESIGNATIONS.join(', ')}.`,
      });
    }
  }

  if (department !== undefined) {
    const err = validateObjectIdField(department, 'Department');
    if (err) errors.push({ field: 'department', message: err });
  }

  if (attendanceIdentity !== undefined) {
    const err = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
    if (err) errors.push({ field: 'attendanceIdentity', message: err });
  }

  if (status !== undefined && status !== null) {
    if (!EMPLOYEE_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${EMPLOYEE_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  if (joiningDate !== undefined && joiningDate !== null) {
    if (isNaN(Date.parse(joiningDate))) {
      errors.push({ field: 'joiningDate', message: 'joiningDate must be a valid date (e.g. 2020-08-01).' });
    }
  }

  if (profileImage !== undefined && profileImage !== null) {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  if (email !== undefined && email !== null) {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  if (isHOD !== undefined && typeof isHOD !== 'boolean') {
    errors.push({ field: 'isHOD', message: 'isHOD must be a boolean value.' });
  }

  req.validationErrors = errors;
  next();
};

export const validateUpdateEmployee = [
  validateUpdateEmployeeFields,
  handleValidationErrors,
];

// ─── GET /api/v1/employee (query params) ──────────────────────────────────────

const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const {
    page, limit, search,
    department, designation, status, isActive,
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
    } else if (l > EMPLOYEE_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${EMPLOYEE_PAGINATION.MAX_LIMIT}.`,
      });
    }
  }

  if (search !== undefined && search.trim().length > 100) {
    errors.push({ field: 'search', message: 'search term cannot exceed 100 characters.' });
  }

  if (department !== undefined && !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: 'department', message: 'department must be a valid identifier.' });
  }

  if (designation !== undefined && designation.trim().length > 100) {
    errors.push({ field: 'designation', message: 'designation filter cannot exceed 100 characters.' });
  }

  if (status !== undefined && !EMPLOYEE_STATUS_VALUES.includes(status)) {
    errors.push({
      field: 'status',
      message: `status filter must be one of: ${EMPLOYEE_STATUS_VALUES.join(', ')}.`,
    });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({ field: 'isActive', message: "isActive must be 'true', 'false', or 'all'." });
  }

  if (sortBy !== undefined && !EMPLOYEE_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${EMPLOYEE_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !EMPLOYEE_SORT_ORDERS.includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: "sortOrder must be 'asc' or 'desc'." });
  }

  req.validationErrors = errors;
  next();
};

export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

// ─── Route param :id ──────────────────────────────────────────────────────────

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