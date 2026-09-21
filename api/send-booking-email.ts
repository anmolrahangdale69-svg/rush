import { BookingEmailPayload, sendResendBookingEmail } from '../src/utils/bookingEmail';

// Vercel Serverless Function: /api/send-booking-email
// Handles direct automated email notifications for Bokde Travels bookings via Resend

export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const hasApiKey = Boolean(process.env.RESEND_API_KEY);
    return res.status(200).json({
      status: 'Bokde Travels Resend Email Notification Endpoint Operational',
      configured: hasApiKey,
      sender: process.env.RESEND_FROM_EMAIL || 'Bokde Travels <booking@bokdetravels.in>',
      recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com',
      note: hasApiKey
        ? 'Resend API key detected'
        : 'RESEND_API_KEY environment variable is not set'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, emailSent: false, error: 'Method Not Allowed' });
  }

  try {
    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Invalid JSON payload in request body'
        });
      }
    } else if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString('utf8'));
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Invalid Buffer JSON payload in request body'
        });
      }
    }

    // Validate required fields
    if (!body || !body.bookingReference || !body.customerName || !body.customerPhone) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        error: 'Missing required booking parameters (bookingReference, customerName, customerPhone)'
      });
    }

    const result = await sendResendBookingEmail(body);

    if (!result.emailSent) {
      return res.status(500).json({
        success: false,
        emailSent: false,
        error: result.error || 'Resend failed to dispatch booking notification email',
        bookingReference: body.bookingReference,
        recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
      });
    }

    return res.status(200).json({
      success: true,
      emailSent: true,
      id: result.id,
      bookingReference: body.bookingReference,
      recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
    });
  } catch (err: any) {
    console.error('[Resend Endpoint Error]:', err);
    return res.status(500).json({
      success: false,
      emailSent: false,
      error: err.message || 'Internal error while processing booking email'
    });
  }
}
