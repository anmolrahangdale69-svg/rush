// Bokde Travels - Core Type Definitions

export type TripType = 'oneway' | 'roundtrip' | 'local' | 'airport' | 'outstation-oneway';
export type AirportTransferType = 'pickup' | 'drop';
export type PaymentMethod = 'cod' | 'upi';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type VehicleVisualId = 
  | 'kia-carens'
  | 'maruti-ertiga'
  | 'suzuki-dzire'
  | 'toyota-innova-crysta';

export interface VehicleConfig {
  id: string;
  name: string;
  model: string;
  category: 'Sedan' | 'MUV' | 'Premium MPV';
  passengers: number;
  luggage: number;
  ac: boolean;
  oneWayRate: number;       // ₹/km (Single)
  roundTripRate: number;    // ₹/km (Round)
  localHourlyRate: number;  // ₹/hr (Local city)
  visualId: VehicleVisualId;
  imageUrl: string;
  description: string;
  features: string[];
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  estimatedKm: number;
  distanceKm?: number;
  duration?: string;
  description: string;
  via: string;
}

export interface RouteCalculationResult {
  success: boolean;
  distanceKm: number;
  durationText?: string;
  fromFormatted?: string;
  toFormatted?: string;
  error?: string;
}

export interface BookingSubmission {
  id?: string;
  bookingReference: string;
  tripType: TripType;
  airportTransferType?: AirportTransferType;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  distanceKm: number;
  vehicleId?: string;
  vehicleName: string;
  perKmRate?: number;
  estimatedFare?: number;
  tollNote?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;

  // Optional compatibility fields for legacy views
  tourId?: string;
  tourTitle?: string;
  destination?: string;
  departureDate?: string;
  travelerCount?: number;
  selectedAddons?: any[];
  basePrice?: number;
  addonsTotal?: number;
  taxAmount?: number;
  totalPrice?: number;
  currency?: string;
}

export interface OwnerEmailNotification {
  id: string;
  bookingReference: string;
  toEmail: string;
  subject: string;
  sentAt: string;
  status: 'delivered' | 'simulated' | 'queued';
  htmlPreview: string;
  bookingData: BookingSubmission;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SearchFilters {
  destination: string;
  category: string;
  seasonOrMonth: string;
  maxBudget: number;
  minDuration: number;
  guestsCount: number;
  sortBy: string;
}

export type TravelCategory = 'All' | 'Outstation' | 'Airport' | 'Local' | 'Round Trip';

export interface Tour {
  id: string;
  title: string;
  category: string;
  destination: string;
  durationDays: number;
  pricePerPerson: number;
  currency: CurrencyCode;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  overview: string;
  highlights: string[];
  included: string[];
  itinerary: { day: number; title: string; desc: string }[];
  availableDates: string[];
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}
