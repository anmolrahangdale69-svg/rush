import { BookingEmailPayload, sendResendBookingEmail } from '../src/utils/bookingEmail';

// Vercel Serverless Function: /api/send-booking-email
// Handles direct automated email notifications for Bokde Travels bookings via Resend

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'Bokde Travels Resend Email Notification Endpoint Operational',
      sender: process.env.RESEND_FROM_EMAIL || 'Bokde Travels <booking@bokdetravels.in>',
      recipient: process.env.BOOKING_RECIPIENT_EMAIL || 'travelsbokde@gmail.com'
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
