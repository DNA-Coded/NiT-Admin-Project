import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to src/logs directory (two levels up from src/config)
const logsDir = path.resolve(__dirname, '../logs');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Human-readable format for development console output
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// Structured JSON format for production file output
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  defaultMeta: { service: 'nit-admin-backend' },
  transports: [
    // Console transport — always active
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    }),
    // File transport — errors only
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: prodFormat,
    }),
    // File transport — all levels combined
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: prodFormat,
    }),
  ],
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Morgan stream — pipes HTTP request logs through Winston at 'http' level
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
