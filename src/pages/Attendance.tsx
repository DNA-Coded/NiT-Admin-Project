import { useState, useEffect } from 'react';
import { mockAttendanceRecords, mockAttendanceSummary } from '@/mocks/attendance';
import type { AttendanceRecord, AttendanceFilterState } from '@/types/attendance';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { AttendanceSummaryCards } from '@/features/attendance/components/AttendanceSummaryCards';
import { AttendanceFilters } from '@/features/attendance/components/AttendanceFilters';
import { AttendanceTable } from '@/features/attendance/components/AttendanceTable';
import { AttendanceCalendar } from '@/features/attendance/components/AttendanceCalendar';
import { AttendanceDrawer } from '@/features/attendance/components/AttendanceDrawer';
import { ExportMenu } from '@/features/attendance/components/ExportMenu';

const initialFilters: AttendanceFilterState = {
  startDate: '',
  endDate: '',
  department: '',
  employeeSearch: '',
  status: '',
  shift: '',
  device: '',
};

export default function Attendance() {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [filters, setFilters] = useState<AttendanceFilterState>(initialFilters);
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Extract unique shifts and devices dynamically from mock data for filters
  const uniqueShifts = Array.from(
    new Set(mockAttendanceRecords.map((rec) => rec.shift))
  ).sort();
  const uniqueDevices = Array.from(
    new Set(mockAttendanceRecords.map((rec) => rec.deviceUsed).filter(Boolean))
  ) as string[];

  // Simulate network fetch when filters change
  useEffect(() => {
    setViewState('loading');
    const timer = setTimeout(() => {
      setViewState('success');
    }, 450);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: keyof AttendanceFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filter records dynamically
  const filteredRecords = mockAttendanceRecords.filter((rec) => {
    // Employee Search (Name or ID)
    const matchesEmployee =
      filters.employeeSearch === '' ||
      rec.employeeName.toLowerCase().includes(filters.employeeSearch.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(filters.employeeSearch.toLowerCase());

    // Department Filter
    const matchesDept =
      filters.department === '' || rec.department === filters.department;

    // Status Filter
    const matchesStatus =
      filters.status === '' || rec.status === filters.status;

    // Shift Filter
    const matchesShift = filters.shift === '' || rec.shift === filters.shift;

    // Device Filter
    const matchesDevice = filters.device === '' || rec.deviceUsed === filters.device;

    // Start Date Filter
    const matchesStartDate =
      filters.startDate === '' || new Date(rec.date) >= new Date(filters.startDate);

    // End Date Filter
    const matchesEndDate =
      filters.endDate === '' || new Date(rec.date) <= new Date(filters.endDate);

    return (
      matchesEmployee &&
      matchesDept &&
      matchesStatus &&
      matchesShift &&
      matchesDevice &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const currentViewState =
    viewState === 'success' && filteredRecords.length === 0 ? 'empty' : viewState;

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
            records={filteredRecords}
            viewState={currentViewState}
            onSelectRecord={setSelectedRecord}
          />
        ) : (
          <AttendanceCalendar />
        )}
      </div>

      {/* Detailed Side Drawer */}
      <AttendanceDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}
