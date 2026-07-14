import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import type { AttendanceDTO } from '../types/attendance.api.types';

export function mapAttendanceDtoToRecord(dto: AttendanceDTO): AttendanceRecord {
  // If it's an IN event, it maps to firstIn. If OUT, it maps to lastOut.
  const isCheckIn = dto.attendanceType === 'IN';
  
  // Format the time safely
  let timeStr = '--';
  try {
    if (dto.timestamp) {
      const date = new Date(dto.timestamp);
      timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  } catch (e) {
    timeStr = dto.attendanceTime || '--';
  }

  // Determine designation/department fallback
  const departmentName = dto.person?.department?.name || 'Unassigned';
  const designation = 'Staff'; // Backend doesn't provide designation directly in person populator

  // Ensure valid frontend status type
  let status: AttendanceStatus = 'PRESENT';
  const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];
  if (validStatuses.includes(dto.status)) {
    status = dto.status as AttendanceStatus;
  }

  return {
    id: dto.id,
    attendanceCode: dto.attendanceCode,
    employeeId: dto.person?.id || 'UNKNOWN',
    employeeName: dto.person?.fullName || 'Unknown User',
    department: departmentName,
    designation,
    date: dto.attendanceDate,
    firstIn: isCheckIn ? timeStr : null,
    lastOut: !isCheckIn ? timeStr : null,
    totalHours: '--', // Backend returns single events, so total hours cannot be computed here
    lateArrival: dto.status === 'LATE',
    earlyExit: false, // Cannot be reliably determined from single event
    status,
    deviceUsed: dto.device?.deviceName || null,
    shift: '--',
    breakSessions: [],
    notes: dto.remarks || undefined,
    attendanceType: dto.attendanceType,
    remarks: dto.remarks,
    correctionHistory: dto.correctionHistory,
  };
}
