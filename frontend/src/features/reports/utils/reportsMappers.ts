import type { ReportItem, KPIMetrics, ChartDataPoint } from '@/types/reports';
import type { ActivityLogDTO, ReportSummaryResponse } from '../types/reports.api.types';
import { formatDate } from '@/utils/formatters';

export function mapActivityToReportItem(activity: ActivityLogDTO): ReportItem {
  // Try to parse out details from metadata
  const summary = activity.metadata?.summary || {};
  const filters = activity.metadata?.filters || {};
  
  // Extract a date range if provided, else use the activity creation date as a fallback
  let dateRange = 'All Time';
  if (filters.from && filters.to) {
    dateRange = `${formatDate(filters.from).split(',')[0]} - ${formatDate(filters.to).split(',')[0]}`;
  } else if (filters.from) {
    dateRange = `Since ${formatDate(filters.from).split(',')[0]}`;
  } else if (filters.to) {
    dateRange = `Up to ${formatDate(filters.to).split(',')[0]}`;
  }

  // Derive size dynamically from records for UI purposes (mocked behavior as requested for UI preservation)
  const count = summary.totalRecords || summary.totalFaculty || summary.totalDevices || summary.totalJobs || 0;
  const kbSize = (count * 0.45).toFixed(1);
  const sizeBytes = count > 2000 ? `${(count * 0.00045).toFixed(2)} MB` : `${kbSize} KB`;

  // Try to extract Report Type from description or action
  let type = 'System Report';
  if (activity.description?.includes('Attendance')) type = 'Attendance Report';
  if (activity.description?.includes('Faculty')) type = 'Faculty Summary';
  if (activity.description?.includes('Device')) type = 'Device Health';
  if (activity.description?.includes('Synchronization')) type = 'Sync Analytics';

  return {
    id: activity.activityId || activity._id,
    name: activity.description || 'System Generated Report',
    type,
    dateRange,
    generatedBy: activity.metadata?.adminEmail || activity.performedBy || 'System Trigger',
    lastGenerated: formatDate(activity.createdAt),
    status: activity.status === 'SUCCESS' ? 'COMPLETED' : activity.status === 'FAILED' ? 'FAILED' : 'PENDING',
    sizeBytes: count === 0 ? '--' : sizeBytes,
    recordsCount: count,
    description: `Report includes ${count} records. Parameters: ${JSON.stringify(filters)}`,
  };
}

export function deriveKPIsFromReport(report: ReportSummaryResponse): KPIMetrics {
  const summary = report.summary || {};
  const total = summary.totalRecords || 0;
  const present = summary.totalPresent || 0;
  const absent = summary.totalAbsent || 0;

  let avgAttendance = '0%';
  let unplannedLeaveRate = '0%';

  if (total > 0) {
    avgAttendance = `${((present / total) * 100).toFixed(1)}%`;
    unplannedLeaveRate = `${((absent / total) * 100).toFixed(1)}%`;
  }

  // Mocking growth parameters to keep the UI looking dynamic as the backend lacks historical delta queries for now
  return {
    avgAttendance,
    attendanceGrowth: '+0.0%',
    lateArrivals: 0,
    lateArrivalsGrowth: '0%',
    overtimeHours: '0h',
    overtimeHoursGrowth: '0h',
    unplannedLeaveRate,
    unplannedLeaveGrowth: '0%',
  };
}

export function deriveChartDataFromReport(report: ReportSummaryResponse): ChartDataPoint[] {
  // If no data, return empty
  if (!report.data || report.data.length === 0) return [];

  // Assuming data contains timestamp, group by date and count
  const dailyCounts: Record<string, { present: number; absent: number }> = {};
  
  report.data.forEach(record => {
    if (record.timestamp) {
      const dateStr = formatDate(record.timestamp).split(',')[0]; // "Oct 24"
      const day = dateStr.slice(0, 6); // Extract basic day string
      
      if (!dailyCounts[day]) {
        dailyCounts[day] = { present: 0, absent: 0 };
      }
      if (record.attendanceType === 'PRESENT') {
        dailyCounts[day].present++;
      } else if (record.attendanceType === 'ABSENT') {
        dailyCounts[day].absent++;
      }
    }
  });

  // If there are daily counts, format them to match the UI chart format
  const chartData = Object.entries(dailyCounts)
    .slice(0, 10) // Limit to 10 points for the chart
    .map(([label, counts]) => {
      const total = counts.present + counts.absent;
      const pct = total > 0 ? (counts.present / total) * 100 : 0;
      return {
        label,
        value: Math.round(pct),
        secondaryValue: 90 // Target baseline
      };
    });

  return chartData.length > 0 ? chartData.reverse() : [];
}
