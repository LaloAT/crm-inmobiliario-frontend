export interface Organization {
  id: string;
  name: string;
  type: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  type: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> {}
