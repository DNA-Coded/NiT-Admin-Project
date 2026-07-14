import { useState } from 'react';
import type { AttendanceRecord } from '@/types/attendance';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { AttendanceSummaryCards } from '@/features/attendance/components/AttendanceSummaryCards';
import { AttendanceFilters } from '@/features/attendance/components/AttendanceFilters';
import { AttendanceTable } from '@/features/attendance/components/AttendanceTable';
import { AttendanceCalendar } from '@/features/attendance/components/AttendanceCalendar';
import { AttendanceDrawer } from '@/features/attendance/components/AttendanceDrawer';
import { ExportMenu } from '@/features/attendance/components/ExportMenu';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { mockAttendanceSummary } from '@/mocks/attendance'; // Summary is still mocked since backend doesn't have a summary endpoint

export default function Attendance() {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const {
    records,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    meta,
    correctRecord,
  } = useAttendance();

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to page 1 when filter changes
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      department: '',
      employeeSearch: '',
      status: '',
      shift: '',
      device: '',
    });
    setPage(1);
  };

  const currentViewState: ViewState = loading 
    ? 'loading' 
    : error 
      ? 'error' 
      : records.length === 0 
        ? 'empty' 
        : 'success';

  // Hardcode these since dynamic derivation from current paginated page is not useful
  const uniqueDevices = ['Main Gate Biometric', 'CS Block Face Rec']; 
  const uniqueShifts = ['Regular Shift (09:00 AM - 05:00 PM)', 'Morning Shift (08:30 AM - 04:30 PM)', 'Early Guard (07:00 AM - 03:00 PM)'];

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Attendance Records</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
            Review and manage historical biometric attendance records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Table / Calendar Toggle */}
          <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-1">
            <button
              className={`px-4 py-1.5 rounded text-label-md font-label-md transition-all ${
                viewMode === 'table'
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`px-4 py-1.5 rounded text-label-md font-label-md transition-all ${
                viewMode === 'calendar'
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </button>
          </div>

          {/* Export Action Dropdown */}
          <ExportMenu />
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={mockAttendanceSummary} />

      {/* Filter Section */}
      <AttendanceFilters
        devices={uniqueDevices}
        filters={filters}
        shifts={uniqueShifts}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* View Mode Switching */}
      <div className="flex-1">
        {viewMode === 'table' ? (
          <AttendanceTable
            records={records}
            viewState={currentViewState}
            onSelectRecord={setSelectedRecord}
            currentPage={page}
            totalPages={meta.totalPages}
            totalEntries={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        ) : (
          <AttendanceCalendar />
        )}
      </div>

      {/* Detailed Side Drawer */}
      <AttendanceDrawer 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
        onCorrect={correctRecord}
      />
    </div>
  );
}
