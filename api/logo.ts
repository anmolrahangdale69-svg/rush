// Vercel Serverless Function: /api/logo
// Serves or redirects to the Bokde Travels branding logo

export default async function handler(req: any, res: any) {
  // Redirect to static logo.png hosted in public/ folder
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.redirect(307, '/logo.png');
}
