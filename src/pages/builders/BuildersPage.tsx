import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, Button } from '../../components/ui';
import { Plus, Pencil, Trash2, Loader2, Search, HardHat } from 'lucide-react';
import { builderService } from '../../services/builder.service';
import { BuilderModal } from './BuilderModal';
import type { Builder } from '../../types/builder.types';

export const BuildersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: buildersData, isLoading } = useQuery({
    queryKey: ['builders', currentPage, searchTerm],
    queryFn: () =>
      builderService.getAll({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: builderService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      setDeleteConfirm(null);
    },
  });

  const handleCreate = () => {
    setSelectedBuilder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (builder: Builder) => {
    setSelectedBuilder(builder);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteMutation.mutate(id);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBuilder(null);
  };

  const builders = buildersData?.items || [];
  const totalPages = buildersData?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Constructoras</h1>
          <p className="text-gray-500 mt-1">Gestiona las constructoras registradas</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Constructora
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar constructoras..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : builders.length === 0 ? (
            <div className="text-center py-12">
              <HardHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay constructoras registradas</p>
              <Button onClick={handleCreate} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear la primera constructora
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desarrollos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {builders.map((builder) => (
                    <tr key={builder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {builder.logoUrl ? (
                            <img
                              src={builder.logoUrl}
                              alt={builder.name}
                              className="h-8 w-8 rounded object-cover mr-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center mr-3">
                              <HardHat className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {builder.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {builder.contactName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {builder.contactPhone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {builder.contactEmail || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {builder.developmentCount ?? 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            builder.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {builder.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(builder)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(builder.id)}
                            className={`${
                              deleteConfirm === builder.id
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-gray-400 hover:text-red-600'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Pagina {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal */}
      <BuilderModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        builder={selectedBuilder}
      />
    </div>
  );
};
