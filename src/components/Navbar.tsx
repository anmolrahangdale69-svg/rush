import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X, Star } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/cabConfig';
import { BokdeLogo } from './BokdeLogo';

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

  const ownerWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I would like to inquire about booking a cab from Nagpur.')}`;
  const helplineWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumberAlt}?text=${encodeURIComponent('Hello Bokde Travels Helpline, I need assistance with cab booking.')}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-white">Nagpur's Reliable Cab Service &bull; Local &amp; Outstation</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>UPI: <strong className="text-amber-400 font-mono">{BUSINESS_CONFIG.upiId}</strong></span>
            <span className="text-stone-500">&bull;</span>
            <span>Owner (Call &amp; WA): <a href={`tel:${BUSINESS_CONFIG.ownerPhone}`} className="text-amber-400 hover:underline font-bold">{BUSINESS_CONFIG.displayOwnerPhone}</a></span>
            <span className="text-stone-500">&bull;</span>
            <span>Helpline: <a href={`tel:${BUSINESS_CONFIG.helplinePhone}`} className="text-white hover:underline font-bold">{BUSINESS_CONFIG.displayHelplinePhone}</a></span>
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
          <BokdeLogo size="md" variant="dark" />
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
            onClick={() => scrollToSection('customer-reviews')} 
            className="hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1 font-bold text-stone-900"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Reviews</span>
            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-mono">20</span>
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
        <div className="hidden lg:flex items-center gap-2.5">
          {/* WhatsApp Owner */}
          <a
            href={ownerWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
            title="Chat on WhatsApp with Owner (8830853261)"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Direct Dual Call Pill */}
          <div className="flex items-center bg-stone-100/90 rounded-xl p-1 border border-stone-200/90 text-xs">
            <a
              href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
              className="px-2.5 py-1.5 rounded-lg hover:bg-white text-stone-900 font-bold flex items-center gap-1.5 transition-all"
              title="Call Owner directly (8830853261)"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{BUSINESS_CONFIG.ownerPhone}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-semibold leading-none">Owner</span>
            </a>
            <span className="text-stone-300 font-light">|</span>
            <a
              href={`tel:${BUSINESS_CONFIG.helplinePhone}`}
              className="px-2.5 py-1.5 rounded-lg hover:bg-white text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1 transition-all"
              title="Call 24/7 Helpline (8983275497)"
            >
              <span>{BUSINESS_CONFIG.helplinePhone}</span>
              <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1 py-0.5 rounded font-medium leading-none">Helpline</span>
            </a>
          </div>

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
          <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
            <BokdeLogo size="sm" variant="dark" />
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Nagpur Cabs</span>
          </div>
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
            onClick={() => scrollToSection('customer-reviews')}
            className="w-full text-left py-2 px-3 rounded-lg font-bold text-stone-900 bg-amber-50/80 border border-amber-200/60 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Customer Reviews</span>
            </span>
            <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono font-bold">20 Verified</span>
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
            {/* Direct Contact Options: Owner & Helpline */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">Owner (Bokde Travels)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1 rounded font-semibold">Direct</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono font-medium">{BUSINESS_CONFIG.displayOwnerPhone}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
                    className="py-1.5 px-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title="Call Owner"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={ownerWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title="WhatsApp Owner"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WA</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-700">24/7 Helpline &amp; Booking</div>
                  <div className="text-[11px] text-stone-500 font-mono font-medium">{BUSINESS_CONFIG.displayHelplinePhone}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${BUSINESS_CONFIG.helplinePhone}`}
                    className="py-1.5 px-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title="Call Helpline"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>Call</span>
                  </a>
                  <a
                    href={helplineWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title="WhatsApp Helpline"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
