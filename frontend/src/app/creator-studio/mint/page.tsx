"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  FileJson,
  Fingerprint,
  Image as ImageIcon,
  Info,
  Loader2,
  LockKeyhole,
  Network,
  ShieldCheck,
  Upload,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { parseEther, keccak256, toBytes } from "viem";

/* -------------------------------------------------------------------------- */
/* CONTRACT CONFIG                                                            */
/* -------------------------------------------------------------------------- */

/*
  Replace this with your deployed IPRegistry address.
*/
const IP_REGISTRY_ADDRESS =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

/*
  IMPORTANT:
  Replace this ABI with your actual IPRegistry ABI.

  These are the functions this page expects:
    mintIP(string,uint256,uint256)
    hasRole(bytes32,address)
    LICENSER_ROLE()
*/
const IP_REGISTRY_ABI = [
  {
    type: "function",
    name: "mintIP",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "cid",
        type: "string",
      },
      {
        name: "price",
        type: "uint256",
      },
      {
        name: "accessWindowSeconds",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "hasRole",
    stateMutability: "view",
    inputs: [
      {
        name: "role",
        type: "bytes32",
      },
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },

  {
    type: "function",
    name: "LICENSER_ROLE",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
  },
] as const;

/*
  Change this if your deployed contract uses another network.

  Sepolia chain ID = 11155111
*/
const EXPECTED_CHAIN_ID = 11155111;

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type DurationOption = {
  label: string;
  seconds: number;
};

const DURATION_OPTIONS: DurationOption[] = [
  {
    label: "1 hour",
    seconds: 60 * 60,
  },
  {
    label: "1 day",
    seconds: 60 * 60 * 24,
  },
  {
    label: "7 days",
    seconds: 60 * 60 * 24 * 7,
  },
  {
    label: "30 days",
    seconds: 60 * 60 * 24 * 30,
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function shortenAddress(address?: string) {
  if (!address) return "Not connected";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function shortenHash(hash?: string) {
  if (!hash) return "";

  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function MintAssetPage() {
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const {
    data: writeHash,
    writeContract,
    isPending: isWalletPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: writeHash,
  });

  /* ------------------------------------------------------------------------ */
  /* FORM STATE                                                               */
  /* ------------------------------------------------------------------------ */

  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [assetType, setAssetType] = useState("Technical Document");
  const [version, setVersion] = useState("1.0");
  const [tags, setTags] = useState("");

  const [imageUri, setImageUri] = useState("");

  const [price, setPrice] = useState("0");
  const [freeAccess, setFreeAccess] = useState(true);

  const [durationSeconds, setDurationSeconds] = useState(
    DURATION_OPTIONS[2].seconds
  );

  /*
    For now this is manually entered.

    Later replace this with:
      create metadata JSON
      -> upload JSON to Pinata/IPFS
      -> receive CID
      -> setMetadataCid(cid)
  */
  const [metadataCid, setMetadataCid] = useState("");

  const [metadataReady, setMetadataReady] = useState(false);

  const [copied, setCopied] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* CONTRACT READS                                                           */
  /* ------------------------------------------------------------------------ */

  const { data: licenserRole } = useReadContract({
    address: IP_REGISTRY_ADDRESS,
    abi: IP_REGISTRY_ABI,
    functionName: "LICENSER_ROLE",
    query: {
      enabled:
        IP_REGISTRY_ADDRESS !==
        "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: hasLicenserRole } = useReadContract({
    address: IP_REGISTRY_ADDRESS,
    abi: IP_REGISTRY_ABI,
    functionName: "hasRole",
    args:
      licenserRole && address
        ? [licenserRole, address]
        : undefined,
    query: {
      enabled:
        Boolean(licenserRole) &&
        Boolean(address) &&
        IP_REGISTRY_ADDRESS !==
          "0x0000000000000000000000000000000000000000",
    },
  });

  /* ------------------------------------------------------------------------ */
  /* DERIVED STATE                                                            */
  /* ------------------------------------------------------------------------ */

  const selectedDuration = useMemo(() => {
    return (
      DURATION_OPTIONS.find(
        (option) => option.seconds === durationSeconds
      )?.label ?? "Custom"
    );
  }, [durationSeconds]);

  const metadataObject = useMemo(
    () => ({
      name: assetName,
      description,
      image: imageUri || undefined,
      assetType,
      version,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }),
    [
      assetName,
      description,
      imageUri,
      assetType,
      version,
      tags,
    ]
  );

  const metadataJson = useMemo(() => {
    return JSON.stringify(metadataObject, null, 2);
  }, [metadataObject]);

  const isCorrectNetwork = chainId === EXPECTED_CHAIN_ID;

  const effectivePrice = freeAccess ? "0" : price;

  const canMint =
    isConnected &&
    isCorrectNetwork &&
    Boolean(address) &&
    hasLicenserRole === true &&
    assetName.trim().length > 0 &&
    description.trim().length > 0 &&
    metadataCid.trim().length > 0 &&
    durationSeconds > 0 &&
    metadataReady &&
    !isWalletPending &&
    !isConfirming;

  /* ------------------------------------------------------------------------ */
  /* ACTIONS                                                                  */
  /* ------------------------------------------------------------------------ */

  function markMetadataReady() {
    if (!assetName.trim()) {
      alert("Enter an asset name first.");
      return;
    }

    if (!description.trim()) {
      alert("Enter an asset description first.");
      return;
    }

    if (!metadataCid.trim()) {
      alert("Enter the IPFS metadata CID.");
      return;
    }

    setMetadataReady(true);
  }

  function handleMint() {
    if (!address) {
      alert("Connect your wallet first.");
      return;
    }

    if (!isCorrectNetwork) {
      alert("Please switch to the Sepolia network.");
      return;
    }

    if (hasLicenserRole !== true) {
      alert("Connected wallet does not have LICENSER_ROLE.");
      return;
    }

    if (!metadataReady) {
      alert("Prepare the metadata first.");
      return;
    }

    if (!metadataCid.trim()) {
      alert("Metadata CID is required.");
      return;
    }

    if (durationSeconds <= 0) {
      alert("Access duration must be greater than zero.");
      return;
    }

    let priceWei: bigint;

    try {
      priceWei = parseEther(effectivePrice || "0");
    } catch {
      alert("Enter a valid ETH access price.");
      return;
    }

    /*
      THIS IS THE ACTUAL CONTRACT CALL:

      mintIP(
        cid,
        price,
        accessWindowSeconds
      )
    */

    writeContract({
      address: IP_REGISTRY_ADDRESS,
      abi: IP_REGISTRY_ABI,
      functionName: "mintIP",
      args: [
        metadataCid.trim(),
        priceWei,
        BigInt(durationSeconds),
      ],
    });
  }

  async function copyCid() {
    if (!metadataCid) return;

    await navigator.clipboard.writeText(metadataCid);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          <button
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-text"
          >
            <ArrowLeft size={16} />
            Back to Asset Registry
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                <span>Asset Registry</span>
                <span>/</span>
                <span className="text-accent">
                  Register Asset
                </span>
              </div>

              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Mint New Asset
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Register a verifiable digital asset on BharatChain
                and define its access policy.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-live-soft text-live">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-text">
                  Admin Registration
                </p>
                <p className="font-mono text-[11px] text-text-muted">
                  RBAC protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ============================================================ */}
          {/* LEFT                                                         */}
          {/* ============================================================ */}

          <div className="space-y-6">
            {/* ---------------------------------------------------------- */}
            {/* ASSET METADATA                                             */}
            {/* ---------------------------------------------------------- */}

            <section className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <FileJson size={18} />
                  </div>

                  <div>
                    <h2 className="font-display text-base font-semibold">
                      Asset Metadata
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Information represented by the IPFS metadata document.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* Asset Name */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Asset Name
                  </label>

                  <input
                    value={assetName}
                    onChange={(e) => {
                      setAssetName(e.target.value);
                      setMetadataReady(false);
                    }}
                    placeholder="Radar Control Module"
                    className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setMetadataReady(false);
                    }}
                    rows={4}
                    placeholder="Restricted engineering documentation for the radar control system."
                    className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                </div>

                {/* Type + Version */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Asset Type
                    </label>

                    <select
                      value={assetType}
                      onChange={(e) => {
                        setAssetType(e.target.value);
                        setMetadataReady(false);
                      }}
                      className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none focus:border-accent"
                    >
                      <option>Technical Document</option>
                      <option>Firmware</option>
                      <option>CAD Blueprint</option>
                      <option>Research Dataset</option>
                      <option>Software</option>
                      <option>Engineering Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Version
                    </label>

                    <input
                      value={version}
                      onChange={(e) => {
                        setVersion(e.target.value);
                        setMetadataReady(false);
                      }}
                      placeholder="1.0"
                      className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />
                  </div>
                </div>

                {/* Tags */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Tags
                  </label>

                  <input
                    value={tags}
                    onChange={(e) => {
                      setTags(e.target.value);
                      setMetadataReady(false);
                    }}
                    placeholder="defense, engineering, firmware"
                    className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />

                  <p className="mt-2 text-xs text-text-muted">
                    Separate tags using commas.
                  </p>
                </div>

                {/* Image URI */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Preview Image URI
                  </label>

                  <div className="relative">
                    <ImageIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      value={imageUri}
                      onChange={(e) => {
                        setImageUri(e.target.value);
                        setMetadataReady(false);
                      }}
                      placeholder="ipfs://..."
                      className="h-11 w-full rounded-xl border border-border bg-bg pl-10 pr-4 text-sm font-mono outline-none placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* IPFS METADATA                                              */}
            {/* ---------------------------------------------------------- */}

            <section className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-identity/10 text-identity">
                    <Network size={18} />
                  </div>

                  <div>
                    <h2 className="font-display text-base font-semibold">
                      IPFS Metadata
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      The CID below is passed directly to mintIP().
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* JSON preview */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Metadata JSON
                    </label>

                    <span className="font-mono text-[10px] text-text-muted">
                      preview
                    </span>
                  </div>

                  <pre className="max-h-[260px] overflow-auto rounded-xl border border-border bg-[#111318] p-4 font-mono text-xs leading-6 text-slate-300">
                    {metadataJson}
                  </pre>
                </div>

                {/* CID */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                    Metadata IPFS CID
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={metadataCid}
                      onChange={(e) => {
                        setMetadataCid(e.target.value);
                        setMetadataReady(false);
                      }}
                      placeholder="bafybe..."
                      className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 font-mono text-sm outline-none placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />

                    <button
                      type="button"
                      onClick={markMetadataReady}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent/90"
                    >
                      <Upload size={16} />
                      Prepare
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    For the contract, this should be the CID of the
                    metadata JSON, not merely the CID of the asset file.
                  </p>
                </div>

                {metadataReady && (
                  <div className="flex items-start gap-3 rounded-xl border border-live/20 bg-live-soft p-4">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-live"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text">
                        Metadata ready
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <p className="min-w-0 truncate font-mono text-xs text-text-muted">
                          ipfs://{metadataCid}
                        </p>

                        <button
                          onClick={copyCid}
                          className="shrink-0 text-text-muted hover:text-text"
                          title="Copy CID"
                        >
                          {copied ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* ACCESS POLICY                                               */}
            {/* ---------------------------------------------------------- */}

            <section className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-asset/10 text-asset">
                    <LockKeyhole size={18} />
                  </div>

                  <div>
                    <h2 className="font-display text-base font-semibold">
                      Access Policy
                    </h2>

                    <p className="mt-0.5 text-xs text-text-muted">
                      These values are written on-chain with the asset.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* PRICE */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Access Price
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        disabled={freeAccess}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 font-mono text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-accent focus:ring-2 focus:ring-accent/10"
                      />

                      <div className="flex h-11 items-center rounded-xl border border-border bg-bg px-4 font-mono text-xs text-text-muted">
                        ETH
                      </div>
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={freeAccess}
                        onChange={(e) => setFreeAccess(e.target.checked)}
                        className="h-4 w-4 accent-accent"
                      />

                      <span className="text-sm text-text-muted">
                        Free access
                      </span>
                    </label>
                  </div>

                  {/* DURATION */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                      Access Duration
                    </label>

                    <select
                      value={durationSeconds}
                      onChange={(e) =>
                        setDurationSeconds(Number(e.target.value))
                      }
                      className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none focus:border-accent"
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option
                          key={option.seconds}
                          value={option.seconds}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 font-mono text-[11px] text-text-muted">
                      {durationSeconds.toLocaleString()} seconds
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3 rounded-xl border border-border bg-bg p-4">
                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-text-muted"
                  />

                  <p className="text-xs leading-5 text-text-muted">
                    The access policy is stored on-chain. The selected
                    duration is converted to seconds and passed as the
                    third argument of{" "}
                    <span className="font-mono text-text">
                      mintIP()
                    </span>
                    .
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ============================================================ */}
          {/* RIGHT                                                        */}
          {/* ============================================================ */}

          <aside className="space-y-6">
            {/* ---------------------------------------------------------- */}
            {/* PREVIEW                                                    */}
            {/* ---------------------------------------------------------- */}

            <section className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-display text-sm font-semibold">
                  Asset Preview
                </h2>
              </div>

              <div className="p-5">
                <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-border bg-bg">
                  {imageUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUri}
                      alt={assetName || "Asset preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <ImageIcon size={30} strokeWidth={1.5} />
                      <span className="text-xs">
                        No preview image
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {assetName || "Untitled Asset"}
                      </h3>

                      <p className="mt-1 text-xs text-text-muted">
                        {assetType} · v{version || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      NFT
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-muted">
                    {description ||
                      "Asset description will appear here."}
                  </p>
                </div>

                <div className="mt-5 divide-y divide-border rounded-xl border border-border">
                  <PreviewRow
                    label="Access"
                    value={
                      freeAccess
                        ? "Free"
                        : `${effectivePrice} ETH`
                    }
                  />

                  <PreviewRow
                    label="Duration"
                    value={selectedDuration}
                  />

                  <PreviewRow
                    label="Metadata"
                    value={
                      metadataCid
                        ? `ipfs://${shortenHash(metadataCid)}`
                        : "Not prepared"
                    }
                    mono
                  />
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* BLOCKCHAIN STATUS                                          */}
            {/* ---------------------------------------------------------- */}

            <section className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-display text-sm font-semibold">
                  Blockchain Registration
                </h2>
              </div>

              <div className="space-y-3 p-5">
                <StatusRow
                  icon={Wallet}
                  label="Wallet"
                  value={
                    isConnected
                      ? shortenAddress(address)
                      : "Not connected"
                  }
                  status={isConnected}
                />

                <StatusRow
                  icon={Network}
                  label="Network"
                  value={
                    isCorrectNetwork
                      ? "Sepolia"
                      : `Chain ${chainId}`
                  }
                  status={isCorrectNetwork}
                />

                <StatusRow
                  icon={Fingerprint}
                  label="LICENSER_ROLE"
                  value={
                    hasLicenserRole === undefined
                      ? "Checking..."
                      : hasLicenserRole
                        ? "Verified"
                        : "Not granted"
                  }
                  status={hasLicenserRole === true}
                />
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* MINT ACTION                                                */}
            {/* ---------------------------------------------------------- */}

            <section className="rounded-2xl border border-border bg-surface p-5">
              <button
                disabled={!canMint}
                onClick={handleMint}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isWalletPending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Confirm in Wallet
                  </>
                ) : isConfirming ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Registering on-chain
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Register & Mint Asset
                  </>
                )}
              </button>

              {!isConnected && (
                <p className="mt-3 text-center text-xs text-text-muted">
                  Connect an authorized admin wallet to continue.
                </p>
              )}

              {isConnected && !isCorrectNetwork && (
                <p className="mt-3 text-center text-xs text-red-500">
                  Switch your wallet to Sepolia.
                </p>
              )}

              {isConnected &&
                isCorrectNetwork &&
                hasLicenserRole === false && (
                  <p className="mt-3 text-center text-xs text-red-500">
                    This wallet does not have LICENSER_ROLE.
                  </p>
                )}

              {writeError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                  <div className="flex gap-2">
                    <XCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-red-500"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-red-700">
                        Transaction failed
                      </p>

                      <p className="mt-1 break-words text-[11px] leading-5 text-red-600">
                        {writeError.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {writeHash && (
                <div className="mt-4 rounded-xl border border-border bg-bg p-3">
                  <div className="flex items-center gap-2">
                    {isConfirmed ? (
                      <CheckCircle2
                        size={16}
                        className="text-live"
                      />
                    ) : (
                      <Clock3
                        size={16}
                        className="text-accent"
                      />
                    )}

                    <div>
                      <p className="text-xs font-semibold">
                        {isConfirmed
                          ? "Transaction confirmed"
                          : "Transaction submitted"}
                      </p>

                      <p className="font-mono text-[10px] text-text-muted">
                        {shortenHash(writeHash)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SUCCESS                                                    */}
            {/* ---------------------------------------------------------- */}

            {isConfirmed && writeHash && (
              <section className="rounded-2xl border border-live/20 bg-live-soft p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-live text-white">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-semibold">
                      Asset Successfully Registered
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      The asset has been minted on the BharatChain
                      registry.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-live/10 bg-white/60 p-3">
                  <SuccessRow
                    label="Metadata CID"
                    value={metadataCid}
                  />

                  <SuccessRow
                    label="Creator"
                    value={shortenAddress(address)}
                  />

                  <SuccessRow
                    label="Transaction"
                    value={shortenHash(writeHash)}
                  />
                </div>

                <button
                  onClick={() =>
                    router.push("/admin/assets")
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-border bg-surface text-xs font-semibold text-text transition hover:bg-bg"
                >
                  View Asset Registry
                </button>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function PreviewRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-3">
      <span className="text-xs text-text-muted">
        {label}
      </span>

      <span
        className={`max-w-[210px] truncate text-right text-xs font-medium ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  status: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg px-3 py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          status
            ? "bg-live-soft text-live"
            : "bg-red-50 text-red-500"
        }`}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
          {label}
        </p>

        <p className="truncate text-xs font-semibold">
          {value}
        </p>
      </div>

      {status ? (
        <CheckCircle2
          size={15}
          className="shrink-0 text-live"
        />
      ) : (
        <XCircle
          size={15}
          className="shrink-0 text-red-500"
        />
      )}
    </div>
  );
}

function SuccessRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-text-muted">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right font-mono text-[11px] font-medium">
        {value}
      </span>
    </div>
  );
}