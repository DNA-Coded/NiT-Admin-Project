import { useEffect, useState } from 'react';
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { LiveAttendanceFeed } from '@/features/dashboard/components/LiveAttendanceFeed';
import { DepartmentSummaryTable } from '@/features/dashboard/components/DepartmentSummaryTable';
import { AttendanceOverviewChart } from '@/features/dashboard/components/AttendanceOverviewChart';
import { OnCampusWidget } from '@/features/dashboard/components/OnCampusWidget';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { 
  mockKPIStats, 
  mockLiveAttendanceEvents, 
  mockDepartmentSummaries, 
  mockAttendanceOverview, 
  mockOnCampusEmployees 
} from '@/mocks';

export default function Dashboard() {
  const [viewState, setViewState] = useState<ViewState>('loading');

  useEffect(() => {
    // Simulate network request
    const timer = setTimeout(() => {
      setViewState('success');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {/* KPI Grid */}
      <KPIGrid data={mockKPIStats} viewState={viewState} />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Feed (Col Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <LiveAttendanceFeed data={mockLiveAttendanceEvents} viewState={viewState} />
          <DepartmentSummaryTable data={mockDepartmentSummaries} viewState={viewState} />
        </div>

        {/* Secondary Column (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AttendanceOverviewChart data={mockAttendanceOverview} viewState={viewState} />
          <OnCampusWidget 
            data={mockOnCampusEmployees} 
            viewState={viewState} 
            totalInside={mockKPIStats.insideCampus} 
          />
        </div>
      </div>
    </div>
  );
}
