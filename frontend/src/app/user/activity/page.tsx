"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Fingerprint,
  History,
  KeyRound,
  Search,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ActivityStatus = "Confirmed" | "Pending" | "Failed";

type ActivityEvent = {
  id: string;
  type:
    | "Access Granted"
    | "Access Renewed"
    | "Asset Registered"
    | "Identity Verified"
    | "Wallet Connected"
    | "Access Revoked";
  title: string;
  description: string;
  asset?: string;
  assetId?: string;
  timestamp: string;
  date: string;
  txHash: string;
  block: string;
  status: ActivityStatus;
  icon: typeof Box;
};

const activities: ActivityEvent[] = [
  {
    id: "ACT-19448",
    type: "Access Granted",
    title: "Access granted",
    description: "You received access to RCM-2048 CAD Blueprint.",
    asset: "RCM-2048 CAD Blueprint",
    assetId: "BC-003",
    timestamp: "34 min ago",
    date: "Sep 26, 2026 · 01:18 AM",
    txHash: "0x82a491f2b731...91f2d80",
    block: "19,452,099",
    status: "Confirmed",
    icon: KeyRound,
  },
  {
    id: "ACT-19447",
    type: "Asset Registered",
    title: "Asset registered",
    description: "Secure Firmware v4.2 was registered to your wallet.",
    asset: "Secure Firmware v4.2",
    assetId: "BC-002",
    timestamp: "2 hrs ago",
    date: "Sep 25, 2026 · 11:42 PM",
    txHash: "0x31b7a8124f62...a812f991",
    block: "19,452,071",
    status: "Confirmed",
    icon: Box,
  },
  {
    id: "ACT-19442",
    type: "Access Renewed",
    title: "Access renewed",
    description: "Access to Radar Control Module was renewed.",
    asset: "Radar Control Module",
    assetId: "BC-001",
    timestamp: "Yesterday",
    date: "Sep 25, 2026 · 04:32 PM",
    txHash: "0x82a4f91c8d31...91f2a712",
    block: "19,451,884",
    status: "Confirmed",
    icon: Clock3,
  },
  {
    id: "ACT-19401",
    type: "Identity Verified",
    title: "Identity verified",
    description: "Your BharatChain identity was successfully verified.",
    timestamp: "Sep 24, 2026",
    date: "Sep 24, 2026 · 10:14 AM",
    txHash: "0x91d272c1b82a...72c1901",
    block: "19,448,721",
    status: "Confirmed",
    icon: Fingerprint,
  },
  {
    id: "ACT-19388",
    type: "Wallet Connected",
    title: "Wallet connected",
    description: "Your wallet was associated with your BharatChain identity.",
    timestamp: "Sep 24, 2026",
    date: "Sep 24, 2026 · 09:58 AM",
    txHash: "0x54c1b0298c31...b02944e",
    block: "19,448,603",
    status: "Confirmed",
    icon: Wallet,
  },
  {
    id: "ACT-19321",
    type: "Access Granted",
    title: "Access granted",
    description: "You received access to Navigation System Specification.",
    asset: "Navigation System Specification",
    assetId: "BC-005",
    timestamp: "Sep 20, 2026",
    date: "Sep 20, 2026 · 03:41 PM",
    txHash: "0x72f1d820b442...d820119",
    block: "19,441,902",
    status: "Confirmed",
    icon: KeyRound,
  },
  {
    id: "ACT-19284",
    type: "Access Revoked",
    title: "Access revoked",
    description: "Your access to Sensor Array Configuration was revoked.",
    asset: "Sensor Array Configuration",
    assetId: "BC-006",
    timestamp: "Sep 18, 2026",
    date: "Sep 18, 2026 · 05:22 PM",
    txHash: "0xa921c441b82a...c441712",
    block: "19,437,288",
    status: "Confirmed",
    icon: XCircle,
  },
];

const filters = [
  "All",
  "Access",
  "Assets",
  "Identity",
] as const;

type Filter = (typeof filters)[number];

function getCategory(type: ActivityEvent["type"]): Filter {
  if (type.includes("Access")) return "Access";
  if (type.includes("Asset")) return "Assets";
  if (type.includes("Identity") || type.includes("Wallet")) {
    return "Identity";
  }

  return "All";
}

function statusStyles(status: ActivityStatus) {
  if (status === "Confirmed") {
    return {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }

  if (status === "Pending") {
    return {
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }

  return {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-100",
  };
}

function ActivityIcon({
  icon: Icon,
}: {
  icon: typeof Box;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
      <Icon size={18} strokeWidth={1.8} />
    </div>
  );
}

export default function UserActivityPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | ActivityStatus
  >("All");
  const [search, setSearch] = useState("");

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesCategory =
        filter === "All" || getCategory(activity.type) === filter;

      const matchesStatus =
        statusFilter === "All" || activity.status === statusFilter;

      const matchesSearch =
        !query ||
        activity.id.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query) ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.asset?.toLowerCase().includes(query) ||
        activity.assetId?.toLowerCase().includes(query) ||
        activity.txHash.toLowerCase().includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [filter, statusFilter, search]);

  const confirmedCount = activities.filter(
    (activity) => activity.status === "Confirmed",
  ).length;

  const accessCount = activities.filter(
    (activity) => getCategory(activity.type) === "Access",
  ).length;

  const assetCount = activities.filter(
    (activity) => getCategory(activity.type) === "Assets",
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Page Header */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Link
                  href="/user"
                  className="transition-colors hover:text-[var(--text)]"
                >
                  Dashboard
                </Link>

                <ChevronRight size={14} />

                <span className="text-[var(--text)]">
                  Activity & History
                </span>
              </div>

              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                Activity & History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Review actions associated with your identity, assets,
                permissions, and wallet on the BharatChain network.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
              <History
                size={17}
                className="text-[var(--accent)]"
              />
              <span className="text-sm font-medium text-[var(--text)]">
                Personal Activity Log
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={History}
            label="Total Events"
            value={activities.length.toString()}
            detail="Recorded activity"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Confirmed"
            value={confirmedCount.toString()}
            detail="Verified on-chain"
          />

          <MetricCard
            icon={KeyRound}
            label="Access Events"
            value={accessCount.toString()}
            detail="Permissions activity"
          />

          <MetricCard
            icon={Box}
            label="Asset Events"
            value={assetCount.toString()}
            detail="Asset activity"
          />
        </div>

        {/* Search + Filters */}
        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activity, asset, transaction..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--border)] bg-white text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Status
            </span>

            {(["All", "Confirmed", "Pending", "Failed"] as const).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setStatusFilter(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    statusFilter === item
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          {/* Desktop Activity List */}
          <div className="hidden lg:block">
            {filteredActivities.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {filteredActivities.map((activity) => {
                  const status = statusStyles(activity.status);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--bg)]"
                    >
                      <ActivityIcon icon={activity.icon} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-[var(--text)]">
                            {activity.title}
                          </h3>

                          <span className="font-mono text-[10px] text-[var(--text-muted)]">
                            {activity.id}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                          {activity.description}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span>{activity.timestamp}</span>

                          {activity.assetId && (
                            <>
                              <span>•</span>
                              <Link
                                href={`/user/assets/${activity.assetId}`}
                                className="font-medium text-[var(--accent)] hover:underline"
                              >
                                {activity.assetId}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="hidden xl:block">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Block
                        </p>
                        <p className="font-mono text-xs text-[var(--text)]">
                          {activity.block}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon size={13} />
                        {activity.status}
                      </div>

                      <Link
                        href={`/user/activity?event=${activity.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
                        aria-label={`View ${activity.id}`}
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Mobile Activity Cards */}
          <div className="divide-y divide-[var(--border)] lg:hidden">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const status = statusStyles(activity.status);
                const StatusIcon = status.icon;

                return (
                  <div key={activity.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <ActivityIcon icon={activity.icon} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-[var(--text)]">
                              {activity.title}
                            </h3>

                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              {activity.id}
                            </p>
                          </div>

                          <div
                            className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${status.className}`}
                          >
                            <StatusIcon size={11} />
                            {activity.status}
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-5 text-[var(--text-muted)]">
                          {activity.description}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-[var(--bg)] p-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                              Time
                            </p>
                            <p className="mt-1 text-xs font-medium text-[var(--text)]">
                              {activity.timestamp}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                              Block
                            </p>
                            <p className="mt-1 font-mono text-xs text-[var(--text)]">
                              {activity.block}
                            </p>
                          </div>
                        </div>

                        {activity.assetId && (
                          <Link
                            href={`/user/assets/${activity.assetId}`}
                            className="mt-3 flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
                          >
                            <span>{activity.asset}</span>
                            <ChevronRight
                              size={14}
                              className="text-[var(--text-muted)]"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        {/* Blockchain Verification */}
        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--live-soft)] text-[var(--live)]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold text-[var(--text)]">
                  Blockchain-verified history
                </h2>

                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                  Activity records are tied to blockchain transactions,
                  allowing actions to be independently verified.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <VerificationRow
                label="Network"
                value="BharatChain Network"
              />

              <VerificationRow
                label="Identity"
                value="DID-0082"
              />

              <VerificationRow
                label="Wallet"
                value="0x82A4...91F2"
                mono
              />

              <VerificationRow
                label="Record Integrity"
                value="Verified"
                verified
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <ExternalLink size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold text-[var(--text)]">
                  Understanding your activity
                </h2>

                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                  Every activity entry represents an action involving your
                  identity, wallet, assets, or access permissions.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow
                icon={KeyRound}
                title="Access events"
                description="Permissions granted, renewed, or revoked."
              />

              <InfoRow
                icon={Box}
                title="Asset events"
                description="Assets registered or associated with you."
              />

              <InfoRow
                icon={Fingerprint}
                title="Identity events"
                description="Identity and wallet verification activity."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] py-5 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredActivities.length} of {activities.length} activity
            events.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
            <span>Blockchain activity is verifiable on-chain.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Box;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon size={17} />
        </div>

        <CheckCircle2
          size={16}
          className="text-[var(--live)]"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[var(--text-muted)]">
          {label}
        </p>

        <p className="mt-1 font-display text-2xl font-bold text-[var(--text)]">
          {value}
        </p>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

function VerificationRow({
  label,
  value,
  mono = false,
  verified = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
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

        {verified && (
          <CheckCircle2
            size={14}
            className="text-[var(--live)]"
          />
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Box;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg)] p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--accent)]">
        <Icon size={15} />
      </div>

      <div>
        <p className="text-xs font-semibold text-[var(--text)]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg)] text-[var(--text-muted)]">
        <History size={21} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
        No activity found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--text-muted)]">
        Try changing your search or filters to find a different activity
        record.
      </p>
    </div>
  );
}