// ===========================
// ENUMS
// ===========================

export enum DealDocumentStatus {
  Pending = 1,
  Uploaded = 2,
  Verified = 3,
  Rejected = 4,
  NotApplicable = 5,
}

// ===========================
// INTERFACES
// ===========================

export interface DealDocument {
  id: string;
  templateName: string;
  category: number;
  categoryName: string;
  isRequired: boolean;
  sortOrder: number;
  status: DealDocumentStatus;
  statusName: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  notes?: string | null;
  uploadedAt?: string | null;
  verifiedAt?: string | null;
  rejectedAt?: string | null;
}

export interface DealDocumentGroup {
  category: number;
  categoryName: string;
  documents: DealDocument[];
}

export interface DealDocumentsResponse {
  total: number;
  completed: number;
  pending: number;
  uploaded: number;
  rejected: number;
  groups: DealDocumentGroup[];
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const DealDocumentStatusLabels: Record<DealDocumentStatus, string> = {
  [DealDocumentStatus.Pending]: 'Pendiente',
  [DealDocumentStatus.Uploaded]: 'Subido',
  [DealDocumentStatus.Verified]: 'Verificado',
  [DealDocumentStatus.Rejected]: 'Rechazado',
  [DealDocumentStatus.NotApplicable]: 'No Aplica',
};

export const DealDocumentStatusColors: Record<DealDocumentStatus, string> = {
  [DealDocumentStatus.Pending]: 'bg-gray-100 text-gray-700',
  [DealDocumentStatus.Uploaded]: 'bg-blue-100 text-blue-800',
  [DealDocumentStatus.Verified]: 'bg-green-100 text-green-800',
  [DealDocumentStatus.Rejected]: 'bg-red-100 text-red-800',
  [DealDocumentStatus.NotApplicable]: 'bg-gray-100 text-gray-500',
};

export const DocumentCategoryLabels: Record<string, string> = {
  Buyer: 'Comprador',
  Seller: 'Vendedor',
  Rental: 'Arrendatario',
  Financing: 'Financiamiento',
  General: 'General',
};
