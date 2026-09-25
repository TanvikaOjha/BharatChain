"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const assets = [
  {
    id: "BC-001",
    name: "Radar Control Module",
    type: "CAD / Engineering",
    version: "v2.4",
    status: "Owned",
    access: "Active",
    owner: "You",
    acquired: "Aug 24, 2026",
    expires: null,
    description:
      "Engineering design package for the radar control module.",
    cid: "Qm8f...91c2",
  },
  {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    version: "v4.2",
    status: "Owned",
    access: "Active",
    owner: "You",
    acquired: "Sep 18, 2026",
    expires: null,
    description:
      "Verified firmware package for secure radar systems.",
    cid: "Qm4a...c831",
  },
  {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    version: "v1.8",
    status: "Access Granted",
    access: "Active",
    owner: "Engineering Team Alpha",
    acquired: "Sep 24, 2026",
    expires: "Oct 01, 2026",
    description:
      "Detailed CAD blueprint for the RCM-2048 engineering module.",
    cid: "Qm91...72c1",
  },
  {
    id: "BC-005",
    name: "Navigation System Specification",
    type: "Document",
    version: "v3.1",
    status: "Access Granted",
    access: "Expiring Soon",
    owner: "Navigation Systems",
    acquired: "Sep 20, 2026",
    expires: "Sep 28, 2026",
    description:
      "Technical specification document for the navigation system.",
    cid: "Qm72...d820",
  },
];

const filters = ["All", "Owned", "Access Granted", "Expiring Soon"];

export default function MyAssetsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredAssets = useMemo(() => {
    const query = search.toLowerCase().trim();

    return assets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.id.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        asset.owner.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Owned" && asset.status === "Owned") ||
        (filter === "Access Granted" &&
          asset.status === "Access Granted") ||
        (filter === "Expiring Soon" &&
          asset.access === "Expiring Soon");

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const ownedCount = assets.filter(
    (asset) => asset.status === "Owned"
  ).length;

  const activeCount = assets.filter(
    (asset) => asset.access === "Active"
  ).length;

  const expiringCount = assets.filter(
    (asset) => asset.access === "Expiring Soon"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>My Workspace</span>
            <ChevronRight size={14} />
            <span className="text-[var(--text)]">My Assets</span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
                My Assets
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                View the digital assets you own or have been granted
                access to.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              <ShieldCheck
                size={17}
                className="text-[var(--live)]"
              />

              <span className="text-xs font-medium text-[var(--text)]">
                Blockchain Verified
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Assets"
            value={assets.length}
            icon={Box}
          />

          <StatCard
            label="Owned"
            value={ownedCount}
            icon={CheckCircle2}
          />

          <StatCard
            label="Active Access"
            value={activeCount}
            icon={ShieldCheck}
          />

          <StatCard
            label="Expiring Soon"
            value={expiringCount}
            icon={Clock3}
            warning
          />
        </div>

        {/* Search + Filters */}
        <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="text"
                placeholder="Search assets, IDs, types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <button
                    key={item}
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

        {/* Desktop Asset Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] md:block">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-[var(--text)]">
                  Asset Registry
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {filteredAssets.length} asset
                  {filteredAssets.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Asset
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Version
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Ownership
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Access
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Expiry
                  </th>

                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Box size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text)]">
                            {asset.name}
                          </p>

                          <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                            {asset.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--text-muted)]">
                      {asset.type}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[var(--bg)] px-2 py-1 font-mono text-[10px] text-[var(--text)]">
                        {asset.version}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <OwnershipBadge status={asset.status} />
                    </td>

                    <td className="px-5 py-4">
                      <AccessBadge status={asset.access} />
                    </td>

                    <td className="px-5 py-4">
                      {asset.expires ? (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Clock3 size={13} />
                          {asset.expires}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">
                          No expiry
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/user/assets/${asset.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                      >
                        <ArrowUpRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filteredAssets.map((asset) => (
            <Link
              key={asset.id}
              href={`/user/assets/${asset.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Box size={19} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[var(--text)]">
                      {asset.name}
                    </h3>

                    <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                      {asset.id}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-[var(--text-muted)]"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <OwnershipBadge status={asset.status} />
                <AccessBadge status={asset.access} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Type
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {asset.type}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Version
                  </p>

                  <p className="mt-1 font-mono text-xs font-medium text-[var(--text)]">
                    {asset.version}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Owner
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {asset.owner}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Access Until
                  </p>

                  <p className="mt-1 text-xs font-medium text-[var(--text)]">
                    {asset.expires ?? "No expiry"}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {filteredAssets.length === 0 && <EmptyState />}
        </div>

        {/* Bottom Information */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <ShieldCheck size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Blockchain-verified ownership
                </h3>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Ownership and access records are linked to blockchain
                  transactions, making the registry independently
                  verifiable.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg)] text-[var(--text-muted)]">
                <FileText size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Asset metadata
                </h3>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Each asset contains verifiable metadata and an IPFS
                  content identifier for decentralized storage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Asset registry • BharatChain User Workspace
          </span>

          <span className="font-mono">
            Registry data currently mocked
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
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
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            warning
              ? "bg-amber-50 text-amber-600"
              : "bg-[var(--accent-soft)] text-[var(--accent)]"
          }`}
        >
          <Icon size={17} />
        </div>

        {warning && value > 0 && (
          <Clock3 size={14} className="text-amber-600" />
        )}
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

function OwnershipBadge({ status }: { status: string }) {
  const owned = status === "Owned";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        owned
          ? "bg-[var(--live-soft)] text-[var(--live)]"
          : "bg-[var(--accent-soft)] text-[var(--accent)]"
      }`}
    >
      {owned ? <CheckCircle2 size={11} /> : <ShieldCheck size={11} />}
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--text-muted)]">
        <Search size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
        No assets found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">
        Try changing your search or selecting a different filter.
      </p>
    </div>
  );
}