export interface Development {
  id: number;
  name: string;
  description?: string;
  location: string;
  totalLots: number;
  availableLots: number;
  startDate?: string;
  endDate?: string;
  status: DevelopmentStatus;
  organizationId: number;
  lots: Lot[];
  createdAt: string;
  updatedAt: string;
}

export enum DevelopmentStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Lot {
  id: number;
  lotNumber: string;
  area: number;
  price: number;
  status: LotStatus;
  developmentId: number;
  development?: Development;
  createdAt: string;
  updatedAt: string;
}

export enum LotStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD'
}

export interface CreateDevelopmentRequest {
  name: string;
  description?: string;
  location: string;
  totalLots: number;
  startDate?: string;
  endDate?: string;
  status: DevelopmentStatus;
}

export interface UpdateDevelopmentRequest extends Partial<CreateDevelopmentRequest> {}
