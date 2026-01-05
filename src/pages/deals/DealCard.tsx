import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical, TrendingUp } from 'lucide-react';
import type { Deal } from '../../types/deal.types';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      {/* Drag Handle */}
      <div className="flex items-start gap-2">
        <div {...listeners} {...attributes} className="mt-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
            {deal.title}
          </h4>

          {/* Value */}
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(deal.expectedAmount)}
            </span>
          </div>

          {/* Probability */}
          {deal.probability !== undefined && deal.probability > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Probabilidad</span>
                <span className="font-medium">{deal.probability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
            </div>
          )}

          {/* Expected Close Date */}
          {deal.expectedCloseDate && (
            <p className="text-xs text-gray-500 mb-2">
              Cierre: {formatDate(deal.expectedCloseDate)}
            </p>
          )}

          {/* Description */}
          {deal.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {deal.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-1 pt-2 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="flex-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
            >
              <Pencil className="w-3 h-3 inline mr-1" />
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal.id);
              }}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
