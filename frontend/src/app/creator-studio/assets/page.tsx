"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileCode2,
  FileText,
  Filter,
  Image,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  User,
  XCircle,X
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/* =========================================================
   MOCK DATA
   Replace this with blockchain/API data later.
   ========================================================= */

const assets = [
  {
    id: "BC-001",
    tokenId: "1",
    name: "Radar Control Module",
    description: "Secure radar control system design and documentation.",
    type: "CAD / Engineering",
    creator: "DID-0082",
    owner: "0x82A4...91F2",
    status: "Active",
    version: "v2.4",
    cid: "bafybeigdyr7...",
    price: "0.02 ETH",
    accessDuration: "7 days",
    created: "Sep 25, 2026",
    icon: FileCode2,
  },
  {
    id: "BC-002",
    tokenId: "2",
    name: "Secure Firmware v4.2",
    description: "Firmware package for secure embedded systems.",
    type: "Firmware",
    creator: "DID-0147",
    owner: "0x31B7...A812",
    status: "Active",
    version: "v4.2",
    cid: "bafybeihg92...",
    price: "0.05 ETH",
    accessDuration: "30 days",
    created: "Sep 24, 2026",
    icon: FileCode2,
  },
  {
    id: "BC-003",
    tokenId: "3",
    name: "RCM-2048 CAD Blueprint",
    description: "Engineering blueprint for the RCM-2048 system.",
    type: "CAD / Engineering",
    creator: "DID-0211",
    owner: "0x91D2...72C1",
    status: "Active",
    version: "v1.8",
    cid: "bafybeic83...",
    price: "0.01 ETH",
    accessDuration: "3 days",
    created: "Sep 23, 2026",
    icon: FileCode2,
  },
  {
    id: "BC-004",
    tokenId: "4",
    name: "Thermal Testing Report",
    description: "Thermal performance and validation report.",
    type: "Document",
    creator: "DID-0042",
    owner: "0x54C1...B029",
    status: "Restricted",
    version: "v1.2",
    cid: "bafybeif47...",
    price: "0.015 ETH",
    accessDuration: "7 days",
    created: "Sep 22, 2026",
    icon: FileText,
  },
  {
    id: "BC-005",
    tokenId: "5",
    name: "Navigation System Specification",
    description: "Technical specification for navigation systems.",
    type: "Document",
    creator: "DID-0104",
    owner: "0x72F1...D820",
    status: "Active",
    version: "v3.1",
    cid: "bafybeia91...",
    price: "0.03 ETH",
    accessDuration: "14 days",
    created: "Sep 21, 2026",
    icon: FileText,
  },
  {
    id: "BC-006",
    tokenId: "6",
    name: "Sensor Array Configuration",
    description: "Configuration data for sensor array deployment.",
    type: "Configuration",
    creator: "DID-0178",
    owner: "0xA921...C441",
    status: "Revoked",
    version: "v2.0",
    cid: "bafybeid22...",
    price: "0.025 ETH",
    accessDuration: "7 days",
    created: "Sep 20, 2026",
    icon: ShieldCheck,
  },
];

const assetTypes = [
  "All Types",
  "CAD / Engineering",
  "Firmware",
  "Document",
  "Configuration",
];

const statuses = ["All Status", "Active", "Restricted", "Revoked"];

/* =========================================================
   PAGE
   ========================================================= */

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = useMemo(() => {
    const query = search.toLowerCase().trim();

    return assets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.id.toLowerCase().includes(query) ||
        asset.creator.toLowerCase().includes(query) ||
        asset.owner.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All Types" ||
        asset.type === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        asset.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const hasFilters =
    search !== "" ||
    typeFilter !== "All Types" ||
    statusFilter !== "All Status";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1500px] p-5 pt-8 sm:p-7 lg:p-8">
          {/* =================================================
              BREADCRUMB
              ================================================= */}

          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] text-muted">
            <Link
              href="/creator-studio"
              className="hover:text-text"
            >
              CREATOR STUDIO
            </Link>

            <ChevronRight size={12} />

            <span className="text-text">ASSET REGISTRY</span>
          </div>

          {/* =================================================
              PAGE HEADER
              ================================================= */}

          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Box size={19} />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                    DIGITAL ASSET MANAGEMENT
                  </p>

                  <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    Asset Registry
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm text-muted">
                View and manage digital assets registered on the
                BharatChain network.
              </p>
            </div>

            <Link
              href="/creator-studio/mint"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              Register Asset
            </Link>
          </div>

          {/* =================================================
              SUMMARY CARDS
              ================================================= */}

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Total Assets"
              value={assets.length.toString()}
              icon={Box}
            />

            <SummaryCard
              label="Active"
              value={
                assets
                  .filter((asset) => asset.status === "Active")
                  .length.toString()
              }
              icon={CheckCircle2}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              label="Restricted"
              value={
                assets
                  .filter(
                    (asset) => asset.status === "Restricted",
                  )
                  .length.toString()
              }
              icon={ShieldCheck}
              iconClass="bg-amber-50 text-amber-600"
            />

            <SummaryCard
              label="Recently Registered"
              value="4"
              icon={Clock3}
              iconClass="bg-indigo-50 text-indigo-600"
            />
          </div>

          {/* =================================================
              SEARCH + FILTERS
              ================================================= */}

          <section className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border p-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                {/* Search */}

                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by asset name, ID, DID or wallet..."
                    className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-4 text-xs outline-none transition placeholder:text-muted focus:border-accent"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Desktop Type Filter */}

                <FilterSelect
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={assetTypes}
                  className="hidden lg:flex"
                />

                {/* Desktop Status Filter */}

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statuses}
                  className="hidden lg:flex"
                />

                {/* Mobile Filter Button */}

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters((value) => !value)
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-xs font-medium text-muted hover:bg-bg hover:text-text lg:hidden"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {(typeFilter !== "All Types" ||
                    statusFilter !== "All Status") && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[8px] text-white">
                      1
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Filters */}

              {showFilters && (
                <div className="mt-3 grid gap-3 border-t border-border pt-3 lg:hidden sm:grid-cols-2">
                  <FilterSelect
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={assetTypes}
                    className="flex"
                  />

                  <FilterSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statuses}
                    className="flex"
                  />
                </div>
              )}

              {/* Active filters */}

              {hasFilters && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] text-muted">
                    FILTERS:
                  </span>

                  {search && (
                    <FilterTag
                      label={`Search: ${search}`}
                      onRemove={() => setSearch("")}
                    />
                  )}

                  {typeFilter !== "All Types" && (
                    <FilterTag
                      label={typeFilter}
                      onRemove={() =>
                        setTypeFilter("All Types")
                      }
                    />
                  )}

                  {statusFilter !== "All Status" && (
                    <FilterTag
                      label={statusFilter}
                      onRemove={() =>
                        setStatusFilter("All Status")
                      }
                    />
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-mono text-[9px] text-accent hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                RESULTS HEADER
                ================================================= */}

            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="font-mono text-[9px] text-muted">
                SHOWING{" "}
                <span className="text-text">
                  {filteredAssets.length}
                </span>{" "}
                OF{" "}
                <span className="text-text">
                  {assets.length}
                </span>{" "}
                ASSETS
              </p>

              <div className="hidden items-center gap-2 text-[10px] text-muted sm:flex">
                <Filter size={12} />
                Registry
              </div>
            </div>

            {/* =================================================
                DESKTOP TABLE
                ================================================= */}

            <div className="hidden overflow-x-auto md:block">
              {filteredAssets.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        ASSET
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        TYPE
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        CREATOR
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        OWNER
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        STATUS
                      </th>

                      <th className="px-5 py-3 text-right font-mono text-[9px] font-semibold tracking-wider text-muted">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredAssets.map((asset) => {
                      const Icon = asset.icon;

                      return (
                        <tr
                          key={asset.id}
                          className="group transition hover:bg-bg"
                        >
                          {/* Asset */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                <Icon size={16} />
                              </div>

                              <div className="min-w-0">
                                <Link
                                  href={`/creator-studio/assets/${asset.id}`}
                                  className="block max-w-[260px] truncate text-sm font-medium hover:text-accent"
                                >
                                  {asset.name}
                                </Link>

                                <div className="mt-0.5 flex items-center gap-2">
                                  <span className="font-mono text-[9px] text-muted">
                                    #{asset.id}
                                  </span>

                                  <span className="text-border">
                                    •
                                  </span>

                                  <span className="font-mono text-[9px] text-muted">
                                    Token {asset.tokenId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}

                          <td className="px-5 py-4">
                            <span className="text-xs text-muted">
                              {asset.type}
                            </span>
                          </td>

                          {/* Creator */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <User
                                size={13}
                                className="text-muted"
                              />

                              <span className="font-mono text-[10px] text-text">
                                {asset.creator}
                              </span>
                            </div>
                          </td>

                          {/* Owner */}

                          <td className="px-5 py-4">
                            <span className="font-mono text-[10px] text-muted">
                              {asset.owner}
                            </span>
                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={asset.status}
                            />
                          </td>

                          {/* Action */}

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/creator-studio/assets/${asset.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[10px] font-medium text-muted opacity-0 transition hover:border-accent hover:text-accent group-hover:opacity-100"
                            >
                              View
                              <ArrowUpRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <EmptyState onClear={clearFilters} />
              )}
            </div>

            {/* =================================================
                MOBILE CARDS
                ================================================= */}

            <div className="divide-y divide-border md:hidden">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => {
                  const Icon = asset.icon;

                  return (
                    <div
                      key={asset.id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/creator-studio/assets/${asset.id}`}
                                className="block truncate text-sm font-medium hover:text-accent"
                              >
                                {asset.name}
                              </Link>

                              <p className="mt-1 font-mono text-[9px] text-muted">
                                #{asset.id} · Token {asset.tokenId}
                              </p>
                            </div>

                            <StatusBadge
                              status={asset.status}
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <AssetInfo
                              label="TYPE"
                              value={asset.type}
                            />

                            <AssetInfo
                              label="CREATOR"
                              value={asset.creator}
                              mono
                            />

                            <AssetInfo
                              label="OWNER"
                              value={asset.owner}
                              mono
                            />

                            <AssetInfo
                              label="VERSION"
                              value={asset.version}
                              mono
                            />
                          </div>

                          <Link
                            href={`/creator-studio/assets/${asset.id}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-muted hover:border-accent hover:text-accent"
                          >
                            View Asset
                            <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState onClear={clearFilters} />
              )}
            </div>

            {/* =================================================
                FOOTER
                ================================================= */}

            <div className="border-t border-border px-5 py-3">
              <p className="font-mono text-[9px] text-muted">
                MOCK REGISTRY DATA · BLOCKCHAIN INTEGRATION PENDING
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClass = "bg-accent-soft text-accent",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon size={16} />
        </div>

        <div>
          <p className="font-mono text-[9px] tracking-wider text-muted">
            {label.toUpperCase()}
          </p>

          <p className="mt-0.5 font-display text-xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
   ========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div
      className={`relative h-10 min-w-[165px] items-center ${className}`}
    >
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-lg border border-border bg-bg px-3 pr-9 text-xs text-text outline-none transition focus:border-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* =========================================================
   FILTER TAG
   ========================================================= */

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 font-mono text-[9px] text-accent">
      {label}

      <button
        type="button"
        onClick={onRemove}
        className="hover:text-text"
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config = {
    Active: {
      icon: CheckCircle2,
      className: "bg-live-soft text-live",
    },
    Restricted: {
      icon: ShieldCheck,
      className: "bg-amber-50 text-amber-600",
    },
    Revoked: {
      icon: XCircle,
      className: "bg-red-50 text-red-600",
    },
  };

  const current =
    config[status as keyof typeof config] ?? config.Active;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[9px] font-medium ${current.className}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

/* =========================================================
   ASSET INFO
   ========================================================= */

function AssetInfo({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[8px] font-semibold tracking-wider text-muted">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-[11px] text-text ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-muted">
        <Search size={20} />
      </div>

      <h3 className="font-display text-base font-semibold">
        No assets found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted">
        No registered assets match your current search or
        filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-xs font-medium text-accent hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}