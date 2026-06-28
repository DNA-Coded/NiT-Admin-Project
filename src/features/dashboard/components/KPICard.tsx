import React from 'react';
import { cn } from '@/lib/utils';

export type KPIVariant = 'default' | 'success' | 'danger' | 'warning';

export interface KPICardProps {
  title: string;
  value: string | React.ReactNode;
  variant?: KPIVariant;
  action?: React.ReactNode;
}

const variantStyles: Record<KPIVariant, string> = {
  default: '',
  success: 'border-l-4 border-l-success',
  danger: 'border-l-4 border-l-danger',
  warning: 'border-l-4 border-l-warning',
};

export const KPICard: React.FC<KPICardProps> = ({ title, value, variant = 'default', action }) => {
  return (
    <div className={cn(
      "bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-28",
      variantStyles[variant]
    )}>
      <span className="font-label-md text-label-md text-on-surface-variant">{title}</span>
      <div className="flex items-center gap-2">
        {action}
        <div className="font-display-lg text-display-lg text-on-background">{value}</div>
      </div>
    </div>
  );
};
