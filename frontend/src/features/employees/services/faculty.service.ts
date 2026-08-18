import { apiClient } from '@/services/api/client';
import type { 
  FacultyListResponse, 
  FacultyDetailResponse, 
  CreateFacultyDTO, 
  UpdateFacultyDTO
} from '../types/faculty.api.types';

// Corrected endpoint URL
const BASE_URL = '/employee'; 

export const facultyService = {
  /**
   * Fetch a paginated list of faculty/employees with optional filters
   */
  async getAllFaculty(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    designation?: string;
    status?: string;
    isActive?: string | boolean;
  }): Promise<FacultyListResponse> {

    // 🛠️ Sanitize params to completely remove empty strings or undefined values
    const cleanedParams = params 
      ? Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        )
      : {};

      console.log('🚀 Outgoing API Params:', cleanedParams);

    const raw_response = await apiClient.get<FacultyListResponse>(BASE_URL, { 
      params: cleanedParams 
    });
    
    return raw_response.data;
  },

  /**
   * Fetch a single faculty by ID
   */
  async getFacultyById(id: string): Promise<FacultyDetailResponse> {
    const response = await apiClient.get<FacultyDetailResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new faculty member
   */
  async createFaculty(data: CreateFacultyDTO): Promise<FacultyDetailResponse> {
    const response = await apiClient.post<FacultyDetailResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing faculty member
   */
  async updateFaculty(id: string, data: UpdateFacultyDTO): Promise<FacultyDetailResponse> {
    const response = await apiClient.put<FacultyDetailResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Soft-delete a faculty member
   */
  async deleteFaculty(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Restore a soft-deleted faculty member
   */
  async restoreFaculty(id: string): Promise<FacultyDetailResponse> {
    const response = await apiClient.patch<FacultyDetailResponse>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};