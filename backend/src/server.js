import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.config.js';
import serverConfig from './config/server.config.js';

// Connect to MongoDB Database
connectDB();

// ─── Start HTTP Server ────────────────────────────────────────────────────────
const server = app.listen(serverConfig.port, () => {
  logger.info(`Server running in ${serverConfig.nodeEnv} mode on port ${serverConfig.port}`);
  logger.info(`API available at: http://localhost:${serverConfig.port}/api/${serverConfig.apiVersion}`);
});

// ─── Process-Level Error Guards ───────────────────────────────────────────────

// Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});

// Graceful shutdown on uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});
