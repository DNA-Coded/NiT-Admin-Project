import React from 'react';
import type { AttendanceRecord } from '@/types/attendance';

interface AttendanceTimelineProps {
  record: AttendanceRecord;
}

export const AttendanceTimeline: React.FC<AttendanceTimelineProps> = ({ record }) => {
  return (
    <div className="flex flex-col gap-4 font-body-sm text-body-sm">
      <h6 className="font-label-md text-label-md text-primary font-bold">Activity Timeline</h6>

      {record.attendanceType ? (
        <div className="relative pl-6 border-l border-outline-variant flex flex-col gap-5 py-1">
          {/* Single Event Logging */}
          <div className="relative">
            <span className={`absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${record.attendanceType === 'IN' ? 'bg-success-bg border-success' : 'bg-danger-bg border-danger'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${record.attendanceType === 'IN' ? 'bg-success' : 'bg-danger'}`}></span>
            </span>
            <div>
              <p className="font-medium text-on-background">Biometric Punch {record.attendanceType}</p>
              <p className="text-on-surface-variant font-medium text-[13px]">{record.attendanceType === 'IN' ? record.firstIn : record.lastOut}</p>
              {record.lateArrival && record.attendanceType === 'IN' && (
                <span className="inline-flex text-[11px] font-medium text-warning-text bg-warning-bg px-1.5 py-0.5 rounded mt-1 border border-warning/15">
                  Late Entry
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-on-surface-variant font-medium italic">
          No activity logs recorded for this event.
        </div>
      )}
    </div>
  );
};
