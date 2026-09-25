/**
 * Client-side AES-256-GCM encryption for asset uploads (Phase 4).
 * Runs entirely in the browser via SubtleCrypto — the plaintext file and
 * the symmetric key never touch our servers unencrypted.
 */

const ALGO = 'AES-GCM';
const IV_LENGTH_BYTES = 12; // 96-bit IV, the size AES-GCM is designed for

export interface EncryptedPayload {
  /** IV (12 bytes) followed by the AES-GCM ciphertext — pin this blob to IPFS as-is. */
  blob: Blob;
  /** Raw symmetric key, base64-encoded — hand this to the key manager, never to IPFS. */
  keyBase64: string;
}

export async function generateAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: ALGO, length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function exportKeyBase64(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(raw);
}

export async function importKeyBase64(keyBase64: string): Promise<CryptoKey> {
  const raw = base64ToArrayBuffer(keyBase64);
  return crypto.subtle.importKey('raw', raw, ALGO, false, ['decrypt']);
}

/** Encrypts a File/Blob and returns ciphertext + the key used, so the caller can pin one and register the other. */
export async function encryptFile(file: File | Blob): Promise<EncryptedPayload> {
  const key = await generateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
  const plaintext = await file.arrayBuffer();

  const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plaintext);

  // Prepend the IV so decryptToArrayBuffer can recover it without a side-channel.
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  return {
    blob: new Blob([combined], { type: 'application/octet-stream' }),
    keyBase64: await exportKeyBase64(key),
  };
}

/**
 * Reverses encryptFile: pass the raw ciphertext bytes fetched from the IPFS
 * gateway and the key released by the key manager (post-access-check).
 */
export async function decryptToArrayBuffer(ciphertext: ArrayBuffer, keyBase64: string): Promise<ArrayBuffer> {
  const key = await importKeyBase64(keyBase64);
  const bytes = new Uint8Array(ciphertext);
  const iv = bytes.slice(0, IV_LENGTH_BYTES);
  const data = bytes.slice(IV_LENGTH_BYTES);
  return crypto.subtle.decrypt({ name: ALGO, iv }, key, data);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}