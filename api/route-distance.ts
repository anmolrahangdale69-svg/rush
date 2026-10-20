// Vercel Serverless Function: /api/route-distance
// Highway distance resolution for Bokde Travels

const highwayTable: Record<string, number> = {
  'wardha': 78,
  'amravati': 155,
  'chandrapur': 152,
  'bhandara': 65,
  'gondia': 160,
  'yavatmal': 150,
  'gadchiroli': 180,
  'ramtek': 50,
  'chhindwara': 128,
  'seoni': 130,
  'jabalpur': 275,
  'pench': 85,
  'tadoba': 140,
  'kanha': 260,
  'akola': 250,
  'shegaon': 300,
  'nanded': 345,
  'pune': 710,
  'mumbai': 820,
  'hyderabad': 500,
  'raipur': 285
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {}
  }

  const pickup = (body.pickup || req.query.pickup || 'Nagpur').toLowerCase();
  const drop = (body.drop || req.query.drop || '').toLowerCase();

  let distanceKm = 40;
  for (const [key, km] of Object.entries(highwayTable)) {
    if (drop.includes(key) || pickup.includes(key)) {
      distanceKm = km;
      break;
    }
  }

  const hours = Math.floor(distanceKm / 60);
  const mins = Math.round((distanceKm % 60) * 0.9);
  const durationText = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

  return res.status(200).json({
    success: true,
    distanceKm,
    durationText,
    fromFormatted: body.pickup || 'Nagpur',
    toFormatted: body.drop || 'Destination'
  });
}
