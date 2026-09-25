'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type TxStatus = 'signing' | 'pending' | 'confirmed' | 'failed';

interface TxToast {
  id: string;
  label: string;
  status: TxStatus;
  hash?: string;
  errorMessage?: string;
}

interface TxContextValue {
  push: (label: string) => string; // returns toast id, starts in "signing"
  update: (id: string, patch: Partial<TxToast>) => void;
}

const TxContext = createContext<TxContextValue | null>(null);

export function useTransactionToast() {
  const ctx = useContext(TxContext);
  if (!ctx) throw new Error('useTransactionToast must be used within TransactionStatusToast');
  return ctx;
}

const HUMAN_ERRORS: Record<string, string> = {
  InsufficientPayment: 'You sent less ETH than the listed price.',
  NotAssetCreator: 'Only the asset creator can do that.',
  AssetDoesNotExist: 'That asset ID does not exist.',
  NothingToWithdraw: 'There are no funds to withdraw yet.',
  ACTION_REJECTED: 'Transaction was rejected in your wallet.',
};

export function humanizeError(raw: string): string {
  for (const [key, message] of Object.entries(HUMAN_ERRORS)) {
    if (raw.includes(key)) return message;
  }
  return 'Something went wrong. Check your wallet and network, then try again.';
}

export function TransactionStatusToast({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<TxToast[]>([]);

  const push = useCallback((label: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, label, status: 'signing' }]);
    return id;
  }, []);

  const update = useCallback((id: string, patch: Partial<TxToast>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (patch.status === 'confirmed' || patch.status === 'failed') {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000);
    }
  }, []);

  return (
    <TxContext.Provider value={{ push, update }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 50 }}>
        {toasts.map((t) => (
          <div key={t.id} className="card" style={{ padding: '0.75rem 1rem', minWidth: 260, borderLeft: `4px solid ${statusColor(t.status)}` }}>
            <strong>{t.label}</strong>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t.status === 'signing' && 'Waiting for signature…'}
              {t.status === 'pending' && 'Transaction pending…'}
              {t.status === 'confirmed' && 'Confirmed ✅'}
              {t.status === 'failed' && (t.errorMessage ? humanizeError(t.errorMessage) : 'Failed ❌')}
            </div>
            {t.hash && (
              <a href={`https://sepolia.etherscan.io/tx/${t.hash}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
                View on Etherscan
              </a>
            )}
          </div>
        ))}
      </div>
    </TxContext.Provider>
  );
}

function statusColor(status: TxStatus): string {
  switch (status) {
    case 'confirmed':
      return 'var(--success)';
    case 'failed':
      return 'var(--danger)';
    default:
      return 'var(--accent)';
  }
}