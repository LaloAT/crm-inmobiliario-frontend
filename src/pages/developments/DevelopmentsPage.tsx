import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, Building, MapPin, Calendar, Layers } from 'lucide-react';
import { developmentService } from '../../services/development.service';
import { DevelopmentModal } from './DevelopmentModal';
import type { Development } from '../../types/development.types';

export const DevelopmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch developments
  const { data: developmentsData, isLoading } = useQuery({
    queryKey: ['developments', currentPage, statusFilter],
    queryFn: () =>
      developmentService.getAll({
        page: currentPage,
        limit: 12,
        status: statusFilter || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: developmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      setDeleteConfirm(null);
    },
  });

  // Handlers
  const handleCreate = () => {
    setSelectedDevelopment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (development: Development) => {
    setSelectedDevelopment(development);
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
    setSelectedDevelopment(null);
  };

  // Helper functions
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PLANNING: 'En Planeación',
      CONSTRUCTION: 'En Construcción',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLANNING: 'bg-blue-100 text-blue-800',
      CONSTRUCTION: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
    });
  };

  const developments = developmentsData?.data || [];
  const totalPages = Math.ceil((developmentsData?.total || 0) / (developmentsData?.limit || 12));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desarrollos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona los proyectos inmobiliarios
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Desarrollo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="PLANNING">En Planeación</option>
              <option value="CONSTRUCTION">En Construcción</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : developments.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay desarrollos disponibles</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear el primer desarrollo
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developments.map((development) => (
              <Card key={development.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {development.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {development.location}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          development.status
                        )}`}
                      >
                        {getStatusLabel(development.status)}
                      </span>
                    </div>

                    {/* Description */}
                    {development.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {development.description}
                      </p>
                    )}

                    {/* Developer */}
                    {development.developer && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Desarrollador:</span> {development.developer}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Layers className="w-4 h-4 mr-1" />
                          Lotes
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {development.availableLots || 0} / {development.totalLots || 0}
                        </p>
                        <p className="text-xs text-gray-500">Disponibles</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Finalización
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(development.estimatedCompletionDate)}
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    {development.amenities && development.amenities.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Amenidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {development.amenities.slice(0, 3).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                          {development.amenities.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              +{development.amenities.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(development)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant={deleteConfirm === development.id ? 'danger' : 'outline'}
                        onClick={() => handleDelete(development.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardBody>
                <div className="flex justify-between items-center">
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
              </CardBody>
            </Card>
          )}
        </>
      )}

      {/* Modal */}
      <DevelopmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        development={selectedDevelopment}
      />
    </div>
  );
};
