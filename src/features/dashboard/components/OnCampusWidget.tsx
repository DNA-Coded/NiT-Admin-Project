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
  return (
    <WidgetCard title="On Campus Now" className="flex-1" bodyClassName="p-4 max-h-[300px]">
      <StatePlaceholder state={viewState} emptyMessage="No employees currently on campus.">
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
      </StatePlaceholder>
      {viewState === 'success' && totalInside > 0 && (
        <div className="p-4 border-t border-outline-variant text-center mt-auto bg-surface-container-lowest">
          <button aria-label={`View all ${totalInside} employees currently on campus`} className="text-primary font-label-md text-label-md hover:underline w-full">
            View All {totalInside.toLocaleString()} Records
          </button>
        </div>
      )}
    </WidgetCard>
  );
};
