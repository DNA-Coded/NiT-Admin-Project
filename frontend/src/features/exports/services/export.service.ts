import { apiClient } from '@/services/api/client';

export type ExportFormat = 'CSV' | 'XLSX' | 'PDF';
export type ExportReportType = 'ATTENDANCE' | 'EMPLOYEE' | 'DEVICE' | 'SYNCHRONIZATION';

const REPORT_ENDPOINTS: Record<ExportReportType, string> = {
  ATTENDANCE: '/attendance/export',
  EMPLOYEE: '/employees/export',
  DEVICE: '/devices/export',
  SYNCHRONIZATION: '/sync/export',
};

export const exportService = {
  downloadExport: async (report: ExportReportType, format: ExportFormat, filters: any = {}): Promise<void> => {
    try {
      const endpoint = REPORT_ENDPOINTS[report] || '/attendance/export';

      const { employeeSearch, search, ...restFilters } = filters;
      const queryParams = {
        ...restFilters,
        search: employeeSearch || search || '',
        format,
      };

      const response = await apiClient.get(endpoint, {
        params: queryParams,
        responseType: 'blob',
      });

      const rawData = (response as any)?.data !== undefined ? (response as any).data : response;

      // Correct file extension and MIME type mapping per format
      let ext = 'csv';
      let mimeType = 'text/csv;charset=utf-8;';

      const reqFormat = format.toUpperCase();
      if (reqFormat === 'XLSX' || reqFormat === 'EXCEL') {
        ext = 'xls';
        mimeType = 'application/vnd.ms-excel';
      } else if (reqFormat === 'PDF') {
        ext = 'pdf';
        mimeType = 'application/pdf';
      }

      const filename = `${report.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.${ext}`;

      const blob = rawData instanceof Blob ? rawData : new Blob([rawData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download export:', error);
      throw error;
    }
  },
};