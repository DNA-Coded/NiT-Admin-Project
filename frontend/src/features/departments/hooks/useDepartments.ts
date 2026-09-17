import { useState, useCallback, useEffect } from 'react';
import { departmentsService } from '../services/departments.service';
import { facultyService } from '@/features/employees/services/faculty.service';
import { mapDepartmentsList } from '../utils/departmentMappers';
import type { Department } from '@/types/departments';
import type { PaginationMeta } from '../types/departments.api.types';

export function useDepartments(initialSearch = '', initialPage = 1, limit = 10) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isMutating, setIsMutating] = useState(false);

  // Debounce search query and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDepartments = useCallback(async (searchVal = debouncedSearch, pageVal = page) => {
    setLoading(true);
    setError(null);
    try {
      const [deptResponse, hodResponse] = await Promise.all([
        departmentsService.getDepartments({
          page: pageVal,
          limit,
          search: searchVal,
        }),
        facultyService.getAllFaculty({ isHOD: true, limit: 100 })
      ]);

      const hodMap: Record<string, string> = {};
      // Backend returns { success, data: [...employees], pagination }
      // facultyService.getAllFaculty returns the .data payload already (via raw_response.data)
      // So hodResponse = { success, data: [...], pagination }
      const rawData = hodResponse?.data;
      const facultyList = Array.isArray(rawData) ? rawData : (rawData as any)?.faculty || [];
      facultyList.forEach((hod: any) => {
        const deptId = typeof hod.department === 'object' && hod.department !== null 
          ? (hod.department.id || hod.department._id)
          : String(hod.department);
          
        hodMap[deptId] = (hod.fullName || `${hod.firstName} ${hod.lastName}`).trim();
      });

      setDepartments(mapDepartmentsList(deptResponse.departments, hodMap));
      setMeta(deptResponse.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, [limit, debouncedSearch, page]);

  useEffect(() => {
    fetchDepartments(debouncedSearch, page);
  }, [debouncedSearch, page, fetchDepartments]);

  const createDepartment = async (data: { name: string; code: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.createDepartment(data);
      await fetchDepartments(debouncedSearch, page);
    } finally {
      setIsMutating(false);
    }
  };

  const updateDepartment = async (id: string, data: { name?: string; code?: string; description?: string }) => {
    setIsMutating(true);
    try {
      await departmentsService.updateDepartment(id, data);
      await fetchDepartments(debouncedSearch, page);
    } finally {
      setIsMutating(false);
    }
  };

  const removeDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.deleteDepartment(id);
      await fetchDepartments(debouncedSearch, page);
    } finally {
      setIsMutating(false);
    }
  };

  const recoverDepartment = async (id: string) => {
    setIsMutating(true);
    try {
      await departmentsService.restoreDepartment(id);
      await fetchDepartments(debouncedSearch, page);
    } finally {
      setIsMutating(false);
    }
  };

  const changeHod = async (_departmentId: string, newHodId: string | null, oldHodId: string | null) => {
    setIsMutating(true);
    try {
      if (oldHodId) {
        await facultyService.updateFaculty(oldHodId, { isHOD: false });
      }
      if (newHodId) {
        await facultyService.updateFaculty(newHodId, { isHOD: true });
      }
      await fetchDepartments(debouncedSearch, page);
    } catch (err: any) {
      console.error('Failed to change HOD:', err);
      throw err;
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
    changeHod,
    refetch: () => fetchDepartments(debouncedSearch, page),
  };
}