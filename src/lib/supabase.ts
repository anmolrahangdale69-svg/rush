import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingSubmission, OwnerEmailNotification } from '../types';
import { BUSINESS_CONFIG } from '../data/cabConfig';

// Read Vite client-side environment variables or standard env
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('xyzcompany') && 
  !supabaseAnonKey.includes('eyJhbGciOi...')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store for seamless interactive demonstration and zero-crash guarantee
const LOCAL_STORAGE_BOOKINGS_KEY = 'bokde_travels_bookings';
const LOCAL_STORAGE_NOTIFS_KEY = 'bokde_travels_notifications';

// Seed initial bookings for Bokde Travels (Nagpur routes)
const INITIAL_DEMO_BOOKINGS: BookingSubmission[] = [
  {
    id: 'demo-booking-1',
    bookingReference: 'BT-2026-4821',
    pickupLocation: 'Nagpur Railway Station',
    dropLocation: 'Wardha City',
    tripType: 'oneway',
    travelDate: '2026-09-18',
    travelTime: '08:30 AM',
    passengers: 3,
    distanceKm: 78,
    vehicleId: 'suzuki-dzire',
    vehicleName: 'Suzuki Dzire',
    perKmRate: 18,
    estimatedFare: 1404,
    tollNote: 'Payable by customer',
    customerName: 'Ashish Deshmukh',
    customerEmail: 'ashish.deshmukh@gmail.com',
    customerPhone: '+91 98220 12345',
    specialRequests: 'On-time morning pickup. Chilled AC required.',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

export const getStoredBookings = (): BookingSubmission[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
      return INITIAL_DEMO_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage unavailable, returning fallback demo bookings', err);
    return INITIAL_DEMO_BOOKINGS;
  }
};

export const saveStoredBooking = (booking: BookingSubmission) => {
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing.filter(b => b.bookingReference !== booking.bookingReference)];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not persist booking to LocalStorage', err);
  }
};

export const getStoredNotifications = (): OwnerEmailNotification[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
    if (!raw) {
      const initialNotifs: OwnerEmailNotification[] = INITIAL_DEMO_BOOKINGS.map(b => ({
        id: `notif-${b.bookingReference}`,
        bookingReference: b.bookingReference,
        toEmail: BUSINESS_CONFIG.email,
        subject: `🚨 NEW CAB BOOKING: ${b.pickupLocation} to ${b.dropLocation} [Ref: ${b.bookingReference}]`,
        sentAt: b.createdAt,
        status: 'delivered',
        htmlPreview: generateEmailHtml(b, BUSINESS_CONFIG.email),
        bookingData: b
      }));
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(initialNotifs));
      return initialNotifs;
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
};

export const saveStoredNotification = (notif: OwnerEmailNotification) => {
  try {
    const existing = getStoredNotifications();
    const updated = [notif, ...existing.filter(n => n.id !== notif.id)];
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not persist notification', err);
  }
};

// HTML Email Generator for Bokde Travels Booking Notification
export const generateEmailHtml = (booking: BookingSubmission, targetEmail: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Cab Booking Alert - Bokde Travels</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <tr>
      <td style="background-color: #0f172a; padding: 24px; text-align: left;">
        <p style="color: #f59e0b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0; font-weight: 700;">Bokde Travels &bull; Nagpur</p>
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">New Cab Booking Alert</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Sent to: <strong>${targetEmail}</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 24px;">
        <p><strong>Booking Ref:</strong> ${booking.bookingReference}</p>
        <p><strong>Route:</strong> ${booking.pickupLocation} &rarr; ${booking.dropLocation}</p>
        <p><strong>Date &amp; Time:</strong> ${booking.travelDate} at ${booking.travelTime}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicleName}</p>
        <p><strong>Estimated Fare:</strong> ₹${booking.estimatedFare?.toLocaleString() || 0}</p>
        <p><strong>Customer:</strong> ${booking.customerName} (${booking.customerPhone})</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
