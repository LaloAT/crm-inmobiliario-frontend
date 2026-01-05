import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { propertySchema, type PropertyFormData } from '../../schemas/property.schema';
import { propertyService } from '../../services/property.service';
import type { Property } from '../../types/property.types';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, property }) => {
  const queryClient = useQueryClient();
  const isEditing = !!property;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'AVAILABLE',
      images: [],
      features: [],
    },
  });

  // Reset form when property changes
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description || '',
        address: property.address,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parkingSpaces: property.parkingSpaces,
        propertyType: property.propertyType,
        listingType: property.listingType,
        status: property.status,
        images: property.images || [],
        developmentId: property.developmentId || null,
        lotId: property.lotId || null,
        features: property.features || [],
      });
    } else {
      reset({
        title: '',
        description: '',
        address: '',
        price: 0,
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        parkingSpaces: 0,
        propertyType: 'HOUSE',
        listingType: 'SALE',
        status: 'AVAILABLE',
        images: [],
        developmentId: null,
        lotId: null,
        features: [],
      });
    }
  }, [property, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: propertyService.create,
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

  const onSubmit = (data: PropertyFormData) => {
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
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
            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <Input
                label="Título"
                {...register('title')}
                error={errors.title?.message}
                required
              />

              {/* Description */}
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

              {/* Address */}
              <Input
                label="Dirección"
                {...register('address')}
                error={errors.address?.message}
                required
              />

              {/* Property Type and Listing Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Propiedad <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('propertyType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="HOUSE">Casa</option>
                    <option value="APARTMENT">Departamento</option>
                    <option value="LAND">Terreno</option>
                    <option value="COMMERCIAL">Comercial</option>
                    <option value="OFFICE">Oficina</option>
                    <option value="WAREHOUSE">Bodega</option>
                    <option value="OTHER">Otro</option>
                  </select>
                  {errors.propertyType && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Listado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('listingType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="SALE">Venta</option>
                    <option value="RENT">Renta</option>
                  </select>
                  {errors.listingType && (
                    <p className="mt-1 text-sm text-red-600">{errors.listingType.message}</p>
                  )}
                </div>
              </div>

              {/* Price and Area */}
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
                  label="Área (m²)"
                  type="number"
                  step="0.01"
                  {...register('area', { valueAsNumber: true })}
                  error={errors.area?.message}
                  required
                />
              </div>

              {/* Bedrooms, Bathrooms, Parking */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Recámaras"
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  error={errors.bedrooms?.message}
                />

                <Input
                  label="Baños"
                  type="number"
                  step="0.5"
                  {...register('bathrooms', { valueAsNumber: true })}
                  error={errors.bathrooms?.message}
                />

                <Input
                  label="Estacionamientos"
                  type="number"
                  {...register('parkingSpaces', { valueAsNumber: true })}
                  error={errors.parkingSpaces?.message}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="RESERVED">Reservada</option>
                  <option value="SOLD">Vendida</option>
                  <option value="RENTED">Rentada</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
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
