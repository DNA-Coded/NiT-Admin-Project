import { useState, useCallback, useEffect } from 'react';
import { facultyService } from '../services/faculty.service';
import { mapFacultyList } from '../utils/employeeMappers';
import type { Employee, FilterState } from '@/types/employees';
import type { PaginationMeta, CreateFacultyDTO, UpdateFacultyDTO } from '../types/faculty.api.types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Pagination State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    designation: '',
    employmentType: '', // Not used by backend, kept for UI compatibility if needed
    status: '',
    isActive: '',
  });

  // Mutating State
  const [isMutating, setIsMutating] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await facultyService.getAllFaculty({
        page,
        limit: 10,
        search: filters.search || undefined,
        department: filters.department || undefined,
        designation: filters.designation || undefined,
        status: filters.status || undefined,
        isActive: filters.isActive || undefined,
      });

      setEmployees(mapFacultyList(response.data.faculty));
      setMeta(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [page, filters.search, filters.department, filters.designation, filters.status, filters.isActive]);

  // Debounce search/filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [fetchEmployees]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.department, filters.designation, filters.status, filters.isActive]);

  const createEmployee = async (data: CreateFacultyDTO) => {
    try {
      setIsMutating(true);
      await facultyService.createFaculty(data);
      await fetchEmployees();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setIsMutating(false);
    }
  };

  const updateEmployee = async (id: string, data: UpdateFacultyDTO) => {
    try {
      setIsMutating(true);
      await facultyService.updateFaculty(id, data);
      await fetchEmployees();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsMutating(false);
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      setIsMutating(true);
      await facultyService.deleteFaculty(id);
      await fetchEmployees();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to deactivate employee');
    } finally {
      setIsMutating(false);
    }
  };

  const recoverEmployee = async (id: string) => {
    try {
      setIsMutating(true);
      await facultyService.restoreFaculty(id);
      await fetchEmployees();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to restore employee');
    } finally {
      setIsMutating(false);
    }
  };

  return {
    employees,
    meta,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    isMutating,
    createEmployee,
    updateEmployee,
    removeEmployee,
    recoverEmployee,
    refetch: fetchEmployees,
  };
}
