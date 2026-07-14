export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    admin: Admin;
    accessToken: string;
    token?: string; // Optional fallback
  };
}

export interface MeResponse {
  status: string;
  message: string;
  data: Admin;
}

export interface StandardSuccess {
  status: string;
  message: string;
}
