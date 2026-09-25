'use client';

import Link from 'next/link';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useRef } from 'react';
import { contractConfig } from '../lib/contract';
import { AssetSummary } from '../hooks/useAssets';
import { useHasActiveAccess } from '../hooks/useAccessStatus';
import { useTransactionToast, humanizeError } from './TransactionStatusToast';

export function ActionButton({ asset }: { asset: AssetSummary }) {
  const { address } = useAccount();
  const { hasAccess, expiresAt, loading, refresh } = useHasActiveAccess(asset.assetId, address);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { push, update } = useTransactionToast();
  const toastIdRef = useRef<string | null>(null);

  const isOwner = address?.toLowerCase() === asset.creator.toLowerCase();

  function handleRequestAccess() {
    toastIdRef.current = push(`Requesting access to Asset #${asset.assetId}`);
    writeContract({
      ...contractConfig,
      functionName: 'requestAccess',
      args: [BigInt(asset.assetId)],
      value: asset.price,
    });
  }

  useEffect(() => {
    if (!toastIdRef.current) return;
    if (isPending) update(toastIdRef.current, { status: 'signing' });
  }, [isPending, update]);

  useEffect(() => {
    if (!toastIdRef.current || !hash) return;
    update(toastIdRef.current, { status: 'pending', hash });
  }, [hash, update]);

  useEffect(() => {
    if (!toastIdRef.current) return;
    if (isSuccess) {
      update(toastIdRef.current, { status: 'confirmed' });
      refresh();
      toastIdRef.current = null;
    }
  }, [isSuccess, update, refresh]);

  useEffect(() => {
    if (!toastIdRef.current || !error) return;
    update(toastIdRef.current, { status: 'failed', errorMessage: error.message });
    toastIdRef.current = null;
  }, [error, update]);

  if (!address) {
    return <button disabled>Connect wallet to continue</button>;
  }

  if (isOwner) {
    return (
      <Link href={`/creator-studio?asset=${asset.assetId}`}>
        <button>Manage this asset</button>
      </Link>
    );
  }

  if (loading) return <button disabled>Checking access…</button>;

  if (hasAccess && expiresAt) {
    return <button disabled>Active — expires {new Date(expiresAt).toLocaleTimeString()}</button>;
  }

  return (
    <button onClick={handleRequestAccess} disabled={isPending || isConfirming}>
      {isPending ? 'Confirm in wallet…' : isConfirming ? 'Confirming…' : `Request Access — ${formatPrice(asset.price)}`}
    </button>
  );
}

function formatPrice(wei: bigint): string {
  return `${Number(wei) / 1e18} ETH`;
}