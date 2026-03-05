import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { lotSchema, type LotFormData } from '../../schemas/lot.schema';
import { lotService } from '../../services/lot.service';
import { developmentService } from '../../services/development.service';
import type { Lot } from '../../types/lot.types';

interface LotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
  readOnly?: boolean;
}

export const LotModal: React.FC<LotModalProps> = ({ isOpen, onClose, lot, readOnly = false }) => {
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
      developmentId: '',
      lotNumber: '',
      block: '',
      street: '',
      phase: '',
      model: '',
      lotSize: null,
      builtSize: null,
      bedrooms: null,
      bathrooms: null,
      parkingSpaces: null,
      floors: null,
      price: 0,
      notes: '',
    },
  });

  const { data: developmentsData } = useQuery({
    queryKey: ['developments'],
    queryFn: () => developmentService.getAll({ pageNumber: 1, pageSize: 100 }),
  });

  const developments = developmentsData?.items || [];

  useEffect(() => {
    if (lot) {
      reset({
        developmentId: lot.developmentId,
        lotNumber: lot.lotNumber,
        block: lot.block || '',
        street: lot.street || '',
        phase: lot.phase || '',
        model: lot.model || '',
        lotSize: lot.lotSize ?? null,
        builtSize: lot.builtSize ?? null,
        bedrooms: lot.bedrooms ?? null,
        bathrooms: lot.bathrooms ?? null,
        parkingSpaces: lot.parkingSpaces ?? null,
        floors: lot.floors ?? null,
        price: lot.price,
        notes: lot.notes || '',
      });
    } else {
      reset({
        developmentId: '',
        lotNumber: '',
        block: '',
        street: '',
        phase: '',
        model: '',
        lotSize: null,
        builtSize: null,
        bedrooms: null,
        bathrooms: null,
        parkingSpaces: null,
        floors: null,
        price: 0,
        notes: '',
      });
    }
  }, [lot, reset]);

  const createMutation = useMutation({
    mutationFn: lotService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['lotsSummary'] });
      onClose();
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: LotFormData) =>
      lotService.update(lot!.id, {
        lotNumber: data.lotNumber,
        block: data.block || undefined,
        street: data.street || undefined,
        phase: data.phase || undefined,
        model: data.model || undefined,
        lotSize: data.lotSize ?? undefined,
        builtSize: data.builtSize ?? undefined,
        bedrooms: data.bedrooms ?? undefined,
        bathrooms: data.bathrooms ?? undefined,
        parkingSpaces: data.parkingSpaces ?? undefined,
        floors: data.floors ?? undefined,
        price: data.price,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['lotsSummary'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: LotFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate({
        developmentId: data.developmentId,
        lotNumber: data.lotNumber,
        block: data.block || undefined,
        phase: data.phase || undefined,
        model: data.model || undefined,
        lotSize: data.lotSize ?? undefined,
        builtSize: data.builtSize ?? undefined,
        bedrooms: data.bedrooms ?? undefined,
        bathrooms: data.bathrooms ?? undefined,
        parkingSpaces: data.parkingSpaces ?? undefined,
        floors: data.floors ?? undefined,
        price: data.price,
        notes: data.notes || undefined,
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {readOnly ? 'Detalle de Lote' : isEditing ? 'Editar Lote' : 'Crear Lote'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Desarrollo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desarrollo <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('developmentId')}
                  disabled={readOnly || isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Seleccionar desarrollo...</option>
                  {developments.map((dev: { id: string; name: string }) => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
                {errors.developmentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.developmentId.message}</p>
                )}
              </div>

              {/* Lote # y Manzana */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Número de Lote"
                  {...register('lotNumber')}
                  error={errors.lotNumber?.message}
                  disabled={readOnly}
                  required
                />
                <Input
                  label="Manzana"
                  {...register('block')}
                  error={errors.block?.message}
                  disabled={readOnly}
                />
              </div>

              {/* Calle y Fase */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Calle"
                  {...register('street')}
                  error={errors.street?.message}
                  disabled={readOnly}
                />
                <Input
                  label="Fase"
                  {...register('phase')}
                  error={errors.phase?.message}
                  disabled={readOnly}
                />
              </div>

              {/* Modelo y Precio */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Modelo"
                  {...register('model')}
                  error={errors.model?.message}
                  disabled={readOnly}
                />
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message}
                  disabled={readOnly}
                  required
                />
              </div>

              {/* Área terreno y Área construida */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Área Terreno (m²)"
                  type="number"
                  step="0.01"
                  {...register('lotSize', { valueAsNumber: true })}
                  error={errors.lotSize?.message}
                  disabled={readOnly}
                />
                <Input
                  label="Área Construida (m²)"
                  type="number"
                  step="0.01"
                  {...register('builtSize', { valueAsNumber: true })}
                  error={errors.builtSize?.message}
                  disabled={readOnly}
                />
              </div>

              {/* Recámaras y Baños */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Recámaras"
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  error={errors.bedrooms?.message}
                  disabled={readOnly}
                />
                <Input
                  label="Baños"
                  type="number"
                  step="0.5"
                  {...register('bathrooms', { valueAsNumber: true })}
                  error={errors.bathrooms?.message}
                  disabled={readOnly}
                />
              </div>

              {/* Estacionamientos y Pisos */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Estacionamientos"
                  type="number"
                  {...register('parkingSpaces', { valueAsNumber: true })}
                  error={errors.parkingSpaces?.message}
                  disabled={readOnly}
                />
                <Input
                  label="Pisos"
                  type="number"
                  {...register('floors', { valueAsNumber: true })}
                  error={errors.floors?.message}
                  disabled={readOnly}
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                {readOnly ? 'Cerrar' : 'Cancelar'}
              </Button>
              {!readOnly && (
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
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
