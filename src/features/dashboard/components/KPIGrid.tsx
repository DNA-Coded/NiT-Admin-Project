import React from 'react';
import type { KPIStats } from '@/types/dashboard';
import { StatePlaceholder, type ViewState } from '@/components/shared/StatePlaceholder';
import { KPICard } from './KPICard';

interface KPIGridProps {
  data?: KPIStats;
  viewState: ViewState;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ data, viewState }) => {
  if (viewState !== 'success' || !data) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded mb-8">
        <StatePlaceholder state={viewState} />
      </div>
    );
  }

  const onlineAction = (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
    </span>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <KPICard title="Total Employees" value={data.totalEmployees.toLocaleString()} />
      <KPICard title="Present Today" value={data.presentToday.toLocaleString()} variant="success" />
      <KPICard title="Absent Today" value={data.absentToday.toLocaleString()} variant="danger" />
      <KPICard title="Late Arrivals" value={data.lateArrivals.toLocaleString()} variant="warning" />
      <KPICard title="Inside Campus" value={data.insideCampus.toLocaleString()} />
      <KPICard 
        title="Devices Online" 
        value={`${data.devicesOnline}/${data.totalDevices}`} 
        action={onlineAction} 
      />
    </div>
  );
};
