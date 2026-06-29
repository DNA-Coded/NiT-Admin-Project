/**
 * Auth Logger Utility
 *
 * Single source of truth for all authentication-related log events.
 * Every emitted entry follows a consistent, machine-readable JSON shape:
 *
 *   {
 *     "level":     "info" | "warn" | "error",
 *     "message":   "EVENT_NAME",          ← SCREAMING_SNAKE_CASE event key
 *     "authEvent": true,                  ← enables log-aggregator filtering
 *     "outcome":   "success" | "failure",
 *     "reason":    "...",                 ← failure reason (omitted on success)
 *     "email":     "...",                 ← admin email when known
 *     "role":      "...",                 ← admin role when known
 *     "method":    "POST",               ← HTTP verb
 *     "path":      "/api/v1/auth/login", ← request path
 *     "ip":        "...",                 ← client IP (respects X-Forwarded-For)
 *     "userAgent": "...",
 *     "service":   "nit-admin-backend",  ← injected by Winston defaultMeta
 *     "timestamp": "..."                 ← injected by Winston transport
 *   }
 *
 * Rules enforced here:
 *   ✗  Never log passwords
 *   ✗  Never log JWT tokens or signing secrets
 *   ✗  Never log full request bodies
 *   ✓  Log only the fields explicitly listed above
 */

import logger from '../../config/logger.config.js';

// ─── Request metadata extractor ───────────────────────────────────────────────

/**
 * Safely extract loggable metadata from an Express request object.
 * Falls back gracefully when `req` or individual headers are absent
 * (e.g. when the utility is used from contexts without a live req).
 *
 * @param {import('express').Request} [req={}]
 * @returns {{ method: string, path: string, ip: string, userAgent: string }}
 */
export const extractRequestMeta = (req = {}) => {
  // Respect reverse-proxy forwarding — take only the first (client) IP
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.ip ?? req.socket?.remoteAddress ?? 'unknown';

  return {
    method:    req.method                    ?? 'UNKNOWN',
    path:      req.originalUrl ?? req.url    ?? 'unknown',
    ip,
    userAgent: req.headers?.['user-agent']   ?? 'unknown',
  };
};

// ─── Core emitter ─────────────────────────────────────────────────────────────

/**
 * Internal — emit a structured auth event through Winston.
 * All public log functions in this module call this.
 *
 * @param {'info'|'warn'|'error'} level
 * @param {string} event   - Short event identifier (SCREAMING_SNAKE_CASE)
 * @param {object} [meta]  - Contextual fields to attach
 */
const emit = (level, event, meta = {}) => {
  // Winston serialises the second argument as JSON metadata alongside `message`
  logger[level](event, { authEvent: true, ...meta });
};

// ─── Login events ─────────────────────────────────────────────────────────────

/**
 * Successful admin login.
 * @param {{ email: string, role: string }} admin
 * @param {object} [requestMeta]
 */
export const logLoginSuccess = ({ email, role }, requestMeta = {}) =>
  emit('info', 'LOGIN_SUCCESS', {
    outcome: 'success',
    email,
    role,
    ...requestMeta,
  });

/**
 * Login failed — no admin record found for the supplied email.
 * Uses the same external message as invalid password to prevent user enumeration.
 * @param {string} email
 * @param {object} [requestMeta]
 */
export const logLoginFailedNotFound = (email, requestMeta = {}) =>
  emit('warn', 'LOGIN_FAILED', {
    outcome: 'failure',
    reason:  'admin_not_found',
    email,
    ...requestMeta,
  });

/**
 * Login failed — bcrypt comparison returned false.
 * @param {string} email
 * @param {object} [requestMeta]
 */
export const logLoginFailedPassword = (email, requestMeta = {}) =>
  emit('warn', 'LOGIN_FAILED', {
    outcome: 'failure',
    reason:  'invalid_password',
    email,
    ...requestMeta,
  });

/**
 * Login rejected — the admin account exists but is deactivated.
 * @param {string} email
 * @param {object} [requestMeta]
 */
export const logLoginInactiveAccount = (email, requestMeta = {}) =>
  emit('warn', 'LOGIN_INACTIVE_ACCOUNT', {
    outcome: 'failure',
    reason:  'account_inactive',
    email,
    ...requestMeta,
  });

// ─── Middleware: authenticate() events ────────────────────────────────────────

/**
 * Authorization header absent or does not start with "Bearer ".
 * @param {object} [requestMeta]
 */
export const logAuthMissingToken = (requestMeta = {}) =>
  emit('warn', 'AUTH_MISSING_TOKEN', {
    outcome: 'failure',
    reason:  'missing_or_malformed_authorization_header',
    ...requestMeta,
  });

/**
 * Authorization header present but token value is empty after "Bearer ".
 * @param {object} [requestMeta]
 */
export const logAuthEmptyToken = (requestMeta = {}) =>
  emit('warn', 'AUTH_EMPTY_TOKEN', {
    outcome: 'failure',
    reason:  'empty_token_after_bearer_prefix',
    ...requestMeta,
  });

/**
 * JWT signature is valid but the token has passed its expiry time.
 * @param {object} [requestMeta]
 */
export const logAuthTokenExpired = (requestMeta = {}) =>
  emit('warn', 'AUTH_TOKEN_EXPIRED', {
    outcome: 'failure',
    reason:  'token_expired',
    ...requestMeta,
  });

/**
 * JWT could not be verified — bad signature, wrong algorithm, malformed payload, etc.
 * @param {string} detail  - Error message from jsonwebtoken (never includes the token itself)
 * @param {object} [requestMeta]
 */
export const logAuthTokenInvalid = (detail, requestMeta = {}) =>
  emit('warn', 'AUTH_TOKEN_INVALID', {
    outcome: 'failure',
    reason:  'invalid_or_malformed_token',
    detail,
    ...requestMeta,
  });

/**
 * Token is structurally valid but the embedded admin _id no longer exists in DB.
 * @param {string} tokenId  - The `id` claim from the decoded token
 * @param {object} [requestMeta]
 */
export const logAuthAdminNotFound = (tokenId, requestMeta = {}) =>
  emit('warn', 'AUTH_ADMIN_NOT_FOUND', {
    outcome: 'failure',
    reason:  'admin_not_found_for_token',
    tokenId,
    ...requestMeta,
  });

/**
 * Token is valid and admin exists, but the account has been deactivated
 * since the token was issued.
 * @param {string} email
 * @param {object} [requestMeta]
 */
export const logAuthAdminInactive = (email, requestMeta = {}) =>
  emit('warn', 'AUTH_ADMIN_INACTIVE', {
    outcome: 'failure',
    reason:  'account_inactive',
    email,
    ...requestMeta,
  });

// ─── Logout event ─────────────────────────────────────────────────────────────

/**
 * Admin initiated logout (stateless — token is discarded client-side).
 * @param {{ email: string, role: string }} admin
 * @param {object} [requestMeta]
 */
export const logLogout = ({ email, role }, requestMeta = {}) =>
  emit('info', 'LOGOUT_SUCCESS', {
    outcome: 'success',
    email,
    role,
    ...requestMeta,
  });

// ─── Middleware: authorize() events ───────────────────────────────────────────

/**
 * Admin is authenticated but their role is not in the allowed list for the route.
 * @param {{ email: string, role: string }} admin
 * @param {string[]} allowedRoles
 * @param {object} [requestMeta]
 */
export const logAuthorizationDenied = ({ email, role }, allowedRoles, requestMeta = {}) =>
  emit('warn', 'AUTHORIZATION_DENIED', {
    outcome:      'failure',
    reason:       'insufficient_role',
    email,
    role,
    allowedRoles,
    ...requestMeta,
  });
