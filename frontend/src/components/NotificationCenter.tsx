'use client';
 
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useContractEvents } from '../hooks/useContractEvents';
 
function describe(eventName: string, args: Record<string, unknown>): string {
  switch (eventName) {
    case 'AccessGranted':
      return `Access granted to Asset #${args.assetId} — active until ${new Date(Number(args.expiresAt) * 1000).toLocaleString()}`;
    case 'AccessRevoked':
      return `Access to Asset #${args.assetId} was revoked`;
    case 'IPMinted':
      return `You minted Asset #${args.assetId}`;
    case 'Withdrawn':
      return `Withdrew ${args.amount} wei`;
    default:
      return eventName;
  }
}
 
export function NotificationCenter() {
  const { address } = useAccount();
  const { events, loading } = useContractEvents();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
 
  const personal = useMemo(() => {
    if (!address) return [];
    const lower = address.toLowerCase();
    return events.filter((e) => {
      const consumer = (e.args.consumer as string | undefined)?.toLowerCase();
      const creator = (e.args.creator as string | undefined)?.toLowerCase();
      return consumer === lower || creator === lower;
    });
  }, [events, address]);
 
  const unreadCount = personal.filter((e) => !readIds.has(e.transactionHash)).length;
 
  function markAllRead() {
    setReadIds(new Set(personal.map((e) => e.transactionHash)));
  }
 
  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-label="Notifications"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
      >
        🔔{unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
 
      {open && (
        <div className="card" style={{ position: 'absolute', right: 0, top: '2.5rem', width: 320, maxHeight: 360, overflowY: 'auto', zIndex: 20 }}>
          {loading && <p style={{ padding: '0.75rem' }}>Loading…</p>}
          {!loading && personal.length === 0 && <p style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>No notifications yet.</p>}
          {personal.map((e) => (
            <div key={e.transactionHash} style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
              {describe(e.name, e.args)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}