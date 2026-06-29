import mongoose from 'mongoose';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';

/**
 * @desc    Get system health status
 * @route   GET /api/v1/health
 * @access  Public
 */
export const getHealth = asyncHandler(async (req, res) => {
  // Mongoose connection state: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStateCode = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const data = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    services: {
      database: {
        status: dbStateCode === 1 ? 'UP' : 'DOWN',
        state: dbStates[dbStateCode] || 'unknown',
      },
    },
  };

  return sendSuccess(res, data, MESSAGES.HEALTH_OK);
});
