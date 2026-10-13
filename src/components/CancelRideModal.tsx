import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Phone, 
  Car, 
  Calendar, 
  MapPin, 
  Loader2, 
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  FirestoreBooking, 
  getRecentLocalBookings, 
  cancelBooking, 
  updateLocalBookingStatus 
} from '../services/bookingService';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCancelled?: (bookingId: string) => void;
}

export const CancelRideModal: React.FC<CancelRideModalProps> = ({
  isOpen,
  onClose,
  onBookingCancelled
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foundBooking, setFoundBooking] = useState<FirestoreBooking | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Change of travel plan');

  if (!isOpen) return null;

  const recentBookings = getRecentLocalBookings();
  const activeBookings = recentBookings.filter(b => b.status !== 'cancelled');

  // Search booking by reference or phone
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    setSuccessMsg(null);

    const term = searchTerm.trim().toLowerCase().replace('#', '');
    const match = recentBookings.find(b => 
      b.bookingReference?.toLowerCase().includes(term) ||
      b.id?.toLowerCase().includes(term) ||
      b.contactPhone?.includes(term) ||
      b.destination?.toLowerCase().includes(term)
    );

    setFoundBooking(match || null);
    setLoading(false);
  };

  const handlePerformCancel = async (booking: FirestoreBooking) => {
    const bookingId = booking.id || booking.bookingReference;
    if (!bookingId) return;

    const confirm = window.confirm(`Confirm cancellation of booking #${booking.bookingReference}?`);
    if (!confirm) return;

    setLoading(true);
    try {
      await cancelBooking(bookingId);
      updateLocalBookingStatus(bookingId, 'cancelled');
      setSuccessMsg(`Booking #${booking.bookingReference} has been cancelled successfully.`);
      if (foundBooking && (foundBooking.id === bookingId || foundBooking.bookingReference === bookingId)) {
        setFoundBooking({ ...foundBooking, status: 'cancelled' });
      }
      if (onBookingCancelled) onBookingCancelled(bookingId);
    } catch (err) {
      console.warn('Cancel error:', err);
      updateLocalBookingStatus(bookingId, 'cancelled');
      setSuccessMsg(`Booking #${booking.bookingReference} marked as cancelled.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-stone-900 text-white p-5 sm:p-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-800 uppercase tracking-wider">
              Ride Management
            </span>
          </div>

          <h3 className="text-xl font-black text-white">
            Cancel an Existing Ride
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Zero cancellation charges. Cancel anytime before driver dispatch.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Quick Active Rides from this Device */}
          {activeBookings.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Your Active Bookings
              </span>
              <div className="space-y-2">
                {activeBookings.map((b) => (
                  <div
                    key={b.id || b.bookingReference}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 hover:border-red-300 transition-colors"
                  >
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">#{b.bookingReference}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          {b.status}
                        </span>
                      </div>
                      <div className="font-bold text-stone-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{b.pickupLocation} ➔ {b.dropLocation}</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {b.travelDate} • {b.travelTime} • {b.vehicleName}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePerformCancel(b)}
                      disabled={loading}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      Cancel Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search by Booking Ref or Phone */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Lookup by Booking ID or Phone Number
            </span>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. BT_174123 or 8830853261"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-400 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchTerm.trim()}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Find
              </button>
            </form>
          </div>

          {/* Search Result */}
          {searched && (
            <div className="pt-2">
              {foundBooking ? (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-900">
                        #{foundBooking.bookingReference}
                      </div>
                      <div className="text-sm font-bold text-stone-900 mt-0.5">
                        {foundBooking.pickupLocation} ➔ {foundBooking.dropLocation}
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        {foundBooking.travelDate} at {foundBooking.travelTime} • {foundBooking.vehicleName}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Passenger: {foundBooking.contactName} ({foundBooking.contactPhone})
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      foundBooking.status === 'cancelled' 
                        ? 'bg-stone-200 text-stone-600' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {foundBooking.status}
                    </span>
                  </div>

                  {foundBooking.status !== 'cancelled' ? (
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <span className="text-xs text-stone-600">Free cancellation</span>
                      <button
                        type="button"
                        onClick={() => handlePerformCancel(foundBooking)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Confirm Cancel Ride
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 italic">
                      This ride has already been cancelled.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                  No booking found with this reference. Please check your reference code or call helpline below.
                </div>
              )}
            </div>
          )}

          {/* Need help / call owner directly */}
          <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-stone-800">Need instant cancellation via phone?</div>
              <div className="text-[11px] text-stone-500">Call Owner Mr. Bokde directly</div>
            </div>
            <a
              href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{BUSINESS_CONFIG.ownerPhone}</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Bokde Travels • 24/7 Support</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
