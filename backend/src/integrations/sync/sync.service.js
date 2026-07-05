import { ProviderFactory } from '../providers/index.js';
import {
  logProviderInitialized,
  logDeviceConnected,
  logDeviceDisconnected,
  logPingSuccessful,
  logSyncStarted,
  logSyncCompleted,
  logSyncFailed,
  logProviderError
} from './sync.logger.js';

/**
 * Sync Service
 * 
 * Orchestrates communication with device providers.
 * Strictly handles integration layer logic, NOT core business logic.
 */
class SyncService {
  
  /**
   * Initialize a connection to a device and return its provider
   * @param {Object} device Device document
   * @returns {Promise<import('../providers/base.provider.js').default>}
   */
  async initializeProvider(device) {
    try {
      const provider = ProviderFactory.getProvider(device);
      logProviderInitialized({ deviceId: device._id, manufacturer: device.manufacturer });
      return provider;
    } catch (error) {
      logProviderError({ deviceId: device?._id, error: error.message });
      throw error;
    }
  }

  /**
   * Connect to a device
   * @param {Object} provider Initialized provider instance
   */
  async connectDevice(provider) {
    try {
      await provider.connect();
      logDeviceConnected({ deviceId: provider.device._id });
    } catch (error) {
      logProviderError({ deviceId: provider.device._id, action: 'connect', error: error.message });
      throw provider.standardizeError(error, true);
    }
  }

  /**
   * Disconnect from a device
   * @param {Object} provider Initialized provider instance
   */
  async disconnectDevice(provider) {
    try {
      await provider.disconnect();
      logDeviceDisconnected({ deviceId: provider.device._id });
    } catch (error) {
      logProviderError({ deviceId: provider.device._id, action: 'disconnect', error: error.message });
      // We often don't throw on disconnect failure to prevent masking main errors
    }
  }

  /**
   * Ping a device
   * @param {Object} provider Initialized provider instance
   */
  async pingDevice(provider) {
    try {
      await provider.ping();
      logPingSuccessful({ deviceId: provider.device._id });
    } catch (error) {
      logProviderError({ deviceId: provider.device._id, action: 'ping', error: error.message });
      throw provider.standardizeError(error, true);
    }
  }

  /**
   * Fetch raw attendance logs from a device
   * @param {Object} provider Initialized provider instance
   * @param {Date} fromTime 
   * @param {Date} toTime 
   * @returns {Promise<Array>} Array of raw logs
   */
  async fetchRawAttendanceLogs(provider, fromTime, toTime) {
    logSyncStarted({ deviceId: provider.device._id, fromTime, toTime });
    try {
      const logs = await provider.fetchAttendanceLogs(fromTime, toTime);
      logSyncCompleted({ deviceId: provider.device._id, logCount: logs.length });
      return logs;
    } catch (error) {
      logSyncFailed({ deviceId: provider.device._id, error: error.message });
      throw provider.standardizeError(error, true);
    }
  }
}

export default new SyncService();
