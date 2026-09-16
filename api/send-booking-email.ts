import { BookingEmailPayload, sendResendBookingEmail } from '../src/utils/bookingEmail';

// Vercel Serverless Function: /api/send-booking-email
// Handles direct email notifications for Bokde Travels bookings

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'Bokde Travels Email Notification Endpoint Operational',
      recipient: 'bokdetravels@gmail.com'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body: BookingEmailPayload = req.body;

    // Validate required fields
    if (!body || !body.bookingReference || !body.customerName || !body.customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking parameters (bookingReference, customerName, customerPhone)'
      });
    }

    const result = await sendResendBookingEmail(body);

    return res.status(200).json({
      ...result,
      bookingReference: body.bookingReference,
      recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'bokdetravels@gmail.com'
    });
  } catch (err: any) {
    console.error('[Resend Endpoint Error]:', err);
    // Never break client flow
    return res.status(200).json({
      success: true,
      emailSent: false,
      error: err.message || 'Failed to dispatch email'
    });
  }
}
