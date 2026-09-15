import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Heart, 
  Inbox, 
  Menu, 
  X, 
  Database, 
  ShieldCheck, 
  Globe,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenOwnerInbox: () => void;
  onOpenSupabaseModal: () => void;
  notificationsCount: number;
  onScrollToSection: (sectionId: string) => void;
  onReplayLogoIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  wishlistCount,
  onOpenWishlist,
  onOpenOwnerInbox,
  onOpenSupabaseModal,
  notificationsCount,
  onScrollToSection,
  onReplayLogoIntro
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all duration-300">
      {/* Top micro-bar for agency credentials */}
      <div className="bg-stone-950 px-4 py-1.5 border-b border-stone-800/80 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Luxury Expeditions • New Delhi, India
            </span>
            <span className="inline-flex items-center gap-1 text-stone-300">
              <PhoneCall className="w-3 h-3 text-amber-500" />
              VIP Concierge: +91 (11) 4920-8800
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase & GitHub status pill */}
            <button
              onClick={onOpenSupabaseModal}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              title="View Supabase backend & GitHub / Vercel deployment status"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="font-mono text-[11px]">Supabase &amp; Vercel Ready</span>
            </button>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 border-l border-stone-800 pl-3">
              <Globe className="w-3 h-3 text-stone-400" />
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-transparent text-amber-400 text-xs font-bold focus:outline-none cursor-pointer"
                aria-label="Select currency"
              >
                <option value="INR" className="bg-stone-900 text-white">INR (₹)</option>
                <option value="USD" className="bg-stone-900 text-white">USD ($)</option>
                <option value="EUR" className="bg-stone-900 text-white">EUR (€)</option>
                <option value="GBP" className="bg-stone-900 text-white">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onScrollToSection('hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-stone-950 shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-stone-950 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1">
              Aura<span className="text-amber-400 font-serif italic">Voyages</span>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded ml-1.5">India</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-stone-400 -mt-0.5 font-sans">
              Royal Heritage Expeditions
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button 
            onClick={() => onScrollToSection('tours')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Indian Tours
          </button>
          <button 
            onClick={() => onScrollToSection('choose-ride')} 
            className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 font-semibold"
          >
            Choose Your Ride
          </button>
          <button 
            onClick={() => onScrollToSection('search')} 
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Find Destination
          </button>
          <button 
            onClick={() => onScrollToSection('why-us')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Why Aura
          </button>
          <button 
            onClick={() => onScrollToSection('testimonials')} 
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Royal Guests
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Saved Tours"
            aria-label="Saved Tours"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Replay Logo Animation button */}
          {onReplayLogoIntro && (
            <button
              onClick={onReplayLogoIntro}
              className="hidden lg:inline-flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Reveal Royal Logo Animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Royal Crest</span>
            </button>
          )}

          {/* Owner Dashboard & Email Notification Center */}
          <button
            onClick={onOpenOwnerInbox}
            className="relative flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700/80 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm group"
            title="Agency Owner Portal: Check live incoming bookings and immediate automated email notifications to anmolrahangdale69@gmail.com"
          >
            <div className="relative">
              <Inbox className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              )}
            </div>
            <span className="hidden sm:inline">Owner Inbox</span>
            {notificationsCount > 0 && (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onScrollToSection('tours')}
            className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md shadow-amber-900/20 hover:shadow-lg cursor-pointer"
          >
            Book An Expedition
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-400 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => { onScrollToSection('tours'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Indian Expeditions
          </button>
          <button
            onClick={() => { onScrollToSection('choose-ride'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-amber-300 hover:text-amber-400 font-semibold flex items-center justify-between"
          >
            <span>Choose Your Ride</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase font-bold">New</span>
          </button>
          <button
            onClick={() => { onScrollToSection('search'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Search Indian Destinations
          </button>
          <button
            onClick={() => { onScrollToSection('why-us'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Why Aura Voyages India
          </button>
          <button
            onClick={() => { onScrollToSection('testimonials'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Guest Testimonials
          </button>
          <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
            {/* Mobile Currency Selector */}
            <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-lg border border-stone-800">
              <span className="text-xs text-stone-400 flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                Select Currency:
              </span>
              <div className="flex items-center gap-1">
                {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => onCurrencyChange(curr)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      currency === curr
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-stone-400 hover:text-white bg-stone-800'
                    }`}
                  >
                    {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : curr === 'EUR' ? '€ EUR' : '£ GBP'}
                  </button>
                ))}
              </div>
            </div>

            {onReplayLogoIntro && (
              <button
                onClick={() => { onReplayLogoIntro(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 w-full bg-amber-500/20 text-amber-300 border border-amber-500/30 p-2.5 rounded-lg text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Reveal Royal Logo Animation</span>
              </button>
            )}
            <button
              onClick={() => { onOpenOwnerInbox(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full bg-stone-800 text-stone-200 p-2.5 rounded-lg text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                Owner Portal &amp; Email Logs
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                {notificationsCount} New
              </span>
            </button>
            <button
              onClick={() => { onOpenSupabaseModal(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 p-2.5 rounded-lg text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Supabase &amp; Vercel Settings
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
