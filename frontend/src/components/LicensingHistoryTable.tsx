'use client';

import { useContractEvents } from '../hooks/useContractEvents';
import { truncateAddress } from '../lib/identities';

export function LicensingHistoryTable({ assetId }: { assetId: number }) {
  const { events, loading } = useContractEvents({ assetId, events: ['AccessGranted', 'AccessRevoked'] });

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Licensing History</h3>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}
      {!loading && events.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No licensing activity for this asset yet.</p>}

      {!loading && events.length > 0 && (
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.4rem 0' }}>Event</th>
              <th>Consumer</th>
              <th>Expires / Revoked</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.transactionHash + e.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.4rem 0' }}>{e.name === 'AccessGranted' ? '✅ Granted' : '🚫 Revoked'}</td>
                <td>{truncateAddress(String(e.args.consumer))}</td>
                <td>
                  {e.name === 'AccessGranted' && e.args.expiresAt
                    ? new Date(Number(e.args.expiresAt) * 1000).toLocaleString()
                    : '—'}
                </td>
                <td>
                  <a href={`https://sepolia.etherscan.io/tx/${e.transactionHash}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}