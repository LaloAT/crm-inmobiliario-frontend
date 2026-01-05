export interface Contract {
  id: number;
  contractNumber: string;
  type: ContractType;
  status: ContractStatus;
  dealId?: number;
  propertyId?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  startDate: string;
  endDate?: string;
  value: number;
  currency: string;
  terms?: string;
  signedAt?: string;
  organizationId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export enum ContractType {
  SALE = 'SALE',
  LEASE = 'LEASE',
  RESERVATION = 'RESERVATION',
  OTHER = 'OTHER'
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CreateContractRequest {
  contractNumber: string;
  type: ContractType;
  status: ContractStatus;
  dealId?: number;
  propertyId?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  startDate: string;
  endDate?: string;
  value: number;
  currency: string;
  terms?: string;
}

export interface UpdateContractRequest extends Partial<CreateContractRequest> {}
