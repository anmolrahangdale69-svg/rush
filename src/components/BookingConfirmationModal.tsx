import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Send, 
  Download, 
  Inbox, 
  Calendar, 
  Users, 
  Compass, 
  X,
  QrCode
} from 'lucide-react';
import { BookingSubmission, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { AGENCY_DETAILS } from '../data/toursData';

interface BookingConfirmationModalProps {
  booking: BookingSubmission | null;
  onClose: () => void;
  onOpenOwnerInbox: () => void;
  currency: CurrencyCode;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
  onOpenOwnerInbox,
  currency
}) => {
  if (!booking) return null;

  useEffect(() => {
    // Fire celebratory confetti on open
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#f59e0b', '#10b981', '#1c1917']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative"
        role="dialog"
      >
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-mono">
            Reservation Confirmed
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
            Your Voyage is Officially Booked!
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-md mx-auto">
            Thank you, <strong>{booking.customerName}</strong>. Your confirmation reference is{' '}
            <span className="font-mono text-amber-400 font-bold">{booking.bookingReference}</span>.
          </p>
        </div>

        {/* OWNER NOTIFICATION DISPATCHED BANNER (Highlight requested in prompt) */}
        <div className="bg-amber-500/15 border-y border-amber-500/30 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-700 rounded-lg shrink-0 mt-0.5">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900 block text-xs">
                Owner Email Notification Dispatched Immediately!
              </span>
              <span className="text-[11px] text-amber-800">
                A confirmation email with all booking details has been sent to the agency owner at{' '}
                <strong className="underline">{AGENCY_DETAILS.ownerEmail}</strong>.
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenOwnerInbox();
            }}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>View Owner Inbox</span>
          </button>
        </div>

        {/* Luxury Boarding Pass / Ticket Summary */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 relative">
            {/* Cutout circles for ticket effect */}
            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-stone-200" />
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-stone-200" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/80 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Expedition Title
                </span>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {booking.tourTitle}
                </h3>
                <span className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  {booking.destination}
                </span>
              </div>

              <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Reference Code
                </span>
                <span className="font-mono text-base font-bold text-stone-900 bg-stone-200/60 px-2 py-0.5 rounded">
                  {booking.bookingReference}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Departure Date</span>
                <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  {new Date(booking.departureDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Travelers</span>
                <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  {booking.travelerCount} Person(s)
                </span>
              </div>

              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Lead Guest</span>
                <span className="font-semibold text-stone-800 mt-0.5 block truncate">
                  {booking.customerName}
                </span>
              </div>

              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Total Paid</span>
                <span className="font-mono font-bold text-amber-700 text-sm mt-0.5 block">
                  {formatPrice(booking.totalPrice, currency)}
                </span>
              </div>
            </div>

            {/* Simulated verification badge */}
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-stone-700" />
                Digital QR Voucher Verified &bull; Status: Confirmed
              </span>
              <span className="font-mono text-emerald-600 font-bold uppercase">
                Ready for Departure
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save Voucher</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
