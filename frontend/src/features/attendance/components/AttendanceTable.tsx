import React from 'react';
import type { AttendanceRecord } from '@/types/attendance';
import { AttendanceRow } from './AttendanceRow';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  viewState: ViewState;
  onSelectRecord: (record: AttendanceRecord) => void;
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  viewState,
  onSelectRecord,
  currentPage,
  totalPages,
  totalEntries,
  limit,
  onPageChange,
}) => {
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalEntries);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <StatePlaceholder state={viewState} emptyMessage="No attendance logs found matching filters.">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only"> Narula Institute of Technology Employee attendance records table.</caption>
            <thead>
              <tr className="bg-surface-container text-on-surface font-label-md text-label-md border-b border-outline-variant">
                <th className="py-3 px-4 font-medium whitespace-nowrap">Employee</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">First In</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Last Out</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Total Hours</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {records.map((record) => (
                <AttendanceRow
                  key={record.id}
                  record={record}
                  onSelect={onSelectRecord}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalEntries > 0 && (
          <div className="bg-surface-container-lowest px-4 py-3 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 sm:px-6">
            <p className="text-sm text-on-surface-variant font-body-sm">
              Showing <span className="font-medium text-on-surface">{totalEntries === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-medium text-on-surface">{endIndex}</span> of{' '}
              <span className="font-medium text-on-surface">{totalEntries}</span> results
            </p>
            <div>
              <nav aria-label="Pagination Navigation" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {/* Prev Button */}
                <button
                  aria-label="Previous page"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-all duration-200"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                {/* Page indices */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    aria-label={`Go to page ${page}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'z-10 bg-primary-fixed-dim border-primary text-primary font-bold'
                        : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:bg-surface-container'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  aria-label="Next page"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-all duration-200"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </StatePlaceholder>
    </div>
  );
};
