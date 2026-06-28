import React from 'react';
import type { ReportFilterState } from '@/types/reports';
import { DEPARTMENTS } from '@/constants';

interface ReportsFilterBarProps {
  filters: ReportFilterState;
  onFilterChange: (key: keyof ReportFilterState, value: string) => void;
  onReset: () => void;
  shifts: string[];
  devices: string[];
  reportTypes: string[];
}

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  shifts,
  devices,
  reportTypes,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Search Reports</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 font-body-sm text-body-sm focus:border-primary outline-none transition-all"
              placeholder="Search by report name..."
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Date Range Select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Date Range</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
            >
              <option value="">All Periods</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Current Quarter">Current Quarter</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year to Date">Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Department</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.department}
              onChange={(e) => onFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Report Type Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Report Type</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.reportType}
              onChange={(e) => onFilterChange('reportType', e.target.value)}
            >
              <option value="">All Types</option>
              {reportTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Employee Type dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Employee Type</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.employeeType}
              onChange={(e) => onFilterChange('employeeType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Academic">Academic Staff</option>
              <option value="Administrative">Administrative Staff</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Shift Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Shift</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.shift}
              onChange={(e) => onFilterChange('shift', e.target.value)}
            >
              <option value="">All Shifts</option>
              {shifts.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Device Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Biometric Device</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary outline-none cursor-pointer"
              value={filters.device}
              onChange={(e) => onFilterChange('device', e.target.value)}
            >
              <option value="">All Devices</option>
              {devices.map((dev) => (
                <option key={dev} value={dev}>
                  {dev}
                </option>
              ))}
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
