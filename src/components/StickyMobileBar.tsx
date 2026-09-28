import React, { useState } from 'react';
import { Phone, MessageSquare, Car, X } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface StickyMobileBarProps {
  onBookClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onBookClick }) => {
  const [showContactSheet, setShowContactSheet] = useState(false);

  const ownerWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I want to book a cab from Nagpur.')}`;
  const helplineWhatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumberAlt}?text=${encodeURIComponent('Hello Bokde Travels Helpline, I need assistance with cab booking.')}`;

  return (
    <>
      {/* Mobile Contact Sheet with both Owner and Helpline */}
      {showContactSheet && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-end sm:hidden animate-in fade-in duration-150">
          <div className="w-full bg-stone-900 rounded-t-3xl border-t border-stone-800 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h3 className="font-serif font-bold text-white text-base">Contact Bokde Travels</h3>
                <p className="text-xs text-stone-400">Direct Owner &amp; 24/7 Helpline Numbers</p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactSheet(false)}
                className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white"
                aria-label="Close contact sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner Contact Card */}
            <div className="bg-stone-800/90 rounded-2xl p-3.5 border border-amber-500/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Owner (Direct)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-semibold">Priority</span>
                </div>
                <span className="text-xs font-mono text-white font-bold">{BUSINESS_CONFIG.displayOwnerPhone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Owner</span>
                </a>
                <a
                  href={ownerWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 24/7 Helpline Card */}
            <div className="bg-stone-800/90 rounded-2xl p-3.5 border border-stone-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">24/7 Helpline</span>
                <span className="text-xs font-mono text-stone-300 font-bold">{BUSINESS_CONFIG.displayHelplinePhone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${BUSINESS_CONFIG.helplinePhone}`}
                  className="py-2.5 px-3 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Helpline</span>
                </a>
                <a
                  href={helplineWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main sticky mobile bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-2.5 shadow-2xl flex items-center gap-2">
        {/* Call Button (Owner) with quick tap */}
        <a
          href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
          className="flex-1 py-2.5 px-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-stone-700"
          title={`Call Owner (${BUSINESS_CONFIG.ownerPhone})`}
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call Owner</span>
        </a>

        {/* WhatsApp Button (Owner) */}
        <a
          href={ownerWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-600"
          title="WhatsApp Owner"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        {/* Options / Both Numbers Button */}
        <button
          type="button"
          onClick={() => setShowContactSheet(true)}
          className="py-2.5 px-2 bg-stone-800 text-amber-400 border border-amber-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center"
          title="View both owner and helpline numbers"
        >
          <span>Both #</span>
        </button>

        {/* Book Button */}
        <button
          type="button"
          onClick={onBookClick}
          className="flex-1 py-2.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow-md cursor-pointer"
        >
          <Car className="w-3.5 h-3.5" />
          <span>Book</span>
        </button>
      </div>
    </>
  );
};
