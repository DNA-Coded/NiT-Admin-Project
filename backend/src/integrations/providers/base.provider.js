/**
 * Base Provider
 * 
 * Abstract base class for all biometric device integrations.
 * Every specific vendor provider (e.g., SecureEye, ZKTeco) MUST extend this
 * class and implement its abstract methods.
 */
class BaseProvider {
  constructor(device) {
    if (new.target === BaseProvider) {
      throw new TypeError('Cannot construct BaseProvider instances directly');
    }
    this.device = device;
  }

  /**
   * Initialize provider configuration (e.g. credentials, connection settings)
   * @param {Object} config Optional configuration parameters
   * @returns {Promise<boolean>}
   */
  async initialize(config = {}) {
    throw new Error('Method initialize() must be implemented');
  }

  /**
   * Initialize connection with the device
   * @returns {Promise<boolean>}
   */
  async connect() {
    throw new Error('Method connect() must be implemented');
  }

  /**
   * Terminate connection with the device
   * @returns {Promise<boolean>}
   */
  async disconnect() {
    throw new Error('Method disconnect() must be implemented');
  }

  /**
   * Check if device is reachable
   * @returns {Promise<boolean>}
   */
  async ping() {
    throw new Error('Method ping() must be implemented');
  }

  /**
   * Get basic device info (firmware, model, etc)
   * @returns {Promise<Object>}
   */
  async getDeviceInfo() {
    throw new Error('Method getDeviceInfo() must be implemented');
  }

  /**
   * Fetch attendance logs from the device
   * @param {Date} fromTime
   * @param {Date} toTime
   * @returns {Promise<Array>} Array of raw log objects
   */
  async fetchAttendanceLogs(fromTime, toTime) {
    throw new Error('Method fetchAttendanceLogs() must be implemented');
  }

  /**
   * Fetch all users from the device
   * @returns {Promise<Array>}
   */
  async fetchUsers() {
    throw new Error('Method fetchUsers() must be implemented');
  }

  /**
   * Push users to the device
   * @param {Array} users 
   * @returns {Promise<Object>} Status of operation
   */
  async pushUsers(users) {
    throw new Error('Method pushUsers() must be implemented');
  }

  /**
   * Clear attendance logs from the device memory
   * @returns {Promise<boolean>}
   */
  async clearAttendanceLogs() {
    throw new Error('Method clearAttendanceLogs() must be implemented');
  }

  /**
   * Normalize successful responses into a standard format
   * @param {string} operation The name of the operation
   * @param {any} data The resulting data
   * @param {Object} metadata Any additional metadata
   * @returns {Object} Standardized success response
   */
  standardizeResponse(operation, data = null, metadata = {}) {
    return {
      success: true,
      provider: this.constructor.name,
      operation,
      data,
      metadata
    };
  }

  /**
   * Normalize errors into a standard format
   * @param {Error|Object} error 
   * @param {boolean} retryable 
   * @returns {Object} Standardized error object
   */
  standardizeError(error, retryable = false) {
    return {
      success: false,
      provider: this.constructor.name,
      code: error.code || 'UNKNOWN_PROVIDER_ERROR',
      message: error.message || 'An unknown error occurred with the device provider.',
      retryable
    };
  }
}

export default BaseProvider;
