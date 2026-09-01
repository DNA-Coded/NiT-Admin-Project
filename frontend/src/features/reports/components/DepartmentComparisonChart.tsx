import React from 'react';
import type { ChartDataPoint } from '@/types/reports';

interface DepartmentComparisonChartProps {
  data: ChartDataPoint[];
}

export const DepartmentComparisonChart: React.FC<DepartmentComparisonChartProps> = ({ data }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-6">Late Arrivals by Dept</h3>
        <div className="space-y-6">
          {data.map((point) => (
            <div key={point.label}>
              <div className="flex justify-between text-label-md font-label-md mb-2 font-medium">
                <span className="text-on-surface">{point.label}</span>
                <span className="text-primary font-bold">{point.value}%</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    point.value > 50
                      ? 'bg-danger'
                      : point.value > 25
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${point.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-outline-variant shrink-0">
        <p className="text-body-sm text-outline italic font-medium">
          Total of 244 late arrival events recorded this period.
        </p>
      </div>
    </div>
  );
};
