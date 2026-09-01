import type {
  OrgSettings,
  AttendanceRules,
  ShiftTemplate,
  Holiday,
  UserRole,
  AuditLog,
} from '@/types/settings';

export const mockOrgSettings: OrgSettings = {
  name: 'Narula Institute of Technology',
  logoUrl: 'https://lh3.googleusercontent.com/placeholder-nit-logo',
  address: '81, Nilgunj Rd, Jagarata Pall, Agarpara, Kolkata, West Bengal 700109',
  contactNumber: '+91 33 2563 8888',
  email: 'info@nit.ac.in',
  timeZone: 'IST (UTC+5:30)',
  academicYear: '2023-2024',
};

export const mockAttendanceRules: AttendanceRules = {
  officeStartTime: '09:00',
  officeEndTime: '17:00',
  gracePeriodMins: 15,
  minWorkingHours: 8,
  halfDayThresholdHours: 4,
  overtimeThresholdHours: 9,
  weekendPolicy: 'Saturday (Half-day), Sunday (Off)',
};

export const mockShifts: ShiftTemplate[] = [
  {
    id: 'sh-1',
    name: 'General Shift',
    startTime: '09:00',
    endTime: '17:00',
    breakDurationMins: 60,
    assignedDepartments: ['Computer Science', 'Electronics', 'Administration'],
    status: 'ACTIVE',
  },
  {
    id: 'sh-2',
    name: 'Morning Shift',
    startTime: '07:00',
    endTime: '14:00',
    breakDurationMins: 45,
    assignedDepartments: ['Maintenance', 'Security'],
    status: 'ACTIVE',
  },
  {
    id: 'sh-3',
    name: 'Evening Shift',
    startTime: '14:00',
    endTime: '21:00',
    breakDurationMins: 45,
    assignedDepartments: ['Library Services', 'Security'],
    status: 'ACTIVE',
  },
  {
    id: 'sh-4',
    name: 'Night Security Shift',
    startTime: '21:00',
    endTime: '06:00',
    breakDurationMins: 60,
    assignedDepartments: ['Security'],
    status: 'ACTIVE',
  },
];

export const mockHolidays: Holiday[] = [
  {
    id: 'hol-1',
    name: 'Independence Day',
    date: '2023-08-15',
    type: 'NATIONAL',
    description: 'National holiday observing Independence Day.',
  },
  {
    id: 'hol-2',
    name: 'Durga Puja Holidays',
    date: '2023-10-20',
    type: 'FESTIVAL',
    description: 'Autumn festival holidays across West Bengal.',
  },
  {
    id: 'hol-3',
    name: 'NIT Foundation Day',
    date: '2023-11-05',
    type: 'INSTITUTIONAL',
    description: 'NIT Foundation ceremony celebrations.',
  },
];

export const mockUserRoles: UserRole[] = [
  {
    roleName: 'Super Administrator',
    description: 'Complete system access, hardware configurations, and logs audit permissions.',
    permissions: ['ALL_PERMISSIONS', 'MANAGE_DEVICES', 'MANAGE_ROLES', 'AUDIT_LOGS'],
  },
  {
    roleName: 'HR Manager',
    description: 'Manage staff, view attendance logs, inspect payroll adjustments, and export summary sheets.',
    permissions: ['VIEW_EMPLOYEES', 'EDIT_EMPLOYEES', 'VERIFY_ATTENDANCE', 'EXPORT_PAYROLL'],
  },
  {
    roleName: 'HR Executive',
    description: 'Read employee information and handle daily attendance logs exception corrections.',
    permissions: ['VIEW_EMPLOYEES', 'ADJUST_ATTENDANCE_LOGS'],
  },
  {
    roleName: 'Principal',
    description: 'Read-only statistics view on aggregate attendance ratios, absenteeism metrics, and department reports.',
    permissions: ['VIEW_ANALYTICS', 'VIEW_REPORTS'],
  },
  {
    roleName: 'Department Administrator',
    description: 'Manage departmental shifts, view class attendance, and verify department exceptions.',
    permissions: ['VIEW_DEPT_EMPLOYEES', 'MANAGE_DEPT_SHIFTS'],
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-06-28 12:15:22',
    user: 'admin_mousomi',
    action: 'Verified Payroll Period',
    module: 'Payroll Summary',
    status: 'SUCCESS',
    ipAddress: '192.168.1.144',
    device: 'Web Client (Chrome/Windows)',
  },
  {
    id: 'aud-2',
    timestamp: '2026-06-28 11:42:05',
    user: 'sys_bot',
    action: 'Heartbeat Ping Failure Alert',
    module: 'Biometric Devices',
    status: 'WARNING',
    ipAddress: '192.168.12.5',
    device: 'ZKTeco-LB-01 Library Entrance',
  },
  {
    id: 'aud-3',
    timestamp: '2026-06-28 10:04:12',
    user: 'admin_mousomi',
    action: 'Registered New Hardware Module',
    module: 'Biometric Devices',
    status: 'SUCCESS',
    ipAddress: '192.168.1.144',
    device: 'Web Client (Chrome/Windows)',
  },
];
