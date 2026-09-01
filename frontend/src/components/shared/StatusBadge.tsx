import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'IN' | 'OUT' | 'LATE' | 'DEFAULT';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  children?: React.ReactNode;
}

const statusStyles: Record<StatusType, string> = {
  IN: 'bg-success-bg text-success-text',
  OUT: 'bg-danger-bg text-danger-text',
  LATE: 'bg-warning-bg text-warning-text',
  DEFAULT: 'bg-surface-container-high text-on-surface',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm',
        statusStyles[status],
        className
      )}
    >
      {children || status}
    </span>
  );
};
