"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  KeyRound,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const accessRecords = [
  {
    id: "ACC-001",
    assetId: "BC-001",
    assetName: "Radar Control Module",
    assetType: "CAD / Engineering",
    version: "v2.4",
    status: "Active",
    grantedOn: "Aug 24, 2026",
    expiresOn: null,
    source: "Ownership",
    grantedBy: "System",
    permission: "Owner",
    description:
      "Full ownership and access rights for the Radar Control Module.",
  },
  {
    id: "ACC-002",
    assetId: "BC-002",
    assetName: "Secure Firmware v4.2",
    assetType: "Firmware",
    version: "v4.2",
    status: "Active",
    grantedOn: "Sep 18, 2026",
    expiresOn: null,
    source: "Ownership",
    grantedBy: "System",
    permission: "Owner",
    description:
      "Ownership-based access to the verified firmware package.",
  },
  {
    id: "ACC-003",
    assetId: "BC-003",
    assetName: "RCM-2048 CAD Blueprint",
    assetType: "CAD / Engineering",
    version: "v1.8",
    status: "Active",
    grantedOn: "Sep 24, 2026",
    expiresOn: "Oct 01, 2026",
    source: "Admin Grant",
    grantedBy: "Priya Sharma",
    permission: "Read / Download",
    description:
      "Temporary engineering access granted by the asset administrator.",
  },
  {
    id: "ACC-004",
    assetId: "BC-005",
    assetName: "Navigation System Specification",
    assetType: "Document",
    version: "v3.1",
    status: "Expiring Soon",
    grantedOn: "Sep 20, 2026",
    expiresOn: "Sep 28, 2026",
    source: "Admin Grant",
    grantedBy: "Vikram Singh",
    permission: "Read",
    description:
      "Temporary access to the navigation system specification.",
  },
  {
    id: "ACC-005",
    assetId: "BC-006",
    assetName: "Sensor Array Configuration",
    assetType: "Configuration",
    version: "v2.0",
    status: "Revoked",
    grantedOn: "Sep 18, 2026",
    expiresOn: "Sep 25, 2026",
    source: "Admin Grant",
    grantedBy: "Rohan Desai",
    permission: "Read",
    description:
      "Previously granted access that has since been revoked.",
  },
  {
    id: "ACC-006",
    assetId: "BC-004",
    assetName: "Thermal Testing Report",
    assetType: "Document",
    version: "v1.2",
    status: "Expired",
    grantedOn: "Sep 12, 2026",
    expiresOn: "Sep 19, 2026",
    source: "Access Request",
    grantedBy: "Security & Compliance",
    permission: "Read",
    description:
      "Access window has ended and requires renewal.",
  },
];

const filters = [
  "All",
  "Active",
  "Expiring Soon",
  "Expired",
  "Revoked",
];

export default function MyAccessPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return accessRecords.filter((record) => {
      const matchesSearch =
        !query ||
        record.assetId.toLowerCase().includes(query) ||
        record.assetName.toLowerCase().includes(query) ||
        record.assetType.toLowerCase().includes(query) ||
        record.permission.toLowerCase().includes(query) ||
        record.source.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const activeCount = accessRecords.filter(
    (record) => record.status === "Active"
  ).length;

  const expiringCount = accessRecords.filter(
    (record) => record.status === "Expiring Soon"
  ).length;

  const expiredCount = accessRecords.filter(
    (record) => record.status === "Expired"
  ).length;

  const revokedCount = accessRecords.filter(
    (record) => record.status === "Revoked"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>My Workspace</span>
            <ChevronRight size={14} />
            <span className="text-[var(--text)]">
              My Access
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
                My Access
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                View and monitor your permissions across the
                digital assets you can access.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              <KeyRound
                size={16}
                className="text-[var(--accent)]"
              />

              <span className="text-xs font-medium text-[var(--text)]">
                {activeCount} active permissions
              </span>
            </div>
          </div>
        </div>

        {/* Attention Banner */}
        {expiringCount > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600">
              <Clock3 size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Access requires attention
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                {expiringCount} permission
                {expiringCount !== 1 ? "s are" : " is"} expiring
                soon. Review the affected assets before access
                ends.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Active"
            value={activeCount}
            icon={CheckCircle2}
          />

          <MetricCard
            label="Expiring Soon"
            value={expiringCount}
            icon={Clock3}
            warning
          />

          <MetricCard
            label="Expired"
            value={expiredCount}
            icon={XCircle}
          />

          <MetricCard
            label="Revoked"
            value={revokedCount}
            icon={ShieldCheck}
          />
        </div>

        {/* Search and filters */}
        <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets or permissions..."
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] md:block">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">
              Permission Registry
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {filteredRecords.length} permission
              {filteredRecords.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Asset
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Permission
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Source
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Granted
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Expires
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Status
                  </th>

                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Box size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text)]">
                            {record.assetName}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[var(--text-muted)]">
                              {record.assetId}
                            </span>

                            <span className="text-[var(--border)]">
                              •
                            </span>

                            <span className="text-[10px] text-[var(--text-muted)]">
                              {record.version}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-[var(--bg)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--text)]">
                        {record.permission}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs font-medium text-[var(--text)]">
                          {record.source}
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                          {record.grantedBy}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-muted)]">
                      {record.grantedOn}
                    </td>

                    <td className="px-5 py-4">
                      {record.expiresOn ? (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Clock3 size={13} />
                          {record.expiresOn}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">
                          No expiry
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={record.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/user/assets/${record.assetId}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        title="View asset"
                      >
                        <ArrowUpRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && <EmptyState />}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filteredRecords.map((record) => (
            <Link
              key={record.id}
              href={`/user/assets/${record.assetId}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <KeyRound size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[var(--text)]">
                      {record.assetName}
                    </h3>

                    <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                      {record.assetId}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-[var(--text-muted)]"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={record.status} />

                <span className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-muted)]">
                  {record.permission}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Source
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {record.source}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Granted By
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-[var(--text)]">
                    {record.grantedBy}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Granted
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {record.grantedOn}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Expires
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {record.expiresOn ?? "No expiry"}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {filteredRecords.length === 0 && <EmptyState />}
        </div>

        {/* Explanation */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
              <ShieldCheck size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">
                How access works
              </h3>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
                Your permissions are associated with your verified
                identity and wallet. Asset owners or authorized
                administrators can grant or revoke access, while
                blockchain records provide an auditable history of
                those changes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Access management • BharatChain User Workspace
          </span>

          <span className="font-mono">
            Permission data currently mocked
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function MetricCard({
  label,
  value,
  icon: Icon,
  warning = false,
}: {
  label: string;
  value: number;
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

      <p className="mt-4 text-2xl font-semibold text-[var(--text)]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: "bg-[var(--live-soft)] text-[var(--live)]",
    "Expiring Soon": "bg-amber-50 text-amber-700",
    Expired: "bg-slate-100 text-slate-600",
    Revoked: "bg-red-50 text-red-600",
  };

  const icons = {
    Active: CheckCircle2,
    "Expiring Soon": Clock3,
    Expired: XCircle,
    Revoked: ShieldCheck,
  };

  const Icon =
    icons[status as keyof typeof icons] ?? ShieldCheck;

  const style =
    styles[status as keyof typeof styles] ??
    "bg-[var(--bg)] text-[var(--text-muted)]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${style}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--text-muted)]">
        <Search size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
        No permissions found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">
        Try changing your search or selecting a different status
        filter.
      </p>
    </div>
  );
}