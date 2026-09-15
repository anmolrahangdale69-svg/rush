import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  Check, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Info,
  Users,
  ArrowRight,
  Car
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export interface CabRideOption {
  id: string;
  name: string;
  type: 'mini-cab' | 'sedan' | 'suv' | 'six-seven-seater' | 'outstation-cab';
  pricePerKm: number;
  baseFare: number;
  capacity: string;
  seatsCount: number;
  description: string;
  eta: string;
  highlightBadge?: string;
}

export const RIDE_OPTIONS: CabRideOption[] = [
  {
    id: 'ride-mini-cab',
    name: 'Mini Cab',
    type: 'mini-cab',
    pricePerKm: 12,
    baseFare: 20,
    capacity: '4 seats',
    seatsCount: 4,
    description: 'Affordable everyday travel',
    eta: '3 min away',
    highlightBadge: 'Everyday Saver'
  },
  {
    id: 'ride-sedan',
    name: 'Sedan',
    type: 'sedan',
    pricePerKm: 15,
    baseFare: 30,
    capacity: '4 seats',
    seatsCount: 4,
    description: 'Comfortable rides for city and highway travel',
    eta: '4 min away',
    highlightBadge: 'Most Popular'
  },
  {
    id: 'ride-suv',
    name: 'SUV',
    type: 'suv',
    pricePerKm: 20,
    baseFare: 40,
    capacity: '6 seats',
    seatsCount: 6,
    description: 'More space for families and luggage',
    eta: '5 min away',
    highlightBadge: 'Spacious & Luggage'
  },
  {
    id: 'ride-six-seven-seater',
    name: '6/7 Seater',
    type: 'six-seven-seater',
    pricePerKm: 24,
    baseFare: 50,
    capacity: '6–7 seats',
    seatsCount: 7,
    description: 'Perfect for families and groups',
    eta: '6 min away',
    highlightBadge: 'Family & Group'
  },
  {
    id: 'ride-outstation-cab',
    name: 'Outstation Cab',
    type: 'outstation-cab',
    pricePerKm: 14,
    baseFare: 100,
    capacity: '4–6 seats',
    seatsCount: 6,
    description: 'Comfortable travel between cities',
    eta: '15 min away',
    highlightBadge: 'Highway Long Drive'
  }
];

// Bespoke, original SVG illustrations for Indian cab categories
export const CabVehicleIllustration: React.FC<{ type: CabRideOption['type']; isSelected: boolean }> = ({ type, isSelected }) => {
  const primaryColor = isSelected ? '#d97706' : '#292524';
  const secondaryColor = isSelected ? '#b45309' : '#44403c';
  const windowColor = isSelected ? '#fed7aa' : '#e7e5e4';

  switch (type) {
    case 'mini-cab':
      // Compact City Hatchback
      return (
        <svg viewBox="0 0 140 85" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105 select-none" aria-label="Mini Cab Illustration">
          <ellipse cx="70" cy="74" rx="55" ry="4.5" fill="#e7e5e4" />
          {/* Wheels */}
          <circle cx="36" cy="65" r="13" fill="#1c1917" />
          <circle cx="36" cy="65" r="6.5" fill="#a8a29e" />
          <circle cx="104" cy="65" r="13" fill="#1c1917" />
          <circle cx="104" cy="65" r="6.5" fill="#a8a29e" />
          {/* Body */}
          <path d="M18 52 C20 46 28 42 42 42 L56 26 C62 20 74 19 92 20 L108 34 C116 36 122 42 122 52 C122 61 116 64 108 64 L30 64 C20 64 18 59 18 52 Z" fill={primaryColor} />
          {/* Windows */}
          <path d="M58 28 L72 28 L72 40 L45 40 Z" fill={windowColor} />
          <path d="M76 28 L91 28 L104 40 L76 40 Z" fill={windowColor} />
          {/* Headlight & Taillight */}
          <path d="M118 48 L122 50 L122 56 L117 56 Z" fill="#f59e0b" />
          <path d="M18 48 L22 48 L22 56 L18 54 Z" fill="#ef4444" />
          {/* Door line */}
          <line x1="74" y1="28" x2="74" y2="62" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="46" x2="56" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="46" x2="90" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'sedan':
      // Streamlined Sedan
      return (
        <svg viewBox="0 0 150 85" className="w-22 h-14 sm:w-26 sm:h-16 transition-transform duration-300 group-hover:scale-105 select-none" aria-label="Sedan Illustration">
          <ellipse cx="75" cy="74" rx="64" ry="4.5" fill="#e7e5e4" />
          {/* Wheels */}
          <circle cx="38" cy="65" r="13" fill="#1c1917" />
          <circle cx="38" cy="65" r="6" fill="#a8a29e" />
          <circle cx="114" cy="65" r="13" fill="#1c1917" />
          <circle cx="114" cy="65" r="6" fill="#a8a29e" />
          {/* Sedan Sleek Body */}
          <path d="M12 52 C14 46 22 42 38 42 L52 24 C58 18 84 18 100 24 L118 42 L132 44 C138 46 140 54 138 62 L24 62 C15 62 12 58 12 52 Z" fill={primaryColor} />
          {/* Front & Rear Windows */}
          <path d="M54 26 L73 26 L73 40 L40 40 Z" fill={windowColor} />
          <path d="M77 26 L98 26 L114 40 L77 40 Z" fill={windowColor} />
          {/* Lights */}
          <path d="M134 46 L139 50 L137 56 L131 54 Z" fill="#f59e0b" />
          <path d="M12 48 L17 48 L17 56 L13 54 Z" fill="#ef4444" />
          {/* Door & Handles */}
          <line x1="75" y1="26" x2="75" y2="60" stroke={secondaryColor} strokeWidth="2" />
          <line x1="48" y1="46" x2="56" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="46" x2="92" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'suv':
      // Tall, rugged Indian SUV
      return (
        <svg viewBox="0 0 150 85" className="w-22 h-14 sm:w-26 sm:h-16 transition-transform duration-300 group-hover:scale-105 select-none" aria-label="SUV Illustration">
          <ellipse cx="75" cy="76" rx="64" ry="4.5" fill="#e7e5e4" />
          {/* Roof Rail */}
          <rect x="50" y="12" width="58" height="3" rx="1.5" fill="#78716c" />
          <rect x="58" y="15" width="4" height="4" fill="#78716c" />
          <rect x="98" y="15" width="4" height="4" fill="#78716c" />
          {/* High Ground Clearance Wheels */}
          <circle cx="36" cy="65" r="14.5" fill="#1c1917" />
          <circle cx="36" cy="65" r="7" fill="#d6d3d1" />
          <circle cx="114" cy="65" r="14.5" fill="#1c1917" />
          <circle cx="114" cy="65" r="7" fill="#d6d3d1" />
          {/* Tall SUV Body */}
          <path d="M14 54 C15 44 24 38 42 36 L52 18 C56 16 88 16 112 18 L124 36 L134 40 C140 44 140 56 138 63 L26 63 C16 63 14 59 14 54 Z" fill={primaryColor} />
          {/* 3 Windows */}
          <path d="M54 22 L72 22 L72 34 L43 34 Z" fill={windowColor} />
          <path d="M76 22 L94 22 L94 34 L76 34 Z" fill={windowColor} />
          <path d="M98 22 L110 22 L120 34 L98 34 Z" fill={windowColor} />
          {/* Lights */}
          <path d="M133 42 L139 44 L138 52 L132 50 Z" fill="#f59e0b" />
          <path d="M14 46 L18 46 L18 56 L14 54 Z" fill="#ef4444" />
          {/* Door pillars */}
          <line x1="74" y1="22" x2="74" y2="60" stroke={secondaryColor} strokeWidth="2" />
          <line x1="96" y1="22" x2="96" y2="60" stroke={secondaryColor} strokeWidth="2" />
          <line x1="48" y1="42" x2="56" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="42" x2="86" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'six-seven-seater':
      // 6/7 Seater MUV (Innova Style)
      return (
        <svg viewBox="0 0 160 85" className="w-24 h-14 sm:w-28 sm:h-16 transition-transform duration-300 group-hover:scale-105 select-none" aria-label="6/7 Seater MUV Illustration">
          <ellipse cx="80" cy="76" rx="70" ry="4.5" fill="#e7e5e4" />
          {/* Roof rack */}
          <line x1="52" y1="12" x2="124" y2="12" stroke="#78716c" strokeWidth="3" strokeLinecap="round" />
          <line x1="64" y1="12" x2="64" y2="16" stroke="#78716c" strokeWidth="3" />
          <line x1="112" y1="12" x2="112" y2="16" stroke="#78716c" strokeWidth="3" />
          {/* Wheels */}
          <circle cx="36" cy="65" r="14" fill="#1c1917" />
          <circle cx="36" cy="65" r="6.5" fill="#d6d3d1" />
          <circle cx="124" cy="65" r="14" fill="#1c1917" />
          <circle cx="124" cy="65" r="6.5" fill="#d6d3d1" />
          {/* Long MUV body */}
          <path d="M12 54 C13 42 22 36 38 34 L48 16 C52 14 116 14 128 20 L144 38 L148 44 C154 50 152 60 148 63 L24 63 C14 63 12 59 12 54 Z" fill={primaryColor} />
          {/* Windows (3 rows) */}
          <path d="M50 20 L72 20 L72 32 L40 32 Z" fill={windowColor} />
          <path d="M76 20 L102 20 L102 32 L76 32 Z" fill={windowColor} />
          <path d="M106 20 L124 20 L136 32 L106 32 Z" fill={windowColor} />
          {/* Lights */}
          <path d="M145 42 L150 44 L148 52 L143 50 Z" fill="#f59e0b" />
          <path d="M12 44 L16 44 L16 54 L12 52 Z" fill="#ef4444" />
          {/* Door separators */}
          <line x1="74" y1="20" x2="74" y2="60" stroke={secondaryColor} strokeWidth="2" />
          <line x1="104" y1="20" x2="104" y2="60" stroke={secondaryColor} strokeWidth="2" />
          <line x1="52" y1="40" x2="60" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="40" x2="90" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'outstation-cab':
      // Outstation Highway Cruiser with Luggage Carrier
      return (
        <svg viewBox="0 0 160 85" className="w-24 h-14 sm:w-28 sm:h-16 transition-transform duration-300 group-hover:scale-105 select-none" aria-label="Outstation Cab Illustration">
          <ellipse cx="80" cy="76" rx="70" ry="4.5" fill="#e7e5e4" />
          {/* Rooftop Luggage Bags */}
          <rect x="58" y="7" width="22" height="9" rx="2" fill="#d97706" />
          <rect x="84" y="6" width="26" height="10" rx="2" fill="#0284c7" />
          <line x1="50" y1="16" x2="118" y2="16" stroke="#44403c" strokeWidth="3" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="36" cy="65" r="14" fill="#1c1917" />
          <circle cx="36" cy="65" r="6" fill="#a8a29e" />
          <circle cx="124" cy="65" r="14" fill="#1c1917" />
          <circle cx="124" cy="65" r="6" fill="#a8a29e" />
          {/* Touring Body */}
          <path d="M12 52 C14 42 24 38 42 36 L52 18 C56 16 108 16 122 24 L138 40 L146 44 C152 50 150 60 146 63 L24 63 C14 63 12 58 12 52 Z" fill={primaryColor} />
          {/* Tinted Windows */}
          <path d="M54 22 L76 22 L76 34 L42 34 Z" fill={windowColor} />
          <path d="M80 22 L104 22 L104 34 L80 34 Z" fill={windowColor} />
          <path d="M108 22 L120 22 L132 34 L108 34 Z" fill={windowColor} />
          {/* Lights */}
          <path d="M142 44 L148 46 L146 54 L140 52 Z" fill="#f59e0b" />
          <path d="M12 44 L16 44 L16 54 L12 52 Z" fill="#ef4444" />
          {/* Highway Cruiser Stencil / Stripe */}
          <line x1="30" y1="48" x2="134" y2="48" stroke={isSelected ? '#fbbf24' : '#78716c'} strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );
  }
};

interface ChooseYourRideSectionProps {
  initialDistanceKm?: number;
  onBookRide?: (ride: CabRideOption, distanceKm: number, calculatedFare: number) => void;
  selectedPickup?: string;
  selectedDrop?: string;
}

export const ChooseYourRideSection: React.FC<ChooseYourRideSectionProps> = ({
  initialDistanceKm = 15,
  onBookRide,
  selectedPickup,
  selectedDrop
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(initialDistanceKm);
  const [selectedRideId, setSelectedRideId] = useState<string>('ride-sedan');
  const [bookedFeedback, setBookedFeedback] = useState<string | null>(null);

  // Dynamic Fare Calculation Formula: finalFare = baseFare + (distance * pricePerKm)
  const calculateFare = (ride: CabRideOption, dist: number): number => {
    return Math.round(ride.baseFare + dist * ride.pricePerKm);
  };

  const selectedRide = RIDE_OPTIONS.find((r) => r.id === selectedRideId) || RIDE_OPTIONS[1];

  const handleSelectRide = (ride: CabRideOption) => {
    setSelectedRideId(ride.id);
    try {
      soundFx.playClick();
    } catch {
      // Ignore audio error if not supported
    }
  };

  const handleContinueBooking = () => {
    const fare = calculateFare(selectedRide, distanceKm);
    try {
      soundFx.playSuccess();
    } catch {
      // Fallback
    }

    if (onBookRide) {
      onBookRide(selectedRide, distanceKm, fare);
    } else {
      setBookedFeedback(
        `Selected ${selectedRide.name} for ${distanceKm} km (Fare: ₹${fare}). Proceeding to trip confirmation!`
      );
    }
  };

  const distancePresets = [5, 15, 25, 50, 100, 200];

  return (
    <section id="choose-ride" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            <Car className="w-3.5 h-3.5" />
            Reliable Fleet &amp; Simple Rates
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Choose Your Ride
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Comfortable rides. Simple pricing. Easy travel. Real-time transparent rates for local city and outstation journeys.
          </p>

          {(selectedPickup || selectedDrop) && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-700 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedPickup || 'Current Location'}</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span>{selectedDrop || 'Destination'}</span>
            </div>
          )}
        </div>

        {/* Interactive Trip Distance Controller (Dynamic Calculation Driver) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/90 shadow-sm mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Trip Distance
              </span>
              <span className="text-xs text-stone-500">
                Fare formula: <strong className="text-stone-700">Base Fare + (Distance × Price/km)</strong>
              </span>
            </div>

            {/* Stepper & Live Kilometer Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                <button
                  type="button"
                  disabled={distanceKm <= 1}
                  onClick={() => setDistanceKm(Math.max(1, distanceKm - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base shadow-xs cursor-pointer"
                  aria-label="Decrease distance"
                >
                  -
                </button>
                <span className="font-mono text-base sm:text-lg font-bold text-stone-900 px-3 min-w-[70px] text-center">
                  {distanceKm} km
                </span>
                <button
                  type="button"
                  disabled={distanceKm >= 1000}
                  onClick={() => setDistanceKm(Math.min(1000, distanceKm + 1))}
                  className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base shadow-xs cursor-pointer"
                  aria-label="Increase distance"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Distance Presets */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500 font-medium mr-1">Quick Select:</span>
            {distancePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDistanceKm(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  distanceKm === preset
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {preset} km
              </button>
            ))}
          </div>

          {/* Interactive Distance Slider */}
          <div className="mt-4 pt-1">
            <input
              type="range"
              min={1}
              max={300}
              step={1}
              value={distanceKm > 300 ? 300 : distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="Adjust trip distance"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium mt-1">
              <span>1 km (City Local)</span>
              <span>15 km (Across Town)</span>
              <span>50 km (Suburban)</span>
              <span>150 km (Intercity)</span>
              <span>300+ km (Outstation)</span>
            </div>
          </div>
        </div>

        {/* 5 Polished Horizontal Ride Selection Cards */}
        <div className="max-w-4xl mx-auto flex flex-col gap-3.5">
          {RIDE_OPTIONS.map((ride) => {
            const isSelected = ride.id === selectedRideId;
            const fare = calculateFare(ride, distanceKm);

            return (
              <div
                key={ride.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectRide(ride)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectRide(ride);
                  }
                }}
                className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 outline-none select-none ${
                  isSelected
                    ? 'bg-white border-2 border-amber-600 shadow-lg shadow-amber-900/10 ring-4 ring-amber-500/10'
                    : 'bg-white border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2.5 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-50 duration-200">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Card Main Body */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* LEFT: Vehicle Illustration */}
                  <div className={`w-20 h-16 sm:w-24 sm:h-18 rounded-xl flex items-center justify-center p-1 shrink-0 transition-colors ${
                    isSelected ? 'bg-amber-50/80 border border-amber-200' : 'bg-stone-50 border border-stone-100 group-hover:bg-amber-50/30'
                  }`}>
                    <CabVehicleIllustration type={ride.type} isSelected={isSelected} />
                  </div>

                  {/* MIDDLE: Vehicle Name, Description, Capacity, Rate, ETA */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-tight">
                        {ride.name}
                      </h3>
                      {ride.highlightBadge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60">
                          {ride.highlightBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 mt-0.5 leading-snug line-clamp-1">
                      {ride.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {ride.eta}
                      </span>
                      <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                        <Users className="w-3 h-3 text-stone-500" />
                        {ride.capacity}
                      </span>
                      <span className="text-stone-500 font-medium">
                        ₹{ride.pricePerKm}/km &bull; Base ₹{ride.baseFare}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Calculated Fare and Select Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-stone-100 pt-2 sm:pt-0 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900 leading-none">
                      ₹{fare}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                      estimated fare
                    </div>
                  </div>

                  <div className={`sm:mt-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 group-hover:bg-amber-500 group-hover:text-stone-950'
                  }`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Small Confirmation Area: Selected Ride, Distance, Estimated Fare, [ Continue Booking ] */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-lg shadow-amber-900/5 flex flex-col sm:flex-row items-center justify-between gap-5">
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 p-1">
                <CabVehicleIllustration type={selectedRide.type} isSelected={true} />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Selected Ride:
                  </span>
                  <span className="font-bold text-stone-900 text-lg">
                    {selectedRide.name}
                  </span>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                    {selectedRide.capacity}
                  </span>
                </div>

                <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-medium text-stone-700">
                    Distance: <strong className="font-mono text-stone-900">{distanceKm} km</strong>
                  </span>
                  <span className="text-stone-300">&bull;</span>
                  <span className="text-emerald-700 font-medium">
                    ETA: {selectedRide.eta}
                  </span>
                  <span className="text-stone-300">&bull;</span>
                  <span className="text-stone-500 text-[11px]">
                    Base ₹{selectedRide.baseFare} + ({distanceKm} km × ₹{selectedRide.pricePerKm}/km)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold uppercase text-stone-400 block">
                  Estimated Fare
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-stone-900">
                  ₹{calculateFare(selectedRide, distanceKm)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleContinueBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Continue Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {bookedFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-100 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{bookedFeedback}</span>
              </div>
              <button
                onClick={() => setBookedFeedback(null)}
                className="text-emerald-400 hover:text-white font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Transparent Pricing &bull; No Hidden Charges
            </span>
            <span>&bull;</span>
            <span>Verified Commercial Chauffeurs</span>
            <span>&bull;</span>
            <span>Cash, UPI (GPay, PhonePe) &amp; Cards</span>
          </div>
        </div>

      </div>
    </section>
  );
};
