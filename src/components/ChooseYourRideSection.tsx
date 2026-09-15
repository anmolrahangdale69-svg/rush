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
  Minus,
  Plus
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export interface RideOption {
  id: string;
  name: string;
  type: string;
  pricePerKm: number;
  baseFare: number;
  description: string;
  eta: string;
  capacity: string;
  highlightBadge?: string;
  colorTheme: {
    accent: string;
    bgPill: string;
    textPill: string;
  };
}

export const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'ride-bike',
    name: 'Bike',
    type: 'commuter-bike',
    pricePerKm: 8,
    baseFare: 20,
    description: 'Fast & affordable',
    eta: '3 min away',
    capacity: '1 Seat • Helmet included',
    highlightBadge: 'Fastest in Traffic',
    colorTheme: {
      accent: 'amber-600',
      bgPill: 'bg-amber-100',
      textPill: 'text-amber-900'
    }
  },
  {
    id: 'ride-scooty',
    name: 'Scooty',
    type: 'city-scooter',
    pricePerKm: 7,
    baseFare: 20,
    description: 'Easy city rides',
    eta: '4 min away',
    capacity: '1 Seat • Pocket friendly',
    highlightBadge: 'Lowest Price',
    colorTheme: {
      accent: 'orange-600',
      bgPill: 'bg-orange-100',
      textPill: 'text-orange-900'
    }
  },
  {
    id: 'ride-auto',
    name: 'Auto',
    type: 'auto-rickshaw',
    pricePerKm: 12,
    baseFare: 30,
    description: 'Comfortable for short trips',
    eta: '5 min away',
    capacity: 'Up to 3 Seats • Doorstep pickup',
    highlightBadge: 'Indian Classic',
    colorTheme: {
      accent: 'emerald-600',
      bgPill: 'bg-emerald-100',
      textPill: 'text-emerald-900'
    }
  },
  {
    id: 'ride-erickshaw',
    name: 'E-Rickshaw',
    type: 'electric-rickshaw',
    pricePerKm: 10,
    baseFare: 25,
    description: 'Eco-friendly city ride',
    eta: '6 min away',
    capacity: 'Up to 4 Seats • 100% Electric',
    highlightBadge: 'Zero Emission',
    colorTheme: {
      accent: 'teal-600',
      bgPill: 'bg-teal-100',
      textPill: 'text-teal-900'
    }
  },
  {
    id: 'ride-minicab',
    name: 'Mini Cab',
    type: 'city-hatchback',
    pricePerKm: 15,
    baseFare: 40,
    description: 'Affordable cab',
    eta: '5 min away',
    capacity: '4 Seats • Full Air Conditioning',
    highlightBadge: 'AC Comfort',
    colorTheme: {
      accent: 'blue-600',
      bgPill: 'bg-blue-100',
      textPill: 'text-blue-900'
    }
  },
  {
    id: 'ride-premiumcab',
    name: 'Premium Cab',
    type: 'executive-sedan',
    pricePerKm: 22,
    baseFare: 60,
    description: 'Extra comfort',
    eta: '7 min away',
    capacity: '4 Seats • Elite Chauffeur & Sedan',
    highlightBadge: 'Royal Luxury',
    colorTheme: {
      accent: 'purple-600',
      bgPill: 'bg-purple-100',
      textPill: 'text-purple-900'
    }
  }
];

// Bespoke Indian Vehicle Illustrations
const VehicleIllustration: React.FC<{ type: string; isSelected: boolean }> = ({ type, isSelected }) => {
  switch (type) {
    case 'commuter-bike':
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="70" rx="46" ry="4" fill="#e2e8f0" />
          {/* Wheels */}
          <g>
            <circle cx="28" cy="54" r="15" fill="#1e293b" />
            <circle cx="28" cy="54" r="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="28" cy="54" r="4" fill="#334155" />
            {/* Spokes */}
            <line x1="28" y1="44" x2="28" y2="64" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="18" y1="54" x2="38" y2="54" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
          <g>
            <circle cx="92" cy="54" r="15" fill="#1e293b" />
            <circle cx="92" cy="54" r="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="92" cy="54" r="4" fill="#334155" />
            <line x1="92" y1="44" x2="92" y2="64" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="82" y1="54" x2="102" y2="54" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
          {/* Engine block */}
          <rect x="52" y="44" width="16" height="14" rx="2" fill="#475569" />
          <path d="M54 52 h12" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Exhaust pipe */}
          <path d="M66 54 L84 57 L96 55" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          {/* Chassis frame */}
          <path d="M28 54 L52 38 L72 38 L92 54 L62 52 Z" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Fuel tank (Indian commuter red/amber) */}
          <path d="M48 36 C52 28 68 28 72 36 L50 38 Z" fill="#dc2626" />
          <path d="M52 32 C58 29 64 29 68 33" stroke="#fef08a" strokeWidth="1.5" fill="none" />
          {/* Rider Seat */}
          <path d="M68 36 C74 34 84 34 86 39 L70 39 Z" fill="#0f172a" />
          {/* Handlebars & Headlamp */}
          <path d="M38 28 L46 42" stroke="#334155" strokeWidth="3" />
          <path d="M34 26 L42 28" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="34" r="4.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* Rear mudguard & indicator */}
          <path d="M82 46 C86 42 94 42 98 47" fill="none" stroke="#334155" strokeWidth="3" />
          <circle cx="100" cy="46" r="2" fill="#ea580c" />
        </svg>
      );

    case 'city-scooter':
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="70" rx="44" ry="4" fill="#e2e8f0" />
          {/* Wheels */}
          <circle cx="30" cy="56" r="13" fill="#1e293b" />
          <circle cx="30" cy="56" r="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="90" cy="56" r="13" fill="#1e293b" />
          <circle cx="90" cy="56" r="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          {/* Indian Activa-style step-through body */}
          <path d="M32 54 L44 32 C46 28 50 28 52 32 L54 52 L74 52 C78 40 84 36 96 42 L94 56 Z" fill="#0284c7" />
          {/* Flat floorboard */}
          <rect x="52" y="52" width="22" height="4" rx="1.5" fill="#1e293b" />
          {/* Front Apron & Headlamp */}
          <path d="M38 24 L48 24 L44 38 L36 38 Z" fill="#0369a1" />
          <ellipse cx="43" cy="24" rx="4.5" ry="3" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
          {/* Handlebar & mirror */}
          <line x1="43" y1="20" x2="43" y2="24" stroke="#334155" strokeWidth="2.5" />
          <circle cx="38" cy="18" r="2" fill="#64748b" />
          {/* Comfy dual seat */}
          <path d="M68 38 C74 34 88 34 94 38 L92 44 L68 44 Z" fill="#1e293b" />
          {/* Grab rail & tail light */}
          <path d="M92 38 L97 42" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <rect x="94" y="44" width="3" height="4" rx="1" fill="#dc2626" />
        </svg>
      );

    case 'auto-rickshaw':
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="71" rx="48" ry="4" fill="#e2e8f0" />
          {/* Wheels: 1 front, 2 rear */}
          <circle cx="26" cy="57" r="12" fill="#1e293b" />
          <circle cx="26" cy="57" r="7" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          <circle cx="88" cy="57" r="13" fill="#1e293b" />
          <circle cx="88" cy="57" r="7" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          
          {/* Auto Rickshaw Lower Body (Classic Green) */}
          <path d="M22 55 L32 42 L52 42 L52 56 L96 56 C98 56 100 52 98 44 L96 36 L48 36 L30 42 Z" fill="#15803d" />
          
          {/* Auto Rickshaw Upper Canopy & Roof (Classic Yellow) */}
          <path d="M32 40 L38 22 C40 20 46 20 54 20 L94 20 C98 20 100 24 100 32 L98 38 L52 38 Z" fill="#eab308" />
          
          {/* Black Canvas Hood Accent */}
          <path d="M42 20 L94 20 C98 20 100 22 100 28 L40 28 Z" fill="#1e293b" />
          
          {/* Windshield */}
          <path d="M34 40 L40 24 L52 24 L50 40 Z" fill="#bae6fd" opacity="0.8" stroke="#38bdf8" strokeWidth="1" />
          
          {/* Open passenger side entrance */}
          <rect x="56" y="30" width="34" height="22" rx="2" fill="#f8fafc" opacity="0.25" stroke="#facc15" strokeWidth="1.5" />
          
          {/* Passenger bench seat inside */}
          <rect x="74" y="44" width="20" height="8" rx="2" fill="#78350f" />
          
          {/* Front Single Headlight */}
          <circle cx="20" cy="48" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* Indicator & mudguard */}
          <circle cx="24" cy="52" r="1.5" fill="#ea580c" />
          <path d="M18 55 C20 48 30 48 34 55" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        </svg>
      );

    case 'electric-rickshaw':
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="71" rx="46" ry="4" fill="#e2e8f0" />
          {/* Wheels */}
          <circle cx="26" cy="58" r="11" fill="#1e293b" />
          <circle cx="26" cy="58" r="6" fill="#cbd5e1" stroke="#0d9488" strokeWidth="2" />
          <circle cx="90" cy="58" r="12" fill="#1e293b" />
          <circle cx="90" cy="58" r="6" fill="#cbd5e1" stroke="#0d9488" strokeWidth="2" />

          {/* Electric Rickshaw Tubular Blue/Teal Frame */}
          <path d="M24 55 L34 38 L98 38 L98 56 L44 56 Z" fill="#0d9488" />
          
          {/* Battery pack compartment */}
          <rect x="44" y="52" width="38" height="6" rx="1.5" fill="#134e4a" />
          {/* Eco Battery Lightning Bolt */}
          <path d="M60 53 L58 56 L61 56 L59 59" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Modern Canopy Roof */}
          <path d="M32 20 L96 20 C100 20 102 23 102 26 L98 38 L36 38 Z" fill="#f0fdf4" stroke="#0d9488" strokeWidth="1.5" />
          <rect x="36" y="20" width="62" height="4" fill="#14b8a6" />

          {/* Windshield */}
          <path d="M30 42 L36 24 L48 24 L44 42 Z" fill="#ccfbf1" opacity="0.85" stroke="#2dd4bf" strokeWidth="1" />

          {/* Passenger seating area */}
          <rect x="52" y="28" width="40" height="22" fill="none" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="2 2" />
          <rect x="68" y="44" width="26" height="6" rx="1.5" fill="#334155" />

          {/* Front LED Headlamp */}
          <rect x="20" y="44" width="5" height="4" rx="1" fill="#fef08a" stroke="#0d9488" strokeWidth="1" />
        </svg>
      );

    case 'city-hatchback':
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="71" rx="50" ry="4" fill="#e2e8f0" />
          {/* Wheels */}
          <circle cx="32" cy="58" r="12" fill="#1e293b" />
          <circle cx="32" cy="58" r="7" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="88" cy="58" r="12" fill="#1e293b" />
          <circle cx="88" cy="58" r="7" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

          {/* Compact City Hatchback Body */}
          <path d="M16 54 C16 48 22 46 28 46 L38 34 C44 26 50 26 62 26 L80 26 C88 26 94 32 98 42 L104 46 C108 48 108 54 104 56 L20 56 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          
          {/* Windows */}
          <path d="M40 34 L58 34 L58 44 L32 44 Z" fill="#bae6fd" opacity="0.8" />
          <path d="M62 34 L80 34 L88 44 L62 44 Z" fill="#bae6fd" opacity="0.8" />

          {/* Door line & handle */}
          <line x1="60" y1="34" x2="60" y2="54" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="64" y="46" width="6" height="2" rx="1" fill="#475569" />

          {/* Front Headlamp */}
          <path d="M18 48 C20 46 24 46 26 48 L22 52 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* Tail light */}
          <path d="M102 46 C104 46 106 48 106 50 L102 52 Z" fill="#ef4444" />
          
          {/* AC Badge */}
          <rect x="50" y="48" width="10" height="4" rx="1" fill="#0284c7" />
          <text x="52" y="51" fontSize="3" fill="#ffffff" fontWeight="bold">AC</text>
        </svg>
      );

    case 'executive-sedan':
    default:
      return (
        <svg viewBox="0 0 120 80" className="w-20 h-14 sm:w-24 sm:h-16 transition-transform duration-300 group-hover:scale-105">
          {/* Ground shadow */}
          <ellipse cx="60" cy="72" rx="54" ry="4" fill="#e2e8f0" />
          {/* Wheels with luxury multi-spoke rims */}
          <circle cx="28" cy="58" r="12" fill="#0f172a" />
          <circle cx="28" cy="58" r="7" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="92" cy="58" r="12" fill="#0f172a" />
          <circle cx="92" cy="58" r="7" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Sleek Royal Executive Sedan Body (Dark Obsidian / Metallic Charcoal) */}
          <path d="M12 53 C12 46 18 44 26 44 L40 32 C46 24 54 24 72 24 L86 24 C94 24 98 30 102 38 L110 44 C116 46 116 52 110 56 L16 56 Z" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
          
          {/* Luxury Chrome Waistline */}
          <path d="M16 50 L108 50" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />

          {/* Dark Tinted Executive Windows */}
          <path d="M42 32 L64 32 L64 42 L34 42 Z" fill="#38bdf8" opacity="0.35" stroke="#44403c" strokeWidth="0.8" />
          <path d="M68 32 L86 32 L94 42 L68 42 Z" fill="#38bdf8" opacity="0.35" stroke="#44403c" strokeWidth="0.8" />

          {/* Door handles */}
          <rect x="52" y="45" width="6" height="1.8" rx="0.9" fill="#d97706" />
          <rect x="74" y="45" width="6" height="1.8" rx="0.9" fill="#d97706" />

          {/* Matrix LED Projector Headlamp */}
          <path d="M14 47 C16 45 20 45 22 47 L18 51 Z" fill="#ffffff" filter="drop-shadow(0 0 2px #38bdf8)" />
          {/* Tail light (Ruby Red LED bar) */}
          <path d="M106 46 C108 46 112 47 112 49 L108 52 Z" fill="#ef4444" />
        </svg>
      );
  }
};

export const ChooseYourRideSection: React.FC = () => {
  // User entered distance in Kilometers
  const [distanceKm, setDistanceKm] = useState<number>(5);
  // Selected Ride Option (defaults to Auto)
  const [selectedRideId, setSelectedRideId] = useState<string>('ride-auto');
  // Booking confirmation toast feedback
  const [bookedFeedback, setBookedFeedback] = useState<string | null>(null);

  const selectedRide = RIDE_OPTIONS.find((r) => r.id === selectedRideId) || RIDE_OPTIONS[2];

  // Calculate final fare: baseFare + (distance × pricePerKm)
  const calculateFare = (ride: RideOption, dist: number): number => {
    return Math.round(ride.baseFare + dist * ride.pricePerKm);
  };

  const handleSelectRide = (ride: RideOption) => {
    soundFx.playTap();
    setSelectedRideId(ride.id);
  };

  const handleConfirmRide = () => {
    soundFx.playRideConfirmed();
    const fare = calculateFare(selectedRide, distanceKm);
    setBookedFeedback(`Ride Request Dispatched! Your ${selectedRide.name} arrives in ${selectedRide.eta} (Estimated Fare: ₹${fare}).`);
    setTimeout(() => {
      setBookedFeedback(null);
    }, 6000);
  };

  const distancePresets = [2, 5, 8, 12, 18, 25];

  return (
    <section id="choose-ride" className="py-16 sm:py-24 bg-stone-100/70 border-b border-stone-200 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant Indian City Mobility</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Choose Your Ride
          </h2>
          
          <p className="text-sm text-stone-600 mt-2 font-normal leading-relaxed">
            Transparent distance-based fares with zero hidden surcharges. Fast, clean, and trusted Indian city mobility options.
          </p>
        </div>

        {/* Interactive Distance Selector Box */}
        <div className="max-w-3xl mx-auto mb-10 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Trip Distance
                </span>
                <span className="text-xs text-stone-500">
                  Select your estimated travel distance in kilometres
                </span>
              </div>
            </div>

            {/* Distance Number Input & Steppers */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setDistanceKm((d) => Math.max(1, d - 1))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease distance"
                aria-label="Decrease distance"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-baseline gap-1 px-2">
                <span className="font-mono text-xl font-bold text-stone-900">
                  {distanceKm}
                </span>
                <span className="text-xs font-semibold text-stone-500">km</span>
              </div>

              <button
                type="button"
                onClick={() => setDistanceKm((d) => Math.min(60, d + 1))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Increase distance"
                aria-label="Increase distance"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick preset pills */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {distancePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDistanceKm(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    distanceKm === preset
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {preset} km
                </button>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="mt-4 pt-2">
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="Adjust trip distance in kilometers"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium mt-1">
              <span>1 km (Local short trip)</span>
              <span>25 km (Across city)</span>
              <span>50 km (Airport / Outstation)</span>
            </div>
          </div>
        </div>

        {/* 6 Ride Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 outline-none select-none ${
                  isSelected
                    ? 'bg-white border-2 border-amber-600 shadow-xl shadow-amber-900/10 ring-4 ring-amber-500/15 -translate-y-1'
                    : 'bg-white border border-stone-200/90 hover:border-amber-400/80 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Active checkmark indicator badge */}
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2.5 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-50 duration-200">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Top optional badge (Fastest, Lowest Price, etc.) */}
                {ride.highlightBadge && (
                  <div className="absolute top-2.5 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60">
                      {ride.highlightBadge}
                    </span>
                  </div>
                )}

                {/* LEFT: Vehicle Illustration Viewport */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-20 h-16 sm:w-22 sm:h-18 rounded-xl flex items-center justify-center p-1 shrink-0 transition-colors ${
                    isSelected ? 'bg-amber-50/70 border border-amber-200' : 'bg-stone-50 border border-stone-100 group-hover:bg-amber-50/30'
                  }`}>
                    <VehicleIllustration type={ride.type} isSelected={isSelected} />
                  </div>

                  {/* Middle: Vehicle Name & Meta */}
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-tight truncate">
                        {ride.name}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-500 mt-0.5 leading-snug truncate">
                      {ride.description}
                    </p>

                    {/* ETA pill */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {ride.eta}
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">
                        &bull; ₹{ride.pricePerKm}/km
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Calculated Fare and Select Button */}
                <div className="text-right shrink-0 flex flex-col items-end justify-center pl-2">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900 leading-none">
                    ₹{fare}
                  </div>
                  
                  <div className="text-[10px] text-stone-400 mt-1 font-mono">
                    Base ₹{ride.baseFare}
                  </div>

                  {/* Visual Select indicator */}
                  <div className={`mt-2.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 group-hover:bg-amber-500 group-hover:text-stone-950'
                  }`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Selected Ride Confirmation & Action Area */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-lg shadow-amber-900/5 flex flex-col sm:flex-row items-center justify-between gap-5">
            
            {/* Summary Left */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 p-1">
                <VehicleIllustration type={selectedRide.type} isSelected={true} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Selected Vehicle:
                  </span>
                  <span className="font-bold text-stone-900 text-lg">
                    {selectedRide.name}
                  </span>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                    {selectedRide.capacity}
                  </span>
                </div>

                <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Arrives in {selectedRide.eta}
                  </span>
                  <span className="text-stone-400">&bull;</span>
                  <span>
                    Formula: Base ₹{selectedRide.baseFare} + ({distanceKm} km × ₹{selectedRide.pricePerKm})
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Action Right */}
            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold uppercase text-stone-400 block">
                  Total Calculated Fare
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-stone-900">
                  ₹{calculateFare(selectedRide, distanceKm)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmRide}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Request {selectedRide.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Success toast message */}
          {bookedFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-100 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-800 rounded-lg text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
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

          {/* Bottom Security / Fair pricing footnote */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct Driver Metering
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              No Surge Guarantee
            </span>
            <span>&bull;</span>
            <span>Cash, UPI (GPay, PhonePe, Paytm) &amp; Cards Accepted</span>
          </div>
        </div>

      </div>
    </section>
  );
};
