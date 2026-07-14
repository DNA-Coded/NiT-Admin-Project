import { useState, useCallback, useEffect } from 'react';
import { reportsService } from '../services/reports.service';
import { mapActivityToReportItem, deriveKPIsFromReport, deriveChartDataFromReport } from '../utils/reportsMappers';
import type { ReportItem, KPIMetrics, ChartDataPoint, ReportFilterState } from '@/types/reports';

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

export function useReports() {
  const [filters, setFilters] = useState<ReportFilterState>(initialFilters);
  const [reportsHistory, setReportsHistory] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  // For high level dashboard
  const [kpis, setKpis] = useState<KPIMetrics | null>(null);
  const [trendData, setTrendData] = useState<ChartDataPoint[]>([]);

  // We map the UI DateRange strings to backend ISO strings (simplistic map for now)
  const getDateFromRange = (range: string) => {
    const today = new Date();
    let fromDate: Date | null = null;
    
    if (range === 'Last 30 Days') {
      fromDate = new Date();
      fromDate.setDate(today.getDate() - 30);
    } else if (range === 'Current Quarter') {
      fromDate = new Date();
      fromDate.setMonth(Math.floor(today.getMonth() / 3) * 3);
      fromDate.setDate(1);
    } else if (range === 'Last 6 Months') {
      fromDate = new Date();
      fromDate.setMonth(today.getMonth() - 6);
    } else if (range === 'Year to Date') {
      fromDate = new Date(today.getFullYear(), 0, 1);
    }

    return fromDate ? fromDate.toISOString() : undefined;
  };

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await reportsService.getReportLogs({
        page,
        limit: meta.limit,
        search: filters.search || undefined
      });
      
      let mapped = res.activities.map(mapActivityToReportItem);

      // Local filter for UI because the backend activity log doesn't natively filter by metadata deeply via generic endpoints
      if (filters.reportType) {
        mapped = mapped.filter(r => r.type === filters.reportType);
      }
      if (filters.dateRange) {
        mapped = mapped.filter(r => r.dateRange.includes(filters.dateRange) || filters.dateRange === 'Last 30 Days');
      }
      
      setReportsHistory(mapped);
      setMeta({
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
        limit: res.pagination.limit,
      });
    } catch (err) {
      console.error('Failed to fetch report history logs', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, meta.limit, filters.search, filters.reportType, filters.dateRange]);

  const fetchKPIs = useCallback(async () => {
    try {
      // Fetch a wide attendance report to populate the dashboard KPIs
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      
      const summaryRes = await reportsService.generateReport('Attendance', {
        from: fromDate.toISOString(),
        limit: 100 // fetch some records to build the trend
      });
      
      setKpis(deriveKPIsFromReport(summaryRes));
      setTrendData(deriveChartDataFromReport(summaryRes));
    } catch (err) {
      console.error('Failed to fetch KPI summary', err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  const generateQuickReport = async (title: string) => {
    try {
      setLoading(true);
      const from = getDateFromRange(filters.dateRange);
      
      await reportsService.generateReport(title, {
        from,
        department: filters.department || undefined,
        device: filters.device || undefined,
      });

      // Refetch history to show the newly generated report in the table
      await fetchHistory();
      
      // Optionally refetch KPIs if the report generated affects the global view significantly
      if (title.includes('Attendance')) {
        await fetchKPIs();
      }
    } catch (err) {
      console.error(`Failed to generate report: ${title}`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ReportFilterState, value: string) => {
    setFilters(p => ({ ...p, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  return {
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
    fetchHistory,
    generateQuickReport,
  };
}
