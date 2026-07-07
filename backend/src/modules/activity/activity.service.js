import { Activity } from './activity.model.js';
import { activityLogger } from './activity.logger.js';
import crypto from 'crypto';

/**
 * Filter sensitive data from metadata before logging/storing.
 * @param {Object} metadata
 * @returns {Object}
 */
const sanitizeMetadata = (metadata) => {
  if (!metadata) return {};
  const sensitiveKeys = ['password', 'token', 'jwt', 'biometricTemplate', 'attendanceIdentity', 'refreshToken'];
  const sanitized = { ...metadata };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  return sanitized;
};

class ActivityService {
  /**
   * Record a new activity.
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async recordActivity(data) {
    try {
      const activityId = data.activityId || crypto.randomUUID();
      const sanitizedMetadata = sanitizeMetadata(data.metadata);

      const activityData = {
        ...data,
        activityId,
        metadata: sanitizedMetadata,
      };

      const newActivity = new Activity(activityData);
      const savedActivity = await newActivity.save();

      activityLogger.info(`Activity created: ${savedActivity.action} in module ${savedActivity.module}`, {
        activityId: savedActivity.activityId,
        module: savedActivity.module,
        action: savedActivity.action,
        status: savedActivity.status,
      });

      return savedActivity;
    } catch (error) {
      activityLogger.error('Failed to record activity', { error: error.message, data });
      throw error; // Or return null depending on whether we want activity failure to crash the main transaction
    }
  }

  /**
   * Get activities with pagination and sorting.
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async getActivities(query = {}) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    try {
      activityLogger.info('Activity list searched/fetched', { query });
      
      const [activities, total] = await Promise.all([
        Activity.find({})
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Activity.countDocuments({})
      ]);

      return {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      activityLogger.error('Failed to get activities', { error: error.message });
      throw error;
    }
  }

  /**
   * Get a single activity by activityId.
   * @param {String} activityId 
   * @returns {Promise<Object>}
   */
  async getActivityById(activityId) {
    try {
      const activity = await Activity.findOne({ activityId }).lean();
      return activity;
    } catch (error) {
      activityLogger.error(`Failed to get activity by ID: ${activityId}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Search activities by keyword.
   * @param {String} keyword 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async searchActivities(keyword, query = {}) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    try {
      activityLogger.info(`Activity searched with keyword: ${keyword}`);

      const searchQuery = {
        $text: { $search: keyword }
      };

      const [activities, total] = await Promise.all([
        Activity.find(searchQuery)
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Activity.countDocuments(searchQuery)
      ]);

      return {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      activityLogger.error('Failed to search activities', { error: error.message });
      throw error;
    }
  }

  /**
   * Filter activities based on provided criteria.
   * @param {Object} filters 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async filterActivities(filters = {}, query = {}) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    try {
      activityLogger.info('Activity filtered', { filters });
      const matchQuery = {};

      if (filters.module) matchQuery.module = filters.module;
      if (filters.action) matchQuery.action = filters.action;
      if (filters.status) matchQuery.status = filters.status;
      if (filters.severity) matchQuery.severity = filters.severity;
      if (filters.performedBy) matchQuery.performedBy = filters.performedBy;
      
      if (filters.from || filters.to) {
        matchQuery.createdAt = {};
        if (filters.from) matchQuery.createdAt.$gte = new Date(filters.from);
        if (filters.to) matchQuery.createdAt.$lte = new Date(filters.to);
      }

      const [activities, total] = await Promise.all([
        Activity.find(matchQuery)
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Activity.countDocuments(matchQuery)
      ]);

      return {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      activityLogger.error('Failed to filter activities', { error: error.message });
      throw error;
    }
  }
}

export const activityService = new ActivityService();
