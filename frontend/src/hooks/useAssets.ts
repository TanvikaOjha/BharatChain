'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { getReadContract } from '../lib/contract';
import { resolveIdentities, IdentityProfile } from '../lib/identities';
 
export interface AssetSummary {
  assetId: number;
  cid: string;
  creator: string;
  creatorProfile?: IdentityProfile;
  price: bigint;
  accessWindow: bigint;
  mintedAtBlock: number;
}
 
export function useAssets() {
  const [assets, setAssets] = useState<AssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const contract = getReadContract();
      const filter = contract.filters.IPMinted();
      const mintEvents = await contract.queryFilter(filter, 0, 'latest');
 
      const base = await Promise.all(
        mintEvents.map(async (e: any) => {
          const assetId = Number(e.args.assetId);
          const [price, accessWindow] = await Promise.all([
            contract.priceOf(assetId),
            contract.accessWindowOf(assetId),
          ]);
          return {
            assetId,
            cid: e.args.cid as string,
            creator: e.args.creator as string,
            price,
            accessWindow,
            mintedAtBlock: e.blockNumber,
          } as AssetSummary;
        })
      );
 
      const profiles = await resolveIdentities(base.map((a) => a.creator));
      const hydrated = base.map((a) => ({ ...a, creatorProfile: profiles[a.creator.toLowerCase()] }));
 
      setAssets(hydrated.sort((a, b) => b.mintedAtBlock - a.mintedAtBlock));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets.');
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);
 
  return { assets, loading, error, refresh: fetchAssets };
}
 
/** Single-asset variant for the Asset Detail page. */
export function useAsset(assetId: number) {
  const { assets, loading, error, refresh } = useAssets();
  const asset = assets.find((a) => a.assetId === assetId) ?? null;
  return { asset, loading, error, refresh };
}