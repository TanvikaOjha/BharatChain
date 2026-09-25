'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { getReadContract } from '../lib/contract';
import { useContractEvents } from './useContractEvents';
 
/** Polls hasActiveAccess(assetId, address) for the given address. */
export function useHasActiveAccess(assetId: number, address?: string, pollIntervalMs = 5000) {
  const [hasAccess, setHasAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
 
  const check = useCallback(async () => {
    if (!address) {
      setHasAccess(false);
      setLoading(false);
      return;
    }
    const contract = getReadContract();
    const [active, expiry] = await Promise.all([
      contract.hasActiveAccess(assetId, address),
      contract.consumerExpiry(assetId, address),
    ]);
    setHasAccess(active);
    setExpiresAt(Number(expiry) * 1000);
    setLoading(false);
  }, [assetId, address]);
 
  useEffect(() => {
    check();
    const interval = setInterval(check, pollIntervalMs);
    return () => clearInterval(interval);
  }, [check, pollIntervalMs]);
 
  return { hasAccess, expiresAt, loading, refresh: check };
}
 
/** Counts distinct consumers with a currently-unexpired grant, derived from AccessGranted events. */
export function useActiveConsumerCount(assetId: number) {
  const { events, loading } = useContractEvents({ assetId, events: ['AccessGranted'] });
  const [count, setCount] = useState(0);
 
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      const contract = getReadContract();
      const consumers = Array.from(new Set(events.map((e) => String(e.args.consumer))));
      const statuses = await Promise.all(consumers.map((c) => contract.hasActiveAccess(assetId, c)));
      if (!cancelled) setCount(statuses.filter(Boolean).length);
    })();
    return () => {
      cancelled = true;
    };
  }, [events, loading, assetId]);
 
  return { count, loading };
}