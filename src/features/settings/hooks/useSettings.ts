import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settings.service';
import { mapSettingsResponse } from '../utils/settingsMappers';
import type { SettingsBackendModel, UpdateSettingsPayload } from '../types/settings.api.types';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsBackendModel | null>(null);
  const [draftSettings, setDraftSettings] = useState<SettingsBackendModel | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await settingsService.getSettings();
      const mapped = mapSettingsResponse(result.data);
      setSettings(mapped);
      setDraftSettings(mapped);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load settings'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateDraft = (
    section: keyof SettingsBackendModel,
    field: string,
    value: string | number | boolean | null
  ) => {
    setDraftSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value,
        },
      };
    });
  };

  const saveSettings = async () => {
    if (!draftSettings) return false;
    try {
      setSaving(true);
      setSaveError(null);
      
      const payload: UpdateSettingsPayload = {
        organization: draftSettings.organization,
        academic: draftSettings.academic,
        attendance: draftSettings.attendance,
        devices: draftSettings.devices,
        system: draftSettings.system,
        security: draftSettings.security,
        notifications: draftSettings.notifications,
        backup: draftSettings.backup,
      };

      const result = await settingsService.updateSettings(payload);
      const mapped = mapSettingsResponse(result.data);
      
      setSettings(mapped);
      setDraftSettings(mapped);
      return true;
    } catch (err) {
      setSaveError(err instanceof Error ? err : new Error('Failed to save settings'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      const result = await settingsService.resetSettings();
      const mapped = mapSettingsResponse(result.data);
      setSettings(mapped);
      setDraftSettings(mapped);
      return true;
    } catch (err) {
      setSaveError(err instanceof Error ? err : new Error('Failed to reset settings'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setDraftSettings(settings ? { ...settings } : null);
    setSaveError(null);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(draftSettings);

  return {
    settings,
    draftSettings,
    loading,
    saving,
    error,
    saveError,
    hasChanges,
    updateDraft,
    saveSettings,
    resetToDefaults,
    discardChanges,
    refresh: fetchSettings,
  };
};
