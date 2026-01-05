import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { userSchema, type UserFormData } from '../../schemas/user.schema';
import { userService } from '../../services/user.service';
import type { User } from '../../types/user.types';
import { UserRole, UserRoleLabels } from '../../types/user.types';
import { useAuth } from '../../context/AuthContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone || '',
        password: '', // No pre-fill password
      });
    } else {
      reset({
        email: '',
        fullName: '',
        role: UserRole.Agent,
        phone: '',
        password: '',
      });
    }
  }, [user, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      // Si no hay password, no lo envíes en la actualización
      const { password, ...updateData } = data;
      const finalData = password ? data : updateData;
      return userService.update(user!.id, finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      const createData = {
        ...data,
        organizationId: currentUser?.organizationId || '',
      };
      createMutation.mutate(createData as any);
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
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
              {/* Full Name */}
              <Input
                label="Nombre Completo"
                {...register('fullName')}
                error={errors.fullName?.message}
                required
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              {/* Phone */}
              <Input
                label="Teléfono"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('role', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(UserRole)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([_key, value]) => (
                      <option key={value} value={value}>
                        {UserRoleLabels[value as UserRole]}
                      </option>
                    ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Password */}
              <Input
                label={isEditing ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                type="password"
                {...register('password')}
                error={errors.password?.message}
                required={!isEditing}
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
