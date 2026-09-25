import { ethers } from 'ethers';
import IPRegistryAbi from '../abi/IPRegistry.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: IPRegistryAbi,
} as const;

let _readProvider: ethers.JsonRpcProvider | null = null;
let _readContract: ethers.Contract | null = null;

export function getReadContract() {
  if (!_readProvider) _readProvider = new ethers.JsonRpcProvider(RPC_URL);
  if (!_readContract) {
    _readContract = new ethers.Contract(CONTRACT_ADDRESS, IPRegistryAbi, _readProvider);
  }
  return _readContract;
}

/** Used by the key-manager server (server.ts) to verify who minted an asset. */
export async function creatorOf(assetId: number): Promise<string> {
  const contract = getReadContract();
  return contract.creatorOf(assetId);
}

/** Used by the key-manager server (server.ts) as the sole gate before releasing a decryption key. */
export async function hasActiveAccess(assetId: number, agent: string): Promise<boolean> {
  const contract = getReadContract();
  return contract.hasActiveAccess(assetId, agent);
}

export const SUPPORTED_CHAINS = [
  { id: 11155111, name: 'Sepolia', rpcUrl: RPC_URL },
];