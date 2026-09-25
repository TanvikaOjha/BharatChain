'use client';

import { useCallback, useState } from 'react';
import { encryptFile } from '../lib/encryption';
import { uploadEncryptedBlob } from '../lib/pinata';
import { registerAssetKey } from '../lib/keymanager';

export type UploadStage = 'idle' | 'encrypting' | 'uploading' | 'done' | 'error';

export interface EncryptedUpload {
  cid: string;
  keyBase64: string;
}

/**
 * Phase 4 upload flow for Creator Studio:
 *   1. encryptAndUpload(file) — encrypts client-side, pins ciphertext to
 *      IPFS, returns { cid, keyBase64 }. Pass `cid` straight into mintIP().
 *   2. Once the mintIP transaction confirms and you have the resulting
 *      assetId, call registerKey(assetId, keyBase64) to hand the key to the
 *      key manager (never before the asset exists on-chain).
 */
export function useUploadAsset() {
  const [stage, setStage] = useState<UploadStage>('idle');
  const [error, setError] = useState<string | null>(null);

  const encryptAndUpload = useCallback(async (file: File): Promise<EncryptedUpload> => {
    setError(null);
    try {
      setStage('encrypting');
      const { blob, keyBase64 } = await encryptFile(file);

      setStage('uploading');
      const cid = await uploadEncryptedBlob(blob, `${file.name}.enc`);

      setStage('done');
      return { cid, keyBase64 };
    } catch (err) {
      setStage('error');
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    }
  }, []);

  const registerKey = useCallback(async (assetId: number, keyBase64: string) => {
    await registerAssetKey(assetId, keyBase64);
  }, []);

  return { stage, error, encryptAndUpload, registerKey };
}