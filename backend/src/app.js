import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import corsOptions from './config/cors.config.js';
import logger from './config/logger.config.js';
import serverConfig from './config/server.config.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger/swagger.config.js';

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────

// Enable CORS with configured options
app.use(cors(corsOptions));

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads (form data)
app.use(express.urlencoded({ extended: true }));

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
