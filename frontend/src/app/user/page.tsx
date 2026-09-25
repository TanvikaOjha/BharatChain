"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  History,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Network,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
/* =========================================================
   MOCK DATA
   Replace these with blockchain/API data later.
   ========================================================= */

const user = {
  name: "Arjun Mehta",
  did: "DID-0082",
  didFull: "did:bharatchain:8f3a...91c2",
  wallet: "0x82A4...91F2",
  role: "Engineer",
  department: "Radar Systems",
};

const assets = [
  {
    id: "BC-001",
    name: "Radar Control Module",
    type: "CAD / Engineering",
    version: "v2.4",
    ownership: "Owned",
    access: "Active",
  },
  {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    version: "v4.2",
    ownership: "Owned",
    access: "Active",
  },
  {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    version: "v1.8",
    ownership: "Access Granted",
    access: "Active",
  },
  {
    id: "BC-005",
    name: "Navigation System Specification",
    type: "Document",
    version: "v3.1",
    ownership: "Access Granted",
    access: "Expiring Soon",
  },
];

const recentActivity = [
  {
    type: "Access Granted",
    asset: "RCM-2048 CAD Blueprint",
    time: "34 min ago",
    status: "Confirmed",
  },
  {
    type: "Asset Registered",
    asset: "Secure Firmware v4.2",
    time: "2 hrs ago",
    status: "Confirmed",
  },
  {
    type: "Access Renewed",
    asset: "Radar Control Module",
    time: "Yesterday",
    status: "Confirmed",
  },
  {
    type: "Identity Verified",
    asset: "DID-0082",
    time: "Sep 24, 2026",
    status: "Confirmed",
  },
];

/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

const navGroups = [
  {
    label: "MY WORKSPACE",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/user",
      },
    ],
  },
  {
    label: "MY RESOURCES",
    items: [
      {
        label: "My Assets",
        icon: Box,
        href: "/user/assets",
      },
      {
        label: "My Access",
        icon: LockKeyhole,
        href: "/user/access",
      },
    ],
  },
  {
    label: "IDENTITY",
    items: [
      {
        label: "My Identity",
        icon: Fingerprint,
        href: "/user/identity",
      },
    ],
  },
  {
    label: "ACTIVITY",
    items: [
      {
        label: "Activity & History",
        icon: History,
        href: "/user/activity",
      },
    ],
  },
];

/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

export default function UserDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* =====================================================
          MOBILE HEADER
          ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link
          href="/user"
          className="flex items-center gap-2"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <Network size={17} />
          </div>

          <div>
            <p className="font-display text-sm font-semibold">
              BharatChain
            </p>

            <p className="font-mono text-[9px] tracking-wider text-muted">
              USER WORKSPACE
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen((value) => !value)}
          className="rounded-lg p-2 text-muted hover:bg-bg hover:text-text"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-border bg-surface
          transition-transform duration-200
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Brand */}

        <div className="flex h-16 items-center border-b border-border px-5">
          <Link
            href="/user"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
              <Network size={19} />
            </div>

            <div>
              <p className="font-display text-[15px] font-semibold">
                BharatChain
              </p>

              <p className="font-mono text-[9px] tracking-[0.18em] text-muted">
                USER WORKSPACE
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-7">
              <p className="mb-2 px-3 font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/user"
                      ? pathname === "/user"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-lg px-3 py-2.5
                        text-left text-[13px]
                        transition
                        ${
                          isActive
                            ? "bg-accent-soft text-accent"
                            : "text-muted hover:bg-bg hover:text-text"
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Network Status */}

        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-border bg-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] font-semibold tracking-wider text-muted">
                NETWORK
              </span>

              <span className="flex items-center gap-1.5 font-mono text-[9px] text-live">
                <span className="h-1.5 w-1.5 rounded-full bg-live" />
                ONLINE
              </span>
            </div>

            <p className="font-mono text-[10px] text-text">
              BharatChain Network
            </p>

            <p className="mt-1 font-mono text-[9px] text-muted">
              {user.wallet}
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="min-h-screen lg:pl-64">
        {/* Mobile top spacing */}

        <div className="pt-16 lg:pt-0">

          {/* =================================================
              TOP BAR
              ================================================= */}

          <header className="hidden h-16 items-center justify-between border-b border-border bg-surface px-8 lg:flex">
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-muted">
                USER WORKSPACE
              </p>

              <h1 className="font-display text-lg font-semibold">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Network */}

              <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-live" />

                <span className="font-mono text-[10px] text-muted">
                  NETWORK ONLINE
                </span>
              </div>

              {/* Wallet */}

              <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Wallet size={14} />
                </div>

                <span className="font-mono text-[10px] text-text">
                  {user.wallet}
                </span>
              </div>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
              ================================================= */}

          <div className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-8">

            {/* Header */}

            <div className="mb-7">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] text-muted">
                <span>USER WORKSPACE</span>
                <ChevronRight size={12} />
                <span className="text-text">
                  DASHBOARD
                </span>
              </div>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    Welcome back, {user.name.split(" ")[0]}
                  </h2>

                  <p className="mt-1.5 max-w-2xl text-sm text-muted">
                    Manage your digital assets, access permissions,
                    and decentralized identity.
                  </p>
                </div>

                <Link
                  href="/user/identity"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-bg"
                >
                  <Fingerprint size={16} />
                  My Identity
                </Link>
              </div>
            </div>

            {/* =================================================
                IDENTITY BANNER
                ================================================= */}

            <section className="mb-6 rounded-2xl border border-accent/15 bg-accent-soft/50 p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                    <Fingerprint size={23} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">
                        {user.did}
                      </h2>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Verified
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-xs text-muted">
                      {user.didFull}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      <span>{user.role}</span>
                      <span>•</span>
                      <span>{user.department}</span>
                      <span>•</span>
                      <span className="font-mono">
                        {user.wallet}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/user/identity"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  View Identity
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </section>

            {/* =================================================
                STATS
                ================================================= */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="My Assets"
                value="4"
                description="Owned or assigned"
                icon={Box}
                iconClass="bg-amber-50 text-amber-600"
                href="/user/assets"
              />

              <StatCard
                label="Active Access"
                value="4"
                description="Currently accessible"
                icon={LockKeyhole}
                iconClass="bg-emerald-50 text-emerald-600"
                href="/user/access"
              />

              <StatCard
                label="Expiring Soon"
                value="1"
                description="Within 7 days"
                icon={Clock3}
                iconClass="bg-amber-50 text-amber-600"
                href="/user/access"
              />

              <StatCard
                label="Activity"
                value="12"
                description="Recent blockchain events"
                icon={History}
                iconClass="bg-accent-soft text-accent"
                href="/user/activity"
              />
            </section>

            {/* =================================================
                MAIN GRID
                ================================================= */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">

              {/* My Assets */}

              <div className="rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold">
                      My Assets
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Digital assets currently associated with your identity.
                    </p>
                  </div>

                  <Link
                    href="/user/assets"
                    className="hidden items-center gap-1.5 text-sm font-semibold text-accent transition hover:opacity-75 sm:flex"
                  >
                    View all
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {assets.map((asset) => (
                    <Link
                      key={asset.id}
                      href={`/user/assets/${asset.id}`}
                      className="group flex items-center gap-4 p-5 transition hover:bg-bg/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Box size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold transition group-hover:text-accent">
                            {asset.name}
                          </h3>

                          {asset.access === "Expiring Soon" && (
                            <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              Expiring Soon
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                          <span className="font-mono">
                            {asset.id}
                          </span>

                          <span>•</span>

                          <span>{asset.type}</span>

                          <span>•</span>

                          <span>{asset.version}</span>
                        </div>
                      </div>

                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-muted">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {asset.ownership}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border p-4 sm:hidden">
                  <Link
                    href="/user/assets"
                    className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold"
                  >
                    View all assets
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Access Summary */}

              <div className="rounded-2xl border border-border bg-surface">
                <div className="border-b border-border p-5">
                  <h2 className="font-display text-lg font-semibold">
                    Access Summary
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Your current resource permissions.
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <AccessRow
                    name="Radar Control Module"
                    id="BC-001"
                    expires="Oct 02, 2026"
                    status="Active"
                  />

                  <AccessRow
                    name="Secure Firmware v4.2"
                    id="BC-002"
                    expires="Sep 30, 2026"
                    status="Active"
                  />

                  <AccessRow
                    name="RCM-2048 CAD Blueprint"
                    id="BC-003"
                    expires="Sep 27, 2026"
                    status="Active"
                  />

                  <AccessRow
                    name="Navigation System Specification"
                    id="BC-005"
                    expires="Sep 28, 2026"
                    status="Expiring Soon"
                  />
                </div>

                <div className="border-t border-border p-5">
                  <Link
                    href="/user/access"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg"
                  >
                    Manage My Access
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </section>

            {/* =================================================
                BOTTOM GRID
                ================================================= */}

            <section className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Recent Activity */}

              <div className="rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold">
                      Recent Activity
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Your recent blockchain activity.
                    </p>
                  </div>

                  <Link
                    href="/user/activity"
                    className="flex items-center gap-1.5 text-sm font-semibold text-accent"
                  >
                    View history
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={`${activity.type}-${index}`}
                      className="flex items-center gap-4 p-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        {activity.type === "Access Granted" ? (
                          <LockKeyhole size={17} />
                        ) : activity.type === "Asset Registered" ? (
                          <Box size={17} />
                        ) : activity.type === "Access Renewed" ? (
                          <RefreshIcon />
                        ) : (
                          <Fingerprint size={17} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {activity.type}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-muted">
                          {activity.asset}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-muted">
                          {activity.time}
                        </p>

                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 size={11} />
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identity & Security */}

              <div className="rounded-2xl border border-border bg-surface">
                <div className="border-b border-border p-5">
                  <h2 className="font-display text-lg font-semibold">
                    Identity & Security
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Your decentralized identity status.
                  </p>
                </div>

                <div className="space-y-3 p-5">
                  <SecurityRow
                    icon={Fingerprint}
                    title="DID Verified"
                    description="Your decentralized identity is active."
                    status="Verified"
                  />

                  <SecurityRow
                    icon={Wallet}
                    title="Wallet Connected"
                    description={user.wallet}
                    status="Connected"
                  />

                  <SecurityRow
                    icon={ShieldCheck}
                    title="Access Credentials"
                    description="4 active permissions"
                    status="Protected"
                  />

                  <SecurityRow
                    icon={FileCheck2}
                    title="Identity Record"
                    description="Registered on-chain"
                    status="Verified"
                  />
                </div>

                <div className="border-t border-border p-5">
                  <Link
                    href="/user/identity"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg"
                  >
                    View Identity Details
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </section>

            {/* =================================================
                EXPIRING ACCESS
                ================================================= */}

            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      One access permission is expiring soon
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      Navigation System Specification access expires on{" "}
                      <span className="font-semibold text-text">
                        Sep 28, 2026
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <Link
                  href="/user/access"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  Review Access
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </section>

            {/* =================================================
                FOOTER INFO
                ================================================= */}

            <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <KeyRound size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Your identity controls your access
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    Permissions are associated with your decentralized
                    identity and wallet.
                  </p>
                </div>
              </div>

              <Link
                href="/user/activity"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                View blockchain history
                <ExternalLink size={14} />
              </Link>
            </section>

            {/* Footer */}

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-border pt-5 text-[10px] text-muted sm:flex-row">
              <p>BharatChain User Workspace</p>

              <p className="font-mono">
                Decentralized Identity & Asset Access
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
  href,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">
            {label}
          </p>

          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition group-hover:opacity-100">
        Open
        <ArrowUpRight size={13} />
      </div>
    </Link>
  );
}

/* =========================================================
   ACCESS ROW
   ========================================================= */

function AccessRow({
  name,
  id,
  expires,
  status,
}: {
  name: string;
  id: string;
  expires: string;
  status: "Active" | "Expiring Soon";
}) {
  return (
    <Link
      href={`/user/assets/${id}`}
      className="group block rounded-xl border border-border p-3.5 transition hover:border-accent/20 hover:bg-bg/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold transition group-hover:text-accent">
            {name}
          </p>

          <p className="mt-1 font-mono text-xs text-muted">
            {id}
          </p>
        </div>

        {status === "Active" ? (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
            Active
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
            Expiring
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted">
          Access until
        </span>

        <span
          className={
            status === "Expiring Soon"
              ? "font-semibold text-amber-700"
              : "font-medium"
          }
        >
          {expires}
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   SECURITY ROW
   ========================================================= */

function SecurityRow({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-[11px] font-semibold text-emerald-600">
        {status}
      </span>
    </div>
  );
}

/* =========================================================
   REFRESH ICON
   ========================================================= */

function RefreshIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}