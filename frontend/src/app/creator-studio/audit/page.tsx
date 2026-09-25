"use client";

import {
  ArrowUpRight,
  Blocks,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  History,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type AuditStatus = "Confirmed" | "Pending" | "Failed";

type AuditEventType =
  | "Asset Minted"
  | "Identity Registered"
  | "Access Granted"
  | "Access Revoked"
  | "Ownership Assigned"
  | "Permission Updated";

type AuditEvent = {
  id: string;
  block: string;
  timestamp: string;
  event: AuditEventType;
  assetId?: string;
  assetName?: string;
  actor: string;
  actorDid?: string;
  wallet: string;
  transactionHash: string;
  status: AuditStatus;
  description: string;
};

const auditEvents: AuditEvent[] = [
  {
    id: "EVT-19452",
    block: "19,452,107",
    timestamp: "Sep 26, 2026 · 12:42:08",
    event: "Asset Minted",
    assetId: "BC-007",
    assetName: "Secure Navigation Controller",
    actor: "Rohan Desai",
    actorDid: "DID-0026",
    wallet: "0x82A4...91F2",
    transactionHash: "0x82a4f91c8d31...91f2a712",
    status: "Confirmed",
    description:
      "Digital asset registered on-chain and NFT ownership assigned to the creator wallet.",
  },
  {
    id: "EVT-19451",
    block: "19,452,106",
    timestamp: "Sep 26, 2026 · 12:39:51",
    event: "Ownership Assigned",
    assetId: "BC-002",
    assetName: "Secure Firmware v4.2",
    actor: "Rohan Desai",
    actorDid: "DID-0026",
    wallet: "0x31B7...A812",
    transactionHash: "0x31b7a8124f62...a812f991",
    status: "Confirmed",
    description:
      "Asset ownership was transferred to the authorized wallet.",
  },
  {
    id: "EVT-19450",
    block: "19,452,105",
    timestamp: "Sep 26, 2026 · 12:36:24",
    event: "Permission Updated",
    assetId: "BC-003",
    assetName: "RCM-2048 CAD Blueprint",
    actor: "Priya Sharma",
    actorDid: "DID-0147",
    wallet: "0x91D2...72C1",
    transactionHash: "0x91d272c1b82a...72c1901",
    status: "Confirmed",
    description:
      "Access policy parameters were updated for the registered asset.",
  },
  {
    id: "EVT-19449",
    block: "19,452,104",
    timestamp: "Sep 26, 2026 · 12:31:09",
    event: "Access Revoked",
    assetId: "BC-004",
    assetName: "Thermal Testing Report",
    actor: "Neha Kapoor",
    actorDid: "DID-0042",
    wallet: "0x54C1...B029",
    transactionHash: "0x54c1b0298c31...b02944e",
    status: "Confirmed",
    description:
      "Access permission was revoked for the specified identity.",
  },
  {
    id: "EVT-19448",
    block: "19,452,099",
    timestamp: "Sep 26, 2026 · 12:22:47",
    event: "Access Granted",
    assetId: "BC-001",
    assetName: "Radar Control Module",
    actor: "Arjun Mehta",
    actorDid: "DID-0082",
    wallet: "0x82A4...91F2",
    transactionHash: "0x82a491f2b731...91f2d80",
    status: "Confirmed",
    description:
      "An identity received an active access permission for the asset.",
  },
  {
    id: "EVT-19447",
    block: "19,452,093",
    timestamp: "Sep 26, 2026 · 12:15:31",
    event: "Identity Registered",
    actor: "Kavya Nair",
    actorDid: "DID-0193",
    wallet: "0x7B12...E902",
    transactionHash: "0x7b12e902d431...e902712",
    status: "Confirmed",
    description:
      "A new decentralized identity was registered in the identity registry.",
  },
  {
    id: "EVT-19446",
    block: "19,452,088",
    timestamp: "Sep 26, 2026 · 12:08:16",
    event: "Permission Updated",
    assetId: "BC-005",
    assetName: "Navigation System Specification",
    actor: "Vikram Singh",
    actorDid: "DID-0104",
    wallet: "0x72F1...D820",
    transactionHash: "0x72f1d820b442...d820119",
    status: "Confirmed",
    description:
      "The access duration for the asset was updated.",
  },
  {
    id: "EVT-19445",
    block: "19,452,077",
    timestamp: "Sep 26, 2026 · 11:54:03",
    event: "Access Granted",
    assetId: "BC-002",
    assetName: "Secure Firmware v4.2",
    actor: "Arjun Mehta",
    actorDid: "DID-0082",
    wallet: "0x82A4...91F2",
    transactionHash: "0x82a491f2c81e...91f2c44",
    status: "Pending",
    description:
      "Access request transaction has been submitted and is awaiting confirmation.",
  },
  {
    id: "EVT-19444",
    block: "19,452,071",
    timestamp: "Sep 26, 2026 · 11:47:28",
    event: "Access Revoked",
    assetId: "BC-006",
    assetName: "Sensor Array Configuration",
    actor: "Aisha Khan",
    actorDid: "DID-0178",
    wallet: "0xA921...C441",
    transactionHash: "0xa921c441f712...c441832",
    status: "Failed",
    description:
      "The submitted access revocation transaction failed during execution.",
  },
];

const eventFilters = [
  "All Events",
  "Asset Minted",
  "Identity Registered",
  "Access Granted",
  "Access Revoked",
  "Ownership Assigned",
  "Permission Updated",
] as const;

const statusFilters = [
  "All Status",
  "Confirmed",
  "Pending",
  "Failed",
] as const;

export default function AuditCenterPage() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] =
    useState<(typeof eventFilters)[number]>("All Events");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]>("All Status");

  const [selectedEvent, setSelectedEvent] =
    useState<AuditEvent | null>(null);

  const [events, setEvents] = useState(auditEvents);

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.id.toLowerCase().includes(query) ||
        event.event.toLowerCase().includes(query) ||
        event.assetId?.toLowerCase().includes(query) ||
        event.assetName?.toLowerCase().includes(query) ||
        event.actor.toLowerCase().includes(query) ||
        event.actorDid?.toLowerCase().includes(query) ||
        event.wallet.toLowerCase().includes(query) ||
        event.transactionHash.toLowerCase().includes(query) ||
        event.block.toLowerCase().includes(query);

      const matchesEvent =
        eventFilter === "All Events" ||
        event.event === eventFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        event.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [events, search, eventFilter, statusFilter]);

  const confirmedCount = events.filter(
    (event) => event.status === "Confirmed"
  ).length;

  const pendingCount = events.filter(
    (event) => event.status === "Pending"
  ).length;

  const failedCount = events.filter(
    (event) => event.status === "Failed"
  ).length;

  const latestBlock = events.reduce(
    (max, event) => Math.max(max, Number(event.block.replace(",", ""))),
    0
  );

  function copyText(value: string) {
    navigator.clipboard?.writeText(value);
  }

  function refreshAudit() {
    setEvents([...events]);
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-muted">
              <Link
                href="/creator-studio"
                className="transition-colors hover:text-accent"
              >
                Creator Studio
              </Link>

              <ChevronRight size={14} />

              <span>Audit Center</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <History size={21} />
              </div>

              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Audit Center
                </h1>

                <p className="mt-0.5 text-sm text-text-muted">
                  Verify blockchain activity, transactions, and access events.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={refreshAudit}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-bg"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-8">
        {/* Network status */}
        <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Blocks size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Blockchain Network Operational
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Latest indexed block #{latestBlock.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Audit Events"
            value={events.length}
            description="Indexed activity records"
            icon={History}
            iconClass="bg-accent-soft text-accent"
          />

          <StatCard
            label="Confirmed"
            value={confirmedCount}
            description="Verified on-chain"
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            description="Awaiting confirmation"
            icon={Clock3}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Failed"
            value={failedCount}
            description="Requires investigation"
            icon={XCircle}
            iconClass="bg-red-50 text-red-600"
          />
        </section>

        {/* Audit integrity panel */}
        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <IntegrityCard
            icon={ShieldCheck}
            title="Immutable Records"
            description="Confirmed events are tied to blockchain transactions and cannot be silently modified."
          />

          <IntegrityCard
            icon={FileCheck2}
            title="Transaction Verification"
            description="Every event can be traced to its transaction hash and block number."
          />

          <IntegrityCard
            icon={LockKeyhole}
            title="Access Accountability"
            description="Access grants, revocations, and policy changes remain auditable."
          />
        </section>

        {/* Registry */}
        <section className="mt-6 rounded-2xl border border-border bg-surface">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Blockchain Audit Log
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {filteredEvents.length} of {events.length} events shown
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}
              <div className="relative min-w-[280px]">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search transaction, asset, DID..."
                  className="h-10 w-full rounded-xl border border-border bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
              </div>

              {/* Event filter */}
              <select
                value={eventFilter}
                onChange={(event) =>
                  setEventFilter(
                    event.target.value as (typeof eventFilters)[number]
                  )
                }
                className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {eventFilters.map((event) => (
                  <option key={event}>{event}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as (typeof statusFilters)[number]
                  )
                }
                className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {statusFilters.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-border bg-bg/60 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Asset</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Block</th>
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border last:border-0 hover:bg-bg/40"
                  >
                    {/* Event */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <EventIcon event={event.event} />

                        <div>
                          <p className="text-sm font-semibold">
                            {event.event}
                          </p>

                          <p className="mt-0.5 text-xs text-text-muted">
                            {event.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Asset */}
                    <td className="px-5 py-4">
                      {event.assetId ? (
                        <Link
                          href={`/creator-studio/assets/${event.assetId}`}
                          className="group"
                        >
                          <p className="text-sm font-medium transition group-hover:text-accent">
                            {event.assetName}
                          </p>

                          <p className="mt-0.5 font-mono text-xs text-text-muted">
                            {event.assetId}
                          </p>
                        </Link>
                      ) : (
                        <span className="text-sm text-text-muted">
                          Identity Registry
                        </span>
                      )}
                    </td>

                    {/* Actor */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {event.actor}
                        </p>

                        {event.actorDid && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {event.actorDid}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Block */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Blocks
                          size={14}
                          className="text-text-muted"
                        />

                        <span className="font-mono text-xs">
                          #{event.block}
                        </span>
                      </div>
                    </td>

                    {/* Transaction */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          copyText(event.transactionHash)
                        }
                        className="group flex items-center gap-2 font-mono text-xs text-text-muted transition hover:text-accent"
                        title="Copy transaction hash"
                      >
                        {event.transactionHash}
                        <Copy
                          size={13}
                          className="opacity-0 transition group-hover:opacity-100"
                        />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={event.status} />
                    </td>

                    {/* Details */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                      >
                        View
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet */}
          <div className="divide-y divide-border lg:hidden">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <EventIcon event={event.event} />

                    <div>
                      <p className="text-sm font-semibold">
                        {event.event}
                      </p>

                      <p className="mt-0.5 font-mono text-xs text-text-muted">
                        {event.id}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={event.status} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MobileField
                    label="Asset"
                    value={event.assetId ?? "Identity Registry"}
                  />

                  <MobileField
                    label="Block"
                    value={`#${event.block}`}
                    mono
                  />

                  <MobileField
                    label="Actor"
                    value={event.actor}
                  />

                  <MobileField
                    label="DID"
                    value={event.actorDid ?? "—"}
                    mono
                  />

                  <MobileField
                    label="Transaction"
                    value={event.transactionHash}
                    mono
                  />

                  <MobileField
                    label="Timestamp"
                    value={event.timestamp}
                  />
                </div>

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                >
                  View Audit Details
                  <ArrowUpRight size={15} />
                </button>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-text-muted">
                <Search size={21} />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No audit events found
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* Audit explanation */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Audit Trail Integrity
              </h3>

              <p className="mt-1 max-w-5xl text-sm leading-6 text-text-muted">
                BharatChain audit records are designed to provide a
                traceable history of identity registration, asset
                registration, ownership changes, access permissions, and
                policy updates. Confirmed records are associated with
                blockchain transaction hashes and block numbers for
                independent verification.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Details Modal */}
      {selectedEvent && (
        <AuditDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">
            {label}
          </p>

          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Event Icon                                                                 */
/* -------------------------------------------------------------------------- */

function EventIcon({
  event,
}: {
  event: AuditEventType;
}) {
  const config: Record<
    AuditEventType,
    {
      icon: React.ElementType;
      className: string;
    }
  > = {
    "Asset Minted": {
      icon: FileCheck2,
      className: "bg-amber-50 text-amber-600",
    },
    "Identity Registered": {
      icon: Fingerprint,
      className: "bg-accent-soft text-accent",
    },
    "Access Granted": {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-600",
    },
    "Access Revoked": {
      icon: LockKeyhole,
      className: "bg-red-50 text-red-600",
    },
    "Ownership Assigned": {
      icon: Wallet,
      className: "bg-indigo-50 text-indigo-600",
    },
    "Permission Updated": {
      icon: ShieldCheck,
      className: "bg-teal-50 text-teal-600",
    },
  };

  const item = config[event];
  const Icon = item.icon;

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.className}`}
    >
      <Icon size={17} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: AuditStatus;
}) {
  const config = {
    Confirmed: {
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    Pending: {
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700 border-amber-100",
    },
    Failed: {
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-100",
    },
  };

  const item = config[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Integrity Card                                                             */
/* -------------------------------------------------------------------------- */

function IntegrityCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-text-muted">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Field                                                               */
/* -------------------------------------------------------------------------- */

function MobileField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-bg p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-sm font-medium ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Audit Details Modal                                                        */
/* -------------------------------------------------------------------------- */

function AuditDetailsModal({
  event,
  onClose,
}: {
  event: AuditEvent;
  onClose: () => void;
}) {
  function copyText(value: string) {
    navigator.clipboard?.writeText(value);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <EventIcon event={event.event} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold">
                  {event.event}
                </h2>

                <StatusBadge status={event.status} />
              </div>

              <p className="mt-1 font-mono text-xs text-text-muted">
                {event.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-bg hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-border bg-bg p-4">
            <p className="text-sm leading-6 text-text-muted">
              {event.description}
            </p>
          </div>

          {/* Block information */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Blockchain Record
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Block Number"
                value={`#${event.block}`}
              />

              <DetailItem
                label="Timestamp"
                value={event.timestamp}
              />

              <DetailItem
                label="Network"
                value="BharatChain Network"
              />

              <DetailItem
                label="Confirmation"
                value={event.status}
              />
            </div>
          </div>

          {/* Transaction */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Transaction
            </p>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg p-3.5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Transaction Hash
                </p>

                <p className="mt-1 break-all font-mono text-xs">
                  {event.transactionHash}
                </p>
              </div>

              <button
                onClick={() => copyText(event.transactionHash)}
                className="shrink-0 rounded-lg p-2 text-text-muted transition hover:bg-surface hover:text-accent"
                title="Copy transaction hash"
              >
                <Copy size={15} />
              </button>
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg">
              <ExternalLink size={15} />
              View on Block Explorer
            </button>
          </div>

          {/* Asset */}
          {event.assetId && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Asset
              </p>

              <Link
                href={`/creator-studio/assets/${event.assetId}`}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border border-border bg-bg p-4 transition hover:border-accent/30 hover:bg-accent-soft/40"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {event.assetName}
                  </p>

                  <p className="mt-1 font-mono text-xs text-text-muted">
                    {event.assetId}
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-text-muted"
                />
              </Link>
            </div>
          )}

          {/* Actor */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Actor
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Identity"
                value={event.actor}
              />

              <DetailItem
                label="DID"
                value={event.actorDid ?? "—"}
              />

              <DetailItem
                label="Wallet"
                value={event.wallet}
              />

              <DetailItem
                label="Event Type"
                value={event.event}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-border pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck size={17} />
            </div>

            <p className="text-xs leading-5 text-text-muted">
              This record is associated with a blockchain transaction and
              can be independently verified using the transaction hash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail Item                                                                */
/* -------------------------------------------------------------------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-bg p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}