import { Resend } from 'resend';

export interface BookingEmailPayload {
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  tripType: string;
  airportTransferType?: string;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number | string;
  vehicleName: string;
  estimatedFare: number | string;
  paymentMethod: string;
  hasCompletedUpiPayment?: boolean;
  upiTransactionRef?: string;
}

export function formatTripType(type: string, airportType?: string): string {
  switch (type?.toLowerCase()) {
    case 'oneway':
      return 'One Way';
    case 'roundtrip':
      return 'Round Trip';
    case 'local':
      return 'Local';
    case 'airport':
      return airportType === 'drop' ? 'Airport Transfer (Drop)' : 'Airport Transfer (Pickup)';
    default:
      return type || 'One Way';
  }
}

export function buildEmailContent(data: BookingEmailPayload) {
  const tripTypeFormatted = formatTripType(data.tripType, data.airportTransferType);
  const isUpi = data.paymentMethod?.toLowerCase() === 'upi';
  const paymentMethodDisplay = isUpi ? 'UPI' : 'Pay Driver / COD';

  // Format UPI Confirmation text
  let upiConfirmationDisplay = 'N/A';
  if (isUpi) {
    if (data.hasCompletedUpiPayment) {
      upiConfirmationDisplay = 'Customer confirmed they completed the UPI payment (Self-reported by customer in booking form; payment is not automatically verified)';
      if (data.upiTransactionRef && data.upiTransactionRef.trim()) {
        upiConfirmationDisplay += ` | Reference / UTR: ${data.upiTransactionRef.trim()}`;
      }
    } else {
      upiConfirmationDisplay = 'Customer selected UPI but payment confirmation was not marked';
    }
  } else {
    upiConfirmationDisplay = 'N/A (Pay Driver / Cash on Delivery)';
  }

  const specialRequestsDisplay = data.specialRequests && data.specialRequests.trim()
    ? data.specialRequests.trim()
    : 'None';

  const customerEmailDisplay = data.customerEmail && data.customerEmail.trim()
    ? data.customerEmail.trim()
    : 'Not provided';

  const fareAmountDisplay = Number(data.estimatedFare || 0).toLocaleString('en-IN');

  // Exact Subject
  const subject = `New Cab Booking - ${data.bookingReference}`;

  // Plain-text body meeting exact required format
  const text = `BOKDE TRAVELS
New Booking Received

Booking ID: ${data.bookingReference}

CUSTOMER DETAILS
Full Name: ${data.customerName}
Phone: ${data.customerPhone}
Email: ${customerEmailDisplay}
Special Requests: ${specialRequestsDisplay}

TRIP DETAILS
Trip Type: ${tripTypeFormatted}
Pickup: ${data.pickupLocation}
Drop: ${data.dropLocation}
Date: ${data.travelDate}
Time: ${data.travelTime}${data.returnDate ? `\nReturn Date: ${data.returnDate}\nReturn Time: ${data.returnTime || 'N/A'}` : ''}
Passengers: ${data.passengers}

VEHICLE
Vehicle: ${data.vehicleName}

FARE
Calculated Booking Amount: ₹${fareAmountDisplay}

PAYMENT
Payment Method: ${paymentMethodDisplay}
UPI Payment Confirmation: ${upiConfirmationDisplay}
`;

  // Professional HTML body
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Cab Booking - ${data.bookingReference}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f4; color: #1c1917; line-height: 1.5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Brand Header -->
    <tr>
      <td style="background-color: #1c1917; padding: 28px 32px; text-align: left;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #f59e0b;">BOKDE TRAVELS</p>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">New Booking Received</h1>
        <div style="margin-top: 14px; display: inline-block; background-color: #292524; padding: 6px 14px; border-radius: 6px; border: 1px solid #44403c;">
          <span style="font-size: 13px; font-weight: 700; color: #fbbf24; font-family: monospace;">Booking ID: ${data.bookingReference}</span>
        </div>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 28px 32px;">
        
        <!-- Customer Details Section -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding-bottom: 8px; border-bottom: 2px solid #f59e0b;">
              <h2 style="margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #78350f;">CUSTOMER DETAILS</h2>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin: 4px 0; font-size: 14px;"><strong>Full Name:</strong> ${data.customerName}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${data.customerPhone}" style="color: #b45309; text-decoration: none; font-weight: bold;">${data.customerPhone}</a></p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${customerEmailDisplay}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Special Requests:</strong> ${specialRequestsDisplay}</p>
            </td>
          </tr>
        </table>

        <!-- Trip Details Section -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding-bottom: 8px; border-bottom: 2px solid #f59e0b;">
              <h2 style="margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #78350f;">TRIP DETAILS</h2>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin: 4px 0; font-size: 14px;"><strong>Trip Type:</strong> ${tripTypeFormatted}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Pickup:</strong> ${data.pickupLocation}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Drop:</strong> ${data.dropLocation}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${data.travelDate}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${data.travelTime}</p>
              ${data.returnDate ? `<p style="margin: 4px 0; font-size: 14px; background-color: #fef3c7; padding: 4px 8px; border-radius: 4px; display: inline-block;"><strong>Return Date:</strong> ${data.returnDate}${data.returnTime ? ` at ${data.returnTime}` : ''}</p>` : ''}
              <p style="margin: 4px 0; font-size: 14px;"><strong>Passengers:</strong> ${data.passengers}</p>
            </td>
          </tr>
        </table>

        <!-- Vehicle Section -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding-bottom: 8px; border-bottom: 2px solid #f59e0b;">
              <h2 style="margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #78350f;">VEHICLE</h2>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin: 4px 0; font-size: 14px;"><strong>Vehicle:</strong> ${data.vehicleName}</p>
            </td>
          </tr>
        </table>

        <!-- Fare Section -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #fef3c7; border-radius: 8px; padding: 16px; border: 1px solid #fde68a;">
          <tr>
            <td>
              <span style="display: block; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #92400e;">FARE</span>
              <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 900; color: #78350f;">
                Calculated Booking Amount: ₹${fareAmountDisplay}
              </p>
              <span style="display: block; font-size: 12px; color: #92400e; margin-top: 4px;">Tolls &amp; parking payable by customer.</span>
            </td>
          </tr>
        </table>

        <!-- Payment Section -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding-bottom: 8px; border-bottom: 2px solid #f59e0b;">
              <h2 style="margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #78350f;">PAYMENT</h2>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin: 4px 0; font-size: 14px;">
                <strong>Payment Method:</strong> ${paymentMethodDisplay}
              </p>
              <div style="margin-top: 8px; padding: 12px; border-radius: 6px; background-color: ${isUpi ? '#f0fdf4' : '#f5f5f4'}; border: 1px solid ${isUpi ? '#bbf7d0' : '#e7e5e4'};">
                <strong style="font-size: 13px; color: #1c1917;">UPI Payment Confirmation:</strong>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #44403c;">
                  ${upiConfirmationDisplay}
                </p>
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #fafaf9; padding: 20px 32px; border-top: 1px solid #e7e5e4; text-align: center;">
        <p style="margin: 0; font-size: 12px; font-weight: 600; color: #78716c;">
          Bokde Travels &bull; Nagpur, Maharashtra
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #a8a29e;">
          Phone: <a href="tel:8983275497" style="color: #78716c; text-decoration: none;">8983275497</a> &bull; Email: <a href="mailto:bokdetravels@gmail.com" style="color: #78716c; text-decoration: none;">bokdetravels@gmail.com</a>
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;

  return { subject, text, html };
}

export async function sendResendBookingEmail(payload: BookingEmailPayload): Promise<{
  success: boolean;
  emailSent: boolean;
  id?: string;
  error?: string;
  warning?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.BOOKING_RECIPIENT_EMAIL || 'bokdetravels@gmail.com';
  const sender = process.env.RESEND_FROM_EMAIL || 'Bokde Travels <onboarding@resend.dev>';

  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY environment variable is not configured. Email skipped.');
    return {
      success: true,
      emailSent: false,
      warning: 'RESEND_API_KEY not configured on server'
    };
  }

  try {
    const { subject, text, html } = buildEmailContent(payload);
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: sender,
      to: [recipient],
      subject,
      text,
      html,
    });

    if (result.error) {
      console.error('[Resend Email Error]:', result.error);
      return {
        success: true,
        emailSent: false,
        error: result.error.message
      };
    }

    console.log(`[Resend Success] Email sent for booking ${payload.bookingReference} to ${recipient} (ID: ${result.data?.id})`);
    return {
      success: true,
      emailSent: true,
      id: result.data?.id
    };
  } catch (err: any) {
    console.error('[Resend Dispatch Exception]:', err);
    return {
      success: true,
      emailSent: false,
      error: err.message || 'Error occurred while contacting Resend'
    };
  }
}
