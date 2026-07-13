import React, { useState } from 'react';
import type { CampusPresence } from '@/types/liveMonitor';
import { DEPARTMENTS } from '@/constants';

interface CampusPresenceListProps {
  presenceList: CampusPresence[];
}

export const CampusPresenceList: React.FC<CampusPresenceListProps> = ({ presenceList }) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const filtered = presenceList.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === '' || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col overflow-hidden shadow-sm h-[400px]">
      {/* Header with Search & Filter */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface">Campus Presence</h3>
          <span className="bg-success-bg text-success-text border border-success/15 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
            {presenceList.length} Active Inside
          </span>
        </div>
        <div className="flex gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline-variant rounded pl-8 pr-3 py-1 font-body-sm text-[12px] focus:border-primary outline-none"
              placeholder="Search faculty..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Department Select */}
          <div className="relative max-w-[130px]">
            <select
              className="w-full appearance-none bg-surface border border-outline-variant rounded pl-2.5 pr-7 py-1 font-body-sm text-[12px] focus:border-primary outline-none cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Depts</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[16px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Presence Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((item) => (
            <div
              key={item.employeeId}
              className="p-3 border border-outline-variant/60 rounded bg-surface hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(item.name)}
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-none mt-0.5">
                    {item.department} • {item.employeeId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-on-surface-variant leading-tight">In: {item.checkInTime}</p>
                <p className="font-label-sm text-[10px] text-success-text font-bold leading-none mt-0.5">
                  Dur: {item.durationOnCampus}
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant italic">
              No staff inside matching search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
