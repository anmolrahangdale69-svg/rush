import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Check, 
  XCircle, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Utensils, 
  Hotel,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart
} from 'lucide-react';
import { Tour, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface TourDetailModalProps {
  tour: Tour | null;
  onClose: () => void;
  onBookNow: (tour: Tour) => void;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (tourId: string) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  onClose,
  onBookNow,
  currency,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!tour) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = [tour.heroImage, ...(tour.galleryImages || [])];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Controls Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/90 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-mono">
              {tour.category}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {tour.destination}, {tour.country}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors text-xs flex items-center gap-1"
              title="Share Tour"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleWishlist(tour.id)}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Title & Ratings */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {tour.tag}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{tour.rating}</span>
                <span className="text-stone-500 font-normal">({tour.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-stone-900 mb-3">
              {tour.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl">
              {tour.fullDescription}
            </p>
          </div>

          {/* Interactive Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-900 shadow-md">
              <img
                src={images[activeImageIndex] || tour.heroImage}
                alt={tour.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-stone-950/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-amber-500 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
            <div className="p-2">
              <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xs text-stone-500 uppercase font-semibold">Duration</div>
              <div className="text-sm font-bold text-stone-900">{tour.durationDays} Days / {tour.durationNights} Nights</div>
            </div>

            <div className="p-2">
              <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xs text-stone-500 uppercase font-semibold">Group Size</div>
              <div className="text-sm font-bold text-stone-900">Max {tour.maxGroupSize} Guests</div>
            </div>

            <div className="p-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs text-stone-500 uppercase font-semibold">Difficulty</div>
              <div className="text-sm font-bold text-stone-900">{tour.difficulty} Level</div>
            </div>

            <div className="p-2">
              <Calendar className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xs text-stone-500 uppercase font-semibold">Departures</div>
              <div className="text-sm font-bold text-stone-900">{tour.availableDates.length} Dates in 2026</div>
            </div>
          </div>

          {/* Highlights & Inclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Highlights */}
            <div className="bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-200/60">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 stroke-[3]" />
                Tour Highlights
              </h3>
              <ul className="space-y-3">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="text-xs sm:text-sm text-stone-800 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  What is Included
                </h3>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {tour.included.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-stone-500" />
                  What is Not Included
                </h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  {tour.excluded.map((exc, i) => (
                    <li key={i}>&bull; {exc}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Day-by-Day Itinerary Accordion */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl text-stone-900">
                Day-by-Day Journey Itinerary
              </h3>
              <button
                type="button"
                onClick={() => setExpandedDay(expandedDay === null ? 1 : null)}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                {expandedDay === null ? 'Expand All' : 'Collapse Details'}
              </button>
            </div>

            <div className="space-y-3">
              {tour.itinerary.map((day) => {
                const isExpanded = expandedDay === day.day || expandedDay === null;
                return (
                  <div
                    key={day.day}
                    className="border border-stone-200 rounded-2xl overflow-hidden bg-white hover:border-stone-300 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer bg-stone-50/50 hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                          {day.day}
                        </span>
                        <div>
                          <div className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                            Day {day.day}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-stone-900">
                            {day.title}
                          </div>
                        </div>
                      </div>
                      <div className="p-1 text-stone-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 py-4 border-t border-stone-100 bg-white space-y-3">
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                          {day.description}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-500 border-t border-stone-100">
                          <span className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-amber-600" />
                            <strong>Meals:</strong> {day.meals}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Hotel className="w-3.5 h-3.5 text-amber-600" />
                            <strong>Accommodations:</strong> {day.stay}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guest Reviews Section */}
          {tour.reviews && tour.reviews.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h3 className="font-display font-bold text-xl text-stone-900 mb-4">
                Verified Guest Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tour.reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-300"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-900">{rev.userName}</div>
                          <div className="text-[11px] text-stone-500">{rev.userCountry} &bull; {rev.date}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer Booking Bar */}
        <div className="border-t border-stone-200 p-4 sm:p-6 bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-sans">
              All-inclusive private itinerary
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {formatPrice(tour.pricePerPerson, currency)}
              </span>
              <span className="text-xs text-stone-400">/ traveler</span>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                Immediate Owner Alert
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Continue Exploring
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(tour);
              }}
              className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-900/30 hover:scale-[1.02] cursor-pointer"
            >
              Book This Tour Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
