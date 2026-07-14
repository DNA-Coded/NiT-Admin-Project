import { useState, useCallback } from 'react';
import { exportService, type ExportFormat, type ExportReportType } from '../services/export.service';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportData = useCallback(async (report: ExportReportType, format: ExportFormat, filters: any = {}) => {
    try {
      setIsExporting(true);
      setError(null);
      await exportService.downloadExport(report, format, filters);
    } catch (err: any) {
      // Safely handle blob error parsing if backend sent JSON error inside blob
      if (err.response && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          setError(new Error(json.message || 'Export failed'));
        } catch {
          setError(new Error('Export failed to download.'));
        }
      } else {
        setError(err as Error);
      }
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportData,
    isExporting,
    error,
  };
}
