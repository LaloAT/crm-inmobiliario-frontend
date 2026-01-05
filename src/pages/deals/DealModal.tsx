import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { dealSchema, type DealFormData } from '../../schemas/deal.schema';
import { dealService } from '../../services/deal.service';
import { leadService } from '../../services/lead.service';
import { propertyService } from '../../services/property.service';
import type { Deal } from '../../types/deal.types';
import { DealOperation } from '../../types/deal.types';
import { useAuth } from '../../context/AuthContext';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

export const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, deal }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!deal;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      stage: 1,
      probability: 0,
    },
  });

  // Fetch leads for dropdown
  const { data: leadsData } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadService.getAll({ pageSize: 100 }),
  });

  // Fetch properties for dropdown
  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getAll({ pageSize: 100 }),
  });

  const leads = leadsData?.items || [];
  const properties = propertiesData?.items || [];

  // Reset form when deal changes
  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        description: deal.description || '',
        value: deal.expectedAmount,
        stage: deal.stage,
        probability: deal.probability || 0,
        expectedCloseDate: deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toISOString().split('T')[0]
          : '',
        leadId: deal.leadId,
        propertyId: deal.propertyId || null,
        assignedToId: deal.ownerId || null,
      });
    } else {
      reset({
        title: '',
        description: '',
        value: 0,
        stage: 1,
        probability: 0,
        expectedCloseDate: '',
        leadId: '',
        propertyId: null,
        assignedToId: null,
      });
    }
  }, [deal, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: dealService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: DealFormData) => dealService.update(deal!.id, { ...data, propertyId: data.propertyId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: DealFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      const createData = {
        ...data,
        propertyId: data.propertyId || undefined,
        organizationId: user?.organizationId || '',
        ownerId: user?.id || '',
        operation: DealOperation.Venta,
        expectedAmount: data.value || 0,
      };
      createMutation.mutate(createData);
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
              {isEditing ? 'Editar Deal' : 'Crear Deal'}
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
                  placeholder="Descripción del deal..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Value and Probability */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor"
                  type="number"
                  step="0.01"
                  {...register('value', { valueAsNumber: true })}
                  error={errors.value?.message}
                  required
                />

                <Input
                  label="Probabilidad (%)"
                  type="number"
                  min="0"
                  max="100"
                  {...register('probability', { valueAsNumber: true })}
                  error={errors.probability?.message}
                />
              </div>

              {/* Stage and Expected Close Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Etapa <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('stage', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={1}>Nuevo</option>
                    <option value={2}>Calificado</option>
                    <option value={3}>Propuesta</option>
                    <option value={4}>Negociación</option>
                    <option value={5}>Ganado</option>
                    <option value={6}>Perdido</option>
                  </select>
                  {errors.stage && (
                    <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
                  )}
                </div>

                <Input
                  label="Fecha Estimada de Cierre"
                  type="date"
                  {...register('expectedCloseDate')}
                  error={errors.expectedCloseDate?.message}
                />
              </div>

              {/* Lead */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('leadId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar lead...</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} - {lead.email}
                    </option>
                  ))}
                </select>
                {errors.leadId && (
                  <p className="mt-1 text-sm text-red-600">{errors.leadId.message}</p>
                )}
              </div>

              {/* Property (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propiedad (Opcional)
                </label>
                <select
                  {...register('propertyId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Sin propiedad asignada</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - {property.addressCity || 'Sin dirección'}
                    </option>
                  ))}
                </select>
                {errors.propertyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
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
