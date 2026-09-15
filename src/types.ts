export type TravelCategory = 
  | 'All'
  | 'Luxury'
  | 'Adventure'
  | 'Cultural'
  | 'Beach & Coast'
  | 'Eco & Wildlife'
  | 'Wellness';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  stay: string;
}

export interface TourReview {
  id: string;
  userName: string;
  userAvatar: string;
  userCountry: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  destination: string;
  country: string;
  region: string;
  category: TravelCategory;
  tag: string; // e.g. "Bestseller", "Rare Wildlife", "Private Villa"
  heroImage: string;
  galleryImages: string[];
  durationDays: number;
  durationNights: number;
  pricePerPerson: number; // in USD
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Active';
  featured: boolean;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: TourItineraryDay[];
  availableDates: string[];
  reviews: TourReview[];
}

export interface SearchFilters {
  destination: string;
  category: TravelCategory;
  seasonOrMonth: string;
  maxBudget: number;
  minDuration: number;
  guestsCount: number;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'duration' | 'rating';
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  selected?: boolean;
}

export type TripType = 'city' | 'outstation-oneway' | 'outstation-round';

export interface RideOption {
  id: string;
  vehicleName: string;
  vehicleType: 'mini-cab' | 'sedan' | 'suv' | 'six-seven-seater' | 'outstation-cab';
  pricePerKm: number;
  baseFare: number;
  capacity: string;
  description: string;
  eta: string;
  highlightBadge?: string;
  illustration: string;
}

export interface CabRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  estDuration: string;
  startingFare: number;
  description: string;
  tag?: string;
  highlight: string;
}

export interface TripSearchQuery {
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  pickupTime?: string;
  passengers: number;
  tripType: TripType;
}

export interface BookingSubmission {
  id?: string;
  bookingReference: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  departureDate: string;
  travelerCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  selectedAddons: BookingAddon[];
  basePrice: number;
  addonsTotal: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  // Cab specific details
  pickupLocation?: string;
  dropLocation?: string;
  pickupTime?: string;
  tripType?: TripType;
  distanceKm?: number;
  vehicleName?: string;
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

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}
