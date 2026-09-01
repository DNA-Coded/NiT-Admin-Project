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
      <div className="bg-surface-container-lowest border border-outline-variant rounded mb-8 p-6 min-h-[112px] flex items-center justify-center">
        <StatePlaceholder state={viewState}/>
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
    // Reconfigured framework break points to maintain clean structure on intermediate displays
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <KPICard title="Total Employees" value={(data.totalEmployees ?? 0).toLocaleString()}/>
      <KPICard title="Present Today" value={(data.presentToday ?? 0).toLocaleString()} variant="success"/>
      <KPICard title="Absent Today" value={(data.absentToday ?? 0).toLocaleString()} variant="danger"/>
      <KPICard title="Late Arrivals" value={(data.lateArrivals ?? 0).toLocaleString()} variant="warning"/>
      <KPICard title="Inside Campus" value={(data.insideCampus ?? 0).toLocaleString()}/>
      <KPICard action={onlineAction} title="Devices Online" value={`${data.devicesOnline ?? 0}/${data.totalDevices ?? 0}`}/>
    </div>
  );
};