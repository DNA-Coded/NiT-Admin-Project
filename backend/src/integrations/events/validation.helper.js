/**
 * Validation Helper
 * 
 * Standardizes validation of normalized events before they enter the core system.
 */

class ValidationHelper {
  
  /**
   * Validate a normalized event object
   * @param {Object} event 
   * @returns {boolean}
   */
  static isValidEvent(event) {
    if (!event || typeof event !== 'object') return false;
    if (!event.eventId) return false;
    if (!event.deviceId) return false;
    if (!event.userId) return false;
    if (!(event.timestamp instanceof Date && !isNaN(event.timestamp))) return false;
    
    // Additional domain validations can be added here
    return true;
  }
}

export default ValidationHelper;
