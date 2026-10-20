// Vercel Serverless Function: /api
// API Health and Status endpoint

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'Bokde Travels API is operational on Vercel',
    version: '2.0.0',
    service: 'Bokde Travels Nagpur',
    endpoints: [
      '/api/book',
      '/api/send-booking-email',
      '/api/send-otp-email',
      '/api/bookings/lookup',
      '/api/bookings/:id/cancel',
      '/api/route-distance',
      '/api/logo'
    ],
    timestamp: new Date().toISOString()
  });
}
