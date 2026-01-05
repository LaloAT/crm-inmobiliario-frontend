// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum ContractType {
  CompraVenta = 1,
  Arrendamiento = 2,
  Promesa = 3,
  Exclusiva = 4,
  Consignacion = 5,
  Intermediacion = 6,
  Otro = 7,
}

export enum ContractStatus {
  Borrador = 1,
  EnRevision = 2,
  Firmado = 3,
  Vigente = 4,
  Vencido = 5,
  Cancelado = 6,
}

// ===========================
// INTERFACES
// ===========================

export interface Contract {
  id: string;
  organizationId: string;
  contractNumber: string;
  type: ContractType;
  status: ContractStatus;
  // Relations
  propertyId?: string;
  leadId?: string;
  dealId?: string;
  property?: {
    id: string;
    title: string;
    price: number;
  };
  lead?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientIdentification?: string;
  clientAddress?: string;
  clientCity?: string;
  clientState?: string;
  clientZipCode?: string;
  // Owner/Seller info
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerIdentification?: string;
  ownerAddress?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerZipCode?: string;
  // Contract details
  startDate: string;
  endDate?: string;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  downPayment?: number;
  monthlyPayment?: number;
  totalPayments?: number;
  // Terms and conditions
  terms?: string;
  specialConditions?: string;
  attachedDocuments?: string[];
  // Signatures
  signedAt?: string;
  signedByClient?: boolean;
  signedByOwner?: boolean;
  // PDF
  pdfUrl?: string;
  pdfGeneratedAt?: string;
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractDto {
  organizationId: string;
  contractNumber?: string; // Auto-generated if not provided
  type: ContractType;
  status: ContractStatus;
  // Relations
  propertyId?: string;
  leadId?: string;
  dealId?: string;
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientIdentification?: string;
  clientAddress?: string;
  clientCity?: string;
  clientState?: string;
  clientZipCode?: string;
  // Owner
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerIdentification?: string;
  ownerAddress?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerZipCode?: string;
  // Details
  startDate: string;
  endDate?: string;
  totalAmount: number;
  currency?: string;
  paymentMethod?: string;
  downPayment?: number;
  monthlyPayment?: number;
  totalPayments?: number;
  // Terms
  terms?: string;
  specialConditions?: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface ContractFilters {
  pageNumber?: number;
  pageSize?: number;
  type?: ContractType;
  status?: ContractStatus;
  propertyId?: string;
  leadId?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface ContractPaginatedResponse {
  items: Contract[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const ContractTypeLabels: Record<ContractType, string> = {
  [ContractType.CompraVenta]: 'Compra-Venta',
  [ContractType.Arrendamiento]: 'Arrendamiento',
  [ContractType.Promesa]: 'Promesa',
  [ContractType.Exclusiva]: 'Exclusiva',
  [ContractType.Consignacion]: 'Consignación',
  [ContractType.Intermediacion]: 'Intermediación',
  [ContractType.Otro]: 'Otro',
};

export const ContractStatusLabels: Record<ContractStatus, string> = {
  [ContractStatus.Borrador]: 'Borrador',
  [ContractStatus.EnRevision]: 'En Revisión',
  [ContractStatus.Firmado]: 'Firmado',
  [ContractStatus.Vigente]: 'Vigente',
  [ContractStatus.Vencido]: 'Vencido',
  [ContractStatus.Cancelado]: 'Cancelado',
};

export const ContractStatusColors: Record<ContractStatus, string> = {
  [ContractStatus.Borrador]: 'bg-gray-100 text-gray-800',
  [ContractStatus.EnRevision]: 'bg-yellow-100 text-yellow-800',
  [ContractStatus.Firmado]: 'bg-blue-100 text-blue-800',
  [ContractStatus.Vigente]: 'bg-green-100 text-green-800',
  [ContractStatus.Vencido]: 'bg-red-100 text-red-800',
  [ContractStatus.Cancelado]: 'bg-red-100 text-red-800',
};
