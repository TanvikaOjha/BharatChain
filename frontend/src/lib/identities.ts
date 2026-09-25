export type IdentityRole = 'creator' | 'agent' | 'admin' | 'unknown';
 
export interface IdentityProfile {
  address: string;
  role: IdentityRole;
  label: string;
  did?: string;
  avatarUrl?: string;
  bio?: string;
}
 
const cache = new Map<string, IdentityProfile>();
 
export async function resolveIdentity(address: string): Promise<IdentityProfile> {
  const key = address.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
 
  try {
    const res = await fetch(`/api/identities/${key}`);
    if (res.ok) {
      const profile: IdentityProfile = await res.json();
      cache.set(key, profile);
      return profile;
    }
  } catch {
    // fall through to the default below on network/API failure
  }
 
  const fallback: IdentityProfile = {
    address,
    role: 'unknown',
    label: truncateAddress(address),
  };
  cache.set(key, fallback);
  return fallback;
}
 
export async function resolveIdentities(addresses: string[]): Promise<Record<string, IdentityProfile>> {
  const unique = Array.from(new Set(addresses.map((a) => a.toLowerCase())));
  const results = await Promise.all(unique.map(resolveIdentity));
  return Object.fromEntries(results.map((p) => [p.address.toLowerCase(), p]));
}
 
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}