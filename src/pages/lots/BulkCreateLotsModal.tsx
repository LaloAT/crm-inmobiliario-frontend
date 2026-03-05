import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { bulkCreateLotsSchema, type BulkCreateLotsFormData } from '../../schemas/lot.schema';
import { lotService } from '../../services/lot.service';
import { developmentService } from '../../services/development.service';

interface BulkCreateLotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkCreateLotsModal: React.FC<BulkCreateLotsModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BulkCreateLotsFormData>({
    resolver: zodResolver(bulkCreateLotsSchema),
    defaultValues: {
      developmentId: '',
      lotNumberPrefix: '',
      quantity: 1,
      model: '',
      price: 0,
      bedrooms: null,
      bathrooms: null,
      area: null,
      floors: null,
    },
  });

  const { data: developmentsData } = useQuery({
    queryKey: ['developments'],
    queryFn: () => developmentService.getAll({ pageNumber: 1, pageSize: 100 }),
  });

  const developments = developmentsData?.items || [];

  const bulkMutation = useMutation({
    mutationFn: lotService.bulkCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['lotsSummary'] });
      alert(`Se crearon ${data.count} lotes exitosamente.`);
      onClose();
      reset();
    },
  });

  const onSubmit = (data: BulkCreateLotsFormData) => {
    bulkMutation.mutate({
      developmentId: data.developmentId,
      lotNumberPrefix: data.lotNumberPrefix,
      quantity: data.quantity,
      model: data.model || undefined,
      price: data.price,
      bedrooms: data.bedrooms ?? undefined,
      bathrooms: data.bathrooms ?? undefined,
      area: data.area ?? undefined,
      floors: data.floors ?? undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Crear Lotes Masivamente</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

              {/* Prefijo y Cantidad */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prefijo de Numeración"
                  placeholder="Ej: L-, MZ1-"
                  {...register('lotNumberPrefix')}
                  error={errors.lotNumberPrefix?.message}
                  required
                />
                <Input
                  label="Cantidad"
                  type="number"
                  min="1"
                  max="500"
                  {...register('quantity', { valueAsNumber: true })}
                  error={errors.quantity?.message}
                  required
                />
              </div>

              {/* Modelo y Precio */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Modelo"
                  {...register('model')}
                  error={errors.model?.message}
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

              <p className="text-xs text-gray-500 border-t pt-3">Campos opcionales (se aplican a todos los lotes)</p>

              {/* Recámaras y Baños */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Área y Pisos */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Área (m²)"
                  type="number"
                  step="0.01"
                  {...register('area', { valueAsNumber: true })}
                  error={errors.area?.message}
                />
                <Input
                  label="Pisos"
                  type="number"
                  {...register('floors', { valueAsNumber: true })}
                  error={errors.floors?.message}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={bulkMutation.isPending}>
                {bulkMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Lotes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
