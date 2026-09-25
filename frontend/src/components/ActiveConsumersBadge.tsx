'use client';

import { useAccount } from 'wagmi';
import { useHasActiveAccess, useActiveConsumerCount } from '../hooks/useAccessStatus';

/** "Active now" count badge for an asset card / detail header. */
export function ActiveConsumersBadge({ assetId }: { assetId: number }) {
  const { count, loading } = useActiveConsumerCount(assetId);
  return (
    <span className="badge" title="Consumers with a currently active grant">
      {loading ? '…' : `${count} active now`}
    </span>
  );
}

/** Personal status badge: "No access" / "Active until …" / "Expired" for the connected wallet. */
export function MyAccessStatusBadge({ assetId }: { assetId: number }) {
  const { address } = useAccount();
  const { hasAccess, expiresAt, loading } = useHasActiveAccess(assetId, address);

  if (!address) return null;
  if (loading) return <span style={{ color: 'var(--text-muted)' }}>Checking access…</span>;

  if (hasAccess && expiresAt) {
    return (
      <span style={{ color: 'var(--success)' }}>
        ✅ Active until {new Date(expiresAt).toLocaleString()}
      </span>
    );
  }

  if (expiresAt && expiresAt < Date.now()) {
    return <span style={{ color: 'var(--text-muted)' }}>⏱️ Expired — request access again</span>;
  }

  return <span style={{ color: 'var(--text-muted)' }}>No access</span>;
}