import React, { useState } from 'react';
import { Phone, MessageSquare, Car, Menu, X } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface NavbarProps {
  onOpenBooking: (prefill?: { pickup?: string; drop?: string; vehicleId?: string }) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I would like to inquire about booking a cab from Nagpur.')}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-white">Nagpur's Reliable Cab Service &bull; Local &amp; Outstation</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>UPI: <strong className="text-amber-400 font-mono">{BUSINESS_CONFIG.upiId}</strong></span>
            <span>24/7 Helpline: <a href={`tel:${BUSINESS_CONFIG.phone}`} className="text-white hover:underline font-bold">{BUSINESS_CONFIG.displayPhone}</a></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm font-bold group-hover:bg-amber-400 transition-colors">
            <Car className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <span className="font-display font-bold text-xl sm:text-2xl text-stone-900 tracking-tight block leading-tight">
              Bokde Travels
            </span>
            <span className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase block">
              Nagpur &bull; Cab Service
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <button 
            type="button" 
            onClick={() => scrollToSection('booking-section')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Book a Cab
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('booking-section')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Our Fleet &amp; Rates
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('services')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Services
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('popular-routes')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Nagpur Routes
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('why-us')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Why Us
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${BUSINESS_CONFIG.phone}`}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>{BUSINESS_CONFIG.displayPhone}</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            Book a Cab
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={`tel:${BUSINESS_CONFIG.phone}`}
            className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center"
            aria-label="Call Bokde Travels"
          >
            <Phone className="w-4 h-4 text-amber-600" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <button
            type="button"
            onClick={() => scrollToSection('booking-section')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Book a Cab
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('booking-section')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Our Fleet &amp; Rates (4 Vehicles)
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('services')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Services (One Way, Round Trip, Local, Airport)
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('popular-routes')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Popular Nagpur Routes
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('why-us')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Why Bokde Travels
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('faq')}
            className="w-full text-left py-2 px-3 rounded-lg font-semibold text-stone-800 hover:bg-stone-50"
          >
            Frequently Asked Questions
          </button>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-amber-500 text-stone-950 rounded-xl font-bold text-center text-sm shadow-sm"
            >
              Book a Cab Now
            </button>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="py-2.5 px-3 bg-stone-900 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Now</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-600 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
