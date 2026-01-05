export interface Deal {
  id: number;
  title: string;
  description?: string;
  stage: DealStage;
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  leadId?: number;
  lead?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  propertyId?: number;
  property?: {
    id: number;
    title: string;
    price: number;
  };
  assignedTo?: number;
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  activities: DealActivity[];
  organizationId: number;
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum DealStage {
  LEAD = 'LEAD',
  CONTACT_MADE = 'CONTACT_MADE',
  NEEDS_IDENTIFIED = 'NEEDS_IDENTIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST'
}

export interface DealActivity {
  id: number;
  dealId: number;
  type: ActivityType;
  subject: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  createdBy: number;
  createdAt: string;
}

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE',
  VISIT = 'VISIT'
}

export interface CreateDealRequest {
  title: string;
  description?: string;
  stage: DealStage;
  value: number;
  currency: string;
  probability?: number;
  expectedCloseDate?: string;
  leadId?: number;
  propertyId?: number;
  assignedTo?: number;
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {}
