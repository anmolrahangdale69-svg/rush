import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight,
  Car,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Navigation,
  PhoneCall
} from 'lucide-react';
import { AGENCY_DETAILS } from '../data/toursData';

interface HeroSectionProps {
  onBookCabClick: () => void;
  onExploreOutstationClick: () => void;
  onReplayLogoIntro?: () => void;
}

interface HeroSlide {
  id: string;
  title: string;
  route: string;
  bgImage: string;
  badge: string;
  rateInfo: string;
}

const HERO_CAB_SLIDES: HeroSlide[] = [
  {
    id: 'slide-expressway',
    title: 'Smooth Highway Travel',
    route: 'Mumbai ⇄ Pune Expressway',
    bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=85',
    badge: 'Expressway Route',
    rateInfo: 'Sedans from ₹15/km'
  },
  {
    id: 'slide-heritage',
    title: 'Intercity Highway Trips',
    route: 'Delhi ⇄ Agra Yamuna Expressway',
    bgImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2000&q=85',
    badge: 'Intercity Connect',
    rateInfo: 'SUVs from ₹20/km'
  },
  {
    id: 'slide-ghats',
    title: 'Scenic Road Journeys',
    route: 'Nagpur ⇄ Pune & Western Ghats',
    bgImage: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2000&q=85',
    badge: 'Outstation Long Drive',
    rateInfo: 'Flat & Per-Km Rates'
  },
  {
    id: 'slide-city',
    title: 'Reliable Local City Travel',
    route: 'Bangalore • Hyderabad • Delhi • Mumbai',
    bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=2000&q=85',
    badge: 'City Rides',
    rateInfo: 'Mini Cabs from ₹12/km'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookCabClick,
  onExploreOutstationClick,
  onReplayLogoIntro
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = HERO_CAB_SLIDES[activeSlideIndex];

  // Auto-cycle slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_CAB_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none">
      
      {/* Background Image Layer with Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {HERO_CAB_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ease-out ${
              idx === activeSlideIndex ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
        ))}

        {/* High-Contrast Gradients for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-transparent to-stone-950/90" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center flex flex-col items-center">
        
        {/* Service Positioning Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md shadow-xs">
          <Car className="w-3.5 h-3.5 text-amber-400" />
          <span>India&apos;s Practical Cab &amp; Outstation Travel Service</span>
        </div>

        {/* Dynamic Route Info Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-300 mb-6 font-medium">
          <span className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            {activeSlide.route}
          </span>
          <span className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800 text-amber-300">
            {activeSlide.rateInfo}
          </span>
        </div>

        {/* User Required Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.12]">
          Your ride. Your route.{' '}
          <span className="text-amber-400">
            Your way.
          </span>
        </h1>

        {/* User Required Supporting Text */}
        <p className="mt-5 text-base sm:text-xl text-stone-300 max-w-2xl font-normal leading-relaxed">
          Comfortable and reliable cabs for city and outstation travel.
        </p>

        {/* Practical Service Promise Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Fixed &amp; Transparent Rates
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Clean AC Hatchbacks, Sedans &amp; SUVs
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Drivers
          </span>
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBookCabClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-base tracking-wide shadow-xl shadow-amber-600/20 hover:shadow-amber-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Car className="w-5 h-5" />
            <span>Book a Cab</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreOutstationClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-semibold text-base tracking-wide border border-stone-700 hover:border-amber-500/50 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Explore Outstation</span>
          </button>
        </div>

        {/* Slide Selector Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {HERO_CAB_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {slide.title}
              </button>
            );
          })}
        </div>

        {/* Practical Service Highlights Strip */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 w-full grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
              <Car className="w-4 h-4" />
              <span>Starting ₹12/km</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Mini, Sedan, SUV &amp; 7-Seater</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>No Hidden Charges</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Toll &amp; state tax transparency</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
            <div className="text-sky-400 font-bold text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>On-Time Guarantee</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Doorstep cab dispatch</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>24/7 Helpline</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">{AGENCY_DETAILS.phone}</div>
          </div>
        </div>

      </div>
    </section>
  );
};
