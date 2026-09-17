import React from 'react';
import { Phone, Mail, MapPin, Car, MessageSquare, CreditCard } from 'lucide-react';
import { BUSINESS_CONFIG, VEHICLES } from '../data/cabConfig';

export const Footer: React.FC = () => {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I need assistance with cab booking.')}`;

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 sm:pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Car className="w-6 h-6 text-stone-950" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white tracking-tight block">
                  Bokde Travels
                </span>
                <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase block">
                  Nagpur Cab Service
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Professional, dependable, and transparent taxi and cab rental services operating across Nagpur, Vidarbha, and all-India outstation routes.
            </p>

            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Accepted UPI Payments</span>
              </div>
              <p className="text-[11px] font-mono text-stone-300">
                {BUSINESS_CONFIG.upiId}
              </p>
            </div>
          </div>

          {/* Col 2: Our Fleet */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 text-amber-400">
              Our Vehicle Fleet
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {VEHICLES.map(v => (
                <li key={v.id} className="flex justify-between items-center hover:text-white transition-colors">
                  <span>{v.name} ({v.category})</span>
                  <span className="font-mono text-stone-300">Round: ₹{v.roundTripRate}/km</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services & Key Routes */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 text-amber-400">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Nagpur &rarr; Wardha (78 km)</li>
              <li>Nagpur &rarr; Amravati (155 km)</li>
              <li>Nagpur &rarr; Chandrapur (150 km)</li>
              <li>Nagpur &rarr; Bhandara (65 km)</li>
              <li>Nagpur &rarr; Gondia (165 km)</li>
              <li>Nagpur &rarr; Yavatmal (152 km)</li>
              <li>Dr. Babasaheb Ambedkar Airport Transfers</li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 text-amber-400">
              Direct Contact
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{BUSINESS_CONFIG.city}, {BUSINESS_CONFIG.state}, India</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`tel:${BUSINESS_CONFIG.phone}`} className="hover:text-white font-bold">
                {BUSINESS_CONFIG.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white">
                {BUSINESS_CONFIG.email}
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Booking</span>
              </a>
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {BUSINESS_CONFIG.phone}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.name}, {BUSINESS_CONFIG.city}. All rights reserved.
          </p>
          <p className="text-[11px] text-stone-600">
            Toll, parking, and inter-state permit charges payable by customer at actuals.
          </p>
        </div>

      </div>
    </footer>
  );
};
