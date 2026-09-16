import React from 'react';
import { ArrowRight, Compass, Repeat, Building2, Plane } from 'lucide-react';
import { CAB_SERVICES } from '../data/cabConfig';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'oneway':
        return <Compass className="w-6 h-6 text-amber-600" />;
      case 'roundtrip':
        return <Repeat className="w-6 h-6 text-emerald-600" />;
      case 'local':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'airport':
        return <Plane className="w-6 h-6 text-purple-600" />;
      default:
        return <Compass className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Nagpur Travel Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            Our Cab Services
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Whether traveling out of town or needing punctual airport pickup in Nagpur, Bokde Travels has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAB_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-2xs mb-4 group-hover:scale-105 transition-transform">
                  {getIcon(service.id)}
                </div>

                <h3 className="font-bold text-lg text-stone-900 mb-2">
                  {service.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
