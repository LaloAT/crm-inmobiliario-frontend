import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { developmentSchema, type DevelopmentFormData } from '../../schemas/development.schema';
import { developmentService } from '../../services/development.service';
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
  const isEditing = !!development;
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DevelopmentFormData>({
    resolver: zodResolver(developmentSchema),
    defaultValues: {
      status: 'PLANNING',
      amenities: [],
    },
  });

  // Reset form when development changes
  useEffect(() => {
    if (development) {
      reset({
        name: development.name,
        description: development.description || '',
        location: development.location,
        developer: development.developer || '',
        status: development.status,
        startDate: development.startDate
          ? new Date(development.startDate).toISOString().split('T')[0]
          : '',
        estimatedCompletionDate: development.estimatedCompletionDate
          ? new Date(development.estimatedCompletionDate).toISOString().split('T')[0]
          : '',
        totalLots: development.totalLots,
        availableLots: development.availableLots,
        amenities: development.amenities || [],
      });
      setAmenities(development.amenities || []);
    } else {
      reset({
        name: '',
        description: '',
        location: '',
        developer: '',
        status: 'PLANNING',
        startDate: '',
        estimatedCompletionDate: '',
        totalLots: 0,
        availableLots: 0,
        amenities: [],
      });
      setAmenities([]);
    }
  }, [development, reset]);

  // Update amenities in form
  useEffect(() => {
    setValue('amenities', amenities);
  }, [amenities, setValue]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: developmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      onClose();
      reset();
      setAmenities([]);
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
      setAmenities([]);
    },
  });

  const onSubmit = (data: DevelopmentFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
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

              {/* Location and Developer */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ubicación"
                  {...register('location')}
                  error={errors.location?.message}
                  required
                />

                <Input
                  label="Desarrollador"
                  {...register('developer')}
                  error={errors.developer?.message}
                />
              </div>

              {/* Status and Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="PLANNING">En Planeación</option>
                    <option value="CONSTRUCTION">En Construcción</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="CANCELLED">Cancelado</option>
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
                  label="Fecha Est. Finalización"
                  type="date"
                  {...register('estimatedCompletionDate')}
                  error={errors.estimatedCompletionDate?.message}
                />
              </div>

              {/* Lots */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Total de Lotes"
                  type="number"
                  {...register('totalLots', { valueAsNumber: true })}
                  error={errors.totalLots?.message}
                />

                <Input
                  label="Lotes Disponibles"
                  type="number"
                  {...register('availableLots', { valueAsNumber: true })}
                  error={errors.availableLots?.message}
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenidades
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Alberca, Gym, Áreas verdes..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAmenity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
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
