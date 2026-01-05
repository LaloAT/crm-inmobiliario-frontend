// Auth types
export * from './auth.types';

// Property types
export * from './property.types';

// Lead types
export * from './lead.types';

// Deal types
export * from './deal.types';

// Development types
export * from './development.types';

// Lot types
export * from './lot.types';

// Contract types
export * from './contract.types';

// Commission types
export * from './commission.types';

// User types - Comentado para evitar conflicto con auth.types
// export * from './user.types';

// Organization types - Comentado para evitar conflicto con auth.types
// export * from './organization.types';

// Dashboard types
export * from './dashboard.types';

// Report types - Comentado para evitar conflicto con dashboard.types
// export * from './report.types';

// Shift types
export * from './shift.types';

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
