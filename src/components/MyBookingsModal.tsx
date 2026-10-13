import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Car, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Navigation,
  ArrowRight,
  CreditCard,
  Banknote,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirestoreBooking, subscribeUserBookings, cancelBooking } from '../services/bookingService';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAgain: (prefill: { pickup: string; drop: string; vehicleId?: string }) => void;
  onOpenAuth: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  onBookAgain,
  onOpenAuth
}) => {
  const { user, isAnonymous, userProfile } = useAuth();
  
  const [bookings, setBookings] = useState<FirestoreBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected booking for detailed drawer / expanded view
  const [selectedBooking, setSelectedBooking] = useState<FirestoreBooking | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Cancellation state
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Real-time subscription to bookings
  useEffect(() => {
    if (!isOpen || !user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeUserBookings(
      user.uid,
      (data) => {
        setBookings(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Bookings fetch note:', err);
        setError('Unable to load bookings. Please check your connection.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  const handleCancelBooking = async (booking: FirestoreBooking) => {
    if (!booking.id) return;
    
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking #${booking.bookingReference}?`
    );
    if (!confirmCancel) return;

    setCancellingId(booking.id);
    try {
      await cancelBooking(booking.id);
      setCancelSuccessMsg(`Booking #${booking.bookingReference} has been cancelled.`);
      setTimeout(() => setCancelSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Cancellation error:', err);
      alert('Could not cancel booking. Please call support at 8830853261.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">
            <XCircle className="w-3 h-3 text-stone-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-6 pb-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-amber-400 font-serif font-black tracking-widest text-base">BOKDE</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              TRAVELS
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                My Bookings &amp; Trip History
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                {bookings.length} {bookings.length === 1 ? 'journey' : 'journeys'} recorded in your account
              </p>
            </div>

            {/* Profile info or Guest warning */}
            {isAnonymous ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save to Account</span>
              </button>
            ) : (
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-amber-300 block truncate max-w-[200px]">
                  {userProfile?.name || user?.displayName || user?.email || 'Logged in'}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">
                  {user?.email || user?.phoneNumber || ''}
                </span>
              </div>
            )}
          </div>

          {/* Guest notification notice */}
          {isAnonymous && (
            <div className="mt-3 bg-amber-400/15 border border-amber-400/30 rounded-xl p-2.5 text-xs text-amber-200 flex items-center justify-between gap-2">
              <span className="truncate">
                Browsing as Guest. Sign in with Email or Google to access your bookings on any device.
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="underline font-bold text-amber-300 hover:text-white shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-stone-800 text-xs overflow-x-auto no-scrollbar">
            {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === filter
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {filter === 'all' ? `All (${bookings.length})` : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Success feedback toast */}
        {cancelSuccessMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-2 border-b border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {/* Scrollable Bookings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-stone-50">
          
          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-4 rounded-2xl border border-stone-200 animate-pulse space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-40 bg-stone-200 rounded"></div>
                    <div className="h-5 w-20 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-stone-100 rounded"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-4 w-24 bg-stone-100 rounded"></div>
                    <div className="h-4 w-16 bg-stone-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBookings.length === 0 && (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Car className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                {statusFilter === 'all' 
                  ? 'No bookings yet, explore destinations' 
                  : `No ${statusFilter} bookings found`}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Plan your journey with Bokde Travels in 5 simple steps. Transparent per-km rates with clean AC cabs in Nagpur.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('booking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Book a Cab Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Booking Cards */}
          {!loading && filteredBookings.map((booking) => {
            const isExpanded = expandedId === booking.id;

            return (
              <div
                key={booking.id || booking.bookingReference}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-sm transition-all overflow-hidden"
              >
                {/* Card Main Header / Row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : booking.id || null)}
                  className="p-4 sm:p-5 cursor-pointer hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          #{booking.bookingReference}
                        </span>
                        {getStatusBadge(booking.status)}
                        <span className="text-[11px] text-stone-400">
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>

                      {/* Route / Destination */}
                      <h4 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-1.5 pt-0.5">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{booking.destination || `${booking.pickupLocation} ➔ ${booking.dropLocation}`}</span>
                      </h4>
                    </div>

                    {/* Price Tag */}
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-stone-900 block font-mono">
                        ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                        {booking.paymentMethod?.toUpperCase() || 'COD'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Card Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{booking.travelDate || 'Date: N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{booking.travelTime || 'Time: N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                      <Car className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-stone-800 truncate">{booking.vehicleName || 'AC Cab'}</span>
                    </div>
                  </div>

                  {/* Expand / Collapse Indicator */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-dashed border-stone-100 text-[11px] text-stone-500 font-semibold">
                    <span>
                      {booking.travellers || 1} {booking.travellers === 1 ? 'traveller' : 'travellers'}
                      {booking.distanceKm ? ` • ${booking.distanceKm} km` : ''}
                    </span>
                    <span className="text-amber-700 flex items-center gap-1 hover:underline">
                      {isExpanded ? 'Hide details' : 'View full details'}
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="bg-stone-50/80 px-4 sm:px-5 py-4 border-t border-stone-200 text-xs space-y-3.5 animate-in slide-in-from-top-1">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Pickup Location
                        </span>
                        <span className="font-semibold text-stone-800 text-xs">
                          {booking.pickupLocation || 'Nagpur'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Drop Location
                        </span>
                        <span className="font-semibold text-stone-800 text-xs">
                          {booking.dropLocation || booking.destination}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Contact Person
                        </span>
                        <span className="font-semibold text-stone-800 text-xs">
                          {booking.contactName} ({booking.contactPhone})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Trip Category
                        </span>
                        <span className="font-semibold text-stone-800 text-xs capitalize">
                          {booking.tripType || 'One-way trip'}
                        </span>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                          Special Requests &amp; Notes
                        </span>
                        <p className="text-stone-700 italic">
                          "{booking.specialRequests}"
                        </p>
                      </div>
                    )}

                    {/* Direct Owner Assistance on this Booking */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
                      <span className="font-medium">
                        Need changes or direct pickup update? Call Bokde Travels:
                      </span>
                      <a
                        href={`tel:${BUSINESS_CONFIG.ownerPhone}`}
                        className="font-bold underline text-amber-800 hover:text-amber-950 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>{BUSINESS_CONFIG.ownerPhone}</span>
                      </a>
                    </div>

                    {/* Card Actions: Book Again & Cancel */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {/* Cancel option for pending bookings */}
                      {booking.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking)}
                          disabled={cancellingId === booking.id}
                          className="px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}

                      {/* Book Again Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onBookAgain({
                            pickup: booking.pickupLocation || 'Nagpur',
                            drop: booking.dropLocation || booking.destination,
                            vehicleId: booking.vehicleId
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Book Again</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 font-medium">
            24/7 Helpline: <a href={`tel:${BUSINESS_CONFIG.helplinePhone}`} className="font-bold text-stone-800">{BUSINESS_CONFIG.helplinePhone}</a>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
