import type { Employee, EmployeeStatus } from '@/types/employees';
import type { FacultyDTO } from '../types/faculty.api.types';

/**
 * Maps a backend FacultyDTO / MongoDB document to the frontend Employee model.
 * Injects safe fallbacks for missing fields, MongoDB `_id` primary keys,
 * and unpopulated department references to prevent UI runtime crashes.
 */
export const mapFacultyToEmployee = (dto: FacultyDTO): Employee => {
  if (!dto) {
    return {} as Employee;
  }

  // 1. Resolve Primary Key (handles MongoDB raw `_id` vs Mongoose `id`)
  const id = dto.id || (dto as any)._id || '';

  // 2. Resolve Department Name (handles populated object vs raw ObjectId string)
  const departmentName = typeof dto.department === 'string'
    ? dto.department
    : dto.department?.name || 'Unknown Department';

  // 3. Resolve Display Name with fallback
  const fullName = dto.fullName 
    || ((dto as any).firstName ? `${(dto as any).firstName} ${(dto as any).lastName || ''}`.trim() : '')
    || 'Unnamed Employee';

  // 4. Map Status (checks explicitly for inactive status)
  let status: EmployeeStatus = 'ACTIVE';
  if (dto.isActive === false) {
    status = 'INACTIVE' as EmployeeStatus;
  } else if (dto.status && ['ACTIVE', 'ON_LEAVE', 'RETIRED', 'SUSPENDED'].includes(dto.status)) {
    status = dto.status as EmployeeStatus;
  }

  // 5. Date Parsing Safeguard
  let formattedJoiningDate = 'Not Available';
  if (dto.joiningDate) {
    try {
      const date = new Date(dto.joiningDate);
      if (!isNaN(date.getTime())) {
        formattedJoiningDate = date.toISOString().split('T')[0];
      }
    } catch {
      formattedJoiningDate = 'Not Available';
    }
  }

  return {
    id,
    employeeId: dto.employeeId || (id ? id.substring(0, 8).toUpperCase() : 'N/A'),
    name: fullName,
    email: dto.email || '',
    phone: dto.phone || '',
    department: departmentName,
    designation: dto.designation || 'Faculty Member',
    isHOD: (dto as any).isHOD ?? dto.designation?.toLowerCase().includes('hod') ?? false,
    employmentType: (dto as any).employmentType || 'Full-time',
    status,
    joiningDate: formattedJoiningDate,
    avatarUrl: dto.profileImage || undefined,
    biometricDevice: dto.attendanceIdentity ? {
      id: `DEV-${id}`,
      name: `Device Map (${dto.attendanceIdentity})`,
      location: 'System Assigned',
    } : null,
    attendanceIdentity: dto.attendanceIdentity,
    isActive: dto.isActive ?? true,
    attendanceSummary: (dto as any).attendanceSummary || {
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      leaveDays: 0,
    },
  };
};

/**
 * Defensive array mapper.
 * Returns an empty array `[]` if input is undefined, null, or not an array.
 */
export const mapFacultyList = (dtos?: FacultyDTO[] | null): Employee[] => {
  if (!Array.isArray(dtos)) {
    return [];
  }
  return dtos.map(mapFacultyToEmployee);
};