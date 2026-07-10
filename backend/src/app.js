import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

import corsOptions from './config/cors.config.js';
import logger from './config/logger.config.js';
import serverConfig from './config/server.config.js';
import globalLimiter from './config/rateLimit.config.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger/swagger.config.js';

const app = express();
app.set('trust proxy', 1);

// ─── Core Middleware ──────────────────────────────────────────────────────────

// Set security HTTP headers
app.use(helmet());

// Apply global rate limiting to all requests
app.use(globalLimiter);

// Enable CORS with configured options
app.use(cors(corsOptions));

// Compress response bodies
app.use(compression());

// Parse incoming JSON payloads with size limit
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded payloads (form data)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// HTTP request logger — piped through Winston so all logs go to one place
if (!serverConfig.isTest) {
  app.use(morgan('dev', { stream: logger.stream }));
}

// ─── API Routes ───────────────────────────────────────────────────────────────

// All versioned REST API routes mounted under /api/v1
app.use(`/api/${serverConfig.apiVersion}`, apiRoutes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'NiT Admin API Docs',
}));

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 catch-all for unmatched routes
app.use(notFound);

// Centralized JSON error formatter
app.use(errorHandler);

export default app;
