// Vercel serverless function — returns current server UTC time
// Frontend uses this to prevent device-clock tampering
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ now: new Date().toISOString() });
}
