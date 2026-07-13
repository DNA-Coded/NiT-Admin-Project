import React from 'react';
import type { LiveEvent } from '@/types/liveMonitor';

interface LiveAttendanceFeedProps {
  events: LiveEvent[];
}

export const LiveAttendanceFeed: React.FC<LiveAttendanceFeedProps> = ({ events }) => {
  return (
    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded flex flex-col overflow-hidden shadow-sm h-[400px]">
      <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low shrink-0">
        <h3 className="font-headline-md text-headline-md text-on-surface">Live Event Stream</h3>
        <div className="flex items-center gap-3">
          <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Auto-refreshing</span>
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only"> Live attendance events stream table </caption>
          <thead className="bg-surface-container-high/40 sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant whitespace-nowrap">Time</th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant whitespace-nowrap">Employee</th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant whitespace-nowrap">Department</th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant whitespace-nowrap">Action</th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant whitespace-nowrap">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
            {events.map((ev) => (
              <tr
                key={ev.id}
                className={`hover:bg-surface-container-low transition-colors duration-150 ${
                  ev.isNew ? 'bg-surface-container animate-pulse' : 'bg-surface-container-lowest'
                }`}
              >
                <td className="py-3 px-4 border-b border-outline-variant font-mono text-[13px] text-on-surface-variant whitespace-nowrap">
                  {ev.timestamp}
                </td>
                <td className="py-3 px-4 border-b border-outline-variant font-medium whitespace-nowrap">
                  <div>{ev.employeeName}</div>
                  <div className="text-[11px] text-on-surface-variant font-light">{ev.employeeId}</div>
                </td>
                <td className="py-3 px-4 border-b border-outline-variant text-on-surface-variant whitespace-nowrap">
                  {ev.department}
                </td>
                <td className="py-3 px-4 border-b border-outline-variant whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[12px] font-medium border ${
                      ev.eventType === 'Check In'
                        ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                        : 'bg-surface-container text-primary border-primary-fixed-dim'
                    }`}
                  >
                    {ev.eventType}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-outline-variant text-on-surface-variant whitespace-nowrap">
                  {ev.deviceName}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-on-surface-variant italic">
                  Waiting for live biometric sync events...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
