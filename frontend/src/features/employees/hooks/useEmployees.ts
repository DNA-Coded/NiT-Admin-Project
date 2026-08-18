import { useState, useCallback, useEffect, useRef } from 'react';
import { facultyService } from '../services/faculty.service';
import { mapFacultyList } from '../utils/employeeMappers';
import type { Employee, FilterState } from '@/types/employees';
import type { PaginationMeta, CreateFacultyDTO, UpdateFacultyDTO } from '../types/faculty.api.types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    designation: '',
    employmentType: '',
    status: '',
    isActive: '',
  });

  // 1. Create a specific debounced value just for the search string
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  // 2. Fetch function relies on debouncedSearch, not filters.search
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Clean up empty strings so they are omitted from the request query
      const cleanFilter = (val: string | undefined) => {
        if (!val) return undefined;
        const trimmed = val.trim();
        // If it's empty, or accidentally the literal string "undefined", drop it completely
        if (trimmed === '' || trimmed === 'undefined') return undefined;
        return trimmed;
      };
      
      const response = await facultyService.getAllFaculty({
        page,
        limit: 10,
        search: cleanFilter(debouncedSearch),
        department: cleanFilter(filters.department),     
        designation: cleanFilter(filters.designation),   
        status: cleanFilter(filters.status),             
        isActive: cleanFilter(filters.isActive),
      });

      const rawList = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.faculty || [];

      const paginationMeta = response.pagination || (response.data as any)?.pagination || null;

      setEmployees(mapFacultyList(rawList));
      setMeta(paginationMeta);
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || (err as Error).message || 'Failed to fetch employees';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.department, filters.designation, filters.status, filters.isActive]);

  // 3. Reset to page 1 ONLY when filters change (ignoring page changes)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, filters.department, filters.designation, filters.status, filters.isActive]);

  // 4. Trigger fetch automatically when dependencies change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (data: CreateFacultyDTO) => {
    try {
      setIsMutating(true);
      await facultyService.createFaculty(data);
      await fetchEmployees();
    } catch (err: unknown) {
      throw new Error((err as any).response?.data?.message || 'Failed to create employee');
    } finally {
      setIsMutating(false);
    }
  };

  const updateEmployee = async (id: string, data: UpdateFacultyDTO) => {
    try {
      setIsMutating(true);
      await facultyService.updateFaculty(id, data);
      await fetchEmployees();
    } catch (err: unknown) {
      throw new Error((err as any).response?.data?.message || 'Failed to update employee');
    } finally {
      setIsMutating(false);
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      setIsMutating(true);
      await facultyService.deleteFaculty(id);
      await fetchEmployees();
    } catch (err: unknown) {
      throw new Error((err as any).response?.data?.message || 'Failed to deactivate employee');
    } finally {
      setIsMutating(false);
    }
  };

  const recoverEmployee = async (id: string) => {
    try {
      setIsMutating(true);
      await facultyService.restoreFaculty(id);
      await fetchEmployees();
    } catch (err: unknown) {
      throw new Error((err as any).response?.data?.message || 'Failed to restore employee');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    employees, meta, loading, error, filters, setFilters,
    page, setPage, isMutating, createEmployee, updateEmployee,
    removeEmployee, recoverEmployee, refetch: fetchEmployees,
  };
}