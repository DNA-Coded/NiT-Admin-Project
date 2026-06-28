import React from 'react';
import type { PayrollFilterState } from '@/types/payroll';
import { DEPARTMENTS } from '@/constants';

interface PayrollFilterBarProps {
  filters: PayrollFilterState;
  onFilterChange: (key: keyof PayrollFilterState, value: string) => void;
  onReset: () => void;
}

export const PayrollFilterBar: React.FC<PayrollFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Employee</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 font-body-sm text-body-sm focus:border-primary outline-none transition-all"
              placeholder="Search by name or ID"
              type="text"
              value={filters.employeeSearch}
              onChange={(e) => onFilterChange('employeeSearch', e.target.value)}
            />
          </div>
        </div>

        {/* Month select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Payroll Period</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.payrollMonth}
              onChange={(e) => onFilterChange('payrollMonth', e.target.value)}
            >
              <option value="November 2023">November 2023</option>
              <option value="October 2023">October 2023</option>
              <option value="December 2023">December 2023</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              calendar_month
            </span>
          </div>
        </div>

        {/* Department select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Department</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.department}
              onChange={(e) => onFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Employment Type */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Employment Type</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.employmentType}
              onChange={(e) => onFilterChange('employmentType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Attendance Status */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Attendance Status</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.attendanceStatus}
              onChange={(e) => onFilterChange('attendanceStatus', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Payroll review Status */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Payroll Status</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.payrollStatus}
              onChange={(e) => onFilterChange('payrollStatus', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="FLAGGED">Flagged</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Reset */}
        <button
          aria-label="Reset filters"
          className="bg-white text-secondary border border-outline-variant rounded-lg py-2 font-label-md text-label-md hover:bg-surface-container transition-colors w-full h-[38px]"
          onClick={onReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
