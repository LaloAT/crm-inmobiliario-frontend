import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, Building2, Mail, Phone, Globe } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { OrganizationModal } from './OrganizationModal';
import type { Organization } from '../../types/organization.types';

export const OrganizationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: orgsData, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getAll({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: organizationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setDeleteConfirm(null);
    },
  });

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteMutation.mutate(id);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const organizations = orgsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizaciones</h1>
          <p className="text-gray-500 mt-1">Gestiona las organizaciones y empresas</p>
        </div>
        <Button onClick={() => { setSelectedOrg(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Organización
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay organizaciones disponibles</p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Crear la primera organización
            </Button>
          </div>
        ) : (
          organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{org.type}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {org.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{org.email}</span>
                    </div>
                  )}
                  {org.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {org.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button onClick={() => { setSelectedOrg(org); setIsModalOpen(true); }} className="text-primary-600 hover:text-primary-900">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className={deleteConfirm === org.id ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      <OrganizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} organization={selectedOrg} />
    </div>
  );
};
