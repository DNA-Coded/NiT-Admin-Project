import React, { useState } from 'react';
import { useActivity } from '../hooks/useActivity';
import { ActivityFilterBar } from './ActivityFilterBar';
import { ActivityTable } from './ActivityTable';
import { ActivityDrawer } from './ActivityDrawer';
import type { ActivityItem } from '../types/activity.api.types';
import type { ViewState } from '@/components/shared/StatePlaceholder';

export const ActivityPanel: React.FC = () => {
  const {
    activities,
    loading,
    error,
    page,
    limit,
    meta,
    filters,
    searchQuery,
    setPage,
    handleFilterChange,
    handleSearch,
    resetFilters,
  } = useActivity();

  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const viewState: ViewState = loading && activities.length === 0
    ? 'loading'
    : error
    ? 'error'
    : activities.length === 0
    ? 'empty'
    : 'success';

  return (
    <div className="flex flex-col gap-6">
      <ActivityFilterBar
        filters={filters}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={resetFilters}
      />
      
      <ActivityTable
        activities={activities}
        viewState={viewState}
        onSelect={setSelectedActivity}
        currentPage={page}
        totalPages={meta.totalPages}
        totalEntries={meta.total}
        limit={limit}
        onPageChange={setPage}
      />

      <ActivityDrawer
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
