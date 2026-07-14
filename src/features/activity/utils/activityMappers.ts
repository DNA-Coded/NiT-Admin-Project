import type { ActivityLogAPI, ActivityItem, ActivityUser } from '../types/activity.api.types';

export const mapActivityUser = (performedBy: string | ActivityUser | undefined): string => {
  if (!performedBy) return 'System';
  if (typeof performedBy === 'string') return performedBy; // E.g. object ID or raw string
  return performedBy.name || performedBy.email || 'Unknown User';
};

export const mapActivityItem = (log: ActivityLogAPI): ActivityItem => {
  return {
    id: log._id,
    activityId: log.activityId,
    module: log.module,
    action: log.action,
    description: log.description,
    performedBy: mapActivityUser(log.performedBy),
    timestamp: new Date(log.createdAt).toLocaleString(),
    status: log.status,
    severity: log.severity,
    ipAddress: log.ipAddress || 'N/A',
    userAgent: log.userAgent || 'Unknown device',
    metadata: log.metadata,
    entityType: log.entityType,
    entityId: log.entityId,
  };
};

export const mapActivityList = (logs: ActivityLogAPI[]): ActivityItem[] => {
  return logs.map(mapActivityItem);
};
