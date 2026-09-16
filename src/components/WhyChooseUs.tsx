import React from 'react';
import { 
  MapPin, 
  Compass, 
  Calculator, 
  Car, 
  CalendarCheck, 
  CreditCard 
} from 'lucide-react';
import { WHY_BOKDE_TRAVELS } from '../data/cabConfig';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'nagpur-based':
        return <MapPin className="w-5 h-5 text-amber-600" />;
      case 'local-outstation':
        return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'transparent-fare':
        return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'fleet-options':
        return <Car className="w-5 h-5 text-purple-600" />;
      case 'easy-booking':
        return <CalendarCheck className="w-5 h-5 text-indigo-600" />;
      case 'payment-options':
        return <CreditCard className="w-5 h-5 text-rose-600" />;
      default:
        return <Car className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Factual &amp; Honest Travel
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            Why Bokde Travels
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            No exaggerated claims or hidden fees. Just dependable cabs, courteous drivers, and transparent per-km billing from Nagpur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_BOKDE_TRAVELS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs mb-4">
                {getIcon(item.id)}
              </div>

              <h3 className="font-bold text-base text-stone-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
