export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: number;
}

// Estructura real que retorna el backend
export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  role: number;
  organizationId: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;  // El backend usa UUIDs
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: number;
  organizationId: string;
  organization?: Organization;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
  USER = 'USER'
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
