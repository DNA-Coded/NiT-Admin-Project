import React from 'react';
import type { LiveEvent } from '@/types/liveMonitor';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';

interface LiveAttendanceFeedProps {
  events?: LiveEvent[];
  data?: LiveEvent[]; // Compatibility fallback for Dashboard views
  viewState?: ViewState;
  maxRows?: number;
}

export const LiveAttendanceFeed: React.FC<LiveAttendanceFeedProps> = ({
  events,
  data,
  viewState = 'success',
  maxRows = 15,
}) => {
  // Consolidate props so it works seamlessly in both LiveMonitor and Dashboard components
  const eventList = (events || data || []).slice(0, maxRows);
  const isLoading = viewState === 'loading';
  const isEmpty = (viewState === 'success' || viewState === 'empty') && eventList.length === 0;

  return (
    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-xs h-full min-h-[400px]">
      {/* Feed Header */}
      <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">
            sensors
          </span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Live Event Stream
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
            {eventList.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-body-sm text-body-sm text-on-surface-variant font-medium hidden sm:inline">
            Real-time feed
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Feed Body */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center h-full">
            <StatePlaceholder state="loading" />
          </div>
        ) : isEmpty ? (
          <div className="p-8 flex items-center justify-center h-full">
            <StatePlaceholder
              state="empty"
              emptyMessage="Waiting for live biometric sync events..."
            />
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <caption className="sr-only">Live attendance events stream table</caption>
            <thead className="bg-surface-container-high/60 sticky top-0 z-10 backdrop-blur-xs">
              <tr>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                  Time
                </th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                  Employee
                </th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                  Department
                </th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                  Action
                </th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                  Terminal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-body-sm text-body-sm text-on-surface">
              {eventList.map((ev) => {
                const isCheckIn = ev.eventType === 'Check In';

                return (
                  <tr
                    key={ev.id}
                    className={`transition-all duration-300 hover:bg-surface-container-low ${
                      ev.isNew
                        ? 'bg-primary-container/20 border-l-4 border-l-primary animate-pulse'
                        : 'bg-surface-container-lowest'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 border-b border-outline-variant/60 font-mono text-[13px] text-on-surface-variant">
                      {ev.timestamp}
                    </td>

                    {/* Employee Info with Avatar / Initials */}
                    <td className="py-3 px-4 border-b border-outline-variant/60 font-medium">
                      <div className="flex items-center gap-3">
                        {ev.avatarUrl ? (
                          <img
                            src={ev.avatarUrl}
                            alt={ev.employeeName}
                            className="w-8 h-8 rounded-full object-cover border border-outline-variant shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-sm shrink-0 border ${
                              isCheckIn
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {ev.employeeName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-on-surface">{ev.employeeName}</div>
                          <div className="text-[11px] text-on-surface-variant font-mono">
                            {ev.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 border-b border-outline-variant/60 text-on-surface-variant">
                      {ev.department}
                    </td>

                    {/* Action Badge */}
                    <td className="py-3 px-4 border-b border-outline-variant/60">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${
                          isCheckIn
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isCheckIn ? 'login' : 'logout'}
                        </span>
                        {ev.eventType}
                      </span>
                    </td>

                    {/* Terminal & Location */}
                    <td className="py-3 px-4 border-b border-outline-variant/60 text-on-surface-variant">
                      <div className="font-medium text-on-surface">{ev.deviceName}</div>
                      {ev.deviceLocation && (
                        <div className="text-[11px] text-on-surface-variant/80">
                          {ev.deviceLocation}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};