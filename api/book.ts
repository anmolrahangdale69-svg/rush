// Vercel Serverless Function: /api/book
// Direct booking endpoint for Bokde Travels Vercel deployments

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Bokde Travels Booking API Operational' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = body.bookingReference || `BT-${new Date().getFullYear()}-${randomSuffix}`;

    const newBooking = {
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

    return res.status(201).json({
      success: true,
      booking: newBooking
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
