'use client';

import { useCallback, useEffect, useState } from 'react';
import { getIdentityReadContract, ROLE_LABELS, STATUS_LABELS } from '../lib/identityRegistry';

export interface OnChainIdentity {
  wallet: string;
  did: string;
  role: string; // bytes32 role hash
  roleLabel: string;
  status: number; // 0 Unregistered, 1 Active, 2 Suspended, 3 Revoked
  statusLabel: (typeof STATUS_LABELS)[number];
  registeredAt: number; // ms since epoch
  lastActivityAt: number; // ms since epoch
  /** 1-based order of registration — used to render a stable "DID-0001" style id. */
  sequence: number;
}

/**
 * Reads every registered identity directly from the IdentityRegistry contract:
 * the list of wallets comes from `IdentityRegistered` events, and each
 * wallet's current did/role/status/timestamps come from `getIdentity`
 * (a live read, so suspensions/revocations/role changes show up immediately
 * on refresh — no off-chain mock data involved).
 */
export function useIdentities() {
  const [identities, setIdentities] = useState<OnChainIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdentities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const contract = getIdentityReadContract();

      const filter = contract.filters.IdentityRegistered();
      const events = await contract.queryFilter(filter, 0, 'latest');

      // De-dupe in case of re-registration attempts / multiple events per wallet.
      const wallets = Array.from(new Set(events.map((e: any) => String(e.args.wallet))));

      const results = await Promise.all(
        wallets.map(async (wallet, i) => {
          const identity = await contract.getIdentity(wallet);
          const roleHash = String(identity.role);
          const statusIndex = Number(identity.status);

          return {
            wallet,
            did: String(identity.did),
            role: roleHash,
            roleLabel: ROLE_LABELS[roleHash] ?? 'Unknown',
            status: statusIndex,
            statusLabel: STATUS_LABELS[statusIndex] ?? 'Unregistered',
            registeredAt: Number(identity.registeredAt) * 1000,
            lastActivityAt: Number(identity.lastActivityAt) * 1000,
            sequence: i + 1,
          } as OnChainIdentity;
        })
      );

      setIdentities(results.sort((a, b) => a.registeredAt - b.registeredAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load identities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdentities();
  }, [fetchIdentities]);

  return { identities, loading, error, refresh: fetchIdentities };
}

/** Single-identity lookup by wallet, built on top of useIdentities(). */
export function useIdentity(wallet?: string) {
  const { identities, loading, error, refresh } = useIdentities();
  const identity = wallet
    ? identities.find((i) => i.wallet.toLowerCase() === wallet.toLowerCase()) ?? null
    : null;
  return { identity, loading, error, refresh };
}