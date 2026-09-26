'use client';

import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { identityRegistryConfig } from '../lib/identityRegistry';

/**
 * Thin wrapper around the IdentityRegistry's state-changing functions.
 * Each call returns the transaction hash; `isConfirming`/`isSuccess` track
 * the most recently submitted transaction so callers can refresh their
 * identity list once it lands.
 */
export function useIdentityActions() {
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerSelf = useCallback(
    (did: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'registerSelf',
        args: [did],
      }),
    [writeContractAsync]
  );

  const registerIdentity = useCallback(
    (wallet: string, did: string, role: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'registerIdentity',
        args: [wallet, did, role],
      }),
    [writeContractAsync]
  );

  const suspendIdentity = useCallback(
    (wallet: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'suspendIdentity',
        args: [wallet],
      }),
    [writeContractAsync]
  );

  const activateIdentity = useCallback(
    (wallet: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'activateIdentity',
        args: [wallet],
      }),
    [writeContractAsync]
  );

  const revokeIdentity = useCallback(
    (wallet: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'revokeIdentity',
        args: [wallet],
      }),
    [writeContractAsync]
  );

  const changeRole = useCallback(
    (wallet: string, newRole: string) =>
      writeContractAsync({
        ...identityRegistryConfig,
        functionName: 'changeRole',
        args: [wallet, newRole],
      }),
    [writeContractAsync]
  );

  return {
    registerSelf,
    registerIdentity,
    suspendIdentity,
    activateIdentity,
    revokeIdentity,
    changeRole,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}