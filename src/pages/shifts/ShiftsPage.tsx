import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  RefreshCw,
  Users,
  BarChart3,
  ArrowRightLeft,
  CheckCircle,
  X,
} from 'lucide-react';
import { shiftService } from '../../services/shift.service';
import { developmentService } from '../../services/development.service';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user.types';
import {
  ScheduleStatus,
  ScheduleStatusLabels,
  ScheduleStatusColors,
  ShiftTypeLabels,
  ShiftTypeColors,
  AssignmentStatus,
  AssignmentStatusLabels,
  AssignmentStatusColors,
  SwapStatus,
  SwapStatusLabels,
  SwapStatusColors,
  SupervisorColors,
} from '../../types/shift.types';
import type {
  ShiftScheduleDto,
  ShiftAssignmentDto,
  ShiftSwapRequestDto,
  ShiftStatsDto,
} from '../../types/shift.types';

type TabKey = 'calendar' | 'myShifts' | 'swaps';

export const ShiftsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = (user?.role ?? UserRole.Agent) as UserRole;

  // Role checks
  const isAgent = userRole === UserRole.Agent || userRole === UserRole.ExternalAgent;
  const isSupervisorOrAbove = userRole <= UserRole.Supervisor; // SuperAdmin=1, ITAdmin=2, Manager=3, Supervisor=4
  const isManagerOrAbove = userRole <= UserRole.Manager;

  // Tab state
  const defaultTab: TabKey = isAgent ? 'myShifts' : 'calendar';
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  // Calendar state
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [selectedDevelopmentId, setSelectedDevelopmentId] = useState<string>('');

  // My Shifts state
  const [myPage, setMyPage] = useState(1);
  const [myStatusFilter, setMyStatusFilter] = useState<string>('');

  // Swaps state
  const [swapPage, setSwapPage] = useState(1);
  const [swapStatusFilter, setSwapStatusFilter] = useState<string>('');

  // Swap modal state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapAssignmentId, setSwapAssignmentId] = useState('');
  const [swapAgentId, setSwapAgentId] = useState('');
  const [swapReason, setSwapReason] = useState('');

  // Generate modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genMonth, setGenMonth] = useState(now.getMonth() + 1);
  const [genYear, setGenYear] = useState(now.getFullYear());

  // ===========================
  // QUERIES
  // ===========================

  // Developments (for filters)
  const { data: developmentsData } = useQuery({
    queryKey: ['developments', 'all'],
    queryFn: () => developmentService.getAll({ pageSize: 100 }),
  });
  const developments = developmentsData?.items || [];

  // Schedules
  const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
    queryKey: ['shift-schedules', calMonth, calYear],
    queryFn: () => shiftService.getSchedules({ month: calMonth, year: calYear, pageSize: 10 }),
    enabled: activeTab === 'calendar',
  });

  // Current schedule (first one for month/year)
  const currentSchedule: ShiftScheduleDto | undefined = schedulesData?.items?.[0];

  // Schedule detail (assignments)
  const { data: scheduleDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['shift-schedule-detail', currentSchedule?.id],
    queryFn: () => shiftService.getScheduleById(currentSchedule!.id),
    enabled: !!currentSchedule?.id && activeTab === 'calendar',
  });

  // Stats
  const { data: statsData } = useQuery({
    queryKey: ['shift-stats', calMonth, calYear],
    queryFn: () => shiftService.getStats(calMonth, calYear),
    enabled: activeTab === 'calendar' && isManagerOrAbove,
  });

  // My assignments
  const { data: myAssignmentsData, isLoading: myLoading } = useQuery({
    queryKey: ['my-assignments', myPage, myStatusFilter],
    queryFn: () =>
      shiftService.getMyAssignments({
        pageNumber: myPage,
        pageSize: 20,
        status: myStatusFilter ? (Number(myStatusFilter) as AssignmentStatus) : undefined,
      }),
    enabled: activeTab === 'myShifts',
  });

  // Swap requests
  const { data: swapsData, isLoading: swapsLoading } = useQuery({
    queryKey: ['swap-requests', swapPage, swapStatusFilter],
    queryFn: () =>
      shiftService.getSwapRequests({
        pageNumber: swapPage,
        pageSize: 20,
        status: swapStatusFilter ? (Number(swapStatusFilter) as SwapStatus) : undefined,
      }),
    enabled: activeTab === 'swaps',
  });

  // Agents for swap modal
  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => userService.getAll({ role: UserRole.Agent, pageSize: 100 }),
    enabled: showSwapModal,
  });
  const agents = agentsData?.items || [];

  // ===========================
  // MUTATIONS
  // ===========================

  const generateMutation = useMutation({
    mutationFn: (data: { month: number; year: number }) => shiftService.generateSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['shift-schedule-detail'] });
      setShowGenerateModal(false);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => shiftService.publishSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['shift-schedule-detail'] });
    },
  });

  const lockMutation = useMutation({
    mutationFn: (id: string) => shiftService.lockSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['shift-schedule-detail'] });
    },
  });

  const attendMutation = useMutation({
    mutationFn: (id: string) => shiftService.attendAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['shift-schedule-detail'] });
    },
  });

  const createSwapMutation = useMutation({
    mutationFn: () =>
      shiftService.createSwapRequest({
        originalAssignmentId: swapAssignmentId,
        proposedAgentId: swapAgentId,
        reason: swapReason || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swap-requests'] });
      setShowSwapModal(false);
      setSwapAssignmentId('');
      setSwapAgentId('');
      setSwapReason('');
    },
  });

  const approveSwapMutation = useMutation({
    mutationFn: (id: string) => shiftService.approveSwap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swap-requests'] });
      queryClient.invalidateQueries({ queryKey: ['shift-schedule-detail'] });
      queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
    },
  });

  const rejectSwapMutation = useMutation({
    mutationFn: (id: string) => shiftService.rejectSwap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swap-requests'] });
    },
  });

  // ===========================
  // CALENDAR HELPERS
  // ===========================

  const assignments = scheduleDetail?.assignments || [];

  // Filter by development if selected
  const filteredAssignments = selectedDevelopmentId
    ? assignments.filter((a) => a.developmentId === selectedDevelopmentId)
    : assignments;

  // Build supervisor color map
  const supervisorColorMap = useMemo(() => {
    const map = new Map<string, string>();
    const uniqueSupervisors = [...new Set(assignments.map((a) => a.supervisorId))];
    uniqueSupervisors.forEach((id, index) => {
      map.set(id, SupervisorColors[index % SupervisorColors.length]);
    });
    return map;
  }, [assignments]);

  // Get supervisor legend
  const supervisorLegend = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();
    assignments.forEach((a) => {
      if (!map.has(a.supervisorId)) {
        map.set(a.supervisorId, {
          name: a.supervisorName,
          color: supervisorColorMap.get(a.supervisorId) || SupervisorColors[0],
        });
      }
    });
    return Array.from(map.values());
  }, [assignments, supervisorColorMap]);

  // Group assignments by date
  const assignmentsByDate = useMemo(() => {
    const map = new Map<string, ShiftAssignmentDto[]>();
    filteredAssignments.forEach((a) => {
      const existing = map.get(a.date) || [];
      existing.push(a);
      map.set(a.date, existing);
    });
    return map;
  }, [filteredAssignments]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month - 1, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  // ===========================
  // TABS CONFIG
  // ===========================

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; visible: boolean }[] = [
    {
      key: 'calendar',
      label: 'Calendario',
      icon: <CalendarIcon className="w-4 h-4" />,
      visible: isSupervisorOrAbove,
    },
    {
      key: 'myShifts',
      label: 'Mis Guardias',
      icon: <Clock className="w-4 h-4" />,
      visible: true,
    },
    {
      key: 'swaps',
      label: 'Intercambios',
      icon: <ArrowRightLeft className="w-4 h-4" />,
      visible: isSupervisorOrAbove,
    },
  ];

  const visibleTabs = tabs.filter((t) => t.visible);

  // ===========================
  // RENDER
  // ===========================

  const renderCalendarTab = () => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfWeek(calYear, calMonth);

    return (
      <div className="space-y-4">
        {/* Month Navigation + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {monthNames[calMonth - 1]} {calYear}
            </h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Development filter */}
            <select
              value={selectedDevelopmentId}
              onChange={(e) => setSelectedDevelopmentId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los desarrollos</option>
              {developments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {isSupervisorOrAbove && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowGenerateModal(true)}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Generar
                </Button>
                {currentSchedule?.status === ScheduleStatus.Draft && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (window.confirm('¿Publicar este calendario?')) {
                        publishMutation.mutate(currentSchedule.id);
                      }
                    }}
                    disabled={publishMutation.isPending}
                  >
                    {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Publicar
                  </Button>
                )}
                {currentSchedule?.status === ScheduleStatus.Published && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('¿Bloquear este calendario? No se podrán hacer más cambios.')) {
                        lockMutation.mutate(currentSchedule.id);
                      }
                    }}
                    disabled={lockMutation.isPending}
                  >
                    {lockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Bloquear
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Schedule status badge */}
        {currentSchedule && (
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm rounded-full ${ScheduleStatusColors[currentSchedule.status]}`}>
              {ScheduleStatusLabels[currentSchedule.status]}
            </span>
            <span className="text-sm text-gray-500">
              Generado por {currentSchedule.generatedByName} — {currentSchedule.totalAssignments} asignaciones
            </span>
          </div>
        )}

        {/* Supervisor Legend */}
        {supervisorLegend.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500 mr-1">Supervisores:</span>
            {supervisorLegend.map((s) => (
              <span key={s.name} className={`px-2 py-1 text-xs rounded ${s.color}`}>
                {s.name}
              </span>
            ))}
          </div>
        )}

        {/* Calendar Grid */}
        {schedulesLoading || detailLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : !currentSchedule ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay calendario para {monthNames[calMonth - 1]} {calYear}</p>
                {isSupervisorOrAbove && (
                  <Button onClick={() => setShowGenerateModal(true)} className="mt-2">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Generar Calendario
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-0">
              <div className="grid grid-cols-7">
                {/* Day headers */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-sm text-gray-700 border border-gray-200 bg-gray-50">
                    {day}
                  </div>
                ))}

                {/* Empty cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-1 border border-gray-100 bg-gray-50" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayAssignments = assignmentsByDate.get(dateStr) || [];
                  const isToday =
                    day === now.getDate() && calMonth === now.getMonth() + 1 && calYear === now.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`min-h-[100px] p-1 border border-gray-100 ${isToday ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-700 font-bold' : 'text-gray-700'}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayAssignments.slice(0, 4).map((a) => (
                          <div
                            key={a.id}
                            className={`text-[10px] px-1 py-0.5 rounded truncate cursor-default ${supervisorColorMap.get(a.supervisorId) || 'bg-gray-200 text-gray-800'}`}
                            title={`${ShiftTypeLabels[a.shiftType]} — ${a.agentName} (Sup: ${a.supervisorName}) — ${a.developmentName} — ${AssignmentStatusLabels[a.status]}`}
                          >
                            {ShiftTypeLabels[a.shiftType].substring(0, 3)} · {a.agentName.split(' ')[0]}
                          </div>
                        ))}
                        {dayAssignments.length > 4 && (
                          <div className="text-[10px] text-gray-500 px-1">+{dayAssignments.length - 4} más</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Stats (Manager+) */}
        {isManagerOrAbove && statsData && statsData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Estadísticas por Supervisor</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Asignados</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Completados</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ausentes</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Adherencia</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statsData.map((stat: ShiftStatsDto) => (
                      <tr key={stat.supervisorId}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.supervisorName}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{stat.totalAssigned}</td>
                        <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{stat.completed}</td>
                        <td className="px-4 py-3 text-sm text-center text-red-600 font-medium">{stat.absent}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stat.adherencePercentage >= 80
                              ? 'bg-green-100 text-green-800'
                              : stat.adherencePercentage >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {stat.adherencePercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  const renderMyShiftsTab = () => {
    const items = myAssignmentsData?.items || [];
    const totalPages = myAssignmentsData?.totalPages || 0;

    return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={myStatusFilter}
            onChange={(e) => { setMyStatusFilter(e.target.value); setMyPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {Object.entries(AssignmentStatusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Assignments list */}
        {myLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tienes guardias asignadas</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((a: ShiftAssignmentDto) => {
              const dateObj = new Date(a.date + 'T12:00:00');
              const isToday = a.date === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

              return (
                <Card key={a.id}>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            {dateObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </h4>
                          {isToday && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800 font-medium">Hoy</span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${AssignmentStatusColors[a.status]}`}>
                            {AssignmentStatusLabels[a.status]}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${ShiftTypeColors[a.shiftType]}`}>
                            {ShiftTypeLabels[a.shiftType]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Desarrollo: <span className="font-medium">{a.developmentName}</span></span>
                          <span>Supervisor: <span className="font-medium">{a.supervisorName}</span></span>
                        </div>
                        {a.attendedAt && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Asistencia: {new Date(a.attendedAt).toLocaleString('es-MX')}
                          </div>
                        )}
                        {a.notes && <p className="text-sm text-gray-500 mt-1">{a.notes}</p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {a.status === AssignmentStatus.Assigned && (
                          <Button
                            size="sm"
                            onClick={() => {
                              if (window.confirm('¿Confirmar asistencia a esta guardia?')) {
                                attendMutation.mutate(a.id);
                              }
                            }}
                            disabled={attendMutation.isPending}
                          >
                            {attendMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Asistencia
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Página {myPage} de {totalPages} ({myAssignmentsData?.totalCount} registros)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setMyPage(myPage - 1)} disabled={myPage <= 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMyPage(myPage + 1)} disabled={myPage >= totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSwapsTab = () => {
    const items = swapsData?.items || [];
    const totalPages = swapsData?.totalPages || 0;

    return (
      <div className="space-y-4">
        {/* Filters + actions */}
        <div className="flex items-center justify-between">
          <select
            value={swapStatusFilter}
            onChange={(e) => { setSwapStatusFilter(e.target.value); setSwapPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {Object.entries(SwapStatusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {isSupervisorOrAbove && (
            <Button size="sm" onClick={() => setShowSwapModal(true)}>
              <ArrowRightLeft className="w-4 h-4 mr-1" />
              Solicitar Intercambio
            </Button>
          )}
        </div>

        {/* Swap requests table */}
        {swapsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay solicitudes de intercambio</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Guardia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desarrollo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agente Original</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agente Propuesto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitado por</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((swap: ShiftSwapRequestDto) => (
                      <tr key={swap.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{swap.originalAssignment.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{swap.originalAssignment.developmentName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${ShiftTypeColors[swap.originalAssignment.shiftType]}`}>
                            {ShiftTypeLabels[swap.originalAssignment.shiftType]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{swap.originalAssignment.agentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{swap.proposedAgentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{swap.requestedByName}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate" title={swap.reason || ''}>
                          {swap.reason || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${SwapStatusColors[swap.status]}`}>
                            {SwapStatusLabels[swap.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {swap.status === SwapStatus.Pending && isSupervisorOrAbove && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (window.confirm('¿Aprobar este intercambio?')) {
                                    approveSwapMutation.mutate(swap.id);
                                  }
                                }}
                                disabled={approveSwapMutation.isPending}
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (window.confirm('¿Rechazar este intercambio?')) {
                                    rejectSwapMutation.mutate(swap.id);
                                  }
                                }}
                                disabled={rejectSwapMutation.isPending}
                              >
                                Rechazar
                              </Button>
                            </div>
                          )}
                          {swap.status === SwapStatus.Approved && swap.approvedByName && (
                            <span className="text-xs text-gray-500">Por: {swap.approvedByName}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Página {swapPage} de {totalPages} ({swapsData?.totalCount} registros)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSwapPage(swapPage - 1)} disabled={swapPage <= 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSwapPage(swapPage + 1)} disabled={swapPage >= totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Guardias</h1>
        <p className="text-gray-500 mt-1">Gestiona los calendarios de guardias, asignaciones e intercambios</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'calendar' && isSupervisorOrAbove && renderCalendarTab()}
      {activeTab === 'myShifts' && renderMyShiftsTab()}
      {activeTab === 'swaps' && isSupervisorOrAbove && renderSwapsTab()}

      {/* Generate Schedule Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowGenerateModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Generar Calendario</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                  <select
                    value={genMonth}
                    onChange={(e) => setGenMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {monthNames.map((name, i) => (
                      <option key={i} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <select
                    value={genYear}
                    onChange={(e) => setGenYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[calYear - 1, calYear, calYear + 1].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                {generateMutation.isError && (
                  <p className="text-sm text-red-600">
                    {(generateMutation.error as Error)?.message || 'Error al generar el calendario'}
                  </p>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => generateMutation.mutate({ month: genMonth, year: genYear })}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Generando...</>
                  ) : (
                    'Generar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowSwapModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Solicitar Intercambio</h3>
                <button onClick={() => setShowSwapModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignación a intercambiar <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={swapAssignmentId}
                    onChange={(e) => setSwapAssignmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar asignación...</option>
                    {(scheduleDetail?.assignments || [])
                      .filter((a) => a.status === AssignmentStatus.Assigned)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.date} — {ShiftTypeLabels[a.shiftType]} — {a.agentName} — {a.developmentName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agente propuesto <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={swapAgentId}
                    onChange={(e) => setSwapAgentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar agente...</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <textarea
                    value={swapReason}
                    onChange={(e) => setSwapReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Motivo del intercambio..."
                  />
                </div>
                {createSwapMutation.isError && (
                  <p className="text-sm text-red-600">
                    {(createSwapMutation.error as Error)?.message || 'Error al crear la solicitud'}
                  </p>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowSwapModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => createSwapMutation.mutate()}
                  disabled={createSwapMutation.isPending || !swapAssignmentId || !swapAgentId}
                >
                  {createSwapMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Solicitando...</>
                  ) : (
                    'Solicitar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
