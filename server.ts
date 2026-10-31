import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
app.use(express.json({ limit: '1mb' }));

// Tolak request /api dari origin lain (mencegah situs asing memakai server ini lewat browser pengguna)
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || process.env.APP_URL || '')
    .split(',')
    .map(o => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
);

app.use('/api', (req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (!origin) return next();
  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    return res.status(403).json({ error: 'Origin tidak valid' });
  }
  if (originHost === req.headers.host || allowedOrigins.has(origin)) return next();
  return res.status(403).json({ error: 'Origin tidak diizinkan' });
});

// Rate limit sederhana per IP (in-memory, cukup untuk satu instance server)
function rateLimit(maxPerMinute: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: () => void) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      if (hits.size > 10000) hits.clear();
      hits.set(ip, { count: 1, resetAt: now + 60_000 });
      return next();
    }
    if (++entry.count > maxPerMinute) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi sebentar.' });
    }
    return next();
  };
}

app.use('/api/generate', rateLimit(10));
app.use('/api/ai', rateLimit(20));
app.use('/api', rateLimit(60));

// Pesan error aman untuk klien; detail lengkap tetap dicatat di log server
function clientError(err: any, fallback: string) {
  return process.env.NODE_ENV === 'production' ? fallback : (err?.message || fallback);
}

// ID akun Meta/Threads selalu numerik; mencegah manipulasi path URL Graph API
function isValidAccountId(id: unknown): boolean {
  return typeof id === 'string' && /^\d{1,32}$/.test(id);
}

const ALLOWED_UPLOAD_TYPES = /^(image\/(jpeg|png|webp|gif)|video\/(mp4|quicktime|webm))$/;
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 500) * 1024 * 1024;

// Helper inisialisasi client Cloudflare R2
function getR2Client(config?: any) {
  const accountId = config?.accountId || process.env.R2_ACCOUNT_ID;
  const accessKeyId = config?.accessKeyId || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = config?.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Route: /api/generate
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { module: mod, brand, options, seedItems } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Server Gemini API key not configured' });
    }

    const systemPrompt = `Anda adalah Brand Strategist & Creative Director senior berbahasa Indonesia.
Rancang konsep rencana konten harian strategis multi-pilar yang inovatif dan terukur untuk brand "${brand?.name || 'Brand'}".
Brand: ${brand?.name} (${brand?.category || 'Bisnis'}). Produk: ${brand?.product}. USP: ${brand?.usp}. Tone: ${brand?.tone}. CTA: ${brand?.cta}.
Kebutuhan: Topik: ${options?.topic || 'Perkenalan & Solusi'}, Tujuan: ${options?.goal || 'Awareness'}.`;

    const userPrompt = `Buat ${seedItems?.length || 10} item konten terstruktur dalam format JSON dengan array "concepts".
Masing-masing konsep memiliki properti: pilar, hook, sudutKonten, briefVisual, caption, cta, tahapFunnel (tofu/mofu/bofu/ret).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            concepts: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  pilar: { type: 'STRING' },
                  hook: { type: 'STRING' },
                  sudutKonten: { type: 'STRING' },
                  briefVisual: { type: 'STRING' },
                  caption: { type: 'STRING' },
                  cta: { type: 'STRING' },
                  tahapFunnel: { type: 'STRING' }
                },
                required: ['pilar', 'hook', 'sudutKonten', 'briefVisual', 'caption', 'cta', 'tahapFunnel']
              }
            }
          },
          required: ['concepts']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const concepts = parsed.concepts || [];

    const items = (seedItems || []).map((it: any, idx: number) => {
      const c = concepts[idx % concepts.length] || {};
      const fields = { ...it.fields };
      if (c.pilar) fields.Pilar = c.pilar;
      if (c.hook) fields.Hook = c.hook;
      if (c.sudutKonten) fields['Sudut Konten'] = c.sudutKonten;
      if (c.briefVisual) fields['Brief Visual'] = c.briefVisual;
      if (c.caption) fields.Caption = `${c.caption}\n\n${c.cta || brand?.cta || ''}`;
      if (c.cta) fields.CTA = c.cta;
      return {
        ...it,
        title: `${fields.Platform || 'Konten'} · ${(c.hook || it.title).slice(0, 36)}...`,
        fields
      };
    });

    return res.json({ items });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return res.status(500).json({ error: clientError(error, 'Gagal memproses permintaan AI') });
  }
});

// Route: /api/ai/polish-caption
app.post('/api/ai/polish-caption', async (req: Request, res: Response) => {
  try {
    const { caption, brand, style } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Server Gemini API key not configured' });
    }

    const systemPrompt = `Anda adalah copywriter media sosial profesional. Sempurnakan caption agar memikat, rapi, bernas, dan mematuhi brand voice (${brand?.tone || 'Natural'}).
Gaya naskah: ${style || 'Storytelling & Relatable'}. CTA: ${brand?.cta || 'Tulis di komentar'}.`;

    const userPrompt = `Caption asli:\n"""\n${caption}\n"""\nBerikan 3 variasi: 1. Ringkas & Punchy, 2. Storytelling & Emosional, 3. Edukatif & Berbobot.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            variations: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  label: { type: 'STRING' },
                  caption: { type: 'STRING' },
                  hook: { type: 'STRING' }
                },
                required: ['label', 'caption', 'hook']
              }
            }
          },
          required: ['variations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ variations: parsed.variations || [] });
  } catch (error: any) {
    console.error('Error in /api/ai/polish-caption:', error);
    return res.status(500).json({ error: clientError(error, 'Gagal memproses permintaan AI') });
  }
});

// Route: /api/ai/hook-ideas
app.post('/api/ai/hook-ideas', async (req: Request, res: Response) => {
  try {
    const { topic, brand } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Server Gemini API key not configured' });
    }

    const systemPrompt = `Buat 5 variasi hook pembuka media sosial (3 detik pertama) yang memicu rasa penasaran tanpa clickbait murahan untuk brand "${brand?.name || 'Brand'}".
Topik: ${topic || 'Konten Brand'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: topic,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            hooks: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  category: { type: 'STRING' },
                  hookText: { type: 'STRING' },
                  explanation: { type: 'STRING' }
                },
                required: ['category', 'hookText']
              }
            }
          },
          required: ['hooks']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ hooks: parsed.hooks || [] });
  } catch (error: any) {
    console.error('Error in /api/ai/hook-ideas:', error);
    return res.status(500).json({ error: clientError(error, 'Gagal memproses permintaan AI') });
  }
});

// Route: /api/ai/extract-brand
app.post('/api/ai/extract-brand', async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Server Gemini API key not configured' });
    }

    const systemPrompt = `Anda adalah Chief Brand Strategist. Baca deskripsi produk/usaha, lalu rumuskan profil Brand Brain lengkap dalam bahasa Indonesia.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: rawText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            category: { type: 'STRING' },
            product: { type: 'STRING' },
            brandPromise: { type: 'STRING' },
            audience: { type: 'STRING' },
            usp: { type: 'STRING' },
            tone: { type: 'STRING' },
            cta: { type: 'STRING' },
            color: { type: 'STRING' },
            instagramHandle: { type: 'STRING' },
            analysisSummary: { type: 'STRING' }
          },
          required: ['name', 'category', 'product', 'audience', 'usp', 'tone', 'cta', 'color', 'analysisSummary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ brand: parsed, analysisSummary: parsed.analysisSummary });
  } catch (error: any) {
    console.error('Error in /api/ai/extract-brand:', error);
    return res.status(500).json({ error: clientError(error, 'Gagal memproses permintaan AI') });
  }
});

// Endpoint: Presigned Upload ke Cloudflare R2 (Free Tier)
app.post('/api/r2/presign', async (req: Request, res: Response) => {
  try {
    const { filename, contentType, sizeBytes, customConfig } = req.body;
    if (typeof contentType !== 'string' || !ALLOWED_UPLOAD_TYPES.test(contentType)) {
      return res.status(400).json({ error: 'Tipe file tidak didukung. Gunakan gambar (JPG/PNG/WebP/GIF) atau video (MP4/MOV/WebM).' });
    }
    if (!Number.isInteger(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_UPLOAD_BYTES) {
      return res.status(400).json({ error: `Ukuran file harus di bawah ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.` });
    }

    const r2 = getR2Client(customConfig);
    const bucket = customConfig?.bucketName || process.env.R2_BUCKET_NAME || 'ruang-konten-media';
    const publicBaseUrl = (customConfig?.publicUrl || process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

    const safeName = (filename || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `uploads/${Date.now()}-${safeName}`;

    if (!r2) {
      console.log(`[R2 Fallback] Kredensial R2 belum diset. Menghasilkan mock URL untuk pengujian.`);
      return res.json({
        uploadUrl: `/api/r2/mock-upload?key=${encodeURIComponent(r2Key)}`,
        publicUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`,
        r2Key,
        isMock: true
      });
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: r2Key,
      ContentType: contentType,
      ContentLength: sizeBytes
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 600,
      signableHeaders: new Set(['content-type', 'content-length'])
    });
    const publicUrl = publicBaseUrl ? `${publicBaseUrl}/${r2Key}` : uploadUrl.split('?')[0];

    return res.json({
      uploadUrl,
      publicUrl,
      r2Key,
      isMock: false
    });
  } catch (err: any) {
    console.error('Error in /api/r2/presign:', err);
    return res.status(500).json({ error: clientError(err, 'Gagal membuat URL upload R2') });
  }
});

app.put('/api/r2/mock-upload', (req: Request, res: Response) => {
  res.status(200).send('OK (Mock Uploaded)');
});

// Endpoint: Test Koneksi Akun 5 Platform
app.post('/api/social/test-connection', async (req: Request, res: Response) => {
  const { platform, connection } = req.body;
  const token = connection?.tokenSecret;
  const accountId = connection?.accountId;

  if (!token && connection?.authMethod === 'manual_token') {
    return res.json({
      success: false,
      message: `Token untuk ${platform} belum dimasukkan.`
    });
  }
  if (accountId && !isValidAccountId(accountId)) {
    return res.json({ success: false, message: 'Account ID hanya boleh berisi angka.' });
  }

  try {
    if (platform === 'facebook') {
      const metaRes = await fetch(`https://graph.facebook.com/v21.0/${accountId || 'me'}?fields=id,name,link`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await metaRes.json();
      if (data.error) throw new Error(data.error.message);

      return res.json({
        success: true,
        accountName: data.name || 'Facebook Page',
        accountHandle: `@${data.id}`,
        message: `Terhubung sukses ke Facebook Page: ${data.name}`
      });
    }

    if (platform === 'instagram') {
      const igRes = await fetch(`https://graph.facebook.com/v21.0/${accountId || 'me'}?fields=id,username,name`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await igRes.json();
      if (data.error) throw new Error(data.error.message);

      return res.json({
        success: true,
        accountName: data.name || data.username || 'Instagram Business',
        accountHandle: `@${data.username || data.id}`,
        message: `Terhubung sukses ke Instagram: @${data.username || data.id}`
      });
    }

    if (platform === 'threads') {
      const thRes = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,name&access_token=${encodeURIComponent(token || '')}`);
      const data = await thRes.json();
      if (data.error) throw new Error(data.error.message);

      return res.json({
        success: true,
        accountName: data.name || data.username || 'Threads User',
        accountHandle: `@${data.username}`,
        message: `Terhubung sukses ke Threads: @${data.username}`
      });
    }

    if (platform === 'youtube') {
      const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await ytRes.json();
      if (data.error) throw new Error(data.error.message);

      const ch = data.items?.[0]?.snippet;
      return res.json({
        success: true,
        accountName: ch?.title || 'YouTube Channel',
        accountHandle: ch?.customUrl || '@channel',
        message: `Terhubung sukses ke YouTube Channel: ${ch?.title}`
      });
    }

    if (platform === 'tiktok') {
      const ttRes = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await ttRes.json();
      if (data.error?.code && data.error.code !== 'ok') throw new Error(data.error.message || 'Token TikTok tidak valid');

      const user = data.data?.user;
      return res.json({
        success: true,
        accountName: user?.display_name || 'TikTok Creator',
        accountHandle: `@${user?.display_name || 'tiktok_user'}`,
        message: `Terhubung sukses ke TikTok: ${user?.display_name}`
      });
    }

    return res.json({ success: true, message: `Koneksi ${platform} terverifikasi.` });
  } catch (err: any) {
    return res.json({
      success: false,
      message: `Gagal verifikasi: ${err.message}`
    });
  }
});

// Endpoint: Eksekusi Publikasi (Hybrid: Native Schedule / Inbox Draft / Direct / Container)
app.post('/api/social/publish', async (req: Request, res: Response) => {
  const { post, connections } = req.body;
  if (!post || !post.targetPlatforms?.length) {
    return res.status(400).json({ error: 'Target platform belum dipilih' });
  }

  const results: Record<string, any> = {};

  for (const pf of post.targetPlatforms) {
    const conn = connections?.[pf];
    const token = conn?.tokenSecret;
    const mediaUrl = post.media?.[0]?.url;
    const caption = post.platformOverrides?.[pf]?.customCaption || post.masterCaption;
    const scheduledUnix = Math.floor(new Date(post.scheduledAtIso).getTime() / 1000);

    try {
      if (pf === 'facebook') {
        if (!token) {
          throw new Error('Token Facebook belum dihubungkan. Konten tidak dijadwalkan.');
        } else {
          if (conn.accountId && !isValidAccountId(conn.accountId)) {
            throw new Error('Account ID Facebook tidak valid.');
          }
          if (!Number.isFinite(scheduledUnix)) {
            throw new Error('Waktu jadwal tidak valid.');
          }
          const endpoint = mediaUrl
            ? `https://graph.facebook.com/v21.0/${conn.accountId || 'me'}/photos`
            : `https://graph.facebook.com/v21.0/${conn.accountId || 'me'}/feed`;

          const bodyParams: any = {
            access_token: token,
            message: caption,
            published: false,
            scheduled_publish_time: scheduledUnix
          };
          if (mediaUrl) bodyParams.url = mediaUrl;

          const fbRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyParams)
          });
          const fbData = await fbRes.json();
          if (fbData.error) throw new Error(fbData.error.message);

          results.facebook = {
            status: 'native_scheduled',
            externalPostId: fbData.id,
            externalPostUrl: `https://facebook.com/${fbData.id}`,
            message: 'Berhasil didaftarkan ke Jadwal Halaman Facebook'
          };
        }
      } else {
        // Integrasi YouTube, TikTok, Instagram & Threads belum diimplementasikan: laporkan apa adanya, jangan pura-pura sukses
        throw new Error(`Publikasi otomatis ke ${pf} belum didukung. Unggah manual lewat aplikasi ${pf}.`);
      }
    } catch (err: any) {
      results[pf] = {
        status: 'failed',
        errorMessage: err.message || 'Gagal memproses ke platform'
      };
    }
  }

  res.json({ success: true, results });
});

// Health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasServerKey: Boolean(ai), hasR2: Boolean(getR2Client()) });
});

// Server listener & Vite mounting
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
// Dev hanya bisa diakses dari komputer ini; set HOST=0.0.0.0 bila memang perlu diakses dari jaringan
const HOST = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1');

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Ruang Konten server running at http://localhost:${PORT}`);
  });
}

startServer();
