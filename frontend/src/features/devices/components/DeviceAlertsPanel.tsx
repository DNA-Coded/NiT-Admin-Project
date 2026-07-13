import React from 'react';
import { mockDeviceAlerts } from '@/mocks/devices';

export const DeviceAlertsPanel: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
        <h4 className="font-label-md text-primary font-bold">Infrastructure Alerts</h4>
        <span className="material-symbols-outlined text-[20px] text-outline">warning</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mockDeviceAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 border rounded-lg flex gap-3.5 items-start transition-all duration-200 hover:-translate-y-0.5 ${
              alert.type === 'critical'
                ? 'bg-danger-bg/25 border-danger/25 text-danger-text'
                : alert.type === 'warning'
                ? 'bg-warning-bg/25 border-warning/25 text-warning-text'
                : 'bg-surface border-outline-variant/60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
              {alert.type === 'critical'
                ? 'error'
                : alert.type === 'warning'
                ? 'warning_amber'
                : 'info'}
            </span>
            <div className="flex-1 overflow-hidden">
              <h5 className="font-label-md text-[13px] font-bold leading-tight truncate">
                {alert.title}
              </h5>
              <p className="text-[11px] leading-relaxed mt-1 truncate-2-lines">
                {alert.description}
              </p>
              <span className="block text-[9px] mt-1.5 opacity-65 font-bold">{alert.time}</span>
            </div>
          </div>
        ))}
        {mockDeviceAlerts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant italic">
            All devices running smoothly. No network alerts.
          </div>
        )}
      </div>
    </div>
  );
};
