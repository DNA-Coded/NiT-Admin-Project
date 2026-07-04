/**
 * Department Validators
 *
 * Validates request body, query parameters, and route params for department endpoints.
 * Each export is an Express middleware array: place it between the route path
 * and the controller handler.
 *
 * Pattern:
 *   router.post('/', validateCreateDepartment, createDepartmentHandler);
 *
 * Validation errors are collected into `req.validationErrors` and flushed to
 * a 422 response by `handleValidationErrors` (last item in each array).
 */

import mongoose from 'mongoose';
import { handleValidationErrors } from '../../validators/index.js';
import {
  DEPARTMENT_SORT_FIELDS,
  DEPARTMENT_SORT_ORDERS,
  DEPARTMENT_PAGINATION,
} from '../../constants/index.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Validate that a string field is a non-empty string within length bounds.
 * @param {string} value
 * @param {string} fieldName - Human-readable field label for error messages
 * @param {number} min
 * @param {number} max
 * @returns {string|null} Error message or null if valid
 */
const validateStringField = (value, fieldName, min, max) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters.`;
  }
  if (value.trim().length > max) {
    return `${fieldName} cannot exceed ${max} characters.`;
  }
  return null;
};

// ─── POST /api/v1/departments ─────────────────────────────────────────────────

/**
 * Middleware: validate the request body for creating a department.
 *
 * Required fields: name, code
 * Optional fields: description
 *
 * Rules:
 *   - name        → required, string, 2–100 chars
 *   - code        → required, string, 2–10 chars, alphanumeric only
 *   - description → optional, string, 1–500 chars (if provided must be non-empty)
 */
const validateCreateDepartmentFields = (req, res, next) => {
  const errors = [];
  const { name, code, description } = req.body ?? {};

  // name — required
  const nameErr = validateStringField(name, 'Department name', 2, 100);
  if (nameErr) errors.push({ field: 'name', message: nameErr });

  // code — required, alphanumeric
  if (!code || typeof code !== 'string' || code.trim() === '') {
    errors.push({ field: 'code', message: 'Department code is required.' });
  } else {
    const codeErr = validateStringField(code, 'Department code', 2, 10);
    if (codeErr) {
      errors.push({ field: 'code', message: codeErr });
    } else if (!/^[A-Za-z0-9]+$/.test(code.trim())) {
      errors.push({ field: 'code', message: 'Department code may only contain letters and numbers.' });
    }
  }

  // description — optional
  if (description !== undefined && description !== null) {
    const descErr = validateStringField(description, 'Description', 1, 500);
    if (descErr) errors.push({ field: 'description', message: descErr });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for POST /api/v1/departments.
 */
export const validateCreateDepartment = [
  validateCreateDepartmentFields,
  handleValidationErrors,
];

// ─── PUT /api/v1/departments/:id ──────────────────────────────────────────────

/**
 * Middleware: validate the request body for updating a department.
 *
 * All body fields are optional, but at least one must be provided.
 * The service layer handles the "no fields" case, but we catch it early here
 * to return a clean validation error rather than a business-logic one.
 *
 * Rules (same as create but all optional):
 *   - name        → if present: string, 2–100 chars
 *   - code        → if present: string, 2–10 chars, alphanumeric only
 *   - description → if present: string, 1–500 chars (or null to clear)
 */
const validateUpdateDepartmentFields = (req, res, next) => {
  const errors = [];
  const { name, code, description } = req.body ?? {};

  // Ensure at least one updatable field is provided
  const knownFields = ['name', 'code', 'description'];
  const provided = knownFields.filter(
    (f) => Object.prototype.hasOwnProperty.call(req.body ?? {}, f)
  );

  if (provided.length === 0) {
    errors.push({
      field:   'body',
      message: 'At least one field (name, code, description) must be provided.',
    });
    req.validationErrors = errors;
    return next();
  }

  // name — conditional
  if (name !== undefined) {
    const nameErr = validateStringField(name, 'Department name', 2, 100);
    if (nameErr) errors.push({ field: 'name', message: nameErr });
  }

  // code — conditional, alphanumeric
  if (code !== undefined) {
    if (typeof code !== 'string' || code.trim() === '') {
      errors.push({ field: 'code', message: 'Department code must be a non-empty string.' });
    } else {
      const codeErr = validateStringField(code, 'Department code', 2, 10);
      if (codeErr) {
        errors.push({ field: 'code', message: codeErr });
      } else if (!/^[A-Za-z0-9]+$/.test(code.trim())) {
        errors.push({ field: 'code', message: 'Department code may only contain letters and numbers.' });
      }
    }
  }

  // description — nullable to allow clearing
  if (description !== undefined && description !== null) {
    const descErr = validateStringField(description, 'Description', 1, 500);
    if (descErr) errors.push({ field: 'description', message: descErr });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for PUT /api/v1/departments/:id.
 */
export const validateUpdateDepartment = [
  validateUpdateDepartmentFields,
  handleValidationErrors,
];

// ─── GET /api/v1/departments (query params) ───────────────────────────────────

/**
 * Middleware: validate query parameters for the department list endpoint.
 *
 * Allowed params:
 *   - page      → positive integer
 *   - limit     → positive integer, max 100
 *   - search    → string, max 100 chars
 *   - isActive  → 'true' | 'false' | 'all'
 *   - sortBy    → one of DEPARTMENT_SORT_FIELDS
 *   - sortOrder → 'asc' | 'desc'
 */
const validateListQueryFields = (req, res, next) => {
  const errors = [];
  const {
    page, limit, search,
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
    } else if (l > DEPARTMENT_PAGINATION.MAX_LIMIT) {
      errors.push({
        field:   'limit',
        message: `limit cannot exceed ${DEPARTMENT_PAGINATION.MAX_LIMIT}.`,
      });
    }
  }

  if (search !== undefined && search.trim().length > 100) {
    errors.push({ field: 'search', message: 'search term cannot exceed 100 characters.' });
  }

  if (isActive !== undefined && !['true', 'false', 'all'].includes(isActive)) {
    errors.push({
      field:   'isActive',
      message: "isActive must be 'true', 'false', or 'all'.",
    });
  }

  if (sortBy !== undefined && !DEPARTMENT_SORT_FIELDS.includes(sortBy)) {
    errors.push({
      field:   'sortBy',
      message: `sortBy must be one of: ${DEPARTMENT_SORT_FIELDS.join(', ')}.`,
    });
  }

  if (sortOrder !== undefined && !DEPARTMENT_SORT_ORDERS.includes(sortOrder)) {
    errors.push({
      field:   'sortOrder',
      message: `sortOrder must be 'asc' or 'desc'.`,
    });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for GET /api/v1/departments.
 */
export const validateListQuery = [
  validateListQueryFields,
  handleValidationErrors,
];

// ─── Route param :id ──────────────────────────────────────────────────────────

/**
 * Middleware: validate that the `req.params.id` is a valid MongoDB ObjectId.
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
 * Usage: router.get('/:id', validateObjectId, getDepartment);
 */
export const validateObjectId = [
  validateObjectIdParam,
  handleValidationErrors,
];
