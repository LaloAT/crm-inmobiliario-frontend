import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { organizationSchema, type OrganizationFormData } from '../../schemas/organization.schema';
import { organizationService } from '../../services/organization.service';
import type { Organization } from '../../types/organization.types';
import { OrganizationType, OrganizationTier, OrganizationTypeLabels, OrganizationTierLabels } from '../../types/organization.types';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose, organization }) => {
  const queryClient = useQueryClient();
  const isEditing = !!organization;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name,
        type: organization.type,
        tier: organization.tier,
        taxId: organization.taxId || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        notes: organization.notes || '',
      });
    } else {
      reset({
        name: '',
        type: OrganizationType.Inmobiliaria,
        tier: OrganizationTier.Free,
        taxId: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: '',
      });
    }
  }, [organization, reset]);

  const createMutation = useMutation({
    mutationFn: organizationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onClose();
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: OrganizationFormData) => organizationService.update(organization!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: OrganizationFormData) => {
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
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Organización' : 'Crear Organización'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-4">
              <Input label="Nombre" {...register('name')} error={errors.name?.message} required />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Object.entries(OrganizationType).filter(([k]) => isNaN(Number(k))).map(([_k, v]) => (
                      <option key={v} value={v}>{OrganizationTypeLabels[v as OrganizationType]}</option>
                    ))}
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('tier', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Object.entries(OrganizationTier).filter(([k]) => isNaN(Number(k))).map(([_k, v]) => (
                      <option key={v} value={v}>{OrganizationTierLabels[v as OrganizationTier]}</option>
                    ))}
                  </select>
                  {errors.tier && <p className="mt-1 text-sm text-red-600">{errors.tier.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="RFC/Tax ID" {...register('taxId')} error={errors.taxId?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Teléfono" {...register('phone')} error={errors.phone?.message} />
                <Input label="Sitio Web" {...register('website')} error={errors.website?.message} />
              </div>

              <Input label="Dirección" {...register('address')} error={errors.address?.message} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEditing ? 'Actualizando...' : 'Creando...'}</>
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
