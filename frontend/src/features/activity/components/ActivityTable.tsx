import React from 'react';
import type { ActivityItem } from '../types/activity.api.types';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface ActivityTableProps {
  activities: ActivityItem[];
  viewState: ViewState;
  onSelect: (activity: ActivityItem) => void;
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  viewState,
  onSelect,
  currentPage,
  totalPages,
  totalEntries,
  limit,
  onPageChange
}) => {
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalEntries);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getStatusStyle = (status: ActivityItem['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-[#dcfce7] text-[#166534] border-success/15';
      case 'WARNING':
        return 'bg-[#fef3c7] text-[#92400e] border-warning/15';
      case 'FAILED':
        return 'bg-[#fee2e2] text-[#b91c1c] border-danger/15';
      default:
        return 'bg-surface-container text-on-surface border-outline-variant/30';
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Platform Audit Logs Trail</h3>
        <span className="text-label-sm text-outline font-semibold">Superadmin View</span>
      </div>

      <StatePlaceholder state={viewState} emptyMessage="No activities found matching filters.">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only"> System administration and user activity logs table.</caption>
            <thead className="bg-surface-container-high/30 text-label-md text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-label-md">Timestamp</th>
                <th className="px-6 py-4 font-label-md">User</th>
                <th className="px-6 py-4 font-label-md">Action</th>
                <th className="px-6 py-4 font-label-md">Module</th>
                <th className="px-6 py-4 font-label-md">IP Address</th>
                <th className="px-6 py-4 font-label-md text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
              {activities.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => onSelect(log)}
                >
                  <td className="px-6 py-4 font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">{log.performedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.module}</td>
                  <td className="px-6 py-4 font-mono text-on-surface-variant whitespace-nowrap">{log.ipAddress}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalEntries > 0 && (
          <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between flex-wrap gap-2">
            <span className="text-body-sm text-on-surface-variant">
              Showing {totalEntries === 0 ? 0 : startIndex + 1}-{endIndex} of {totalEntries} records
            </span>
            <div className="flex gap-2">
              <button
                aria-label="Previous page"
                className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50 transition-all"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                aria-label="Next page"
                className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50 transition-all"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </StatePlaceholder>
    </div>
  );
};
