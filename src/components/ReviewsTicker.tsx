import React from 'react';
import { Star, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { CUSTOMER_REVIEWS, REVIEW_METRICS } from '../data/reviewsData';

interface ReviewsTickerProps {
  onViewAllClick?: () => void;
}

export const ReviewsTicker: React.FC<ReviewsTickerProps> = ({ onViewAllClick }) => {
  // Highlight 8 diverse reviews for the ticker ribbon
  const tickerItems = CUSTOMER_REVIEWS.slice(0, 10);

  const handleScrollToReviews = () => {
    if (onViewAllClick) {
      onViewAllClick();
      return;
    }
    const el = document.getElementById('customer-reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-amber-50/90 border-y border-amber-200/80 py-2.5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Overall Trust Rating Badge */}
        <div 
          onClick={handleScrollToReviews}
          className="flex items-center gap-2 cursor-pointer shrink-0 hover:opacity-85 transition-opacity"
        >
          <div className="flex items-center gap-0.5 text-amber-500 bg-stone-950 px-2.5 py-1 rounded-lg shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-white ml-0.5 font-mono">{REVIEW_METRICS.averageRating}</span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-stone-900 tracking-tight">
              <span>{REVIEW_METRICS.totalReviews}+ Verified Customer Reviews</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            </div>
            <p className="text-[10px] text-stone-500">
              Nagpur, Vidarbha &amp; Interstate Outstation Rides
            </p>
          </div>
        </div>

        {/* Center: Interactive Scrolling Live Review Snippets */}
        <div className="flex-1 w-full overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2.5 whitespace-nowrap min-w-max">
            {tickerItems.map((rev) => (
              <button
                key={rev.id}
                type="button"
                onClick={handleScrollToReviews}
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-100/50 border border-stone-200 hover:border-amber-400 px-3 py-1.5 rounded-full text-xs text-stone-800 shadow-2xs transition-all cursor-pointer"
              >
                <span className="flex items-center text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <span className="font-bold text-stone-900">{rev.route}</span>
                <span className="text-stone-300">&bull;</span>
                <span className="text-stone-600 font-medium truncate max-w-[200px] sm:max-w-[260px]">
                  "{rev.reviewText.slice(0, 48)}..."
                </span>
                <span className="font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded text-[10px]">
                  {rev.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Button */}
        <button
          type="button"
          onClick={handleScrollToReviews}
          className="shrink-0 text-xs font-extrabold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer underline-offset-2 hover:underline"
        >
          <span>All 20 Reviews</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
        </button>

      </div>
    </div>
  );
};
