export interface FacultyDepartmentDTO {
  id: string;
  name: string;
  code: string;
}

export interface FacultyDTO {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  designation: string;
  department: FacultyDepartmentDTO | string | null;
  status: string;
  joiningDate: string | null;
  profileImage: string | null;
  attendanceIdentity: string;
  isHOD: boolean;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  totalCount?: number;
  totalPages: number;
}

export interface FacultyListResponse {
  success: boolean;
  data: {
    faculty: FacultyDTO[];
  };
  message: string;
  pagination?: PaginationMeta;
}

export interface FacultyDetailResponse {
  success: boolean;
  data: FacultyDTO;
  message: string;
}

export interface CreateFacultyDTO {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  designation: string;
  department: string; // ObjectId string
  attendanceIdentity: string;
  status?: string;
  joiningDate?: string;
  profileImage?: string;
  isHOD?: boolean; 
}

// Inherits the optional isHOD field automatically via Partial
export interface UpdateFacultyDTO extends Partial<CreateFacultyDTO> {}