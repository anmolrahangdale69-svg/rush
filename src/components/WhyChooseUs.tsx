import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Send, 
  Award,
  Leaf
} from 'lucide-react';
import { AGENCY_DETAILS } from '../data/toursData';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: '24/7 Dedicated Concierge',
      description: 'Your personal expedition director is available via private WhatsApp and direct line from planning to your safe return.'
    },
    {
      icon: <Send className="w-6 h-6 text-amber-600" />,
      title: 'Instant Booking & Owner Alert',
      description: `Every reservation triggers an immediate email confirmation directly to our agency owner (${AGENCY_DETAILS.ownerEmail}) for rapid VIP processing.`
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      title: '100% Financial Protection',
      description: 'All payments are escrow protected with flexible cancellation terms and comprehensive travel disruption assurance.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      title: 'Unrivaled Royal Access',
      description: 'After-hours Amer Fort mirror chamber access, private Lake Pichola royal barges, and intimate feasts prepared by royal palace Khansamas.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      title: '200% Certified Carbon Offset',
      description: 'We double offset the carbon footprint of every land transfer, chartered boat, and hotel night booked through Aura Voyages.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: 'Top-Rated Excellence 2026',
      description: 'Rated 4.98/5 across over 4,200 curated voyages with a 99.4% customer satisfaction and repeat traveler index.'
    }
  ];

  return (
    <section id="why-us" className="bg-stone-900 text-stone-100 py-18 sm:py-26 border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            The Aura Standard
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Why High-End Travelers Trust Us
          </h2>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            We don't just book hotels; we architect transformative journeys with obsessive attention to detail and immediate owner accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-stone-950/60 border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {perk.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                {perk.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
