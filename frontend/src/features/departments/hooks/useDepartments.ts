import { useState, useCallback, useEffect, useRef } from 'react';
import { departmentsService } from '../services/departments.service';
import { mapDepartmentsList } from '../utils/departmentMappers';
import type { Department } from '@/types/departments';
import type { PaginationMeta } from '../types/departments.api.types';

export function useDepartments(initialSearch = '', initialPage = 1, limit = 10) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isMutating, setIsMutating] = useState(false);

  const isInitialMount = useRef(true);

  const fetchDepartments = useCallback(async (searchVal = searchQuery, pageVal = page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentsService.getDepartments({
        page: pageVal,
        limit,
        search: searchVal,
      });
      setDepartments(mapDepartmentsList(response.departments));
      setMeta(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Handle Search Input Debounce without cyclical updates
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDepartments(searchQuery, page);
      return;
    }

    const timer = setTimeout(() => {
      setPage(1); 
      fetchDepartments(searchQuery, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Separate effect handler for pure page pagination switches
  useEffect(() => {
    if (!isInitialMount.current) {
      fetchDepartments(searchQuery, page);
    }
  }, [page]);

  const createDepartment = async (data: { name: string; code: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.createDepartment(data);
      await fetchDepartments(searchQuery, page);
    } finally {
      setIsMutating(false);
    }
  };

  const updateDepartment = async (id: string, data: { name?: string; code?: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.updateDepartment(id, data);
      await fetchDepartments(searchQuery, page);
    } finally {
      setIsMutating(false);
    }
  };

  const removeDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.deleteDepartment(id);
      await fetchDepartments(searchQuery, page);
    } finally {
      setIsMutating(false);
    }
  };

  const recoverDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.restoreDepartment(id);
      await fetchDepartments(searchQuery, page);
    } finally {
      setIsMutating(false);
    }
  };

  return {
    departments,
    meta,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    isMutating,
    createDepartment,
    updateDepartment,
    removeDepartment,
    recoverDepartment,
    refetch: () => fetchDepartments(searchQuery, page),
  };
}