import React from 'react';
import type { OnCampusEmployee } from '@/types/dashboard';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';

interface OnCampusWidgetProps {
  data: OnCampusEmployee[];
  viewState: ViewState;
  totalInside: number;
}

export const OnCampusWidget: React.FC<OnCampusWidgetProps> = ({ data, viewState, totalInside }) => {
  const isEmpty = viewState === 'success' && data.length === 0;

  return (
    <WidgetCard 
      title="On Campus Now" 
      className="flex flex-col h-[380px]" // Explicit component frame height matching
      bodyClassName="p-0 flex flex-col flex-1 min-h-0" // Flexible inner layout mapping
    >
      {viewState !== 'success' || isEmpty ? (
        <div className="p-6 flex items-center justify-center flex-1">
          <StatePlaceholder 
            state={isEmpty ? 'empty' : viewState} 
            emptyMessage="No employees currently on campus."
          />
        </div>
      ) : (
        <>
          {/* Scroll container limits list growth securely without stretching card bounds */}
          <div className="overflow-y-auto flex-1 p-4 custom-scrollbar max-h-[280px]">
            <ul className="flex flex-col gap-4">
              {data.map((employee) => (
                <li key={employee.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-label-md text-label-md text-on-background font-medium">{employee.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{employee.department}</p>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{employee.timeIn}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Locked sticky bottom interaction panel layout */}
          {totalInside > 0 && (
            <div className="p-4 border-t border-outline-variant text-center bg-surface-container-lowest mt-auto rounded-b-xl">
              <button 
                aria-label={`View all ${totalInside} employees currently on campus`} 
                className="text-primary font-label-md text-label-md hover:underline w-full text-center block cursor-pointer"
              >
                View All {totalInside.toLocaleString()} Records
              </button>
            </div>
          )}
        </>
      )}
    </WidgetCard>
  );
};