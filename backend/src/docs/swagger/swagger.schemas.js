const schemas = {
  StandardSuccess: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      message: { type: 'string', example: 'Operation completed successfully.' },
      data: { type: 'object' },
    },
  },
  StandardError: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'An error occurred.' },
      details: { type: 'array', items: { type: 'string' } },
    },
  },
  Pagination: {
    type: 'object',
    properties: {
      totalItems: { type: 'integer', example: 100 },
      totalPages: { type: 'integer', example: 10 },
      currentPage: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 10 },
      hasNextPage: { type: 'boolean', example: true },
      hasPrevPage: { type: 'boolean', example: false },
    },
  },
  Admin: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      email: { type: 'string', example: 'admin@nit.ac.in' },
      role: { type: 'string', example: 'SUPER_ADMIN' },
      isActive: { type: 'boolean', example: true },
    },
  },
  Department: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      name: { type: 'string', example: 'Computer Science' },
      code: { type: 'string', example: 'CSE' },
      isActive: { type: 'boolean', example: true },
    },
  },
  Faculty: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      employeeId: { type: 'string', example: 'EMP12345' },
      name: { type: 'string', example: 'John Doe' },
      email: { type: 'string', example: 'john.doe@nit.ac.in' },
      departmentId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      designation: { type: 'string', example: 'PROFESSOR' },
      attendanceIdentity: { type: 'string', example: 'BIO-9988' },
      status: { type: 'string', example: 'ACTIVE' },
    },
  },

  Device: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      name: { type: 'string', example: 'Main Entrance Biometric' },
      code: { type: 'string', example: 'DEV-001' },
      serialNumber: { type: 'string', example: 'SN-123456789' },
      ipAddress: { type: 'string', example: '192.168.1.100' },
      type: { type: 'string', example: 'HYBRID' },
      status: { type: 'string', example: 'ONLINE' },
    },
  },
  Attendance: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      personType: { type: 'string', example: 'FACULTY' },
      personId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      attendanceIdentity: { type: 'string', example: 'BIO-3322' },
      timestamp: { type: 'string', format: 'date-time' },
      deviceId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      verificationMethod: { type: 'string', example: 'FINGERPRINT' },
      status: { type: 'string', example: 'PRESENT' },
    },
  },
  SyncJob: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      deviceId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      status: { type: 'string', example: 'COMPLETED' },
      recordsFetched: { type: 'integer', example: 150 },
      recordsProcessed: { type: 'integer', example: 150 },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
    },
  },
  Activity: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      module: { type: 'string', example: 'AUTH' },
      action: { type: 'string', example: 'LOGIN' },
      description: { type: 'string', example: 'Successful login for admin@nit.ac.in' },
      performedBy: { type: 'string', example: '60d0fe4f5311236168a109ca' },
      ipAddress: { type: 'string', example: '127.0.0.1' },
      status: { type: 'string', example: 'SUCCESS' },
      severity: { type: 'string', example: 'LOW' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  Settings: {
    type: 'object',
    properties: {
      organization: { type: 'object' },
      academic: { type: 'object' },
      attendance: { type: 'object' },
      devices: { type: 'object' },
      system: { type: 'object' },
      security: { type: 'object' },
      notifications: { type: 'object' },
      backup: { type: 'object' },
    },
  }
};

export default schemas;
