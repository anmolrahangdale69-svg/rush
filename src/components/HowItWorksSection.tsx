import React from 'react';
import { MapPin, Car, ShieldCheck, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Pickup & Destination',
      description: 'Choose your pickup address, destination city, travel date, and preferred trip type (City Ride or Outstation).',
      icon: MapPin,
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'Select Vehicle & View Transparent Fare',
      description: 'Choose from Mini Cab, Sedan, SUV, or 6/7 Seater. See clear upfront fares with zero surge charges and direct meter rates.',
      icon: Car,
      badge: 'Step 2'
    },
    {
      step: '03',
      title: 'Verified Chauffeur Arrives at Your Door',
      description: 'Receive driver details instantly. Relax in a clean, air-conditioned vehicle with 24/7 highway support and seamless travel.',
      icon: ShieldCheck,
      badge: 'Step 3'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Simple &amp; Hassle-Free
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Booking your cab takes under 60 seconds with transparent pricing and guaranteed doorstep pickup.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-stone-300">
                    {item.step}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{item.badge} Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-4 sm:p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base sm:text-lg text-white">
              Need a custom multi-city itinerary or corporate cab?
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
              Talk directly to our 24/7 travel desk for customized vehicle rental packages.
            </p>
          </div>
          <a
            href="tel:+919823012345"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer"
          >
            Call 24/7 Helpline
          </a>
        </div>

      </div>
    </section>
  );
};
