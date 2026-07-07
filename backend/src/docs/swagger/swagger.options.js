import schemas from './swagger.schemas.js';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NiT Admin API',
      version: '1.0.0',
      description: 'API documentation for the Narula Institute of Technology (NiT) Admin Attendance and Management Backend',
      contact: {
        name: 'API Support',
        email: 'info@nit.ac.in',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current API Version (v1)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here to authenticate.',
        },
      },
      schemas,
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Admin authentication and session endpoints' },
      { name: 'Departments', description: 'Master Data Management for Departments' },
      { name: 'Faculty', description: 'Master Data Management for Faculty' },
      { name: 'Students', description: 'Master Data Management for Students' },
      { name: 'Devices', description: 'Biometric Device Management and Status' },
      { name: 'Health', description: 'Device Health Monitoring' },
      { name: 'Attendance', description: 'Attendance Engine and Correction' },
      { name: 'Synchronization', description: 'Integration Layer and Device Data Sync' },
      { name: 'Dashboard', description: 'Dashboard Overviews and Live Metrics' },
      { name: 'Reports', description: 'Data Report Generation' },
      { name: 'Exports', description: 'Export Engine (CSV, PDF, Excel)' },
      { name: 'Activity', description: 'Activity & Audit Center Logs' },
      { name: 'Settings', description: 'System Configuration and Defaults' },
    ],
  },
  // Paths to files containing OpenAPI JSDoc annotations
  apis: [
    './src/modules/**/*.routes.js',
    './src/integrations/**/*.routes.js',
  ],
};
