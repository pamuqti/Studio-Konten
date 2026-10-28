import { ScheduledPost, SocialPlatformKey, PlatformConnection, CloudflareR2Config } from '../types';

export async function uploadMediaToR2(
  file: File,
  r2Config?: CloudflareR2Config
): Promise<{ url: string; r2Key: string; sizeBytes: number; mimeType: string }> {
  // 1. Minta Presigned URL dari backend
  const res = await fetch('/api/r2/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      customConfig: r2Config
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal membuat URL upload R2' }));
    throw new Error(err.error || 'Gagal terhubung ke Cloudflare R2');
  }

  const { uploadUrl, publicUrl, r2Key } = await res.json();

  // 2. Upload file langsung dari browser ke Cloudflare R2
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload ke Cloudflare R2 gagal (Status ${uploadRes.status})`);
  }

  return {
    url: publicUrl,
    r2Key,
    sizeBytes: file.size,
    mimeType: file.type
  };
}

export async function executePublishPost(
  post: ScheduledPost,
  connections: Record<SocialPlatformKey, PlatformConnection>
): Promise<{ success: boolean; results: Record<string, any> }> {
  const res = await fetch('/api/social/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post,
      connections
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal mengeksekusi publikasi sosial media');
  }

  return data;
}

export async function testPlatformConnection(
  platform: SocialPlatformKey,
  connection: Partial<PlatformConnection>
): Promise<{ success: boolean; accountName?: string; accountHandle?: string; message: string }> {
  const res = await fetch('/api/social/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform,
      connection
    })
  });

  return await res.json();
}
