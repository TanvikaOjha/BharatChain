/**
 * Browser-side helper for pinning an already-encrypted blob to IPFS.
 * The actual Pinata JWT lives server-side in /api/pinata/upload — the
 * browser bundle never sees it.
 */
export async function uploadEncryptedBlob(blob: Blob, filename = 'asset.enc'): Promise<string> {
  const form = new FormData();
  form.append('file', blob, filename);

  const res = await fetch('/api/pinata/upload', { method: 'POST', body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Pinata upload failed (${res.status})`);
  }

  const { cid } = await res.json();
  return cid as string;
}