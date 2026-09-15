import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingSubmission, OwnerEmailNotification } from '../types';

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
const LOCAL_STORAGE_BOOKINGS_KEY = 'aura_voyages_bookings';
const LOCAL_STORAGE_NOTIFS_KEY = 'aura_voyages_notifications';

// Seed initial bookings so owner dashboard has rich data right away
const INITIAL_DEMO_BOOKINGS: BookingSubmission[] = [
  {
    id: 'demo-booking-1',
    bookingReference: 'AV-2026-7841',
    tourId: 'route-nagpur-pune',
    tourTitle: 'Nagpur to Pune Outstation Highway Cab Journey',
    destination: 'Pune, Maharashtra',
    departureDate: '2026-06-08',
    travelerCount: 3,
    customerName: 'Rohit Sharma',
    customerEmail: 'rohit.sharma@example.com',
    customerPhone: '+91 98230 45678',
    specialRequests: 'AC sedan requested. Pickup from Wardha Road.',
    pickupLocation: 'Wardha Road, Nagpur',
    dropLocation: 'Kalyani Nagar, Pune',
    tripType: 'outstation-oneway',
    distanceKm: 710,
    vehicleName: 'Sedan',
    selectedAddons: [
      {
        id: 'addon-doorstep-vip',
        name: 'Doorstep Cab Pickup & Luggage Assistance',
        price: 350,
        description: 'Chauffeur arrives 10 minutes ahead with luggage assistance.'
      }
    ],
    basePrice: 9940,
    addonsTotal: 350,
    taxAmount: 514,
    totalPrice: 10804,
    currency: 'INR',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'demo-booking-2',
    bookingReference: 'AV-2026-9214',
    tourId: 'tour-serengeti-safari',
    tourTitle: 'Serengeti Great Migration & Ngorongoro Crater Safari',
    destination: 'Serengeti & Ngorongoro',
    departureDate: '2026-08-05',
    travelerCount: 4,
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@vancetech.io',
    customerPhone: '+44 20 7946 0912',
    specialRequests: 'Private hot air balloon flight confirmed.',
    selectedAddons: [
      {
        id: 'addon-gourmet-pairing',
        name: 'Sommelier Wine & Dining Upgrade',
        price: 320,
        description: 'Bespoke reserve pairings.'
      }
    ],
    basePrice: 18400,
    addonsTotal: 1280,
    taxAmount: 1574.4,
    totalPrice: 21254.4,
    currency: 'USD',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
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
      // Build initial demo notification for demo bookings
      const initialNotifs: OwnerEmailNotification[] = INITIAL_DEMO_BOOKINGS.map(b => ({
        id: `notif-${b.bookingReference}`,
        bookingReference: b.bookingReference,
        toEmail: 'anmolrahangdale69@gmail.com',
        subject: `🚨 NEW BOOKING CONFIRMED: ${b.tourTitle} [Ref: ${b.bookingReference}]`,
        sentAt: b.createdAt,
        status: 'delivered',
        htmlPreview: generateEmailHtml(b, 'anmolrahangdale69@gmail.com'),
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

/**
 * Generates the rich branded email HTML sent to the agency owner
 */
export function generateEmailHtml(booking: BookingSubmission, ownerEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Tour Booking Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f5; margin: 0; padding: 24px; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); padding: 32px 28px; text-align: center;">
        <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px 0; font-weight: 700;">Aura Voyages Concierge</p>
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: -0.5px;">New Booking Alert</h1>
        <p style="color: #a8a29e; font-size: 13px; margin: 8px 0 0 0;">Immediate notification sent to Owner: <strong style="color: #fde68a;">${ownerEmail}</strong></p>
      </td>
    </tr>

    <!-- Booking Badge Banner -->
    <tr>
      <td style="background-color: #fef3c7; padding: 14px 28px; border-bottom: 1px solid #fde68a;">
        <table width="100%">
          <tr>
            <td style="font-size: 14px; font-weight: 600; color: #92400e;">
              Reference: <span style="font-family: monospace; background: #ffffff; padding: 3px 8px; border-radius: 4px; border: 1px solid #fcd34d;">${booking.bookingReference}</span>
            </td>
            <td align="right" style="font-size: 13px; color: #78350f;">
              Status: <span style="color: #15803d; font-weight: bold; text-transform: uppercase;">Confirmed ✓</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Tour Summary -->
    <tr>
      <td style="padding: 24px 28px;">
        <p style="font-size: 12px; text-transform: uppercase; color: #78716c; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 600;">Tour Itinerary</p>
        <h2 style="font-size: 18px; color: #1c1917; margin: 0 0 8px 0; font-weight: 700;">${booking.tourTitle}</h2>
        <p style="font-size: 14px; color: #57534e; margin: 0 0 16px 0;">
          📍 <strong>Destination:</strong> ${booking.destination} &nbsp;|&nbsp; 
          🗓 <strong>Departure:</strong> ${booking.departureDate} &nbsp;|&nbsp; 
          👥 <strong>Travelers:</strong> ${booking.travelerCount} Person(s)
        </p>

        <hr style="border: 0; border-top: 1px solid #f5f5f4; margin: 20px 0;" />

        <!-- Customer Profile -->
        <p style="font-size: 12px; text-transform: uppercase; color: #78716c; letter-spacing: 1px; margin: 0 0 10px 0; font-weight: 600;">Guest Details</p>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; background: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4;">
          <tr>
            <td width="30%" style="color: #78716c; font-weight: 500;">Lead Traveler:</td>
            <td style="color: #1c1917; font-weight: 600;">${booking.customerName}</td>
          </tr>
          <tr>
            <td style="color: #78716c; font-weight: 500;">Customer Email:</td>
            <td><a href="mailto:${booking.customerEmail}" style="color: #d97706; text-decoration: none; font-weight: 600;">${booking.customerEmail}</a></td>
          </tr>
          <tr>
            <td style="color: #78716c; font-weight: 500;">Phone Number:</td>
            <td style="color: #1c1917;">${booking.customerPhone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="color: #78716c; font-weight: 500;">Special Notes:</td>
            <td style="color: #44403c; font-style: italic;">${booking.specialRequests || 'None specified by guest'}</td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #f5f5f4; margin: 20px 0;" />

        <!-- Financial Summary -->
        <p style="font-size: 12px; text-transform: uppercase; color: #78716c; letter-spacing: 1px; margin: 0 0 10px 0; font-weight: 600;">Financial Breakdown</p>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #57534e;">Base Tour Package (${booking.travelerCount}x):</td>
            <td align="right" style="color: #1c1917; font-weight: 500;">$${booking.basePrice.toLocaleString()}</td>
          </tr>
          ${booking.addonsTotal > 0 ? `
          <tr>
            <td style="color: #57534e;">Selected Upgrades & Add-ons:</td>
            <td align="right" style="color: #1c1917; font-weight: 500;">+$${booking.addonsTotal.toLocaleString()}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #57534e;">Taxes & Tourism Fees:</td>
            <td align="right" style="color: #1c1917; font-weight: 500;">+$${booking.taxAmount.toLocaleString()}</td>
          </tr>
          <tr style="border-top: 2px solid #e7e5e4;">
            <td style="font-size: 16px; font-weight: 700; color: #1c1917; padding-top: 10px;">Total Booking Value:</td>
            <td align="right" style="font-size: 18px; font-weight: 800; color: #b45309; padding-top: 10px;">$${booking.totalPrice.toLocaleString()} ${booking.currency}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #fafaf9; padding: 18px 28px; border-top: 1px solid #e7e5e4; text-align: center;">
        <p style="font-size: 12px; color: #78716c; margin: 0 0 4px 0;">
          Aura Voyages Agency Dispatch System &bull; Timestamp: ${new Date().toUTCString()}
        </p>
        <p style="font-size: 11px; color: #a8a29e; margin: 0;">
          Logged into Supabase and immediate email dispatch system.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
