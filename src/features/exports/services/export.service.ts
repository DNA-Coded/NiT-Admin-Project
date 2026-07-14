import { apiClient } from '@/services/api/client';

export type ExportFormat = 'CSV' | 'XLSX' | 'PDF';
export type ExportReportType = 'ATTENDANCE' | 'FACULTY' | 'DEVICE' | 'SYNCHRONIZATION';

export const exportService = {
  downloadExport: async (report: ExportReportType, format: ExportFormat, filters: any = {}): Promise<void> => {
    try {
      const response = await apiClient.get('/exports', {
        params: {
          report,
          format,
          ...filters,
        },
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header if available
      let filename = `${report.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      const disposition = response.headers['content-disposition'];
      
      if (typeof disposition === 'string' && disposition.indexOf('filename=') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create blob link to download
      const blob = new Blob([response.data], { type: (response.headers['content-type'] as string) || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download export:', error);
      throw error;
    }
  }
};
