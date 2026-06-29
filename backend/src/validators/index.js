/**
 * Validators — Barrel Export & Shared Utilities
 *
 * Provides a shared `handleValidationErrors` middleware consumed by all
 * feature-specific validator arrays. Each validator populates `req.validationErrors`
 * with an array of `{ field, message }` objects; this handler sends the unified
 * 422 response if any errors exist.
 *
 * Individual validator arrays export from their feature's `*.validator.js` file
 * and are re-exported here for convenience.
 */

import { sendError } from '../helpers/index.js';
import { MESSAGES } from '../constants/index.js';

/**
 * Shared validation error handler — always used as the LAST item in a
 * validator middleware array.
 *
 * Validators upstream should push objects of shape { field, message } into
 * `req.validationErrors` (initialised by the first validator in the chain).
 *
 * @type {import('express').RequestHandler}
 */
export const handleValidationErrors = (req, res, next) => {
  if (req.validationErrors && req.validationErrors.length > 0) {
    return sendError(res, MESSAGES.VALIDATION_ERROR, 422, req.validationErrors);
  }
  next();
};

// ─── Feature validator re-exports ─────────────────────────────────────────────
// Add new feature validators here as each module is built:
//   export { validateLogin } from '../modules/auth/auth.validator.js';

