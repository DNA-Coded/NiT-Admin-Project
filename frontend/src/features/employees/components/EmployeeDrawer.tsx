import React from 'react';
import type { Employee } from '@/types/employees';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeDrawerProps {
  employee: Employee | null;
  onClose: () => void;
}

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  // Helper to extract initials for avatar placeholder
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
          <h3 className="font-headline-md text-headline-md text-on-background">Employee Details</h3>
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
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg font-bold text-2xl">
              {getInitials(employee.name)}
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-background">{employee.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{employee.id}</p>
              <div className="mt-1.5">
                <EmployeeStatusBadge status={employee.status} />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Employment Information</h5>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 font-body-sm text-body-sm text-on-surface">
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Department</span>
                {employee.department}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Designation</span>
                {employee.designation}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Employment Type</span>
                {employee.employmentType}
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm">Joining Date</span>
                {employee.joiningDate}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Contact Details</h5>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm text-on-surface">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline">mail</span>
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline">call</span>
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>

          {/* Assigned Biometric Device */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Biometric Device Mapping</h5>
            {employee.biometricDevice ? (
              <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface">
                <div className="flex items-center gap-2 text-success font-medium">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Registered ({employee.biometricDevice.name})</span>
                </div>
                <p className="text-on-surface-variant text-[13px] pl-6.5">
                  Location: {employee.biometricDevice.location}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[18px] text-outline">cancel</span>
                <span>No Biometric Device Registered</span>
              </div>
            )}
          </div>

          {/* Attendance Summary */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Attendance Statistics (Current Month)</h5>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-success-bg/30 border border-success/20 p-2 rounded">
                <span className="block font-display-lg text-lg font-bold text-success-text">
                  {employee.attendanceSummary.presentDays}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Present</span>
              </div>
              <div className="bg-danger-bg/30 border border-danger/20 p-2 rounded">
                <span className="block font-display-lg text-lg font-bold text-danger-text">
                  {employee.attendanceSummary.absentDays}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Absent</span>
              </div>
              <div className="bg-warning-bg/30 border border-warning/20 p-2 rounded">
                <span className="block font-display-lg text-lg font-bold text-warning-text">
                  {employee.attendanceSummary.lateDays}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Late</span>
              </div>
              <div className="bg-surface-container-high border border-outline-variant/30 p-2 rounded">
                <span className="block font-display-lg text-lg font-bold text-on-surface-variant">
                  {employee.attendanceSummary.leaveDays}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Leaves</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
