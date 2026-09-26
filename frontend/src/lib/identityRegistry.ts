import { ethers } from 'ethers';
import IdentityRegistryAbi from '../abi/IdentityRegistry.json';
import { RPC_URL } from './contract';

export const IDENTITY_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS as string;

export const identityRegistryConfig = {
  address: IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
  abi: IdentityRegistryAbi,
} as const;

let _readProvider: ethers.JsonRpcProvider | null = null;
let _readContract: ethers.Contract | null = null;

export function getIdentityReadContract() {
  if (!_readProvider) _readProvider = new ethers.JsonRpcProvider(RPC_URL);
  if (!_readContract) {
    _readContract = new ethers.Contract(IDENTITY_REGISTRY_ADDRESS, IdentityRegistryAbi, _readProvider);
  }
  return _readContract;
}

/**
 * Role hashes — DEFAULT_ADMIN_ROLE is bytes32(0) by OpenZeppelin convention;
 * the rest are keccak256("<ROLE_NAME>"), matching the Solidity constants.
 */
export const ROLES = {
  DEFAULT_ADMIN_ROLE: ('0x' + '0'.repeat(64)) as `0x${string}`,
  MANAGER_ROLE: ethers.id('MANAGER_ROLE'),
  AUDITOR_ROLE: ethers.id('AUDITOR_ROLE'),
  USER_ROLE: ethers.id('USER_ROLE'),
} as const;

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.DEFAULT_ADMIN_ROLE]: 'Admin',
  [ROLES.MANAGER_ROLE]: 'Manager',
  [ROLES.AUDITOR_ROLE]: 'Auditor',
  [ROLES.USER_ROLE]: 'Engineer',
};

export const ROLE_OPTIONS = [
  { label: 'Admin', value: ROLES.DEFAULT_ADMIN_ROLE },
  { label: 'Manager', value: ROLES.MANAGER_ROLE },
  { label: 'Auditor', value: ROLES.AUDITOR_ROLE },
  { label: 'Engineer', value: ROLES.USER_ROLE },
];

export const STATUS_LABELS = ['Unregistered', 'Active', 'Suspended', 'Revoked'] as const;
export type IdentityStatusLabel = (typeof STATUS_LABELS)[number];