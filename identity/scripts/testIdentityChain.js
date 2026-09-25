// Walks through the full chain described in the build guide:
//   1. Confirm creator wallet holds LICENSER_ROLE (after grantLicenserRole.js)
//   2. Confirm a fresh agent has NO access to a given asset
//   3. Agent pays via requestAccess()
//   4. Confirm the agent now HAS access
// Usage:
//   node scripts/testIdentityChain.js <assetId> <creatorAddress> <agentPrivateKey>
require('dotenv').config();
const { ethers } = require('ethers');
const IPRegistryAbi = require('../abi/IPRegistry.json');

async function main() {
  const [assetIdArg, creatorAddress, agentPrivateKey] = process.argv.slice(2);
  if (!assetIdArg || !creatorAddress || !agentPrivateKey) {
    console.error('Usage: node testIdentityChain.js <assetId> <creatorAddress> <agentPrivateKey>');
    process.exit(1);
  }
  const assetId = Number(assetIdArg);

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const agentWallet = new ethers.Wallet(agentPrivateKey, provider);
  const readContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, IPRegistryAbi, provider);
  const agentContract = readContract.connect(agentWallet);

  console.log('--- Step 1: creator role check ---');
  const LICENSER_ROLE = await readContract.LICENSER_ROLE();
  const creatorOk = await readContract.hasRole(LICENSER_ROLE, creatorAddress);
  console.log(`Creator ${creatorAddress} holds LICENSER_ROLE: ${creatorOk}`);
  if (!creatorOk) {
    console.error('❌ Creator is not authorized. Run grantLicenserRole.js first.');
    process.exit(1);
  }

  console.log('\n--- Step 2: agent access before payment ---');
  const before = await readContract.hasActiveAccess(assetId, agentWallet.address);
  console.log(`Agent ${agentWallet.address} hasActiveAccess: ${before}`);
  if (before) console.warn('⚠️  Agent already has access — did you re-run against a used asset?');

  console.log('\n--- Step 3: agent pays for access ---');
  const price = await readContract.priceOf(assetId);
  console.log(`Price for asset ${assetId}: ${ethers.formatEther(price)} ETH`);
  const tx = await agentContract.requestAccess(assetId, { value: price });
  await tx.wait();
  console.log(`Payment tx confirmed: ${tx.hash}`);

  console.log('\n--- Step 4: agent access after payment ---');
  const after = await readContract.hasActiveAccess(assetId, agentWallet.address);
  console.log(`Agent ${agentWallet.address} hasActiveAccess: ${after}`);

  console.log(after ? '\n✅ Identity chain verified end to end.' : '\n❌ Access was not granted — check contract state.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});