import { createDecipheriv } from "node:crypto";

// Convention (must match the Phase 4 upload/encrypt step):
// ciphertext blob = 12-byte IV || 16-byte GCM auth tag || actual ciphertext
// symmetric key returned by the key manager is a 32-byte AES-256 key, hex-encoded.
export function decrypt(ciphertextBuffer, keyHex) {
  const key = Buffer.from(keyHex, "hex");
  const iv = ciphertextBuffer.subarray(0, 12);
  const authTag = ciphertextBuffer.subarray(12, 28);
  const data = ciphertextBuffer.subarray(28);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}