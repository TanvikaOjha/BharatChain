// frontend/src/app/creator-studio/mint/page.tsx  (key excerpt — replace the hardcoded address/ABI and add the upload flow)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import {
  useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt,
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

  const { data: licenserRole } = useReadContract({
    ...contractConfig,
    functionName: "LICENSER_ROLE",
  });
  const { data: hasLicenserRole } = useReadContract({
    ...contractConfig,
    functionName: "hasRole",
    args: licenserRole && address ? [licenserRole, address] : undefined,
    query: { enabled: Boolean(licenserRole) && Boolean(address) },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Once the mint confirms, pull the assetId out of the IPMinted log and
  // register the encryption key against it — this is the step the old
  // mock page skipped entirely.
  useState(() => {}); // placeholder to keep hook order stable in this excerpt

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
      // Fire-and-forget; safe to call once since pendingKey is cleared after.
      registerKey(assetId, pendingKey).then(() => {
        setPendingKey(null);
        router.push(`/creator-studio/assets/${assetId}`);
      });
    }
  }

  return (
    <div className="p-8">
      {!isConnected && <p>Connect an admin wallet to continue.</p>}
      {isConnected && !isCorrectNetwork && <p>Switch to Sepolia.</p>}
      {isConnected && hasLicenserRole === false && <p>This wallet lacks LICENSER_ROLE.</p>}

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (ETH)" />
      <select value={durationSeconds} onChange={(e) => setDurationSeconds(Number(e.target.value))}>
        <option value={3600}>1 hour</option>
        <option value={86400}>1 day</option>
        <option value={604800}>7 days</option>
        <option value={2592000}>30 days</option>
      </select>

      <button
        disabled={!file || !isConnected || !isCorrectNetwork || hasLicenserRole !== true || isPending || isConfirming || stage === "encrypting" || stage === "uploading"}
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