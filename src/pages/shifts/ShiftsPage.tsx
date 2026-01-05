import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  Loader2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { shiftService } from '../../services/shift.service';
import { ShiftModal } from './ShiftModal';
import type { Shift } from '../../types/shift.types';

export const ShiftsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('list');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch calendar data
  const { data: calendarData, isLoading, isError: calendarError } = useQuery({
    queryKey: ['shifts', 'calendar', year, month + 1],
    queryFn: () => shiftService.getCalendar(month + 1, year),
    retry: false,
    enabled: view === 'calendar', // Only fetch when calendar view is active
  });

  // Fetch my shifts
  const { data: myShiftsData } = useQuery({
    queryKey: ['shifts', 'my'],
    queryFn: () => shiftService.getMy(),
    retry: false,
  });

  // Combine all shifts for display (upcoming, today, past)
  const myShifts = [
    ...(myShiftsData?.today || []),
    ...(myShiftsData?.upcoming || []),
    ...(myShiftsData?.past || []),
  ];

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (shiftId: string) =>
      shiftService.checkIn(shiftId, {
        checkInTime: new Date().toISOString(),
        checkInNotes: '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: (shiftId: string) =>
      shiftService.checkOut(shiftId, {
        checkOutTime: new Date().toISOString(),
        checkOutNotes: '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleCreate = () => {
    setSelectedShift(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedShift(null);
  };

  const handleCheckIn = (shiftId: string) => {
    if (confirm('¿Confirmar entrada?')) {
      checkInMutation.mutate(shiftId);
    }
  };

  const handleCheckOut = (shiftId: string) => {
    if (confirm('¿Confirmar salida?')) {
      checkOutMutation.mutate(shiftId);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      1: 'bg-gray-100 text-gray-800', // Scheduled
      2: 'bg-blue-100 text-blue-800', // Active
      3: 'bg-green-100 text-green-800', // Completed
      4: 'bg-red-100 text-red-800', // Cancelled
      5: 'bg-yellow-100 text-yellow-800', // NoShow
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: number) => {
    const labels: Record<number, string> = {
      1: 'Programado',
      2: 'Activo',
      3: 'Completado',
      4: 'Cancelado',
      5: 'No asistió',
    };
    return labels[status] || 'Desconocido';
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-2 border border-gray-100" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayShifts = calendarData?.filter(
        (shift) => shift.shiftDate.split('T')[0] === dateStr
      ) || [];

      days.push(
        <div
          key={day}
          className="aspect-square p-2 border border-gray-100 hover:bg-gray-50 overflow-hidden"
        >
          <div className="font-medium text-sm text-gray-900 mb-1">{day}</div>
          <div className="space-y-1">
            {dayShifts.slice(0, 3).map((shift) => (
              <div
                key={shift.id}
                className="text-xs px-2 py-1 rounded cursor-pointer bg-primary-50 text-primary-700 truncate"
                onClick={() => handleEdit(shift)}
                title={`${shift.user?.fullName || 'Usuario'} - ${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}`}
              >
                {shift.user?.fullName || 'Usuario'}
              </div>
            ))}
            {dayShifts.length > 3 && (
              <div className="text-xs text-gray-500 px-2">
                +{dayShifts.length - 3} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turnos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona los turnos y horarios del equipo
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {view === 'calendar' ? 'Ver Lista' : 'Ver Calendario'}
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Turno
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <>
          {/* Calendar Controls */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handlePrevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {formatDate(currentDate)}
                </h2>
                <Button variant="outline" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardBody>
              {calendarError ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">El calendario no está disponible en este momento</p>
                  <p className="text-sm text-gray-400">Usa la vista de lista para ver tus turnos</p>
                  <Button
                    variant="outline"
                    onClick={() => setView('list')}
                    className="mt-4"
                  >
                    Ver Lista
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-0">
                  {/* Day headers */}
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center font-semibold text-sm text-gray-700 border border-gray-200 bg-gray-50"
                    >
                      {day}
                    </div>
                  ))}
                  {/* Calendar days */}
                  {renderCalendar()}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          {/* My Shifts - List View */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Turnos
              </h3>
            </CardHeader>
            <CardBody>
              {!myShifts || myShifts.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes turnos asignados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {new Date(shift.shiftDate).toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              shift.status
                            )}`}
                          >
                            {getStatusLabel(shift.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                          </div>
                          {shift.checkInTime && (
                            <div className="flex items-center gap-1 text-green-600">
                              <LogIn className="w-4 h-4" />
                              Entrada: {formatTime(shift.checkInTime)}
                            </div>
                          )}
                          {shift.checkOutTime && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <LogOut className="w-4 h-4" />
                              Salida: {formatTime(shift.checkOutTime)}
                            </div>
                          )}
                        </div>
                        {shift.notes && (
                          <p className="text-sm text-gray-500 mt-2">{shift.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {shift.status === 2 && !shift.checkInTime && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(shift.id)}
                            disabled={checkInMutation.isPending}
                          >
                            <LogIn className="w-4 h-4 mr-1" />
                            Entrada
                          </Button>
                        )}
                        {shift.status === 2 && shift.checkInTime && !shift.checkOutTime && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(shift.id)}
                            disabled={checkOutMutation.isPending}
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            Salida
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}

      {/* Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        shift={selectedShift}
      />
    </div>
  );
};
