import { createLogger, format, transports } from 'winston';

/**
 * Integration Sync Logger
 * 
 * Used specifically for logging integration layer events.
 * Strips out sensitive biometric data (templates) or credentials.
 */

const syncLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'integration-sync' },
  transports: [
    new transports.File({ filename: 'logs/sync-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/sync.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  syncLogger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

export const logProviderInitialized = (meta) => syncLogger.info('Provider initialized', { ...meta });
export const logDeviceConnected = (meta) => syncLogger.info('Device connected', { ...meta });
export const logDeviceDisconnected = (meta) => syncLogger.info('Device disconnected', { ...meta });
export const logPingSuccessful = (meta) => syncLogger.info('Ping successful', { ...meta });
export const logSyncStarted = (meta) => syncLogger.info('Sync started', { ...meta });
export const logSyncCompleted = (meta) => syncLogger.info('Sync completed', { ...meta });
export const logSyncFailed = (meta) => syncLogger.error('Sync failed', { ...meta });
export const logProviderError = (meta) => syncLogger.error('Provider error', { ...meta });

export default syncLogger;
