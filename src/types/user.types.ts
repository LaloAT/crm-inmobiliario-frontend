// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export const enum UserRole {
  SystemAdmin = 1,
  OrganizationAdmin = 2,
  Director = 3,
  Manager = 4,
  Supervisor = 5,
  Agent = 6,
  Assistant = 7,
}

export const enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
}

// ===========================
// INTERFACES
// ===========================

export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  status?: UserStatus;
  // Organization
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
  // Hierarchy
  supervisorId?: string;
  supervisor?: {
    id: string;
    fullName: string;
    email: string;
  };
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  organizationId: string;
  supervisorId?: string;
  status?: UserStatus;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  password?: string;
}

// ===========================
// SUBORDINATES
// ===========================

export interface Subordinate {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  status?: UserStatus;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface UserFilters {
  pageNumber?: number;
  pageSize?: number;
  role?: UserRole;
  status?: UserStatus;
  organizationId?: string;
  supervisorId?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface UserPaginatedResponse {
  items: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.SystemAdmin]: 'Administrador del Sistema',
  [UserRole.OrganizationAdmin]: 'Administrador de Organización',
  [UserRole.Director]: 'Director',
  [UserRole.Manager]: 'Gerente',
  [UserRole.Supervisor]: 'Supervisor',
  [UserRole.Agent]: 'Agente',
  [UserRole.Assistant]: 'Asistente',
};

export const UserRoleShortLabels: Record<UserRole, string> = {
  [UserRole.SystemAdmin]: 'Sys Admin',
  [UserRole.OrganizationAdmin]: 'Org Admin',
  [UserRole.Director]: 'Director',
  [UserRole.Manager]: 'Gerente',
  [UserRole.Supervisor]: 'Supervisor',
  [UserRole.Agent]: 'Agente',
  [UserRole.Assistant]: 'Asistente',
};

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Activo',
  [UserStatus.Inactive]: 'Inactivo',
  [UserStatus.Suspended]: 'Suspendido',
};

export const UserStatusColors: Record<UserStatus, string> = {
  [UserStatus.Active]: 'bg-green-100 text-green-800',
  [UserStatus.Inactive]: 'bg-gray-100 text-gray-800',
  [UserStatus.Suspended]: 'bg-red-100 text-red-800',
};
