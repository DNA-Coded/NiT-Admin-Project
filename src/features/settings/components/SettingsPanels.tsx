import React, { useState } from 'react';
import {
  mockOrgSettings,
  mockAttendanceRules,
  mockShifts,
  mockHolidays,
  mockUserRoles,
} from '@/mocks/settings';
import { DEPARTMENTS } from '@/constants';
import { ActivityPanel } from '@/features/activity/components/ActivityPanel';

/* 1. Organization Panel */
export const OrgSettingsPanel: React.FC = () => {
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
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface"
            readOnly
            type="text"
            value={mockOrgSettings.name}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Time Zone</label>
          <input
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface"
            readOnly
            type="text"
            value={mockOrgSettings.timeZone}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Contact Email</label>
          <input
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface"
            readOnly
            type="email"
            value={mockOrgSettings.email}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Contact Number</label>
          <input
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface"
            readOnly
            type="text"
            value={mockOrgSettings.contactNumber}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Address</label>
          <textarea
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface resize-none h-20"
            readOnly
            value={mockOrgSettings.address}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Current Academic Year</label>
          <input
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface"
            readOnly
            type="text"
            value={mockOrgSettings.academicYear}
          />
        </div>
      </div>
    </div>
  );
};

/* 2. Attendance Rules Panel */
export const AttendanceRulesPanel: React.FC = () => {
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
            defaultValue={mockAttendanceRules.officeStartTime}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Office End Time</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="time"
            defaultValue={mockAttendanceRules.officeEndTime}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Grace Period Allowed (Mins)</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="number"
            defaultValue={mockAttendanceRules.gracePeriodMins}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Minimum Working Hours for Present</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="number"
            defaultValue={mockAttendanceRules.minWorkingHours}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Half-Day Threshold Hours</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="number"
            defaultValue={mockAttendanceRules.halfDayThresholdHours}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Overtime Threshold Hours</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="number"
            defaultValue={mockAttendanceRules.overtimeThresholdHours}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Weekend Policy</label>
          <input
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface focus:border-primary outline-none"
            type="text"
            defaultValue={mockAttendanceRules.weekendPolicy}
          />
        </div>
      </div>
      <div className="border-t border-outline-variant pt-4 flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-primary text-white font-label-md rounded-lg hover:opacity-90 transition-all font-bold shadow-sm"
          onClick={() => alert('Simulating rules update... (Settings are read-only prior to backend API configuration)')}
        >
          Update Rules
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockShifts.map((sh) => (
          <div key={sh.id} className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-primary text-label-md">{sh.name}</h4>
              <span className="text-[10px] bg-success/10 text-success font-bold px-2 py-0.5 rounded border border-success/20">
                {sh.status}
              </span>
            </div>
            <div className="text-[12px] text-on-surface-variant space-y-1">
              <p>Timing: <span className="font-bold text-on-surface">{sh.startTime} - {sh.endTime}</span></p>
              <p>Break Duration: <span className="font-medium text-on-surface">{sh.breakDurationMins} mins</span></p>
              <p className="truncate">Depts: <span className="font-medium text-on-surface">{sh.assignedDepartments.join(', ')}</span></p>
            </div>
          </div>
        ))}
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
        <button
          className="px-3.5 py-1.5 bg-primary text-white font-label-sm text-label-sm rounded-lg hover:opacity-95 font-bold"
          onClick={() => alert('New shift form template... (Simulated Action)')}
        >
          Add Shift Template
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only"> Shift details and assigned college departments table.</caption>
          <thead className="bg-surface-container-high/30 text-label-md text-outline uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-label-md">Shift Name</th>
              <th className="px-6 py-4 font-label-md">Timing</th>
              <th className="px-6 py-4 font-label-md">Break Time</th>
              <th className="px-6 py-4 font-label-md">Departments</th>
              <th className="px-6 py-4 font-label-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
            {mockShifts.map((sh) => (
              <tr key={sh.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 font-bold text-primary">{sh.name}</td>
                <td className="px-6 py-4 font-mono font-bold">{sh.startTime} - {sh.endTime}</td>
                <td className="px-6 py-4">{sh.breakDurationMins} mins</td>
                <td className="px-6 py-4 max-w-[200px] truncate">{sh.assignedDepartments.join(', ')}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:underline font-bold text-label-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <button
          className="px-3.5 py-1.5 bg-primary text-white font-label-sm text-label-sm rounded-lg hover:opacity-95 font-bold"
          onClick={() => alert('Add Holiday template... (Simulated Action)')}
        >
          Add Holiday
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only"> Holiday list for NIT academic calendar.</caption>
          <thead className="bg-surface-container-high/30 text-label-md text-outline uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-label-md">Holiday Name</th>
              <th className="px-6 py-4 font-label-md">Date</th>
              <th className="px-6 py-4 font-label-md">Type</th>
              <th className="px-6 py-4 font-label-md">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
            {mockHolidays.map((hol) => (
              <tr key={hol.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 font-bold text-primary">{hol.name}</td>
                <td className="px-6 py-4 font-mono">{hol.date}</td>
                <td className="px-6 py-4">
                  <span className="bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded font-label-sm text-[11px] font-bold">
                    {hol.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant max-w-[250px] truncate">{hol.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

      <div className="grid grid-cols-1 gap-4">
        {mockUserRoles.map((role) => (
          <div key={role.roleName} className="bg-surface border border-outline-variant/60 rounded-lg p-5 flex flex-col gap-3">
            <div>
              <h4 className="font-bold text-primary text-label-md">{role.roleName}</h4>
              <p className="text-[12px] text-on-surface-variant leading-relaxed mt-1 font-medium">{role.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/30">
              {role.permissions.map((p) => (
                <span
                  key={p}
                  className="bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 8. Notifications Panel */
export const NotificationsPanel: React.FC = () => {
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
          <input className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" defaultChecked />
        </div>

        {/* SMS Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60">
          <div>
            <h4 className="font-bold text-on-surface">Hardware Outage SMS</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Alert system administrator instantly on biometric offline.</p>
          </div>
          <input className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" defaultChecked />
        </div>

        {/* Push Notification */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60">
          <div>
            <h4 className="font-bold text-on-surface">Web Push Alerts</h4>
            <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">Flash instant notifications on live dashboard.</p>
          </div>
          <input className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox" defaultChecked />
        </div>
      </div>
    </div>
  );
};

/* 9. Device Config Panel */
export const DeviceConfigPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Biometric Telemetry Global Rules</h3>
        <p className="text-on-surface-variant font-medium mt-1">Default network behaviors and sync metrics used by hardware hubs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Default Synchronization Interval</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="Every 60 Seconds" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Offline Retry Policy</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="10 attempts, then raise critical warning" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Device Connection Timeout</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="3000ms" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Health Check Handshake Frequency</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="Every 10 Seconds" />
        </div>
      </div>
    </div>
  );
};

/* 10. Security Settings Panel */
export const SecurityPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 font-body-sm text-body-sm">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">System Security & Access</h3>
        <p className="text-on-surface-variant font-medium mt-1">Password strength rules, session expiration settings, and login safeguards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Password Minimum Character Length</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="12 characters (requires alphanumeric)" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-outline">Inactive Session Expiration Timeout</label>
          <input className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-medium text-on-surface" readOnly type="text" value="15 Minutes" />
        </div>
        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/60 md:col-span-2">
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
