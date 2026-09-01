import React from 'react';
import type { LiveAttendanceEvent } from '@/types/dashboard';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LiveIndicator } from '@/components/shared/LiveIndicator';

interface LiveAttendanceFeedProps {
  data: LiveAttendanceEvent[];
  viewState: ViewState;
}

export const LiveAttendanceFeed: React.FC<LiveAttendanceFeedProps> = ({ data, viewState }) => {
  const isEmpty = viewState === 'success' && data.length === 0;

  return (
    <WidgetCard 
      title="Live Attendance Feed" 
      headerAction={<LiveIndicator />} 
      className="flex-1" 
      // Adjusted padding and scrolling context to allow seamless structural clipping
      bodyClassName="p-0"
    >
      {viewState !== 'success' || isEmpty ? (
        <div className="p-6 flex items-center justify-center min-h-[240px]">
          <StatePlaceholder 
            state={isEmpty ? 'empty' : viewState} 
            emptyMessage="No recent attendance events."
          />
        </div>
      ) : (
        // Constrained layout frame matching OnCampusWidget height bounds
        <div className="max-h-[300px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <caption className="sr-only">Live updates of employee attendance events.</caption>
            {/* sticky top forces headers to remain visible while scrolling past long record feeds */}
            <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium">Employee</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium">Department</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium">Time</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-medium text-right">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
              {data.map((event) => (
                <tr key={event.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-3 font-medium text-on-background">{event.employeeName}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{event.department}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{event.time}</td>
                  <td className="px-6 py-3 text-right">
                    <StatusBadge status={event.event} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetCard>
  );
};