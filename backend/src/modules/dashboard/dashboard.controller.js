import * as dashboardService from './dashboard.service.js';
import * as dashboardLogger from './dashboard.logger.js';
import { MESSAGES } from '../../constants/index.js';
import { formatSuccessResponse } from '../../utils/response.formatter.js';
import { makeError } from '../../utils/error.utils.js';

export const getOverview = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const overview = await dashboardService.getDashboardOverview();
    
    dashboardLogger.logDashboardViewed(adminEmail, requestMeta);
    
    return res.status(200).json(formatSuccessResponse(MESSAGES.DASHBOARD_OVERVIEW_FETCHED, overview));
  } catch (error) {
    next(error);
  }
};

export const getLiveAttendance = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const liveAttendance = await dashboardService.getLiveAttendance();
    
    dashboardLogger.logLiveAttendanceRequested(adminEmail, requestMeta);
    
    return res.status(200).json(formatSuccessResponse(MESSAGES.LIVE_ATTENDANCE_FETCHED, liveAttendance));
  } catch (error) {
    next(error);
  }
};

export const getDeviceStatus = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const deviceStatus = await dashboardService.getDeviceStatus();
    
    dashboardLogger.logDeviceStatusRequested(adminEmail, requestMeta);
    
    return res.status(200).json(formatSuccessResponse(MESSAGES.DEVICE_STATUS_FETCHED, deviceStatus));
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const analytics = await dashboardService.getDashboardAnalytics();
    
    dashboardLogger.logDashboardAnalyticsRequested(adminEmail, requestMeta);
    
    return res.status(200).json(formatSuccessResponse(MESSAGES.DASHBOARD_ANALYTICS_FETCHED, analytics));
  } catch (error) {
    next(error);
  }
};
