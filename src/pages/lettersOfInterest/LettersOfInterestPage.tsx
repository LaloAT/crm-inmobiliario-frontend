import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Loader2, Search, Download, FileCheck, X } from 'lucide-react';
import { letterOfInterestService } from '../../services/letterOfInterest.service';
import { LetterOfInterestModal } from './LetterOfInterestModal';
import type { LetterOfInterestDto } from '../../types/letterOfInterest.types';
import {
  LetterOfInterestStatus,
  LetterOfInterestType,
  LetterOfInterestStatusLabels,
  LetterOfInterestStatusColors,
  LetterOfInterestTypeLabels,
} from '../../types/letterOfInterest.types';

export const LettersOfInterestPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterOfInterestDto | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [signModalId, setSignModalId] = useState<string | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const signFileInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<{
    status?: LetterOfInterestStatus;
    type?: LetterOfInterestType;
  }>({});

  // Fetch letters
  const { data: lettersData, isLoading } = useQuery({
    queryKey: ['lettersOfInterest', currentPage, searchTerm, filters],
    queryFn: () =>
      letterOfInterestService.getAll({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchTerm || undefined,
        status: filters.status,
        type: filters.type,
      }),
  });

  // Action mutations
  const sendMutation = useMutation({
    mutationFn: letterOfInterestService.send,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] }),
  });

  const signMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file?: File }) =>
      letterOfInterestService.sign(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] });
      setSignModalId(null);
      setSignFile(null);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: letterOfInterestService.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] }),
  });

  const convertMutation = useMutation({
    mutationFn: letterOfInterestService.convertToDeal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] });
      navigate(`/deals/${data.dealId}`);
    },
  });

  // Handlers
  const handleCreate = () => {
    setSelectedLetter(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (letter: LetterOfInterestDto) => {
    setSelectedLetter(letter);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (letter: LetterOfInterestDto) => {
    setSelectedLetter(letter);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleSend = (id: string) => {
    if (window.confirm('¿Enviar esta carta de interés? Ya no podrá ser editada.')) {
      sendMutation.mutate(id);
    }
  };

  const handleOpenSignModal = (id: string) => {
    setSignModalId(id);
    setSignFile(null);
  };

  const handleSignSubmit = (withFile: boolean) => {
    if (!signModalId) return;
    signMutation.mutate({ id: signModalId, file: withFile && signFile ? signFile : undefined });
  };

  const handleCloseSignModal = () => {
    setSignModalId(null);
    setSignFile(null);
  };

  const handleViewSignedDocument = async (id: string) => {
    setViewingDocId(id);
    try {
      const { url } = await letterOfInterestService.getSignedDocument(id);
      window.open(url, '_blank');
    } catch {
      // error already logged in service
    } finally {
      setViewingDocId(null);
    }
  };

  const handleCancel = (id: string) => {
    if (window.confirm('¿Cancelar esta carta de interés? Esta acción no se puede deshacer.')) {
      cancelMutation.mutate(id);
    }
  };

  const handleConvert = (id: string) => {
    if (window.confirm('¿Convertir esta carta en un Deal/Oportunidad?')) {
      convertMutation.mutate(id);
    }
  };

  const handleDownloadPdf = async (letter: LetterOfInterestDto) => {
    setDownloadingId(letter.id);
    try {
      await letterOfInterestService.downloadPdf(letter.id, `carta-${letter.prospectName}.pdf`);
    } catch {
      // error already logged in service
    } finally {
      setDownloadingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLetter(null);
    setIsViewMode(false);
  };

  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-MX');
  };

  const letters = lettersData?.items || [];
  const totalPages = lettersData?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cartas de Interés</h1>
          <p className="text-gray-500 mt-1">
            Gestiona las cartas de interés de tus prospectos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Carta de Interés
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por prospecto o propiedad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Status */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.status || ''}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value ? Number(e.target.value) as LetterOfInterestStatus : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              {Object.entries(LetterOfInterestStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Type */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.type || ''}
              onChange={(e) => {
                setFilters({ ...filters, type: e.target.value ? Number(e.target.value) as LetterOfInterestType : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los tipos</option>
              {Object.entries(LetterOfInterestTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : letters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay cartas de interés disponibles</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear la primera carta
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prospecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Ofrecido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Válida hasta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creada por
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {letters.map((letter) => (
                    <tr key={letter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {letter.prospectName}
                        </div>
                        {letter.prospectEmail && (
                          <div className="text-sm text-gray-500">{letter.prospectEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {letter.propertyTitle || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {LetterOfInterestTypeLabels[letter.type] || letter.typeName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(letter.offeredPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            LetterOfInterestStatusColors[letter.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {LetterOfInterestStatusLabels[letter.status] || letter.statusName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(letter.validUntil)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {letter.createdByUserName || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          {/* Ver - always available */}
                          <button
                            onClick={() => handleView(letter)}
                            className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            Ver
                          </button>

                          {/* PDF - always available */}
                          <button
                            onClick={() => handleDownloadPdf(letter)}
                            disabled={downloadingId === letter.id}
                            className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {downloadingId === letter.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            PDF
                          </button>

                          {/* Draft actions */}
                          {letter.status === LetterOfInterestStatus.Draft && (
                            <>
                              <button
                                onClick={() => handleEdit(letter)}
                                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleSend(letter.id)}
                                className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Enviar
                              </button>
                              <button
                                onClick={() => handleCancel(letter.id)}
                                className="px-3 py-1 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {/* Sent actions */}
                          {letter.status === LetterOfInterestStatus.Sent && (
                            <>
                              <button
                                onClick={() => handleOpenSignModal(letter.id)}
                                className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                              >
                                Firmar
                              </button>
                              <button
                                onClick={() => handleCancel(letter.id)}
                                className="px-3 py-1 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {/* Signed actions */}
                          {letter.status === LetterOfInterestStatus.Signed && (
                            <>
                              {letter.signedDocumentFileName && (
                                <button
                                  onClick={() => handleViewSignedDocument(letter.id)}
                                  disabled={viewingDocId === letter.id}
                                  className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 inline-flex items-center gap-1"
                                >
                                  {viewingDocId === letter.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <FileCheck className="w-3.5 h-3.5" />
                                  )}
                                  Ver Documento
                                </button>
                              )}
                              {letter.dealId ? (
                                <button
                                  onClick={() => navigate(`/deals/${letter.dealId}`)}
                                  className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                                >
                                  Ver Deal
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleConvert(letter.id)}
                                  className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  Convertir a Deal
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal */}
      <LetterOfInterestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        letter={selectedLetter}
        readOnly={isViewMode}
      />

      {/* Sign Modal */}
      {signModalId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseSignModal}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Firmar Carta de Interés
                </h3>
                <button
                  onClick={handleCloseSignModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Sube el documento firmado (opcional)
                </p>
                <input
                  ref={signFileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSignFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {signFile && (
                  <p className="text-xs text-gray-500">
                    Archivo seleccionado: {signFile.name}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseSignModal}
                  disabled={signMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSignSubmit(false)}
                  disabled={signMutation.isPending}
                >
                  {signMutation.isPending && !signFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Firmando...
                    </>
                  ) : (
                    'Firmar sin documento'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSignSubmit(true)}
                  disabled={!signFile || signMutation.isPending}
                >
                  {signMutation.isPending && signFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    'Firmar y subir documento'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
