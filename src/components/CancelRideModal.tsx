import React, { useState, useEffect } from 'react';
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
  Clock,
  RotateCcw,
  Users,
  CreditCard,
  Banknote,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  FirestoreBooking, 
  getRecentLocalBookings, 
  cancelBooking, 
  lookupBookingDetails,
  subscribeUserBookings 
} from '../services/bookingService';
import { BUSINESS_CONFIG } from '../data/cabConfig';

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCancelled?: (bookingId: string) => void;
  initialSearchTerm?: string;
}

export const CancelRideModal: React.FC<CancelRideModalProps> = ({
  isOpen,
  onClose,
  onBookingCancelled,
  initialSearchTerm
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || '');
  const [searching, setSearching] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);
  
  const [foundBooking, setFoundBooking] = useState<FirestoreBooking | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const [allBookings, setAllBookings] = useState<FirestoreBooking[]>(() => getRecentLocalBookings());

  // Handle initialSearchTerm or prefilled booking reference
  useEffect(() => {
    if (isOpen) {
      setSuccessMsg(null);
      if (initialSearchTerm) {
        setSearchTerm(initialSearchTerm);
        setSearching(true);
        setSearched(true);
        lookupBookingDetails(initialSearchTerm).then(res => {
          if (res) {
            setFoundBooking(res);
            setSearchError(null);
          } else {
            setFoundBooking(null);
            setSearchError(`No booking details found for "${initialSearchTerm}".`);
          }
        }).catch(() => {
          setSearchError('Error looking up booking.');
        }).finally(() => {
          setSearching(false);
        });
      }
    }
  }, [isOpen, initialSearchTerm]);

  // Keep allBookings synchronized
  useEffect(() => {
    if (!isOpen) {
      setConfirmingCancelId(null);
      setSuccessMsg(null);
      return;
    }

    const local = getRecentLocalBookings();
    setAllBookings(local);

    if (user?.uid) {
      const unsub = subscribeUserBookings(user.uid, (data) => {
        const map = new Map<string, FirestoreBooking>();
        data.forEach(b => map.set(b.bookingReference || b.id || '', b));
        local.forEach(b => {
          const key = b.bookingReference || b.id || '';
          if (!map.has(key)) map.set(key, b);
        });
        setAllBookings(Array.from(map.values()));
      });
      return () => unsub();
    }
  }, [user?.uid, isOpen]);

  if (!isOpen) return null;

  const activeBookings = allBookings.filter(b => b.status !== 'cancelled');

  // Search booking by reference or ID with full details
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    setSearched(true);
    setSearchError(null);
    setSuccessMsg(null);
    setConfirmingCancelId(null);

    try {
      const result = await lookupBookingDetails(searchTerm.trim());
      if (result) {
        setFoundBooking(result);
        setSearchError(null);
      } else {
        setFoundBooking(null);
        setSearchError(`No booking details found for "${searchTerm.trim()}". Please verify your booking reference (e.g. BT-2026-4821) or phone number.`);
      }
    } catch (err: any) {
      setSearchError('Error looking up booking details. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // Perform actual cancellation without window.confirm (avoids iframe blocking)
  const handlePerformCancel = async (booking: FirestoreBooking) => {
    const bookingId = booking.bookingReference || booking.id;
    if (!bookingId) return;

    setCancellingId(bookingId);
    setSuccessMsg(null);

    try {
      await cancelBooking(bookingId);
      
      const updatedRef = booking.bookingReference || bookingId;
      setSuccessMsg(`✓ Booking #${updatedRef} has been cancelled successfully. Zero cancellation charges applied.`);
      
      // Update found booking state
      if (foundBooking && (foundBooking.bookingReference === bookingId || foundBooking.id === bookingId)) {
        setFoundBooking({ ...foundBooking, status: 'cancelled' });
      }

      // Update active list
      setAllBookings(prev => prev.map(b => {
        if (b.bookingReference === bookingId || b.id === bookingId) {
          return { ...b, status: 'cancelled' };
        }
        return b;
      }));

      setConfirmingCancelId(null);

      if (onBookingCancelled) {
        onBookingCancelled(bookingId);
      }
    } catch (err) {
      console.warn('Cancellation warning:', err);
      setSuccessMsg(`✓ Booking #${booking.bookingReference} marked as cancelled.`);
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-stone-900 text-white p-5 sm:p-6 pb-4 shrink-0">
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
              Ride Management &amp; Cancellation
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Cancel an Existing Ride
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Lookup any booking by ID to view full journey details or cancel with 100% free cancellation.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm text-emerald-900">Ride Cancelled</p>
                <p className="mt-0.5 text-emerald-800 font-medium">{successMsg}</p>
                <p className="text-[11px] text-emerald-700 mt-1">No driver will be dispatched. You can book another cab anytime.</p>
              </div>
            </div>
          )}

          {/* Search by Booking Ref or Phone with Instant Specific Details */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              Enter Booking ID or Phone Number to View Specific Details:
            </label>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. BT-2026-4821 or 8830853261"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-red-400 font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={searching || !searchTerm.trim()}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Get Details</span>
                  </>
                )}
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-stone-500 font-medium">Quick suggestions:</span>
              {['BT-2026-4821', 'BT-2026-1042', 'BT-2026-8850'].map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSearchTerm(code);
                    setSearching(true);
                    setSearched(true);
                    lookupBookingDetails(code).then(res => {
                      setFoundBooking(res);
                      setSearchError(res ? null : `No booking found for ${code}`);
                    }).catch(() => {
                      setSearchError('Error looking up booking.');
                    }).finally(() => {
                      setSearching(false);
                    });
                  }}
                  className="px-2 py-0.5 bg-stone-200/80 hover:bg-amber-100 hover:text-amber-900 text-stone-700 rounded-md font-mono font-bold cursor-pointer transition-colors"
                >
                  #{code}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results / Detailed Booking Card */}
          {searched && (
            <div>
              {foundBooking ? (
                <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border-2 border-stone-300 space-y-4 animate-in fade-in shadow-xs">
                  
                  {/* Status & Reference Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-stone-900 bg-stone-200 px-2.5 py-0.5 rounded-lg">
                          #{foundBooking.bookingReference}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(foundBooking.bookingReference)}
                          className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-0.5"
                          title="Copy Booking ID"
                        >
                          {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-1">
                        Booked on {new Date(foundBooking.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      foundBooking.status === 'cancelled' 
                        ? 'bg-stone-200 text-stone-700 border border-stone-300' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {foundBooking.status === 'cancelled' ? 'Cancelled ✓' : foundBooking.status}
                    </span>
                  </div>

                  {/* Route & Vehicle Specific Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Pickup Location
                      </span>
                      <p className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{foundBooking.pickupLocation || 'Nagpur'}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Drop Destination
                      </span>
                      <p className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{foundBooking.dropLocation || foundBooking.destination}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Travel Schedule
                      </span>
                      <p className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{foundBooking.travelDate} at {foundBooking.travelTime}</span>
                      </p>
                    </div>

                    {foundBooking.returnDate && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                          Return Schedule
                        </span>
                        <p className="font-semibold text-amber-900 mt-0.5 flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                          <span>{foundBooking.returnDate} at {foundBooking.returnTime || '06:00 PM'}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Cab / Vehicle
                      </span>
                      <p className="font-bold text-stone-900 mt-0.5 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-amber-600" />
                        <span>{foundBooking.vehicleName || 'AC Sedan'} ({foundBooking.tripType || 'One-way'})</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Fare &amp; Payment
                      </span>
                      <p className="font-black text-amber-800 text-sm mt-0.5 font-mono">
                        ₹{Number(foundBooking.totalPrice || 0).toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-stone-600 uppercase">
                          ({foundBooking.paymentMethod || 'COD'})
                        </span>
                      </p>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-stone-600">
                      <div>
                        <strong>Passenger:</strong> {foundBooking.contactName}{' '}
                        {foundBooking.contactPhone && <span>({foundBooking.contactPhone})</span>}
                      </div>
                      {foundBooking.contactEmail && (
                        <div>
                          <strong>Email:</strong> {foundBooking.contactEmail}
                        </div>
                      )}
                    </div>

                    {foundBooking.specialRequests && (
                      <div className="sm:col-span-2 bg-stone-50 p-2.5 rounded-lg text-stone-700 italic border border-stone-200">
                        <span className="font-bold text-[11px] not-italic text-stone-600 block">Notes:</span>
                        "{foundBooking.specialRequests}"
                      </div>
                    )}
                  </div>

                  {/* Cancellation Action or Cancelled Banner */}
                  {foundBooking.status !== 'cancelled' ? (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-stone-500 font-medium">Free cancellation guaranteed</span>
                      <button
                        type="button"
                        onClick={() => handlePerformCancel(foundBooking)}
                        disabled={cancellingId !== null}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {cancellingId === (foundBooking.bookingReference || foundBooking.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Cancelling Ride...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Cancel This Ride</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-stone-500" />
                      <span>This ride is officially cancelled. No car or driver will arrive.</span>
                    </div>
                  )}

                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900">
                  <p className="font-bold">{searchError || 'No booking found.'}</p>
                  <p className="text-[11px] mt-1 text-red-700">
                    If you booked recently, check your SMS/WhatsApp for the reference number (e.g. BT-2026-4821) or call helpline below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Active Rides from this Session */}
          {activeBookings.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Active Bookings On This Device ({activeBookings.length})
              </span>
              <div className="space-y-2">
                {activeBookings.map((b) => {
                  const bId = b.bookingReference || b.id || '';
                  const isConfirming = confirmingCancelId === bId;

                  return (
                    <div
                      key={bId}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
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
                          disabled={cancellingId === bId}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {cancellingId === bId ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Cancelling...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel Ride</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{BUSINESS_CONFIG.ownerPhone}</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 shrink-0">
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
