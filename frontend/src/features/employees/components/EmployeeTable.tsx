import React, { useState } from 'react';
import type { Employee } from '@/types/employees';
import { EmployeeRow } from './EmployeeRow';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface EmployeeTableProps {
  employees: Employee[];
  viewState: ViewState;
  onSelectEmployee: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  viewState,
  onSelectEmployee,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculation
  const totalEntries = employees.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentItems = employees.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      <StatePlaceholder state={viewState} emptyMessage="No employees found matching the filters.">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">List of Narula Institute of Technology employees.</caption>
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Employee Name</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Employee ID</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Department</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Designation</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Employment Type</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {currentItems.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onSelect={onSelectEmployee}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalEntries > 0 && (
          <div className="px-4 py-3 border-t border-outline-variant bg-white flex items-center justify-between flex-wrap gap-2">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
            </p>
            <div className="flex items-center gap-1">
              {/* Prev Button */}
              <button
                aria-label="Previous page"
                className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50 transition-all duration-200"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  aria-label={`Go to page ${page}`}
                  className={`w-8 h-8 rounded flex items-center justify-center font-label-sm text-label-sm transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                aria-label="Next page"
                className="p-1 text-on-surface-variant hover:bg-surface-container rounded disabled:opacity-50 transition-all duration-200"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </StatePlaceholder>
    </div>
  );
};
