import React from 'react';
import type { AttendanceRecord } from '@/types/attendance';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { AttendanceTimeline } from './AttendanceTimeline';

interface AttendanceDrawerProps {
  record: AttendanceRecord | null;
  onClose: () => void;
}

export const AttendanceDrawer: React.FC<AttendanceDrawerProps> = ({ record, onClose }) => {
  if (!record) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-lg z-50 flex flex-col transition-transform duration-300 transform translate-x-0 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background">Attendance Log Details</h3>
          <button
            aria-label="Close details"
            className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* Profile Overview */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg font-bold text-xl">
              {getInitials(record.employeeName)}
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-background">{record.employeeName}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{record.employeeId}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-body-sm text-body-sm text-outline font-medium">{record.date}</span>
                <AttendanceStatusBadge status={record.status} />
              </div>
            </div>
          </div>

          {/* Timing details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Shift & Working Hours</h5>
            <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Assigned Shift</span>
                {record.shift}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Total Working Hours</span>
                {record.totalHours}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">First Check-In</span>
                {record.firstIn || '--'}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Last Check-Out</span>
                {record.lastOut || '--'}
              </div>
            </div>
          </div>

          {/* Timeline activity log */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
            <AttendanceTimeline record={record} />
          </div>

          {/* Device & Hardware logging details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Biometric Authentication Hardware</h5>
            <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface">
              {record.deviceUsed ? (
                <>
                  <div className="flex items-center gap-2 text-success font-medium">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Synced: {record.deviceUsed}</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant pl-6.5">
                    Records synchronized via cloud WebSocket sync service.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-on-surface-variant italic">
                  <span className="material-symbols-outlined text-[18px] text-outline font-light">info</span>
                  <span>No biometric verification logging found for this status.</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-2">
            <h5 className="font-label-md text-label-md text-primary font-bold">Administrator Notes</h5>
            <p className="font-body-sm text-body-sm text-on-surface-variant italic">
              {record.notes || 'No notes added for this record.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
