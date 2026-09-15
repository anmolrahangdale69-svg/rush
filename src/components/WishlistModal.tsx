import React from 'react';
import { X, Heart, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { Tour, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTours: Tour[];
  onRemoveFromWishlist: (tourId: string) => void;
  onSelectTourBook: (tour: Tour) => void;
  currency: CurrencyCode;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  savedTours,
  onRemoveFromWishlist,
  onSelectTourBook,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative"
        role="dialog"
      >
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-display font-bold text-lg text-white">
              Saved Expeditions ({savedTours.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {savedTours.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Heart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold text-stone-800">Your wishlist is empty</p>
              <p className="text-xs text-stone-500 mt-1">
                Click the heart icon on any featured tour to save it for later comparison.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedTours.map((tour) => (
                <div
                  key={tour.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-18 h-18 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 font-mono">
                        {tour.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-stone-900 line-clamp-1">
                        {tour.title}
                      </h4>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {tour.destination} &bull; {tour.durationDays} Days
                      </p>
                      <span className="text-xs font-bold text-stone-900 font-mono mt-1 block">
                        {formatPrice(tour.pricePerPerson, currency)} / person
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onRemoveFromWishlist(tour.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectTourBook(tour);
                      }}
                      className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
