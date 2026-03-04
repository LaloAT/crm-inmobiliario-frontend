import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { letterOfInterestSchema, type LetterOfInterestFormData } from '../../schemas/letterOfInterest.schema';
import { letterOfInterestService } from '../../services/letterOfInterest.service';
import { leadService } from '../../services/lead.service';
import { propertyService } from '../../services/property.service';
import type { LetterOfInterestDto } from '../../types/letterOfInterest.types';
import { LetterOfInterestStatus } from '../../types/letterOfInterest.types';

interface LetterOfInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterOfInterestDto | null;
  readOnly?: boolean;
}

export const LetterOfInterestModal: React.FC<LetterOfInterestModalProps> = ({ isOpen, onClose, letter, readOnly = false }) => {
  const queryClient = useQueryClient();
  const isEditing = !!letter;
  const isReadOnly = readOnly || (isEditing && letter.status !== LetterOfInterestStatus.Draft);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LetterOfInterestFormData>({
    resolver: zodResolver(letterOfInterestSchema),
    defaultValues: {
      type: 1,
      propertyId: '',
      leadId: '',
      prospectName: '',
      prospectEmail: '',
      prospectPhone: '',
      prospectRfc: '',
      offeredPrice: null,
      conditions: '',
      validUntil: '',
    },
  });

  const selectedLeadId = watch('leadId');
  const selectedPropertyId = watch('propertyId');

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

  // Auto-fill prospect data when selecting a Lead
  useEffect(() => {
    if (!selectedLeadId || isEditing) return;
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    setValue('prospectName', `${lead.firstName} ${lead.lastName}`);
    if (lead.email) setValue('prospectEmail', lead.email);
    if (lead.phone) setValue('prospectPhone', lead.phone);
  }, [selectedLeadId, leads, setValue, isEditing]);

  // Auto-fill offeredPrice when selecting a Property
  useEffect(() => {
    if (!selectedPropertyId || isEditing) return;
    const property = properties.find((p) => p.id === selectedPropertyId);
    if (!property) return;

    setValue('offeredPrice', property.price);
  }, [selectedPropertyId, properties, setValue, isEditing]);

  // Reset form when letter changes
  useEffect(() => {
    if (letter) {
      reset({
        type: letter.type,
        propertyId: letter.propertyId,
        leadId: letter.leadId || '',
        prospectName: letter.prospectName,
        prospectEmail: letter.prospectEmail || '',
        prospectPhone: letter.prospectPhone || '',
        prospectRfc: letter.prospectRfc || '',
        offeredPrice: letter.offeredPrice ?? null,
        conditions: letter.conditions || '',
        validUntil: letter.validUntil
          ? new Date(letter.validUntil).toISOString().split('T')[0]
          : '',
      });
    } else {
      reset({
        type: 1,
        propertyId: '',
        leadId: '',
        prospectName: '',
        prospectEmail: '',
        prospectPhone: '',
        prospectRfc: '',
        offeredPrice: null,
        conditions: '',
        validUntil: '',
      });
    }
  }, [letter, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: letterOfInterestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] });
      onClose();
      reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: LetterOfInterestFormData) =>
      letterOfInterestService.update(letter!.id, {
        propertyId: data.propertyId,
        leadId: data.leadId || undefined,
        type: data.type,
        prospectName: data.prospectName,
        prospectEmail: data.prospectEmail || undefined,
        prospectPhone: data.prospectPhone || undefined,
        prospectRfc: data.prospectRfc || undefined,
        offeredPrice: data.offeredPrice ?? undefined,
        conditions: data.conditions || undefined,
        validUntil: data.validUntil || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lettersOfInterest'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: LetterOfInterestFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate({
        propertyId: data.propertyId,
        leadId: data.leadId || undefined,
        type: data.type,
        prospectName: data.prospectName,
        prospectEmail: data.prospectEmail || undefined,
        prospectPhone: data.prospectPhone || undefined,
        prospectRfc: data.prospectRfc || undefined,
        offeredPrice: data.offeredPrice ?? undefined,
        conditions: data.conditions || undefined,
        validUntil: data.validUntil || undefined,
      });
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
              {readOnly ? 'Detalle de Carta de Interés' : isEditing ? 'Editar Carta de Interés' : 'Nueva Carta de Interés'}
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
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type', { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value={1}>Compra</option>
                  <option value={2}>Renta</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Propiedad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propiedad <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('propertyId')}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Seleccionar propiedad...</option>
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

              {/* Lead (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead (Opcional)
                </label>
                <select
                  {...register('leadId')}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Sin lead asociado</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} - {lead.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre Prospecto */}
              <Input
                label="Nombre del Prospecto"
                {...register('prospectName')}
                error={errors.prospectName?.message}
                disabled={isReadOnly}
                required
              />

              {/* Email y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  {...register('prospectEmail')}
                  error={errors.prospectEmail?.message}
                  disabled={isReadOnly}
                />
                <Input
                  label="Teléfono"
                  {...register('prospectPhone')}
                  error={errors.prospectPhone?.message}
                  disabled={isReadOnly}
                />
              </div>

              {/* RFC y Precio Ofrecido */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="RFC"
                  {...register('prospectRfc')}
                  error={errors.prospectRfc?.message}
                  disabled={isReadOnly}
                />
                <Input
                  label="Precio Ofrecido"
                  type="number"
                  step="0.01"
                  {...register('offeredPrice', { valueAsNumber: true })}
                  error={errors.offeredPrice?.message}
                  disabled={isReadOnly}
                />
              </div>

              {/* Condiciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condiciones
                </label>
                <textarea
                  {...register('conditions')}
                  rows={3}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Condiciones de la carta..."
                />
                {errors.conditions && (
                  <p className="mt-1 text-sm text-red-600">{errors.conditions.message}</p>
                )}
              </div>

              {/* Válida hasta */}
              <Input
                label="Válida hasta"
                type="date"
                {...register('validUntil')}
                error={errors.validUntil?.message}
                disabled={isReadOnly}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                {isReadOnly ? 'Cerrar' : 'Cancelar'}
              </Button>
              {!isReadOnly && (
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
