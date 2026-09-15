import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  Car,
  Navigation,
  Sparkles,
  Repeat,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { SearchFilters, TravelCategory, CurrencyCode } from '../types';
import { POPULAR_CAB_ROUTES } from '../data/toursData';

interface DestinationSearchBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
  matchingCount: number;
  currency: CurrencyCode;
  onSelectCabRoute?: (pickup: string, drop: string, distanceKm: number) => void;
}

export const DestinationSearchBar: React.FC<DestinationSearchBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  matchingCount,
  currency,
  onSelectCabRoute
}) => {
  const [tripType, setTripType] = useState<'outstation-oneway' | 'outstation-roundtrip' | 'city-local'>('outstation-oneway');
  const [pickupCity, setPickupCity] = useState<string>('Nagpur');
  const [dropCity, setDropCity] = useState<string>('Pune');
  const [departureDate, setDepartureDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState<number>(3);
  const [showPickupDropdown, setShowPickupDropdown] = useState<boolean>(false);
  const [showDropDropdown, setShowDropDropdown] = useState<boolean>(false);

  const POPULAR_PICKUPS = ['Nagpur', 'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Nashik', 'Hyderabad', 'Indore'];
  const POPULAR_DROPS = ['Pune', 'Nagpur', 'Shirdi', 'Amravati', 'Goa', 'Agra', 'Wardha', 'Lonavala', 'Mahabaleshwar'];

  // Route distance estimation lookup
  const estimateRouteDistance = (from: string, to: string): number => {
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    const match = POPULAR_CAB_ROUTES.find(
      (r) => 
        (r.fromCity.toLowerCase() === f && r.toCity.toLowerCase() === t) ||
        (r.fromCity.toLowerCase() === t && r.toCity.toLowerCase() === f)
    );
    if (match) return match.distanceKm;
    if (tripType === 'city-local') return 25;
    return 180; // default reasonable highway distance
  };

  const handleSearchCabs = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const estDistance = estimateRouteDistance(pickupCity, dropCity);
    
    // Update destination filter for tour gallery compatibility as well
    onFilterChange({ destination: dropCity, guestsCount: passengers });

    if (onSelectCabRoute) {
      onSelectCabRoute(pickupCity, dropCity, estDistance);
    }

    // Smoothly scroll to Choose Your Ride section
    const el = document.getElementById('choose-ride');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickRouteSelect = (route: typeof POPULAR_CAB_ROUTES[0]) => {
    setPickupCity(route.fromCity);
    setDropCity(route.toCity);
    onFilterChange({ destination: route.toCity });
    if (onSelectCabRoute) {
      onSelectCabRoute(route.fromCity, route.toCity, route.distanceKm);
    }
    const el = document.getElementById('choose-ride');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="search" className="w-full max-w-5xl mx-auto -mt-10 sm:-mt-12 relative z-30 px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-4 sm:p-6 transition-all">
        
        {/* Trip Type Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setTripType('outstation-oneway')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tripType === 'outstation-oneway'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Outstation One-Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('outstation-roundtrip')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tripType === 'outstation-roundtrip'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Round-Trip
            </button>
            <button
              type="button"
              onClick={() => setTripType('city-local')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tripType === 'city-local'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              City Local
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Instant confirmation &bull; Zero surge pricing</span>
          </div>
        </div>

        {/* Main Search Controls Grid */}
        <form onSubmit={handleSearchCabs} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
          
          {/* 1. Pickup Location */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Pickup Location
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Pickup City / Landmark"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                onFocus={() => setShowPickupDropdown(true)}
                className="w-full bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal"
              />
            </div>

            {/* Quick Pickup Dropdown */}
            {showPickupDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 max-h-48 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Popular Hubs
                </div>
                {POPULAR_PICKUPS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setPickupCity(city);
                      setShowPickupDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <span>{city}</span>
                    <span className="text-[10px] text-stone-400">Available</span>
                  </button>
                ))}
                <div className="border-t border-stone-100 mt-1 pt-1 px-3">
                  <button
                    type="button"
                    onClick={() => setShowPickupDropdown(false)}
                    className="text-[11px] text-amber-600 font-medium hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Drop Location */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Drop Location
            </label>
            <div className="relative flex items-center">
              <Navigation className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Drop City / Destination"
                value={dropCity}
                onChange={(e) => setDropCity(e.target.value)}
                onFocus={() => setShowDropDropdown(true)}
                className="w-full bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal"
              />
            </div>

            {/* Quick Drop Dropdown */}
            {showDropDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 max-h-48 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Popular Destinations
                </div>
                {POPULAR_DROPS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setDropCity(city);
                      setShowDropDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <span>{city}</span>
                    <span className="text-[10px] text-stone-400">Direct Route</span>
                  </button>
                ))}
                <div className="border-t border-stone-100 mt-1 pt-1 px-3">
                  <button
                    type="button"
                    onClick={() => setShowDropDropdown(false)}
                    className="text-[11px] text-amber-600 font-medium hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Date & Passengers */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Departure
              </label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 text-xs font-semibold rounded-xl px-2.5 py-2.5 border border-stone-200 focus:border-amber-500 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Passengers
              </label>
              <div className="flex items-center justify-between bg-stone-50 rounded-xl px-2 py-1.5 border border-stone-200">
                <span className="text-xs font-bold text-stone-900 pl-1">
                  {passengers} {passengers === 1 ? 'Seat' : 'Seats'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={passengers <= 1}
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-6 h-6 rounded-lg bg-white border border-stone-300 text-stone-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    disabled={passengers >= 7}
                    onClick={() => setPassengers(Math.min(7, passengers + 1))}
                    className="w-6 h-6 rounded-lg bg-white border border-stone-300 text-stone-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <Car className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Search Cabs</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>

        </form>

        {/* Popular Route Fast-Select Chips */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Popular Routes:
          </span>
          {POPULAR_CAB_ROUTES.slice(0, 5).map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => handleQuickRouteSelect(route)}
              className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{route.fromCity} → {route.toCity}</span>
              <span className="text-[10px] text-stone-400 font-mono">({route.distanceKm} km)</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
