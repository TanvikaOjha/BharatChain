"use client";

import {
  ArrowLeft,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  KeyRound,
  ShieldCheck,
  User,
  Wallet,
  XCircle,
  ArrowUpRight,
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
    accessStatus: "Active",
    owner: "You",
    ownerDid: "DID-0082",
    price: "0.02 ETH",
    duration: "7 days",
  },
  "BC-002": {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    version: "v4.2",
    status: "Owned",
    accessStatus: "Active",
    owner: "You",
    ownerDid: "DID-0082",
    price: "0.05 ETH",
    duration: "30 days",
  },
  "BC-003": {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    version: "v1.8",
    status: "Access Granted",
    accessStatus: "Active",
    owner: "Engineering Team Alpha",
    ownerDid: "DID-0211",
    price: "0.01 ETH",
    duration: "7 days",
  },
  "BC-005": {
    id: "BC-005",
    name: "Navigation System Specification",
    type: "Document",
    version: "v3.1",
    status: "Access Granted",
    accessStatus: "Expiring Soon",
    owner: "Navigation Systems",
    ownerDid: "DID-0104",
    price: "0.03 ETH",
    duration: "14 days",
  },
} as const;

type AssetId = keyof typeof assets;

const accessHistory = {
  "BC-001": [
    {
      event: "Ownership acquired",
      description: "Asset ownership associated with your wallet.",
      date: "Aug 24, 2026",
      status: "Confirmed",
      actor: "System",
    },
    {
      event: "Access renewed",
      description: "Access policy renewed for the current owner.",
      date: "Sep 25, 2026",
      status: "Confirmed",
      actor: "System",
    },
  ],
  "BC-002": [
    {
      event: "Ownership acquired",
      description: "Asset ownership associated with your wallet.",
      date: "Sep 18, 2026",
      status: "Confirmed",
      actor: "System",
    },
  ],
  "BC-003": [
    {
      event: "Access granted",
      description: "Permission granted to your identity.",
      date: "Sep 24, 2026",
      status: "Confirmed",
      actor: "Priya Sharma",
    },
    {
      event: "Identity verified",
      description: "Your DID was verified before access was granted.",
      date: "Sep 24, 2026",
      status: "Confirmed",
      actor: "System",
    },
  ],
  "BC-005": [
    {
      event: "Access granted",
      description: "Permission granted to your identity.",
      date: "Sep 20, 2026",
      status: "Confirmed",
      actor: "Vikram Singh",
    },
  ],
} as const;

export default function UserAssetAccessPage() {
  const params = useParams();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const assetId = (rawId?.toUpperCase() || "BC-001") as AssetId;

  const asset = assets[assetId] ?? assets["BC-001"];
  const history = accessHistory[asset.id as AssetId] ?? [];

  const isOwned = asset.status === "Owned";
  const isExpiring = asset.accessStatus === "Expiring Soon";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/user/assets/${asset.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            Back to Asset Details
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Link
                  href="/user/assets"
                  className="hover:text-[var(--text)]"
                >
                  My Assets
                </Link>

                <ChevronRight size={13} />

                <Link
                  href={`/user/assets/${asset.id}`}
                  className="hover:text-[var(--text)]"
                >
                  {asset.id}
                </Link>

                <ChevronRight size={13} />

                <span className="text-[var(--text)]">
                  Access Details
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <KeyRound size={20} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                      Access Details
                    </h1>

                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--accent)]">
                      {asset.id}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {asset.name} · {asset.version}
                  </p>
                </div>
              </div>
            </div>

            <StatusBadge status={asset.accessStatus} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Expiring Banner */}
        {isExpiring && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Clock3
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Your access is expiring soon
              </p>

              <p className="mt-1 text-sm leading-5 text-amber-800">
                This permission is currently active but has a limited
                validity window. You may need to request access again
                after it expires.
              </p>
            </div>
          </div>
        )}

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Access Status"
            value={asset.accessStatus}
            icon={asset.accessStatus === "Active" ? CheckCircle2 : Clock3}
            accent={asset.accessStatus === "Active"}
          />

          <MetricCard
            label="Access Type"
            value={isOwned ? "Ownership" : "Permission"}
            icon={isOwned ? Box : KeyRound}
          />

          <MetricCard
            label="Access Window"
            value={asset.duration}
            icon={Clock3}
          />

          <MetricCard
            label="Access Policy"
            value={asset.price}
            icon={ShieldCheck}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Current Access */}
            <section className="rounded-2xl border border-[var(--border)] bg-white">
              <div className="border-b border-[var(--border)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <KeyRound size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-base font-semibold text-[var(--text)]">
                      Current Access
                    </h2>

                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Permission currently associated with your identity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--accent)]">
                        {isOwned ? (
                          <Box size={18} />
                        ) : (
                          <KeyRound size={18} />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {isOwned
                            ? "Owner Access"
                            : "Granted Permission"}
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {isOwned
                            ? "Full ownership-based access"
                            : "Permission granted to your DID"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={asset.accessStatus} />
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
                    <DetailItem
                      label="Granted To"
                      value="Arjun Mehta"
                    />

                    <DetailItem
                      label="Identity"
                      value="DID-0082"
                      mono
                    />

                    <DetailItem
                      label="Wallet"
                      value="0x82A4...91F2"
                      mono
                    />

                    <DetailItem
                      label="Permission"
                      value={isOwned ? "Owner" : "Read"}
                    />

                    <DetailItem
                      label="Granted By"
                      value={isOwned ? "System" : "Priya Sharma"}
                    />

                    <DetailItem
                      label="Duration"
                      value={asset.duration}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Access History */}
            <section className="rounded-2xl border border-[var(--border)] bg-white">
              <div className="border-b border-[var(--border)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--text)]">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-base font-semibold text-[var(--text)]">
                      Access History
                    </h2>

                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Previous access-related events for this asset.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {history.map((event, index) => (
                  <div
                    key={`${event.event}-${index}`}
                    className="flex gap-4 p-5"
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--live-soft)] text-[var(--live)]">
                        <CheckCircle2 size={16} />
                      </div>

                      {index !== history.length - 1 && (
                        <div className="absolute left-1/2 top-9 h-full w-px -translate-x-1/2 bg-[var(--border)]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {event.event}
                        </p>

                        <span className="text-xs text-[var(--text-muted)]">
                          {event.date}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">
                        {event.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span>Actor</span>
                        <span className="font-medium text-[var(--text)]">
                          {event.actor}
                        </span>

                        <span>•</span>

                        <span className="text-[var(--live)]">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Permissions */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h2 className="font-display text-base font-semibold text-[var(--text)]">
                    Your Permissions
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    The actions available to your identity for this asset.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <PermissionItem
                  label="View Asset"
                  enabled
                />

                <PermissionItem
                  label="View Metadata"
                  enabled
                />

                <PermissionItem
                  label="Download"
                  enabled={!isOwned ? true : true}
                />

                <PermissionItem
                  label="Transfer Ownership"
                  enabled={isOwned}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Asset */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <h2 className="font-display text-sm font-semibold text-[var(--text)]">
                Asset
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--asset-soft,var(--bg))] text-[var(--asset)]">
                  <Box size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {asset.name}
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {asset.type} · {asset.version}
                  </p>
                </div>
              </div>

              <Link
                href={`/user/assets/${asset.id}`}
                className="mt-4 flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
              >
                <span>View Asset Details</span>
                <ArrowRightIcon />
              </Link>
            </section>

            {/* Identity */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--identity-soft,var(--bg))] text-[var(--identity)]">
                  <User size={17} />
                </div>

                <div>
                  <h2 className="font-display text-sm font-semibold text-[var(--text)]">
                    Your Identity
                  </h2>

                  <p className="text-xs text-[var(--text-muted)]">
                    Access principal
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <DetailItem
                  label="Name"
                  value="Arjun Mehta"
                />

                <DetailItem
                  label="DID"
                  value="DID-0082"
                  mono
                />

                <DetailItem
                  label="Role"
                  value="Engineer"
                />

                <DetailItem
                  label="Department"
                  value="Radar Systems"
                />
              </div>

              <Link
                href="/user/identity"
                className="mt-4 flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
              >
                <span>View My Identity</span>
                <ArrowRightIcon />
              </Link>
            </section>

            {/* Wallet */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--text)]">
                  <Wallet size={17} />
                </div>

                <div>
                  <h2 className="font-display text-sm font-semibold text-[var(--text)]">
                    Connected Wallet
                  </h2>

                  <p className="text-xs text-[var(--text-muted)]">
                    Current account
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[var(--bg)] p-3">
                <p className="font-mono text-xs text-[var(--text)]">
                  0x82A4...91F2
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[var(--live)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
                  Connected
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 text-[var(--live)]"
                />

                <div>
                  <h2 className="text-sm font-semibold text-[var(--text)]">
                    Access Security
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Access is associated with your verified identity and
                    wallet. Permissions are recorded on-chain.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] py-5 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Access information shown for {asset.id}.
          </p>

          <Link
            href="/user/activity"
            className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
          >
            View Activity History
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: typeof Box;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent
              ? "bg-[var(--live-soft)] text-[var(--live)]"
              : "bg-[var(--accent-soft)] text-[var(--accent)]"
          }`}
        >
          <Icon size={17} />
        </div>

        {accent && (
          <CheckCircle2
            size={15}
            className="text-[var(--live)]"
          />
        )}
      </div>

      <p className="mt-4 text-xs font-medium text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 truncate font-display text-lg font-bold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
        isActive
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-amber-100 bg-amber-50 text-amber-700"
      }`}
    >
      {isActive ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}

      {status}
    </span>
  );
}

function DetailItem({
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
        className={`mt-1 text-xs font-medium text-[var(--text)] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PermissionItem({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-3">
      <span className="text-xs font-medium text-[var(--text)]">
        {label}
      </span>

      {enabled ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--live)]">
          <CheckCircle2 size={14} />
          Allowed
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
          <XCircle size={14} />
          Restricted
        </span>
      )}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <ChevronRight
      size={15}
      className="text-[var(--text-muted)]"
    />
  );
}