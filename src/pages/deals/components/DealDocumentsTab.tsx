import React, { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  FileText,
  FolderOpen,
  Loader2,
  MinusCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui';
import { dealDocumentService } from '../../../services/dealDocument.service';
import {
  DealDocumentStatus,
  DealDocumentStatusLabels,
  DealDocumentStatusColors,
  DocumentCategoryLabels,
} from '../../../types/dealDocument.types';
import type { DealDocument } from '../../../types/dealDocument.types';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/user.types';

interface DealDocumentsTabProps {
  dealId: string;
}

export const DealDocumentsTab: React.FC<DealDocumentsTabProps> = ({ dealId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const canVerify = user && (user as any).role <= UserRole.Supervisor;

  const { data, isLoading } = useQuery({
    queryKey: ['deal-documents', dealId],
    queryFn: () => dealDocumentService.getDocuments(dealId),
  });

  const generateMutation = useMutation({
    mutationFn: () => dealDocumentService.generateChecklist(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ documentId, file }: { documentId: string; file: File }) =>
      dealDocumentService.uploadDocument(dealId, documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (documentId: string) =>
      dealDocumentService.verifyDocument(dealId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ documentId, notes }: { documentId: string; notes: string }) =>
      dealDocumentService.rejectDocument(dealId, documentId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
      setRejectingId(null);
      setRejectNotes('');
    },
  });

  const notApplicableMutation = useMutation({
    mutationFn: (documentId: string) =>
      dealDocumentService.markNotApplicable(dealId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (documentId: string) =>
      dealDocumentService.deleteFile(dealId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId] });
    },
  });

  const documents = data?.documents || [];

  const { completedCount, totalCount, progressPercent, groupedDocs } = useMemo(() => {
    const completed = documents.filter(
      (d) =>
        d.status === DealDocumentStatus.Verified ||
        d.status === DealDocumentStatus.NotApplicable
    ).length;
    const total = documents.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const grouped: Record<string, DealDocument[]> = {};
    documents.forEach((doc) => {
      const cat = doc.templateCategory || 'General';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(doc);
    });

    return { completedCount: completed, totalCount: total, progressPercent: percent, groupedDocs: grouped };
  }, [documents]);

  const handleFileSelect = (documentId: string, file: File) => {
    setUploadingIds((prev) => new Set(prev).add(documentId));
    uploadMutation.mutate(
      { documentId, file },
      {
        onSettled: () => {
          setUploadingIds((prev) => {
            const next = new Set(prev);
            next.delete(documentId);
            return next;
          });
        },
      }
    );
  };

  const handleRejectConfirm = (documentId: string) => {
    if (!rejectNotes.trim()) return;
    rejectMutation.mutate({ documentId, notes: rejectNotes });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin documentos</h3>
        <p className="text-gray-500 mb-6">
          Genera el checklist documental para este deal.
        </p>
        <Button
          onClick={() => generateMutation.mutate()}
          isLoading={generateMutation.isPending}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generar Checklist
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso documental</span>
          <span className="text-sm text-gray-500">
            {completedCount} de {totalCount} completados ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grouped documents */}
      {Object.entries(groupedDocs).map(([category, docs]) => {
        const catCompleted = docs.filter(
          (d) =>
            d.status === DealDocumentStatus.Verified ||
            d.status === DealDocumentStatus.NotApplicable
        ).length;

        return (
          <div key={category} className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700">
                {DocumentCategoryLabels[category] || category} ({catCompleted}/{docs.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  isUploading={uploadingIds.has(doc.id)}
                  isRejecting={rejectingId === doc.id}
                  rejectNotes={rejectingId === doc.id ? rejectNotes : ''}
                  canVerify={!!canVerify}
                  fileInputRef={(el) => {
                    fileInputRefs.current[doc.id] = el;
                  }}
                  onUploadClick={() => fileInputRefs.current[doc.id]?.click()}
                  onFileChange={(file) => handleFileSelect(doc.id, file)}
                  onVerify={() => verifyMutation.mutate(doc.id)}
                  onRejectStart={() => {
                    setRejectingId(doc.id);
                    setRejectNotes('');
                  }}
                  onRejectCancel={() => {
                    setRejectingId(null);
                    setRejectNotes('');
                  }}
                  onRejectNotesChange={setRejectNotes}
                  onRejectConfirm={() => handleRejectConfirm(doc.id)}
                  onNotApplicable={() => notApplicableMutation.mutate(doc.id)}
                  onDeleteFile={() => deleteFileMutation.mutate(doc.id)}
                  isVerifying={verifyMutation.isPending}
                  isRejectSubmitting={rejectMutation.isPending}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ===========================
// Document Row sub-component
// ===========================

interface DocumentRowProps {
  doc: DealDocument;
  isUploading: boolean;
  isRejecting: boolean;
  rejectNotes: string;
  canVerify: boolean;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onUploadClick: () => void;
  onFileChange: (file: File) => void;
  onVerify: () => void;
  onRejectStart: () => void;
  onRejectCancel: () => void;
  onRejectNotesChange: (notes: string) => void;
  onRejectConfirm: () => void;
  onNotApplicable: () => void;
  onDeleteFile: () => void;
  isVerifying: boolean;
  isRejectSubmitting: boolean;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  doc,
  isUploading,
  isRejecting,
  rejectNotes,
  canVerify,
  fileInputRef,
  onUploadClick,
  onFileChange,
  onVerify,
  onRejectStart,
  onRejectCancel,
  onRejectNotesChange,
  onRejectConfirm,
  onNotApplicable,
  onDeleteFile,
  isVerifying,
  isRejectSubmitting,
}) => {
  const statusColor = DealDocumentStatusColors[doc.status];
  const statusLabel = DealDocumentStatusLabels[doc.status];

  const hasFile = !!doc.fileUrl;
  const showDeleteFile =
    hasFile && doc.status !== DealDocumentStatus.Verified;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Name and status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {doc.templateName}
            </span>
            {!doc.isRequired && (
              <span className="text-xs text-gray-400">(Opcional)</span>
            )}
          </div>
          {doc.status === DealDocumentStatus.Rejected && doc.notes && (
            <p className="text-xs text-red-600 mt-1 ml-6">
              Motivo de rechazo: {doc.notes}
            </p>
          )}
        </div>

        {/* Badge */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}
        >
          {doc.status === DealDocumentStatus.Verified && (
            <CheckCircle className="w-3 h-3 mr-1" />
          )}
          {statusLabel}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
              e.target.value = '';
            }}
          />

          {isUploading && (
            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
          )}

          {/* Pending: Upload button */}
          {doc.status === DealDocumentStatus.Pending && !isUploading && (
            <>
              <button
                onClick={onUploadClick}
                className="px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Subir
              </button>
              {!doc.isRequired && (
                <button
                  onClick={onNotApplicable}
                  className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded transition-colors"
                >
                  <MinusCircle className="w-3.5 h-3.5 inline mr-1" />
                  N/A
                </button>
              )}
            </>
          )}

          {/* Uploaded: View + Verify/Reject (supervisor+) */}
          {doc.status === DealDocumentStatus.Uploaded && !isUploading && (
            <>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                Ver
              </a>
              {canVerify && (
                <>
                  <button
                    onClick={onVerify}
                    disabled={isVerifying}
                    className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                    Verificar
                  </button>
                  <button
                    onClick={onRejectStart}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 inline mr-1" />
                    Rechazar
                  </button>
                </>
              )}
            </>
          )}

          {/* Verified: View */}
          {doc.status === DealDocumentStatus.Verified && (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Ver
            </a>
          )}

          {/* Rejected: Re-upload */}
          {doc.status === DealDocumentStatus.Rejected && !isUploading && (
            <button
              onClick={onUploadClick}
              className="px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              Subir de nuevo
            </button>
          )}

          {/* Delete file (if has file and not verified) */}
          {showDeleteFile && !isUploading && (
            <button
              onClick={onDeleteFile}
              className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reject notes inline form */}
      {isRejecting && (
        <div className="mt-2 ml-6 flex items-center gap-2">
          <input
            type="text"
            value={rejectNotes}
            onChange={(e) => onRejectNotesChange(e.target.value)}
            placeholder="Motivo del rechazo..."
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
            autoFocus
          />
          <button
            onClick={onRejectConfirm}
            disabled={!rejectNotes.trim() || isRejectSubmitting}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Confirmar
          </button>
          <button
            onClick={onRejectCancel}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
