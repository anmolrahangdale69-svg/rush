import React from 'react';
import { X, Car } from 'lucide-react';
import { BookingFlow } from './BookingFlow';
import { BookingSubmission } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPickup?: string;
  initialDrop?: string;
  initialVehicleId?: string;
  onBookingSuccess?: (booking: BookingSubmission) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPickup,
  initialDrop,
  initialVehicleId,
  onBookingSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-stone-100 rounded-3xl overflow-hidden shadow-2xl my-8 border border-stone-200">
        
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embedded Booking Flow */}
        <div className="p-2 sm:p-4">
          <BookingFlow
            initialPickup={initialPickup}
            initialDrop={initialDrop}
            initialVehicleId={initialVehicleId}
            onBookingComplete={(b) => {
              if (onBookingSuccess) onBookingSuccess(b);
            }}
          />
        </div>

      </div>
    </div>
  );
};
