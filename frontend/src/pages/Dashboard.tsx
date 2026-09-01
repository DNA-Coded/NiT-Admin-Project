import { useEffect, useState, useCallback, useRef } from 'react';
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { LiveAttendanceFeed } from '@/features/dashboard/components/LiveAttendanceFeed';
import { DepartmentSummaryTable } from '@/features/dashboard/components/DepartmentSummaryTable';
import { AttendanceOverviewChart } from '@/features/dashboard/components/AttendanceOverviewChart';
import { OnCampusWidget } from '@/features/dashboard/components/OnCampusWidget';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';
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
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleViewAllDepartments = () => {
    navigate('/departments');
  };
  
  const [viewState, setViewState] = useState<ViewState>('loading');
  
  // Ref tracking ensures clean garbage collection across route changes
  const isMountedRef = useRef(true);
  
  const [kpiStats, setKpiStats] = useState<KPIStats | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveAttendanceEvent[]>([]);
  const [departmentSummaries, setDepartmentSummaries] = useState<DepartmentSummary[]>([]);
  const [attendanceOverview, setAttendanceOverview] = useState<AttendanceOverview | null>(null);
  const [onCampusEmployees, setOnCampusEmployees] = useState<OnCampusEmployee[]>([]);

  const loadDashboardData = useCallback(async (showLoadingPlaceholder = false) => {
    if (showLoadingPlaceholder) setViewState('loading');
    
    try {
      const [overview, liveData, analytics] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getLiveMonitoring(),
        dashboardService.getAnalytics(),
      ]);

      if (isMountedRef.current) {
        // Safely extract the array payload from DashboardLiveResponse for mappers expecting an array
        const liveDataArray = Array.isArray(liveData)
          ? liveData
          : (liveData as any)?.data || (liveData as any)?.events || (liveData as any)?.recentPunches || [];

        setKpiStats(mapKPIStats(overview));
        setLiveEvents(mapLiveAttendance(liveDataArray));
        setDepartmentSummaries(mapDepartmentSummaries(analytics));
        setAttendanceOverview(mapAttendanceOverview(overview));
        setOnCampusEmployees(mapOnCampusEmployees(liveDataArray));
        setViewState('success');
      }
    } catch (error) {
      console.error('Core Dashboard synchronization failure:', error);
      if (isMountedRef.current) setViewState('error');
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadDashboardData(true);

    const pollInterval = setInterval(() => {
      loadDashboardData(false);
    }, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(pollInterval);
    };
  }, [loadDashboardData]);

  if (viewState === 'error') {
    return (
      <div className="p-8 min-h-[80vh] flex items-center justify-center">
        <StatePlaceholder 
          state="error" 
          errorMessage="Analytics Load Interrupted"
          onRetry={() => loadDashboardData(true)}
        />
      </div>
    );
  }

  // Fallback structures to keep visual layout stable while checking boundaries
  const safeKpiStats = kpiStats || {
    totalEmployees: 0, presentToday: 0, absentToday: 0, lateArrivals: 0,
    insideCampus: 0, devicesOnline: 0, totalDevices: 0
  };
  
  const safeAttendanceOverview = attendanceOverview || {
    present: 0, absent: 0, late: 0, onLeave: 0, totalPercentage: 0
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      <div className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-headline-sm font-bold text-on-background">Operational Overview</h2>
          <p className="text-body-sm text-on-surface-variant">Real-time workplace metric tracking.</p>
        </div>
        <button 
          onClick={() => loadDashboardData(true)}
          disabled={viewState === 'loading'}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[18px] ${viewState === 'loading' ? 'animate-spin' : ''}`}>
            refresh
          </span>
          Refresh Portal
        </button>
      </div>

      <KPIGrid data={safeKpiStats} viewState={viewState} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <LiveAttendanceFeed data={liveEvents} viewState={viewState} />
          <DepartmentSummaryTable 
            data={departmentSummaries} 
            viewState={viewState} 
            onViewAll={handleViewAllDepartments} 
          />
        </div>

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