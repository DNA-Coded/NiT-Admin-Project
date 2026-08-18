import React from 'react';
import type { ActivityItem } from '../types/activity.api.types';

interface ActivityDrawerProps {
  activity: ActivityItem | null;
  onClose: () => void;
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-lg z-50 flex flex-col transition-transform duration-300 transform translate-x-0 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background">Activity Details</h3>
          <button
            aria-label="Close details"
            className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 font-body-sm text-body-sm">
          {/* Title and tags */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                {activity.module}
              </span>
              <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                {activity.action}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  activity.status === 'SUCCESS'
                    ? 'bg-success-bg text-success-text border-success/15'
                    : activity.status === 'WARNING'
                    ? 'bg-warning-bg text-warning-text border-warning/15'
                    : 'bg-danger-bg text-danger-text border-danger/15'
                }`}
              >
                {activity.status}
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-background font-bold leading-snug mt-3">
              {activity.description}
            </h4>
            <p className="text-on-surface-variant mt-2 text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {activity.timestamp}
            </p>
          </div>

          {/* Core Info */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
            <h5 className="font-label-md text-label-md text-primary font-bold">Execution Context</h5>
            <div className="grid grid-cols-2 gap-4 font-body-sm text-body-sm text-on-surface">
              <div className="col-span-2">
                <span className="block text-on-surface-variant font-label-sm text-label-sm mb-0.5">Performed By</span>
                <span className="font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  {activity.performedBy}
                </span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm mb-0.5">IP Address</span>
                <span className="font-mono text-[12px]">{activity.ipAddress}</span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-label-sm text-label-sm mb-0.5">Severity</span>
                <span className="font-bold">{activity.severity}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-on-surface-variant font-label-sm text-label-sm mb-0.5">User Agent</span>
                <span className="font-mono text-[11px] text-on-surface-variant break-words">{activity.userAgent}</span>
              </div>
            </div>
          </div>

          {/* Entities (If present) */}
          {(activity.entityType || activity.entityId) && (
            <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
              <h5 className="font-label-md text-label-md text-primary font-bold">Entity Reference</h5>
              <div className="grid grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
                {activity.entityType && (
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">Type</span>
                    {activity.entityType}
                  </div>
                )}
                {activity.entityId && (
                  <div>
                    <span className="block text-on-surface-variant font-label-sm text-label-sm">ID</span>
                    <span className="font-mono text-[12px]">{activity.entityId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata JSON rendering */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
              <h5 className="font-label-md text-label-md text-primary font-bold">Metadata</h5>
              <div className="bg-surface-container-lowest border border-outline-variant p-3 rounded font-mono text-[11px] overflow-x-auto">
                <pre className="text-on-surface m-0 whitespace-pre-wrap break-words">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};
