import React from 'react';
import { cn } from '@/lib/utils';
import type { EmployeeStatus } from '@/types/employees';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

const statusStyles: Record<EmployeeStatus, string> = {
  ACTIVE: 'bg-success-bg text-success-text',
  ON_LEAVE: 'bg-warning-bg text-warning-text',
  INACTIVE: 'bg-danger-bg text-danger-text',
};

const statusLabels: Record<EmployeeStatus, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  INACTIVE: 'Inactive',
};

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium transition-all duration-150',
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
