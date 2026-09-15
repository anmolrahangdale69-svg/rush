import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  ArrowRight, 
  Check, 
  Sparkles,
  Compass,
  Eye
} from 'lucide-react';
import { Tour, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface TourGalleryProps {
  tours: Tour[];
  currency: CurrencyCode;
  wishlist: string[];
  onToggleWishlist: (tourId: string) => void;
  onSelectTourDetails: (tour: Tour) => void;
  onSelectTourBook: (tour: Tour) => void;
}

export const TourGallery: React.FC<TourGalleryProps> = ({
  tours,
  currency,
  wishlist,
  onToggleWishlist,
  onSelectTourDetails,
  onSelectTourBook
}) => {
  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);

  if (tours.length === 0) {
    return (
      <section id="tours" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-2xl border border-stone-200 p-12 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
            No Expeditions Match Your Criteria
          </h3>
          <p className="text-sm text-stone-600 mb-6">
            Try adjusting your search destination, raising your budget slider, or selecting "All" categories.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Handcrafted Signature Collections
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Featured Tour Gallery
          </h2>
        </div>
        <p className="text-sm text-stone-700 max-w-md mt-2 md:mt-0">
          Showing {tours.length} premier expeditions with private transportation, five-star accommodations, and instant booking notification.
        </p>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {tours.map((tour) => {
          const isWishlisted = wishlist.includes(tour.id);
          const isHovered = hoveredTourId === tour.id;

          return (
            <div
              key={tour.id}
              onMouseEnter={() => setHoveredTourId(tour.id)}
              onMouseLeave={() => setHoveredTourId(null)}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image Container */}
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                <img
                  src={tour.heroImage}
                  alt={tour.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-black/30 pointer-events-none" />

                {/* Top Left Tag & Category */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10">
                  <span className="bg-stone-900/90 backdrop-blur-md text-amber-400 font-medium text-[11px] px-2.5 py-1 rounded-full border border-amber-500/20 shadow-sm">
                    {tour.tag}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-stone-800 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {tour.category}
                  </span>
                </div>

                {/* Top Right Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(tour.id);
                  }}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md flex items-center justify-center transition-all z-10 shadow-sm cursor-pointer"
                  title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-transform active:scale-125 ${
                      isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-stone-200'
                    }`}
                  />
                </button>

                {/* Bottom Overlay: Destination & Rating */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tour.destination}, {tour.country}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-semibold text-amber-300 border border-stone-700/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{tour.rating}</span>
                    <span className="text-[10px] text-stone-400 font-normal">({tour.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta Specs Bar */}
                  <div className="flex items-center gap-4 text-xs text-stone-700 font-medium mb-2.5 pb-2.5 border-b border-stone-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-600" />
                      {tour.durationDays} Days / {tour.durationNights} Nights
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-600" />
                      Max {tour.maxGroupSize} Guests
                    </span>
                  </div>

                  {/* Tour Title */}
                  <h3 
                    onClick={() => onSelectTourDetails(tour)}
                    className="font-display font-bold text-lg sm:text-xl text-stone-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    {tour.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {tour.shortDescription}
                  </p>

                  {/* Key Highlights Mini List */}
                  <div className="space-y-1.5 mb-5">
                    {tour.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Pricing & Actions */}
                <div className="pt-4 border-t border-stone-100 mt-auto">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block">
                        From
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-stone-900 font-mono">
                          {formatPrice(tour.pricePerPerson, currency)}
                        </span>
                        <span className="text-xs text-stone-600 font-normal">/ person</span>
                        {tour.originalPrice && (
                          <span className="text-xs text-stone-600 line-through font-mono ml-1">
                            {formatPrice(tour.originalPrice, currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Instant Booking
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTourDetails(tour)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-700" />
                      <span>Itinerary</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTourBook(tour)}
                      className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1 cursor-pointer group/btn"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
