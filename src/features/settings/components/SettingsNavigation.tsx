import React from 'react';

export type SettingsTab =
  | 'org'
  | 'rules'
  | 'hours'
  | 'shifts'
  | 'holidays'
  | 'depts'
  | 'roles'
  | 'notifications'
  | 'devices'
  | 'security'
  | 'audit'
  | 'system';

interface SettingsNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const items: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'org', label: 'Organization', icon: 'domain' },
    { id: 'rules', label: 'Attendance Rules', icon: 'gavel' },
    { id: 'hours', label: 'Working Hours', icon: 'schedule' },
    { id: 'shifts', label: 'Shift Management', icon: 'calendar_today' },
    { id: 'holidays', label: 'Holidays', icon: 'event_busy' },
    { id: 'depts', label: 'Departments', icon: 'groups' },
    { id: 'roles', label: 'User Roles', icon: 'admin_panel_settings' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
    { id: 'devices', label: 'Device Configuration', icon: 'router' },
    { id: 'security', label: 'Security', icon: 'shield_lock' },
    { id: 'audit', label: 'Audit Logs', icon: 'history' },
    { id: 'system', label: 'System Information', icon: 'info' },
  ];

  return (
    <nav className="flex flex-col gap-1 w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-sm shrink-0">
      <h3 className="px-3 py-2 font-label-md text-primary font-bold uppercase tracking-wider mb-2">
        System Setup
      </h3>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md text-left transition-all ${
              isActive
                ? 'bg-primary text-white font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
