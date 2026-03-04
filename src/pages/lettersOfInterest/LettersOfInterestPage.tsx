import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Send, CheckCircle, XCircle, ArrowRightCircle, Eye, Loader2, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
    mutationFn: letterOfInterestService.sign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] }),
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
    setIsModalOpen(true);
  };

  const handleEdit = (letter: LetterOfInterestDto) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLetter(null);
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
                        <div className="flex justify-end gap-2">
                          {/* Draft actions: Edit, Send, Cancel */}
                          {letter.status === LetterOfInterestStatus.Draft && (
                            <>
                              <button
                                onClick={() => handleEdit(letter)}
                                className="text-primary-600 hover:text-primary-900"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => sendMutation.mutate(letter.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Enviar"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => cancelMutation.mutate(letter.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Sent actions: Sign, Cancel */}
                          {letter.status === LetterOfInterestStatus.Sent && (
                            <>
                              <button
                                onClick={() => signMutation.mutate(letter.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Firmar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => cancelMutation.mutate(letter.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Signed actions: Convert to Deal or View Deal */}
                          {letter.status === LetterOfInterestStatus.Signed && (
                            <>
                              {letter.dealId ? (
                                <button
                                  onClick={() => navigate(`/deals/${letter.dealId}`)}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="Ver Deal"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => convertMutation.mutate(letter.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Convertir a Deal"
                                >
                                  <ArrowRightCircle className="w-4 h-4" />
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
      />
    </div>
  );
};
