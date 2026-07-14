import type { Department } from '@/types/departments';
import type { DepartmentDTO } from '../types/departments.api.types';

export const mapDepartment = (dto: DepartmentDTO): Department => {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    hodName: 'Not Assigned', // Fallback, backend doesn't aggregate yet
    staffCount: 0,           // Fallback
    deviceCount: 0,          // Fallback
    attendanceRate: 0,       // Fallback
    isActive: dto.isActive,
    description: dto.description || undefined,
  };
};

export const mapDepartmentsList = (dtos: DepartmentDTO[]): Department[] => {
  return dtos.map(mapDepartment);
};
