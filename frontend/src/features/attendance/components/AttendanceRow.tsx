import React from 'react';
import type { AttendanceRecord } from '@/types/attendance';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';

interface AttendanceRowProps {
  record: AttendanceRecord;
  onSelect: (record: AttendanceRecord) => void;
}

export const AttendanceRow: React.FC<AttendanceRowProps> = ({ record, onSelect }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <tr
      className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
      onClick={() => onSelect(record)}
    >
      {/* Employee Column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {getInitials(record.employeeName)}
          </div>
          <div className="overflow-hidden">
            <div className="font-medium text-on-surface truncate">{record.employeeName}</div>
            <div className="text-xs text-on-surface-variant truncate">{record.employeeId}</div>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{record.date}</td>

      {/* First In */}
      <td className="py-3 px-4 font-medium text-primary whitespace-nowrap">
        {record.firstIn || '--'}
      </td>

      {/* Last Out */}
      <td className="py-3 px-4 font-medium text-primary whitespace-nowrap">
        {record.lastOut || '--'}
      </td>

      {/* Total Hours */}
      <td className="py-3 px-4 text-on-surface whitespace-nowrap">{record.totalHours}</td>

      {/* Status */}
      <td className="py-3 px-4 whitespace-nowrap">
        <AttendanceStatusBadge status={record.status} />
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label={`View actions for ${record.employeeName}`}
          className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </td>
    </tr>
  );
};
