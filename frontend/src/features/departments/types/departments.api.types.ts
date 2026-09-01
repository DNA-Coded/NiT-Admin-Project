export interface DepartmentDTO {
  id: string;
  name: string;
  code: string;
  description: string | null;
  hodName: string | null;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DepartmentListPayload {
  departments: DepartmentDTO[];
  pagination: PaginationMeta | null;
}

export interface GetDepartmentsResponse {
  success: boolean;
  message: string;
  data: DepartmentListPayload;
}

export interface DepartmentResponse {
  data: DepartmentDTO;
}

export interface GetDepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | 'all' | 'true' | 'false';
}
