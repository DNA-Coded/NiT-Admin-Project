import React from 'react';
import type { AttendanceOverview } from '@/types/dashboard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface AttendanceOverviewChartProps {
  data?: AttendanceOverview;
  viewState: ViewState;
}

export const AttendanceOverviewChart: React.FC<AttendanceOverviewChartProps> = ({ data, viewState }) => {
  // Calculate dynamic gradient stops based on actual data safely
  const presentCount = data?.present || 0;
  const absentCount = data?.absent || 0;
  const lateCount = data?.late || 0;
  const leaveCount = data?.onLeave || 0;

  const total = presentCount + absentCount + lateCount + leaveCount;
  
  // Guard against division by zero (NaN protection)
  const p1 = total > 0 ? (presentCount / total) * 100 : 0;
  const p2 = total > 0 ? p1 + (absentCount / total) * 100 : 0;
  const p3 = total > 0 ? p2 + (lateCount / total) * 100 : 0;

  const gradient = total > 0 
    ? `conic-gradient(
        #16a34a 0% ${p1}%, 
        #dc2626 ${p1}% ${p2}%, 
        #d97706 ${p2}% ${p3}%, 
        #cbd5e1 ${p3}% 100%
      )`
    : 'conic-gradient(#cbd5e1 0% 100%)'; // Clean grey baseline fallback state

  return (
    <WidgetCard title="Attendance Overview">
      <StatePlaceholder emptyMessage="No overview data." state={viewState}>
        {data && (
          <div className="flex flex-col items-center pt-4">
            {/* Simulated Donut Chart using CSS conic-gradient */}
            <div 
              className="relative w-48 h-48 rounded-full mb-6 flex items-center justify-center overflow-hidden" 
              style={{ background: gradient }}
            >
              <div className="absolute w-28 h-28 bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <span className="font-display-lg text-[32px] font-bold text-on-background">{data.totalPercentage}%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Present</span>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-3 font-body-sm text-body-sm p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success rounded-sm"></span>
                  <span>Present</span>
                </div>
                <span className="font-medium">{data.present.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-danger rounded-sm"></span>
                  <span>Absent</span>
                </div>
                <span className="font-medium">{data.absent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning rounded-sm"></span>
                  <span>Corrected (Late)</span>
                </div>
                <span className="font-medium">{data.late.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#cbd5e1] rounded-sm"></span>
                  <span>Manual Override</span>
                </div>
                <span className="font-medium">{data.onLeave.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </StatePlaceholder>
    </WidgetCard>
  );
};