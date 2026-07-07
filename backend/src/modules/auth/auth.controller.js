import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { loginAdmin } from './auth.service.js';
import { extractRequestMeta, logLogout } from './auth.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

/**
 * Auth Controller
 *
 * Thin layer — receives validated request data, delegates to the service layer,
 * and returns standardized HTTP responses. No business logic lives here.
 */

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
/**
 * @desc    Authenticate an admin and return a JWT access token
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @middleware validateLogin (auth.validator.js)
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Extract request context once and pass it to the service so that all
  // login event logs (success, failure, inactive) include full request metadata.
  const requestMeta = extractRequestMeta(req);

  try {
    const { accessToken, admin } = await loginAdmin(email, password, requestMeta);

    return sendSuccess(
      res,
      { accessToken, admin },
      MESSAGES.LOGIN_SUCCESS,
      200
    );
  } catch (err) {
    // Only handle typed auth errors (401 / 403) here.
    // The service already logged the specific failure with full request metadata.
    // Unexpected errors (no statusCode) are re-thrown so the global
    // errorHandler can log the stack trace and return a proper 500.
    if (!err.statusCode) throw err;

    return sendError(res, err.message, err.statusCode);
  }
});

// ─── POST /api/v1/auth/logout ─────────────────────────────────────────────────
/**
 * @desc    End the current admin session (stateless JWT — client discards token)
 * @route   POST /api/v1/auth/logout
 * @access  Protected (authenticate middleware)
 */
export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless: no server-side session to invalidate.
  // The client is responsible for discarding the token.
  // Token blacklisting / refresh-token revocation are out of scope for this phase.
  const requestMeta = extractRequestMeta(req);
  const adminEmail = req.admin?.email ?? 'unknown';

  logLogout(
    { email: adminEmail, role: req.admin?.role ?? 'unknown' },
    requestMeta
  );

  if (req.admin?._id) {
    activityService.recordActivity({
      module: ACTIVITY_MODULES.AUTH,
      action: ACTIVITY_ACTIONS.LOGOUT,
      description: `Logout for ${adminEmail}`,
      performedBy: req.admin._id,
      metadata: { role: req.admin.role, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});
  }

  return sendSuccess(res, null, MESSAGES.LOGOUT_SUCCESS, 200);
});

// ─── GET /api/v1/auth/me ──────────────────────────────────────────────────────
/**
 * @desc    Return the currently authenticated admin's public profile
 * @route   GET /api/v1/auth/me
 * @access  Protected (authenticate middleware)
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.admin is populated and verified (active, exists) by authenticate middleware.
  // toPublicJSON() strips the password and returns only safe fields.
  return sendSuccess(
    res,
    req.admin.toPublicJSON(),
    MESSAGES.SUCCESS,
    200
  );
});
