/**
 * Attendance Mapper
 * 
 * Maps raw provider-specific logs into a standardized Event format
 * that the core Attendance Engine can understand.
 */

class AttendanceMapper {
  
  /**
   * Map raw log from a specific provider to a standard event
   * @param {Object} rawLog 
   * @param {string} providerName 
   * @param {Object} deviceContext 
   * @returns {Object} Standardized event object
   */
  static mapRawToEvent(rawLog, providerName, deviceContext) {
    // TODO: Implement mapper routing based on providerName
    // e.g. if (providerName === 'SecureEyeProvider') return this.mapSecureEye(rawLog, deviceContext);
    
    return {
      eventId: rawLog.id || `raw-${Date.now()}`,
      deviceId: deviceContext.id,
      userId: rawLog.userId || rawLog.empId,
      timestamp: new Date(rawLog.timestamp || rawLog.time),
      verificationMethod: rawLog.verifyMode, // Should be normalized to VERIFICATION_METHODS
      raw: rawLog, // Store raw log for debugging/audit
    };
  }
}

export default AttendanceMapper;
