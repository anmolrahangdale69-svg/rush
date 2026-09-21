import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReviewsTicker } from './components/ReviewsTicker';
import { BookingFlow } from './components/BookingFlow';
import { ServicesSection } from './components/ServicesSection';
import { CustomerReviews } from './components/CustomerReviews';
import { PopularRoutesSection } from './components/PopularRoutesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { BookingModal } from './components/BookingModal';
import { VehicleConfig, BookingSubmission } from './types';
import { BUSINESS_CONFIG } from './data/cabConfig';

export default function App() {
  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  
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

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-amber-200 selection:text-stone-900 font-sans">
      
      {/* 1. Brand Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Live Verified Reviews & Rating Ticker Ribbon (Visible immediately upon opening website) */}
      <ReviewsTicker onViewAllClick={() => {
        const el = document.getElementById('customer-reviews');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />

      <main className="flex-1">
        {/* 2. Nagpur-Focused Hero Section */}
        <HeroSection onBookClick={() => handleOpenBooking()} />

        {/* 3. Primary Interactive 5-Step Booking Engine (Instant On-Page Access) */}
        <section className="bg-stone-100/70 py-10 sm:py-14 border-b border-stone-200">
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

      {/* 10. Sticky Mobile Booking & Call Bar */}
      <StickyMobileBar onBookClick={() => handleOpenBooking()} />

      {/* 11. Modal Booking Dialog (Fallback/Quick Pop-up) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialPickup={bookingPrefill.pickup}
        initialDrop={bookingPrefill.drop}
        initialVehicleId={bookingPrefill.vehicleId}
      />

    </div>
  );
}
