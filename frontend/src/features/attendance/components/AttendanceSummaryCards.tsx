import React from 'react';
import type { AttendanceSummary } from '@/types/attendance';

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {/* Present Today */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-success shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Present Today</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{summary.presentToday.toLocaleString()}</div>
      </div>

      {/* Absent Today */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-danger shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Absent Today</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{summary.absentToday.toLocaleString()}</div>
      </div>

      {/* Late Arrivals */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-warning shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Late Arrivals</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{summary.lateArrivals.toLocaleString()}</div>
      </div>

      {/* Early Departures */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 border-l-4 border-l-primary shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Early Departures</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{summary.earlyDepartures.toLocaleString()}</div>
      </div>

      {/* Avg Hours */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm col-span-2 md:col-span-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Avg Working Hours</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">{summary.avgWorkingHours}</div>
      </div>
    </div>
  );
};
