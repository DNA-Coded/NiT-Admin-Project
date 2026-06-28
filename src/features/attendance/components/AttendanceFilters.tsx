import React from 'react';
import type { AttendanceFilterState } from '@/types/attendance';
import { DEPARTMENTS } from '@/constants';

interface AttendanceFiltersProps {
  filters: AttendanceFilterState;
  onFilterChange: (key: keyof AttendanceFilterState, value: string) => void;
  onReset: () => void;
  devices: string[];
  shifts: string[];
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  devices,
  shifts,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Employee Search */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Employee</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Search by name or ID"
              type="text"
              value={filters.employeeSearch}
              onChange={(e) => onFilterChange('employeeSearch', e.target.value)}
            />
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Department</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
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

        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Start Date</label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">End Date</label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Attendance Status</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="ON_LEAVE">On Leave</option>
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
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
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
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
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

        {/* Reset Button */}
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
