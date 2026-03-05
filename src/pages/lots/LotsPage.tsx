import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Loader2, Search, Layers } from 'lucide-react';
import { lotService } from '../../services/lot.service';
import { developmentService } from '../../services/development.service';
import { LotModal } from './LotModal';
import { BulkCreateLotsModal } from './BulkCreateLotsModal';
import type { Lot } from '../../types/lot.types';
import {
  LotStatus,
  LotStatusLabels,
  LotStatusColors,
} from '../../types/lot.types';

export const LotsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [statusModalLot, setStatusModalLot] = useState<Lot | null>(null);
  const [newStatus, setNewStatus] = useState<LotStatus>(LotStatus.Available);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    developmentId?: string;
    status?: LotStatus;
    model?: string;
  }>({});

  // Fetch lots
  const { data: lotsData, isLoading } = useQuery({
    queryKey: ['lots', currentPage, searchTerm, filters],
    queryFn: () =>
      lotService.getAll({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchTerm || undefined,
        developmentId: filters.developmentId || undefined,
        status: filters.status,
        model: filters.model || undefined,
      }),
  });

  // Fetch summary
  const { data: summaryData } = useQuery({
    queryKey: ['lotsSummary', filters.developmentId],
    queryFn: () => lotService.getSummary(filters.developmentId || undefined),
  });

  // Fetch developments for filter
  const { data: developmentsData } = useQuery({
    queryKey: ['developments'],
    queryFn: () => developmentService.getAll({ pageNumber: 1, pageSize: 100 }),
  });

  const developments = developmentsData?.items || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: lotService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['lotsSummary'] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LotStatus }) =>
      lotService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['lotsSummary'] });
      setStatusModalLot(null);
    },
  });

  // Aggregate summary across all developments
  const totals = (summaryData || []).reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      available: acc.available + s.available,
      reserved: acc.reserved + s.reserved,
      inProcess: acc.inProcess + s.inProcess,
      sold: acc.sold + s.sold,
      notAvailable: acc.notAvailable + s.notAvailable,
    }),
    { total: 0, available: 0, reserved: 0, inProcess: 0, sold: 0, notAvailable: 0 },
  );

  // Handlers
  const handleCreate = () => {
    setSelectedLot(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (lot: Lot) => {
    setSelectedLot(lot);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (lot: Lot) => {
    setSelectedLot(lot);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (lot: Lot) => {
    if (window.confirm(`¿Eliminar el lote ${lot.lotNumber}? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(lot.id);
    }
  };

  const handleOpenStatusModal = (lot: Lot) => {
    setStatusModalLot(lot);
    setNewStatus(lot.status);
  };

  const handleStatusSubmit = () => {
    if (!statusModalLot) return;
    updateStatusMutation.mutate({ id: statusModalLot.id, status: newStatus });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLot(null);
    setIsViewMode(false);
  };

  // Get unique models from current lots for filter
  const models = [...new Set((lotsData?.items || []).map((l) => l.model).filter(Boolean))] as string[];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const lots = lotsData?.items || [];
  const totalPages = lotsData?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lotes</h1>
          <p className="text-gray-500 mt-1">Gestiona los lotes de los desarrollos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkModalOpen(true)}>
            <Layers className="w-4 h-4 mr-2" />
            Crear Masivamente
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Lote
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{totals.total}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-green-600">Disponibles</p>
            <p className="text-2xl font-bold text-green-700">{totals.available}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-yellow-600">Apartados</p>
            <p className="text-2xl font-bold text-yellow-700">{totals.reserved}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-orange-600">En Proceso</p>
            <p className="text-2xl font-bold text-orange-700">{totals.inProcess}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-red-600">Vendidos</p>
            <p className="text-2xl font-bold text-red-700">{totals.sold}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de lote..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Development */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.developmentId || ''}
              onChange={(e) => {
                setFilters({ ...filters, developmentId: e.target.value || undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los desarrollos</option>
              {developments.map((dev: { id: string; name: string }) => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>

            {/* Status */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.status ?? ''}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value ? Number(e.target.value) as LotStatus : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              {Object.entries(LotStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Model */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.model || ''}
              onChange={(e) => {
                setFilters({ ...filters, model: e.target.value || undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los modelos</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
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
          ) : lots.length === 0 ? (
            <div className="text-center py-12">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manzana</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desarrollo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lot.lotNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lot.block || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lot.street || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lot.model || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {lot.lotSize ? `${lot.lotSize} m²` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(lot.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            LotStatusColors[lot.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {LotStatusLabels[lot.status] || lot.statusName || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lot.developmentName || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleView(lot)}
                            className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => handleEdit(lot)}
                            className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(lot)}
                            className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDelete(lot)}
                            className="px-3 py-1 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Eliminar
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

      {/* Lot Modal */}
      <LotModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lot={selectedLot}
        readOnly={isViewMode}
      />

      {/* Bulk Create Modal */}
      <BulkCreateLotsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      {/* Change Status Modal */}
      {statusModalLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setStatusModalLot(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Cambiar Estado — Lote {statusModalLot.lotNumber}
                </h3>
              </div>
              <div className="px-6 py-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value) as LotStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(LotStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setStatusModalLot(null)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleStatusSubmit}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Cambiar Estado'
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
