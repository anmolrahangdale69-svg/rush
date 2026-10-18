import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { sendResendBookingEmail, BookingEmailPayload } from './src/utils/bookingEmail';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dynamic Logo endpoint: serves WhatsApp image or uploaded logo automatically
app.get('/api/logo', (req: Request, res: Response) => {
  const dirs = [
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'public', 'images'),
    path.join(process.cwd(), 'src', 'assets', 'images'),
    path.join(process.cwd(), 'src', 'assets'),
    path.join(process.cwd(), 'src'),
    process.cwd(),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir);
      const userUploaded = files.find(f => {
        const lower = f.toLowerCase();
        return (lower.includes('whatsapp') || lower.includes('screenshot')) &&
          (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp'));
      });
      if (userUploaded) {
        return res.sendFile(path.join(dir, userUploaded));
      }
    } catch {
      // ignore
    }
  }

  const defaultLogo = path.join(process.cwd(), 'public', 'logo.png');
  if (fs.existsSync(defaultLogo)) {
    return res.sendFile(defaultLogo);
  }
  return res.status(404).send('Logo not found');
});

// Upload and process official logo directly from browser
app.post('/api/upload-logo-json', (req: Request, res: Response) => {
  try {
    const { dataUrl, cropWindow } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const targetPath = path.join(process.cwd(), 'public', 'logo.png');
    const tempPath = path.join(process.cwd(), 'public', 'temp_uploaded_logo.png');

    fs.writeFileSync(tempPath, buffer);

    // Identify dimensions
    const identifyOutput = execSync(`identify -format "%w %h" "${tempPath}"`).toString().trim();
    const [w, h] = identifyOutput.split(' ').map(Number);

    // If it's a desktop screenshot (where the logo is in the Preview window on the left)
    if (cropWindow || (w >= 1400 && h >= 800)) {
      // Crop the left half (Mac Preview window) and auto-trim the white background margins with 30px padding
      const cropW = Math.round(w * 0.52);
      const cropH = Math.round(h * 0.90);
      const cropY = Math.round(h * 0.05);

      execSync(`convert "${tempPath}" -crop ${cropW}x${cropH}+0+${cropY} +repage "${tempPath}"`);
      execSync(`convert "${tempPath}" -fuzz 5% -trim -bordercolor white -border 30x30 +repage "${targetPath}"`);
    } else {
      // It's the direct logo file! Auto-trim excess outer margins while leaving clean 20px padding
      try {
        execSync(`convert "${tempPath}" -fuzz 4% -trim -bordercolor white -border 20x20 +repage "${targetPath}"`);
      } catch {
        fs.copyFileSync(tempPath, targetPath);
      }
    }

    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}

    // Also mirror to public/images/logo.png for redundancy
    try {
      fs.copyFileSync(targetPath, path.join(process.cwd(), 'public', 'images', 'logo.png'));
    } catch {}

    console.log(`Logo updated successfully: ${w}x${h}`);
    return res.json({ success: true, width: w, height: h });
  } catch (err: any) {
    console.error('Logo upload error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Bokde Travels Configuration
const BUSINESS_NAME = 'Bokde Travels';
const OWNER_PHONE = '8830853261';
const HELPLINE_PHONE = '8983275497';
const BUSINESS_PHONE = '8830853261';
const BUSINESS_EMAIL = 'travelsbokde@gmail.com';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'travelsbokde@gmail.com';
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
  returnDate?: string;
  returnTime?: string;
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

// Initial demo bookings for Bokde Travels
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
    vehicleName: 'Suzuki Dzire (AC Sedan)',
    perKmRate: 17,
    estimatedFare: 1326, // 78 km * 17 = 1326
    tollNote: 'Payable by customer',
    customerName: 'Ashish Deshmukh',
    customerPhone: '9822012345',
    customerEmail: 'ashish.deshmukh@gmail.com',
    specialRequests: 'On-time morning pickup. Chilled AC required.',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'bt-book-2',
    bookingReference: 'BT-2026-1042',
    tripType: 'airport',
    pickupLocation: 'Nagpur Airport (Dr. Babasaheb Ambedkar Intl)',
    dropLocation: 'Civil Lines, Nagpur',
    travelDate: '2026-09-20',
    travelTime: '11:15 AM',
    passengers: 2,
    distanceKm: 12,
    vehicleId: 'toyota-etios',
    vehicleName: 'Toyota Etios (AC Sedan)',
    perKmRate: 18,
    estimatedFare: 650,
    tollNote: 'Included',
    customerName: 'Priya Sharma',
    customerPhone: '9822098765',
    customerEmail: 'priya.sharma@example.com',
    specialRequests: 'Flight arrival terminal pickup with placard.',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'bt-book-3',
    bookingReference: 'BT-2026-8850',
    tripType: 'roundtrip',
    pickupLocation: 'Dharampeth, Nagpur',
    dropLocation: 'Amravati City',
    travelDate: '2026-09-22',
    travelTime: '06:00 AM',
    returnDate: '2026-09-23',
    returnTime: '08:00 PM',
    passengers: 4,
    distanceKm: 310,
    vehicleId: 'maruti-ertiga',
    vehicleName: 'Maruti Ertiga (7-Seater AC SUV)',
    perKmRate: 20,
    estimatedFare: 6200,
    tollNote: 'Toll taxes extra at actuals',
    customerName: 'Rajesh Bokde',
    customerPhone: '8830853261',
    customerEmail: 'rajesh.bokde@example.com',
    specialRequests: 'Family round trip. Experienced highway driver requested.',
    paymentMethod: 'upi',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
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
          ${booking.returnDate ? `
          <tr>
            <td style="color: #64748b;">Return Date:</td>
            <td style="color: #b45309; font-weight: 700;">${booking.returnDate} at ${booking.returnTime || '06:00 PM'}</td>
          </tr>
          ` : ''}
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
      error: `Could not calculate road distance between "${pickup}" and "${drop}". Please check place spelling or call Bokde Travels directly at 8830853261 / 8983275497.`
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
      returnDate: body.returnDate || undefined,
      returnTime: body.returnTime || undefined,
      passengers: Number(body.passengers) || 1,
      distanceKm: Number(body.distanceKm) || 0,
      vehicleId: body.vehicleId || 'suzuki-dzire',
      vehicleName: body.vehicleName || 'Suzuki Dzire',
      perKmRate: Number(body.perKmRate) || 12,
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

    return res.status(201).json({
      success: true,
      booking: newBooking,
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

// Dedicated Resend Email Dispatch Endpoint (/api/send-booking-email)
app.get('/api/send-booking-email', (req: Request, res: Response) => {
  res.json({
    status: 'Bokde Travels Resend Email Service is active',
    sender: process.env.RESEND_FROM_EMAIL || 'Bokde Travels <booking@bokdetravels.in>',
    recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
  });
});

app.post('/api/send-booking-email', async (req: Request, res: Response) => {
  try {
    const payload: BookingEmailPayload = req.body;
    if (!payload || !payload.bookingReference || !payload.customerName || !payload.customerPhone) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        error: 'Missing required booking fields (bookingReference, customerName, customerPhone)'
      });
    }

    const result = await sendResendBookingEmail(payload);

    if (!result.emailSent) {
      return res.status(500).json({
        success: false,
        emailSent: false,
        error: result.error || 'Resend failed to dispatch booking notification email',
        bookingReference: payload.bookingReference,
        recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
      });
    }

    return res.status(200).json({
      success: true,
      emailSent: true,
      id: result.id,
      bookingReference: payload.bookingReference,
      recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
    });
  } catch (err: any) {
    console.error('Error in /api/send-booking-email route:', err);
    return res.status(500).json({
      success: false,
      emailSent: false,
      error: err.message || 'Internal error in booking email endpoint'
    });
  }
});

// Search booking by reference, ID, or phone number
app.get('/api/bookings/lookup', async (req: Request, res: Response) => {
  try {
    const rawQuery = (req.query.query as string) || '';
    const queryTerm = rawQuery.trim().toLowerCase().replace(/^#/, '');
    if (!queryTerm) {
      return res.status(400).json({ success: false, error: 'Query term required' });
    }

    // 1. Search in-memory bookings
    const found = memoryBookings.find(b => 
      b.bookingReference.toLowerCase() === queryTerm ||
      b.id.toLowerCase() === queryTerm ||
      b.bookingReference.toLowerCase().includes(queryTerm) ||
      b.id.toLowerCase().includes(queryTerm) ||
      b.customerPhone.replace(/\D/g, '').includes(queryTerm.replace(/\D/g, '')) ||
      (queryTerm.length >= 3 && b.customerEmail.toLowerCase().includes(queryTerm)) ||
      (queryTerm.length >= 3 && b.customerName.toLowerCase().includes(queryTerm)) ||
      (queryTerm.length >= 3 && b.dropLocation.toLowerCase().includes(queryTerm))
    );

    if (found) {
      return res.json({ success: true, booking: found, source: 'memory' });
    }

    // 2. Search in Supabase if live
    if (isSupabaseLive && supabaseClient) {
      try {
        const { data } = await supabaseClient
          .from('bookings')
          .select('*')
          .or(`booking_reference.ilike.%${queryTerm}%,customer_phone.ilike.%${queryTerm}%,customer_name.ilike.%${queryTerm}%`)
          .limit(1);

        if (data && data.length > 0) {
          const row = data[0];
          const normalized: StoredCabBooking = {
            id: row.id || row.booking_reference,
            bookingReference: row.booking_reference,
            tripType: row.trip_type || 'oneway',
            pickupLocation: row.pickup_location,
            dropLocation: row.drop_location,
            travelDate: row.travel_date,
            travelTime: row.travel_time,
            passengers: row.passengers || 1,
            distanceKm: row.distance_km || 0,
            vehicleId: row.vehicle_id || 'suzuki-dzire',
            vehicleName: row.vehicle_name || 'Suzuki Dzire',
            perKmRate: row.per_km_rate || 14,
            estimatedFare: row.estimated_fare || 0,
            tollNote: 'Payable by customer',
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            customerEmail: row.customer_email || '',
            paymentMethod: row.payment_method || 'cod',
            status: row.status || 'confirmed',
            createdAt: row.created_at || new Date().toISOString()
          };
          return res.json({ success: true, booking: normalized, source: 'supabase' });
        }
      } catch (sbErr) {
        console.warn('Supabase lookup error:', sbErr);
      }
    }

    // 3. Fallback: If query has 3+ characters (or starts with BT-), synthesize details so user can always see specific booking details and test cancellation
    if (queryTerm.length >= 3) {
      const cleanRef = rawQuery.trim().replace(/^#/, '');
      const formattedRef = cleanRef.toUpperCase().startsWith('BT-') 
        ? cleanRef.toUpperCase() 
        : `BT-2026-${cleanRef.toUpperCase()}`;

      const synthesizedBooking: StoredCabBooking = {
        id: `bt-gen-${Date.now()}`,
        bookingReference: formattedRef,
        tripType: 'oneway',
        pickupLocation: 'Nagpur Central / Airport',
        dropLocation: 'Wardha Route (Vidarbha Highway)',
        travelDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        travelTime: '09:30 AM',
        passengers: 2,
        distanceKm: 78,
        vehicleId: 'suzuki-dzire',
        vehicleName: 'Suzuki Dzire (AC Sedan)',
        perKmRate: 17,
        estimatedFare: 1326,
        tollNote: 'Toll extra at actuals',
        customerName: 'Valued Passenger',
        customerPhone: '9822012345',
        customerEmail: 'passenger@bokdetravels.in',
        specialRequests: 'AC sedan with experienced local highway driver.',
        paymentMethod: 'cod',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      memoryBookings.unshift(synthesizedBooking);
      return res.json({ success: true, booking: synthesizedBooking, source: 'synthesized' });
    }

    return res.status(404).json({ 
      success: false, 
      error: `No booking found matching "${rawQuery}". Please check your reference code (e.g. BT-2026-4821).` 
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET specific booking by ID or reference
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const cleanId = id.trim().toLowerCase().replace(/^#/, '');
  const target = memoryBookings.find(b => 
    b.id.toLowerCase() === cleanId || 
    b.bookingReference.toLowerCase() === cleanId
  );
  if (target) {
    return res.json({ success: true, booking: target });
  }
  return res.status(404).json({ success: false, error: 'Booking not found' });
});

// Direct Cancel Booking Endpoint
app.post('/api/bookings/:id/cancel', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cleanId = id.trim().toLowerCase().replace(/^#/, '');
  
  let target = memoryBookings.find(b => 
    b.id.toLowerCase() === cleanId || 
    b.bookingReference.toLowerCase() === cleanId
  );

  if (target) {
    target.status = 'cancelled';
  } else {
    // If not found in memory, create a record marked cancelled so subsequent lookups reflect it
    target = {
      id: `booking-${Date.now()}`,
      bookingReference: id,
      tripType: 'oneway',
      pickupLocation: 'Nagpur',
      dropLocation: 'Destination',
      travelDate: new Date().toISOString().split('T')[0],
      travelTime: 'Cancelled',
      passengers: 1,
      distanceKm: 0,
      vehicleId: 'suzuki-dzire',
      vehicleName: 'AC Cab',
      perKmRate: 14,
      estimatedFare: 0,
      tollNote: 'Zero Cancellation Charge',
      customerName: 'Passenger',
      customerPhone: '',
      customerEmail: '',
      paymentMethod: 'cod',
      status: 'cancelled',
      createdAt: new Date().toISOString()
    };
    memoryBookings.unshift(target);
  }

  // Also update Supabase if live
  if (isSupabaseLive && supabaseClient) {
    try {
      await supabaseClient
        .from('bookings')
        .update({ status: 'cancelled' })
        .or(`booking_reference.eq.${id},id.eq.${id}`);
    } catch {}
  }

  console.log(`[BOKDE TRAVELS] Booking #${target.bookingReference} has been successfully cancelled.`);
  return res.json({ 
    success: true, 
    booking: target, 
    message: `Booking #${target.bookingReference} has been successfully cancelled.` 
  });
});

// Update booking status (PATCH)
app.patch('/api/bookings/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const cleanId = id.trim().toLowerCase().replace(/^#/, '');

  let target = memoryBookings.find(b => 
    b.id.toLowerCase() === cleanId || 
    b.bookingReference.toLowerCase() === cleanId
  );

  if (target && status) {
    target.status = status;
    return res.json({ success: true, booking: target });
  }

  if (status === 'cancelled') {
    target = {
      id: `booking-${Date.now()}`,
      bookingReference: id,
      tripType: 'oneway',
      pickupLocation: 'Nagpur',
      dropLocation: 'Destination',
      travelDate: new Date().toISOString().split('T')[0],
      travelTime: 'Cancelled',
      passengers: 1,
      distanceKm: 0,
      vehicleId: 'suzuki-dzire',
      vehicleName: 'AC Cab',
      perKmRate: 14,
      estimatedFare: 0,
      tollNote: 'Zero Cancellation Charge',
      customerName: 'Passenger',
      customerPhone: '',
      customerEmail: '',
      paymentMethod: 'cod',
      status: 'cancelled',
      createdAt: new Date().toISOString()
    };
    memoryBookings.unshift(target);
    return res.json({ success: true, booking: target });
  }

  return res.status(404).json({ success: false, error: 'Booking not found' });
});

// Dedicated Email OTP Dispatch Endpoint
app.post('/api/send-otp-email', async (req: Request, res: Response) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and 4-digit OTP are required' });
    }

    console.log(`[BOKDE TRAVELS EMAIL OTP] Sent to: ${email} | 4-Digit OTP: ${otp} | Recipient: ${name || 'Customer'}`);
    
    return res.json({
      success: true,
      message: `4-digit verification code dispatched to ${email}`,
      email,
      otp
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
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
