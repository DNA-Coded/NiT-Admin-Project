import type { 
  KPIStats, 
  LiveAttendanceEvent, 
  DepartmentSummary, 
  AttendanceOverview, 
  OnCampusEmployee 
} from '@/types/dashboard';
import type { 
  DashboardOverviewResponse, 
  DashboardLiveResponse, 
  DashboardAnalyticsResponse 
} from '../types/dashboard.api.types';

export const mapKPIStats = (overview: DashboardOverviewResponse): KPIStats => ({
  totalEmployees: overview.summary.totalFaculty,
  presentToday: overview.attendance.present,
  absentToday: overview.attendance.absent,
  lateArrivals: 0,
  insideCampus: overview.attendance.present,
  devicesOnline: overview.devices.online,
  totalDevices: overview.summary.totalDevices
});

export const mapLiveAttendance = (live: DashboardLiveResponse): LiveAttendanceEvent[] => {
  return live.latestAttendance.map((event, index) => {
    const date = new Date(event.timestamp);
    return {
      id: `live-att-${index}`,
      employeeName: event.personName,
      department: event.personType || 'Unknown',
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: event.attendanceType
    };
  });
};

export const mapDepartmentSummaries = (analytics: DashboardAnalyticsResponse): DepartmentSummary[] => {
  return analytics.departments.map((dept, index) => {
    const presentPercentage = Number(dept.attendancePercentage.toFixed(1));
    return {
      id: `dept-${index}`,
      name: dept.department || 'Unknown',
      presentPercentage,
      absentPercentage: Number((100 - presentPercentage).toFixed(1)),
      trend: 'FLAT'
    };
  });
};

export const mapAttendanceOverview = (overview: DashboardOverviewResponse): AttendanceOverview => {
  const total = overview.summary.totalFaculty;
  const present = overview.attendance.present;
  const totalPercentage = total > 0 ? (present / total) * 100 : 0;
  
  return {
    present: overview.attendance.present,
    absent: overview.attendance.absent,
    late: 0,
    onLeave: 0,
    totalPercentage: Math.round(totalPercentage)
  };
};

export const mapOnCampusEmployees = (live: DashboardLiveResponse): OnCampusEmployee[] => {
  return live.latestAttendance
    .filter(event => event.attendanceType === 'IN')
    .slice(0, 5)
    .map((event, index) => {
      const date = new Date(event.timestamp);
      return {
        id: `on-campus-${index}`,
        name: event.personName,
        department: event.personType || 'Unknown',
        timeIn: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
};
