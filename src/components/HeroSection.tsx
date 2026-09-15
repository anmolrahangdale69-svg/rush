import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Send,
  Star,
  Compass,
  MapPin,
  CloudSun,
  Clock,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onBookDirectClick: () => void;
  onReplayLogoIntro?: () => void;
}

interface DestinationTheme {
  id: string;
  name: string;
  region: string;
  country: string;
  bgImage: string;
  temp: string;
  weather: string;
  timezone: string;
  accentQuote: string;
}

const HERO_INDIAN_DESTINATIONS: DestinationTheme[] = [
  {
    id: 'udaipur',
    name: 'Udaipur & Thar Desert',
    region: 'Rajasthan',
    country: 'India',
    bgImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85',
    temp: '26°C',
    weather: 'Golden Desert Sun',
    timezone: 'IST (UTC+5:30)',
    accentQuote: 'Taj Lake Palace & Candlelit Thar Glamping'
  },
  {
    id: 'kerala',
    name: 'Alleppey & Munnar Hills',
    region: 'Kerala',
    country: 'India',
    bgImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85',
    temp: '28°C',
    weather: 'Tranquil Tropical Breeze',
    timezone: 'IST (UTC+5:30)',
    accentQuote: 'Private Teak Houseboats & Ancient Ayurvedic Sanctuaries'
  },
  {
    id: 'ladakh',
    name: 'Pangong Tso & Khardung La',
    region: 'Ladakh',
    country: 'India',
    bgImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2000&q=85',
    temp: '14°C',
    weather: 'High Altitude Sun & Azure Skies',
    timezone: 'IST (UTC+5:30)',
    accentQuote: 'Cobalt Lakes, Chanted Mantras & Stargazing Domes'
  },
  {
    id: 'ranthambore',
    name: 'Ranthambore Royal Reserves',
    region: 'Rajasthan / Central India',
    country: 'India',
    bgImage: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2000&q=85',
    temp: '27°C',
    weather: 'Golden Jungle Twilight',
    timezone: 'IST (UTC+5:30)',
    accentQuote: 'Royal Bengal Tiger Safaris & Ancient Fortress Ruins'
  },
  {
    id: 'kashmir',
    name: 'Dal Lake & Gulmarg',
    region: 'Jammu & Kashmir',
    country: 'India',
    bgImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2000&q=85',
    temp: '16°C',
    weather: 'Crisp Cedar & Alpine Air',
    timezone: 'IST (UTC+5:30)',
    accentQuote: 'Hand-Carved Cedar Houseboats & Gondola Peaks'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onBookDirectClick,
  onReplayLogoIntro
}) => {
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const activeDest = HERO_INDIAN_DESTINATIONS[activeDestIndex];

  // Auto-cycle destinations every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDestIndex((prev) => (prev + 1) % HERO_INDIAN_DESTINATIONS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none">
      
      {/* Background Image Layer with Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {HERO_INDIAN_DESTINATIONS.map((dest, idx) => (
          <div
            key={dest.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ease-out ${
              idx === activeDestIndex ? 'opacity-55' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${dest.bgImage})` }}
          />
        ))}

        {/* Sophisticated Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
        
        {/* Top Royal Indian Agency Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-lg shadow-amber-500/5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Incredible India • Curators of Bespoke Expeditions</span>
          {onReplayLogoIntro && (
            <button
              onClick={onReplayLogoIntro}
              title="Watch Royal Logo Reveal"
              className="ml-2 pl-2 border-l border-amber-500/30 hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
            >
              <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Reveal Crest</span>
            </button>
          )}
        </div>

        {/* Dynamic Location Climate Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-stone-300 mb-6 font-medium">
          <span className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {activeDest.name}, {activeDest.region}
          </span>
          <span className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            {activeDest.temp} &bull; {activeDest.weather}
          </span>
          <span className="hidden sm:flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {activeDest.timezone}
          </span>
        </div>

        {/* Majestic Indian Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.12]">
          Experience India in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-serif italic font-normal">
            Royal Splendor
          </span>
        </h1>

        {/* Subtitle with active destination quote */}
        <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl font-light leading-relaxed">
          From the floating marble palaces of Udaipur to the tranquil emerald backwaters of Kerala and the high passes of Ladakh—we architect unforgettable private journeys with immediate owner stewardship.
        </p>

        {/* Active Destination Quote Pill */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-stone-900/60 border border-amber-500/20 text-amber-200 text-xs font-serif italic tracking-wide">
          &ldquo;{activeDest.accentQuote}&rdquo;
        </div>

        {/* Main Call to Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-600/20 hover:shadow-amber-600/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Curated Expeditions</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBookDirectClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 text-stone-200 hover:text-white font-medium text-sm tracking-wide border border-stone-700/80 hover:border-amber-500/50 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book Direct with Concierge</span>
          </button>
        </div>

        {/* Destination Switcher Carousel Dots / Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {HERO_INDIAN_DESTINATIONS.map((dest, idx) => {
            const isActive = idx === activeDestIndex;
            return (
              <button
                key={dest.id}
                onClick={() => setActiveDestIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-stone-900/70 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 border border-stone-800'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>

        {/* Trust & Accreditations Footer Badges */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                4.98 / 5.0
              </div>
              <div className="text-[11px] text-stone-400">850+ Verified Reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% Protected</div>
              <div className="text-[11px] text-stone-400">Escrow &amp; Flexible Terms</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Condé Nast 2026</div>
              <div className="text-[11px] text-stone-400">Top Indian Luxury Agency</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Immediate Dispatch</div>
              <div className="text-[11px] text-stone-400">Owner Email Direct Alert</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
