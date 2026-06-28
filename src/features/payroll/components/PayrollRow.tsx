import React from 'react';
import type { PayrollRecord } from '@/types/payroll';

interface PayrollRowProps {
  record: PayrollRecord;
  onSelect: (record: PayrollRecord) => void;
}

export const PayrollRow: React.FC<PayrollRowProps> = ({ record, onSelect }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: PayrollRecord['reviewStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-[#dcfce7] text-[#166534] border-success/15';
      case 'FLAGGED':
        return 'bg-error-container text-on-error-container border-error/15';
      default:
        return 'bg-[#fef3c7] text-[#92400e] border-warning/15';
    }
  };

  return (
    <tr
      className="hover:bg-surface-container-low transition-colors cursor-pointer"
      onClick={() => onSelect(record)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs shrink-0">
            {getInitials(record.employeeName)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-primary truncate leading-tight">{record.employeeName}</p>
            <p className="text-xs text-on-surface-variant leading-none mt-0.5">ID: {record.employeeId}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-body-sm text-on-surface whitespace-nowrap">{record.department}</td>
      <td className="px-6 py-4 text-center font-semibold text-primary whitespace-nowrap">{record.workingDays}</td>
      <td className="px-6 py-4 text-center font-semibold text-primary whitespace-nowrap">{record.presentDays}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{record.leaveDays}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{record.halfDays}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">
        <span className={`${record.overtimeHours > 0 ? 'text-amber-700 font-medium' : 'text-on-surface-variant'}`}>
          {record.overtimeHours} hrs
        </span>
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">
        <span className={`${record.lateArrivals > 0 ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
          {record.lateArrivals}
        </span>
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{record.attendanceStatus}</td>
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
            record.reviewStatus
          )}`}
        >
          {record.reviewStatus}
        </span>
      </td>
    </tr>
  );
};
