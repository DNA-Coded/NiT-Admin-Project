import { useState } from 'react';
import {
  SettingsNavigation,
  type SettingsTab,
} from '@/features/settings/components/SettingsNavigation';
import {
  OrgSettingsPanel,
  AttendanceRulesPanel,
  WorkingHoursPanel,
  ShiftManagementPanel,
  HolidayCalendarPanel,
  DepartmentsPanel,
  UserRolesPanel,
  NotificationsPanel,
  DeviceConfigPanel,
  SecurityPanel,
  AuditLogsPanel,
  SystemInfoPanel,
} from '@/features/settings/components/SettingsPanels';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('org');
  const {
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
  } = useSettings();

  const renderContent = () => {
    if (!draftSettings) return null;

    switch (activeTab) {
      case 'org':
        return <OrgSettingsPanel data={draftSettings.organization} academicData={draftSettings.academic} timezone={draftSettings.system.timezone} onChange={updateDraft} />;
      case 'rules':
        return <AttendanceRulesPanel data={draftSettings.attendance} onChange={updateDraft} />;
      case 'hours':
        return <WorkingHoursPanel />;
      case 'shifts':
        return <ShiftManagementPanel />;
      case 'holidays':
        return <HolidayCalendarPanel />;
      case 'depts':
        return <DepartmentsPanel />;
      case 'roles':
        return <UserRolesPanel />;
      case 'notifications':
        return <NotificationsPanel data={draftSettings.notifications} onChange={updateDraft} />;
      case 'devices':
        return <DeviceConfigPanel data={draftSettings.devices} onChange={updateDraft} />;
      case 'security':
        return <SecurityPanel data={draftSettings.security} onChange={updateDraft} />;
      case 'audit':
        return <AuditLogsPanel />;
      case 'system':
        return <SystemInfoPanel />;
      default:
        return <OrgSettingsPanel data={draftSettings.organization} academicData={draftSettings.academic} timezone={draftSettings.system.timezone} onChange={updateDraft} />;
    }
  };

  const viewState = loading ? 'loading' : error ? 'error' : 'success';

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Settings & System Administration</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-medium">
            Configure default institution timing thresholds, shift schedules, admin access roles, security keys, and hardware sync rules.
          </p>
        </div>

        {/* Global Save Actions */}
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-surface border border-outline-variant text-on-surface font-label-md rounded-lg hover:bg-surface-container-low transition-all font-bold disabled:opacity-50"
            disabled={saving || loading}
            onClick={resetToDefaults}
          >
            Reset Defaults
          </button>
          
          {hasChanges && (
            <button
              className="px-4 py-2 bg-surface text-danger font-label-md rounded-lg hover:bg-danger/10 transition-all font-bold"
              disabled={saving}
              onClick={discardChanges}
            >
              Discard
            </button>
          )}

          <button
            className="px-6 py-2 bg-primary text-white font-label-md rounded-lg hover:opacity-90 transition-all font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
            disabled={!hasChanges || saving || loading}
            onClick={saveSettings}
          >
            {saving ? (
              <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Saving...</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
      
      {saveError && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/30 rounded-lg flex items-center gap-2 font-medium">
          <span className="material-symbols-outlined">error</span>
          {saveError.message || 'Failed to save settings. Please try again.'}
        </div>
      )}

      {/* Two-Column Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Vertical Menu Navigation */}
        <div className="w-full lg:w-72 shrink-0">
          <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Right Column: Tab View panel details content */}
        <div className="flex-1 w-full min-w-0">
          <StatePlaceholder state={viewState}>
            {renderContent()}
          </StatePlaceholder>
        </div>
      </div>
    </div>
  );
}
