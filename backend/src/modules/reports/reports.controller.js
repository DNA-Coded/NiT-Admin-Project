import * as reportsService from './reports.service.js';
import * as reportsLogger from './reports.logger.js';
import { formatSuccessResponse } from '../../utils/responseFormatter.js';
import { MESSAGES } from '../../constants/index.js';

const buildRequestMeta = (req) => ({
  ip: req.ip,
  userAgent: req.get('user-agent'),
  method: req.method,
  path: req.originalUrl,
});

export const getAttendanceReport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = buildRequestMeta(req);
    const filters = { ...req.query };

    reportsLogger.logReportRequested(adminEmail, 'ATTENDANCE', filters, requestMeta);
    const report = await reportsService.getAttendanceReport(filters);
    reportsLogger.logReportGenerated(adminEmail, 'ATTENDANCE', report.summary);

    return res.status(200).json(formatSuccessResponse(MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    next(error);
  }
};

export const getFacultyReport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = buildRequestMeta(req);
    const filters = { ...req.query };

    reportsLogger.logReportRequested(adminEmail, 'FACULTY', filters, requestMeta);
    const report = await reportsService.getFacultyReport(filters);
    reportsLogger.logReportGenerated(adminEmail, 'FACULTY', report.summary);

    return res.status(200).json(formatSuccessResponse(MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = buildRequestMeta(req);
    const filters = { ...req.query };

    reportsLogger.logReportRequested(adminEmail, 'STUDENT', filters, requestMeta);
    const report = await reportsService.getStudentReport(filters);
    reportsLogger.logReportGenerated(adminEmail, 'STUDENT', report.summary);

    return res.status(200).json(formatSuccessResponse(MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    next(error);
  }
};

export const getDeviceReport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = buildRequestMeta(req);
    const filters = { ...req.query };

    reportsLogger.logReportRequested(adminEmail, 'DEVICE', filters, requestMeta);
    const report = await reportsService.getDeviceReport(filters);
    reportsLogger.logReportGenerated(adminEmail, 'DEVICE', report.summary);

    return res.status(200).json(formatSuccessResponse(MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    next(error);
  }
};

export const getSynchronizationReport = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = buildRequestMeta(req);
    const filters = { ...req.query };

    reportsLogger.logReportRequested(adminEmail, 'SYNCHRONIZATION', filters, requestMeta);
    const report = await reportsService.getSynchronizationReport(filters);
    reportsLogger.logReportGenerated(adminEmail, 'SYNCHRONIZATION', report.summary);

    return res.status(200).json(formatSuccessResponse(MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    next(error);
  }
};
