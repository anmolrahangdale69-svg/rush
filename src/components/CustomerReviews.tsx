import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, CheckCircle2, Car, Calendar, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS, REVIEW_METRICS, CustomerReview } from '../data/reviewsData';

interface CustomerReviewsProps {
  onBookClick?: () => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ onBookClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'roundtrip' | 'oneway' | 'airport' | 'leisure'>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const filteredReviews = CUSTOMER_REVIEWS.filter(r => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  // Show 6 initially, or all if toggled
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 6);

  const categories = [
    { id: 'all', label: 'All Reviews', count: CUSTOMER_REVIEWS.length },
    { id: 'roundtrip', label: 'Round Trips', count: CUSTOMER_REVIEWS.filter(r => r.category === 'roundtrip').length },
    { id: 'oneway', label: 'One-Way Drops', count: CUSTOMER_REVIEWS.filter(r => r.category === 'oneway').length },
    { id: 'airport', label: 'Airport Transfers', count: CUSTOMER_REVIEWS.filter(r => r.category === 'airport').length },
    { id: 'leisure', label: 'Safaris & Darshan', count: CUSTOMER_REVIEWS.filter(r => r.category === 'leisure').length },
  ];

  return (
    <section id="customer-reviews" className="py-16 sm:py-20 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Real Customer Experiences &bull; 100% Verified Trips</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
            Trusted by 15,000+ Travellers Across Central India
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
            Read honest feedback from passengers who booked one-way outstations, round-trip holidays, airport drops, and wildlife safaris with Bokde Travels.
          </p>
        </div>

        {/* Rating Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-amber-500 font-mono text-2xl sm:text-3xl font-black">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mt-1 block">
              Average Rating
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-2xs">
            <div className="font-mono text-2xl sm:text-3xl font-black text-stone-900">
              {REVIEW_METRICS.totalReviews}+
            </div>
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mt-1 block">
              Verified Bookings
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-2xs">
            <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">
              {REVIEW_METRICS.punctualityRate}
            </div>
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mt-1 block">
              Punctual Arrivals
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-2xs">
            <div className="font-mono text-2xl sm:text-3xl font-black text-stone-900">
              0%
            </div>
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mt-1 block">
              Hidden Toll Charges
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-stone-950 text-white shadow-sm ring-2 ring-amber-400'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* Header: User Initials, Name, Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm font-mono border border-amber-300 shrink-0">
                      {rev.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-stone-900 leading-snug">
                          {rev.name}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Customer" />
                      </div>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {rev.location}
                      </span>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Route & Distance Tag */}
                <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-stone-900 text-white font-bold text-xs">
                    {rev.route}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-amber-100/80 text-amber-950 font-semibold text-[11px] font-mono">
                    {rev.distanceText}
                  </span>
                </div>

                {/* Review Text */}
                <div className="relative">
                  <Quote className="w-6 h-6 text-stone-200 absolute -top-2 -left-1 -z-0 opacity-60" />
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed relative z-10">
                    "{rev.reviewText}"
                  </p>
                </div>
              </div>

              {/* Card Footer: Vehicle and Travel Date */}
              <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  {rev.vehicle}
                </span>
                <span className="flex items-center gap-1 text-stone-400 font-mono">
                  <Calendar className="w-3 h-3" />
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Toggle */}
        {filteredReviews.length > 6 && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 font-extrabold text-xs text-stone-800 shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>
                {showAll 
                  ? `Show Less (Showing all ${filteredReviews.length} reviews)` 
                  : `View All ${filteredReviews.length} Reviews`}
              </span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Direct Call to Action */}
        <div className="mt-12 bg-amber-500 rounded-2xl p-6 sm:p-8 text-stone-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              Ready to Book Your Next Hassle-Free Journey?
            </h3>
            <p className="text-xs sm:text-sm text-stone-900 font-medium mt-1">
              Transparent per-kilometer rates &bull; AC vehicles &bull; Safe, courteous drivers in Nagpur.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('booking-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-8 py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Calculate Fare &amp; Book Now
          </button>
        </div>

      </div>
    </section>
  );
};
