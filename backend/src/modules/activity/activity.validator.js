import {
  ACTIVITY_MODULES_VALUES,
  ACTIVITY_ACTIONS_VALUES,
  ACTIVITY_STATUS_VALUES,
  ACTIVITY_SEVERITY_VALUES
} from './activity.constants.js';

// Simple middleware validators. Ideally replace with express-validator or Joi schemas used in the rest of the app.
export const validateQuery = (req, res, next) => {
  const { module, action, status, severity } = req.query;

  const errors = [];

  if (module && !ACTIVITY_MODULES_VALUES.includes(module)) {
    errors.push(`Invalid module. Allowed values: ${ACTIVITY_MODULES_VALUES.join(', ')}`);
  }
  if (action && !ACTIVITY_ACTIONS_VALUES.includes(action)) {
    errors.push(`Invalid action. Allowed values: ${ACTIVITY_ACTIONS_VALUES.join(', ')}`);
  }
  if (status && !ACTIVITY_STATUS_VALUES.includes(status)) {
    errors.push(`Invalid status. Allowed values: ${ACTIVITY_STATUS_VALUES.join(', ')}`);
  }
  if (severity && !ACTIVITY_SEVERITY_VALUES.includes(severity)) {
    errors.push(`Invalid severity. Allowed values: ${ACTIVITY_SEVERITY_VALUES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateParams = (req, res, next) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid activity ID provided in parameters.',
    });
  }
  next();
};
