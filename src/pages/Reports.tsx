import { useState } from 'react';
import type { ReportItem } from '@/types/reports';
import type { ViewState } from '@/components/shared/StatePlaceholder';
import { ReportsSummaryCards } from '@/features/reports/components/ReportsSummaryCards';
import { ReportsFilterBar } from '@/features/reports/components/ReportsFilterBar';
import { AttendanceTrendChart } from '@/features/reports/components/AttendanceTrendChart';
import { DepartmentComparisonChart } from '@/features/reports/components/DepartmentComparisonChart';
import { QuickReportCard } from '@/features/reports/components/QuickReportCard';
import { ReportsTable } from '@/features/reports/components/ReportsTable';
import { ReportDrawer } from '@/features/reports/components/ReportDrawer';
import { useReports } from '@/features/reports/hooks/useReports';
import { useExport } from '@/features/exports/hooks/useExport';
import type { ExportFormat, ExportReportType } from '@/features/exports/services/export.service';

export default function Reports() {
  const {
    filters,
    handleFilterChange,
    resetFilters,
    reportsHistory,
    kpis,
    trendData,
    loading,
    error,
    page,
    setPage,
    meta,
    generateQuickReport,
  } = useReports();

  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Extract unique filters options dynamically
  const uniqueShifts = ['Regular Shift (09:00 AM - 05:00 PM)', 'Morning Shift (08:30 AM - 04:30 PM)'];
  const uniqueDevices = ['Main Gate Biometric', 'CS Block Face Rec', 'Arts Faculty West'];
  const reportTypes = ['Attendance Report', 'Faculty Summary', 'Device Health', 'Sync Analytics'];

  const currentViewState: ViewState = loading && reportsHistory.length === 0
    ? 'loading'
    : error
      ? 'error'
      : reportsHistory.length === 0
        ? 'empty'
        : 'success';

  const handleQuickReportClick = async (title: string) => {
    try {
      await generateQuickReport(title);
    } catch (err) {
      // Error is handled in the hook, maybe display a toast if implemented
    }
  };

  const { exportData, isExporting, error: exportError } = useExport();

  const handleExportReport = (reportTypeStr: string, format: ExportFormat) => {
    let type: ExportReportType = 'ATTENDANCE';
    if (reportTypeStr.includes('Faculty') || reportTypeStr.includes('Employee')) type = 'FACULTY';
    else if (reportTypeStr.includes('Device')) type = 'DEVICE';
    else if (reportTypeStr.includes('Sync')) type = 'SYNCHRONIZATION';

    exportData(type, format, filters);
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
          onClick={() => handleQuickReportClick('Daily Attendance')}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">add_chart</span>
          )}
          Generate Report
        </button>
      </div>

      {exportError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          Failed to export: {exportError.message}
        </div>
      )}

      {/* KPI Cards Bento Grid */}
      {kpis && <ReportsSummaryCards metrics={kpis} />}

      {/* Filter Section */}
      <ReportsFilterBar
        devices={uniqueDevices}
        filters={filters}
        reportTypes={reportTypes}
        shifts={uniqueShifts}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Analytics Visual Charts Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {trendData.length > 0 ? (
            <AttendanceTrendChart data={trendData} />
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm text-on-surface-variant font-body-sm">
              No trend data available for the selected period
            </div>
          )}
        </div>
        <div>
          {/* Mocking Department Comparison Chart because we lack a dedicated backend endpoint for it */}
          <DepartmentComparisonChart data={[
            { label: 'Computer Science', value: 45 },
            { label: 'Life Sciences', value: 30 },
            { label: 'Administrative', value: 65 },
            { label: 'Library Services', value: 15 },
          ]} />
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
          reports={reportsHistory}
          viewState={currentViewState}
          onSelect={setSelectedReport}
          currentPage={page}
          totalPages={meta.totalPages}
          totalEntries={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
          onDownload={(type, format) => handleExportReport(type, format as ExportFormat)}
          isExporting={isExporting}
        />
      </div>

      {/* Report Preview Drawer */}
      <ReportDrawer 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
        onExport={(type, format) => handleExportReport(type, format as ExportFormat)}
        isExporting={isExporting}
      />
    </div>
  );
}
