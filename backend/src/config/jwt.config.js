/**
 * JWT Configuration
 *
 * Centralises all JWT-related environment variables.
 * Consumed exclusively by `src/modules/auth/auth.service.js`.
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev_secret_replace_in_production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
};

export default jwtConfig;
