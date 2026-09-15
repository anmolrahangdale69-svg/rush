import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Car, 
  Receipt,
  UserCheck,
  Headphones,
  Sparkles
} from 'lucide-react';
import { AGENCY_DETAILS } from '../data/toursData';

export const WhyChooseUs: React.FC = () => {
  const practicalAdvantages = [
    {
      icon: <Receipt className="w-6 h-6 text-amber-500" />,
      title: 'Transparent & Simple Pricing',
      description: 'Clear base fare plus per-km pricing with zero hidden surcharges. What you see is what you pay.'
    },
    {
      icon: <UserCheck className="w-6 h-6 text-amber-500" />,
      title: 'Verified Commercial Chauffeurs',
      description: 'Professional, police-verified drivers experienced in local city navigation and multi-state highway driving.'
    },
    {
      icon: <Car className="w-6 h-6 text-amber-500" />,
      title: 'Clean, Inspected AC Fleet',
      description: 'Every Mini Cab, Sedan, SUV, and 6/7 Seater is sanitised, air-conditioned, and serviced regularly.'
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      title: 'Guaranteed On-Time Pickup',
      description: 'Our chauffeurs arrive at your doorstep 10 minutes ahead of scheduled time for stress-free departures.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-amber-500" />,
      title: '24/7 Highway & Travel Support',
      description: `Direct helpline (${AGENCY_DETAILS.phone}) with live travel desk assistance and highway breakdown support.`
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Safe, Reliable Travel',
      description: 'Emergency assistance, real-time driver tracking, and flexible payment via Cash, UPI (GPay, PhonePe), or Cards.'
    }
  ];

  return (
    <section id="why-us" className="bg-stone-900 text-stone-100 py-16 sm:py-24 border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            <Car className="w-3.5 h-3.5" />
            The Aura Cab Guarantee
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Why Travelers Choose Us
          </h2>
          <p className="text-sm text-stone-400 mt-2 leading-relaxed">
            Comfortable rides. Simple pricing. Easy travel. Reliable cab service across Maharashtra, Central India, and major highway routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practicalAdvantages.map((item, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-800/80 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
