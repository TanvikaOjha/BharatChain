'use client';
 
import Link from 'next/link';
import { formatEther } from 'viem';
import { AssetSummary } from '../hooks/useAssets';
import { useActiveConsumerCount } from '../hooks/useAccessStatus';
import { truncateAddress } from '../lib/identities';
 
export function AssetCard({ asset }: { asset: AssetSummary }) {
  const { count, loading } = useActiveConsumerCount(asset.assetId);
 
  return (
    <Link
      href={`/asset/${asset.assetId}`}
      className="card"
      style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          height: 120,
          borderRadius: '0.5rem',
          background: 'var(--bg)',
          border: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        Asset #{asset.assetId}
      </div>
 
      <h4 style={{ margin: '0 0 0.25rem' }}>Dataset #{asset.assetId}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        by {asset.creatorProfile?.label ?? truncateAddress(asset.creator)}
      </p>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.9rem' }}>
        <span>{formatEther(asset.price)} ETH</span>
        <span style={{ color: 'var(--text-muted)' }}>{loading ? '…' : `${count} active`}</span>
      </div>
    </Link>
  );
}