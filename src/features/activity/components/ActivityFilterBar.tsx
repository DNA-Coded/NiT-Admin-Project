import React from 'react';
import type { ActivityFilters } from '../types/activity.api.types';

interface ActivityFilterBarProps {
  filters: ActivityFilters;
  searchQuery: string;
  onFilterChange: (key: keyof ActivityFilters, value: string) => void;
  onSearch: (query: string) => void;
  onReset: () => void;
}

const MODULES = ['AUTH', 'DEPARTMENT', 'FACULTY', 'DEVICE', 'ATTENDANCE', 'SYNCHRONIZATION', 'REPORT', 'EXPORT', 'SETTINGS', 'SYSTEM'];
const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'RESET', 'LOGIN', 'LOGOUT', 'EXPORT', 'SYNC', 'HEALTH', 'CORRECTION', 'CONFIGURATION'];
const STATUSES = ['SUCCESS', 'FAILED', 'WARNING'];

export const ActivityFilterBar: React.FC<ActivityFilterBarProps> = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearch,
  onReset,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-4 font-body-sm text-body-sm mb-6">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-outline-variant pb-3">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-2 font-medium text-on-surface focus:border-primary outline-none transition-all"
            placeholder="Search activity description..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          className="text-primary hover:text-primary-container font-label-md text-label-md transition-colors flex items-center gap-1.5 font-bold"
          onClick={onReset}
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Module Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Module</label>
          <select
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none appearance-none"
            value={filters.module || ''}
            onChange={(e) => onFilterChange('module', e.target.value)}
          >
            <option value="">All Modules</option>
            {MODULES.map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Action</label>
          <select
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none appearance-none"
            value={filters.action || ''}
            onChange={(e) => onFilterChange('action', e.target.value)}
          >
            <option value="">All Actions</option>
            {ACTIONS.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Status</label>
          <select
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none appearance-none"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">From Date</label>
          <input
            type="date"
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            value={filters.from || ''}
            onChange={(e) => onFilterChange('from', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
