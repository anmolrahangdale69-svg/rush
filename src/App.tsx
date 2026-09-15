/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tour, 
  SearchFilters, 
  BookingSubmission, 
  OwnerEmailNotification, 
  CurrencyCode 
} from './types';
import { INITIAL_TOURS, AGENCY_DETAILS } from './data/toursData';
import { 
  getStoredBookings, 
  getStoredNotifications, 
  saveStoredBooking 
} from './lib/supabase';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationSearchBar } from './components/DestinationSearchBar';
import { TourGallery } from './components/TourGallery';
import { TourDetailModal } from './components/TourDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { WishlistModal } from './components/WishlistModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';
import { ChooseYourRideSection } from './components/ChooseYourRideSection';

// Toast Icon
import { Send, CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Intro opening animation (Royal Indian Lotus Mandala Logo Reveal)
  const [showLogoIntro, setShowLogoIntro] = useState<boolean>(true);

  // Core Data & Filter States
  const [tours] = useState<Tour[]>(INITIAL_TOURS);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    category: 'All',
    seasonOrMonth: 'Any Time',
    maxBudget: 5500,
    minDuration: 1,
    guestsCount: 2,
    sortBy: 'popularity'
  });

  // User Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : ['tour-rajasthan-royal-palaces'];
    } catch {
      return ['tour-rajasthan-royal-palaces'];
    }
  });

  // Bookings and Owner Email Dispatch Notifications
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [notifications, setNotifications] = useState<OwnerEmailNotification[]>([]);

  // Modals
  const [selectedTourForDetails, setSelectedTourForDetails] = useState<Tour | null>(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<Tour | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSubmission | null>(null);
  const [isOwnerInboxOpen, setIsOwnerInboxOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);

  // Floating Toast Alert for Immediate Owner Email Dispatch
  const [toastAlert, setToastAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    bookingRef?: string;
  }>({
    show: false,
    title: '',
    message: ''
  });

  // Fetch initial bookings and notifications from server / local storage
  const syncRecords = async () => {
    try {
      const [bookingsRes, notifsRes] = await Promise.allSettled([
        fetch('/api/bookings'),
        fetch('/api/notifications')
      ]);

      let serverBookings: BookingSubmission[] | null = null;
      let serverNotifs: OwnerEmailNotification[] | null = null;

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.ok) {
        const json = await bookingsRes.value.json();
        if (json.bookings) serverBookings = json.bookings;
      }

      if (notifsRes.status === 'fulfilled' && notifsRes.value.ok) {
        const json = await notifsRes.value.json();
        if (json.notifications) serverNotifs = json.notifications;
      }

      // Merge with localStorage
      const localBookings = getStoredBookings();
      const localNotifs = getStoredNotifications();

      setBookings(serverBookings && serverBookings.length > 0 ? serverBookings : localBookings);
      setNotifications(serverNotifs && serverNotifs.length > 0 ? serverNotifs : localNotifs);
    } catch (err) {
      setBookings(getStoredBookings());
      setNotifications(getStoredNotifications());
    }
  };

  useEffect(() => {
    syncRecords();
  }, []);

  const handleToggleWishlist = (tourId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId];
      try {
        localStorage.setItem('aura_wishlist', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      destination: '',
      category: 'All',
      seasonOrMonth: 'Any Time',
      maxBudget: 5500,
      minDuration: 1,
      guestsCount: 1,
      sortBy: 'popularity'
    });
  };

  // Filter and sort the tours based on interactive criteria
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        // Destination filter
        if (filters.destination.trim()) {
          const q = filters.destination.toLowerCase().trim();
          const matchDest = tour.destination.toLowerCase().includes(q);
          const matchCountry = tour.country.toLowerCase().includes(q);
          const matchTitle = tour.title.toLowerCase().includes(q);
          const matchRegion = tour.region.toLowerCase().includes(q);
          if (!matchDest && !matchCountry && !matchTitle && !matchRegion) return false;
        }

        // Category filter
        if (filters.category !== 'All' && tour.category !== filters.category) {
          return false;
        }

        // Budget filter
        if (tour.pricePerPerson > filters.maxBudget) {
          return false;
        }

        // Travelers count
        if (filters.guestsCount > tour.maxGroupSize) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
        if (filters.sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'duration') return b.durationDays - a.durationDays;
        // Default: popularity
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount;
      });
  }, [tours, filters]);

  // Wishlist Tours objects
  const savedToursList = useMemo(() => {
    return tours.filter((t) => wishlist.includes(t.id));
  }, [tours, wishlist]);

  // Handle successful booking completion
  const handleBookingSuccess = (newBooking: BookingSubmission) => {
    // 1. Close booking modal
    setSelectedTourForBooking(null);

    // 2. Open confirmation celebration modal
    setConfirmedBooking(newBooking);

    // 3. Update records
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.bookingReference !== newBooking.bookingReference)]);

    // 4. Trigger the immediate owner email dispatch toast
    setToastAlert({
      show: true,
      title: 'Immediate Owner Email Notification Sent!',
      message: `Complete booking details and dossier dispatched to ${AGENCY_DETAILS.ownerEmail}`,
      bookingRef: newBooking.bookingReference
    });

    // Auto dismiss toast after 8 seconds
    setTimeout(() => {
      setToastAlert((prev) => ({ ...prev, show: false }));
    }, 8000);

    // Sync records in background
    setTimeout(syncRecords, 1000);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-amber-600 selection:text-white">
      
      {/* Royal Indian Lotus Mandala Logo Reveal Animation */}
      {showLogoIntro && (
        <LogoIntroAnimation
          onComplete={() => {
            setShowLogoIntro(false);
          }}
        />
      )}

      {/* Navigation Bar */}
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenOwnerInbox={() => setIsOwnerInboxOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        notificationsCount={notifications.length}
        onScrollToSection={scrollToSection}
        onReplayLogoIntro={() => setShowLogoIntro(true)}
      />

      {/* Floating Owner Email Notification Toast */}
      {toastAlert.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-950 text-white rounded-2xl p-4 shadow-2xl border border-amber-500/40 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
            <Send className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {toastAlert.title}
              </h4>
              <button
                onClick={() => setToastAlert((prev) => ({ ...prev, show: false }))}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-snug">
              {toastAlert.message}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  setToastAlert((prev) => ({ ...prev, show: false }));
                  setIsOwnerInboxOpen(true);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-stone-950 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Sent Email
              </button>
              {toastAlert.bookingRef && (
                <span className="font-mono text-[11px] text-stone-400">
                  Ref: {toastAlert.bookingRef}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Front Page */}
        <HeroSection
          onExploreClick={() => scrollToSection('tours')}
          onBookDirectClick={() => {
            const firstTour = tours[0];
            if (firstTour) setSelectedTourForBooking(firstTour);
          }}
          onReplayLogoIntro={() => setShowLogoIntro(true)}
        />

        {/* 2. Destination Search Bar */}
        <DestinationSearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          matchingCount={filteredTours.length}
          currency={currency}
        />

        {/* 3. Featured Tour Gallery */}
        <TourGallery
          tours={filteredTours}
          currency={currency}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectTourDetails={(tour) => setSelectedTourForDetails(tour)}
          onSelectTourBook={(tour) => setSelectedTourForBooking(tour)}
        />

        {/* 4. Choose Your Ride - Indian City Mobility */}
        <ChooseYourRideSection />

        {/* 5. Why Choose Us Section */}
        <WhyChooseUs />

        {/* 6. Client Testimonials Section */}
        <TestimonialsSection />

        {/* 7. Newsletter Subscription */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenOwnerInbox={() => setIsOwnerInboxOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onSelectDestination={(dest) => {
          handleFilterChange({ destination: dest });
          scrollToSection('tours');
        }}
      />

      {/* Modals & Drawers */}
      
      {/* Tour Details Modal */}
      <TourDetailModal
        tour={selectedTourForDetails}
        onClose={() => setSelectedTourForDetails(null)}
        onBookNow={(tour) => setSelectedTourForBooking(tour)}
        currency={currency}
        isWishlisted={selectedTourForDetails ? wishlist.includes(selectedTourForDetails.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Interactive Tour Booking Modal */}
      <BookingModal
        tour={selectedTourForBooking}
        onClose={() => setSelectedTourForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
        currency={currency}
      />

      {/* Booking Confirmation & Voucher Modal */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onOpenOwnerInbox={() => setIsOwnerInboxOpen(true)}
        currency={currency}
      />

      {/* Owner Portal & Email Notifications Inspector */}
      <OwnerDashboardModal
        isOpen={isOwnerInboxOpen}
        onClose={() => setIsOwnerInboxOpen(false)}
        bookings={bookings}
        notifications={notifications}
        currency={currency}
        onRefresh={syncRecords}
        onOpenSupabaseModal={() => {
          setIsOwnerInboxOpen(false);
          setIsSupabaseModalOpen(true);
        }}
      />

      {/* Supabase & Vercel Setup Guide Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Saved Tours / Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        savedTours={savedToursList}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectTourBook={(tour) => setSelectedTourForBooking(tour)}
        currency={currency}
      />

    </div>
  );
}
