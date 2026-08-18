export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  staffCount: number;
  deviceCount: number;
  attendanceRate: number;
  description?: string;
  officeLocation?: string;
  budgetCode?: string;
  isActive?: boolean;
}

export interface DepartmentFilter {
  searchQuery: string;
}
