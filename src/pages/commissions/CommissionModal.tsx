import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { commissionSchema, type CommissionFormData } from '../../schemas/commission.schema';
import { commissionService } from '../../services/commission.service';
import { dealService } from '../../services/deal.service';
import { userService } from '../../services/user.service';
import type { Commission } from '../../types/commission.types';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: Commission | null;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, commission }) => {
  const queryClient = useQueryClient();
  const isEditing = !!commission;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      status: 'PENDING',
    },
  });

  // Fetch deals for dropdown
  const { data: dealsData } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealService.getAll({ limit: 100 }),
  });

  // Fetch users for dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll({ limit: 100 }),
  });

  const deals = dealsData?.data || [];
  const users = usersData?.data || [];

  // Reset form when commission changes
  useEffect(() => {
    if (commission) {
      reset({
        dealId: commission.dealId,
        userId: commission.userId,
        amount: commission.amount,
        percentage: commission.percentage,
        status: commission.status,
        dueDate: commission.dueDate || '',
        paidDate: commission.paidDate || '',
        notes: commission.notes || '',
      });
    } else {
      reset({
        dealId: '',
        userId: '',
        amount: 0,
        percentage: 0,
        status: 'PENDING',
        dueDate: '',
        paidDate: '',
        notes: '',
      });
    }
  }, [commission, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: commissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CommissionFormData) => commissionService.update(commission!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: CommissionFormData) => {
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
              {isEditing ? 'Editar Comisión' : 'Crear Comisión'}
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
              {/* Deal */}
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

              {/* User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agente <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('userId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar agente...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
                )}
              </div>

              {/* Amount and Percentage */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monto"
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  error={errors.amount?.message}
                  required
                />

                <Input
                  label="Porcentaje (%)"
                  type="number"
                  step="0.01"
                  {...register('percentage', { valueAsNumber: true })}
                  error={errors.percentage?.message}
                  required
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
                  <option value="PENDING">Pendiente</option>
                  <option value="APPROVED">Aprobada</option>
                  <option value="PAID">Pagada</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {/* Due Date and Paid Date */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha de Vencimiento"
                  type="date"
                  {...register('dueDate')}
                  error={errors.dueDate?.message}
                />

                <Input
                  label="Fecha de Pago"
                  type="date"
                  {...register('paidDate')}
                  error={errors.paidDate?.message}
                />
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
                  placeholder="Notas adicionales sobre la comisión..."
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
