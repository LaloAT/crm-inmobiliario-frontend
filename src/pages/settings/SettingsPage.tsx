import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button, Input } from '../../components/ui';
import { Loader2, User, Building2, Bell, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import { organizationService } from '../../services/organization.service';
import { UserRole, UserRoleLabels } from '../../types/user.types';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Determine if user can manage org (SystemAdmin, OrgAdmin, Director, Manager)
  const canManageOrg = user && user.role <= UserRole.Manager;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tu perfil y preferencias</p>
      </div>

      {/* Profile Section */}
      {user && <ProfileSection userId={user.id} />}

      {/* Organization Section */}
      {canManageOrg && user && <OrganizationSection organizationId={user.organizationId} />}

      {/* Preferences Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Preferencias</h2>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 text-sm">
            Proximamente: notificaciones, tema, idioma
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// ─── Profile Section ──────────────────────────────────────────────

function ProfileSection({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getById(userId),
  });

  // ── Name form state ──
  const [fullName, setFullName] = useState('');
  const [nameInitialized, setNameInitialized] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  if (profile && !nameInitialized) {
    setFullName(profile.fullName);
    setNameInitialized(true);
  }

  const nameMutation = useMutation({
    mutationFn: () => userService.update(userId, { fullName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    },
  });

  // ── Password form state ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: () =>
      userService.update(userId, { password: newPassword }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: () => {
      setPasswordError('Error al cambiar la contraseña. Verifica tus datos.');
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    if (!currentPassword) {
      setPasswordError('Ingresa tu contraseña actual');
      return;
    }

    passwordMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!profile) return null;

  const roleLabel =
    UserRoleLabels[profile.role as UserRole] ?? `Rol ${profile.role}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Perfil del Usuario</h2>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {/* Read-only info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Nombre</p>
              <p className="text-sm text-gray-900 mt-1">{profile.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
              <p className="text-sm text-gray-900 mt-1">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Rol</p>
              <p className="text-sm text-gray-900 mt-1">{roleLabel}</p>
            </div>
          </div>

          {/* Edit name */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nameMutation.mutate();
            }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-700">Editar Nombre</h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="Nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={nameMutation.isPending || fullName === profile.fullName}>
                {nameMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
            {nameSuccess && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Nombre actualizado
              </p>
            )}
            {nameMutation.isError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Error al actualizar el nombre
              </p>
            )}
          </form>

          {/* Change password */}
          <form onSubmit={handlePasswordSubmit} className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Cambiar Contraseña</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Contraseña actual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Contraseña actualizada
              </p>
            )}
            <div>
              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Organization Section ─────────────────────────────────────────

function OrganizationSection({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => organizationService.getById(organizationId),
  });

  const [orgName, setOrgName] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [success, setSuccess] = useState(false);

  if (org && !initialized) {
    setOrgName(org.name);
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: () => organizationService.update(organizationId, { name: orgName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!org) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Organización</h2>
        </div>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3"
        >
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Nombre de la organización"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={mutation.isPending || orgName === org.name}>
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
          {success && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Organización actualizada
            </p>
          )}
          {mutation.isError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Error al actualizar la organización
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
