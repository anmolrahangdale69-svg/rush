import React from 'react';
import { Phone, MessageSquare, Car } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface StickyMobileBarProps {
  onBookClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onBookClick }) => {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Bokde Travels, I want to book a cab from Nagpur.')}`;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-2.5 shadow-2xl flex items-center gap-2">
      {/* Call Button */}
      <a
        href={`tel:${BUSINESS_CONFIG.phone}`}
        className="flex-1 py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-700"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400" />
        <span>Call</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-600"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* Book Button */}
      <button
        type="button"
        onClick={onBookClick}
        className="flex-1 py-2.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
      >
        <Car className="w-3.5 h-3.5" />
        <span>Book Cab</span>
      </button>
    </div>
  );
};
