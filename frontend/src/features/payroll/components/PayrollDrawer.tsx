import React from 'react';
import type { PayrollRecord } from '@/types/payroll';

interface PayrollDrawerProps {
  record: PayrollRecord | null;
  onClose: () => void;
  month: string;
}

export const PayrollDrawer: React.FC<PayrollDrawerProps> = ({ record, onClose, month }) => {
  if (!record) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: PayrollRecord['reviewStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-[#dcfce7] text-[#166534] border-success/15';
      case 'FLAGGED':
        return 'bg-error-container text-on-error-container border-error/15';
      default:
        return 'bg-[#fef3c7] text-[#92400e] border-warning/15';
    }
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
          <h3 className="font-headline-md text-headline-md text-on-background">Attendance Payroll Sheet</h3>
          <button
            aria-label="Close details"
            className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 font-body-sm text-body-sm">
          {/* Profile Overview */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg font-bold text-xl shrink-0">
              {getInitials(record.employeeName)}
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-background font-bold">{record.employeeName}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{record.employeeId}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-body-sm text-body-sm text-outline font-medium">{month || 'November 2023'}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                    record.reviewStatus
                  )}`}
                >
                  {record.reviewStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Days Metrics */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Attendance Matrix</h5>
            <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Total Working Days</span>
                {record.workingDays} days
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Present Days</span>
                {record.presentDays} days
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Leaves Taken</span>
                {record.leaveDays} days
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Half Days Count</span>
                {record.halfDays} days
              </div>
            </div>
          </div>

          {/* Hours Stats */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Overtime & Penalty Details</h5>
            <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Overtime Hours</span>
                {record.overtimeHours} hrs
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Late Arrivals</span>
                {record.lateArrivals} times
              </div>
              <div className="col-span-2">
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Exceptions Flagged</span>
                {record.exceptionsCount > 0 ? (
                  <span className="text-danger font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    {record.exceptionsCount} unapproved issues require review.
                  </span>
                ) : (
                  <span className="text-[#10b981] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Zero payroll exceptions.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-2">
            <h5 className="font-label-md text-label-md text-primary font-bold">Audit / Notes</h5>
            <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
              {record.notes || 'No review remarks filed for this employee.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto border-t border-outline-variant pt-4 shrink-0">
            <button
              className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-bold"
              onClick={() => alert(`Marking ${record.employeeName} payroll details as verified... (Simulated Action)`)}
            >
              Verify Attendance Sheet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
