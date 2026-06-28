import type { LiveEvent, AlertItem, CampusPresence } from '@/types/liveMonitor';

export const initialLiveEvents: LiveEvent[] = [
  {
    id: 'ev-1',
    timestamp: '12:01:15 PM',
    employeeName: 'Dr. Mousomi Mitra',
    employeeId: 'NIT-EMP-1201',
    department: 'Computer Science',
    deviceName: 'CS Block Face Rec',
    deviceLocation: 'Computer Science block',
    eventType: 'Check In',
    status: 'PRESENT',
  },
  {
    id: 'ev-2',
    timestamp: '12:00:02 PM',
    employeeName: 'Arindam Das',
    employeeId: 'NIT-EMP-1234',
    department: 'Science Dept',
    deviceName: 'Main Gate Alpha',
    deviceLocation: 'Main Gate Entrance Left',
    eventType: 'Check Out',
    status: 'PRESENT',
  },
  {
    id: 'ev-3',
    timestamp: '11:58:40 AM',
    employeeName: 'Chandrima Chakrabarty',
    employeeId: 'NIT-EMP-1299',
    department: 'Administration',
    deviceName: 'Main Gate Beta',
    deviceLocation: 'Main Gate Entrance Right',
    eventType: 'Check In',
    status: 'PRESENT',
  },
  {
    id: 'ev-4',
    timestamp: '11:55:10 AM',
    employeeName: 'Nivriti Pandey',
    employeeId: 'NIT-EMP-1310',
    department: 'Arts Dept',
    deviceName: 'Arts Faculty West',
    deviceLocation: 'Arts Building Side Entrance',
    eventType: 'Check In',
    status: 'PRESENT',
  },
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'Device Connection Offline',
    description: 'Library Entrance (DEV-006) disconnected from WebSocket synchronization services.',
    timestamp: '15 mins ago',
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Multiple Failed Authentication Attempts',
    description: '3 failed face recognition matches detected at CS Block Face Rec within 2 minutes.',
    timestamp: '5 mins ago',
  },
  {
    id: 'alert-3',
    type: 'info',
    title: 'Device Sync Delayed',
    description: 'Arts Faculty West (DEV-004) latency exceeded 2500ms.',
    timestamp: '2 mins ago',
  },
];

export const initialCampusPresence: CampusPresence[] = [
  {
    employeeId: 'NIT-EMP-1201',
    name: 'Dr. Mousomi Mitra',
    department: 'Computer Science',
    checkInTime: '08:58 AM',
    durationOnCampus: '3h 4 mins',
    status: 'PRESENT',
  },
  {
    employeeId: 'NIT-EMP-1299',
    name: 'Chandrima Chakrabarty',
    department: 'Administration',
    checkInTime: '08:40 AM',
    durationOnCampus: '3h 22 mins',
    status: 'PRESENT',
  },
  {
    employeeId: 'NIT-EMP-1310',
    name: 'Nivriti Pandey',
    department: 'Arts Dept',
    checkInTime: '08:48 AM',
    durationOnCampus: '3h 14 mins',
    status: 'PRESENT',
  },
  {
    employeeId: 'NIT-EMP-1322',
    name: 'Pranjal Gupta',
    department: 'Literature',
    checkInTime: '08:55 AM',
    durationOnCampus: '3h 7 mins',
    status: 'PRESENT',
  },
];

export const namesPool = [
  'John Smith',
  'Sarah Jenkins',
  'Michael Ross',
  'Amanda Lee',
  'David Miller',
  'Lisa Taylor',
  'James Wilson',
  'Emma Davis',
];
export const deptsPool = [
  'Computer Science',
  'Administration',
  'Science Dept',
  'Literature',
  'Arts Dept',
  'Maintenance',
];
export const devicesPool = [
  { name: 'Main Gate Alpha', location: 'Main Gate Entrance Left' },
  { name: 'Main Gate Beta', location: 'Main Gate Entrance Right' },
  { name: 'CS Block Face Rec', location: 'Computer Science block' },
  { name: 'Arts Faculty West', location: 'Arts Building Side Entrance' },
  { name: 'Admin Block F1', location: 'First Floor Registry Gate' },
];
export const idsPool = [
  'NIT-EMP-1042',
  'NIT-EMP-1088',
  'NIT-EMP-1105',
  'NIT-EMP-1150',
  'NIT-EMP-0922',
  'NIT-EMP-1234',
];
export const statusesPool: ('PRESENT' | 'LATE' | 'HALF_DAY')[] = ['PRESENT', 'LATE', 'HALF_DAY'];
