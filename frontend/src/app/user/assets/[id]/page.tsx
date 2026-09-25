"use client";

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
  History,
  KeyRound,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const assets = {
  "BC-001": {
    id: "BC-001",
    name: "Radar Control Module",
    type: "CAD / Engineering",
    version: "v2.4",
    status: "Owned",
    access: "Active",
    owner: "Arjun Mehta",
    ownerDid: "DID-0082",
    ownerWallet: "0x82A4...91F2",
    creator: "Rohan Desai",
    creatorDid: "DID-0026",
    creatorWallet: "0x82A4...91F2",
    description:
      "Engineering design package for the Radar Control Module used by the Radar Systems division.",
    tags: ["Radar", "Engineering", "CAD"],
    cid: "Qm8f3a7c91c2...d72a",
    tokenId: "1",
    contract: "0xBC01...91F2",
    mintTx: "0x82a4f91c8d31...91f2a712",
    registered: "Aug 24, 2026",
    acquired: "Aug 24, 2026",
    expires: null,
  },

  "BC-002": {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    version: "v4.2",
    status: "Owned",
    access: "Active",
    owner: "Arjun Mehta",
    ownerDid: "DID-0082",
    ownerWallet: "0x82A4...91F2",
    creator: "Rohan Desai",
    creatorDid: "DID-0026",
    creatorWallet: "0x31B7...A812",
    description:
      "Verified firmware package for secure radar systems and embedded control modules.",
    tags: ["Firmware", "Security", "Radar"],
    cid: "Qm4a72c8c831...a812",
    tokenId: "2",
    contract: "0xBC01...91F2",
    mintTx: "0x31b7a8124f62...a812f991",
    registered: "Sep 18, 2026",
    acquired: "Sep 18, 2026",
    expires: null,
  },

  "BC-003": {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    version: "v1.8",
    status: "Access Granted",
    access: "Active",
    owner: "Engineering Team Alpha",
    ownerDid: "DID-0211",
    ownerWallet: "0x91D2...72C1",
    creator: "Priya Sharma",
    creatorDid: "DID-0147",
    creatorWallet: "0x31B7...A812",
    description:
      "Detailed CAD blueprint for the RCM-2048 engineering module.",
    tags: ["CAD", "RCM-2048", "Engineering"],
    cid: "Qm91d272c1...72c190",
    tokenId: "3",
    contract: "0xBC01...91F2",
    mintTx: "0x91d272c1b82a...72c1901",
    registered: "Sep 20, 2026",
    acquired: "Sep 24, 2026",
    expires: "Oct 01, 2026",
  },

  "BC-005": {
    id: "BC-005",
    name: "Navigation System Specification",
    type: "Document",
    version: "v3.1",
    status: "Access Granted",
    access: "Expiring Soon",
    owner: "Navigation Systems",
    ownerDid: "DID-0104",
    ownerWallet: "0x72F1...D820",
    creator: "Vikram Singh",
    creatorDid: "DID-0104",
    creatorWallet: "0x72F1...D820",
    description:
      "Technical specification document containing the architecture and operating requirements of the navigation system.",
    tags: ["Navigation", "Specification", "Document"],
    cid: "Qm72f1d820...d820",
    tokenId: "5",
    contract: "0xBC01...91F2",
    mintTx: "0x72f1d820b442...d820119",
    registered: "Sep 20, 2026",
    acquired: "Sep 20, 2026",
    expires: "Sep 28, 2026",
  },
};

const activity = [
  {
    type: "Access Granted",
    description: "Access was granted to your identity.",
    date: "Sep 24, 2026",
    time: "34 min ago",
    status: "Confirmed",
    tx: "0x82a491f2b731...91f2d80",
  },
  {
    type: "Ownership Assigned",
    description: "Asset ownership was assigned on-chain.",
    date: "Sep 18, 2026",
    time: "2 days ago",
    status: "Confirmed",
    tx: "0x31b7a8124f62...a812f991",
  },
  {
    type: "Metadata Registered",
    description: "Asset metadata was registered with the blockchain.",
    date: "Sep 18, 2026",
    time: "2 days ago",
    status: "Confirmed",
    tx: "0x91d272c1b82a...72c1901",
  },
];

export default function UserAssetDetailPage() {
  const params = useParams();

  const assetId = String(params.id).toUpperCase();

  const asset =
    assets[assetId as keyof typeof assets] ?? assets["BC-001"];

  const isOwned = asset.status === "Owned";
  const isExpiring = asset.access === "Expiring Soon";

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/user/assets"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft size={15} />
          Back to My Assets
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Box size={25} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-medium text-[var(--text-muted)]">
                    {asset.id}
                  </span>

                  <StatusBadge status={asset.status} />

                  <AccessBadge status={asset.access} />
                </div>

                <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                  {asset.name}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  {asset.description}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/user/assets/${asset.id}/access`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
              >
                <KeyRound size={15} />
                Access Details
              </Link>

              <Link
                href="/user/activity"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <History size={15} />
                View Activity
              </Link>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Token ID"
            value={`#${asset.tokenId}`}
            icon={Box}
          />

          <MetricCard
            label="Version"
            value={asset.version}
            icon={FileCode2}
          />

          <MetricCard
            label="Ownership"
            value={isOwned ? "Owned" : "Granted"}
            icon={isOwned ? Wallet : ShieldCheck}
          />

          <MetricCard
            label="Access"
            value={asset.access}
            icon={isExpiring ? Clock3 : CheckCircle2}
            warning={isExpiring}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Asset Information */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={FileText}
                title="Asset Information"
                description="Core information associated with this digital asset."
              />

              <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
                <InfoItem label="Asset ID" value={asset.id} mono />

                <InfoItem label="Token ID" value={`#${asset.tokenId}`} mono />

                <InfoItem label="Asset Type" value={asset.type} />

                <InfoItem label="Version" value={asset.version} mono />

                <InfoItem
                  label="Registered"
                  value={asset.registered}
                />

                <InfoItem
                  label="Acquired"
                  value={asset.acquired}
                />

                <InfoItem
                  label="Creator / Issuer"
                  value={asset.creator}
                />

                <InfoItem
                  label="Creator DID"
                  value={asset.creatorDid}
                  mono
                />
              </div>

              <div className="border-t border-[var(--border)] p-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Description
                </p>

                <p className="text-sm leading-6 text-[var(--text)]">
                  {asset.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[var(--bg)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Ownership */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={Wallet}
                title="Ownership"
                description="Current on-chain ownership information."
              />

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <IdentityCard
                  label="Current Owner"
                  name={asset.owner}
                  did={asset.ownerDid}
                  wallet={asset.ownerWallet}
                  owner
                />

                <IdentityCard
                  label="Creator / Issuer"
                  name={asset.creator}
                  did={asset.creatorDid}
                  wallet={asset.creatorWallet}
                />
              </div>
            </section>

            {/* Blockchain Registration */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={ShieldCheck}
                title="Blockchain Registration"
                description="Verifiable blockchain information for this asset."
              />

              <div className="divide-y divide-[var(--border)]">
                <BlockchainRow
                  label="Contract"
                  value={asset.contract}
                  mono
                />

                <BlockchainRow
                  label="Token ID"
                  value={asset.tokenId}
                  mono
                />

                <BlockchainRow
                  label="Mint Transaction"
                  value={asset.mintTx}
                  mono
                  link
                />

                <BlockchainRow
                  label="Network"
                  value="BharatChain Network"
                />

                <BlockchainRow
                  label="Registration"
                  value={asset.registered}
                />
              </div>
            </section>

            {/* Metadata */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={FileCode2}
                title="Decentralized Metadata"
                description="Content-addressed metadata associated with this asset."
              />

              <div className="p-5">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    IPFS Content Identifier
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="min-w-0 truncate font-mono text-xs text-[var(--text)]">
                      {asset.cid}
                    </code>

                    <button
                      type="button"
                      className="shrink-0 rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                      title="Copy CID"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <CheckCircle2
                    size={14}
                    className="text-[var(--live)]"
                  />

                  Metadata integrity verified
                </div>
              </div>
            </section>

            {/* Activity */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={History}
                title="Asset Activity"
                description="Recent blockchain-backed events related to this asset."
              />

              <div className="divide-y divide-[var(--border)]">
                {activity.map((event, index) => (
                  <div
                    key={`${event.type}-${index}`}
                    className="flex gap-4 p-5"
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        {event.type === "Access Granted" ? (
                          <KeyRound size={15} />
                        ) : event.type === "Ownership Assigned" ? (
                          <Wallet size={15} />
                        ) : (
                          <FileCode2 size={15} />
                        )}
                      </div>

                      {index !== activity.length - 1 && (
                        <div className="absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-[var(--border)]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {event.type}
                        </p>

                        <span className="text-[10px] text-[var(--text-muted)]">
                          {event.time}
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                        {event.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--live)]">
                          <CheckCircle2 size={11} />
                          {event.status}
                        </span>

                        <span className="text-[10px] text-[var(--border)]">
                          •
                        </span>

                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {event.tx}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] p-4">
                <Link
                  href="/user/activity"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
                >
                  View all activity
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Access */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={KeyRound}
                title="Access Policy"
                description="Your current access to this asset."
              />

              <div className="space-y-4 p-5">
                <div className="rounded-xl bg-[var(--live-soft)] p-4">
                  <div className="flex items-center gap-2">
                    {isExpiring ? (
                      <Clock3
                        size={17}
                        className="text-amber-600"
                      />
                    ) : (
                      <CheckCircle2
                        size={17}
                        className="text-[var(--live)]"
                      />
                    )}

                    <span
                      className={`text-sm font-semibold ${
                        isExpiring
                          ? "text-amber-700"
                          : "text-[var(--live)]"
                      }`}
                    >
                      {asset.access}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                    {isExpiring
                      ? `Your access expires on ${asset.expires}.`
                      : "You currently have active access to this asset."}
                  </p>
                </div>

                <PolicyRow
                  label="Access Type"
                  value={isOwned ? "Ownership" : "Granted Access"}
                />

                <PolicyRow
                  label="Access Holder"
                  value={asset.ownerDid === "DID-0082" ? "You" : "DID-0082"}
                />

                <PolicyRow
                  label="Expires"
                  value={asset.expires ?? "No expiry"}
                />

                {!isOwned && (
                  <Link
                    href={`/user/assets/${asset.id}/access`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    View Access Details
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            </section>

            {/* Identity */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={User}
                title="Your Identity"
                description="Identity associated with this asset."
              />

              <div className="p-5">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    Arjun Mehta
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                    DID-0082
                  </p>

                  <div className="mt-3 flex items-center gap-2 border-t border-[var(--border)] pt-3">
                    <Wallet
                      size={13}
                      className="text-[var(--text-muted)]"
                    />

                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      0x82A4...91F2
                    </span>
                  </div>
                </div>

                <Link
                  href="/user/identity"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
                >
                  View My Identity
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--live-soft)] text-[var(--live)]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Verified Asset
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Ownership, metadata, and access records can be
                    independently verified against the blockchain.
                  </p>
                </div>
              </div>
            </section>

            {/* Explorer */}
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:bg-[var(--bg)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg)] text-[var(--text-muted)]">
                  <ExternalLink size={16} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--text)]">
                    Blockchain Explorer
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    View on-chain record
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={15}
                className="text-[var(--text-muted)]"
              />
            </button>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Asset details • BharatChain User Workspace
          </span>

          <span className="font-mono">
            Blockchain integration pending
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[var(--border)] p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon size={17} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--text)]">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  warning = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          warning
            ? "bg-amber-50 text-amber-600"
            : "bg-[var(--accent-soft)] text-[var(--accent)]"
        }`}
      >
        <Icon size={17} />
      </div>

      <p className="mt-4 truncate text-sm font-semibold text-[var(--text)]">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm font-medium text-[var(--text)] ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function IdentityCard({
  label,
  name,
  did,
  wallet,
  owner = false,
}: {
  label: string;
  name: string;
  did: string;
  wallet: string;
  owner?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>

        {owner && (
          <span className="rounded-full bg-[var(--live-soft)] px-2 py-1 text-[9px] font-medium text-[var(--live)]">
            Current
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-semibold text-[var(--text)]">
        {name}
      </p>

      <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
        {did}
      </p>

      <div className="mt-3 flex items-center gap-2 border-t border-[var(--border)] pt-3">
        <Wallet size={13} className="text-[var(--text-muted)]" />

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {wallet}
        </span>
      </div>
    </div>
  );
}

function BlockchainRow({
  label,
  value,
  mono = false,
  link = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  link?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <span
          className={`text-right text-xs font-medium text-[var(--text)] ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </span>

        {link && (
          <ArrowUpRight
            size={13}
            className="text-[var(--accent)]"
          />
        )}
      </div>
    </div>
  );
}

function PolicyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-[var(--text)]">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const owned = status === "Owned";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        owned
          ? "bg-[var(--live-soft)] text-[var(--live)]"
          : "bg-[var(--accent-soft)] text-[var(--accent)]"
      }`}
    >
      {owned ? <Wallet size={11} /> : <ShieldCheck size={11} />}
      {status}
    </span>
  );
}

function AccessBadge({ status }: { status: string }) {
  const expiring = status === "Expiring Soon";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        expiring
          ? "bg-amber-50 text-amber-700"
          : "bg-[var(--live-soft)] text-[var(--live)]"
      }`}
    >
      {expiring ? <Clock3 size={11} /> : <CheckCircle2 size={11} />}
      {status}
    </span>
  );
}