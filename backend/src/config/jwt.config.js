/**
 * JWT Configuration
 *
 * Centralises all JWT-related environment variables.
 * Consumed exclusively by `src/modules/auth/auth.service.js`.
 */
import { env } from './env.config.js';

export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};

export default jwtConfig;
