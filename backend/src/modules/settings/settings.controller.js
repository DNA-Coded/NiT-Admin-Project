import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import settingsService from './settings.service.js';
import { extractRequestMeta } from './settings.logger.js';
import { updateSettingsSchema } from './settings.validator.js';

/**
 * @desc    Get system settings
 * @route   GET /api/v1/settings
 * @access  Protected
 */
export const getSettings = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email || 'system';
  const requestMeta = extractRequestMeta(req);

  const settings = await settingsService.getSettings(adminEmail, requestMeta);

  return sendSuccess(res, settings, MESSAGES.SUCCESS, 200);
});

/**
 * @desc    Update system settings
 * @route   PUT /api/v1/settings
 * @access  Protected
 */
export const updateSettings = asyncHandler(async (req, res, next) => {
  const { error, value } = updateSettingsSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  
  if (error) {
    const err = new Error(error.details.map((x) => x.message).join(', '));
    err.statusCode = 400;
    return next(err);
  }

  const adminEmail = req.admin?.email || 'system';
  const requestMeta = extractRequestMeta(req);

  try {
    const updatedSettings = await settingsService.updateSettings(value, adminEmail, requestMeta);
    return sendSuccess(res, updatedSettings, MESSAGES.SETTINGS_UPDATED || 'Settings updated successfully.', 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

/**
 * @desc    Reset system settings to defaults
 * @route   POST /api/v1/settings/reset
 * @access  Protected
 */
export const resetSettings = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email || 'system';
  const requestMeta = extractRequestMeta(req);

  const settings = await settingsService.resetSettings(adminEmail, requestMeta);

  return sendSuccess(res, settings, MESSAGES.SETTINGS_RESET || 'Settings reset to defaults successfully.', 200);
});
