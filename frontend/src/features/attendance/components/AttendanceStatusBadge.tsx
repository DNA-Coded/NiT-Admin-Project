import React from 'react';
import { cn } from '@/lib/utils';
import type { AttendanceStatus } from '@/types/attendance';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

const statusStyles: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-success-bg text-success-text border-success/20',
  LATE: 'bg-warning-bg text-warning-text border-warning/20',
  ABSENT: 'bg-danger-bg text-danger-text border-danger/20',
  HALF_DAY: 'bg-surface-container text-on-surface border-outline-variant/30',
  ON_LEAVE: 'bg-surface-container-low text-on-surface-variant border-outline-variant/20',
};

const statusLabels: Record<AttendanceStatus, string> = {
  PRESENT: 'Present',
  LATE: 'Late',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  ON_LEAVE: 'On Leave',
};

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium border transition-all duration-150',
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
