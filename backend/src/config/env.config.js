import Joi from 'joi';
import 'dotenv/config';
import logger from './logger.config.js';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),
  API_VERSION: Joi.string().default('v1'),
  MONGODB_URI: Joi.string().required().description('MongoDB Connection URI'),
  JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
  JWT_EXPIRES_IN: Joi.string().default('1d').description('JWT Expiration Time'),
  SUPER_ADMIN_EMAIL: Joi.string().email().required().description('Super Admin Email'),
  SUPER_ADMIN_PASSWORD: Joi.string().required().description('Super Admin Password'),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:5173').description('CORS Allowed Origins (comma separated)'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  logger.error(`Config validation error: ${error.message}`);
  process.exit(1); // Exit process if critical env vars are missing
}

export const env = envVars;
