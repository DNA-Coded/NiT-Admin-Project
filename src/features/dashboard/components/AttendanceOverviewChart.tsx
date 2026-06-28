import React from 'react';
import type { AttendanceOverview } from '@/types/dashboard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface AttendanceOverviewChartProps {
  data?: AttendanceOverview;
  viewState: ViewState;
}

export const AttendanceOverviewChart: React.FC<AttendanceOverviewChartProps> = ({ data, viewState }) => {
  // Calculate dynamic gradient stops based on actual data
  const total = data ? data.present + data.absent + data.late + data.onLeave : 0;
  const p1 = data ? (data.present / total) * 100 : 0;
  const p2 = data ? p1 + (data.absent / total) * 100 : 0;
  const p3 = data ? p2 + (data.late / total) * 100 : 0;

  const gradient = `conic-gradient(
    #16a34a 0% ${p1}%, 
    #dc2626 ${p1}% ${p2}%, 
    #d97706 ${p2}% ${p3}%, 
    #cbd5e1 ${p3}% 100%
  )`;

  return (
    <WidgetCard title="Attendance Overview">
      <StatePlaceholder state={viewState} emptyMessage="No overview data.">
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
            
            <div className="w-full flex flex-col gap-3 font-body-sm text-body-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success"></span>
                  <span className="">Present</span>
                </div>
                <span className="font-medium">{data.present.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-danger"></span>
                  <span className="">Absent</span>
                </div>
                <span className="font-medium">{data.absent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning"></span>
                  <span className="">Late</span>
                </div>
                <span className="font-medium">{data.late.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#cbd5e1]"></span>
                  <span className="">On Leave</span>
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
