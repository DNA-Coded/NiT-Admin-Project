import { createLogger, format, transports } from 'winston';
import config from '../../config/index.js';

const { combine, timestamp, printf, errors } = format;

const healthFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let logMessage = `[${timestamp}] ${level.toUpperCase()} [DEVICE_HEALTH]: ${message}`;
  
  if (Object.keys(meta).length > 0) {
    const sanitizedMeta = { ...meta };
    // Strict sanitation
    delete sanitizedMeta.credentials;
    delete sanitizedMeta.password;
    delete sanitizedMeta.rawPayload;
    delete sanitizedMeta.attendanceIdentity;
    delete sanitizedMeta.biometricTemplate;
    
    logMessage += ` | META: ${JSON.stringify(sanitizedMeta)}`;
  }
  
  if (stack) {
    logMessage += `\n${stack}`;
  }
  return logMessage;
});

const healthLogger = createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    healthFormat
  ),
  transports: [
    new transports.Console(),
  ],
});

export const logHeartbeatReceived = (meta) => {
  healthLogger.info('Heartbeat received', meta);
};

export const logDeviceOnline = (meta) => {
  healthLogger.info('Device is online', meta);
};

export const logDeviceOffline = (meta) => {
  healthLogger.warn('Device is offline', meta);
};

export const logHealthStatusChanged = (meta) => {
  healthLogger.info('Health status changed', meta);
};

export const logDeviceErrorRecorded = (meta) => {
  healthLogger.error('Device error recorded', meta);
};

export const logFailureCountUpdated = (meta) => {
  healthLogger.warn('Failure count updated', meta);
};

export const logHealthReset = (meta) => {
  healthLogger.info('Health metrics reset', meta);
};

export default healthLogger;
