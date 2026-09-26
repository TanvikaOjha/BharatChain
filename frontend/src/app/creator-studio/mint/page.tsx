// frontend/src/app/creator-studio/mint/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import {
  useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt,
} from "wagmi";
import { decodeEventLog } from "viem";
import { contractConfig, CHAIN_ID } from "../../../lib/contract";
import { useUploadAsset } from "../../../hooks/useUploadAsset";
import IPRegistryAbi from "../../../abi/IPRegistry.json";

export default function MintAssetPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === CHAIN_ID;

  const { stage, encryptAndUpload, registerKey } = useUploadAsset();
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("0.01");
  const [durationSeconds, setDurationSeconds] = useState(60 * 60 * 24 * 7);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  // Role check removed — any connected wallet is allowed to register
  // (mint) an asset now, regardless of on-chain LICENSER_ROLE.

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  async function handleUploadAndMint() {
    if (!file) return alert("Choose a file first.");
    const { cid, keyBase64 } = await encryptAndUpload(file);
    setPendingKey(keyBase64);
    writeContract({
      ...contractConfig,
      functionName: "mintIP",
      args: [cid, parseEther(price || "0"), BigInt(durationSeconds)],
    });
  }

  if (isConfirmed && receipt && pendingKey) {
    const minted = receipt.logs
      .map((log) => {
        try {
          return decodeEventLog({ abi: IPRegistryAbi, ...log });
        } catch {
          return null;
        }
      })
      .find((e) => e?.eventName === "IPMinted");

    if (minted && "assetId" in (minted.args as any)) {
      const assetId = Number((minted.args as any).assetId);
      registerKey(assetId, pendingKey).then(() => {
        setPendingKey(null);
        router.push(`/creator-studio/assets/${assetId}`);
      });
    }
  }

  return (
    <div className="p-8">
      {!isConnected && <p>Connect a wallet to continue.</p>}
      {isConnected && !isCorrectNetwork && <p>Switch to Sepolia.</p>}

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (ETH)" />
      <select value={durationSeconds} onChange={(e) => setDurationSeconds(Number(e.target.value))}>
        <option value={3600}>1 hour</option>
        <option value={86400}>1 day</option>
        <option value={604800}>7 days</option>
        <option value={2592000}>30 days</option>
      </select>

      <button
        disabled={!file || !isConnected || !isCorrectNetwork || isPending || isConfirming || stage === "encrypting" || stage === "uploading"}
        onClick={handleUploadAndMint}
      >
        {stage === "encrypting" ? "Encrypting…"
          : stage === "uploading" ? "Uploading to IPFS…"
          : isPending ? "Confirm in wallet…"
          : isConfirming ? "Minting on-chain…"
          : "Encrypt, Upload & Mint"}
      </button>
    </div>
  );
}