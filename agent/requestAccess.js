import "dotenv/config";
import { contract, agentWallet } from "./contract.js";

async function requestAccess(assetId) {
  const price = await contract.priceOf(assetId);
  console.log(`💸 Requesting access to asset #${assetId} for ${price} wei...`);

  const tx = await contract.requestAccess(assetId, { value: price });
  console.log(`   tx sent: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`✅ Confirmed in block ${receipt.blockNumber}.`);

  const expiresAt = await contract.consumerExpiry(assetId, agentWallet.address);
  const expiryDate = new Date(Number(expiresAt) * 1000);
  console.log(`   Access now valid until: ${expiryDate.toISOString()}`);
}

const assetId = process.argv[2];
if (!assetId) {
  console.error("Usage: node requestAccess.js <assetId>");
  process.exit(1);
}

requestAccess(assetId).catch((err) => {
  console.error("requestAccess failed:", err.reason ?? err.message);
  process.exit(1);
});