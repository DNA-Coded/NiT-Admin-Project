import type { Employee, EmployeeStatus } from '@/types/employees';
import type { FacultyDTO } from '../types/faculty.api.types';

/**
 * Maps a backend FacultyDTO to the frontend Employee model.
 * Injects legacy/mock fields (e.g. employmentType, attendanceSummary) that are required by the UI
 * but not yet provided by the backend to prevent UI breakage.
 */
export const mapFacultyToEmployee = (dto: FacultyDTO): Employee => {
  const departmentName = typeof dto.department === 'string' 
    ? dto.department 
    : dto.department?.name || 'Unknown Department';

  // Map Backend Status to Frontend EmployeeStatus
  let status: EmployeeStatus = 'ACTIVE';
  if (dto.status === 'ON_LEAVE' || dto.status === 'RETIRED' || dto.status === 'SUSPENDED') {
    status = dto.status as EmployeeStatus;
  }

  return {
    id: dto.id,
    employeeId: dto.employeeId,
    name: dto.fullName,
    email: dto.email || '',
    phone: dto.phone || '',
    department: departmentName,
    designation: dto.designation,
    // Legacy fields not present in backend but required by UI:
    employmentType: 'Full-time', // Mock default
    status,
    joiningDate: dto.joiningDate ? new Date(dto.joiningDate).toISOString().split('T')[0] : 'Not Available',
    avatarUrl: dto.profileImage || undefined,
    biometricDevice: dto.attendanceIdentity ? {
      id: `DEV-${dto.id}`,
      name: `Device Map (${dto.attendanceIdentity})`,
      location: 'System Assigned',
    } : null,
    attendanceIdentity: dto.attendanceIdentity,
    isActive: dto.isActive,
    // Not aggregated by backend yet
    attendanceSummary: {
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      leaveDays: 0,
    },
  };
};

export const mapFacultyList = (dtos: FacultyDTO[]): Employee[] => {
  return dtos.map(mapFacultyToEmployee);
};
