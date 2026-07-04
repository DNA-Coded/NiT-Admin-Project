/**
 * Faculty Validators
 *
 * Validates request body, query parameters, and route params for faculty endpoints.
 * Each export is an Express middleware array placed between the route and controller.
 *
 * Pattern:
 *   router.post('/', validateCreateFaculty, createFacultyHandler);
 *
 * Errors are collected into `req.validationErrors` and flushed as a 422 response
 * by `handleValidationErrors` (always the last item in each array).
 */

import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  FACULTY_DESIGNATIONS,
  FACULTY_STATUS_VALUES,
  FACULTY_SORT_FIELDS,
  FACULTY_SORT_ORDERS,
  FACULTY_PAGINATION,
} from '../../constants/index.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Validate that a value is a non-empty string within length bounds.
 * @param {*}      value
 * @param {string} fieldName - Human-readable label for the error message
 * @param {number} min
 * @param {number} max
 * @returns {string|null} Error message, or null if valid
 */
const validateStringField = (value, fieldName, min, max) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
  if (value.trim().length > max) return `${fieldName} cannot exceed ${max} characters.`;
  return null;
};

/**
 * Validate that a value is a valid MongoDB ObjectId string.
 * @param {*}      value
 * @param {string} fieldName
 * @returns {string|null}
 */
const validateObjectIdField = (value, fieldName) => {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} is required.`;
  }
  if (!mongoose.Types.ObjectId.isValid(value.trim())) {
    return `${fieldName} must be a valid identifier.`;
  }
  return null;
};

// ─── POST /api/v1/faculty ─────────────────────────────────────────────────────

/**
 * Middleware: validate request body for creating a faculty record.
 *
 * Required: employeeId, firstName, lastName, designation, department, attendanceIdentity
 * Optional: email, phone, status, joiningDate, profileImage
 */
const validateCreateFacultyFields = (req, res, next) => {
  const errors = [];
  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
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

  // designation — required, must be from the allowed enum
  if (!designation || typeof designation !== 'string' || designation.trim() === '') {
    errors.push({ field: 'designation', message: 'Designation is required.' });
  } else if (!FACULTY_DESIGNATIONS.includes(designation.trim())) {
    errors.push({
      field:   'designation',
      message: `Invalid designation. Allowed values: ${FACULTY_DESIGNATIONS.join(', ')}.`,
    });
  }

  // department — required, valid ObjectId
  const deptErr = validateObjectIdField(department, 'Department');
  if (deptErr) errors.push({ field: 'department', message: deptErr });

  // attendanceIdentity — required
  const attErr = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
  if (attErr) errors.push({ field: 'attendanceIdentity', message: attErr });

  // status — optional; if provided, must be a valid enum value
  if (status !== undefined && status !== null) {
    if (!FACULTY_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${FACULTY_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  // joiningDate — optional; if provided, must be a valid date string
  if (joiningDate !== undefined && joiningDate !== null) {
    if (isNaN(Date.parse(joiningDate))) {
      errors.push({ field: 'joiningDate', message: 'joiningDate must be a valid date (e.g. 2020-08-01).' });
    }
  }

  // profileImage — optional; if provided, must be a non-empty string
  if (profileImage !== undefined && profileImage !== null && profileImage !== '') {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  // email — optional; if provided, validate format
  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  // phone — optional; if provided, validate format
  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for POST /api/v1/faculty.
 */
export const validateCreateFaculty = [
  validateCreateFacultyFields,
  handleValidationErrors,
];

// ─── PUT /api/v1/faculty/:id ──────────────────────────────────────────────────

/**
 * Middleware: validate request body for updating a faculty record.
 * All fields optional, at least one must be present.
 */
const validateUpdateFacultyFields = (req, res, next) => {
  const errors = [];
  const {
    employeeId, firstName, lastName,
    email, phone, designation,
    department, attendanceIdentity,
    status, joiningDate, profileImage,
  } = req.body ?? {};

  // Ensure at least one updatable field is present
  const knownFields = [
    'employeeId', 'firstName', 'lastName', 'email',
    'phone', 'designation', 'department', 'attendanceIdentity',
    'status', 'joiningDate', 'profileImage',
  ];
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f)
  );

  if (provided.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to update.' });
    req.validationErrors = errors;
    return next();
  }

  // employeeId — conditional
  if (employeeId !== undefined) {
    const err = validateStringField(employeeId, 'Employee ID', 1, 50);
    if (err) errors.push({ field: 'employeeId', message: err });
  }

  // firstName — conditional
  if (firstName !== undefined) {
    const err = validateStringField(firstName, 'First name', 2, 50);
    if (err) errors.push({ field: 'firstName', message: err });
  }

  // lastName — conditional
  if (lastName !== undefined) {
    const err = validateStringField(lastName, 'Last name', 2, 50);
    if (err) errors.push({ field: 'lastName', message: err });
  }

  // designation — conditional, must be from the allowed enum
  if (designation !== undefined) {
    if (typeof designation !== 'string' || designation.trim() === '') {
      errors.push({ field: 'designation', message: 'Designation must be a non-empty string.' });
    } else if (!FACULTY_DESIGNATIONS.includes(designation.trim())) {
      errors.push({
        field:   'designation',
        message: `Invalid designation. Allowed values: ${FACULTY_DESIGNATIONS.join(', ')}.`,
      });
    }
  }

  // department — conditional, valid ObjectId
  if (department !== undefined) {
    const err = validateObjectIdField(department, 'Department');
    if (err) errors.push({ field: 'department', message: err });
  }

  // attendanceIdentity — conditional
  if (attendanceIdentity !== undefined) {
    const err = validateStringField(attendanceIdentity, 'Attendance identity', 1, 100);
    if (err) errors.push({ field: 'attendanceIdentity', message: err });
  }

  // status — conditional, must be from the allowed enum
  if (status !== undefined && status !== null) {
    if (!FACULTY_STATUS_VALUES.includes(status)) {
      errors.push({
        field:   'status',
        message: `Invalid status. Allowed values: ${FACULTY_STATUS_VALUES.join(', ')}.`,
      });
    }
  }

  // joiningDate — conditional, valid date
  if (joiningDate !== undefined && joiningDate !== null) {
    if (isNaN(Date.parse(joiningDate))) {
      errors.push({ field: 'joiningDate', message: 'joiningDate must be a valid date (e.g. 2020-08-01).' });
    }
  }

  // profileImage — conditional, non-empty string URL
  if (profileImage !== undefined && profileImage !== null && profileImage !== '') {
    const imgErr = validateStringField(profileImage, 'Profile image URL', 1, 2048);
    if (imgErr) errors.push({ field: 'profileImage', message: imgErr });
  }

  // email — nullable to allow clearing
  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  // phone — nullable to allow clearing
  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || !/^\+?[0-9\s\-().]{7,20}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number.' });
    }
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for PUT /api/v1/faculty/:id.
 */
export const validateUpdateFaculty = [
  validateUpdateFacultyFields,
  handleValidationErrors,
];

// ─── GET /api/v1/faculty (query params) ──────────────────────────────────────

/**
 * Middleware: validate query parameters for the faculty list endpoint.
 *
 * Allowed params:
 *   - page        → positive integer
 *   - limit       → positive integer, max 100
 *   - search      → string, max 100 chars
 *   - department  → valid MongoDB ObjectId (when provided)
 *   - designation → string, max 100 chars (exact-match filter)
 *   - isActive    → 'true' | 'false' | 'all'
 *   - sortBy      → one of FACULTY_SORT_FIELDS
 *   - sortOrder   → 'asc' | 'desc'
 */
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
    } else if (l > FACULTY_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${FACULTY_PAGINATION.MAX_LIMIT}.`,
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

  if (status !== undefined && !FACULTY_STATUS_VALUES.includes(status)) {
    errors.push({
      field: 'status',
      message: `status filter must be one of: ${FACULTY_STATUS_VALUES.join(', ')}.`,
    });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({ field: 'isActive', message: "isActive must be 'true', 'false', or 'all'." });
  }

  if (sortBy !== undefined && !FACULTY_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${FACULTY_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !FACULTY_SORT_ORDERS.includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: "sortOrder must be 'asc' or 'desc'." });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for GET /api/v1/faculty.
 */
export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

// ─── Route param :id ──────────────────────────────────────────────────────────

/**
 * Middleware: validate that `req.params.id` is a valid MongoDB ObjectId.
 * Rejects with 422 immediately rather than letting Mongoose throw a CastError.
 */
const validateObjectIdParam = (req, res, next) => {
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    errors.push({ field: 'id', message: 'The provided ID is not a valid resource identifier.' });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for any route with an :id param.
 */
export const validateObjectId = [
  validateObjectIdParam,
  handleValidationErrors,
];
