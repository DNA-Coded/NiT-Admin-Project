import React from 'react';
import type { FilterState } from '@/types/employees';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  designations: string[];
  departments: { id: string; name: string }[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  designations,
  departments,
}) => {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant mb-6 shadow-sm flex flex-wrap gap-4 items-end">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Search Employees
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
            placeholder="Name or Employee ID"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Department Dropdown */}
      <div className="w-full md:w-auto min-w-[160px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Department
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Designation Dropdown */}
      <div className="w-full md:w-auto min-w-[160px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Designation
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
            value={filters.designation}
            onChange={(e) => onFilterChange('designation', e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Employment Type Dropdown */}
      <div className="w-full md:w-auto min-w-[150px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Employment Type
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
            value={filters.employmentType}
            onChange={(e) => onFilterChange('employmentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Ad-hoc">Ad-hoc</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="w-full md:w-auto min-w-[140px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Account Status
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
            value={filters.isActive || ''}
            onChange={(e) => onFilterChange('isActive', e.target.value)}
          >
            <option value="">All Accounts</option>
            <option value="true">Active Only</option>
            <option value="false">Soft Deleted (Inactive)</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Operational Status Dropdown */}
      <div className="w-full md:w-auto min-w-[140px]">
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
          Operational Status
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="RETIRED">Retired</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Reset Button */}
      <button
        aria-label="Reset filters"
        className="bg-white text-secondary font-label-md text-label-md px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors h-[38px] flex items-center justify-center shrink-0"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};
