import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Button, Input } from '../../components/ui';
import { shiftService } from '../../services/shift.service';
import { userService } from '../../services/user.service';
import type { Shift } from '../../types/shift.types';

const shiftSchema = z.object({
  userId: z.string().min(1, 'Usuario es requerido'),
  shiftDate: z.string().min(1, 'Fecha es requerida'),
  startTime: z.string().min(1, 'Hora de inicio es requerida'),
  endTime: z.string().min(1, 'Hora de fin es requerida'),
  status: z.number().int().min(1).max(5),
  notes: z.string().optional(),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift | null;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, shift }) => {
  const queryClient = useQueryClient();
  const isEditing = !!shift;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      status: 1, // Scheduled
    },
  });

  // Fetch users for dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll({ pageSize: 100 }),
  });

  const users = usersData?.items || [];

  // Reset form when shift changes
  useEffect(() => {
    if (shift) {
      reset({
        userId: shift.userId,
        shiftDate: new Date(shift.shiftDate).toISOString().split('T')[0],
        startTime: new Date(shift.startTime).toTimeString().slice(0, 5),
        endTime: new Date(shift.endTime).toTimeString().slice(0, 5),
        status: shift.status,
        notes: shift.notes || '',
      });
    } else {
      reset({
        userId: '',
        shiftDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '18:00',
        status: 1,
        notes: '',
      });
    }
  }, [shift, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ShiftFormData) => {
      // Combine date and time into ISO strings
      const startDateTime = new Date(`${data.shiftDate}T${data.startTime}:00`).toISOString();
      const endDateTime = new Date(`${data.shiftDate}T${data.endTime}:00`).toISOString();

      return shiftService.create({
        userId: data.userId,
        shiftDate: data.shiftDate,
        startTime: startDateTime,
        endTime: endDateTime,
        status: data.status,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ShiftFormData) => {
      // Combine date and time into ISO strings
      const startDateTime = new Date(`${data.shiftDate}T${data.startTime}:00`).toISOString();
      const endDateTime = new Date(`${data.shiftDate}T${data.endTime}:00`).toISOString();

      return shiftService.update(shift!.id, {
        userId: data.userId,
        shiftDate: data.shiftDate,
        startTime: startDateTime,
        endTime: endDateTime,
        status: data.status,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: ShiftFormData) => {
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
              {isEditing ? 'Editar Turno' : 'Crear Turno'}
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
              {/* User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('userId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar usuario...</option>
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

              {/* Date */}
              <Input
                label="Fecha"
                type="date"
                {...register('shiftDate')}
                error={errors.shiftDate?.message}
                required
              />

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Hora de Inicio"
                  type="time"
                  {...register('startTime')}
                  error={errors.startTime?.message}
                  required
                />

                <Input
                  label="Hora de Fin"
                  type="time"
                  {...register('endTime')}
                  error={errors.endTime?.message}
                  required
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
                  <option value={1}>Programado</option>
                  <option value={2}>Activo</option>
                  <option value={3}>Completado</option>
                  <option value={4}>Cancelado</option>
                  <option value={5}>No asistió</option>
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
                  placeholder="Notas adicionales sobre el turno..."
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
