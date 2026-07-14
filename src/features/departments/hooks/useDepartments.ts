import { useState, useCallback, useEffect } from 'react';
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

  // Derived loading state for mutations
  const [isMutating, setIsMutating] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentsService.getDepartments({
        page,
        limit,
        search: searchQuery,
      });
      setDepartments(mapDepartmentsList(response.data));
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search
      fetchDepartments();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchDepartments]);

  const createDepartment = async (data: { name: string; code: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.createDepartment(data);
      await fetchDepartments();
    } finally {
      setIsMutating(false);
    }
  };

  const updateDepartment = async (id: string, data: { name?: string; code?: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.updateDepartment(id, data);
      await fetchDepartments();
    } finally {
      setIsMutating(false);
    }
  };

  const removeDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.deleteDepartment(id);
      await fetchDepartments();
    } finally {
      setIsMutating(false);
    }
  };

  const recoverDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.restoreDepartment(id);
      await fetchDepartments();
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
    refetch: fetchDepartments,
  };
}
