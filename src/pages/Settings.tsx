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

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('org');

  const renderContent = () => {
    switch (activeTab) {
      case 'org':
        return <OrgSettingsPanel />;
      case 'rules':
        return <AttendanceRulesPanel />;
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
        return <NotificationsPanel />;
      case 'devices':
        return <DeviceConfigPanel />;
      case 'security':
        return <SecurityPanel />;
      case 'audit':
        return <AuditLogsPanel />;
      case 'system':
        return <SystemInfoPanel />;
      default:
        return <OrgSettingsPanel />;
    }
  };

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
      </div>

      {/* Two-Column Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Vertical Menu Navigation */}
        <div className="w-full lg:w-72 shrink-0">
          <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Right Column: Tab View panel details content */}
        <div className="flex-1 w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
