import React from 'react';
import { MapPin, Navigation, Clock, ArrowRight } from 'lucide-react';
import { POPULAR_NAGPUR_ROUTES } from '../data/cabConfig';

interface PopularRoutesSectionProps {
  onSelectRoute: (from: string, to: string) => void;
}

export const PopularRoutesSection: React.FC<PopularRoutesSectionProps> = ({ onSelectRoute }) => {
  return (
    <section id="popular-routes" className="py-16 sm:py-20 bg-stone-50/80 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Vidarbha &amp; Outstation Travel
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            Popular Routes From Nagpur
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Instant door-to-door cab bookings for frequent business, medical, and family trips across Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_NAGPUR_ROUTES.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-base">
                      {route.from} &rarr; {route.to}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
                    {route.distanceKm} km
                  </span>
                </div>

                {/* Duration & Description */}
                <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Est. driving time: <strong>{route.duration}</strong></span>
                </div>

                <p className="mt-2 text-xs text-stone-600 line-clamp-2">
                  {route.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onSelectRoute(route.from, route.to)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-amber-500 hover:text-stone-950 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-200 group-hover:border-amber-400"
                >
                  <span>Book This Route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
