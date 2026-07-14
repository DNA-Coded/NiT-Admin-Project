import { useState, useCallback, useEffect } from 'react';
import { attendanceService } from '../services/attendance.service';
import { mapAttendanceDtoToRecord } from '../utils/attendanceMappers';
import type { AttendanceRecord, AttendanceFilterState } from '@/types/attendance';
import type { GetAttendanceQueryParams, CorrectAttendancePayload } from '../types/attendance.api.types';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [filters, setFilters] = useState<AttendanceFilterState>({
    startDate: '',
    endDate: '',
    department: '',
    employeeSearch: '',
    status: '',
    shift: '',
    device: '',
  });

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: GetAttendanceQueryParams = {
        page,
        limit: meta.limit,
        search: filters.employeeSearch || undefined,
        department: filters.department || undefined,
        device: filters.device || undefined,
        status: filters.status || undefined,
        attendanceDate: filters.startDate || undefined, // Backend supports attendanceDate, passing startDate for now
        isActive: 'true',
      };

      const res = await attendanceService.getAttendance(params);
      
      const mappedRecords = res.data.attendance.map(mapAttendanceDtoToRecord);
      setRecords(mappedRecords);
      setMeta({
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages,
        limit: res.data.pagination.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch attendance records'));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, meta.limit]);

  // Debounced search logic for filters
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAttendance();
    }, 400);
    return () => clearTimeout(handler);
  }, [fetchAttendance]);

  const correctRecord = async (id: string, payload: CorrectAttendancePayload) => {
    try {
      await attendanceService.correctAttendance(id, payload);
      await fetchAttendance();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to correct attendance record');
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await attendanceService.deleteAttendance(id);
      await fetchAttendance();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to deactivate attendance record');
    }
  };

  const restoreRecord = async (id: string) => {
    try {
      await attendanceService.restoreAttendance(id);
      await fetchAttendance();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to restore attendance record');
    }
  };

  return {
    records,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    meta,
    correctRecord,
    deleteRecord,
    restoreRecord,
    refresh: fetchAttendance,
  };
}
