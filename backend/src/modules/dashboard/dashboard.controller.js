import * as dashboardService from './dashboard.service.js';
import * as dashboardLogger from './dashboard.logger.js';
import { MESSAGES } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../helpers/response.helper.js';

export const getOverview = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const overview = await dashboardService.getDashboardOverview();
    
    dashboardLogger.logDashboardViewed(adminEmail, requestMeta);
    
    return sendSuccess(res, overview, MESSAGES.DASHBOARD_OVERVIEW_FETCHED);
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
    
    return sendSuccess(res, liveAttendance, MESSAGES.LIVE_ATTENDANCE_FETCHED);
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
    
    return sendSuccess(res, deviceStatus, MESSAGES.DEVICE_STATUS_FETCHED);
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
    
    return sendSuccess(res, analytics, MESSAGES.DASHBOARD_ANALYTICS_FETCHED);
  } catch (error) {
    next(error);
  }
};

export const getLiveMonitoring = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    const liveData = await dashboardService.getDashboardLiveMonitoring();
    
    dashboardLogger.logDashboardLiveRequested(adminEmail, requestMeta);
    
    return sendSuccess(res, liveData, MESSAGES.DASHBOARD_LIVE_FETCHED);
  } catch (error) {
    next(error);
  }
};

export const getFilteredSearch = async (req, res, next) => {
  try {
    const adminEmail = req.admin?.email;
    const requestMeta = { ip: req.ip, userAgent: req.get('user-agent'), method: req.method, path: req.originalUrl };
    
    // Extract filters and pagination from query
    const filters = { ...req.query };
    
    // Extract pagination Options
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const paginationOptions = { page, limit };
    
    // Clean up generic query params from filters object
    delete filters.page;
    delete filters.limit;
    delete filters.sortBy;
    delete filters.sortOrder;
    
    const searchResult = await dashboardService.getFilteredDashboardData(filters, paginationOptions);
    
    dashboardLogger.logDashboardFilteredRequested(adminEmail, filters, requestMeta);
    
    return sendSuccess(res, searchResult, MESSAGES.DASHBOARD_FILTER_FETCHED);
  } catch (error) {
    next(error);
  }
};
