import * as reportsService from './reports.service.js';
import * as reportsLogger from './reports.logger.js';
import { sendSuccess } from '../../helpers/response.helper.js';
import { MESSAGES } from '../../constants/index.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

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

    activityService.recordActivity({
      module: ACTIVITY_MODULES.REPORT,
      action: ACTIVITY_ACTIONS.REPORT,
      description: `Generated Attendance report with ${report.summary.totalRecords} records`,
      metadata: { adminEmail, filters, summary: report.summary, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});

    return sendSuccess(res, report, MESSAGES.REPORT_GENERATED);
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

    activityService.recordActivity({
      module: ACTIVITY_MODULES.REPORT,
      action: ACTIVITY_ACTIONS.REPORT,
      description: `Generated Faculty report with ${report.summary.totalFaculty} records`,
      metadata: { adminEmail, filters, summary: report.summary, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});

    return sendSuccess(res, report, MESSAGES.REPORT_GENERATED);
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

    activityService.recordActivity({
      module: ACTIVITY_MODULES.REPORT,
      action: ACTIVITY_ACTIONS.REPORT,
      description: `Generated Student report with ${report.summary.totalStudents} records`,
      metadata: { adminEmail, filters, summary: report.summary, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});

    return sendSuccess(res, report, MESSAGES.REPORT_GENERATED);
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

    activityService.recordActivity({
      module: ACTIVITY_MODULES.REPORT,
      action: ACTIVITY_ACTIONS.REPORT,
      description: `Generated Device report with ${report.summary.totalDevices} records`,
      metadata: { adminEmail, filters, summary: report.summary, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});

    return sendSuccess(res, report, MESSAGES.REPORT_GENERATED);
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

    activityService.recordActivity({
      module: ACTIVITY_MODULES.REPORT,
      action: ACTIVITY_ACTIONS.REPORT,
      description: `Generated Synchronization report with ${report.summary.totalJobs} records`,
      metadata: { adminEmail, filters, summary: report.summary, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.LOW
    }).catch(() => {});

    return sendSuccess(res, report, MESSAGES.REPORT_GENERATED);
  } catch (error) {
    next(error);
  }
};
