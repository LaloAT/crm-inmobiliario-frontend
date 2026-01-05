import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card, CardBody } from '../../components/ui';
import { Building2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data);

      // Pequeño delay para que React actualice el estado
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            CRM Inmobiliario
          </h1>
          <p className="text-primary-100">
            Grupo Terranova
          </p>
        </div>

        {/* Card de Login */}
        <Card>
          <CardBody className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Iniciar Sesión
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="usuario@ejemplo.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <a
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer de la página */}
        <p className="text-center text-primary-100 text-sm mt-6">
          &copy; {new Date().getFullYear()} Grupo Terranova. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
