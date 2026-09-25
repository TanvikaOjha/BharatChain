"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Fingerprint,
  History,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

// ---------------------------------------------------------
// Mock asset data
// ---------------------------------------------------------

const assets = {
  "BC-001": {
    id: "BC-001",
    name: "Radar Control Module",
    type: "CAD / Engineering",
    status: "Active",
    version: "v2.4",
    price: "0.02 ETH",
    duration: "7 days",
    tokenId: "1",
  },

  "BC-002": {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    status: "Active",
    version: "v4.2",
    price: "0.05 ETH",
    duration: "30 days",
    tokenId: "2",
  },

  "BC-003": {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    status: "Active",
    version: "v1.8",
    price: "0.01 ETH",
    duration: "3 days",
    tokenId: "3",
  },
};

const fallbackAsset = assets["BC-001"];

// ---------------------------------------------------------
// Mock access records
// ---------------------------------------------------------

const initialAccessRecords = [
  {
    id: 1,
    did: "DID-0211",
    name: "Engineering Team Alpha",
    wallet: "0x91D2...72C1",
    status: "Active",
    grantedAt: "Sep 25, 2026 · 14:18",
    expiresAt: "Oct 02, 2026 · 14:18",
    source: "Admin Grant",
  },
  {
    id: 2,
    did: "DID-0147",
    name: "Firmware Division",
    wallet: "0x31B7...A812",
    status: "Active",
    grantedAt: "Sep 24, 2026 · 09:42",
    expiresAt: "Oct 01, 2026 · 09:42",
    source: "Admin Grant",
  },
  {
    id: 3,
    did: "DID-0082",
    name: "Radar Systems",
    wallet: "0x82A4...91F2",
    status: "Active",
    grantedAt: "Sep 23, 2026 · 11:24",
    expiresAt: "Sep 30, 2026 · 11:24",
    source: "Access Request",
  },
  {
    id: 4,
    did: "DID-0042",
    name: "Thermal Testing",
    wallet: "0x54C1...B029",
    status: "Expired",
    grantedAt: "Sep 12, 2026 · 10:15",
    expiresAt: "Sep 19, 2026 · 10:15",
    source: "Access Request",
  },
  {
    id: 5,
    did: "DID-0178",
    name: "Sensor Systems",
    wallet: "0xA921...C441",
    status: "Revoked",
    grantedAt: "Sep 18, 2026 · 16:32",
    expiresAt: "Sep 25, 2026 · 16:32",
    source: "Admin Grant",
  },
];

// ---------------------------------------------------------
// Page
// ---------------------------------------------------------

export default function AssetAccessPage() {
  const params = useParams();

  const assetId = String(params.id).toUpperCase();

  const asset =
    assets[assetId as keyof typeof assets] ?? fallbackAsset;

  const [accessRecords, setAccessRecords] = useState(
    initialAccessRecords
  );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Expired" | "Revoked"
  >("All");

  const [showGrantModal, setShowGrantModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<
    (typeof initialAccessRecords)[number] | null
  >(null);

  // -------------------------------------------------------
  // Filter access records
  // -------------------------------------------------------

  const filteredRecords = useMemo(() => {
    return accessRecords.filter((record) => {
      const matchesSearch =
        record.did.toLowerCase().includes(search.toLowerCase()) ||
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.wallet.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accessRecords, search, statusFilter]);

  // -------------------------------------------------------
  // Revoke access
  // -------------------------------------------------------

  function revokeAccess(id: number) {
    setAccessRecords((records) =>
      records.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "Revoked",
            }
          : record
      )
    );

    setSelectedUser(null);
  }

  // -------------------------------------------------------
  // Stats
  // -------------------------------------------------------

  const activeCount = accessRecords.filter(
    (record) => record.status === "Active"
  ).length;

  const expiredCount = accessRecords.filter(
    (record) => record.status === "Expired"
  ).length;

  const revokedCount = accessRecords.filter(
    (record) => record.status === "Revoked"
  ).length;

  return (
    <div className="min-h-screen bg-bg text-text">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* Back */}
        {/* ================================================= */}

        <Link
          href={`/creator-studio/assets/${asset.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-text"
        >
          <ArrowLeft size={16} />
          Back to Asset
        </Link>

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="mb-2 flex flex-wrap items-center gap-2">

              <span className="font-mono text-xs text-text-muted">
                {asset.id}
              </span>

              <span className="text-text-muted">
                /
              </span>

              <span className="text-xs text-text-muted">
                Access Management
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <LockKeyhole size={23} />
              </div>

              <div>

                <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Access Management
                </h1>

                <p className="mt-1 text-sm text-text-muted">
                  Manage permissions for{" "}
                  <span className="font-medium text-text">
                    {asset.name}
                  </span>
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => setShowGrantModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={17} />
            Grant Access
          </button>

        </div>

        {/* ================================================= */}
        {/* Asset summary */}
        {/* ================================================= */}

        <section className="mb-6 rounded-xl border border-border bg-surface">

          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Fingerprint size={21} />
              </div>

              <div>

                <p className="text-sm font-semibold">
                  {asset.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">

                  <span>{asset.type}</span>

                  <span>•</span>

                  <span>{asset.version}</span>

                  <span>•</span>

                  <span className="font-mono">
                    Token #{asset.tokenId}
                  </span>

                </div>

              </div>

            </div>

            <div className="flex flex-wrap gap-6">

              <PolicyItem
                label="Access Price"
                value={asset.price}
              />

              <PolicyItem
                label="Duration"
                value={asset.duration}
              />

              <PolicyItem
                label="Status"
                value={asset.status}
                live
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* Statistics */}
        {/* ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Records"
            value={String(accessRecords.length)}
            icon={Users}
          />

          <StatCard
            label="Active Access"
            value={String(activeCount)}
            icon={CheckCircle2}
            live
          />

          <StatCard
            label="Expired"
            value={String(expiredCount)}
            icon={Clock3}
          />

          <StatCard
            label="Revoked"
            value={String(revokedCount)}
            icon={XCircle}
          />

        </div>

        {/* ================================================= */}
        {/* Access records */}
        {/* ================================================= */}

        <section className="rounded-xl border border-border bg-surface">

          {/* ----------------------------------------------- */}
          {/* Section header */}
          {/* ----------------------------------------------- */}

          <div className="border-b border-border px-5 py-4">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="font-display text-base font-semibold">
                  Access Holders
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  Users and identities currently associated with this asset
                </p>

              </div>

              <Link
                href="/creator-studio/audit"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                View audit history
                <ArrowUpRight size={14} />
              </Link>

            </div>

          </div>

          {/* ----------------------------------------------- */}
          {/* Filters */}
          {/* ----------------------------------------------- */}

          <div className="border-b border-border p-4">

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by DID, name, or wallet..."
                  className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none transition placeholder:text-text-muted focus:border-accent"
                />

              </div>

              {/* Status filters */}

              <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-bg p-1">

                {(["All", "Active", "Expired", "Revoked"] as const).map(
                  (status) => (
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
                  )
                )}

              </div>

            </div>

          </div>

          {/* ----------------------------------------------- */}
          {/* Desktop table */}
          {/* ----------------------------------------------- */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>
                <tr className="border-b border-border text-left">

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Identity
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Wallet
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

                    {/* Identity */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                          <Fingerprint size={16} />
                        </div>

                        <div>

                          <p className="text-sm font-medium">
                            {record.name}
                          </p>

                          <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                            {record.did}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Wallet */}

                    <td className="px-5 py-4">

                      <p className="font-mono text-xs text-text">
                        {record.wallet}
                      </p>

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

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => setSelectedUser(record)}
                          className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-bg"
                        >
                          Details
                        </button>

                        {record.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => revokeAccess(record.id)}
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

          {/* ----------------------------------------------- */}
          {/* Mobile cards */}
          {/* ----------------------------------------------- */}

          <div className="divide-y divide-border md:hidden">

            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Fingerprint size={16} />
                    </div>

                    <div>

                      <p className="text-sm font-medium">
                        {record.name}
                      </p>

                      <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                        {record.did}
                      </p>

                    </div>

                  </div>

                  <AccessStatus status={record.status} />

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <MobileInfo
                    label="Wallet"
                    value={record.wallet}
                    mono
                  />

                  <MobileInfo
                    label="Expires"
                    value={record.expiresAt}
                  />

                  <MobileInfo
                    label="Granted"
                    value={record.grantedAt}
                  />

                  <MobileInfo
                    label="Source"
                    value={record.source}
                  />

                </div>

                <div className="mt-4 flex gap-2">

                  <button
                    type="button"
                    onClick={() => setSelectedUser(record)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium"
                  >
                    View Details
                  </button>

                  {record.status === "Active" && (
                    <button
                      type="button"
                      onClick={() => revokeAccess(record.id)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Revoke
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

          {/* ----------------------------------------------- */}
          {/* Empty state */}
          {/* ----------------------------------------------- */}

          {filteredRecords.length === 0 && (
            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-bg text-text-muted">
                <Search size={18} />
              </div>

              <p className="mt-3 text-sm font-medium">
                No access records found
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        </section>

        {/* ================================================= */}
        {/* Security notice */}
        {/* ================================================= */}

        <div className="mt-6 rounded-xl border border-border bg-surface p-4">

          <div className="flex gap-3">

            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-live"
            />

            <div>

              <p className="text-sm font-medium">
                Access changes are recorded on-chain
              </p>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Granting or revoking access creates a blockchain
                transaction. The resulting transaction hash can be
                used to independently verify the change.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================== */}
      {/* Grant Access Modal */}
      {/* =================================================== */}

      {showGrantModal && (
        <GrantAccessModal
          asset={asset}
          onClose={() => setShowGrantModal(false)}
          onGrant={(did, name, wallet, duration) => {

            const now = new Date();

            const expires = new Date(now);

            expires.setDate(
              expires.getDate() +
                Number(duration)
            );

            const newRecord = {
              id: Date.now(),
              did,
              name,
              wallet,
              status: "Active",
              grantedAt: now.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
              expiresAt: expires.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
              source: "Admin Grant",
            };

            setAccessRecords((records) => [
              newRecord,
              ...records,
            ]);

            setShowGrantModal(false);
          }}
        />
      )}

      {/* =================================================== */}
      {/* User Details Modal */}
      {/* =================================================== */}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRevoke={() => revokeAccess(selectedUser.id)}
        />
      )}

    </div>
  );
}

// =========================================================
// Policy Item
// =========================================================

function PolicyItem({
  label,
  value,
  live = false,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div>

      <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-1.5">

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

// =========================================================
// Stat Card
// =========================================================

function StatCard({
  label,
  value,
  icon: Icon,
  live = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
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

      <p className="mt-1 text-xs text-text-muted">
        {label}
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
// Mobile Info
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
// Grant Access Modal
// =========================================================

function GrantAccessModal({
  asset,
  onClose,
  onGrant,
}: {
  asset: {
    name: string;
    price: string;
    duration: string;
  };
  onClose: () => void;
  onGrant: (
    did: string,
    name: string,
    wallet: string,
    duration: string
  ) => void;
}) {
  const [did, setDid] = useState("");
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [duration, setDuration] = useState("7");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div>

            <h2 className="font-display text-base font-semibold">
              Grant Access
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
              Give an identity permission to access this asset
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

        {/* Form */}

        <div className="space-y-5 p-5">

          {/* Asset */}

          <div className="rounded-lg bg-bg p-3">

            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
              Asset
            </p>

            <p className="mt-1 text-sm font-medium">
              {asset.name}
            </p>

          </div>

          {/* DID */}

          <FormField label="Identity DID">

            <div className="relative">

              <Fingerprint
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="DID-0248"
                className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent"
              />

            </div>

          </FormField>

          {/* Name */}

          <FormField label="Identity Name">

            <div className="relative">

              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engineering Team Beta"
                className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent"
              />

            </div>

          </FormField>

          {/* Wallet */}

          <FormField label="Wallet Address">

            <div className="relative">

              <Wallet
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 font-mono text-xs outline-none focus:border-accent"
              />

            </div>

          </FormField>

          {/* Duration */}

          <FormField label="Access Duration">

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
            >
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>

          </FormField>

          {/* Policy */}

          <div className="rounded-lg border border-border bg-bg p-3">

            <div className="flex items-center justify-between text-xs">

              <span className="text-text-muted">
                Asset access price
              </span>

              <span className="font-medium">
                {asset.price}
              </span>

            </div>

            <p className="mt-2 text-[11px] leading-4 text-text-muted">
              Administrative grants bypass the consumer payment
              flow. The grant is recorded as an explicit access
              permission for the selected identity.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-bg"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!did || !name || !wallet}
            onClick={() =>
              onGrant(
                did,
                name,
                wallet,
                duration
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            Grant Access
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// User Details Modal
// =========================================================

function UserDetailsModal({
  user,
  onClose,
  onRevoke,
}: {
  user: (typeof initialAccessRecords)[number];
  onClose: () => void;
  onRevoke: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-xl border border-border bg-surface shadow-xl">

        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div>

            <h2 className="font-display text-base font-semibold">
              Access Details
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
              Permission record
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-bg"
          >
            <X size={18} />
          </button>

        </div>

        <div className="space-y-5 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Fingerprint size={19} />
            </div>

            <div>

              <p className="text-sm font-semibold">
                {user.name}
              </p>

              <p className="mt-0.5 font-mono text-xs text-text-muted">
                {user.did}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <Info
              label="Status"
              value={user.status}
            />

            <Info
              label="Source"
              value={user.source}
            />

            <Info
              label="Granted"
              value={user.grantedAt}
            />

            <Info
              label="Expires"
              value={user.expiresAt}
            />

          </div>

          <div>

            <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
              Wallet
            </p>

            <p className="mt-1 break-all font-mono text-xs">
              {user.wallet}
            </p>

          </div>

          <div className="rounded-lg bg-live-soft p-3">

            <div className="flex gap-2">

              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-live"
              />

              <p className="text-xs leading-5 text-text-muted">
                This permission is associated with the identity
                and wallet shown above.
              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-bg"
          >
            Close
          </button>

          {user.status === "Active" && (
            <button
              type="button"
              onClick={onRevoke}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
// Form Field
// =========================================================

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium">
        {label}
      </label>

      {children}

    </div>
  );
}

// =========================================================
// Modal Info
// =========================================================

function Info({
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