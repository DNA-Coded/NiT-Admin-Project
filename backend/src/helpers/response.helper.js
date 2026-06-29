/**
 * Response Helper
 *
 * Provides standardized response factory functions used across all controllers.
 * Every API response follows the same envelope structure:
 *
 *   {
 *     "success": boolean,
 *     "message": string,
 *     "data": any | null
 *   }
 */

/**
 * Send a successful JSON response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {any}    data       - Payload to include in the `data` field
 * @param {string} message    - Human-readable success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error JSON response.
 *
 * @param {import('express').Response} res    - Express response object
 * @param {string} message                    - Human-readable error message
 * @param {number} statusCode                 - HTTP status code (default: 500)
 * @param {any}    errors                     - Optional error details / validation errors
 */
export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: errors,
  });
};
