export interface User {
  id: number;
  email: string;
  name: string;
  doc: string;
  phone: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
  error?: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  doc: string;
  phone: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}