import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReviewsTicker } from './components/ReviewsTicker';
import { BookingFlow } from './components/BookingFlow';
import { PreviousBookingsRibbon } from './components/PreviousBookingsRibbon';
import { ServicesSection } from './components/ServicesSection';
import { CustomerReviews } from './components/CustomerReviews';
import { PopularRoutesSection } from './components/PopularRoutesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { CancelRideModal } from './components/CancelRideModal';
import { useAuth } from './context/AuthContext';
import { VehicleConfig, BookingSubmission } from './types';
import { BUSINESS_CONFIG } from './data/cabConfig';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const { hasVerifiedAccount } = useAuth();

  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [rebookToast, setRebookToast] = useState<string | null>(null);
  
  // Prefill state for the booking engine
  const [bookingPrefill, setBookingPrefill] = useState<{
    pickup: string;
    drop: string;
    vehicleId: string;
  }>({
    pickup: 'Nagpur',
    drop: 'Wardha',
    vehicleId: 'suzuki-dzire'
  });

  // Prompt authentication modal immediately upon opening the website as requested by the user
  useEffect(() => {
    // Open auth popup automatically on first load if user is not yet logged in with phone/google
    if (!hasVerifiedAccount) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [hasVerifiedAccount]);

  // Handle selecting a popular route
  const handleSelectPopularRoute = (from: string, to: string) => {
    setBookingPrefill(prev => ({
      ...prev,
      pickup: from,
      drop: to
    }));

    // Scroll smoothly to booking section
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle selecting a service type
  const handleSelectService = (serviceTitle: string) => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open booking modal or scroll to booking
  const handleOpenBooking = (prefill?: { pickup?: string; drop?: string; vehicleId?: string }) => {
    if (prefill) {
      setBookingPrefill(prev => ({
        pickup: prefill.pickup || prev.pickup,
        drop: prefill.drop || prev.drop,
        vehicleId: prefill.vehicleId || prev.vehicleId
      }));
    }

    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  // Handle "Book Again" from Previous Rides / My Bookings history
  const handleBookAgain = (prefill: { pickup: string; drop: string; vehicleId?: string }) => {
    setBookingPrefill({
      pickup: prefill.pickup,
      drop: prefill.drop,
      vehicleId: prefill.vehicleId || 'suzuki-dzire'
    });

    setRebookToast(`Loaded route: ${prefill.pickup} ➔ ${prefill.drop}. Select date & time below.`);
    setTimeout(() => setRebookToast(null), 5000);

    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-amber-200 selection:text-stone-900 font-sans">
      
      {/* 1. Brand Navbar with Login, My Bookings, and Cancel Ride */}
      <Navbar 
        onOpenBooking={handleOpenBooking} 
        onOpenAuth={() => {
          setAuthModalMode('signin');
          setIsAuthModalOpen(true);
        }}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenCancelRide={() => setIsCancelModalOpen(true)}
      />

      {/* Live Verified Reviews & Rating Ticker Ribbon (Visible immediately upon opening website) */}
      <ReviewsTicker onViewAllClick={() => {
        const el = document.getElementById('customer-reviews');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />

      <main className="flex-1">
        {/* 2. Nagpur-Focused Hero Section */}
        <HeroSection onBookClick={() => handleOpenBooking()} />

        {/* 3. Primary Interactive 5-Step Booking Engine (Instant On-Page Access) */}
        <section id="booking-section" className="bg-stone-100/70 py-10 sm:py-14 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Instant Fare Calculator &amp; Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
                Plan Your Journey in 5 Easy Steps
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Enter your pickup &amp; drop to automatically calculate highway distance and view live per-km vehicle fares.
              </p>
            </div>

            {/* Rebook Notification Toast */}
            {rebookToast && (
              <div className="max-w-xl mx-auto mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{rebookToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRebookToast(null)}
                  className="text-stone-500 hover:text-stone-800 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Previous Rides / Fast 1-Click Rebooking Ribbon with Cancel Ride button */}
            <PreviousBookingsRibbon
              onSelectBooking={handleBookAgain}
              onOpenMyBookings={() => setIsMyBookingsOpen(true)}
              onOpenCancelRide={() => setIsCancelModalOpen(true)}
            />

            <BookingFlow
              initialPickup={bookingPrefill.pickup}
              initialDrop={bookingPrefill.drop}
              initialVehicleId={bookingPrefill.vehicleId}
            />
          </div>
        </section>

        {/* 4. Cab Services (One Way, Round Trip, Local, Airport Transfer) */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 5. Customer Reviews & Travel Stories (20 Authentic Indian Reviews) */}
        <CustomerReviews onBookClick={() => handleOpenBooking()} />

        {/* 6. Popular Nagpur Highway Routes */}
        <PopularRoutesSection onSelectRoute={handleSelectPopularRoute} />

        {/* 7. Why Bokde Travels (Factual, honest, non-exaggerated) */}
        <WhyChooseUs />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 9. Professional Footer */}
      <Footer />

      {/* 10. Sticky Mobile Booking & Call Bar (with 1-tap Cancel Ride) */}
      <StickyMobileBar 
        onBookClick={() => handleOpenBooking()} 
        onCancelRide={() => setIsCancelModalOpen(true)}
      />

      {/* 11. Modal Booking Dialog (Fallback/Quick Pop-up) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialPickup={bookingPrefill.pickup}
        initialDrop={bookingPrefill.drop}
        initialVehicleId={bookingPrefill.vehicleId}
      />

      {/* 12. User Authentication Dialog (Email 4-Digit OTP & Google Primary) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {}}
      />

      {/* 13. My Bookings Dialog (History, Cards, Cancel & Book Again) */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onBookAgain={handleBookAgain}
        onOpenAuth={() => {
          setAuthModalMode('signin');
          setIsAuthModalOpen(true);
        }}
      />

      {/* 14. Quick Cancel Existing Ride Dialog */}
      <CancelRideModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />

    </div>
  );
}
