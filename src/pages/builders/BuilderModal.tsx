import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { builderService } from '../../services/builder.service';
import type { Builder } from '../../types/builder.types';

interface BuilderFormData {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface BuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  builder: Builder | null;
}

export const BuilderModal: React.FC<BuilderModalProps> = ({ isOpen, onClose, builder }) => {
  const queryClient = useQueryClient();
  const isEditing = !!builder;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuilderFormData>();

  useEffect(() => {
    if (builder) {
      reset({
        name: builder.name,
        description: builder.description || '',
        logoUrl: builder.logoUrl || '',
        websiteUrl: builder.websiteUrl || '',
        contactName: builder.contactName || '',
        contactPhone: builder.contactPhone || '',
        contactEmail: builder.contactEmail || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        logoUrl: '',
        websiteUrl: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
      });
    }
  }, [builder, reset]);

  const createMutation = useMutation({
    mutationFn: builderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      onClose();
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BuilderFormData) => builderService.update(builder!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: BuilderFormData) => {
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
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Constructora' : 'Crear Constructora'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <Input
                label="Nombre"
                {...register('name', { required: 'El nombre es requerido' })}
                error={errors.name?.message}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripcion
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Descripcion de la constructora..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sitio Web"
                  {...register('websiteUrl')}
                  error={errors.websiteUrl?.message}
                  placeholder="https://..."
                />
                <Input
                  label="URL del Logo"
                  {...register('logoUrl')}
                  error={errors.logoUrl?.message}
                  placeholder="https://..."
                />
              </div>

              <h4 className="text-sm font-semibold text-gray-900 pt-2">Contacto</h4>

              <Input
                label="Nombre de Contacto"
                {...register('contactName')}
                error={errors.contactName?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Telefono"
                  {...register('contactPhone')}
                  error={errors.contactPhone?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('contactEmail')}
                  error={errors.contactEmail?.message}
                />
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
