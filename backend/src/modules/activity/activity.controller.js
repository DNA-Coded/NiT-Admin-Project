import { activityService } from './activity.service.js';
import { MESSAGES } from '../../constants/index.js';

export const getActivities = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await activityService.getActivities({ page, limit, sortBy, sortOrder });
    
    return res.status(200).json({
      success: true,
      message: MESSAGES.ACTIVITY_FETCH_LIST || 'Activities retrieved successfully.',
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await activityService.getActivityById(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.ACTIVITY_NOT_FOUND || 'Activity not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: MESSAGES.ACTIVITY_FETCH_DETAIL || 'Activity retrieved successfully.',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const searchActivities = async (req, res, next) => {
  try {
    const { q, page, limit, sortBy, sortOrder } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search keyword (q) is required.',
      });
    }

    const result = await activityService.searchActivities(q, { page, limit, sortBy, sortOrder });

    return res.status(200).json({
      success: true,
      message: 'Activities searched successfully.',
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const filterActivities = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder, module, action, status, severity, performedBy, from, to } = req.query;
    
    const filters = {
      module,
      action,
      status,
      severity,
      performedBy,
      from,
      to,
    };

    const result = await activityService.filterActivities(filters, { page, limit, sortBy, sortOrder });

    return res.status(200).json({
      success: true,
      message: 'Activities filtered successfully.',
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
