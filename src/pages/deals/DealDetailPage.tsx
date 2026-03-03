import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  Clock,
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Building2,
  Users,
} from 'lucide-react';
import { Card, CardBody } from '../../components/ui';
import { dealService } from '../../services/deal.service';
import {
  DealStageLabels,
  DealStageColors,
  DealOperationLabels,
} from '../../types/deal.types';
import { DealDocumentsTab } from './components/DealDocumentsTab';
import { DealActivitiesTab } from './components/DealActivitiesTab';

type TabType = 'info' | 'documents' | 'activities';

export const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const { data: deal, isLoading } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealService.getById(id!),
    enabled: !!id,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const tabs = [
    { id: 'info' as TabType, label: 'Información', icon: FileText },
    { id: 'documents' as TabType, label: 'Documentos', icon: FolderOpen },
    { id: 'activities' as TabType, label: 'Actividades', icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Deal no encontrado</h2>
        <button
          onClick={() => navigate('/deals')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Volver a Deals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/deals')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                DealStageColors[deal.stage]
              }`}
            >
              {DealStageLabels[deal.stage]}
            </span>
            <span className="text-sm text-gray-500">
              {DealOperationLabels[deal.operation]}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalles */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
              <dl className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-500">Valor esperado</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatCurrency(deal.expectedAmount)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-500">Probabilidad</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {deal.probability ?? 0}%
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-500">Fecha esperada de cierre</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatDate(deal.expectedCloseDate)}
                    </dd>
                  </div>
                </div>
                {deal.description && (
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Descripción</dt>
                    <dd className="text-sm text-gray-700">{deal.description}</dd>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <dt className="text-xs text-gray-500">Creado</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatDate(deal.createdAt)}
                    </dd>
                  </div>
                </div>
              </dl>
            </CardBody>
          </Card>

          {/* Relaciones */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relaciones</h3>
              <dl className="space-y-4">
                {deal.lead && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <dt className="text-xs text-gray-500">Lead vinculado</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {deal.lead.firstName} {deal.lead.lastName}
                      </dd>
                      <dd className="text-xs text-gray-500">{deal.lead.email}</dd>
                    </div>
                  </div>
                )}
                {deal.property && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <dt className="text-xs text-gray-500">Propiedad vinculada</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {deal.property.title}
                      </dd>
                      <dd className="text-xs text-gray-500">
                        {formatCurrency(deal.property.price)}
                      </dd>
                    </div>
                  </div>
                )}
                {deal.owner && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <dt className="text-xs text-gray-500">Responsable</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {deal.owner.fullName}
                      </dd>
                      <dd className="text-xs text-gray-500">{deal.owner.email}</dd>
                    </div>
                  </div>
                )}
                {!deal.lead && !deal.property && !deal.owner && (
                  <p className="text-sm text-gray-500">No hay relaciones registradas.</p>
                )}
              </dl>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && id && <DealDocumentsTab dealId={id} />}
      {activeTab === 'activities' && id && <DealActivitiesTab dealId={id} />}
    </div>
  );
};
