import React from 'react';
import { 
  Compass, 
  Mail, 
  Phone, 
  MapPin, 
  Database, 
  Github, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { AGENCY_DETAILS } from '../data/toursData';

interface FooterProps {
  onOpenOwnerInbox: () => void;
  onOpenSupabaseModal: () => void;
  onSelectDestination: (dest: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerInbox,
  onOpenSupabaseModal,
  onSelectDestination
}) => {
  const destinations = [
    'Rajasthan Palaces',
    'Kerala Backwaters',
    'Ladakh Himalayas',
    'Ranthambore Tigers',
    'Varanasi & Ganges',
    'Kashmir Paradise',
    'Goa & Konkan',
    'Andaman Islands'
  ];

  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      
      {/* Top Footer Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Aura<span className="text-amber-400 font-serif italic">Voyages</span>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1 py-0.5 rounded ml-1.5">India</span>
            </span>
          </div>

          <p className="text-stone-400 leading-relaxed text-xs">
            Bespoke Indian royal heritage expeditions, private lake palace sojourns, backwater kettuvallam cruises, and high Himalayan odysseys. 
            All reservations feature real-time database management and immediate owner notification alerts.
          </p>

          <div className="pt-2 flex flex-col gap-1 text-[11px] text-stone-500 font-mono">
            <span>Owner Dispatch: {AGENCY_DETAILS.ownerEmail}</span>
            <span>Database: Supabase (PostgreSQL)</span>
            <span>Deployment: Vercel &amp; GitHub Ready</span>
          </div>
        </div>

        {/* Featured Destinations Column */}
        <div>
          <h4 className="font-display font-bold text-sm text-stone-200 uppercase tracking-wider mb-3">
            Indian Expeditions
          </h4>
          <ul className="space-y-2">
            {destinations.map((d) => (
              <li key={d}>
                <button
                  onClick={() => onSelectDestination(d)}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  {d}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical & Agency Operations */}
        <div>
          <h4 className="font-display font-bold text-sm text-stone-200 uppercase tracking-wider mb-3">
            Agency Operations
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={onOpenOwnerInbox}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-amber-500/90 font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Owner Booking Dispatch &amp; Email Inbox</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenSupabaseModal}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-emerald-400/90"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Schema &amp; Vercel Config</span>
              </button>
            </li>
            <li>
              <span className="text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Ministry of Tourism India Approved</span>
              </span>
            </li>
            <li>
              <span className="text-stone-500 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-stone-400" />
                <span>Escrow Traveler Protection Guarantee</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Contact & Concierge */}
        <div>
          <h4 className="font-display font-bold text-sm text-stone-200 uppercase tracking-wider mb-3">
            Headquarters &amp; Branches
          </h4>
          <div className="space-y-2 text-stone-400">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{AGENCY_DETAILS.address}</span>
            </p>
            <p className="text-[11px] text-stone-500 pl-6">
              {AGENCY_DETAILS.branches}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{AGENCY_DETAILS.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{AGENCY_DETAILS.ownerEmail}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-stone-900 bg-stone-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} {AGENCY_DETAILS.legalName}. All rights reserved. Registered High-End Tour Operator in India.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSupabaseModal} className="hover:text-stone-300 transition-colors cursor-pointer">
              Supabase Backend
            </button>
            <span>&bull;</span>
            <button onClick={onOpenOwnerInbox} className="hover:text-stone-300 transition-colors cursor-pointer">
              Owner Inbox
            </button>
            <span>&bull;</span>
            <span>Vercel Optimized</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
