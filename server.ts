import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { sendResendBookingEmail, BookingEmailPayload } from './src/utils/bookingEmail';

const app = express();
const PORT = 3000;

app.use(express.json());

// Bokde Travels Configuration
const BUSINESS_NAME = 'Bokde Travels';
const BUSINESS_PHONE = '8983275497';
const BUSINESS_EMAIL = 'bokdetravels@gmail.com';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'bokdetravels@gmail.com';
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

interface StoredCabBooking {
  id: string;
  bookingReference: string;
  tripType: string;
  airportTransferType?: string;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  distanceKm: number;
  vehicleId: string;
  vehicleName: string;
  perKmRate: number;
  estimatedFare: number;
  tollNote: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
  paymentMethod: string;
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
  bookingData: StoredCabBooking;
}

// Initial demo booking for Bokde Travels (Nagpur to Wardha)
const memoryBookings: StoredCabBooking[] = [
  {
    id: 'bt-book-1',
    bookingReference: 'BT-2026-4821',
    tripType: 'oneway',
    pickupLocation: 'Nagpur Railway Station',
    dropLocation: 'Wardha City',
    travelDate: '2026-09-18',
    travelTime: '08:30 AM',
    passengers: 3,
    distanceKm: 78,
    vehicleId: 'suzuki-dzire',
    vehicleName: 'Suzuki Dzire',
    perKmRate: 18,
    estimatedFare: 1404, // 78 km * 18 = 1404
    tollNote: 'Payable by customer',
    customerName: 'Ashish Deshmukh',
    customerPhone: '9822012345',
    customerEmail: 'ashish.deshmukh@gmail.com',
    specialRequests: 'On-time morning pickup. Chilled AC required.',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

const memoryNotifications: StoredNotification[] = [];

// Helper to build HTML email for Bokde Travels Booking
function buildOwnerEmailHtml(booking: StoredCabBooking, targetOwnerEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Cab Booking Alert - Bokde Travels</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="background-color: #0f172a; padding: 24px 28px; text-align: left;">
        <p style="color: #f59e0b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0; font-weight: 700;">Bokde Travels &bull; Nagpur</p>
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">New Cab Booking Alert</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Dispatch copy sent to: <strong>${targetOwnerEmail}</strong></p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #fef3c7; padding: 12px 28px; border-bottom: 1px solid #fde68a;">
        <table width="100%">
          <tr>
            <td style="font-size: 13px; font-weight: 700; color: #92400e;">
              Booking Reference: <span style="font-family: monospace; background: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #fcd34d;">${booking.bookingReference}</span>
            </td>
            <td align="right" style="font-size: 13px; color: #15803d; font-weight: 700;">
              CONFIRMED ✓
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 20px 28px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a;">Trip Summary</h3>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <tr>
            <td width="35%" style="color: #64748b;">Route:</td>
            <td style="color: #0f172a; font-weight: 700;">${booking.pickupLocation} &rarr; ${booking.dropLocation}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Trip Type:</td>
            <td style="color: #0f172a; text-transform: capitalize; font-weight: 600;">${booking.tripType}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Date &amp; Time:</td>
            <td style="color: #0f172a; font-weight: 600;">${booking.travelDate} at ${booking.travelTime}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Selected Vehicle:</td>
            <td style="color: #0f172a; font-weight: 700;">${booking.vehicleName}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Route Distance:</td>
            <td style="color: #0f172a; font-weight: 600;">${booking.distanceKm} km</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Passengers:</td>
            <td style="color: #0f172a;">${booking.passengers} Passenger(s)</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Vehicle Rate:</td>
            <td style="color: #0f172a;">&#8377;${booking.perKmRate}/km</td>
          </tr>
          <tr style="border-top: 2px solid #cbd5e1;">
            <td style="font-size: 15px; font-weight: 700; color: #0f172a; padding-top: 8px;">Estimated Fare:</td>
            <td style="font-size: 16px; font-weight: 800; color: #b45309; padding-top: 8px;">&#8377;${booking.estimatedFare.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Tolls &amp; Parking:</td>
            <td style="color: #64748b; font-style: italic;">Payable by customer</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Payment Method:</td>
            <td style="color: #0f172a; text-transform: uppercase; font-weight: 600;">${booking.paymentMethod}</td>
          </tr>
        </table>

        <h3 style="font-size: 15px; margin: 16px 0 8px 0; color: #0f172a;">Passenger Details</h3>
        <p style="font-size: 13px; margin: 4px 0; color: #334155;">
          <strong>Name:</strong> ${booking.customerName}<br>
          <strong>Phone:</strong> <a href="tel:${booking.customerPhone}" style="color: #0284c7; font-weight: bold;">${booking.customerPhone}</a><br>
          <strong>Email:</strong> ${booking.customerEmail || 'Not provided'}<br>
          ${booking.specialRequests ? `<strong>Special Notes:</strong> <em>${booking.specialRequests}</em>` : ''}
        </p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f8fafc; padding: 14px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
        Bokde Travels &bull; Nagpur, Maharashtra &bull; Helpline: ${BUSINESS_PHONE} &bull; Email: ${BUSINESS_EMAIL}
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
    subject: `🚨 NEW CAB BOOKING: ${initBooking.pickupLocation} to ${initBooking.dropLocation} [Ref: ${initBooking.bookingReference}]`,
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
    business: BUSINESS_NAME,
    phone: BUSINESS_PHONE,
    ownerEmail: OWNER_EMAIL,
    supabaseConfigured: isSupabaseLive
  });
});

// Modular Route Distance Calculation Endpoint
app.post('/api/route-distance', async (req: Request, res: Response) => {
  try {
    const { pickup, drop } = req.body;
    if (!pickup || !drop) {
      return res.status(400).json({ success: false, error: 'Pickup and Drop locations are required.' });
    }

    const normP = pickup.toLowerCase().trim();
    const normD = drop.toLowerCase().trim();

    // Curated high-precision road distances from Nagpur
    const highwayDistances: Record<string, number> = {
      wardha: 78,
      amravati: 155,
      chandrapur: 150,
      bhandara: 65,
      gondia: 165,
      yavatmal: 152,
      akola: 250,
      pune: 710,
      mumbai: 810,
      hyderabad: 500,
      shirdi: 590,
      raipur: 285,
      jabalpur: 275,
      bhopal: 350,
      indore: 450,
      'nagpur airport': 12,
      airport: 12
    };

    for (const [keyCity, dist] of Object.entries(highwayDistances)) {
      if (
        (normP.includes('nagpur') && normD.includes(keyCity)) ||
        (normD.includes('nagpur') && normP.includes(keyCity))
      ) {
        const hrs = Math.floor(dist / 60);
        const mins = Math.round((dist % 60) * 0.9);
        const durationText = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
        return res.json({
          success: true,
          distanceKm: dist,
          durationText,
          fromFormatted: pickup,
          toFormatted: drop
        });
      }
    }

    // Try OSM Nominatim + OSRM
    try {
      const geoUrl1 = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(normP.includes('nagpur') ? pickup : `${pickup}, Maharashtra`)}`;
      const geoUrl2 = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(normD.includes('nagpur') ? drop : `${drop}, Maharashtra`)}`;

      const [res1, res2] = await Promise.all([
        fetch(geoUrl1, { headers: { 'User-Agent': 'BokdeTravelsBackend/1.0' } }),
        fetch(geoUrl2, { headers: { 'User-Agent': 'BokdeTravelsBackend/1.0' } })
      ]);

      if (res1.ok && res2.ok) {
        const data1 = await res1.json();
        const data2 = await res2.json();

        if (data1.length > 0 && data2.length > 0) {
          const lon1 = data1[0].lon;
          const lat1 = data1[0].lat;
          const lon2 = data2[0].lon;
          const lat2 = data2[0].lat;

          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
          const osrmRes = await fetch(osrmUrl);

          if (osrmRes.ok) {
            const osrmData = await osrmRes.json();
            if (osrmData.routes && osrmData.routes.length > 0) {
              const meters = osrmData.routes[0].distance;
              const seconds = osrmData.routes[0].duration;
              const distanceKm = Math.round(meters / 1000);
              const durationMinutes = Math.round(seconds / 60);
              const hrs = Math.floor(durationMinutes / 60);
              const mins = durationMinutes % 60;
              const durationText = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;

              return res.json({
                success: true,
                distanceKm,
                durationText,
                fromFormatted: data1[0].display_name.split(',')[0],
                toFormatted: data2[0].display_name.split(',')[0]
              });
            }
          }
        }
      }
    } catch (osrmErr) {
      console.warn('OSRM routing request failed:', osrmErr);
    }

    return res.json({
      success: false,
      distanceKm: 0,
      error: `Could not calculate road distance between "${pickup}" and "${drop}". Please check place spelling or call Bokde Travels directly at 8983275497.`
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Error processing routing request: ' + err.message
    });
  }
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

// POST Booking & Notification Dispatch
app.post('/api/book', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.pickupLocation || !body.dropLocation || !body.customerName || !body.customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking parameters (pickupLocation, dropLocation, customerName, customerPhone)'
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = body.bookingReference || `BT-2026-${randomSuffix}`;

    const newBooking: StoredCabBooking = {
      id: `booking-${Date.now()}`,
      bookingReference: bookingRef,
      tripType: body.tripType || 'oneway',
      airportTransferType: body.airportTransferType,
      pickupLocation: body.pickupLocation,
      dropLocation: body.dropLocation,
      travelDate: body.travelDate || new Date().toISOString().split('T')[0],
      travelTime: body.travelTime || '09:00 AM',
      passengers: Number(body.passengers) || 1,
      distanceKm: Number(body.distanceKm) || 0,
      vehicleId: body.vehicleId || 'suzuki-dzire',
      vehicleName: body.vehicleName || 'Suzuki Dzire',
      perKmRate: Number(body.perKmRate) || 18,
      estimatedFare: Number(body.estimatedFare) || 0,
      tollNote: 'Payable by customer',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      specialRequests: body.specialRequests || '',
      paymentMethod: body.paymentMethod || 'cod',
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
          trip_type: newBooking.tripType,
          pickup_location: newBooking.pickupLocation,
          drop_location: newBooking.dropLocation,
          travel_date: newBooking.travelDate,
          travel_time: newBooking.travelTime,
          passengers: newBooking.passengers,
          distance_km: newBooking.distanceKm,
          vehicle_name: newBooking.vehicleName,
          per_km_rate: newBooking.perKmRate,
          estimated_fare: newBooking.estimatedFare,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          customer_email: newBooking.customerEmail,
          payment_method: newBooking.paymentMethod,
          status: newBooking.status
        });
        if (!error) supabaseSaved = true;
      } catch (dbErr) {
        console.warn('Supabase insert warning (fallback used):', dbErr);
      }
    }

    // 3. Email Notification Dispatch
    const emailSubject = `🚨 NEW CAB BOOKING: ${newBooking.pickupLocation} to ${newBooking.dropLocation} [Ref: ${newBooking.bookingReference}]`;
    const emailHtml = buildOwnerEmailHtml(newBooking, OWNER_EMAIL);

    const notificationRecord: StoredNotification = {
      id: `notif-${newBooking.bookingReference}-${Date.now()}`,
      bookingReference: newBooking.bookingReference,
      toEmail: OWNER_EMAIL,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      htmlPreview: emailHtml,
      bookingData: newBooking
    };

    memoryNotifications.unshift(notificationRecord);

    console.log(`[BOKDE TRAVELS BOOKING] Ref: ${newBooking.bookingReference} | Guest: ${newBooking.customerName} (${newBooking.customerPhone}) | ${newBooking.pickupLocation} -> ${newBooking.dropLocation} | Fare: Rs.${newBooking.estimatedFare}`);

    // 4. Resend External Email Notification
    let resendResult = { success: true, emailSent: false };
    try {
      const emailPayload: BookingEmailPayload = {
        bookingReference: newBooking.bookingReference,
        customerName: newBooking.customerName,
        customerPhone: newBooking.customerPhone,
        customerEmail: newBooking.customerEmail,
        specialRequests: body.cleanSpecialRequests || newBooking.specialRequests,
        tripType: newBooking.tripType,
        airportTransferType: newBooking.airportTransferType,
        pickupLocation: newBooking.pickupLocation,
        dropLocation: newBooking.dropLocation,
        travelDate: newBooking.travelDate,
        travelTime: newBooking.travelTime,
        passengers: newBooking.passengers,
        vehicleName: newBooking.vehicleName,
        estimatedFare: newBooking.estimatedFare,
        paymentMethod: newBooking.paymentMethod,
        hasCompletedUpiPayment: body.hasCompletedUpiPayment,
        upiTransactionRef: body.upiTransactionRef
      };
      resendResult = await sendResendBookingEmail(emailPayload);
    } catch (resendErr) {
      console.warn('Resend auto-email trigger warning:', resendErr);
    }

    return res.status(201).json({
      success: true,
      booking: newBooking,
      supabaseSaved,
      emailResult: resendResult
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

// Dedicated Resend Email Dispatch Endpoint (/api/send-booking-email)
app.get('/api/send-booking-email', (req: Request, res: Response) => {
  res.json({
    status: 'Bokde Travels Resend Email Service is active',
    recipient: 'bokdetravels@gmail.com'
  });
});

app.post('/api/send-booking-email', async (req: Request, res: Response) => {
  try {
    const payload: BookingEmailPayload = req.body;
    if (!payload || !payload.bookingReference || !payload.customerName || !payload.customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields (bookingReference, customerName, customerPhone)'
      });
    }

    const result = await sendResendBookingEmail(payload);
    return res.status(200).json({
      ...result,
      bookingReference: payload.bookingReference,
      recipient: 'bokdetravels@gmail.com'
    });
  } catch (err: any) {
    console.error('Error in /api/send-booking-email route:', err);
    return res.status(200).json({
      success: true,
      emailSent: false,
      error: err.message || 'Email dispatch failed'
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
    console.log(`Bokde Travels server running on http://0.0.0.0:${PORT}`);
    console.log(`Bookings helpline: ${BUSINESS_PHONE} | Email: ${OWNER_EMAIL}`);
  });
}

startServer();
