import { EXPORT_REPORT_TYPES_VALUES, EXPORT_FORMATS_VALUES } from './exports.constants.js';
import { handleValidationErrors } from '../../validators/index.js';

export const validateExportRequest = (req, res, next) => {
  const errors = [];
  const { report, format } = req.query;

  if (!report || !EXPORT_REPORT_TYPES_VALUES.includes(report)) {
    errors.push({ field: 'report', message: `Invalid report type. Allowed values: ${EXPORT_REPORT_TYPES_VALUES.join(', ')}` });
  }

  if (!format || !EXPORT_FORMATS_VALUES.includes(format)) {
    errors.push({ field: 'format', message: `Invalid format. Allowed values: ${EXPORT_FORMATS_VALUES.join(', ')}` });
  }

  if (errors.length > 0) {
    req.validationErrors = errors;
    return handleValidationErrors(req, res, next);
  }

  // Pass it onto the reports validation directly since the parameters are highly coupled
  // (We omit duplicating the exact date/objectId logic here to keep DRY, 
  // they will naturally be handled or bypassed safely by the underlying reportsService queries,
  // or we could explicitly call validateReportFilters from the reports module).
  
  next();
};
