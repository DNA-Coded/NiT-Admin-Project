import React from 'react';
import { cn } from '@/lib/utils';

export type ViewState = 'loading' | 'empty' | 'error' | 'success';

interface StatePlaceholderProps {
  state: ViewState;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StatePlaceholder: React.FC<StatePlaceholderProps> = ({
  state,
  emptyMessage = 'No data available.',
  errorMessage = 'Something went wrong.',
  className,
  children,
}) => {
  if (state === 'success') {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px] text-center',
        className
      )}
    >
      {state === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
          <p className="font-body-sm text-body-sm">Loading data...</p>
        </div>
      )}

      {state === 'empty' && (
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
          <p className="font-body-sm text-body-sm">{emptyMessage}</p>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-3 text-error">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="font-body-sm text-body-sm">{errorMessage}</p>
          <button className="mt-2 px-4 py-2 border border-error rounded hover:bg-error-container transition-colors font-label-md text-label-md">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
