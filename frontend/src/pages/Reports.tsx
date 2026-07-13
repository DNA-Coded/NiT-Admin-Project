import { useState, useEffect } from 'react';
import {
  mockKPIMetrics,
  mockMonthlyAttendanceTrend,
  mockLateArrivalsByDept,
  mockReportItems,
} from '@/mocks/reports';
import type { ReportItem, ReportFilterState } from '@/types/reports';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { ReportsSummaryCards } from '@/features/reports/components/ReportsSummaryCards';
import { ReportsFilterBar } from '@/features/reports/components/ReportsFilterBar';
import { AttendanceTrendChart } from '@/features/reports/components/AttendanceTrendChart';
import { DepartmentComparisonChart } from '@/features/reports/components/DepartmentComparisonChart';
import { QuickReportCard } from '@/features/reports/components/QuickReportCard';
import { ReportsTable } from '@/features/reports/components/ReportsTable';
import { ReportDrawer } from '@/features/reports/components/ReportDrawer';

const initialFilters: ReportFilterState = {
  dateRange: '',
  department: '',
  employeeType: '',
  status: '',
  shift: '',
  device: '',
  reportType: '',
  search: '',
};

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilterState>(initialFilters);
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Extract unique filters options dynamically
  const uniqueShifts = ['Regular Shift (09:00 AM - 05:00 PM)', 'Morning Shift (08:30 AM - 04:30 PM)'];
  const uniqueDevices = ['Main Gate Biometric', 'CS Block Face Rec', 'Arts Faculty West'];
  const reportTypes = ['Daily Attendance', 'Monthly Attendance', 'Department Summary', 'Device Health', 'Payroll Attendance Summary'];

  // Simulate network load when filters change
  useEffect(() => {
    setViewState('loading');
    const timer = setTimeout(() => {
      setViewState('success');
    }, 450);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: keyof ReportFilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filter logs dynamically
  const filteredReports = mockReportItems.filter((rep) => {
    const matchesSearch =
      filters.search === '' ||
      rep.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType =
      filters.reportType === '' || rep.type === filters.reportType;

    const matchesRange =
      filters.dateRange === '' || rep.dateRange.includes(filters.dateRange) || filters.dateRange === 'Last 30 Days'; // mock pass-through

    return matchesSearch && matchesType && matchesRange;
  });

  const currentViewState =
    viewState === 'success' && filteredReports.length === 0 ? 'empty' : viewState;

  const handleQuickReportClick = (title: string) => {
    alert(`Generating quick report: ${title}... (Simulated Action)`);
  };

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Reports & Analytics</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
            Aggregated institutional attendance performance logs and metrics reviews.
          </p>
        </div>
        <button
          aria-label="Generate new report"
          className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm self-start md:self-auto shrink-0"
          onClick={() => handleQuickReportClick('Custom Summary')}
        >
          <span className="material-symbols-outlined text-[20px]">add_chart</span>
          Generate Report
        </button>
      </div>

      {/* KPI Cards Bento Grid */}
      <ReportsSummaryCards metrics={mockKPIMetrics} />

      {/* Filter Section */}
      <ReportsFilterBar
        devices={uniqueDevices}
        filters={filters}
        reportTypes={reportTypes}
        shifts={uniqueShifts}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Analytics Visual Charts Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AttendanceTrendChart data={mockMonthlyAttendanceTrend} />
        </div>
        <div>
          <DepartmentComparisonChart data={mockLateArrivalsByDept} />
        </div>
      </div>

      {/* Quick Report Shortcuts Panel */}
      <div className="mb-6">
        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-4">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickReportCard
            description="Daily summary of active check-in counts"
            icon="today"
            title="Daily Attendance"
            onClick={() => handleQuickReportClick('Daily Attendance')}
          />
          <QuickReportCard
            description="Monthly efficiency stats reviews"
            icon="calendar_month"
            title="Monthly Attendance"
            onClick={() => handleQuickReportClick('Monthly Attendance')}
          />
          <QuickReportCard
            description="Late entrance counts by faculty block"
            icon="lan"
            title="Department Summary"
            onClick={() => handleQuickReportClick('Department Summary')}
          />
          <QuickReportCard
            description="Staff profile biometric log sheets"
            icon="person"
            title="Employee Attendance"
            onClick={() => handleQuickReportClick('Employee Attendance')}
          />
          <QuickReportCard
            description="Biometric device latency transactions log"
            icon="router"
            title="Device Health"
            onClick={() => handleQuickReportClick('Device Health')}
          />
          <QuickReportCard
            description="Overtime verification report syncs"
            icon="payments"
            title="Payroll Summary"
            onClick={() => handleQuickReportClick('Payroll Summary')}
          />
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="flex-1">
        <ReportsTable
          reports={filteredReports}
          viewState={currentViewState}
          onSelect={setSelectedReport}
        />
      </div>

      {/* Report Preview Drawer */}
      <ReportDrawer report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}
