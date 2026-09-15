import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  SlidersHorizontal, 
  X, 
  Sparkles,
  Compass
} from 'lucide-react';
import { SearchFilters, TravelCategory, CurrencyCode } from '../types';
import { POPULAR_DESTINATIONS, TRAVEL_CATEGORIES } from '../data/toursData';
import { formatPrice } from '../utils/formatters';

interface DestinationSearchBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
  matchingCount: number;
  currency: CurrencyCode;
}

export const DestinationSearchBar: React.FC<DestinationSearchBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  matchingCount,
  currency
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const seasons = [
    'Any Time',
    'Spring 2026 (Apr - May)',
    'Summer 2026 (Jun - Aug)',
    'Autumn 2026 (Sep - Nov)',
    'Winter 2026 / 2027'
  ];

  const handleDestinationSelect = (dest: string) => {
    onFilterChange({ destination: dest === 'All Destinations' ? '' : dest });
    setShowDestDropdown(false);
  };

  const isFiltered = Boolean(
    filters.destination || 
    filters.category !== 'All' || 
    filters.seasonOrMonth !== 'Any Time' || 
    filters.maxBudget < 5000 || 
    filters.guestsCount > 1
  );

  return (
    <div id="search" className="w-full max-w-5xl mx-auto -mt-10 sm:-mt-12 relative z-30 px-4 sm:px-0">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/80 p-4 sm:p-6 transition-all duration-300">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-stone-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1 shrink-0 mr-1">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            Style:
          </span>
          {TRAVEL_CATEGORIES.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat as TravelCategory })}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-700/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Main Search Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
          
          {/* Destination Selector */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Destination
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Where to? (e.g. Udaipur, Kerala, Ladakh)"
                value={filters.destination}
                onChange={(e) => onFilterChange({ destination: e.target.value })}
                onFocus={() => setShowDestDropdown(true)}
                className="w-full bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 text-sm font-medium rounded-xl pl-9 pr-8 py-2.5 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400"
              />
              {filters.destination && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ destination: '' })}
                  className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDestDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 max-h-56 overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Featured Destinations
                </div>
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleDestinationSelect(dest)}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center justify-between"
                  >
                    <span>{dest}</span>
                    <span className="text-[10px] text-stone-500 font-mono">Curated</span>
                  </button>
                ))}
                <div className="border-t border-stone-100 mt-1 pt-1 px-3">
                  <button
                    type="button"
                    onClick={() => setShowDestDropdown(false)}
                    className="text-[11px] text-amber-600 font-medium hover:underline"
                  >
                    Close Dropdown
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Season / Timing */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Season / Departure
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
              <select
                value={filters.seasonOrMonth}
                onChange={(e) => onFilterChange({ seasonOrMonth: e.target.value })}
                className="w-full bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-stone-900 text-sm font-medium rounded-xl pl-9 pr-4 py-2.5 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer appearance-none"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests Count Stepper */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Travelers
            </label>
            <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-1.5 border border-stone-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-stone-900">
                  {filters.guestsCount} {filters.guestsCount === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={filters.guestsCount <= 1}
                  onClick={() => onFilterChange({ guestsCount: Math.max(1, filters.guestsCount - 1) })}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <button
                  type="button"
                  disabled={filters.guestsCount >= 10}
                  onClick={() => onFilterChange({ guestsCount: Math.min(10, filters.guestsCount + 1) })}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Search Trigger Button */}
          <div className="flex items-end gap-2 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('tours');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-2.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 hover:shadow-xl transition-all cursor-pointer group"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Explore ({matchingCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showAdvanced || filters.maxBudget < 5000
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="More Filters (Budget & Sort)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer: Budget Slider & Sorting */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Maximum Budget (Per Person)
                </span>
                <span className="text-xs font-bold text-amber-700 font-mono">
                  {formatPrice(filters.maxBudget, currency)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="5500"
                step="250"
                value={filters.maxBudget}
                onChange={(e) => onFilterChange({ maxBudget: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1 font-mono">
                <span>{formatPrice(2000, currency)}</span>
                <span>{formatPrice(3500, currency)}</span>
                <span>{formatPrice(5500, currency)}+</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Sort Expeditions By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="w-full bg-stone-50 text-stone-900 text-xs font-medium rounded-xl px-3 py-2 border border-stone-200 focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="popularity">Most Popular & Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Guest Rating (Highest First)</option>
                <option value="duration">Trip Duration</option>
              </select>
            </div>
          </div>
        )}

        {/* Reset Active Filters Bar */}
        {isFiltered && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Showing {matchingCount} curated itineraries matching your search criteria
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-amber-700 hover:text-amber-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
