import React from 'react';
import type { KPIMetrics } from '@/types/reports';

interface ReportsSummaryCardsProps {
  metrics: KPIMetrics;
}

export const ReportsSummaryCards: React.FC<ReportsSummaryCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
      {/* Avg Attendance */}
      <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-green-50 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-green-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <span className="text-green-600 font-label-sm text-label-sm bg-green-50 px-2 py-0.5 rounded font-bold">
            {metrics.attendanceGrowth}
          </span>
        </div>
        <div>
          <div className="text-outline font-label-md text-label-md mb-1 uppercase tracking-tight font-medium">Avg. Attendance</div>
          <div className="font-display-lg text-3xl font-bold text-on-surface">{metrics.avgAttendance}</div>
        </div>
      </div>

      {/* Late Arrivals */}
      <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-amber-50 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-amber-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              alarm
            </span>
          </div>
          <span className="text-error font-label-sm text-label-sm bg-error-container px-2 py-0.5 rounded font-bold">
            {metrics.lateArrivalsGrowth}
          </span>
        </div>
        <div>
          <div className="text-outline font-label-md text-label-md mb-1 uppercase tracking-tight font-medium">Late Arrivals</div>
          <div className="font-display-lg text-3xl font-bold text-on-surface">{metrics.lateArrivals}</div>
        </div>
      </div>

      {/* Overtime */}
      <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              timer
            </span>
          </div>
          <span className="text-primary font-label-sm text-label-sm bg-primary-fixed px-2 py-0.5 rounded font-bold">
            {metrics.overtimeHoursGrowth}
          </span>
        </div>
        <div>
          <div className="text-outline font-label-md text-label-md mb-1 uppercase tracking-tight font-medium">Overtime Total</div>
          <div className="font-display-lg text-3xl font-bold text-on-surface">{metrics.overtimeHours}</div>
        </div>
      </div>

      {/* Unplanned Leave */}
      <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-purple-50 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-purple-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              person_off
            </span>
          </div>
          <span className="text-outline font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded font-bold">
            {metrics.unplannedLeaveGrowth}
          </span>
        </div>
        <div>
          <div className="text-outline font-label-md text-label-md mb-1 uppercase tracking-tight font-medium">Unplanned Leave</div>
          <div className="font-display-lg text-3xl font-bold text-on-surface">{metrics.unplannedLeaveRate}</div>
        </div>
      </div>
    </div>
  );
};
