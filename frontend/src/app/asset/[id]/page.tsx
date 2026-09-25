'use client';

import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useAsset } from '../../../hooks/useAssets';
import { ActionButton } from '../../../components/AcionButton';
import { ActiveConsumersBadge, MyAccessStatusBadge } from '../../../components/ActiveConsumersBadge';
import { LicensingHistoryTable } from '../../../components/LicensingHistoryTable';
import { EventFeed } from '../../../components/EventFeed';
import { truncateAddress } from '../../../lib/identities';

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>();
  const assetId = Number(params.id);
  const { asset, loading, error, refresh } = useAsset(assetId);

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading asset…</p>;
  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!asset) return <p>Asset #{assetId} not found.</p>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: '0 0 0.25rem' }}>Dataset #{asset.assetId}</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                by {asset.creatorProfile?.label ?? truncateAddress(asset.creator)}
              </p>
            </div>
            <ActiveConsumersBadge assetId={asset.assetId} />
          </div>

          <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '0.5rem', marginTop: '1.25rem', fontSize: '0.9rem' }}>
            <dt style={{ color: 'var(--text-muted)' }}>IPFS CID</dt>
            <dd style={{ margin: 0 }}>
              <a href={`https://gateway.pinata.cloud/ipfs/${asset.cid}`} target="_blank" rel="noreferrer">
                {asset.cid}
              </a>{' '}
              <span style={{ color: 'var(--text-muted)' }}>(encrypted — link shows raw ciphertext)</span>
            </dd>

            <dt style={{ color: 'var(--text-muted)' }}>Price</dt>
            <dd style={{ margin: 0 }}>{formatEther(asset.price)} ETH per access window</dd>

            <dt style={{ color: 'var(--text-muted)' }}>Access window</dt>
            <dd style={{ margin: 0 }}>{formatDuration(Number(asset.accessWindow))}</dd>

            <dt style={{ color: 'var(--text-muted)' }}>Creator</dt>
            <dd style={{ margin: 0 }}>
              <a href={`https://sepolia.etherscan.io/address/${asset.creator}`} target="_blank" rel="noreferrer">
                {asset.creator}
              </a>
            </dd>

            <dt style={{ color: 'var(--text-muted)' }}>Your status</dt>
            <dd style={{ margin: 0 }}>
              <MyAccessStatusBadge assetId={asset.assetId} />
            </dd>
          </dl>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0 }}>Get Access</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Payment goes directly to the creator's on-chain balance. Access is time-boxed and
            independently verifiable via <code>hasActiveAccess</code>.
          </p>
          <ActionButton asset={asset} />
          <button onClick={refresh} style={{ fontSize: '0.8rem' }}>
            Refresh status
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <LicensingHistoryTable assetId={asset.assetId} />
        <EventFeed assetId={asset.assetId} title={`Activity for Asset #${asset.assetId}`} />
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)} days`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} hours`;
  return `${seconds} seconds`;
}