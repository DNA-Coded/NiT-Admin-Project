import { createLogger, format, transports } from 'winston';
import config from '../../config/index.js';

const { combine, timestamp, printf, errors } = format;

const rawEventFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let logMessage = `[${timestamp}] ${level.toUpperCase()} [RAW_EVENT_PIPELINE]: ${message}`;
  
  if (Object.keys(meta).length > 0) {
    // Sanitize meta before logging (never log biometrics or full identity strings)
    const sanitizedMeta = { ...meta };
    if (sanitizedMeta.attendanceIdentity) delete sanitizedMeta.attendanceIdentity;
    if (sanitizedMeta.biometricTemplate) delete sanitizedMeta.biometricTemplate;
    
    logMessage += ` | META: ${JSON.stringify(sanitizedMeta)}`;
  }
  
  if (stack) {
    logMessage += `\n${stack}`;
  }
  return logMessage;
});

const rawEventLogger = createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    rawEventFormat
  ),
  transports: [
    new transports.Console(),
  ],
});

export const logEventReceived = (meta) => {
  rawEventLogger.info('Event received from integration layer', meta);
};

export const logEventNormalized = (meta) => {
  rawEventLogger.debug('Event normalized', meta);
};

export const logEventProcessed = (meta) => {
  rawEventLogger.info('Event successfully processed into Attendance record', meta);
};

export const logDuplicateEvent = (meta) => {
  rawEventLogger.warn('Duplicate event detected and dropped', meta);
};

export const logProcessingFailed = (error, meta) => {
  rawEventLogger.error(`Processing failed: ${error.message}`, { ...meta, stack: error.stack });
};

export default rawEventLogger;
