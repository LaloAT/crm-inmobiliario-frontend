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
  dealId: string;
  documentTemplateId: string;
  templateName: string;
  templateCategory: string;
  status: DealDocumentStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  notes?: string;
  uploadedAt?: string;
  verifiedAt?: string;
  isRequired: boolean;
}

export interface DealDocumentsResponse {
  documents: DealDocument[];
  total: number;
  completed: number;
  pending: number;
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
  Rental: 'Renta',
  Financing: 'Financiamiento',
  General: 'General',
};
