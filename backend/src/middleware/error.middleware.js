import logger from '../config/logger.config.js';
import { sendError } from '../helpers/index.js';
import { MESSAGES } from '../constants/index.js';

/**
 * 404 Not Found Middleware
 * Catch-all for any request that doesn't match a defined route.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Error Handler Middleware
 *
 * Formats all errors passed via next(err) into the standardized API envelope:
 *   { success: false, message: string, data: errorDetails | null }
 *
 * Stack traces are included in `data` in development, omitted in production.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // Log server errors (5xx) at error level, client errors (4xx) at warn
  if (statusCode >= 500) {
    logger.error(`${statusCode} — ${err.message}`, { stack: err.stack, url: req.originalUrl });
  } else {
    logger.warn(`${statusCode} — ${err.message}`, { url: req.originalUrl });
  }

  const errorDetails =
    process.env.NODE_ENV !== 'production'
      ? { stack: err.stack }
      : null;

  return sendError(res, err.message || MESSAGES.SERVER_ERROR, statusCode, errorDetails);
};
