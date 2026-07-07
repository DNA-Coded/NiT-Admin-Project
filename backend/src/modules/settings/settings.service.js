import Settings from './settings.model.js';
import Department from '../departments/departments.model.js';
import Device from '../devices/device.model.js';
import { DEFAULT_SETTINGS } from './settings.constants.js';
import { MESSAGES } from '../../constants/index.js';
import { logSettingsFetched, logSettingsUpdated, logSettingsReset } from './settings.logger.js';
import { activityService } from '../activity/activity.service.js';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS, ACTIVITY_STATUS, ACTIVITY_SEVERITY } from '../../constants/index.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

/**
 * Settings Service
 *
 * Manages the singleton settings document.
 */
class SettingsService {
  /**
   * Initializes the settings document if it doesn't exist.
   * Called automatically by getSettings or during app startup if needed.
   */
  async initializeSettings() {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }
    return settings;
  }

  /**
   * Fetch the singleton settings document.
   */
  async getSettings(adminEmail = 'system', requestMeta = {}) {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      // Lazy initialization
      settings = await this.initializeSettings();
      settings = settings.toObject(); // Convert mongoose doc to plain object like .lean()
    }

    logSettingsFetched(adminEmail, requestMeta);
    return settings;
  }

  /**
   * Validates referenced ObjectIds (Department and Device).
   */
  async _validateReferences(updates) {
    if (updates.academic?.defaultDepartment) {
      const dept = await Department.findById(updates.academic.defaultDepartment).select('_id isActive').lean();
      if (!dept) throw makeError('The referenced default department does not exist.', 404);
      if (!dept.isActive) throw makeError('The referenced default department is inactive.', 422);
    }
    
    if (updates.devices?.defaultDevice) {
      const device = await Device.findById(updates.devices.defaultDevice).select('_id isActive').lean();
      if (!device) throw makeError('The referenced default device does not exist.', 404);
      if (!device.isActive) throw makeError('The referenced default device is inactive.', 422);
    }
  }

  /**
   * Update the settings document partially.
   */
  async updateSettings(updates, adminEmail, requestMeta = {}) {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await this.initializeSettings();
    }

    await this._validateReferences(updates);

    // Perform partial deep update manually to preserve unchanged fields within groups
    const allowedGroups = [
      'organization', 'academic', 'attendance', 'devices', 
      'system', 'security', 'notifications', 'backup'
    ];

    let hasChanges = false;
    for (const group of allowedGroups) {
      if (updates[group]) {
        for (const [key, value] of Object.entries(updates[group])) {
          if (settings[group][key] !== value) {
            settings[group][key] = value;
            hasChanges = true;
          }
        }
      }
    }

    if (!hasChanges) {
      throw makeError(MESSAGES.SETTINGS_NO_CHANGES || 'No changes detected in settings.', 400);
    }

    settings.updatedBy = adminEmail;
    await settings.save();

    logSettingsUpdated(adminEmail, updates, requestMeta);

    activityService.recordActivity({
      module: ACTIVITY_MODULES.SETTINGS || 'SETTINGS',
      action: ACTIVITY_ACTIONS.UPDATE || 'UPDATE',
      description: `System settings were updated by ${adminEmail}`,
      metadata: { updates, adminEmail, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.MEDIUM
    }).catch(() => {});

    return settings.toObject();
  }

  /**
   * Reset settings to their default values.
   */
  async resetSettings(adminEmail, requestMeta = {}) {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await this.initializeSettings();
      return settings.toObject();
    }

    // Overwrite all groups with defaults
    Object.assign(settings, DEFAULT_SETTINGS);
    settings.updatedBy = adminEmail;
    await settings.save();

    logSettingsReset(adminEmail, requestMeta);

    activityService.recordActivity({
      module: ACTIVITY_MODULES.SETTINGS || 'SETTINGS',
      action: ACTIVITY_ACTIONS.RESET || 'RESET',
      description: `System settings were reset to defaults by ${adminEmail}`,
      metadata: { adminEmail, ...requestMeta },
      status: ACTIVITY_STATUS.SUCCESS,
      severity: ACTIVITY_SEVERITY.HIGH
    }).catch(() => {});

    return settings.toObject();
  }
}

export default new SettingsService();
