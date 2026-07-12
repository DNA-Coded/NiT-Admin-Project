/**
 * CORS Configuration
 * Reads allowed origins from environment to support multiple environments
 * (local dev, staging, production) without code changes.
 */

import { env } from './env.config.js';

const envOrigins = env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());

const allowedOrigins = [...envOrigins, `http://localhost:${env.PORT}`];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

export default corsOptions;
