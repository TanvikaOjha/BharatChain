import { ethers } from 'ethers';
import IPRegistryAbi from '../abi/IPRegistry.json';
 
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111); // Sepolia
 
export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: IPRegistryAbi,
} as const;
 
let _readProvider: ethers.JsonRpcProvider | null = null;
let _readContract: ethers.Contract | null = null;
 
/** Read-only contract instance for server components / non-wallet reads. */
export function getReadContract() {
  if (!_readProvider) _readProvider = new ethers.JsonRpcProvider(RPC_URL);
  if (!_readContract) {
    _readContract = new ethers.Contract(CONTRACT_ADDRESS, IPRegistryAbi, _readProvider);
  }
  return _readContract;
}
 
export const SUPPORTED_CHAINS = [
  { id: 11155111, name: 'Sepolia', rpcUrl: RPC_URL },
  // Add mainnet/Polygon entries here when the app graduates past testnet.
];