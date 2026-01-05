export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  preferences?: LeadPreferences;
  notes?: string;
  assignedTo?: number;
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  organizationId: number;
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ADVERTISING = 'ADVERTISING',
  WALK_IN = 'WALK_IN',
  PHONE_CALL = 'PHONE_CALL',
  EMAIL = 'EMAIL',
  OTHER = 'OTHER'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export interface LeadPreferences {
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  locations?: string[];
  features?: string[];
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status?: LeadStatus;
  preferences?: LeadPreferences;
  notes?: string;
  assignedTo?: number;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {}
