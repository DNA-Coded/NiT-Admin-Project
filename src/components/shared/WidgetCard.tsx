import React from 'react';
import { cn } from '@/lib/utils';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  headerAction,
  className,
  bodyClassName,
}) => {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest border border-outline-variant rounded flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="px-6 py-4 border-b border-outline-variant bg-[#F1F5F9] flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-background">{title}</h2>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className={cn('flex-1 overflow-y-auto', bodyClassName)}>
        {children}
      </div>
    </div>
  );
};
