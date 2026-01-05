import { z } from 'zod';
import { UserRole } from '../types/user.types';

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  fullName: z.string().min(1, 'El nombre completo es requerido'),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
