import type { 
  KPIStats, 
  LiveAttendanceEvent, 
  DepartmentSummary, 
  AttendanceOverview, 
  OnCampusEmployee 
} from '@/types/dashboard';

export const mapKPIStats = (overview: any): KPIStats => {
  const root = overview?.data || overview || {};
  const summary = root?.summary || root || {};
  const attendance = root?.attendance || root || {};
  const devices = root?.devices || root || {};

  return {
    totalEmployees: Number(
      summary?.totalEmployee ?? 
      summary?.totalEmployees ?? 
      summary?.totalFaculty ?? 
      root?.totalEmployees ?? 
      0
    ),
    presentToday: Number(attendance?.present ?? root?.presentToday ?? 0),
    absentToday: Number(attendance?.absent ?? root?.absentToday ?? 0),
    lateArrivals: Number(attendance?.corrected ?? attendance?.late ?? 0),
    insideCampus: Number(attendance?.present ?? 0),
    devicesOnline: Number(devices?.online ?? 0),
    totalDevices: Number(summary?.totalDevices ?? devices?.total ?? 0)
  };
};

export const mapLiveAttendance = (rawItems: any): LiveAttendanceEvent[] => {
  const items = Array.isArray(rawItems) 
    ? rawItems 
    : (rawItems?.data || rawItems?.events || rawItems?.recentPunches || []);

  if (!Array.isArray(items)) return [];

  return items.map((item: any, index: number) => {
    const rawName = item.employeeName || item.personName || item.fullName;
    const isUnknownUser = !rawName || rawName.trim() === '' || rawName === 'Unknown';

    return {
      id: item.id || item._id || `live-att-${index}`,
      employeeName: isUnknownUser ? '⚠️ Unassigned Token / Card' : rawName,
      department: item.department || item.personType || 'UNASSIGNED',
      time: item.time || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()),
      event: item.event || item.attendanceType || 'CHECK_IN',
    };
  });
};

export const mapDepartmentSummaries = (analytics: any): DepartmentSummary[] => {
  const root = analytics?.data || analytics || {};
  const departments = Array.isArray(root) ? root : (root?.departments || []);

  if (!Array.isArray(departments)) return [];

  return departments.map((dept: any, index: number) => {
    const rawPct = dept.attendancePercentage ?? dept.presentPercentage ?? 0;
    const presentPercentage = Number(Number(rawPct).toFixed(1));
    
    let movementTrend: 'UP' | 'DOWN' | 'FLAT' = 'FLAT';
    if (presentPercentage > 85) movementTrend = 'UP';
    if (presentPercentage < 60) movementTrend = 'DOWN';

    return {
      id: dept.id || dept._id || `dept-${index}`,
      name: dept.department || dept.name || 'General',
      presentPercentage,
      absentPercentage: Number((100 - presentPercentage).toFixed(1)),
      trend: dept.trend || movementTrend
    };
  });
};

export const mapAttendanceOverview = (overview: any): AttendanceOverview => {
  const root = overview?.data || overview || {};
  const summary = root?.summary || root || {};
  const attendance = root?.attendance || root || {};

  const total = Number(
    summary?.totalEmployee ?? 
    summary?.totalEmployees ?? 
    summary?.totalFaculty ?? 
    0
  );
  const present = Number(attendance?.present ?? 0);
  const totalPercentage = total > 0 ? (present / total) * 100 : 0;
  
  return {
    present,
    absent: Number(attendance?.absent ?? 0),
    late: Number(attendance?.corrected ?? 0),
    onLeave: Number(attendance?.manual ?? 0),
    totalPercentage: Math.round(totalPercentage)
  };
};

export const mapOnCampusEmployees = (live: any): OnCampusEmployee[] => {
  const events = Array.isArray(live) 
    ? live 
    : (live?.latestAttendance || live?.data || live?.events || []);

  if (!Array.isArray(events)) return [];

  const uniqueNames = new Set<string>();
  
  return events
    .filter((event: any) => {
      const name = event.personName || event.employeeName;
      const type = event.attendanceType || event.event;
      
      if (!name) return false;
      if (type !== 'IN' && type !== 'CHECK_IN') return false;
      if (uniqueNames.has(name)) return false;
      
      uniqueNames.add(name);
      return true;
    })
    .slice(0, 5)
    .map((event: any, index: number) => {
      const date = event.timestamp ? new Date(event.timestamp) : new Date();
      return {
        id: `on-campus-${index}`,
        name: event.personName || event.employeeName || 'Unknown',
        department: event.personType || event.department || 'Faculty',
        timeIn: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
};