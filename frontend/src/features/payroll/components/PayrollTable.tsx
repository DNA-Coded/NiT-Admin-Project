import React, { useState } from 'react';
import type { PayrollRecord } from '@/types/payroll';
import { PayrollRow } from './PayrollRow';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface PayrollTableProps {
  records: PayrollRecord[];
  viewState: ViewState;
  onSelect: (record: PayrollRecord) => void;
  month: string;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  viewState,
  onSelect,
  month,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalEntries = records.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentItems = records.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">
          Attendance Matrix - {month || 'November'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Filter options"
            className="p-2 hover:bg-surface-container-highest rounded-lg transition-all text-on-surface-variant"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      <StatePlaceholder state={viewState} emptyMessage="No payroll records found matching filters.">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only"> Attendance metrics table for pre-finalized payroll summary.</caption>
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-label-md text-on-surface-variant uppercase tracking-wider">
                <th className="px-6 py-4 font-label-md">Employee Name</th>
                <th className="px-6 py-4 font-label-md">Department</th>
                <th className="px-6 py-4 font-label-md text-center">Working Days</th>
                <th className="px-6 py-4 font-label-md text-center">Present Days</th>
                <th className="px-6 py-4 font-label-md text-center">Leave Days</th>
                <th className="px-6 py-4 font-label-md text-center">Half Days</th>
                <th className="px-6 py-4 font-label-md text-center">Overtime</th>
                <th className="px-6 py-4 font-label-md text-center">Late Arrivals</th>
                <th className="px-6 py-4 font-label-md text-center">Status</th>
                <th className="px-6 py-4 font-label-md text-right">Review Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
              {currentItems.map((record) => (
                <PayrollRow
                  key={record.employeeId}
                  record={record}
                  onSelect={onSelect}
                />
              ))}
            </tbody>
          </table>
        </div>

        {totalEntries > 0 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-on-surface-variant font-body-sm">
              Showing <span className="font-medium text-on-surface">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-on-surface">{endIndex}</span> of{' '}
              <span className="font-medium text-on-surface">{totalEntries}</span> results
            </p>
            <div>
              <nav aria-label="Pagination Navigation" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  aria-label="Previous page"
                  className="p-2 border border-outline-variant rounded-l-lg hover:bg-surface-container-low disabled:opacity-50 transition-all"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    aria-label={`Go to page ${page}`}
                    className={`px-3 py-1 border text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'z-10 bg-primary border-primary text-white font-bold'
                        : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  aria-label="Next page"
                  className="p-2 border border-outline-variant rounded-r-lg hover:bg-surface-container-low disabled:opacity-50 transition-all"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </StatePlaceholder>
    </div>
  );
};
