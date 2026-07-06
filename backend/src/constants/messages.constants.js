/**
 * Messages Constants
 *
 * Centralized string constants for API response messages.
 * Using constants prevents typos and makes message management easier.
 */
export const MESSAGES = Object.freeze({
  // ─── Generic ────────────────────────────────────────────────────────────────
  SUCCESS:      'Operation completed successfully.',
  CREATED:      'Resource created successfully.',
  UPDATED:      'Resource updated successfully.',
  DELETED:      'Resource deleted successfully.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',

  // Resource-specific
  NOT_FOUND:     (resource = 'Resource') => `${resource} not found.`,
  ALREADY_EXISTS:(resource = 'Resource') => `${resource} already exists.`,
  INVALID_ID:    'The provided ID is invalid.',

  // ─── Validation ─────────────────────────────────────────────────────────────
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  MISSING_FIELDS:   'Required fields are missing.',

  // ─── Auth ───────────────────────────────────────────────────────────────────
  UNAUTHORIZED:       'You are not authorized to access this resource.',
  FORBIDDEN:          'You do not have permission to perform this action.',
  INVALID_CREDENTIALS:'Invalid email or password.',
  TOKEN_EXPIRED:      'Your session has expired. Please log in again.',
  TOKEN_INVALID:      'Invalid or malformed token.',
  TOKEN_MISSING:      'No token provided. Please log in.',
  ACCOUNT_INACTIVE:   'Your account has been deactivated. Contact the administrator.',
  LOGIN_SUCCESS:      'Login successful.',
  LOGOUT_SUCCESS:     'Logged out successfully.',

  // ─── Health ─────────────────────────────────────────────────────────────────
  HEALTH_OK: 'Server is healthy.',

  // ─── Department ─────────────────────────────────────────────────────────────
  DEPARTMENT_FETCH_LIST:   'Departments retrieved successfully.',
  DEPARTMENT_FETCH_DETAIL: 'Department retrieved successfully.',
  DEPARTMENT_CREATED:      'Department created successfully.',
  DEPARTMENT_UPDATED:      'Department updated successfully.',
  DEPARTMENT_DELETED:      'Department deactivated successfully.',
  DEPARTMENT_RESTORED:     'Department restored successfully.',
  DEPARTMENT_NOT_FOUND:    'Department not found.',
  DEPARTMENT_NAME_TAKEN:   'A department with this name already exists.',
  DEPARTMENT_CODE_TAKEN:   'A department with this code already exists.',
  DEPARTMENT_ALREADY_ACTIVE:   'Department is already active.',
  DEPARTMENT_ALREADY_INACTIVE: 'Department is already inactive.',
  DEPARTMENT_NO_CHANGES:       'No fields were provided to update.',

  // ─── Faculty ─────────────────────────────────────────────────────────────────
  FACULTY_FETCH_LIST:   'Faculty records retrieved successfully.',
  FACULTY_FETCH_DETAIL: 'Faculty record retrieved successfully.',
  FACULTY_CREATED:      'Faculty record created successfully.',
  FACULTY_UPDATED:      'Faculty record updated successfully.',
  FACULTY_DELETED:      'Faculty record deactivated successfully.',
  FACULTY_RESTORED:     'Faculty record restored successfully.',
  FACULTY_NOT_FOUND:                 'Faculty record not found.',
  FACULTY_EMPLOYEE_ID_TAKEN:         'A faculty member with this employee ID already exists.',
  FACULTY_EMAIL_TAKEN:               'A faculty member with this email address already exists.',
  FACULTY_ATTENDANCE_IDENTITY_TAKEN: 'This attendance identity is already registered to another faculty member.',
  FACULTY_ALREADY_ACTIVE:            'Faculty record is already active.',
  FACULTY_ALREADY_INACTIVE:          'Faculty record is already inactive.',
  FACULTY_NO_CHANGES:                'No fields were provided to update.',
  FACULTY_INVALID_DESIGNATION:       'Invalid designation. Please select from the allowed values.',
  FACULTY_INVALID_STATUS:            'Invalid status. Allowed values are: ACTIVE, ON_LEAVE, RETIRED, SUSPENDED.',

  // ─── Student ─────────────────────────────────────────────────────────────────
  STUDENT_FETCH_LIST:   'Students retrieved successfully.',
  STUDENT_FETCH_DETAIL: 'Student retrieved successfully.',
  STUDENT_CREATED:      'Student created successfully.',
  STUDENT_UPDATED:      'Student updated successfully.',
  STUDENT_DELETED:      'Student deactivated successfully.',
  STUDENT_RESTORED:     'Student restored successfully.',
  STUDENT_NOT_FOUND:                 'Student not found.',
  STUDENT_ROLL_NUMBER_TAKEN:         'A student with this roll number already exists.',
  STUDENT_REG_NUMBER_TAKEN:          'A student with this registration number already exists.',
  STUDENT_EMAIL_TAKEN:               'A student with this email address already exists.',
  STUDENT_ATTENDANCE_IDENTITY_TAKEN: 'This attendance identity is already registered to another student.',
  STUDENT_ALREADY_ACTIVE:            'Student record is already active.',
  STUDENT_ALREADY_INACTIVE:          'Student record is already inactive.',
  STUDENT_NO_CHANGES:                'No fields were provided to update.',
  STUDENT_INVALID_STATUS:            'Invalid status.',
  STUDENT_INVALID_SEMESTER:          'Invalid semester.',

  // ─── Device ──────────────────────────────────────────────────────────────────
  DEVICE_FETCH_LIST:          'Devices retrieved successfully.',
  DEVICE_FETCH_DETAIL:        'Device retrieved successfully.',
  DEVICE_CREATED:             'Device created successfully.',
  DEVICE_UPDATED:             'Device updated successfully.',
  DEVICE_STATUS_UPDATED:      'Device status updated successfully.',
  DEVICE_DELETED:             'Device deactivated successfully.',
  DEVICE_RESTORED:            'Device restored successfully.',
  DEVICE_NOT_FOUND:           'Device not found.',
  DEVICE_CODE_TAKEN:          'A device with this code already exists.',
  DEVICE_SERIAL_TAKEN:        'A device with this serial number already exists.',
  DEVICE_ALREADY_ACTIVE:      'Device is already active.',
  DEVICE_ALREADY_INACTIVE:    'Device is already inactive.',
  DEVICE_NO_CHANGES:          'No fields were provided to update.',
  DEVICE_INVALID_STATUS:      'Invalid device status. Allowed values are: ONLINE, OFFLINE, MAINTENANCE, DISCONNECTED.',
  DEVICE_INVALID_TYPE:        'Invalid device type. Allowed values are: FINGERPRINT, FACE_RECOGNITION, HYBRID.',

  // ─── Attendance ─────────────────────────────────────────────────────────────
  ATTENDANCE_FETCH_LIST:          'Attendance records retrieved successfully.',
  ATTENDANCE_FETCH_DETAIL:        'Attendance record retrieved successfully.',
  ATTENDANCE_CREATED:             'Attendance record created successfully.',
  ATTENDANCE_UPDATED:             'Attendance record updated successfully.',
  ATTENDANCE_DELETED:             'Attendance record deactivated successfully.',
  ATTENDANCE_RESTORED:            'Attendance record restored successfully.',
  ATTENDANCE_NOT_FOUND:           'Attendance record not found.',
  ATTENDANCE_CODE_TAKEN:          'An attendance record with this code already exists.',
  ATTENDANCE_DUPLICATE_ENTRY:     'A duplicate attendance entry already exists for this exact time.',
  ATTENDANCE_ALREADY_ACTIVE:      'Attendance record is already active.',
  ATTENDANCE_ALREADY_INACTIVE:    'Attendance record is already inactive.',
  ATTENDANCE_NO_CHANGES:          'No fields were provided to update.',
  ATTENDANCE_PERSON_NOT_FOUND:    'The referenced person does not exist or is inactive.',
  ATTENDANCE_IDENTITY_MISMATCH:   'The attendance identity provided does not match the referenced person.',

  // ─── Sync ───────────────────────────────────────────────────────────────────
  SYNC_FETCH_LIST:          'Sync history retrieved successfully.',
  SYNC_FETCH_DETAIL:        'Sync details retrieved successfully.',
  SYNC_STARTED:             'Sync job started successfully.',
  SYNC_RETRY_STARTED:       'Sync job retry started successfully.',
  SYNC_NOT_FOUND:           'Sync job not found.',
  SYNC_ALREADY_RUNNING:     'A sync job is already running for this device.',
  SYNC_INVALID_STATUS:      'Invalid sync status transition.',

  // ─── Events (Integration Pipeline) ──────────────────────────────────────────
  EVENT_FETCH_LIST:         'Events retrieved successfully.',
  EVENT_FETCH_DETAIL:       'Event details retrieved successfully.',
  EVENT_PROCESSED:          'Event processed successfully.',
  EVENT_NOT_FOUND:          'Event not found.',
  EVENT_ALREADY_PROCESSED:  'Event is already processed or failed.',

  // ─── Health (Device Health Monitoring) ──────────────────────────────────────
  HEALTH_FETCH_LIST:          'Device health list retrieved successfully.',
  HEALTH_FETCH_DETAIL:        'Device health details retrieved successfully.',
  HEALTH_HEARTBEAT_RECORDED:  'Device heartbeat recorded successfully.',
  HEALTH_STATUS_UPDATED:      'Device health status updated successfully.',
  HEALTH_ERROR_RECORDED:      'Device error recorded successfully.',
  HEALTH_RESET:               'Device health metrics reset successfully.',
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  DASHBOARD_OVERVIEW_FETCHED: 'Dashboard overview metrics retrieved successfully.',
  LIVE_ATTENDANCE_FETCHED:    'Live attendance retrieved successfully.',
  DEVICE_STATUS_FETCHED:      'Device status retrieved successfully.',
});
