import { useState, useCallback, useEffect } from 'react';
import { attendanceService } from '../services/attendance.service';
import { mapAttendanceDtoToRecord } from '../utils/attendanceMappers';
import type { AttendanceRecord, AttendanceFilterState, AttendanceSummary } from '@/types/attendance';
import type { GetAttendanceQueryParams, CorrectAttendancePayload } from '../types/attendance.api.types';

const emptySummary: AttendanceSummary = {
  presentToday: 0,
  absentToday: 0,
  lateArrivals: 0,
  earlyDepartures: 0,
  avgWorkingHours: '--',
};

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>(emptySummary);
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
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        isActive: 'true',
      };

      // 1. Fetch Paginated Attendance Records
      const recordsRes = await attendanceService.getAttendance(params);
      
      // Safely handle both standard response { data: { records: [...] } } and unwrapped Axios interceptor response
      const resContainer = (recordsRes as any)?.data || recordsRes;
      const rawRecords = resContainer?.records || resContainer?.attendance || [];
      const mappedRecords = rawRecords.map(mapAttendanceDtoToRecord);
      
      setRecords(mappedRecords);

      if (resContainer?.pagination) {
        setMeta({
          total: resContainer.pagination.total,
          totalPages: resContainer.pagination.totalPages,
          limit: resContainer.pagination.limit,
        });
      }

      // 2. Fetch Dashboard Summary Metrics via Authenticated apiClient
      try {
        const summaryRes = await attendanceService.getSummary(filters.startDate || undefined);
        const summaryData = (summaryRes as any)?.data || summaryRes;
        if (summaryData) {
          setSummary(summaryData);
        }
      } catch (sumErr) {
        console.warn('Failed to fetch attendance summary metrics:', sumErr);
      }

    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch attendance records'));
      setRecords([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  }, [filters, page, meta.limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAttendance();
    }, 300);
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
    summary,
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