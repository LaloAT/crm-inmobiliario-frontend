import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Phone,
  Mail,
  Users,
  ClipboardList,
  StickyNote,
  MapPin,
  MessageCircle,
  Bell,
  Presentation,
  MoreHorizontal,
  Clock,
  Loader2,
} from 'lucide-react';
import { dealService } from '../../../services/deal.service';
import { ActivityType, ActivityTypeLabels } from '../../../types/deal.types';
import type { DealActivity } from '../../../types/deal.types';

interface DealActivitiesTabProps {
  dealId: string;
}

const ActivityIcons: Record<ActivityType, React.FC<{ className?: string }>> = {
  [ActivityType.Llamada]: Phone,
  [ActivityType.Email]: Mail,
  [ActivityType.Reunion]: Users,
  [ActivityType.Tarea]: ClipboardList,
  [ActivityType.Nota]: StickyNote,
  [ActivityType.Visita]: MapPin,
  [ActivityType.WhatsApp]: MessageCircle,
  [ActivityType.Seguimiento]: Bell,
  [ActivityType.Presentacion]: Presentation,
  [ActivityType.Otro]: MoreHorizontal,
};

const ActivityColors: Record<ActivityType, string> = {
  [ActivityType.Llamada]: 'bg-blue-500',
  [ActivityType.Email]: 'bg-indigo-500',
  [ActivityType.Reunion]: 'bg-purple-500',
  [ActivityType.Tarea]: 'bg-yellow-500',
  [ActivityType.Nota]: 'bg-gray-500',
  [ActivityType.Visita]: 'bg-green-500',
  [ActivityType.WhatsApp]: 'bg-emerald-500',
  [ActivityType.Seguimiento]: 'bg-orange-500',
  [ActivityType.Presentacion]: 'bg-pink-500',
  [ActivityType.Otro]: 'bg-gray-400',
};

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const DealActivitiesTab: React.FC<DealActivitiesTabProps> = ({ dealId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['deal-activities', dealId],
    queryFn: () => dealService.getActivities(dealId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades</h3>
        <p className="text-gray-500">No hay actividades registradas para este deal.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {activities.map((activity: DealActivity) => {
            const Icon = ActivityIcons[activity.type] || MoreHorizontal;
            const color = ActivityColors[activity.type] || 'bg-gray-400';

            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${color} flex-shrink-0`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {ActivityTypeLabels[activity.type]}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatRelativeDate(activity.createdAt)}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  )}
                  {activity.userName && (
                    <p className="text-xs text-gray-400 mt-1">
                      Por {activity.userName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
