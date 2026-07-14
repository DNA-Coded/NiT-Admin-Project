import React from 'react';
import type { DeviceActivity } from '@/types/devices';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface DeviceActivityTableProps {
  activities: DeviceActivity[];
  viewState: ViewState;
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  limit: number;
  onPageChange: (page: number) => void;
  onRetry?: (syncId: string) => void;
  isRetrying?: boolean;
}

export const DeviceActivityTable: React.FC<DeviceActivityTableProps> = ({
  activities,
  viewState,
  currentPage,
  totalPages,
  totalEntries,
  limit,
  onPageChange,
  onRetry,
  isRetrying,
}) => {
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalEntries);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getStatusStyle = (status: DeviceActivity['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-success-bg text-success-text border-success/20';
      case 'FAILED':
        return 'bg-danger-bg text-danger-text border-danger/20';
      default:
        return 'bg-warning-bg text-warning-text border-warning/20';
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
        <h4 className="font-label-md text-primary font-bold">System Health Logs & Sync History</h4>
        <button
          className="text-label-sm text-outline font-medium hover:text-primary transition-colors flex items-center gap-1"
          onClick={() => onPageChange(1)}
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Refresh
        </button>
      </div>

      <StatePlaceholder state={viewState} emptyMessage="No health logs recorded matching filters.">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only"> Narula Institute of Technology biometric hardware health logs table.</caption>
            <thead className="bg-surface-container-high/30 text-label-md text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-label-md">Timestamp</th>
                <th className="px-6 py-4 font-label-md">Device</th>
                <th className="px-6 py-4 font-label-md">Event</th>
                <th className="px-6 py-4 font-label-md">Status</th>
                <th className="px-6 py-4 font-label-md">Description</th>
                <th className="px-6 py-4 font-label-md text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-mono text-[13px] text-on-surface-variant whitespace-nowrap">
                    {act.timestamp}
                  </td>
                  <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">{act.deviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{act.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium border ${getStatusStyle(
                        act.status
                      )}`}
                    >
                      {act.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant leading-relaxed">
                    {act.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {act.status === 'FAILED' && onRetry && (
                      <button
                        className="text-primary hover:underline font-label-sm text-label-sm font-bold disabled:opacity-50"
                        onClick={() => onRetry(act.id)}
                        disabled={isRetrying}
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalEntries > 0 && (
          <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 mt-auto">
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
