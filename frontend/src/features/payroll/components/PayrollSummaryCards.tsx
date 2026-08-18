import React from 'react';
import type { PayrollSummary } from '@/types/payroll';

interface PayrollSummaryCardsProps {
  summary: PayrollSummary;
}

export const PayrollSummaryCards: React.FC<PayrollSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {/* Processed Staff */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm border-l-4 border-l-primary">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Processed</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">
          {summary.employeesProcessed}
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm border-l-4 border-l-warning">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Pending Review</span>
        <div className="font-display-lg text-2xl font-bold text-warning-text">
          {summary.pendingReviews}
        </div>
      </div>

      {/* Overtime */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Overtime Hours</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">
          {summary.overtimeHours}h
        </div>
      </div>

      {/* Late Arrivals */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium font-medium">Late Arrivals</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">
          {summary.totalLateArrivals}
        </div>
      </div>

      {/* Half Days */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Half Days</span>
        <div className="font-display-lg text-2xl font-bold text-on-background">
          {summary.halfDays}
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-col justify-between h-24 shadow-sm border-l-4 border-l-danger">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Exceptions</span>
        <div className="font-display-lg text-2xl font-bold text-danger-text">
          {summary.unapprovedExceptions}
        </div>
      </div>
    </div>
  );
};
