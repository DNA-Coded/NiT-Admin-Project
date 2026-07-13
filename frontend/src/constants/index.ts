/**
 * Centralized Application Constants for NiT Admin.
 */

export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  LIVE_ATTENDANCE: '/live-attendance',
  EMPLOYEES: '/employees',
  ATTENDANCE_RECORDS: '/attendance-records',
  DEPARTMENTS: '/departments',
  REPORTS: '/reports',
  PAYROLL: '/payroll',
  DEVICES: '/devices',
  SETTINGS: '/settings',
} as const;

export const ROLES = {
  hrAdmin: 'HR_ADMIN',
  management: 'MANAGEMENT',
  admin: 'SUPER_ADMIN',
} as const;

export const ATTENDANCE_STATUS = {
  present: 'PRESENT',
  absent: 'ABSENT',
  late: 'LATE',
  onLeave: 'ON_LEAVE',
} as const;

export const DEVICE_STATUS = {
  online: 'ONLINE',
  offline: 'OFFLINE',
  error: 'ERROR',
} as const;

export const DEPARTMENTS = [
  'Computer Science',
  'Administration',
  'Science Dept',
  'Arts Dept',
  'Literature',
  'Physics',
  'Maintenance',
] as const;

export const APP_INFO = {
  name: 'NiT Admin',
  organization: 'Narula Institute of Technology',
  version: '1.0.0',
} as const;

export interface NavItem {
  name: string;
  path: string;
  icon: string;
  description: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    description: 'Overview of academic administration',
  },
  {
    name: 'Live Attendance Monitor',
    path: ROUTES.LIVE_ATTENDANCE,
    icon: 'live_tv',
    description: 'Real-time biometric log feed',
  },
  {
    name: 'Employees',
    path: ROUTES.EMPLOYEES,
    icon: 'badge',
    description: 'Manage staff profiles and records',
  },
  {
    name: 'Attendance Records',
    path: ROUTES.ATTENDANCE_RECORDS,
    icon: 'history',
    description: 'Detailed attendance logs',
  },
  {
    name: 'Departments',
    path: ROUTES.DEPARTMENTS,
    icon: 'domain',
    description: 'Configure and view departments',
  },
  {
    name: 'Reports & Analytics',
    path: ROUTES.REPORTS,
    icon: 'analytics',
    description: 'Detailed analytics and export',
  },
  {
    name: 'Payroll Summary',
    path: ROUTES.PAYROLL,
    icon: 'payments',
    description: 'Salary and attendance summary',
  },
  {
    name: 'Devices',
    path: ROUTES.DEVICES,
    icon: 'router',
    description: 'Biometric device health metrics',
  },
  {
    name: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'settings',
    description: 'App and permissions config',
  },
];
