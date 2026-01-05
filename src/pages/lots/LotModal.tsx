import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { lotSchema, type LotFormData } from '../../schemas/lot.schema';
import { lotService } from '../../services/lot.service';
import { developmentService } from '../../services/development.service';
import type { Lot, Development } from '../../types';
import { LotStatus, LotStatusLabels } from '../../types/lot.types';

interface LotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
}

export const LotModal: React.FC<LotModalProps> = ({ isOpen, onClose, lot }) => {
  const queryClient = useQueryClient();
  const isEditing = !!lot;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LotFormData>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      status: LotStatus.Disponible,
    },
  });

  // Fetch developments for dropdown
  const { data: developmentsData } = useQuery({
    queryKey: ['developments'],
    queryFn: () => developmentService.getAll({ pageNumber: 1, pageSize: 100 }),
  });

  const developments = developmentsData?.items || [];

  // Reset form when lot changes
  useEffect(() => {
    if (lot) {
      reset({
        lotNumber: lot.lotNumber,
        block: lot.block || '',
        manzana: lot.manzana || '',
        area: lot.area,
        frontMeters: lot.frontMeters,
        depthMeters: lot.depthMeters,
        price: lot.price,
        currency: lot.currency || 'MXN',
        status: lot.status,
        positionX: lot.positionX,
        positionY: lot.positionY,
        developmentId: lot.developmentId,
        assignedUserId: lot.assignedUserId,
        notes: lot.notes || '',
      });
    } else {
      reset({
        lotNumber: '',
        block: '',
        manzana: '',
        area: 0,
        price: 0,
        currency: 'MXN',
        status: LotStatus.Disponible,
        developmentId: '',
        notes: '',
      });
    }
  }, [lot, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: lotService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: LotFormData) => lotService.update(lot!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      onClose();
      reset();
    },
  });

  const onSubmit: SubmitHandler<LotFormData> = (data) => {
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Lote' : 'Crear Lote'}
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
            <div className="px-6 py-4 space-y-4">
              {/* Development */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desarrollo <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('developmentId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar desarrollo...</option>
                  {developments.map((dev: Development) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
                {errors.developmentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.developmentId.message}</p>
                )}
              </div>

              {/* Lot Number and Block */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Número de Lote"
                  {...register('lotNumber')}
                  error={errors.lotNumber?.message}
                  required
                />

                <Input
                  label="Bloque"
                  {...register('block')}
                  error={errors.block?.message}
                />
              </div>

              {/* Manzana */}
              <Input
                label="Manzana"
                {...register('manzana')}
                error={errors.manzana?.message}
              />

              {/* Area and Price */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Área (m²)"
                  type="number"
                  step="0.01"
                  {...register('area', { valueAsNumber: true })}
                  error={errors.area?.message}
                  required
                />

                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message}
                  required
                />
              </div>

              {/* Dimensions - Front and Depth Meters */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Frente (metros)"
                  type="number"
                  step="0.01"
                  {...register('frontMeters', { valueAsNumber: true })}
                  error={errors.frontMeters?.message}
                />

                <Input
                  label="Fondo (metros)"
                  type="number"
                  step="0.01"
                  {...register('depthMeters', { valueAsNumber: true })}
                  error={errors.depthMeters?.message}
                />
              </div>

              {/* Position on Map */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Posición X en Mapa"
                  type="number"
                  {...register('positionX', { valueAsNumber: true })}
                  error={errors.positionX?.message}
                />

                <Input
                  label="Posición Y en Mapa"
                  type="number"
                  {...register('positionY', { valueAsNumber: true })}
                  error={errors.positionY?.message}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(LotStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Notas adicionales sobre el lote..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
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
