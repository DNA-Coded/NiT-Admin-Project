import React from 'react';
import type { AttendanceRecord } from '@/types/attendance';

interface AttendanceTimelineProps {
  record: AttendanceRecord;
}

export const AttendanceTimeline: React.FC<AttendanceTimelineProps> = ({ record }) => {
  return (
    <div className="flex flex-col gap-4 font-body-sm text-body-sm">
      <h6 className="font-label-md text-label-md text-primary font-bold">Activity Timeline</h6>

      {record.firstIn ? (
        <div className="relative pl-6 border-l border-outline-variant flex flex-col gap-5 py-1">
          {/* First Check-In */}
          <div className="relative">
            <span className="absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full bg-success-bg border-2 border-success flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            </span>
            <div>
              <p className="font-medium text-on-background">Check In</p>
              <p className="text-on-surface-variant font-medium text-[13px]">{record.firstIn}</p>
              {record.lateArrival && (
                <span className="inline-flex text-[11px] font-medium text-warning-text bg-warning-bg px-1.5 py-0.5 rounded mt-1 border border-warning/15">
                  Late Entry
                </span>
              )}
            </div>
          </div>

          {/* Breaks */}
          {record.breakSessions.map((brk, idx) => (
            <div key={brk.id} className="relative">
              <span className="absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full bg-surface-container-high border-2 border-outline flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
              </span>
              <div>
                <p className="font-medium text-on-background">Break {idx + 1}</p>
                <p className="text-on-surface-variant font-medium text-[13px]">
                  {brk.breakStart} - {brk.breakEnd} ({brk.durationMins} mins)
                </p>
              </div>
            </div>
          ))}

          {/* Last Check-Out */}
          {record.lastOut ? (
            <div className="relative">
              <span className="absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full bg-danger-bg border-2 border-danger flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
              </span>
              <div>
                <p className="font-medium text-on-background">Check Out</p>
                <p className="text-on-surface-variant font-medium text-[13px]">{record.lastOut}</p>
                {record.earlyExit && (
                  <span className="inline-flex text-[11px] font-medium text-danger-text bg-danger-bg px-1.5 py-0.5 rounded mt-1 border border-danger/15">
                    Early Exit
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full bg-surface-container-low border-2 border-outline-variant/60 flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              </span>
              <div>
                <p className="font-medium text-on-surface-variant italic">Active - Not Checked Out</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-on-surface-variant font-medium italic">
          No activity logs recorded for this day (Absent or On Leave).
        </div>
      )}
    </div>
  );
};
