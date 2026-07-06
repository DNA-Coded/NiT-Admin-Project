import ExportHistory from './exportHistory.model.js';
import { EXPORT_STATUS } from '../exports.constants.js';
import * as exportLogger from '../exports.logger.js';

export const createExportRecord = async (reportType, format, filters, generatedBy) => {
  const record = new ExportHistory({
    reportType,
    format,
    filters,
    generatedBy,
    status: EXPORT_STATUS.PENDING,
  });
  
  await record.save();
  exportLogger.logExportHistoryCreated(record.exportId);
  return record;
};

export const markExportSuccess = async (exportId, fileSize, duration) => {
  return await ExportHistory.findOneAndUpdate(
    { exportId },
    {
      status: EXPORT_STATUS.SUCCESS,
      fileSize,
      duration,
    },
    { new: true }
  );
};

export const markExportFailed = async (exportId, errorMessage, duration) => {
  return await ExportHistory.findOneAndUpdate(
    { exportId },
    {
      status: EXPORT_STATUS.FAILED,
      error: errorMessage,
      duration,
    },
    { new: true }
  );
};
