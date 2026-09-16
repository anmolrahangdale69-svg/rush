import React, { useState } from 'react';
import { Users, Briefcase, Snowflake, Check, ArrowRight } from 'lucide-react';
import { VEHICLES } from '../data/cabConfig';
import { VehicleConfig } from '../types';
import { VehicleVisual } from './VehicleVisual';

interface ChooseYourRideSectionProps {
  onSelectVehicle: (vehicle: VehicleConfig) => void;
}

export const ChooseYourRideSection: React.FC<ChooseYourRideSectionProps> = ({ onSelectVehicle }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredVehicles = VEHICLES.filter(v => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sedan') return v.category.toLowerCase().includes('sedan') || v.category.toLowerCase().includes('hatchback') || v.category.toLowerCase().includes('crossover');
    if (activeFilter === 'muv') return v.category.toLowerCase().includes('muv') || v.category.toLowerCase().includes('mpv');
    return true;
  });

  return (
    <section id="fleet" className="py-16 sm:py-20 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Our Fleet &amp; Transparent Rates
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            Choose Your Cab
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Clean, sanitized, and commercial-permit vehicles available for one-way and round-trip journeys from Nagpur.
          </p>

          {/* Quick Filter Tabs */}
          <div className="mt-6 inline-flex p-1 bg-stone-200/80 rounded-xl">
            {[
              { id: 'all', label: 'All Cabs (4)' },
              { id: 'sedan', label: 'Sedan (4 Seater)' },
              { id: 'muv', label: '6 & 7 Seater MUVs' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-amber-400/80"
            >
              <div>
                {/* Vehicle Visual Header */}
                <div className="p-3 bg-stone-50 border-b border-stone-100 relative">
                  <div className="w-full h-44 overflow-hidden rounded-xl">
                    <VehicleVisual visualId={vehicle.visualId} className="w-full h-full" altText={vehicle.name} />
                  </div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {vehicle.category}
                  </span>

                  {vehicle.id === 'toyota-innova-crysta' && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider">
                      Premium Luxury
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-stone-500">{vehicle.model}</p>
                    </div>
                  </div>

                  {/* Feature Specs */}
                  <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-xl text-center border border-stone-100">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>{vehicle.passengers}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">Seats</span>
                    </div>

                    <div className="flex flex-col items-center border-x border-stone-200">
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        <span>{vehicle.luggage}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">Bags</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
                        <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                        <span>AC</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">Climate</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-stone-500 line-clamp-2">
                    {vehicle.description}
                  </p>
                </div>
              </div>

              {/* Rate & Action Footer */}
              <div className="p-5 pt-0">
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 mb-3 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600 font-medium">One-Way Rate:</span>
                    <span className="font-extrabold text-stone-900 font-mono text-sm">
                      ₹{vehicle.oneWayRate}/km
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600 font-medium">Round-Trip Rate:</span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm">
                      ₹{vehicle.roundTripRate}/km
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 pt-1 text-right">
                    Tolls &amp; parking extra at actuals
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectVehicle(vehicle)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>Select Cab</span>
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
