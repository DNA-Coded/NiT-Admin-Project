import React from 'react';
import { mockPayrollExceptions } from '@/mocks/payroll';

export const AttendanceExceptionPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
        <h4 className="font-label-md text-primary font-bold">Unresolved Payroll Exceptions</h4>
        <span className="material-symbols-outlined text-[20px] text-outline">report</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mockPayrollExceptions.map((ex) => (
          <div
            key={ex.id}
            className={`p-3.5 border rounded-lg flex gap-3.5 items-start transition-all duration-200 hover:-translate-y-0.5 ${
              ex.severity === 'critical'
                ? 'bg-danger-bg/25 border-danger/25 text-danger-text'
                : ex.severity === 'warning'
                ? 'bg-warning-bg/25 border-warning/25 text-warning-text'
                : 'bg-surface border-outline-variant/60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
              {ex.severity === 'critical'
                ? 'error'
                : ex.severity === 'warning'
                ? 'warning_amber'
                : 'info'}
            </span>
            <div className="flex-1 overflow-hidden">
              <h5 className="font-label-md text-[13px] font-bold leading-tight truncate">
                {ex.employeeName} ({ex.employeeId})
              </h5>
              <p className="text-[11px] font-semibold text-primary/80 mt-0.5">{ex.type}</p>
              <p className="text-[11px] leading-relaxed mt-1 text-on-surface-variant">
                {ex.description}
              </p>
            </div>
          </div>
        ))}
        {mockPayrollExceptions.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant italic">
            Zero unresolved exceptions. Attendance records validated for payroll.
          </div>
        )}
      </div>
    </div>
  );
};
