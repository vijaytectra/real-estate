export type UserRole = "buyer" | "seller" | "admin";

export type PropertyConfig = "1BHK" | "2BHK" | "3BHK" | "4BHK";

export type PossessionPeriod = "ready" | "6months" | "1year" | "2years";

export type PropertyStatus = "pending" | "approved" | "rejected";

export type AppointmentType = "videoCall" | "siteVisit";

export type AppointmentStatus = "scheduled" | "approved" | "completed" | "cancelled";

export type ViewMode = "grid" | "list" | "map";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  favorites: string[];
  registrationPaid: boolean;
  createdAt: string;
}

export interface PropertyLocation {
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  location: PropertyLocation;
  config: PropertyConfig;
  possessionPeriod: PossessionPeriod;
  possessionDate: string;
  amenities: string[];
  images: string[];
  flatVideoUrl: string;
  buildingVideoUrl: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  status: PropertyStatus;
  isPremium: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  type: AppointmentType;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "property" | "system";
  read: boolean;
  createdAt: string;
}

export interface Filters {
  search: string;
  city: string;
  config: PropertyConfig | "";
  budgetMin: number;
  budgetMax: number;
  possessionPeriod: PossessionPeriod | "";
  status: PropertyStatus | "";
}

export interface CreatePropertyDTO {
  name: string;
  description: string;
  price: number;
  location: PropertyLocation;
  config: PropertyConfig;
  possessionPeriod: PossessionPeriod;
  possessionDate: string;
  amenities: string[];
  images: string[];
  flatVideoUrl: string;
  buildingVideoUrl: string;
  isPremium: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
}
