import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, DollarSign, CheckCircle } from 'lucide-react';
import { commissionService } from '../../services/commission.service';
import { CommissionModal } from './CommissionModal';
import type { Commission } from '../../types/commission.types';

export const CommissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: commissionsData, isLoading } = useQuery({
    queryKey: ['commissions', currentPage, statusFilter],
    queryFn: () =>
      commissionService.getAll({
        pageNumber: currentPage,
        pageSize: 15,
        status: statusFilter || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: commissionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      setDeleteConfirm(null);
    },
  });

  const handleCreate = () => {
    setSelectedCommission(null);
    setIsModalOpen(true);
  };

  const handleEdit = (commission: Commission) => {
    setSelectedCommission(commission);
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      PAID: 'Pagada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const commissions = commissionsData?.items || [];
  const totalPages = commissionsData?.totalPages || 1;

  // Calculate summary stats
  const stats = {
    total: commissions.reduce((sum, c) => sum + c.amount, 0),
    pending: commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0),
    paid: commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comisiones</h1>
          <p className="text-gray-500 mt-1">Gestiona las comisiones de los agentes</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Comisión
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Comisiones</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardBody>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="APPROVED">Aprobada</option>
            <option value="PAID">Pagada</option>
          </select>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay comisiones disponibles</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear la primera comisión
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {commission.user?.fullName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{commission.deal?.title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(commission.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{commission.percentage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                          {getStatusLabel(commission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(commission.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(commission)} className="text-primary-600 hover:text-primary-900">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(commission.id)}
                            className={deleteConfirm === commission.id ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-700">Página {currentPage} de {totalPages}</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <CommissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} commission={selectedCommission} />
    </div>
  );
};
