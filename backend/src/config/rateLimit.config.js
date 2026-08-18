import rateLimit from 'express-rate-limit';

// Determine if we are working inside a local development profile environment
const isDev = process.env.NODE_ENV === 'development';

/**
 * Global API Rate Limiter
 * Limits each IP to prevent DDoS and brute force tracking metrics.
 */
const globalLimiter = rateLimit({
  // Fixed: Evaluates to a clean 15 minutes instead of zero
  windowMs: 15 * 60 * 1000, 
  
  // Loosens up the threshold during development to prevent dashboard layout locks
  limit: isDev ? 999999 : 100, 
  
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export default globalLimiter;