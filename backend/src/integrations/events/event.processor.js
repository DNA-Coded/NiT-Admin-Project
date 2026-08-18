/**
 * Event Processor
 * 
 * Takes normalized events and processes them for attendance logging and sockets.
 */
class EventProcessor {
  /**
   * Process a normalized event
   * @param {Object} event Standardized event from AttendanceMapper
   */
  static async processEvent(event) {
    if (!event || !event.employee) {
      console.warn(`[EventProcessor] Skipped event for unmapped attendanceIdentity: ${event?.attendanceIdentity}`);
      return { success: false, reason: 'UNMAPPED_EMPLOYEE', eventId: event?.eventId };
    }

    // Pass normalized event to business logic/database logging layer
    const logSummary = {
      employeeId: event.employee.id,
      employeeId: event.employee.employeeId,
      name: event.employee.fullName,
      department: event.employee.department,
      time: event.timestamp.toISOString(),
      deviceId: event.deviceId,
    };

    console.log(`[EventProcessor] Processed punch for ${logSummary.name} (${logSummary.employeeId})`);

    return {
      success: true,
      processed: event.eventId,
      summary: logSummary,
    };
  }
}

export default EventProcessor;