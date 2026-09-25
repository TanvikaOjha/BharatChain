import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const abi = JSON.parse(readFileSync(path.join(__dirname, "abi", "IPRegistry.json"), "utf-8"));

const required = ["RPC_URL", "CONTRACT_ADDRESS", "AGENT_PRIVATE_KEY"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing ${key} in .env`);
}

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const agentWallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
export const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, agentWallet);