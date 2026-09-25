"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Fingerprint,
  History,
  LockKeyhole,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

// =========================================================
// Mock access data
// =========================================================

const accessRecords = [
  {
    id: 1,
    assetId: "BC-001",
    assetName: "Radar Control Module",
    assetType: "CAD / Engineering",
    did: "DID-0211",
    identityName: "Engineering Team Alpha",
    wallet: "0x91D2...72C1",
    status: "Active",
    grantedAt: "Sep 25, 2026 · 14:18",
    expiresAt: "Oct 02, 2026 · 14:18",
    source: "Admin Grant",
  },
  {
    id: 2,
    assetId: "BC-001",
    assetName: "Radar Control Module",
    assetType: "CAD / Engineering",
    did: "DID-0147",
    identityName: "Firmware Division",
    wallet: "0x31B7...A812",
    status: "Active",
    grantedAt: "Sep 24, 2026 · 09:42",
    expiresAt: "Oct 01, 2026 · 09:42",
    source: "Admin Grant",
  },
  {
    id: 3,
    assetId: "BC-002",
    assetName: "Secure Firmware v4.2",
    assetType: "Firmware",
    did: "DID-0082",
    identityName: "Radar Systems",
    wallet: "0x82A4...91F2",
    status: "Active",
    grantedAt: "Sep 23, 2026 · 11:24",
    expiresAt: "Sep 30, 2026 · 11:24",
    source: "Access Request",
  },
  {
    id: 4,
    assetId: "BC-003",
    assetName: "RCM-2048 CAD Blueprint",
    assetType: "CAD / Engineering",
    did: "DID-0082",
    identityName: "Radar Systems",
    wallet: "0x82A4...91F2",
    status: "Active",
    grantedAt: "Sep 24, 2026 · 16:10",
    expiresAt: "Sep 27, 2026 · 16:10",
    source: "Admin Grant",
  },
  {
    id: 5,
    assetId: "BC-003",
    assetName: "RCM-2048 CAD Blueprint",
    assetType: "CAD / Engineering",
    did: "DID-0178",
    identityName: "Sensor Systems",
    wallet: "0xA921...C441",
    status: "Active",
    grantedAt: "Sep 25, 2026 · 10:12",
    expiresAt: "Sep 28, 2026 · 10:12",
    source: "Access Request",
  },
  {
    id: 6,
    assetId: "BC-004",
    assetName: "Thermal Testing Report",
    assetType: "Document",
    did: "DID-0042",
    identityName: "Thermal Testing",
    wallet: "0x54C1...B029",
    status: "Expired",
    grantedAt: "Sep 12, 2026 · 10:15",
    expiresAt: "Sep 19, 2026 · 10:15",
    source: "Access Request",
  },
  {
    id: 7,
    assetId: "BC-005",
    assetName: "Navigation System Specification",
    assetType: "Document",
    did: "DID-0104",
    identityName: "Navigation Division",
    wallet: "0x72F1...D820",
    status: "Active",
    grantedAt: "Sep 20, 2026 · 12:40",
    expiresAt: "Oct 04, 2026 · 12:40",
    source: "Admin Grant",
  },
  {
    id: 8,
    assetId: "BC-006",
    assetName: "Sensor Array Configuration",
    assetType: "Configuration",
    did: "DID-0178",
    identityName: "Sensor Systems",
    wallet: "0xA921...C441",
    status: "Revoked",
    grantedAt: "Sep 18, 2026 · 16:32",
    expiresAt: "Sep 25, 2026 · 16:32",
    source: "Admin Grant",
  },
  {
    id: 9,
    assetId: "BC-002",
    assetName: "Secure Firmware v4.2",
    assetType: "Firmware",
    did: "DID-0211",
    identityName: "Engineering Team Alpha",
    wallet: "0x91D2...72C1",
    status: "Active",
    grantedAt: "Sep 25, 2026 · 08:20",
    expiresAt: "Sep 27, 2026 · 08:20",
    source: "Access Request",
  },
];

// =========================================================
// Page
// =========================================================

export default function AccessControlPage() {
  const [records, setRecords] = useState(accessRecords);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Expired" | "Revoked"
  >("All");

  const [assetFilter, setAssetFilter] = useState("All Assets");

  const [selectedRecord, setSelectedRecord] = useState<
    (typeof accessRecords)[number] | null
  >(null);

  // -------------------------------------------------------
  // Asset filter options
  // -------------------------------------------------------

  const assetOptions = useMemo(() => {
    return [
      "All Assets",
      ...Array.from(
        new Set(records.map((record) => record.assetName))
      ),
    ];
  }, [records]);

  // -------------------------------------------------------
  // Filter records
  // -------------------------------------------------------

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        record.assetName.toLowerCase().includes(searchValue) ||
        record.assetId.toLowerCase().includes(searchValue) ||
        record.did.toLowerCase().includes(searchValue) ||
        record.identityName.toLowerCase().includes(searchValue) ||
        record.wallet.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesAsset =
        assetFilter === "All Assets" ||
        record.assetName === assetFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAsset
      );
    });
  }, [records, search, statusFilter, assetFilter]);

  // -------------------------------------------------------
  // Statistics
  // -------------------------------------------------------

  const activeCount = records.filter(
    (record) => record.status === "Active"
  ).length;

  const expiredCount = records.filter(
    (record) => record.status === "Expired"
  ).length;

  const revokedCount = records.filter(
    (record) => record.status === "Revoked"
  ).length;

  const uniqueIdentities = new Set(
    records
      .filter((record) => record.status === "Active")
      .map((record) => record.did)
  ).size;

  // -------------------------------------------------------
  // Revoke
  // -------------------------------------------------------

  function revokeAccess(id: number) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "Revoked",
            }
          : record
      )
    );

    setSelectedRecord(null);
  }

  return (
    <div className="min-h-screen bg-bg text-text">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <LockKeyhole
                size={17}
                className="text-accent"
              />

              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Management / Access Control
              </span>

            </div>

            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Access Control
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-muted">
              Monitor and manage access permissions across all
              registered digital assets.
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            <Link
              href="/creator-studio/audit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-bg"
            >
              <History size={16} />
              Audit Center
            </Link>

            <Link
              href="/creator-studio/assets"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              Manage Assets
            </Link>

          </div>

        </div>

        {/* ================================================= */}
        {/* Overview stats */}
        {/* ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Active Permissions"
            value={String(activeCount)}
            description="Currently valid"
            icon={CheckCircle2}
            live
          />

          <StatCard
            label="Identities With Access"
            value={String(uniqueIdentities)}
            description="Unique active identities"
            icon={Users}
          />

          <StatCard
            label="Expiring / Expired"
            value={String(expiredCount)}
            description="Requires attention"
            icon={Clock3}
            warning
          />

          <StatCard
            label="Revoked"
            value={String(revokedCount)}
            description="Access removed"
            icon={XCircle}
          />

        </div>

        {/* ================================================= */}
        {/* Attention banner */}
        {/* ================================================= */}

        {expiredCount > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">

            <div className="flex gap-3">

              <ShieldAlert
                size={18}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div className="flex-1">

                <p className="text-sm font-semibold text-amber-900">
                  Access records require attention
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  There are {expiredCount} expired permission
                  {expiredCount !== 1 ? "s" : ""} in the registry.
                  Review the records below and renew or revoke
                  them as required.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setStatusFilter("Expired")}
                className="hidden shrink-0 text-xs font-semibold text-amber-800 underline sm:block"
              >
                View expired
              </button>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* Main access registry */}
        {/* ================================================= */}

        <section className="rounded-xl border border-border bg-surface">

          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}

          <div className="border-b border-border px-5 py-4">

            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="font-display text-base font-semibold">
                  Permission Registry
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  Every identity-to-asset access relationship
                </p>

              </div>

              <div className="text-xs text-text-muted">
                Showing{" "}
                <span className="font-medium text-text">
                  {filteredRecords.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-text">
                  {records.length}
                </span>{" "}
                records
              </div>

            </div>

          </div>

          {/* ------------------------------------------------ */}
          {/* Filters */}
          {/* ------------------------------------------------ */}

          <div className="border-b border-border p-4">

            <div className="grid gap-3 lg:grid-cols-[1fr_200px_auto]">

              {/* Search */}

              <div className="relative">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search asset, DID, identity, or wallet..."
                  className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none transition placeholder:text-text-muted focus:border-accent"
                />

              </div>

              {/* Asset filter */}

              <select
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
                className="h-10 rounded-lg border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {assetOptions.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>

              {/* Status filter */}

              <div className="flex overflow-x-auto rounded-lg border border-border bg-bg p-1">

                {(
                  ["All", "Active", "Expired", "Revoked"] as const
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-surface text-text shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {status}
                  </button>
                ))}

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* Desktop table */}
          {/* ================================================= */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>

                <tr className="border-b border-border text-left">

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Asset
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Identity
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Granted
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Expires
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border last:border-0"
                  >

                    {/* Asset */}

                    <td className="px-5 py-4">

                      <Link
                        href={`/creator-studio/assets/${record.assetId}`}
                        className="group block"
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <LockKeyhole size={16} />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[210px] truncate text-sm font-medium group-hover:text-accent">
                              {record.assetName}
                            </p>

                            <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                              {record.assetId}
                            </p>

                          </div>

                        </div>

                      </Link>

                    </td>

                    {/* Identity */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                          <Fingerprint size={14} />
                        </div>

                        <div>

                          <p className="text-sm font-medium">
                            {record.identityName}
                          </p>

                          <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                            {record.did}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <AccessStatus status={record.status} />
                    </td>

                    {/* Granted */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <CalendarClock size={13} />
                        {record.grantedAt}
                      </div>

                    </td>

                    {/* Expires */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock3 size={13} />
                        {record.expiresAt}
                      </div>

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                          className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-bg"
                        >
                          Details
                        </button>

                        {record.status === "Active" && (
                          <button
                            type="button"
                            onClick={() =>
                              revokeAccess(record.id)
                            }
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Revoke
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* ================================================= */}
          {/* Mobile */}
          {/* ================================================= */}

          <div className="divide-y divide-border md:hidden">

            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-4"
              >

                {/* Top */}

                <div className="flex items-start justify-between gap-3">

                  <Link
                    href={`/creator-studio/assets/${record.assetId}`}
                    className="flex min-w-0 items-center gap-3"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <LockKeyhole size={16} />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium">
                        {record.assetName}
                      </p>

                      <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                        {record.assetId}
                      </p>

                    </div>

                  </Link>

                  <AccessStatus status={record.status} />

                </div>

                {/* Identity */}

                <div className="mt-4 flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Fingerprint size={14} />
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      {record.identityName}
                    </p>

                    <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                      {record.did}
                    </p>

                  </div>

                </div>

                {/* Info */}

                <div className="mt-4 grid grid-cols-2 gap-4">

                  <MobileInfo
                    label="Granted"
                    value={record.grantedAt}
                  />

                  <MobileInfo
                    label="Expires"
                    value={record.expiresAt}
                  />

                  <MobileInfo
                    label="Wallet"
                    value={record.wallet}
                    mono
                  />

                  <MobileInfo
                    label="Source"
                    value={record.source}
                  />

                </div>

                {/* Actions */}

                <div className="mt-4 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRecord(record)
                    }
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium"
                  >
                    View Details
                  </button>

                  {record.status === "Active" && (
                    <button
                      type="button"
                      onClick={() =>
                        revokeAccess(record.id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Revoke
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

          {/* ================================================= */}
          {/* Empty */}
          {/* ================================================= */}

          {filteredRecords.length === 0 && (
            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-bg text-text-muted">
                <Search size={18} />
              </div>

              <p className="mt-3 text-sm font-medium">
                No permissions found
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Try changing the search or filters.
              </p>

            </div>
          )}

        </section>

        {/* ================================================= */}
        {/* Bottom security information */}
        {/* ================================================= */}

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <InfoPanel
            icon={ShieldCheck}
            title="On-chain permission records"
            description="Access changes are recorded through blockchain transactions, providing a verifiable history of permission updates."
          />

          <InfoPanel
            icon={Fingerprint}
            title="Identity-based access"
            description="Permissions are associated with registered identities and their connected wallet addresses."
          />

        </div>

      </div>

      {/* =================================================== */}
      {/* Details Modal */}
      {/* =================================================== */}

      {selectedRecord && (
        <AccessDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onRevoke={() =>
            revokeAccess(selectedRecord.id)
          }
        />
      )}

    </div>
  );
}

// =========================================================
// Stat Card
// =========================================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  live = false,
  warning = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  live?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            warning
              ? "bg-amber-50 text-amber-700"
              : "bg-accent-soft text-accent"
          }`}
        >
          <Icon size={17} />
        </div>

        {live && (
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-live">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            LIVE
          </span>
        )}

      </div>

      <p className="mt-4 font-display text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium">
        {label}
      </p>

      <p className="mt-0.5 text-[11px] text-text-muted">
        {description}
      </p>

    </div>
  );
}

// =========================================================
// Access Status
// =========================================================

function AccessStatus({
  status,
}: {
  status: string;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live-soft px-2.5 py-1 text-[11px] font-semibold text-live">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />
        Active
      </span>
    );
  }

  if (status === "Revoked") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
        <XCircle size={12} />
        Revoked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <Clock3 size={12} />
      Expired
    </span>
  );
}

// =========================================================
// Mobile info
// =========================================================

function MobileInfo({
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

      <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p
        className={`mt-1 text-xs ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}

// =========================================================
// Information Panel
// =========================================================

function InfoPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">

      <div className="flex gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon size={16} />
        </div>

        <div>

          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// Access Details Modal
// =========================================================

function AccessDetailsModal({
  record,
  onClose,
  onRevoke,
}: {
  record: (typeof accessRecords)[number];
  onClose: () => void;
  onRevoke: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-xl border border-border bg-surface shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div>

            <h2 className="font-display text-base font-semibold">
              Permission Details
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
              Access relationship
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted transition hover:bg-bg hover:text-text"
          >
            <X size={18} />
          </button>

        </div>

        {/* Content */}

        <div className="space-y-5 p-5">

          {/* Asset */}

          <div>

            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
              Asset
            </p>

            <Link
              href={`/creator-studio/assets/${record.assetId}`}
              className="mt-1 flex items-center gap-2 text-sm font-medium hover:text-accent"
              onClick={onClose}
            >
              {record.assetName}
              <ArrowUpRight size={14} />
            </Link>

            <p className="mt-0.5 font-mono text-[11px] text-text-muted">
              {record.assetId}
            </p>

          </div>

          {/* Identity */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Fingerprint size={19} />
            </div>

            <div>

              <p className="text-sm font-semibold">
                {record.identityName}
              </p>

              <p className="mt-0.5 font-mono text-xs text-text-muted">
                {record.did}
              </p>

            </div>

          </div>

          {/* Details */}

          <div className="grid grid-cols-2 gap-5">

            <DetailItem
              label="Status"
              value={record.status}
            />

            <DetailItem
              label="Source"
              value={record.source}
            />

            <DetailItem
              label="Granted"
              value={record.grantedAt}
            />

            <DetailItem
              label="Expires"
              value={record.expiresAt}
            />

          </div>

          {/* Wallet */}

          <div>

            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
              Wallet
            </p>

            <div className="mt-1 flex items-center gap-2">

              <Wallet
                size={14}
                className="text-text-muted"
              />

              <p className="break-all font-mono text-xs">
                {record.wallet}
              </p>

            </div>

          </div>

          {/* Verification */}

          <div className="rounded-lg bg-live-soft p-3">

            <div className="flex gap-2">

              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-live"
              />

              <div>

                <p className="text-xs font-semibold text-live">
                  Permission record
                </p>

                <p className="mt-1 text-[11px] leading-4 text-text-muted">
                  This permission is associated with the
                  identity and wallet displayed above.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-bg"
          >
            Close
          </button>

          {record.status === "Active" && (
            <button
              type="button"
              onClick={onRevoke}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Revoke Access
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

// =========================================================
// Detail Item
// =========================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium">
        {value}
      </p>

    </div>
  );
}