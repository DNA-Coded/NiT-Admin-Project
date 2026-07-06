import * as reportsService from '../reports/reports.service.js';
import * as exportHistoryService from './history/exportHistory.service.js';
import { CSVFormatter } from './formatters/csv.formatter.js';
import { ExcelFormatter } from './formatters/excel.formatter.js';
import { PDFFormatter } from './formatters/pdf.formatter.js';
import { EXPORT_REPORT_TYPES, EXPORT_FORMATS } from './exports.constants.js';

export const generateExport = async (reportType, format, filters, adminEmail) => {
  const startTime = Date.now();
  
  // 1. Create PENDING History Record
  const historyRecord = await exportHistoryService.createExportRecord(
    reportType, 
    format, 
    filters, 
    adminEmail
  );
  
  try {
    // 2. Fetch Structured JSON from Reports Module
    let reportData = { data: [] };
    
    // To ensure the report fetches ALL data for export instead of paginating small chunks,
    // we override limit if not strictly requested by the user, or set a massive limit.
    const exportFilters = { ...filters };
    if (!exportFilters.limit) {
       exportFilters.limit = 10000; // sensible cap for synchronous generation
    }
    
    switch (reportType) {
      case EXPORT_REPORT_TYPES.ATTENDANCE:
        reportData = await reportsService.getAttendanceReport(exportFilters);
        break;
      case EXPORT_REPORT_TYPES.FACULTY:
        reportData = await reportsService.getFacultyReport(exportFilters);
        break;
      case EXPORT_REPORT_TYPES.STUDENTS:
        reportData = await reportsService.getStudentReport(exportFilters);
        break;
      case EXPORT_REPORT_TYPES.DEVICES:
        reportData = await reportsService.getDeviceReport(exportFilters);
        break;
      case EXPORT_REPORT_TYPES.SYNCHRONIZATION:
        reportData = await reportsService.getSynchronizationReport(exportFilters);
        break;
      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }

    const { data } = reportData;

    // 3. Pass JSON to Formatter
    let fileBuffer;
    let mimeType;
    let extension;

    if (format === EXPORT_FORMATS.CSV) {
      fileBuffer = CSVFormatter.generate(data);
      mimeType = 'text/csv';
      extension = 'csv';
    } else if (format === EXPORT_FORMATS.XLSX) {
      fileBuffer = await ExcelFormatter.generate(data);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      extension = 'xlsx';
    } else if (format === EXPORT_FORMATS.PDF) {
      fileBuffer = await PDFFormatter.generate(data);
      mimeType = 'application/pdf';
      extension = 'pdf';
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    // 4. Update History Record to SUCCESS
    const duration = Date.now() - startTime;
    const fileSize = fileBuffer.length;
    await exportHistoryService.markExportSuccess(historyRecord.exportId, fileSize, duration);

    // 5. Return payload for controller
    return {
      buffer: fileBuffer,
      mimeType,
      filename: `export_${reportType}_${new Date().toISOString().slice(0, 10)}.${extension}`
    };

  } catch (error) {
    // On failure, log to DB and throw up
    const duration = Date.now() - startTime;
    await exportHistoryService.markExportFailed(historyRecord.exportId, error.message, duration);
    throw error;
  }
};
