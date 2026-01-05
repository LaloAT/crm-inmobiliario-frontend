import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, Search, Grid, List, Home, Bed, Bath, Car, MapPin } from 'lucide-react';
import { propertyService } from '../../services/property.service';
import { PropertyModal } from './PropertyModal';
import type { Property } from '../../types/property.types';
import {
  PropertyType,
  PropertyStatus,
  PropertyTypeLabels,
  PropertyStatusLabels,
  OperationType,
  OperationTypeLabels
} from '../../types/property.types';

export const PropertiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState<{
    type?: PropertyType;
    operation?: OperationType;
    status?: PropertyStatus;
  }>({});

  // Fetch properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', currentPage, searchTerm, filters],
    queryFn: () =>
      propertyService.getAll({
        pageNumber: currentPage,
        pageSize: 12,
        search: searchTerm || undefined,
        type: filters.type,
        operation: filters.operation,
        status: filters.status,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: propertyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeleteConfirm(null);
    },
  });

  // Handlers
  const handleCreate = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
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
    setSelectedProperty(null);
  };

  // Helper functions
  const getStatusColor = (status: PropertyStatus) => {
    const colors: Record<PropertyStatus, string> = {
      [PropertyStatus.Disponible]: 'bg-green-100 text-green-800',
      [PropertyStatus.Apartado]: 'bg-yellow-100 text-yellow-800',
      [PropertyStatus.Vendido]: 'bg-red-100 text-red-800',
      [PropertyStatus.Rentado]: 'bg-blue-100 text-blue-800',
      [PropertyStatus.NoDisponible]: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAddressDisplay = (property: Property) => {
    const parts = [
      property.addressStreet,
      property.addressNumber,
      property.addressColony,
      property.addressCity
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Sin dirección';
  };

  const properties = propertiesData?.items || [];
  const totalPages = propertiesData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-500 mt-1">
            Gestiona el inventario de propiedades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode('grid')}>
            <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-primary-600' : ''}`} />
          </Button>
          <Button variant="outline" onClick={() => setViewMode('table')}>
            <List className={`w-4 h-4 ${viewMode === 'table' ? 'text-primary-600' : ''}`} />
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Propiedad
          </Button>
        </div>
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
                placeholder="Buscar propiedades..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Property Type */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.type || ''}
              onChange={(e) => {
                setFilters({ ...filters, type: e.target.value ? Number(e.target.value) as PropertyType : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los tipos</option>
              {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Operation Type */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.operation || ''}
              onChange={(e) => {
                setFilters({ ...filters, operation: e.target.value ? Number(e.target.value) as OperationType : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todas las operaciones</option>
              {Object.entries(OperationTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Status */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.status || ''}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value ? Number(e.target.value) as PropertyStatus : undefined });
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              {Object.entries(PropertyStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay propiedades disponibles</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear la primera propiedad
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : viewMode === 'grid' ? (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Home className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        property.status
                      )}`}
                    >
                      {PropertyStatusLabels[property.status]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardBody>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {getAddressDisplay(property)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                        {PropertyTypeLabels[property.type]}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {OperationTypeLabels[property.operation]}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {property.bedrooms !== undefined && property.bedrooms > 0 && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms !== undefined && property.bathrooms > 0 && (
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {property.bathrooms}
                        </div>
                      )}
                      {property.parkingSpaces !== undefined && property.parkingSpaces > 0 && (
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-1" />
                          {property.parkingSpaces}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(property.price)}
                      </p>
                      {property.totalArea && (
                        <p className="text-sm text-gray-500">
                          {property.totalArea} m² • {formatPrice(property.price / property.totalArea)}/m²
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(property)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant={deleteConfirm === property.id ? 'danger' : 'outline'}
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Table View */}
          <Card>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propiedad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
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
                    {properties.map((property: Property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded">
                              {property.images && property.images.length > 0 ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Home className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {property.title}
                              </div>
                              <div className="text-sm text-gray-500">{getAddressDisplay(property)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {PropertyTypeLabels[property.type]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {OperationTypeLabels[property.operation]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(property.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{property.totalArea || '-'} m²</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              property.status
                            )}`}
                          >
                            {PropertyStatusLabels[property.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(property)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className={`${
                                deleteConfirm === property.id
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
            </CardBody>
          </Card>
        </>
      )}

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

      {/* Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        property={selectedProperty}
      />
    </div>
  );
};
