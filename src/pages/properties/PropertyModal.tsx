import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { propertySchema, type PropertyFormData } from '../../schemas/property.schema';
import { propertyService } from '../../services/property.service';
import { useAuth } from '../../context/AuthContext';
import type { Property } from '../../types/property.types';
import {
  OperationType,
  PropertyType,
  PropertyStatus,
  PublishStatus,
  OperationTypeLabels,
  PropertyTypeLabels,
  PropertyStatusLabels,
  PublishStatusLabels
} from '../../types/property.types';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, property }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!property;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: PropertyStatus.Disponible,
      publishStatus: PublishStatus.Borrador,
      operation: OperationType.Venta,
      type: PropertyType.Casa,
      currency: 'MXN',
      isLienFree: false,
    },
  });

  // Reset form when property changes
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description || '',
        operation: property.operation,
        type: property.type,
        status: property.status,
        publishStatus: property.publishStatus,
        price: property.price,
        currency: property.currency || 'MXN',
        pricePerSquareMeter: property.pricePerSquareMeter,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        halfBathrooms: property.halfBathrooms,
        parkingSpaces: property.parkingSpaces,
        constructionArea: property.constructionArea,
        landArea: property.landArea,
        totalArea: property.totalArea,
        yearBuilt: property.yearBuilt,
        // Address fields
        addressStreet: property.addressStreet || '',
        addressNumber: property.addressNumber || '',
        addressInterior: property.addressInterior || '',
        addressColony: property.addressColony || '',
        addressCity: property.addressCity || '',
        addressState: property.addressState || '',
        addressZipCode: property.addressZipCode || '',
        latitude: property.latitude,
        longitude: property.longitude,
        // Legal
        isLienFree: property.isLienFree || false,
        legalNotes: property.legalNotes || '',
        // Owner
        ownerName: property.ownerName || '',
        ownerPhone: property.ownerPhone || '',
        ownerEmail: property.ownerEmail || '',
        // Media
        virtualTourUrl: property.virtualTourUrl || '',
        videoUrl: property.videoUrl || '',
        webContent: property.webContent || '',
        amenities: property.amenities || '',
        // Assignment
        assignedUserId: property.assignedUserId,
      });
    } else {
      reset({
        title: '',
        description: '',
        operation: OperationType.Venta,
        type: PropertyType.Casa,
        status: PropertyStatus.Disponible,
        publishStatus: PublishStatus.Borrador,
        price: 0,
        currency: 'MXN',
        isLienFree: false,
      });
    }
  }, [property, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: PropertyFormData) => {
      if (!user?.organizationId) {
        throw new Error('No organization ID found');
      }
      return propertyService.create({
        organizationId: user.organizationId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: PropertyFormData) => propertyService.update(property!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
      reset();
    },
  });

  const onSubmit: SubmitHandler<PropertyFormData> = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Propiedad' : 'Crear Propiedad'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Información Básica</h4>

                <Input
                  label="Título"
                  {...register('title')}
                  error={errors.title?.message}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Descripción detallada de la propiedad..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operación <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('operation', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {Object.entries(OperationTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.operation && (
                      <p className="mt-1 text-sm text-red-600">{errors.operation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Propiedad <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('type', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('status', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {Object.entries(PropertyStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Publicación <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('publishStatus', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {Object.entries(PublishStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.publishStatus && (
                      <p className="mt-1 text-sm text-red-600">{errors.publishStatus.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Areas */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Precio y Áreas</h4>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    error={errors.price?.message}
                    required
                  />

                  <Input
                    label="Moneda"
                    {...register('currency')}
                    error={errors.currency?.message}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Área de Construcción (m²)"
                    type="number"
                    step="0.01"
                    {...register('constructionArea', { valueAsNumber: true })}
                    error={errors.constructionArea?.message}
                  />

                  <Input
                    label="Área de Terreno (m²)"
                    type="number"
                    step="0.01"
                    {...register('landArea', { valueAsNumber: true })}
                    error={errors.landArea?.message}
                  />

                  <Input
                    label="Área Total (m²)"
                    type="number"
                    step="0.01"
                    {...register('totalArea', { valueAsNumber: true })}
                    error={errors.totalArea?.message}
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Detalles de la Propiedad</h4>

                <div className="grid grid-cols-4 gap-4">
                  <Input
                    label="Recámaras"
                    type="number"
                    {...register('bedrooms', { valueAsNumber: true })}
                    error={errors.bedrooms?.message}
                  />

                  <Input
                    label="Baños Completos"
                    type="number"
                    step="0.5"
                    {...register('bathrooms', { valueAsNumber: true })}
                    error={errors.bathrooms?.message}
                  />

                  <Input
                    label="Medios Baños"
                    type="number"
                    step="0.5"
                    {...register('halfBathrooms', { valueAsNumber: true })}
                    error={errors.halfBathrooms?.message}
                  />

                  <Input
                    label="Estacionamientos"
                    type="number"
                    {...register('parkingSpaces', { valueAsNumber: true })}
                    error={errors.parkingSpaces?.message}
                  />
                </div>

                <Input
                  label="Año de Construcción"
                  type="number"
                  {...register('yearBuilt', { valueAsNumber: true })}
                  error={errors.yearBuilt?.message}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Dirección</h4>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Calle"
                    {...register('addressStreet')}
                    error={errors.addressStreet?.message}
                  />

                  <Input
                    label="Número"
                    {...register('addressNumber')}
                    error={errors.addressNumber?.message}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Interior"
                    {...register('addressInterior')}
                    error={errors.addressInterior?.message}
                  />

                  <Input
                    label="Colonia"
                    {...register('addressColony')}
                    error={errors.addressColony?.message}
                  />

                  <Input
                    label="Código Postal"
                    {...register('addressZipCode')}
                    error={errors.addressZipCode?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    {...register('addressCity')}
                    error={errors.addressCity?.message}
                  />

                  <Input
                    label="Estado"
                    {...register('addressState')}
                    error={errors.addressState?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitud"
                    type="number"
                    step="0.000001"
                    {...register('latitude', { valueAsNumber: true })}
                    error={errors.latitude?.message}
                  />

                  <Input
                    label="Longitud"
                    type="number"
                    step="0.000001"
                    {...register('longitude', { valueAsNumber: true })}
                    error={errors.longitude?.message}
                  />
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Información del Propietario</h4>

                <Input
                  label="Nombre del Propietario"
                  {...register('ownerName')}
                  error={errors.ownerName?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Teléfono del Propietario"
                    {...register('ownerPhone')}
                    error={errors.ownerPhone?.message}
                  />

                  <Input
                    label="Email del Propietario"
                    type="email"
                    {...register('ownerEmail')}
                    error={errors.ownerEmail?.message}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Información Adicional</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenidades
                  </label>
                  <textarea
                    {...register('amenities')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Lista de amenidades..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="URL Tour Virtual"
                    {...register('virtualTourUrl')}
                    error={errors.virtualTourUrl?.message}
                  />

                  <Input
                    label="URL Video"
                    {...register('videoUrl')}
                    error={errors.videoUrl?.message}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isLienFree')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Libre de Gravamen</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Legales
                  </label>
                  <textarea
                    {...register('legalNotes')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Notas legales adicionales..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>{isEditing ? 'Actualizar' : 'Crear'}</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
