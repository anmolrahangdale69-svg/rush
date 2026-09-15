// Vercel Serverless Function: /api/book
// Direct endpoint for Vercel deployments
import type { Request, Response } from 'express';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Aura Voyages Vercel API is operational' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const OWNER_EMAIL = process.env.OWNER_EMAIL || 'anmolrahangdale69@gmail.com';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = body.bookingReference || `AV-2026-${randomSuffix}`;

    const newBooking = {
      id: `booking-${Date.now()}`,
      bookingReference: bookingRef,
      tourId: body.tourId,
      tourTitle: body.tourTitle,
      destination: body.destination,
      departureDate: body.departureDate,
      travelerCount: body.travelerCount,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      specialRequests: body.specialRequests || '',
      selectedAddons: body.selectedAddons || [],
      basePrice: body.basePrice,
      addonsTotal: body.addonsTotal,
      taxAmount: body.taxAmount,
      totalPrice: body.totalPrice,
      currency: body.currency || 'USD',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const emailSubject = `🚨 NEW BOOKING CONFIRMED: ${newBooking.tourTitle} [Ref: ${newBooking.bookingReference}]`;

    // Resend integration for Vercel production
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Aura Voyages <bookings@auravoyages.com>',
          to: [OWNER_EMAIL],
          subject: emailSubject,
          html: `<p>New booking for ${newBooking.tourTitle} from ${newBooking.customerName} (${newBooking.customerEmail}). Total: $${newBooking.totalPrice}</p>`
        })
      });
    }

    return res.status(201).json({
      success: true,
      booking: newBooking,
      emailNotification: {
        dispatchedImmediately: true,
        ownerEmail: OWNER_EMAIL,
        subject: emailSubject,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
