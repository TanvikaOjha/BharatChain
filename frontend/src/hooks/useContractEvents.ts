'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { getReadContract } from '../lib/contract';
 
export type ContractEventName = 'IPMinted' | 'AccessGranted' | 'AccessRevoked' | 'Withdrawn' | 'PriceUpdated';
 
export interface ContractEvent {
  name: ContractEventName;
  args: Record<string, unknown>;
  blockNumber: number;
  transactionHash: string;
  timestamp: number; // resolved from the block, or Date.now() as a fallback while pending
}
 
interface Options {
  events?: ContractEventName[];
  assetId?: number; // scope to a single asset's history
  pollIntervalMs?: number;
  lookbackBlocks?: number;
}
 
export function useContractEvents(options: Options = {}) {
  const { events = ['IPMinted', 'AccessGranted', 'AccessRevoked', 'Withdrawn', 'PriceUpdated'], assetId, pollIntervalMs = 6000, lookbackBlocks = 5000 } = options;
 
  const [log, setLog] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(true);
 
  const fetchEvents = useCallback(async () => {
    const contract = getReadContract();
    const provider = contract.runner as unknown as { getBlockNumber(): Promise<number> };
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlock - lookbackBlocks);
 
    const results = await Promise.all(
      events.map(async (eventName) => {
        const filter = contract.filters[eventName]?.();
        if (!filter) return [];
        const rawEvents = await contract.queryFilter(filter, fromBlock, latestBlock);
        return rawEvents
          .filter((e) => (assetId === undefined ? true : Number((e as any).args?.assetId) === assetId))
          .map((e) => ({
            name: eventName,
            args: Object.fromEntries(Object.entries((e as any).args ?? {}).filter(([k]) => Number.isNaN(Number(k)))),
            blockNumber: e.blockNumber,
            transactionHash: e.transactionHash,
            timestamp: Date.now(), // swap for a real block-timestamp lookup if you need exact ordering
          }));
      })
    );
 
    const flattened = results.flat().sort((a, b) => b.blockNumber - a.blockNumber);
    setLog(flattened);
    setLoading(false);
  }, [events, assetId, lookbackBlocks]);
 
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchEvents, pollIntervalMs]);
 
  return { events: log, loading, refresh: fetchEvents };
}
 