// src/utils/departmentMappers.ts
import type { Department } from '@/types/departments';
import type { DepartmentDTO } from '../types/departments.api.types';

export const mapDepartment = (dto: DepartmentDTO): Department => {
  if (!dto) return {} as Department;

  // Handle MongoDB raw `_id` vs Mongoose virtual `id`
  const id = dto.id || (dto as any)._id || '';

  return {
    id,
    name: dto.name || '',
    code: dto.code || '',
    hodName: (dto as any).hodName ?? 'Not Assigned', // Fallback until aggregated
    staffCount: (dto as any).staffCount ?? 0,
    deviceCount: (dto as any).deviceCount ?? 0,
    attendanceRate: (dto as any).attendanceRate ?? 0,
    isActive: dto.isActive ?? true,
    description: dto.description ?? undefined,
  };
};

/**
 * Defensive array mapper.
 * Returns [] if input is null, undefined, or not an array.
 */
export const mapDepartmentsList = (dtos?: DepartmentDTO[] | null): Department[] => {
  if (!Array.isArray(dtos)) {
    return [];
  }
  return dtos.map(mapDepartment);
};