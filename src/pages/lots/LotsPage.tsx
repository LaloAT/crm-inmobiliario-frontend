import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, MapPin, Maximize2 } from 'lucide-react';
import { lotService } from '../../services/lot.service';
import { developmentService } from '../../services/development.service';
import { LotModal } from './LotModal';
import type { Lot } from '../../types/lot.types';

export const LotsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    developmentId: '',
    status: '',
  });

  // Fetch lots
  const { data: lotsData, isLoading } = useQuery({
    queryKey: ['lots', currentPage, filters],
    queryFn: () =>
      lotService.getAll({
        page: currentPage,
        limit: 15,
        developmentId: filters.developmentId || undefined,
        status: filters.status || undefined,
      }),
  });

  // Fetch developments for filter
  const { data: developmentsData } = useQuery({
    queryKey: ['developments'],
    queryFn: () => developmentService.getAll({ limit: 100 }),
  });

  const developments = developmentsData?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: lotService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      setDeleteConfirm(null);
    },
  });

  // Handlers
  const handleCreate = () => {
    setSelectedLot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lot: Lot) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteMutation.mutate(id);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLot(null);
  };

  // Helper functions
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Reservado',
      SOLD: 'Vendido',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800',
      RESERVED: 'bg-yellow-100 text-yellow-800',
      SOLD: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const lots = lotsData?.data || [];
  const totalPages = Math.ceil((lotsData?.total || 0) / (lotsData?.limit || 15));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lotes</h1>
          <p className="text-gray-500 mt-1">
            Gestiona los lotes de los desarrollos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Lote
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.developmentId}
              onChange={(e) => {
                setFilters({ ...filters, developmentId: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los desarrollos</option>
              {developments.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
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
          ) : lots.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay lotes disponibles</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear el primer lote
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desarrollo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Lote {lot.lotNumber}
                            </div>
                            {lot.block && (
                              <div className="text-xs text-gray-500">
                                Manzana {lot.block}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {lot.development?.name || 'N/A'}
                        </div>
                        {lot.location && (
                          <div className="text-xs text-gray-500">{lot.location}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Maximize2 className="w-4 h-4 mr-1 text-gray-400" />
                          {lot.area} m²
                        </div>
                        {lot.dimensions && (
                          <div className="text-xs text-gray-500">{lot.dimensions}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(lot.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(lot.price / lot.area)}/m²
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            lot.status
                          )}`}
                        >
                          {getStatusLabel(lot.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(lot)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lot.id)}
                            className={`${
                              deleteConfirm === lot.id
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-gray-400 hover:text-red-600'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
      <LotModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lot={selectedLot}
      />
    </div>
  );
};
