import React from 'react';
import { cn } from '@/lib/utils';
import type { EmployeeStatus } from '@/types/employees';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

const statusStyles: Record<EmployeeStatus, string> = {
  ACTIVE: 'bg-success-bg text-success-text border border-success/20',
  ON_LEAVE: 'bg-warning-bg text-warning-text border border-warning/20',
  RETIRED: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
  SUSPENDED: 'bg-danger-bg text-danger-text border border-danger/20',
};

const statusIcons: Record<EmployeeStatus, string> = {
  ACTIVE: 'check_circle',
  ON_LEAVE: 'event_busy',
  RETIRED: 'directions_walk',
  SUSPENDED: 'cancel',
};

const statusLabels: Record<EmployeeStatus, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  RETIRED: 'Retired',
  SUSPENDED: 'Suspended',
};

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm shadow-sm',
        statusStyles[status],
        className
      )}
    >
      <span className="material-symbols-outlined text-[14px]">{statusIcons[status]}</span>
      {statusLabels[status]}
    </span>
  );
};
