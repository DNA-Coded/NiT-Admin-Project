import logger from '../../config/logger.config.js';

const extractRequestMeta = (req) => {
  if (!req) return {};
  return {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    method: req.method,
    path: req.originalUrl,
  };
};

const logSettingsFetched = (adminEmail, requestMeta = {}) => {
  logger.info('System settings fetched', {
    adminEmail,
    ...requestMeta,
  });
};

const logSettingsUpdated = (adminEmail, updates, requestMeta = {}) => {
  logger.info('System settings updated', {
    adminEmail,
    updatedFields: Object.keys(updates),
    ...requestMeta,
  });
};

const logSettingsReset = (adminEmail, requestMeta = {}) => {
  logger.warn('System settings reset to defaults', {
    adminEmail,
    ...requestMeta,
  });
};

export {
  extractRequestMeta,
  logSettingsFetched,
  logSettingsUpdated,
  logSettingsReset,
};
