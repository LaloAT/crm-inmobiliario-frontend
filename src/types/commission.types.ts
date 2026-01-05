export interface Commission {
  id: number;
  dealId: number;
  userId: number;
  amount: number;
  currency: string;
  percentage?: number;
  status: CommissionStatus;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface CreateCommissionRequest {
  dealId: number;
  userId: number;
  amount: number;
  currency: string;
  percentage?: number;
  status?: CommissionStatus;
  notes?: string;
}

export interface UpdateCommissionRequest extends Partial<CreateCommissionRequest> {}
