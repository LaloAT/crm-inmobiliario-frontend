import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { contractSchema, type ContractFormData } from '../../schemas/contract.schema';
import { contractService } from '../../services/contract.service';
import { dealService } from '../../services/deal.service';
import { propertyService } from '../../services/property.service';
import type { Contract } from '../../types/contract.types';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, contract }) => {
  const queryClient = useQueryClient();
  const isEditing = !!contract;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      status: 'DRAFT',
    },
  });

  // Fetch deals for dropdown
  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealService.getAll(),
  });

  // Fetch properties for dropdown
  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getAll({ limit: 100 }),
  });

  const properties = propertiesData?.data || [];

  // Reset form when contract changes
  useEffect(() => {
    if (contract) {
      reset({
        contractNumber: contract.contractNumber,
        contractDate: new Date(contract.contractDate).toISOString().split('T')[0],
        startDate: contract.startDate
          ? new Date(contract.startDate).toISOString().split('T')[0]
          : '',
        endDate: contract.endDate
          ? new Date(contract.endDate).toISOString().split('T')[0]
          : '',
        totalAmount: contract.totalAmount,
        status: contract.status,
        terms: contract.terms || '',
        dealId: contract.dealId,
        propertyId: contract.propertyId,
        signedDate: contract.signedDate
          ? new Date(contract.signedDate).toISOString().split('T')[0]
          : null,
      });
    } else {
      reset({
        contractNumber: '',
        contractDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        totalAmount: 0,
        status: 'DRAFT',
        terms: '',
        dealId: '',
        propertyId: '',
        signedDate: null,
      });
    }
  }, [contract, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: contractService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ContractFormData) => contractService.update(contract!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: ContractFormData) => {
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
              {isEditing ? 'Editar Contrato' : 'Crear Contrato'}
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
              {/* Contract Number and Date */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Número de Contrato"
                  {...register('contractNumber')}
                  error={errors.contractNumber?.message}
                  required
                />

                <Input
                  label="Fecha de Contrato"
                  type="date"
                  {...register('contractDate')}
                  error={errors.contractDate?.message}
                  required
                />
              </div>

              {/* Deal and Property */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('dealId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar deal...</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.title}
                      </option>
                    ))}
                  </select>
                  {errors.dealId && (
                    <p className="mt-1 text-sm text-red-600">{errors.dealId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Propiedad <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('propertyId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar propiedad...</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title}
                      </option>
                    ))}
                  </select>
                  {errors.propertyId && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
                  )}
                </div>
              </div>

              {/* Total Amount and Status */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monto Total"
                  type="number"
                  step="0.01"
                  {...register('totalAmount', { valueAsNumber: true })}
                  error={errors.totalAmount?.message}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="ACTIVE">Activo</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              {/* Start Date and End Date (for rentals) */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha de Inicio (Opcional)"
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />

                <Input
                  label="Fecha de Fin (Opcional)"
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>

              {/* Signed Date */}
              <Input
                label="Fecha de Firma (Opcional)"
                type="date"
                {...register('signedDate')}
                error={errors.signedDate?.message}
              />

              {/* Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Términos y Condiciones
                </label>
                <textarea
                  {...register('terms')}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Términos y condiciones del contrato..."
                />
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
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
