import jwt from 'jsonwebtoken';
import jwtConfig from '../../config/jwt.config.js';
import logger from '../../config/logger.config.js';
import Admin from './auth.model.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logLoginSuccess,
  logLoginFailedNotFound,
  logLoginFailedPassword,
  logLoginInactiveAccount,
} from './auth.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

/**
 * Auth Service
 *
 * Contains all auth business logic:
 *   - JWT generation and verification (stateless helpers)
 *   - loginAdmin   — credential verification, session bookkeeping
 */

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

/**
 * Generate a signed JWT access token for an authenticated admin.
 *
 * @param {object} payload - Data to embed in the token
 * @param {string} payload.id    - Admin document _id
 * @param {string} payload.email - Admin email address
 * @param {string} payload.role  - Admin role string
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Verify and decode a JWT access token.
 *
 * @param {string} token - JWT string to verify
 * @returns {{ id: string, email: string, role: string, iat: number, exp: number }}
 * @throws {jwt.TokenExpiredError} If the token has expired
 * @throws {jwt.JsonWebTokenError} If the token is invalid or malformed
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    logger.warn(`JWT verification failed: ${error.message}`);
    throw error;
  }
};

// ─── Business Logic ───────────────────────────────────────────────────────────

/**
 * Authenticate an admin with email and password.
 *
 * Steps:
 *   1. Look up the admin by email — explicitly select `password` (excluded by default).
 *   2. Reject unknown email (avoid user enumeration — same response as wrong password).
 *   3. Reject inactive accounts before bcrypt to prevent timing oracle.
 *   4. Verify the candidate password against the stored bcrypt hash.
 *   5. Update `lastLogin` timestamp.
 *   6. Generate and return a signed access token + public profile.
 *
 * @param {string} email             - Admin email from request body
 * @param {string} candidatePassword - Plaintext password from request body
 * @param {object} [requestMeta={}]  - Structured request context for logging only
 *                                     (method, path, ip, userAgent — injected by controller)
 * @returns {Promise<{ accessToken: string, admin: object }>}
 * @throws {Error} with a `statusCode` property for known auth failures
 */
export const loginAdmin = async (email, candidatePassword, requestMeta = {}) => {
  // 1. Find admin — password field is excluded by schema default, so select it explicitly
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!admin) {
    logLoginFailedNotFound(email, requestMeta);
    activityService.recordActivity({
      module: ACTIVITY_MODULES.AUTH,
      action: ACTIVITY_ACTIONS.LOGIN,
      description: `Failed login attempt (email not found) for ${email}`,
      metadata: { email, ...requestMeta },
      status: ACTIVITY_STATUS.FAILED,
      severity: ACTIVITY_SEVERITY.MEDIUM
    }).catch(() => {});
    const err = new Error(MESSAGES.INVALID_CREDENTIALS);
    err.statusCode = 401;
    throw err;
  }

  // 3. Reject inactive accounts before running bcrypt — avoids leaking whether
  //    the password is correct for a disabled account via timing differences.
  if (!admin.isActive) {
    logLoginInactiveAccount(admin.email, requestMeta);
    activityService.recordActivity({
      module: ACTIVITY_MODULES.AUTH,
      action: ACTIVITY_ACTIONS.LOGIN,
      description: `Failed login attempt (inactive account) for ${admin.email}`,
      performedBy: admin._id,
      metadata: { email: admin.email, ...requestMeta },
      status: ACTIVITY_STATUS.FAILED,
      severity: ACTIVITY_SEVERITY.MEDIUM
    }).catch(() => {});
    const err = new Error(MESSAGES.ACCOUNT_INACTIVE);
    err.statusCode = 403;
    throw err;
  }

  // 4. Verify password
  const isPasswordValid = await admin.comparePassword(candidatePassword);
  if (!isPasswordValid) {
    logLoginFailedPassword(admin.email, requestMeta);
    activityService.recordActivity({
      module: ACTIVITY_MODULES.AUTH,
      action: ACTIVITY_ACTIONS.LOGIN,
      description: `Failed login attempt (invalid password) for ${admin.email}`,
      performedBy: admin._id,
      metadata: { email: admin.email, ...requestMeta },
      status: ACTIVITY_STATUS.FAILED,
      severity: ACTIVITY_SEVERITY.MEDIUM
    }).catch(() => {});
    const err = new Error(MESSAGES.INVALID_CREDENTIALS);
    err.statusCode = 401;
    throw err;
  }

  // 5. Record the current login timestamp and persist it asynchronously.
  //    We set it on the local document first so toPublicJSON() returns the
  //    up-to-date value rather than the stale pre-update timestamp.
  const now = new Date();
  admin.lastLogin = now;
  Admin.findByIdAndUpdate(admin._id, { lastLogin: now }).exec().catch((updateErr) => {
    logger.error(`Failed to update lastLogin for ${admin.email}: ${updateErr.message}`);
  });

  // 6. Generate access token
  const accessToken = generateAccessToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
  });

  logLoginSuccess({ email: admin.email, role: admin.role }, requestMeta);

  activityService.recordActivity({
    module: ACTIVITY_MODULES.AUTH,
    action: ACTIVITY_ACTIONS.LOGIN,
    description: `Successful login for ${admin.email}`,
    performedBy: admin._id,
    metadata: { role: admin.role, ...requestMeta },
    status: ACTIVITY_STATUS.SUCCESS,
    severity: ACTIVITY_SEVERITY.LOW
  }).catch(() => {});

  return {
    accessToken,
    admin: admin.toPublicJSON(),
  };
};

