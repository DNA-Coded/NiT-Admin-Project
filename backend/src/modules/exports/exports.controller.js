import * as exportsService from './exports.service.js';
import * as exportsLogger from './exports.logger.js';

export const getExport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email || 'system';
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent') };
    const { report, format } = req.query;
    
    // Copy remaining query parameters as filters
    const filters = { ...req.query };
    delete filters.report;
    delete filters.format;

    exportsLogger.logExportRequested(adminEmail, report, format, requestMeta);

    const { buffer, mimeType, filename } = await exportsService.generateExport(
      report, 
      format, 
      filters, 
      adminEmail
    );

    exportsLogger.logExportGenerated(adminEmail, report, format, { fileSize: buffer.length });

    // Stream to client
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(buffer);
  } catch (error) {
    const adminEmail = req.admin?.email || 'system';
    const { report, format } = req.query;
    exportsLogger.logExportFailed(adminEmail, report, format, error.message);
    next(error);
  }
};
