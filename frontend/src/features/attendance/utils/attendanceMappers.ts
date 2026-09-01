import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance';

export function mapAttendanceDtoToRecord(dto: any): AttendanceRecord {
  // 1. Daily Aggregated DTO
  if (dto.employee) {
    return {
      id: dto.id || `${dto.employee?.id}_${dto.attendanceDate}`,
      employeeId: dto.employee?.employeeId || 'N/A',
      employeeName: dto.employee?.fullName || 'Unknown User',
      department: dto.employee?.department || 'General',
      designation: dto.employee?.designation || 'Staff',
      date: dto.attendanceDate || new Date().toISOString().split('T')[0],
      firstIn: dto.firstIn || '--',
      lastOut: dto.lastOut || '--',
      totalHours: dto.totalHours || '--',
      lateArrival: dto.status === 'Late' || dto.status === 'LATE',
      earlyExit: false,
      status: (dto.status?.toUpperCase() || 'PRESENT') as AttendanceStatus,
      deviceUsed: 'Biometric Scanner',
      shift: 'Regular Shift',
      breakSessions: [],
    };
  }

  // 2. Single Event Raw Punch DTO
  const isCheckIn = dto.attendanceType === 'IN' || dto.attendanceType === 'CHECK_IN';
  
  let timeStr = '--';
  try {
    if (dto.timestamp) {
      const date = new Date(dto.timestamp);
      timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      timeStr = dto.attendanceTime || '--';
    }
  } catch {
    timeStr = dto.attendanceTime || '--';
  }

  const person = dto.person || {};
  const deptObj = person.department;
  const departmentName = typeof deptObj === 'object' ? (deptObj?.name || deptObj?.code) : (deptObj || 'Unassigned');
  const designationName = person.rawDesignation || person.designation || 'Staff';

  let status: AttendanceStatus = 'PRESENT';
  const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];
  if (validStatuses.includes(dto.status)) {
    status = dto.status as AttendanceStatus;
  }

  return {
    id: dto.id || dto._id,
    attendanceCode: dto.attendanceCode,
    employeeId: person.employeeId || person.empId || dto.attendanceIdentity || 'UNKNOWN',
    employeeName: person.fullName || `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Unknown User',
    department: departmentName,
    designation: designationName,
    date: dto.attendanceDate,
    firstIn: isCheckIn ? timeStr : '--',
    lastOut: !isCheckIn ? timeStr : '--',
    totalHours: '--',
    lateArrival: dto.status === 'LATE',
    earlyExit: false,
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