import { useEffect, useState } from 'react';
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { LiveAttendanceFeed } from '@/features/dashboard/components/LiveAttendanceFeed';
import { DepartmentSummaryTable } from '@/features/dashboard/components/DepartmentSummaryTable';
import { AttendanceOverviewChart } from '@/features/dashboard/components/AttendanceOverviewChart';
import { OnCampusWidget } from '@/features/dashboard/components/OnCampusWidget';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { dashboardService } from '@/features/dashboard/services/dashboard.service';
import {
  mapKPIStats,
  mapLiveAttendance,
  mapDepartmentSummaries,
  mapAttendanceOverview,
  mapOnCampusEmployees,
} from '@/features/dashboard/utils/dashboardMappers';
import type { KPIStats, LiveAttendanceEvent, DepartmentSummary, AttendanceOverview, OnCampusEmployee } from '@/types/dashboard';

export default function Dashboard() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  
  const [kpiStats, setKpiStats] = useState<KPIStats | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveAttendanceEvent[]>([]);
  const [departmentSummaries, setDepartmentSummaries] = useState<DepartmentSummary[]>([]);
  const [attendanceOverview, setAttendanceOverview] = useState<AttendanceOverview | null>(null);
  const [onCampusEmployees, setOnCampusEmployees] = useState<OnCampusEmployee[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setViewState('loading');
        
        const [overview, liveData, analytics] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getLiveMonitoring(),
          dashboardService.getAnalytics(),
        ]);

        if (isMounted) {
          setKpiStats(mapKPIStats(overview));
          setLiveEvents(mapLiveAttendance(liveData));
          setDepartmentSummaries(mapDepartmentSummaries(analytics));
          setAttendanceOverview(mapAttendanceOverview(overview));
          setOnCampusEmployees(mapOnCampusEmployees(liveData));
          setViewState('success');
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (isMounted) {
          setViewState('error');
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const safeKpiStats = kpiStats || {
    totalEmployees: 0, presentToday: 0, absentToday: 0, lateArrivals: 0,
    insideCampus: 0, devicesOnline: 0, totalDevices: 0
  };
  const safeAttendanceOverview = attendanceOverview || {
    present: 0, absent: 0, late: 0, onLeave: 0, totalPercentage: 0
  };

  return (
    <div className="w-full">
      {/* KPI Grid */}
      <KPIGrid data={safeKpiStats} viewState={viewState} />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Feed (Col Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <LiveAttendanceFeed data={liveEvents} viewState={viewState} />
          <DepartmentSummaryTable data={departmentSummaries} viewState={viewState} />
        </div>

        {/* Secondary Column (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AttendanceOverviewChart data={safeAttendanceOverview} viewState={viewState} />
          <OnCampusWidget 
            data={onCampusEmployees} 
            viewState={viewState} 
            totalInside={safeKpiStats.insideCampus} 
          />
        </div>
      </div>
    </div>
  );
}
