import jwt from 'jsonwebtoken';
import { verifyAccessToken } from './auth.service.js';
import Admin from './auth.model.js';
import { sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import logger from '../../config/logger.config.js';
import {
  extractRequestMeta,
  logAuthMissingToken,
  logAuthEmptyToken,
  logAuthTokenExpired,
  logAuthTokenInvalid,
  logAuthAdminNotFound,
  logAuthAdminInactive,
  logAuthorizationDenied,
} from './auth.logger.js';

/**
 * Authentication Middleware — `authenticate`
 *
 * Reads the JWT from the `Authorization: Bearer <token>` header,
 * verifies it, looks up the admin in the database, and attaches
 * the admin document to `req.admin`.
 *
 * Usage:
 *   router.get('/me', authenticate, getMe);
 */
export const authenticate = async (req, res, next) => {
  try {
    const requestMeta = extractRequestMeta(req);

    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logAuthMissingToken(requestMeta);
      return sendError(res, MESSAGES.TOKEN_MISSING, 401);
    }

    const token = authHeader.split(' ')[1];

    // Guard against a bare 'Bearer ' header with no token value
    if (!token) {
      logAuthEmptyToken(requestMeta);
      return sendError(res, MESSAGES.TOKEN_MISSING, 401);
    }

    // 2. Verify token signature and expiry
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logAuthTokenExpired(requestMeta);
        return sendError(res, MESSAGES.TOKEN_EXPIRED, 401);
      }
      logAuthTokenInvalid(error.message, requestMeta);
      return sendError(res, MESSAGES.TOKEN_INVALID, 401);
    }

    // 3. Confirm the admin still exists and is active
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      logAuthAdminNotFound(decoded.id, requestMeta);
      return sendError(res, MESSAGES.UNAUTHORIZED, 401);
    }

    if (!admin.isActive) {
      logAuthAdminInactive(admin.email, requestMeta);
      return sendError(res, MESSAGES.ACCOUNT_INACTIVE, 403);
    }

    // 4. Attach admin to request for downstream use
    req.admin = admin;
    next();
  } catch (error) {
    logger.error(`Authentication middleware error: ${error.message}`, { stack: error.stack });
    return sendError(res, MESSAGES.SERVER_ERROR, 500);
  }
};

/**
 * Authorization Middleware — `authorize`
 *
 * Role-based access control (RBAC) guard. Must be used AFTER `authenticate`.
 * Accepts one or more allowed roles and blocks access if the authenticated
 * admin's role is not in the list.
 *
 * Usage:
 *   import { ROLES } from '../../constants/index.js';
 *   router.post('/users', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), createUser);
 *
 * @param {...string} allowedRoles - One or more role strings from ROLES constants
 * @returns {import('express').RequestHandler}
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // authenticate() must run first — req.admin must be populated
    if (!req.admin) {
      return sendError(res, MESSAGES.UNAUTHORIZED, 401);
    }

    if (!allowedRoles.includes(req.admin.role)) {
      logAuthorizationDenied(
        { email: req.admin.email, role: req.admin.role },
        allowedRoles,
        extractRequestMeta(req)
      );
      return sendError(res, MESSAGES.FORBIDDEN, 403);
    }

    next();
  };
};
