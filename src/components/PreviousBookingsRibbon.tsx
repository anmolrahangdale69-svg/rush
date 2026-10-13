import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  MapPin, 
  Car, 
  ArrowRight, 
  History, 
  Sparkles,
  ChevronRight,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  FirestoreBooking, 
  getRecentLocalBookings, 
  subscribeUserBookings 
} from '../services/bookingService';

interface PreviousBookingsRibbonProps {
  onSelectBooking: (prefill: { pickup: string; drop: string; vehicleId?: string }) => void;
  onOpenMyBookings?: () => void;
}

export const PreviousBookingsRibbon: React.FC<PreviousBookingsRibbonProps> = ({
  onSelectBooking,
  onOpenMyBookings
}) => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<FirestoreBooking[]>(() => getRecentLocalBookings());

  // Listen to Firestore bookings as well
  useEffect(() => {
    // Start with local storage for instant render
    const local = getRecentLocalBookings();
    if (local.length > 0) {
      setRecentBookings(local);
    }

    if (!user?.uid) return;

    const unsubscribe = subscribeUserBookings(
      user.uid,
      (data) => {
        if (data && data.length > 0) {
          // Merge with unique booking references
          const map = new Map<string, FirestoreBooking>();
          data.forEach(b => map.set(b.bookingReference || b.id || '', b));
          local.forEach(b => {
            const key = b.bookingReference || b.id || '';
            if (!map.has(key)) map.set(key, b);
          });
          setRecentBookings(Array.from(map.values()));
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const hasPreviousBookings = recentBookings.length > 0;

  // Default popular destinations for quick booking if no prior bookings
  const popularFastRoutes = [
    { from: 'Nagpur', to: 'Wardha', vehicleId: 'suzuki-dzire', vehicleName: 'Dzire Sedan', fare: '₹1,560' },
    { from: 'Nagpur', to: 'Amravati', vehicleId: 'maruti-ertiga', vehicleName: 'Ertiga (6 Seater)', fare: '₹3,000' },
    { from: 'Nagpur', to: 'Chandrapur', vehicleId: 'maruti-ertiga', vehicleName: 'Ertiga (AC)', fare: '₹3,120' },
    { from: 'Nagpur', to: 'Nagpur Airport', vehicleId: 'suzuki-dzire', vehicleName: 'Airport Cab', fare: '₹699' },
  ];

  return (
    <div className="mb-6 bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center">
            {hasPreviousBookings ? (
              <History className="w-4 h-4 text-amber-700" />
            ) : (
              <Compass className="w-4 h-4 text-amber-700" />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>{hasPreviousBookings ? 'Your Previous Bookings' : 'Quick 1-Click Destinations'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                {hasPreviousBookings ? 'Repeat & Book Again' : 'Popular'}
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              {hasPreviousBookings
                ? 'Select a past destination below to pre-fill the form instantly'
                : 'Click any frequent destination to calculate fare and book in seconds'}
            </p>
          </div>
        </div>

        {hasPreviousBookings && onOpenMyBookings && (
          <button
            type="button"
            onClick={onOpenMyBookings}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Cards Scroll Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {hasPreviousBookings ? (
          recentBookings.slice(0, 4).map((booking) => (
            <button
              key={booking.id || booking.bookingReference}
              type="button"
              onClick={() => {
                onSelectBooking({
                  pickup: booking.pickupLocation || 'Nagpur',
                  drop: booking.dropLocation || booking.destination,
                  vehicleId: booking.vehicleId || 'suzuki-dzire'
                });
              }}
              className="group text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mb-1">
                  <span>#{booking.bookingReference?.slice(-6) || 'TRIP'}</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded ${
                    booking.status === 'cancelled'
                      ? 'bg-stone-200 text-stone-600'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {booking.status || 'Past'}
                  </span>
                </div>

                <div className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1 group-hover:text-amber-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">
                    {booking.pickupLocation || 'Nagpur'} ➔ {booking.dropLocation || booking.destination}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                  <Car className="w-3 h-3 text-stone-400" />
                  <span className="truncate">{booking.vehicleName || 'AC Cab'}</span>
                  {booking.totalPrice && (
                    <span className="font-bold text-stone-800 font-mono">
                      • ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
                <span className="flex items-center gap-1 text-[11px]">
                  <RotateCcw className="w-3 h-3" />
                  <span>Book this again</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))
        ) : (
          popularFastRoutes.map((route, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelectBooking({
                  pickup: route.from,
                  drop: route.to,
                  vehicleId: route.vehicleId
                });
              }}
              className="group text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                  <span className="font-semibold text-amber-700">Instant Pre-fill</span>
                  <span className="font-bold font-mono text-stone-800">{route.fare}</span>
                </div>

                <div className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1 group-hover:text-amber-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{route.from} ➔ {route.to}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                  <Car className="w-3 h-3 text-stone-400" />
                  <span>{route.vehicleName}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
                <span className="text-[11px]">Select &amp; Book</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
