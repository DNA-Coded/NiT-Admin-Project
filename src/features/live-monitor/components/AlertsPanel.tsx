import React from 'react';
import type { AlertItem } from '@/types/liveMonitor';

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
        <h3 className="font-headline-md text-headline-md text-on-surface">System Alerts</h3>
        <span className="material-symbols-outlined text-[20px] text-outline">warning</span>
      </div>

      {/* Warnings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 border rounded flex gap-3 items-start transition-all duration-200 hover:-translate-y-0.5 ${
              alert.type === 'critical'
                ? 'bg-danger-bg/25 border-danger/20 text-danger-text'
                : alert.type === 'warning'
                ? 'bg-warning-bg/25 border-warning/20 text-warning-text'
                : 'bg-surface border-outline-variant/60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
              {alert.type === 'critical'
                ? 'error'
                : alert.type === 'warning'
                ? 'warning_amber'
                : 'info'}
            </span>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-label-md text-[13px] font-bold leading-tight truncate">
                {alert.title}
              </h4>
              <p className="text-[11px] leading-tight mt-1 truncate-2-lines">
                {alert.description}
              </p>
              <span className="block text-[9px] mt-1.5 opacity-60 font-medium">
                {alert.timestamp}
              </span>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant italic">
            No system warnings or notifications.
          </div>
        )}
      </div>
    </div>
  );
};
