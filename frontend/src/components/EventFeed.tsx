'use client';

import { useContractEvents, ContractEventName } from '../hooks/useContractEvents';
import { truncateAddress } from '../lib/identities';

interface Props {
  assetId?: number;
  events?: ContractEventName[];
  title?: string;
  maxItems?: number;
}

function timeAgo(ts: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function summarize(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case 'IPMinted':
      return `Asset #${args.assetId} minted by ${truncateAddress(String(args.creator))}`;
    case 'AccessGranted':
      return `${truncateAddress(String(args.consumer))} granted access to Asset #${args.assetId}`;
    case 'AccessRevoked':
      return `${truncateAddress(String(args.consumer))}'s access to Asset #${args.assetId} was revoked`;
    case 'Withdrawn':
      return `${truncateAddress(String(args.creator))} withdrew funds`;
    case 'PriceUpdated':
      return `Asset #${args.assetId} price updated`;
    default:
      return name;
  }
}

export function EventFeed({ assetId, events: eventFilter, title = 'On-Chain Activity', maxItems = 20 }: Props) {
  const { events, loading, refresh } = useContractEvents({ assetId, events: eventFilter });

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={refresh} title="Refresh">
          ↻
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading on-chain activity…</p>}
      {!loading && events.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No activity yet.</p>}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {events.slice(0, maxItems).map((e) => (
          <li key={e.transactionHash + e.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
            <span>{summarize(e.name, e.args)}</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${e.transactionHash}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '0.75rem' }}
            >
              {timeAgo(e.timestamp)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}