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

// Contract types
export * from './contract.types';

// Commission types
export * from './commission.types';

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
