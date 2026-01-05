import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { developmentSchema, type DevelopmentFormData } from '../../schemas/development.schema';
import { developmentService } from '../../services/development.service';
import { useAuth } from '../../context/AuthContext';
import { DevelopmentStatus } from '../../types/development.types';
import type { Development } from '../../types/development.types';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  development: Development | null;
}

export const DevelopmentModal: React.FC<DevelopmentModalProps> = ({
  isOpen,
  onClose,
  development,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!development;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DevelopmentFormData>({
    resolver: zodResolver(developmentSchema),
  });

  // Reset form when development changes
  useEffect(() => {
    if (development) {
      reset({
        name: development.name,
        description: development.description || '',
        location: development.location,
        address: development.address || '',
        city: development.city || '',
        state: development.state || '',
        zipCode: development.zipCode || '',
        status: development.status,
        startDate: development.startDate
          ? new Date(development.startDate).toISOString().split('T')[0]
          : '',
        endDate: development.endDate
          ? new Date(development.endDate).toISOString().split('T')[0]
          : '',
        totalLots: development.totalLots,
        totalArea: development.totalArea,
        mapImageUrl: development.mapImageUrl || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        location: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        status: DevelopmentStatus.Planeacion,
        startDate: '',
        endDate: '',
        totalLots: 0,
        totalArea: undefined,
        mapImageUrl: '',
      });
    }
  }, [development, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: developmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: DevelopmentFormData) =>
      developmentService.update(development!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: DevelopmentFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      if (!user?.organizationId) {
        console.error('No organization ID available');
        return;
      }
      createMutation.mutate({
        ...data,
        organizationId: user.organizationId,
      });
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Desarrollo' : 'Crear Desarrollo'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <Input
                label="Nombre del Desarrollo"
                {...register('name')}
                error={errors.name?.message}
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
                  placeholder="Descripción del desarrollo..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Location */}
              <Input
                label="Ubicación"
                {...register('location')}
                error={errors.location?.message}
                required
              />

              {/* Address details */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Dirección"
                  {...register('address')}
                  error={errors.address?.message}
                />
                <Input
                  label="Ciudad"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Input
                  label="Estado"
                  {...register('state')}
                  error={errors.state?.message}
                />
              </div>

              {/* Zip Code */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Código Postal"
                  {...register('zipCode')}
                  error={errors.zipCode?.message}
                />
                <Input
                  label="Área Total (m²)"
                  type="number"
                  {...register('totalArea', { valueAsNumber: true })}
                  error={errors.totalArea?.message}
                />
              </div>

              {/* Status and Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={1}>Planeación</option>
                    <option value={2}>En Progreso</option>
                    <option value={3}>Completado</option>
                    <option value={4}>Cancelado</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <Input
                  label="Fecha de Inicio"
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />

                <Input
                  label="Fecha de Finalización"
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>

              {/* Total Lots */}
              <Input
                label="Total de Lotes"
                type="number"
                {...register('totalLots', { valueAsNumber: true })}
                error={errors.totalLots?.message}
                required
              />
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
