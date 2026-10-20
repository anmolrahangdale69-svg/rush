// Vercel Serverless Function: /api/bookings/[...action]
// Handles /api/bookings/:id/cancel, /api/bookings/:id/status, and /api/bookings/:id

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;
  const segments = Array.isArray(action) ? action : [action];
  const bookingId = segments[0] ? segments[0].replace(/^#/, '') : '';
  const subAction = segments[1] || '';

  if (!bookingId) {
    return res.status(400).json({ success: false, error: 'Booking ID required' });
  }

  // 1. Cancel endpoint: /api/bookings/:id/cancel
  if (subAction === 'cancel' || req.method === 'POST') {
    const cancelledBooking = {
      id: bookingId,
      bookingReference: bookingId.toUpperCase().startsWith('BT-') ? bookingId.toUpperCase() : `BT-2026-${bookingId}`,
      status: 'cancelled',
      tollNote: 'Zero Cancellation Charge Applied',
      updatedAt: new Date().toISOString()
    };

    console.log(`[BOKDE TRAVELS VERCEL] Cancelled booking: ${cancelledBooking.bookingReference}`);

    return res.status(200).json({
      success: true,
      booking: cancelledBooking,
      message: `Booking #${cancelledBooking.bookingReference} has been cancelled successfully.`
    });
  }

  // 2. Status update: /api/bookings/:id/status
  if (subAction === 'status' || req.method === 'PATCH') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }
    const newStatus = body?.status || 'cancelled';

    return res.status(200).json({
      success: true,
      booking: {
        id: bookingId,
        bookingReference: bookingId,
        status: newStatus
      }
    });
  }

  // 3. Get single booking details: /api/bookings/:id
  return res.status(200).json({
    success: true,
    booking: {
      id: bookingId,
      bookingReference: bookingId.toUpperCase().startsWith('BT-') ? bookingId.toUpperCase() : `BT-2026-${bookingId}`,
      pickupLocation: 'Nagpur',
      dropLocation: 'Destination Route',
      travelDate: new Date().toISOString().split('T')[0],
      travelTime: '10:00 AM',
      passengers: 2,
      vehicleName: 'AC Cab',
      totalPrice: 1326,
      status: 'confirmed'
    }
  });
}
