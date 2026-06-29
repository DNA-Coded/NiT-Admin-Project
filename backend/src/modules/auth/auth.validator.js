/**
 * Auth Validators
 *
 * Validates request body fields for auth endpoints.
 * Each export is an Express middleware array: place it between the route path
 * and the controller handler.
 *
 * Pattern:
 *   router.post('/login', validateLogin, login);
 *
 * Validation errors are collected into `req.validationErrors` and flushed to
 * a 422 response by `handleValidationErrors` (last item in each array).
 */

import { handleValidationErrors } from '../../validators/index.js';

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────

/**
 * Middleware: validate the email and password fields for login.
 *
 * Rules:
 *   - email   → required, must be a non-empty string, basic format check
 *   - password → required, must be a non-empty string
 */
const validateLoginFields = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body ?? {};

  // email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  }

  // password
  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  req.validationErrors = errors;
  next();
};

/**
 * Middleware array for POST /api/v1/auth/login.
 * Usage: router.post('/login', validateLogin, login);
 */
export const validateLogin = [validateLoginFields, handleValidationErrors];

