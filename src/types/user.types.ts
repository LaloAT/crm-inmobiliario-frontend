export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  password: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
