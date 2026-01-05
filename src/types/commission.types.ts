export interface Commission {
  id: string;
  dealId: string;
  userId: string;
  amount: number;
  percentage: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  dueDate?: string;
  paidDate?: string | null;
  notes?: string;
  deal?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionDto {
  dealId: string;
  userId: string;
  amount: number;
  percentage: number;
  status?: 'PENDING' | 'APPROVED' | 'PAID';
  dueDate?: string;
  paidDate?: string | null;
  notes?: string;
}

export interface UpdateCommissionDto extends Partial<CreateCommissionDto> {}
