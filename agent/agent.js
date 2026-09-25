import "dotenv/config";
import fetch from "node-fetch";
import { contract, agentWallet } from "./contract.js";
import { decrypt } from "./decrypt.js";

const KEY_MANAGER_URL = process.env.KEY_MANAGER_URL ?? "http://localhost:4000";
const IPFS_GATEWAY = process.env.IPFS_GATEWAY ?? "https://gateway.pinata.cloud/ipfs";

async function tryReadDataset(assetId) {
  console.log(`\n🤖 Agent ${agentWallet.address} requesting dataset #${assetId}...`);

  // 1. On-chain gate check — this is the whole point of the demo.
  const canAccess = await contract.hasActiveAccess(assetId, agentWallet.address);
  if (!canAccess) {
    console.log("❌ Access denied — no active license (unpaid or expired).");
    return false;
  }
  console.log("✅ On-chain check passed — agent has an active license.");

  // 2. Ask the key manager for the symmetric key. It re-verifies on-chain
  //    state itself before releasing anything (see Phase 4 key manager).
  const keyRes = await fetch(
    `${KEY_MANAGER_URL}/key/${assetId}?agent=${agentWallet.address}`
  );
  if (!keyRes.ok) {
    console.log(`❌ Key manager refused (HTTP ${keyRes.status}). Access check may have raced expiry.`);
    return false;
  }
  const { key } = await keyRes.json();

  // 3. Pull the ciphertext from IPFS via the CID stored on-chain.
  const cid = await contract.cidOf(assetId);
  const fileRes = await fetch(`${IPFS_GATEWAY}/${cid}`);
  if (!fileRes.ok) {
    console.log(`❌ Could not fetch ciphertext from IPFS (HTTP ${fileRes.status}).`);
    return false;
  }
  const ciphertext = Buffer.from(await fileRes.arrayBuffer());

  // 4. Decrypt locally and show a preview.
  const plaintext = decrypt(ciphertext, key);
  console.log("✅ Decrypted dataset:\n", plaintext.toString("utf-8").slice(0, 300));
  return true;
}

const assetId = process.argv[2];
if (!assetId) {
  console.error("Usage: node agent.js <assetId>");
  process.exit(1);
}

tryReadDataset(assetId)
  .catch((err) => {
    console.error("Agent script error:", err.message);
    process.exit(1);
  });