import React, { useState, useEffect, useCallback } from 'react';
import type { DepartmentSummary } from '@/types/dashboard';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';
import { apiClient } from '@/services/api/client';

interface DepartmentSummaryTableProps {
  data?: DepartmentSummary[];
  viewState?: ViewState;
  onViewAll?: () => void;
  autoRefreshInterval?: number; // Optional polling interval in ms (e.g. 15000 for live updates)
}

export const DepartmentSummaryTable: React.FC<DepartmentSummaryTableProps> = ({
  data: initialData,
  viewState: initialViewState,
  onViewAll,
  autoRefreshInterval = 15000,
}) => {
  const [departments, setDepartments] = useState<DepartmentSummary[]>(initialData || []);
  const [state, setState] = useState<ViewState>(initialViewState || 'loading');

  const fetchLiveDepartmentSummary = useCallback(async () => {
    // Skip internal fetch if initialData is explicitly controlled by parent
    if (initialData && initialData.length > 0) {
      setDepartments(initialData);
      setState(initialViewState || 'success');
      return;
    }

    try {
      const response = await apiClient.get('/dashboard/department-summary');
      const responseData = response.data?.data || response.data || [];

      // Normalize live API response to match DepartmentSummary type
      const normalizedData: DepartmentSummary[] = responseData.map((item: any, index: number) => {
        const total = item.totalEmployees || (item.present || 0) + (item.absent || 0) || 1;
        const presentCount = item.presentCount ?? item.present ?? 0;
        const absentCount = item.absentCount ?? item.absent ?? 0;

        const presentPercentage = item.presentPercentage ?? (presentCount / total) * 100;
        const absentPercentage = item.absentPercentage ?? (absentCount / total) * 100;

        return {
          id: item._id || item.id || `dept-${index}`,
          name: item.name || item.departmentName || 'Unknown Department',
          presentPercentage: Number.isFinite(presentPercentage) ? presentPercentage : 0,
          absentPercentage: Number.isFinite(absentPercentage) ? absentPercentage : 0,
          trend: item.trend || (presentPercentage >= 75 ? 'UP' : presentPercentage >= 50 ? 'FLAT' : 'DOWN'),
        };
      });

      setDepartments(normalizedData);
      setState('success');
    } catch (err) {
      console.error('Failed to fetch live department attendance summary:', err);
      // Fallback state if fetch fails and no initial data exists
      if (!initialData || initialData.length === 0) {
        setState('error');
      }
    }
  }, [initialData, initialViewState]);

  useEffect(() => {
    fetchLiveDepartmentSummary();

    if (autoRefreshInterval > 0) {
      const timer = setInterval(fetchLiveDepartmentSummary, autoRefreshInterval);
      return () => clearInterval(timer);
    }
  }, [fetchLiveDepartmentSummary, autoRefreshInterval]);

  const isEmpty = state === 'success' && departments.length === 0;

  const headerAction = (
    <button
      onClick={onViewAll}
      disabled={state !== 'success' || isEmpty}
      aria-label="View all department attendance records"
      className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer disabled:opacity-40 disabled:no-underline"
    >
      View All
    </button>
  );

  return (
    <WidgetCard title="Department Attendance Summary" headerAction={headerAction} bodyClassName="p-0">
      {state !== 'success' || isEmpty ? (
        <div className="p-6 flex items-center justify-center min-h-[240px]">
          <StatePlaceholder
            state={isEmpty ? 'empty' : state}
            emptyMessage="No department data available."
            onRetry={fetchLiveDepartmentSummary}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <caption className="sr-only">Summary of live attendance statistics per department.</caption>
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant">
                  Department
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-right">
                  Present %
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-right">
                  Absent %
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium border-b border-outline-variant text-center">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-medium text-on-background">{dept.name}</td>
                  <td className="px-6 py-4 text-right text-success font-medium">
                    {dept.presentPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right text-on-surface-variant">
                    {dept.absentPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    {dept.trend === 'UP' && (
                      <span className="material-symbols-outlined text-success text-sm" title="Attendance Increasing">
                        trending_up
                      </span>
                    )}
                    {dept.trend === 'FLAT' && (
                      <span className="material-symbols-outlined text-outline text-sm" title="Attendance Stable">
                        trending_flat
                      </span>
                    )}
                    {dept.trend === 'DOWN' && (
                      <span className="material-symbols-outlined text-danger text-sm" title="Attendance Decreasing">
                        trending_down
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetCard>
  );
};