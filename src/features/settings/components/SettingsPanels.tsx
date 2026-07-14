import React, { useState } from 'react';
import { DEPARTMENTS } from '@/constants';
import { ActivityPanel } from '@/features/activity/components/ActivityPanel';
import type { 
  SettingsOrganization, 
  SettingsAcademic, 
  SettingsAttendance, 
  SettingsNotifications, 
  SettingsDevices, 
  SettingsSecurity, 
  SettingsBackendModel 
} from '../types/settings.api.types';

type UpdateDraftFn = (section: keyof SettingsBackendModel, field: string, value: any) => void;

/* 1. Organization Panel */
export const OrgSettingsPanel: React.FC<{
  data: SettingsOrganization;
  academicData: SettingsAcademic;
  timezone: string;
  onChange: UpdateDraftFn;
}> = ({ data, academicData, timezone, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Organization Details</h3>
        <p className="text-on-surface-variant font-medium mt-1">General profile and coordinates of the academic institution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Institution Name</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="text"
            value={data.organizationName}
            onChange={(e) => onChange('organization', 'organizationName', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Time Zone</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="text"
            value={timezone}
            onChange={(e) => onChange('system', 'timezone', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Contact Email</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="email"
            value={data.contactEmail}
            onChange={(e) => onChange('organization', 'contactEmail', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Contact Number</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="text"
            value={data.contactPhone}
            onChange={(e) => onChange('organization', 'contactPhone', e.target.value)}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Address</label>
          <textarea
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface resize-none h-20 focus:border-primary outline-none"
            value={data.address}
            onChange={(e) => onChange('organization', 'address', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Current Academic Year</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="text"
            value={academicData.currentAcademicSession}
            onChange={(e) => onChange('academic', 'currentAcademicSession', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

/* 2. Attendance Rules Panel */
export const AttendanceRulesPanel: React.FC<{
  data: SettingsAttendance;
  onChange: UpdateDraftFn;
}> = ({ data, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Attendance Logic & Thresholds</h3>
        <p className="text-on-surface-variant font-medium mt-1">Configurable working limits used to mark late entries and verify half days.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Office Start Time</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="time"
            value={data.workingHoursStart}
            onChange={(e) => onChange('attendance', 'workingHoursStart', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Office End Time</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="time"
            value={data.workingHoursEnd}
            onChange={(e) => onChange('attendance', 'workingHoursEnd', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Grace Period Allowed (Mins)</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="number"
            value={data.gracePeriodMinutes}
            onChange={(e) => onChange('attendance', 'gracePeriodMinutes', Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Minimum Working Hours for Present</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none opacity-80"
            type="number"
            defaultValue={8}
            onChange={() => {}}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Half-Day Threshold Hours</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none opacity-80"
            type="number"
            defaultValue={4}
            onChange={() => {}}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Overtime Threshold Hours</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none opacity-80"
            type="number"
            defaultValue={9}
            onChange={() => {}}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Weekend Policy</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none opacity-80"
            type="text"
            defaultValue={'Saturday (Half-day), Sunday (Off)'}
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="border-t border-outline-variant pt-4 flex justify-end gap-3">
        <p className="text-label-sm text-on-surface-variant italic mr-auto mt-2">
          Use the Save Changes button in the header to persist changes.
        </p>
      </div>
    </div>
  );
};

/* 3. Working Hours / Shift templates */
export const WorkingHoursPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Shift Schedule Templates</h3>
        <p className="text-on-surface-variant font-medium mt-1">Predefined working schedule cards mapped to staff shifts.</p>
      </div>
      <div className="text-center py-8 italic text-on-surface-variant bg-surface border border-outline-variant/60 rounded-lg">
        No shifts configured. (Feature deferred)
      </div>
    </div>
  );
};

/* 4. Shift Management Table */
export const ShiftManagementPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Shift Management Matrix</h3>
        <button className="px-3.5 py-1.5 bg-primary text-white font-label-sm text-label-sm rounded-lg opacity-50 cursor-not-allowed font-bold" disabled>
          Add Shift Template
        </button>
      </div>
      <div className="p-8 text-center italic text-on-surface-variant">
        Shift management module is currently not available.
      </div>
    </div>
  );
};

/* 5. Holiday Calendar Panel */
export const HolidayCalendarPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Academic Holiday List</h3>
        <button className="px-3.5 py-1.5 bg-primary text-white font-label-sm text-label-sm rounded-lg opacity-50 cursor-not-allowed font-bold" disabled>
          Add Holiday
        </button>
      </div>
      <div className="p-8 text-center italic text-on-surface-variant">
        Holiday calendar module is currently not available.
      </div>
    </div>
  );
};

/* 6. Departments List Panel */
export const DepartmentsPanel: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredDepts = DEPARTMENTS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary font-bold">Campus Departments</h3>
          <p className="text-on-surface-variant font-medium mt-1">Configured structural academic branches in NIT campus.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-1.5 font-body-sm text-body-sm focus:border-primary outline-none transition-all"
            placeholder="Search departments..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDepts.map((d) => (
          <div key={d} className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">school</span>
            <span className="font-bold text-on-surface">{d}</span>
          </div>
        ))}
        {filteredDepts.length === 0 && (
          <div className="md:col-span-3 text-center py-8 italic text-on-surface-variant bg-surface border border-outline-variant/60 rounded-lg">
            No departments matching query.
          </div>
        )}
      </div>
    </div>
  );
};

/* 7. User Roles Panel */
export const UserRolesPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Access Permissions & Roles</h3>
        <p className="text-on-surface-variant font-medium mt-1">Administrator role hierarchies. Read-only policy mapping.</p>
      </div>
      <div className="text-center py-8 italic text-on-surface-variant bg-surface border border-outline-variant/60 rounded-lg">
        No custom roles configured. (Feature deferred)
      </div>
    </div>
  );
};

/* 8. Notifications Panel */
export const NotificationsPanel: React.FC<{
  data: SettingsNotifications;
  onChange: UpdateDraftFn;
}> = ({ data, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Notification Alert Hub</h3>
        <p className="text-on-surface-variant font-medium mt-1">Global email and hardware exception notifications settings.</p>
      </div>

      <div className="space-y-4">
        {/* Email Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60">
          <div>
            <h4 className="font-bold text-on-surface">Email Summaries</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Send daily/weekly reports to registrar email.</p>
          </div>
          <input 
            className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" 
            type="checkbox" 
            checked={data.enableEmailNotifications} 
            onChange={(e) => onChange('notifications', 'enableEmailNotifications', e.target.checked)}
          />
        </div>

        {/* SMS Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60">
          <div>
            <h4 className="font-bold text-on-surface">Hardware Outage SMS</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Alert system administrator instantly on biometric offline.</p>
          </div>
          <input 
            className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" 
            type="checkbox" 
            checked={data.enableSystemNotifications} 
            onChange={(e) => onChange('notifications', 'enableSystemNotifications', e.target.checked)}
          />
        </div>

        {/* Push Notification */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60">
          <div>
            <h4 className="font-bold text-on-surface">Web Push Alerts</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Flash instant notifications on live dashboard.</p>
          </div>
          <input 
            className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" 
            type="checkbox" 
            checked={data.enableSystemNotifications} 
            onChange={(e) => onChange('notifications', 'enableSystemNotifications', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

/* 9. Device Config Panel */
export const DeviceConfigPanel: React.FC<{
  data: SettingsDevices;
  onChange: UpdateDraftFn;
}> = ({ data, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Biometric Telemetry Global Rules</h3>
        <p className="text-on-surface-variant font-medium mt-1">Default network behaviors and sync metrics used by hardware hubs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Default Synchronization Interval</label>
          <input className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface opacity-80" readOnly type="text" value="Every 60 Seconds" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Offline Retry Policy</label>
          <input className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface opacity-80" readOnly type="text" value="10 attempts, then raise critical warning" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Device Connection Timeout (ms)</label>
          <input className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface opacity-80" readOnly type="text" value="3000ms" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Health Check Handshake Frequency (seconds)</label>
          <input 
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none" 
            type="number" 
            value={data.heartbeatTimeout} 
            onChange={(e) => onChange('devices', 'heartbeatTimeout', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

/* 10. Security Settings Panel */
export const SecurityPanel: React.FC<{
  data: SettingsSecurity;
  onChange: UpdateDraftFn;
}> = ({ data, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">System Security & Access</h3>
        <p className="text-on-surface-variant font-medium mt-1">Password strength rules, session expiration settings, and login safeguards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Password Minimum Character Length</label>
          <input className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface opacity-80" readOnly type="text" value="12 characters (requires alphanumeric)" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Inactive Session Expiration Timeout (Minutes)</label>
          <input 
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none" 
            type="number" 
            value={data.sessionTimeout} 
            onChange={(e) => onChange('security', 'sessionTimeout', Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Password Expiry (Days)</label>
          <input 
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none" 
            type="number" 
            value={data.passwordExpiryDays} 
            onChange={(e) => onChange('security', 'passwordExpiryDays', Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Max Login Attempts</label>
          <input 
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none" 
            type="number" 
            value={data.maxLoginAttempts} 
            onChange={(e) => onChange('security', 'maxLoginAttempts', Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60 md:col-span-2 mt-2">
          <div>
            <h4 className="font-bold text-on-surface">Enforce Two-Factor Authentication (2FA)</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Enforce Google Authenticator pings for administrative access.</p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 px-2 py-0.5 rounded">
            RECOMMENDED
          </span>
        </div>
      </div>
    </div>
  );
};

/* 11. Audit Logs Panel */
export const AuditLogsPanel: React.FC = () => {
  return <ActivityPanel />;
};

/* 12. System Information Panel */
export const SystemInfoPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">System telemetry & Health</h3>
        <p className="text-on-surface-variant font-medium mt-1">Application build details and cloud integration API status checkpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Specs */}
        <div className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-outline">Application Version</span>
          <span className="font-bold text-primary text-base">v1.2.0-beta.4</span>
        </div>
        <div className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-outline">Environment Mode</span>
          <span className="font-bold text-on-surface text-base">STAGING_PREVIEW_FRONTEND</span>
        </div>

        {/* Database checkpoint */}
        <div className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex items-center justify-between md:col-span-2">
          <div>
            <h4 className="font-bold text-on-surface">Central PostgreSQL Database</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Connection pool status check</p>
          </div>
          <span className="bg-[#dcfce7] text-[#166534] border border-success/15 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            ACTIVE (24ms)
          </span>
        </div>

        {/* API checkpoint */}
        <div className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex items-center justify-between md:col-span-2">
          <div>
            <h4 className="font-bold text-on-surface">Vite Local Development Hot Reload Server</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Vite bundling status check</p>
          </div>
          <span className="bg-[#dcfce7] text-[#166534] border border-success/15 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            ONLINE
          </span>
        </div>

        {/* Socket Gateway */}
        <div className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex items-center justify-between md:col-span-2">
          <div>
            <h4 className="font-bold text-on-surface">Socket.io Biometric Sync Server</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Real-time gateway status check</p>
          </div>
          <span className="bg-error-container text-on-error-container border border-error/15 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            OFFLINE (FUTURE INTEGRATION)
          </span>
        </div>
      </div>
    </div>
  );
};
