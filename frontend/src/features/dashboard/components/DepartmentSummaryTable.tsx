import React from 'react';
import type { DepartmentSummary } from '@/types/dashboard';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface DepartmentSummaryTableProps {
  data: DepartmentSummary[];
  viewState: ViewState;
}

export const DepartmentSummaryTable: React.FC<DepartmentSummaryTableProps> = ({ data, viewState }) => {
  const headerAction = (
    <button aria-label="View all department attendance records" className="text-primary font-label-sm text-label-sm hover:underline">View All</button>
  );

  return (
    <WidgetCard title="Department Attendance Summary" headerAction={headerAction} bodyClassName="p-0 overflow-x-auto">
      <StatePlaceholder state={viewState} emptyMessage="No department data available.">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">Summary of attendance statistics per department.</caption>
          <thead>
            <tr>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant">Department</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-right">Present %</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-right">Absent %</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
            {data.map((dept) => (
              <tr key={dept.id} className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-6 py-4 font-medium text-on-background">{dept.name}</td>
                <td className="px-6 py-4 text-right text-[#166534] font-medium">{dept.presentPercentage.toFixed(1)}%</td>
                <td className="px-6 py-4 text-right text-on-surface-variant">{dept.absentPercentage.toFixed(1)}%</td>
                <td className="px-6 py-4 text-center">
                  {dept.trend === 'UP' && <span className="material-symbols-outlined text-[#16a34a] text-sm">trending_up</span>}
                  {dept.trend === 'FLAT' && <span className="material-symbols-outlined text-outline text-sm">trending_flat</span>}
                  {dept.trend === 'DOWN' && <span className="material-symbols-outlined text-[#dc2626] text-sm">trending_down</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </StatePlaceholder>
    </WidgetCard>
  );
};
