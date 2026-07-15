import axios from 'axios';

export default async function handler(req, res) {
  const N8N_BASE    = process.env.N8N_BASE_URL    || 'http://34.87.173.195:5678';
  const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL || `${N8N_BASE}/webhook/chart`;

  // ไม่มี timeout — รอจนกว่า n8n จะตอบกลับ
  const UPSTREAM_TIMEOUT = Number(process.env.N8N_TIMEOUT_MS || 0);

// ── GET: health check  ตั้งให้ ออกเวลาตาม Response ทางฝั่ง n8n (ไม่มี Timeout) ──
  if (req.method === 'GET') {
    try {
      const startTime = Date.now();
      // ลบ timeout ออก เพื่อให้รอจนกว่า n8n จะตอบกลับ
      const resp = await axios.get(N8N_BASE, { validateStatus: () => true });
      const responseTime = Date.now() - startTime;
      
      return res.status(200).json({ 
        ok: resp.status < 500, 
        status: resp.status, 
        url: N8N_BASE,
        responseTimeMs: responseTime 
      });
    } catch (err) {
      return res.status(502).json({ ok: false, error: 'n8n unreachable', code: err.code, details: err.message });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // ── Parse body ──
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { message = '', sessionId = '' } = body || {};
  if (!String(message).trim()) return res.status(400).json({ error: 'message is required' });

  // ── ตั้ง Next.js response timeout ให้ยาวพอ ──
  // (Vercel edge ไม่รองรับ แต่ self-host / local ทำได้)
  if (res.socket) {
    res.socket.setTimeout(0);       // ไม่ timeout ที่ socket
    res.socket.setKeepAlive(true);
  }

  const callN8N = () =>
    axios.post(
      N8N_WEBHOOK,
      { message, sessionId, timestamp: new Date() },
      {
        timeout: UPSTREAM_TIMEOUT,   // 0 = ไม่มี timeout
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        validateStatus: () => true,
        maxRedirects: 5,
      }
    );

  try {
    let upstream = await callN8N();

    // retry ครั้งเดียวถ้า server error
    if (upstream.status >= 500) {
      await new Promise(r => setTimeout(r, 1500));
      upstream = await callN8N();
    }

    let payload = upstream.data;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch { payload = { reply: payload }; }
    }
    if (payload == null || typeof payload !== 'object') {
      payload = { reply: String(payload || '') };
    }

    const status = upstream.status >= 200 && upstream.status < 300 ? 200 : 502;
    return res.status(status).json(payload);

  } catch (err) {
    console.error('Error calling n8n:', err.code, err.message);
    return res.status(502).json({
      error: 'Failed to connect to n8n',
      code: err.code,
      details: err.message,
      webhook: N8N_WEBHOOK,
    });
  }
}

// ── ปิด bodyParser size limit / response timeout ของ Next.js ──
export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' },
    responseLimit: false,
    externalResolver: true,   // บอก Next.js ว่า handler จัดการ res เอง → ไม่ auto-timeout
  },
};