import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { Button } from '../../components/ui';
import { Plus, Loader2 } from 'lucide-react';
import { dealService } from '../../services/deal.service';
import { DealModal } from './DealModal';
import { KanbanColumn } from './KanbanColumn';
import { DealCard } from './DealCard';
import type { Deal } from '../../types/deal.types';

// Configuración de columnas del Kanban
const STAGES = [
  { id: 1, title: 'Nuevo', color: 'bg-blue-500' },
  { id: 2, title: 'Calificado', color: 'bg-yellow-500' },
  { id: 3, title: 'Propuesta', color: 'bg-purple-500' },
  { id: 4, title: 'Negociación', color: 'bg-orange-500' },
  { id: 5, title: 'Ganado', color: 'bg-green-500' },
  { id: 6, title: 'Perdido', color: 'bg-red-500' },
];

export const DealsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealService.getAll(),
  });

  // Update stage mutation
  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: number }) =>
      dealService.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: dealService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<number, Deal[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    deals.forEach((deal) => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });

    return grouped;
  }, [deals]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonValue = deals
      .filter((d) => d.stage === 5)
      .reduce((sum, deal) => sum + deal.value, 0);
    const expectedValue = deals
      .filter((d) => d.stage < 5)
      .reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);

    return {
      total: deals.length,
      totalValue,
      wonValue,
      expectedValue,
    };
  }, [deals]);

  // Handlers
  const handleCreate = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este deal?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    setActiveDeal(deal || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStage = parseInt(over.id as string);

    const deal = deals.find((d) => d.id === dealId);

    if (deal && deal.stage !== newStage) {
      updateStageMutation.mutate({ id: dealId, stage: newStage });
    }

    setActiveDeal(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Deals</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tus oportunidades de negocio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Deals</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Valor Total</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalValue)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Ganado</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.wonValue)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Esperado</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(stats.expectedValue)}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={dealsByStage[stage.id] || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal ? (
              <div className="rotate-3 opacity-80">
                <DealCard deal={activeDeal} onEdit={() => {}} onDelete={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        deal={selectedDeal}
      />
    </div>
  );
};
