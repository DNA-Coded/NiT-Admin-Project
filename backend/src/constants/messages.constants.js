/**
 * Messages Constants
 *
 * Centralized string constants for API response messages.
 * Using constants prevents typos and makes message management easier.
 */
export const MESSAGES = Object.freeze({
  // Generic
  SUCCESS: 'Operation completed successfully.',
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',

  // Resource-specific
  NOT_FOUND: (resource = 'Resource') => `${resource} not found.`,
  ALREADY_EXISTS: (resource = 'Resource') => `${resource} already exists.`,
  INVALID_ID: 'The provided ID is invalid.',

  // Validation
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  MISSING_FIELDS: 'Required fields are missing.',

  // Auth
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid or malformed token.',
  TOKEN_MISSING: 'No token provided. Please log in.',
  ACCOUNT_INACTIVE: 'Your account has been deactivated. Contact the administrator.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',

  // Health
  HEALTH_OK: 'Server is healthy.',
});
