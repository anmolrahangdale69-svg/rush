import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, CreditCard } from 'lucide-react';
import { BUSINESS_CONFIG, VEHICLES } from '../data/cabConfig';
import { BokdeLogo } from './BokdeLogo';

export const Footer: React.FC = () => {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I need assistance with cab booking.')}`;

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 sm:pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <BokdeLogo size="md" variant="white" />

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
                <li key={v.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-stone-800/60 hover:text-white transition-colors">
                  <span className="font-semibold text-stone-300">{v.name}</span>
                  <span className="font-mono text-[11px] text-amber-400/90">
                    Single: ₹{v.oneWayRate}/km &bull; Round: ₹{v.roundTripRate}/km &bull; Local: ₹{v.localHourlyRate}/hr
                  </span>
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

            {/* Owner Contact */}
            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700/60 space-y-1">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Owner (Direct)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-normal">Calling &amp; WA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <a href={`tel:${BUSINESS_CONFIG.ownerPhone}`} className="hover:text-white font-mono font-bold text-stone-100 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{BUSINESS_CONFIG.displayOwnerPhone}</span>
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I want to book a cab from Nagpur.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </a>
              </div>
            </div>

            {/* Helpline Contact */}
            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700/60 space-y-1">
              <div className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span>24/7 Helpline &amp; Support</span>
                <span className="text-[10px] bg-stone-700 text-stone-300 px-1 py-0.2 rounded font-normal">Calling &amp; WA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <a href={`tel:${BUSINESS_CONFIG.helplinePhone}`} className="hover:text-white font-mono font-bold text-stone-100 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{BUSINESS_CONFIG.displayHelplinePhone}</span>
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumberAlt}?text=${encodeURIComponent('Hello Bokde Travels Helpline, I need assistance with cab booking.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300 pt-1">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white">
                {BUSINESS_CONFIG.email}
              </a>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
                className="py-2 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Owner</span>
              </a>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I need assistance with cab booking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
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
