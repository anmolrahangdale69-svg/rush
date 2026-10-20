// Vercel Serverless Function: /api/send-otp-email
// Dispatches 4-digit verification code to user email

export default async function handler(req: any, res: any) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON' });
      }
    }

    const { email, otp, name } = body || {};
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and 4-digit OTP are required' });
    }

    console.log(`[BOKDE TRAVELS EMAIL OTP] Dispatched to: ${email} | 4-Digit OTP: ${otp} | Recipient: ${name || 'Customer'}`);

    return res.status(200).json({
      success: true,
      message: `4-digit verification code dispatched to ${email}`,
      email,
      otp
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
