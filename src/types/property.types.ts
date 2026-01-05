export interface Property {
  id: number;
  title: string;
  description?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  images: PropertyImage[];
  priceHistory: PriceHistory[];
  organizationId: number;
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  OTHER = 'OTHER'
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface PropertyImage {
  id: number;
  url: string;
  isPrimary: boolean;
  order: number;
  propertyId: number;
  createdAt: string;
}

export interface PriceHistory {
  id: number;
  propertyId: number;
  oldPrice: number;
  newPrice: number;
  changeDate: string;
  reason?: string;
  createdBy: number;
}

export interface CreatePropertyRequest {
  title: string;
  description?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}
