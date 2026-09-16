import React from 'react';
import { Phone, Calendar, ArrowRight, ShieldCheck, MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface HeroSectionProps {
  onBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookClick }) => {
  return (
    <section className="relative bg-gradient-to-b from-amber-50/40 via-white to-stone-50 pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Layout */}
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span>Bokde Travels &bull; Nagpur, Maharashtra</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12]">
            Reliable Cabs From Nagpur
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-xl font-medium text-stone-600 tracking-normal">
            Local &bull; Outstation &bull; Round Trip &bull; Airport Transfer
          </p>

          <p className="mt-2 text-sm text-stone-500 max-w-xl mx-auto">
            Transparent per-km fares, clean AC vehicles, and punctual commercial drivers for comfortable travel across Vidarbha and all India routes.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Book a Cab</span>
              <ArrowRight className="w-5 h-5 text-stone-900 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-bold text-base shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call Now: <strong>{BUSINESS_CONFIG.phone}</strong></span>
            </a>
          </div>

          {/* Clean trust indicators */}
          <div className="mt-10 pt-8 border-t border-stone-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-stone-200/60 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-stone-900">Per-KM Billing</div>
                <div className="text-[11px] text-stone-500">Zero hidden fees</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-stone-200/60 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-stone-900">Verified Chauffeurs</div>
                <div className="text-[11px] text-stone-500">Punctual &amp; polite</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-stone-200/60 shadow-2xs">
              <Navigation className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-stone-900">Nagpur Airport</div>
                <div className="text-[11px] text-stone-500">Pickup &amp; drop available</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-stone-200/60 shadow-2xs">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-stone-900">Any Route</div>
                <div className="text-[11px] text-stone-500">Local or Outstation</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
