const KEY_MANAGER_URL = process.env.NEXT_PUBLIC_KEY_MANAGER_URL as string;

/**
 * Registers a freshly minted asset's symmetric key with the key manager.
 * Routed through our own /api/keymanager/register so the shared admin
 * secret never reaches the browser bundle.
 */
export async function registerAssetKey(assetId: number, keyBase64: string): Promise<void> {
  const res = await fetch('/api/keymanager/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId, keyBase64 }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to register key (${res.status})`);
  }
}

/**
 * Asks the key manager for the decryption key. The key manager itself
 * checks hasActiveAccess(assetId, agent) on-chain before releasing anything,
 * so this call is safe to make directly from the browser — no secret needed.
 */
export async function fetchAssetKey(assetId: number, agentAddress: string): Promise<string> {
  const url = `${KEY_MANAGER_URL}/key/${assetId}?agent=${agentAddress}`;
  const res = await fetch(url);

  if (res.status === 403) {
    throw new Error('Access denied — no active CONSUMER_ROLE / expired.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to fetch key (${res.status})`);
  }

  const { keyBase64 } = await res.json();
  return keyBase64 as string;
}