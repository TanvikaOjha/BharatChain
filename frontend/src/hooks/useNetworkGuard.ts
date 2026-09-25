'use client';
 
import { useChainId, useSwitchChain } from 'wagmi';
import { CHAIN_ID } from '../lib/contract';
 
export function useNetworkGuard() {
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();
 
  const isWrongNetwork = chainId !== undefined && chainId !== CHAIN_ID;
 
  function switchToRequiredNetwork() {
    switchChain({ chainId: CHAIN_ID });
  }
 
  return {
    isWrongNetwork,
    isSwitching: isPending,
    switchError: error,
    requiredChainId: CHAIN_ID,
    switchToRequiredNetwork,
  };
}
 