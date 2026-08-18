import { useState, useEffect } from 'react';
import {
  mockPayrollSummary,
  mockPayrollRecords,
} from '@/mocks/payroll';
import type { PayrollRecord, PayrollFilterState } from '@/types/payroll';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { PayrollSummaryCards } from '@/features/payroll/components/PayrollSummaryCards';
import { PayrollFilterBar } from '@/features/payroll/components/PayrollFilterBar';
import { PayrollTable } from '@/features/payroll/components/PayrollTable';
import { PayrollDrawer } from '@/features/payroll/components/PayrollDrawer';
import { AttendanceExceptionPanel } from '@/features/payroll/components/AttendanceExceptionPanel';

const initialFilters: PayrollFilterState = {
  payrollMonth: 'November 2023',
  department: '',
  employeeSearch: '',
  employmentType: '',
  attendanceStatus: '',
  payrollStatus: '',
};

export default function Payroll() {
  const [filters, setFilters] = useState<PayrollFilterState>(initialFilters);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [viewState, setViewState] = useState<ViewState>('loading');

  // Simulate network loading on filter change
  useEffect(() => {
    setViewState('loading');
    const timer = setTimeout(() => {
      setViewState('success');
    }, 450);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: keyof PayrollFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filter list
  const filteredRecords = mockPayrollRecords.filter((rec) => {
    const matchesSearch =
      filters.employeeSearch === '' ||
      rec.employeeName.toLowerCase().includes(filters.employeeSearch.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(filters.employeeSearch.toLowerCase());

    const matchesDept =
      filters.department === '' || rec.department === filters.department;

    const matchesType =
      filters.employmentType === '' || rec.employmentType === filters.employmentType;

    const matchesStatus =
      filters.attendanceStatus === '' || rec.attendanceStatus === filters.attendanceStatus;

    const matchesReview =
      filters.payrollStatus === '' || rec.reviewStatus === filters.payrollStatus;

    return matchesSearch && matchesDept && matchesType && matchesStatus && matchesReview;
  });

  const currentViewState =
    viewState === 'success' && filteredRecords.length === 0 ? 'empty' : viewState;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Payroll Summary</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
            Pre-finalization review of attendance-derived payroll indicators and work-hours logs.
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto">
          <button
            aria-label="Export payroll spreadsheet"
            className="px-4 py-2 bg-white border border-outline text-primary font-label-md rounded-lg hover:bg-surface-container-low transition-colors shadow-sm"
            onClick={() => alert('Exporting payroll spreadsheet logs... (Simulated Action)')}
          >
            Export Sheet
          </button>
          <button
            aria-label="Finalize and Sync to ERP"
            className="px-4 py-2 bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold"
            onClick={() => alert('Synchronizing payroll records to ERP system... (Simulated Action)')}
          >
            Finalize & Sync
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <PayrollSummaryCards summary={mockPayrollSummary} />

      {/* Advanced Filter Bar */}
      <PayrollFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Primary logs and exceptions workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        {/* Left Columns: Payroll Matrix Table */}
        <div className="lg:col-span-2">
          <PayrollTable
            month={filters.payrollMonth}
            records={filteredRecords}
            viewState={currentViewState}
            onSelect={setSelectedRecord}
          />
        </div>
        {/* Right Column: Alerts exception panel */}
        <div>
          <AttendanceExceptionPanel />
        </div>
      </div>

      {/* Rule & Sync details strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex gap-5 items-start shadow-sm">
          <div className="p-3 bg-primary/5 rounded-full shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">info</span>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold mb-1.5">
              Attendance Payroll Policies
            </h4>
            <p className="text-[12px] text-on-surface-variant leading-relaxed font-medium">
              Standard work hours are computed at 160 hours/month. Overtime is verified at 1.5x on weekdays and 2.0x during weekend blocks. Unexcused absences automatically trigger payroll deduction reviews.
            </p>
          </div>
        </div>

        <div className="bg-primary text-on-primary rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="font-label-md text-label-md mb-1.5 font-bold">Lock Attendance Sheet</h4>
            <p className="text-[12px] text-white/80 leading-relaxed max-w-sm font-medium">
              Finalize current attendance audits. Once synchronized, the period locks and locks records from adjustments.
            </p>
          </div>
          <button
            className="mt-4 bg-white text-primary px-5 py-2 rounded-lg font-bold text-label-sm w-fit active:scale-95 hover:bg-white/95 transition-all shadow-sm"
            onClick={() => alert('Locking current payroll log sheets... (Simulated Action)')}
          >
            Finalize Period
          </button>
        </div>
      </div>

      {/* Details drawer sheet preview */}
      <PayrollDrawer
        month={filters.payrollMonth}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
