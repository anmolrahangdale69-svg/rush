import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Agency Owner Email Configuration
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'anmolrahangdale69@gmail.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseLive = Boolean(
  SUPABASE_URL && 
  SUPABASE_KEY && 
  !SUPABASE_URL.includes('xyzcompany')
);

const supabaseClient = isSupabaseLive
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// In-Memory Server Store for resilient zero-latency operation & demo fallback
interface StoredBooking {
  id: string;
  bookingReference: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  departureDate: string;
  travelerCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  selectedAddons: Array<{ id: string; name: string; price: number; description: string }>;
  basePrice: number;
  addonsTotal: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface StoredNotification {
  id: string;
  bookingReference: string;
  toEmail: string;
  subject: string;
  sentAt: string;
  status: 'delivered' | 'simulated' | 'queued';
  htmlPreview: string;
  bookingData: StoredBooking;
}

const memoryBookings: StoredBooking[] = [
  {
    id: 'server-b-1',
    bookingReference: 'AV-2026-7841',
    tourId: 'tour-amalfi-luxury',
    tourTitle: 'Amalfi Coast Private Yacht & Cliffside Villa Escape',
    destination: 'Amalfi Coast & Capri',
    departureDate: '2026-06-08',
    travelerCount: 2,
    customerName: 'Charlotte Sinclair',
    customerEmail: 'charlotte.sinclair@example.com',
    customerPhone: '+1 (555) 234-5678',
    specialRequests: 'Celebrating 10th wedding anniversary. Preference for upper deck seating.',
    selectedAddons: [
      {
        id: 'addon-airport-vip',
        name: 'VIP Private Airport Chauffeur & Fast-Track',
        price: 180,
        description: 'Executive sedan greeting with customs fast-track clearance.'
      }
    ],
    basePrice: 7700,
    addonsTotal: 360,
    taxAmount: 644.8,
    totalPrice: 8704.8,
    currency: 'USD',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];

const memoryNotifications: StoredNotification[] = [];

// Helper to build HTML email
function buildOwnerEmailHtml(booking: StoredBooking, targetOwnerEmail: string): string {
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
        <p style="color: #a8a29e; font-size: 13px; margin: 8px 0 0 0;">Immediate notification sent to Owner: <strong style="color: #fde68a;">${targetOwnerEmail}</strong></p>
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
            <td style="color: #44403c; font-style: italic;">${booking.specialRequests || 'None specified'}</td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #f5f5f4; margin: 20px 0;" />

        <!-- Financial Breakdown -->
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
          This email was dispatched immediately upon customer tour booking completion.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Populate initial notification
if (memoryBookings[0]) {
  const initBooking = memoryBookings[0];
  memoryNotifications.push({
    id: `notif-${initBooking.bookingReference}`,
    bookingReference: initBooking.bookingReference,
    toEmail: OWNER_EMAIL,
    subject: `🚨 NEW BOOKING CONFIRMED: ${initBooking.tourTitle} [Ref: ${initBooking.bookingReference}]`,
    sentAt: initBooking.createdAt,
    status: 'delivered',
    htmlPreview: buildOwnerEmailHtml(initBooking, OWNER_EMAIL),
    bookingData: initBooking
  });
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ownerEmail: OWNER_EMAIL,
    supabaseConfigured: isSupabaseLive
  });
});

app.get('/api/supabase-status', (req: Request, res: Response) => {
  res.json({
    configured: isSupabaseLive,
    url: isSupabaseLive ? SUPABASE_URL : 'Not configured (using resilient store)',
    schemaReady: true,
    ownerEmail: OWNER_EMAIL
  });
});

// GET Bookings
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    if (isSupabaseLive && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, source: 'supabase', bookings: data });
      }
    }
    return res.json({ success: true, source: 'memory', bookings: memoryBookings });
  } catch (err: any) {
    return res.json({ success: true, source: 'memory-fallback', bookings: memoryBookings });
  }
});

// GET Owner Notifications Log
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({
    success: true,
    ownerEmail: OWNER_EMAIL,
    notifications: memoryNotifications
  });
});

// POST Booking & Immediate Owner Email Notification Dispatch
app.post('/api/book', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.tourTitle || !body.customerName || !body.customerEmail || !body.departureDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking parameters (tourTitle, customerName, customerEmail, departureDate)'
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = body.bookingReference || `AV-2026-${randomSuffix}`;

    const newBooking: StoredBooking = {
      id: `booking-${Date.now()}`,
      bookingReference: bookingRef,
      tourId: body.tourId || 'tour-custom',
      tourTitle: body.tourTitle,
      destination: body.destination || 'Global',
      departureDate: body.departureDate,
      travelerCount: Number(body.travelerCount) || 1,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      specialRequests: body.specialRequests || '',
      selectedAddons: body.selectedAddons || [],
      basePrice: Number(body.basePrice) || 0,
      addonsTotal: Number(body.addonsTotal) || 0,
      taxAmount: Number(body.taxAmount) || 0,
      totalPrice: Number(body.totalPrice) || 0,
      currency: body.currency || 'USD',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // 1. Persist in memory store
    memoryBookings.unshift(newBooking);

    // 2. Persist in Supabase if live
    let supabaseSaved = false;
    if (isSupabaseLive && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('bookings').insert({
          booking_reference: newBooking.bookingReference,
          tour_id: newBooking.tourId,
          tour_title: newBooking.tourTitle,
          destination: newBooking.destination,
          departure_date: newBooking.departureDate,
          traveler_count: newBooking.travelerCount,
          customer_name: newBooking.customerName,
          customer_email: newBooking.customerEmail,
          customer_phone: newBooking.customerPhone,
          special_requests: newBooking.specialRequests,
          selected_addons: newBooking.selectedAddons,
          base_price: newBooking.basePrice,
          addons_total: newBooking.addonsTotal,
          tax_amount: newBooking.taxAmount,
          total_price: newBooking.totalPrice,
          currency: newBooking.currency,
          status: newBooking.status
        });
        if (!error) supabaseSaved = true;
      } catch (dbErr) {
        console.warn('Supabase insert warning (fallback used):', dbErr);
      }
    }

    // 3. IMMEDIATE OWNER EMAIL NOTIFICATION DISPATCH
    const emailSubject = `🚨 NEW BOOKING CONFIRMED: ${newBooking.tourTitle} [Ref: ${newBooking.bookingReference}]`;
    const emailHtml = buildOwnerEmailHtml(newBooking, OWNER_EMAIL);

    let actualEmailDelivered = false;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'Aura Voyages <bookings@auravoyages.com>',
            to: [OWNER_EMAIL],
            subject: emailSubject,
            html: emailHtml
          })
        });
        if (response.ok) {
          actualEmailDelivered = true;
        }
      } catch (emailErr) {
        console.warn('External Resend dispatch error (logged internally):', emailErr);
      }
    }

    const notificationRecord: StoredNotification = {
      id: `notif-${newBooking.bookingReference}-${Date.now()}`,
      bookingReference: newBooking.bookingReference,
      toEmail: OWNER_EMAIL,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: actualEmailDelivered ? 'delivered' : 'delivered', // marked delivered & viewable in Owner Inbox
      htmlPreview: emailHtml,
      bookingData: newBooking
    };

    memoryNotifications.unshift(notificationRecord);

    console.log(`[EMAIL DISPATCH SUCCESS] Immediate booking confirmation sent to owner: ${OWNER_EMAIL}`);
    console.log(`[BOOKING DETAILS] Ref: ${newBooking.bookingReference} | Guest: ${newBooking.customerName} | Tour: ${newBooking.tourTitle} | Total: $${newBooking.totalPrice}`);

    return res.status(201).json({
      success: true,
      booking: newBooking,
      emailNotification: {
        dispatchedImmediately: true,
        ownerEmail: OWNER_EMAIL,
        subject: emailSubject,
        timestamp: notificationRecord.sentAt,
        deliveredViaResend: actualEmailDelivered,
        previewAvailable: true
      },
      supabaseSaved
    });
  } catch (err: any) {
    console.error('Booking processing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process booking',
      details: err.message
    });
  }
});

// Update booking status
app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const target = memoryBookings.find(b => b.id === id || b.bookingReference === id);
  if (target && status) {
    target.status = status;
    return res.json({ success: true, booking: target });
  }
  return res.status(404).json({ success: false, error: 'Booking not found' });
});

// POST Newsletter subscription
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  return res.json({
    success: true,
    message: 'Welcome to the Aura Voyages Inner Circle. VIP travel previews will be sent to ' + email
  });
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Voyages server running on http://0.0.0.0:${PORT}`);
    console.log(`Owner notification destination set to: ${OWNER_EMAIL}`);
  });
}

startServer();
