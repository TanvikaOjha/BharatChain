// Run by the admin after a creator has been verified (e.g. Privy/World ID
// check passed off-chain). Usage:
//   node scripts/grantLicenserRole.js 0xCreatorWalletAddress
require('dotenv').config();
const { ethers } = require('ethers');
const IPRegistryAbi = require('../abi/IPRegistry.json');

async function main() {
  const creatorAddress = process.argv[2];
  if (!creatorAddress || !ethers.isAddress(creatorAddress)) {
    console.error('Usage: node grantLicenserRole.js <creator-wallet-address>');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, IPRegistryAbi, adminWallet);

  const LICENSER_ROLE = await contract.LICENSER_ROLE();

  const already = await contract.hasRole(LICENSER_ROLE, creatorAddress);
  if (already) {
    console.log(`${creatorAddress} already holds LICENSER_ROLE.`);
    return;
  }

  console.log(`Granting LICENSER_ROLE to ${creatorAddress}...`);
  const tx = await contract.grantRole(LICENSER_ROLE, creatorAddress);
  const receipt = await tx.wait();

  console.log(`Done. Tx hash: ${receipt.hash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});