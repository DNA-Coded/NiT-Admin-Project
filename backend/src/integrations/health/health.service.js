import Device from '../../modules/devices/device.model.js';
import { DEVICE_HEALTH_STATUS } from './health.constants.js';
import { MESSAGES } from '../../constants/index.js';
import {
  logHeartbeatReceived,
  logDeviceOnline,
  logDeviceOffline,
  logHealthStatusChanged,
  logDeviceErrorRecorded,
  logFailureCountUpdated,
  logHealthReset,
} from './health.logger.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

class HealthService {
  
  /**
   * Validate that device exists and is active
   */
  async _assertValidDevice(deviceId) {
    const device = await Device.findById(deviceId);
    if (!device) throw makeError(MESSAGES.DEVICE_NOT_FOUND, 404);
    if (!device.isActive) throw makeError('The referenced device is inactive.', 422);
    return device;
  }

  /**
   * Calculate uptime and downtime incrementally based on previous state
   */
  _calculateTimeDeltas(device, now) {
    if (!device.lastHealthCheck) return; // First time

    const diffInSeconds = Math.floor((now.getTime() - device.lastHealthCheck.getTime()) / 1000);
    
    if (device.healthStatus === DEVICE_HEALTH_STATUS.HEALTHY || device.healthStatus === DEVICE_HEALTH_STATUS.WARNING) {
      device.uptime += diffInSeconds;
    } else {
      device.downtime += diffInSeconds;
    }
  }

  /**
   * Get overall health summary of all active devices
   */
  async getAllDevicesHealth() {
    const devices = await Device.find({ isActive: true })
      .select('deviceCode deviceName healthStatus lastHeartbeat lastSeen failureCount uptime downtime')
      .lean();
    
    return devices;
  }

  /**
   * Get health specific to one device
   */
  async getDeviceHealth(deviceId) {
    const device = await this._assertValidDevice(deviceId);
    return device.toPublicJSON(); // Includes new health fields
  }

  /**
   * Record a heartbeat from a device
   */
  async updateHeartbeat(deviceId) {
    const device = await this._assertValidDevice(deviceId);
    const now = new Date();
    
    this._calculateTimeDeltas(device, now);

    const oldStatus = device.healthStatus;
    
    device.lastHeartbeat = now;
    device.lastSeen = now;
    device.lastHealthCheck = now;
    device.healthStatus = DEVICE_HEALTH_STATUS.HEALTHY;
    device.failureCount = 0; // Reset consecutive failures on successful heartbeat

    await device.save();

    logHeartbeatReceived({ deviceId, deviceCode: device.deviceCode });

    if (oldStatus !== DEVICE_HEALTH_STATUS.HEALTHY) {
      logDeviceOnline({ deviceId, deviceCode: device.deviceCode, previousStatus: oldStatus });
      logHealthStatusChanged({ deviceId, oldStatus, newStatus: DEVICE_HEALTH_STATUS.HEALTHY });
    }

    return device.toPublicJSON();
  }

  /**
   * Manually override or update health status
   */
  async updateStatus(deviceId, newStatus, adminEmail = 'system') {
    const device = await this._assertValidDevice(deviceId);
    const now = new Date();
    
    this._calculateTimeDeltas(device, now);

    const oldStatus = device.healthStatus;
    device.healthStatus = newStatus.toUpperCase();
    device.lastHealthCheck = now;
    device.updatedBy = adminEmail;

    await device.save();

    logHealthStatusChanged({ deviceId, oldStatus, newStatus: device.healthStatus, updatedBy: adminEmail });
    
    if (newStatus === DEVICE_HEALTH_STATUS.OFFLINE) {
      logDeviceOffline({ deviceId, deviceCode: device.deviceCode });
    }

    return device.toPublicJSON();
  }

  /**
   * Record a specific error that occurred on the device
   */
  async recordError(deviceId, errorMessage, adminEmail = 'system') {
    const device = await this._assertValidDevice(deviceId);
    const now = new Date();
    
    this._calculateTimeDeltas(device, now);

    const oldStatus = device.healthStatus;
    device.lastError = errorMessage;
    device.healthStatus = DEVICE_HEALTH_STATUS.ERROR;
    device.failureCount += 1;
    device.lastHealthCheck = now;
    device.updatedBy = adminEmail;

    await device.save();

    logDeviceErrorRecorded({ deviceId, error: errorMessage });
    logFailureCountUpdated({ deviceId, failureCount: device.failureCount });

    if (oldStatus !== DEVICE_HEALTH_STATUS.ERROR) {
      logHealthStatusChanged({ deviceId, oldStatus, newStatus: DEVICE_HEALTH_STATUS.ERROR });
    }

    return device.toPublicJSON();
  }

  /**
   * Reset the health metrics and failure count for a device
   */
  async resetHealthMetrics(deviceId, adminEmail = 'system') {
    const device = await this._assertValidDevice(deviceId);
    const now = new Date();

    device.failureCount = 0;
    device.uptime = 0;
    device.downtime = 0;
    device.lastError = null;
    device.healthStatus = DEVICE_HEALTH_STATUS.HEALTHY;
    device.lastHealthCheck = now;
    device.updatedBy = adminEmail;

    await device.save();

    logHealthReset({ deviceId, updatedBy: adminEmail });
    
    return device.toPublicJSON();
  }

  /**
   * Increment failure count automatically without explicit error message
   */
  async incrementFailureCount(deviceId) {
    const device = await this._assertValidDevice(deviceId);
    const now = new Date();

    this._calculateTimeDeltas(device, now);

    device.failureCount += 1;
    device.lastHealthCheck = now;

    // Auto-downgrade status based on threshold (e.g. 3 consecutive fails = OFFLINE)
    const oldStatus = device.healthStatus;
    if (device.failureCount >= 3) {
      device.healthStatus = DEVICE_HEALTH_STATUS.OFFLINE;
    } else {
      device.healthStatus = DEVICE_HEALTH_STATUS.WARNING;
    }

    await device.save();

    logFailureCountUpdated({ deviceId, failureCount: device.failureCount });
    
    if (oldStatus !== device.healthStatus) {
      logHealthStatusChanged({ deviceId, oldStatus, newStatus: device.healthStatus });
    }

    return device.toPublicJSON();
  }
}

export default new HealthService();
