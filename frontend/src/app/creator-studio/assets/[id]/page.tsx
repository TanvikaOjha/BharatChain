"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  FileCode2,
  FileText,
  Fingerprint,
  History,
  LockKeyhole,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useParams } from "next/navigation";

// ---------------------------------------------------------
// Mock asset data
// Later this will come from the blockchain / backend.
// ---------------------------------------------------------

const assets = {
  "BC-001": {
    id: "BC-001",
    name: "Radar Control Module",
    type: "CAD / Engineering",
    status: "Active",
    version: "v2.4",

    tokenId: "1",

    description:
      "Digital engineering asset containing the radar control module design and associated technical specifications.",

    creator: "DID-0082",
    creatorWallet: "0x82A4...91F2",

    owner: "DID-0082",
    ownerWallet: "0x82A4...91F2",

    cid: "QmX7a8B9cD2eF4gH6jK8mN1pR3sT5vW7xY9z",

    accessPrice: "0.02 ETH",
    accessDuration: "7 days",
    activeUsers: 12,

    contractAddress: "0x7A31...91C4",
    mintTransaction: "0x82A4...91F2...7C21",
    mintedAt: "Sep 24, 2026 · 10:42:18",

    tags: ["Radar", "Engineering", "Defense", "CAD"],

    activity: [
      {
        title: "Asset Minted",
        description: "Asset registered on-chain",
        actor: "DID-0082",
        time: "Sep 24, 2026 · 10:42",
        icon: Box,
      },
      {
        title: "Ownership Assigned",
        description: "Ownership assigned to creator wallet",
        actor: "DID-0082",
        time: "Sep 24, 2026 · 10:42",
        icon: User,
      },
      {
        title: "Access Granted",
        description: "Access granted to DID-0211",
        actor: "DID-0211",
        time: "Sep 25, 2026 · 14:18",
        icon: ShieldCheck,
      },
    ],
  },

  "BC-002": {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    status: "Active",
    version: "v4.2",

    tokenId: "2",

    description:
      "Secure firmware package containing the latest approved firmware release for the associated control system.",

    creator: "DID-0147",
    creatorWallet: "0x31B7...A812",

    owner: "DID-0147",
    ownerWallet: "0x31B7...A812",

    cid: "QmFirmware42ExampleCid123456789",

    accessPrice: "0.05 ETH",
    accessDuration: "30 days",
    activeUsers: 8,

    contractAddress: "0x7A31...91C4",
    mintTransaction: "0x31B7...A812...91F2",
    mintedAt: "Sep 22, 2026 · 09:24:51",

    tags: ["Firmware", "Security", "Control System"],

    activity: [
      {
        title: "Asset Minted",
        description: "Asset registered on-chain",
        actor: "DID-0147",
        time: "Sep 22, 2026 · 09:24",
        icon: Box,
      },
      {
        title: "Access Granted",
        description: "Access granted to DID-0082",
        actor: "DID-0082",
        time: "Sep 23, 2026 · 11:42",
        icon: ShieldCheck,
      },
    ],
  },

  "BC-003": {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    status: "Active",
    version: "v1.8",

    tokenId: "3",

    description:
      "Engineering blueprint for the RCM-2048 module with associated component specifications.",

    creator: "DID-0211",
    creatorWallet: "0x91D2...72C1",

    owner: "DID-0211",
    ownerWallet: "0x91D2...72C1",

    cid: "QmCADBlueprint2048ExampleCid",

    accessPrice: "0.01 ETH",
    accessDuration: "3 days",
    activeUsers: 21,

    contractAddress: "0x7A31...91C4",
    mintTransaction: "0x91D2...72C1...44A8",
    mintedAt: "Sep 20, 2026 · 16:12:34",

    tags: ["CAD", "Blueprint", "Engineering"],

    activity: [
      {
        title: "Asset Minted",
        description: "Asset registered on-chain",
        actor: "DID-0211",
        time: "Sep 20, 2026 · 16:12",
        icon: Box,
      },
      {
        title: "Access Granted",
        description: "Access granted to DID-0082",
        actor: "DID-0082",
        time: "Sep 21, 2026 · 13:05",
        icon: ShieldCheck,
      },
    ],
  },
};

// ---------------------------------------------------------
// Fallback asset
// ---------------------------------------------------------

const fallbackAsset = {
  id: "BC-001",
  name: "Radar Control Module",
  type: "CAD / Engineering",
  status: "Active",
  version: "v2.4",
  tokenId: "1",
  description:
    "Digital engineering asset containing the radar control module design and associated technical specifications.",
  creator: "DID-0082",
  creatorWallet: "0x82A4...91F2",
  owner: "DID-0082",
  ownerWallet: "0x82A4...91F2",
  cid: "QmX7a8B9cD2eF4gH6jK8mN1pR3sT5vW7xY9z",
  accessPrice: "0.02 ETH",
  accessDuration: "7 days",
  activeUsers: 12,
  contractAddress: "0x7A31...91C4",
  mintTransaction: "0x82A4...91F2...7C21",
  mintedAt: "Sep 24, 2026 · 10:42:18",
  tags: ["Radar", "Engineering", "Defense", "CAD"],
  activity: [
    {
      title: "Asset Minted",
      description: "Asset registered on-chain",
      actor: "DID-0082",
      time: "Sep 24, 2026 · 10:42",
      icon: Box,
    },
  ],
};

export default function AssetDetailPage() {
  const params = useParams();

  const assetId = String(params.id).toUpperCase();

  const asset =
    assets[assetId as keyof typeof assets] ?? fallbackAsset;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ------------------------------------------------ */}
        {/* Back navigation */}
        {/* ------------------------------------------------ */}

        <Link
          href="/creator-studio/assets"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-text"
        >
          <ArrowLeft size={16} />
          Back to Asset Registry
        </Link>

        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-amber-50 text-amber-600">
              <Box size={27} strokeWidth={1.8} />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">

                <span className="font-mono text-xs font-medium text-text-muted">
                  {asset.id}
                </span>

                <span className="rounded-full bg-live-soft px-2.5 py-1 text-[11px] font-semibold text-live">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-live" />
                  {asset.status}
                </span>

              </div>

              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {asset.name}
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                {asset.type} · {asset.version}
              </p>
            </div>

          </div>

          {/* Header actions */}

          <div className="flex flex-wrap gap-2">

            <Link
              href={`/creator-studio/assets/${asset.id}/access`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:bg-bg"
            >
              <LockKeyhole size={16} />
              Manage Access
            </Link>

            <Link
              href="/creator-studio/audit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <History size={16} />
              View Audit
            </Link>

          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Main grid */}
        {/* ------------------------------------------------ */}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ============================================== */}
          {/* LEFT COLUMN */}
          {/* ============================================== */}

          <div className="space-y-6">

            {/* -------------------------------------------- */}
            {/* Asset Information */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">
                <h2 className="font-display text-base font-semibold">
                  Asset Information
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  Core identity and ownership information
                </p>
              </div>

              <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">

                <InfoItem
                  label="Asset ID"
                  value={asset.id}
                  mono
                />

                <InfoItem
                  label="Token ID"
                  value={`#${asset.tokenId}`}
                  mono
                />

                <InfoItem
                  label="Asset Type"
                  value={asset.type}
                />

                <InfoItem
                  label="Version"
                  value={asset.version}
                />

                <InfoItem
                  label="Creator / Issuer"
                  value={asset.creator}
                  icon={<Fingerprint size={15} />}
                  mono
                />

                <InfoItem
                  label="Creator Wallet"
                  value={asset.creatorWallet}
                  icon={<Wallet size={15} />}
                  mono
                />

                <InfoItem
                  label="Current Owner"
                  value={asset.owner}
                  icon={<User size={15} />}
                  mono
                />

                <InfoItem
                  label="Owner Wallet"
                  value={asset.ownerWallet}
                  icon={<Wallet size={15} />}
                  mono
                />

              </div>

              <div className="border-t border-border px-5 py-5">

                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Description
                </p>

                <p className="max-w-3xl text-sm leading-6 text-text">
                  {asset.description}
                </p>

              </div>

              {/* Tags */}

              <div className="border-t border-border px-5 py-5">

                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Tags
                </p>

                <div className="flex flex-wrap gap-2">

                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-bg px-2.5 py-1.5 text-xs font-medium text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}

                </div>

              </div>

            </section>

            {/* -------------------------------------------- */}
            {/* Metadata */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <div className="flex items-center gap-2">
                  <FileCode2 size={17} className="text-accent" />

                  <h2 className="font-display text-base font-semibold">
                    Metadata
                  </h2>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  Decentralized asset metadata reference
                </p>

              </div>

              <div className="p-5">

                <div className="rounded-lg border border-border bg-bg p-4">

                  <div className="mb-2 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-text-muted" />

                      <span className="text-xs font-medium text-text-muted">
                        IPFS Content Identifier
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-text-muted transition hover:text-text"
                      title="Copy CID"
                    >
                      <Copy size={14} />
                    </button>

                  </div>

                  <p className="break-all font-mono text-xs leading-5 text-text">
                    {asset.cid}
                  </p>

                </div>

                <div className="mt-3">

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    View metadata
                    <ExternalLink size={13} />
                  </button>

                </div>

              </div>

            </section>

            {/* -------------------------------------------- */}
            {/* Blockchain Registration */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-live" />

                  <h2 className="font-display text-base font-semibold">
                    Blockchain Registration
                  </h2>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  On-chain registration and transaction details
                </p>

              </div>

              <div className="divide-y divide-border">

                <BlockchainRow
                  label="Contract"
                  value={asset.contractAddress}
                />

                <BlockchainRow
                  label="Token ID"
                  value={asset.tokenId}
                />

                <BlockchainRow
                  label="Mint Transaction"
                  value={asset.mintTransaction}
                />

                <BlockchainRow
                  label="Registered"
                  value={asset.mintedAt}
                />

              </div>

            </section>

            {/* -------------------------------------------- */}
            {/* Activity */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <div className="flex items-center gap-2">
                  <History size={17} className="text-accent" />

                  <h2 className="font-display text-base font-semibold">
                    Asset Activity
                  </h2>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  Recent events associated with this asset
                </p>

              </div>

              <div className="divide-y divide-border">

                {asset.activity.map((event, index) => {

                  const Icon = event.icon;

                  return (
                    <div
                      key={`${event.title}-${index}`}
                      className="flex gap-4 px-5 py-4"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col justify-between gap-1 sm:flex-row">

                          <p className="text-sm font-medium">
                            {event.title}
                          </p>

                          <span className="shrink-0 text-xs text-text-muted">
                            {event.time}
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-text-muted">
                          {event.description}
                        </p>

                        <p className="mt-2 font-mono text-[11px] text-text-muted">
                          Actor: {event.actor}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </section>

          </div>

          {/* ============================================== */}
          {/* RIGHT COLUMN */}
          {/* ============================================== */}

          <aside className="space-y-6">

            {/* -------------------------------------------- */}
            {/* Access Policy */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <div className="flex items-center gap-2">
                  <LockKeyhole size={17} className="text-accent" />

                  <h2 className="font-display text-base font-semibold">
                    Access Policy
                  </h2>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  Current access configuration
                </p>

              </div>

              <div className="p-5">

                <div className="grid grid-cols-2 gap-3">

                  <MetricCard
                    label="Access Price"
                    value={asset.accessPrice}
                  />

                  <MetricCard
                    label="Duration"
                    value={asset.accessDuration}
                  />

                  <MetricCard
                    label="Active Users"
                    value={String(asset.activeUsers)}
                    icon={<Users size={14} />}
                  />

                  <MetricCard
                    label="Status"
                    value={asset.status}
                    live
                  />

                </div>

                <Link
                  href={`/creator-studio/assets/${asset.id}/access`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg"
                >
                  Manage Access
                  <ArrowUpRight size={15} />
                </Link>

              </div>

            </section>

            {/* -------------------------------------------- */}
            {/* Ownership */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <div className="flex items-center gap-2">
                  <User size={17} className="text-accent" />

                  <h2 className="font-display text-base font-semibold">
                    Ownership
                  </h2>
                </div>

              </div>

              <div className="p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Fingerprint size={18} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium">
                      {asset.owner}
                    </p>

                    <p className="mt-0.5 truncate font-mono text-xs text-text-muted">
                      {asset.ownerWallet}
                    </p>

                  </div>

                </div>

                <div className="mt-4 rounded-lg bg-live-soft p-3">

                  <div className="flex items-start gap-2">

                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-live"
                    />

                    <div>
                      <p className="text-xs font-semibold text-live">
                        Ownership verified
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-text-muted">
                        Current wallet ownership matches the registered
                        on-chain asset owner.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* -------------------------------------------- */}
            {/* Quick Links */}
            {/* -------------------------------------------- */}

            <section className="rounded-xl border border-border bg-surface">

              <div className="border-b border-border px-5 py-4">

                <h2 className="font-display text-base font-semibold">
                  Quick Links
                </h2>

              </div>

              <div className="p-2">

                <QuickLink
                  href={`/creator-studio/assets/${asset.id}/access`}
                  icon={LockKeyhole}
                  title="Access Management"
                  description="Review asset permissions"
                />

                <QuickLink
                  href="/creator-studio/audit"
                  icon={History}
                  title="Audit Center"
                  description="View blockchain activity"
                />

                <QuickLink
                  href="/creator-studio/identities"
                  icon={Fingerprint}
                  title="Identity Management"
                  description="Manage registered DIDs"
                />

              </div>

            </section>

          </aside>

        </div>
      </div>
    </div>
  );
}

// =========================================================
// Reusable components
// =========================================================

function InfoItem({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <div className="flex items-center gap-1.5">

        {icon && (
          <span className="text-text-muted">
            {icon}
          </span>
        )}

        <p
          className={`text-sm text-text ${
            mono ? "font-mono text-xs" : "font-medium"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}

function BlockchainRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

      <span className="text-xs font-medium text-text-muted">
        {label}
      </span>

      <span className="break-all font-mono text-xs text-text">
        {value}
      </span>

    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  live = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">

      <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-1.5">

        {icon && (
          <span className="text-text-muted">
            {icon}
          </span>
        )}

        {live && (
          <span className="h-1.5 w-1.5 rounded-full bg-live" />
        )}

        <p
          className={`text-sm font-semibold ${
            live ? "text-live" : "text-text"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg p-3 transition hover:bg-bg"
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-text-muted">
          {description}
        </p>

      </div>

      <ArrowUpRight
        size={15}
        className="text-text-muted transition group-hover:text-text"
      />

    </Link>
  );
}