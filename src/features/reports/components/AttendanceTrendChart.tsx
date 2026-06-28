import React from 'react';
import type { ChartDataPoint } from '@/types/reports';

interface AttendanceTrendChartProps {
  data: ChartDataPoint[];
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Monthly Attendance Trend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-label-sm font-label-sm text-outline font-medium">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
            <span className="text-label-sm font-label-sm text-outline font-medium">Target</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-4 px-2">
        {data.map((point) => (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
            <div className="relative w-full bg-surface-container-low rounded-t-lg h-full overflow-hidden flex flex-col justify-end">
              {/* Secondary Value (Target line or background marker) */}
              {point.secondaryValue && (
                <div
                  className="absolute bottom-0 left-0 right-0 border-t border-dashed border-outline-variant z-10"
                  style={{ height: `${point.secondaryValue}%` }}
                  title={`Target: ${point.secondaryValue}%`}
                />
              )}
              {/* Actual Present Value */}
              <div
                className="bg-primary w-full rounded-t-lg opacity-85 group-hover:opacity-100 transition-all duration-300"
                style={{ height: `${point.value}%` }}
                title={`Present: ${point.value}%`}
              />
            </div>
            <span className="text-label-sm font-label-sm text-outline font-bold">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
