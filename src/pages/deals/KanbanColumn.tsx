import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DealCard } from './DealCard';
import type { Deal } from '../../types/deal.types';

interface KanbanColumnProps {
  stage: {
    id: number;
    title: string;
    color: string;
  };
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  deals,
  onEdit,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id.toString(),
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg h-full min-h-[600px]">
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
          <h3 className="font-semibold text-gray-900">{stage.title}</h3>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {deals.length}
          </span>
        </div>
        <p className="text-sm text-gray-600">{formatCurrency(totalValue)}</p>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 overflow-y-auto ${
          isOver ? 'bg-blue-50' : ''
        }`}
      >
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Sin deals
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
