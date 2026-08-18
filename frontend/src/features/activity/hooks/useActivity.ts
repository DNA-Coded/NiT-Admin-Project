import { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activity.service';
import { mapActivityList } from '../utils/activityMappers';
import type { ActivityItem, ActivityFilters } from '../types/activity.api.types';

export const useActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25); // Reasonable default for logs
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        q: searchQuery,
        ...filters,
      };

      const result = await activityService.getActivities(params);

      setActivities(mapActivityList(result.data));
      setMeta({
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load activities'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, filters]);

  // Fetch when dependencies change
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleFilterChange = (key: keyof ActivityFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  return {
    activities,
    loading,
    error,
    page,
    limit,
    meta,
    filters,
    searchQuery,
    setPage,
    setLimit,
    handleFilterChange,
    handleSearch,
    resetFilters,
    refresh: fetchActivities,
  };
};
