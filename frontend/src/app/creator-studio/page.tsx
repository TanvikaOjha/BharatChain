"use client";

import {
  Activity,
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Fingerprint,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Network,
  Plus,
  Settings,
  Shield,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/* =========================================================
   MOCK DATA
   Replace these with blockchain/API data later.
   ========================================================= */

const stats = [
  {
    label: "Active Identities",
    value: "143",
    change: "+12 this month",
    icon: Fingerprint,
    iconClass: "bg-accent-soft text-accent",
  },
  {
    label: "Registered Assets",
    value: "27",
    change: "+4 this month",
    icon: Box,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    label: "Active Permissions",
    value: "86",
    change: "8 expiring soon",
    icon: LockKeyhole,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Audit Events",
    value: "1,284",
    change: "+47 today",
    icon: ClipboardCheck,
    iconClass: "bg-indigo-50 text-indigo-600",
  },
];

const activities = [
  {
    type: "Asset Minted",
    title: "Radar Control Module",
    identity: "DID-0082",
    time: "2 min ago",
    icon: Box,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    type: "Ownership Assigned",
    title: "Secure Firmware v4.2",
    identity: "DID-0147",
    time: "18 min ago",
    icon: CircleUserRound,
    iconClass: "bg-indigo-50 text-indigo-600",
  },
  {
    type: "Access Granted",
    title: "RCM-2048 CAD Blueprint",
    identity: "DID-0211",
    time: "34 min ago",
    icon: LockKeyhole,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    type: "Access Revoked",
    title: "Thermal Testing Report",
    identity: "DID-0042",
    time: "1 hr ago",
    icon: Shield,
    iconClass: "bg-red-50 text-red-600",
  },
];

const transactions = [
  {
    block: "#19,452,107",
    hash: "0x82A4...91F2",
    action: "NFT Minted",
    status: "Confirmed",
    time: "12:42:08",
  },
  {
    block: "#19,452,106",
    hash: "0x31B7...A812",
    action: "Ownership Assigned",
    status: "Confirmed",
    time: "12:39:51",
  },
  {
    block: "#19,452,105",
    hash: "0x91D2...72C1",
    action: "Permission Updated",
    status: "Confirmed",
    time: "12:36:24",
  },
  {
    block: "#19,452,104",
    hash: "0x54C1...B029",
    action: "Access Revoked",
    status: "Confirmed",
    time: "12:31:09",
  },
];

/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/creator-studio",
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Identity Management",
        icon: Fingerprint,
        href: "/creator-studio/identities",
      },
      {
        label: "Asset Registry",
        icon: Box,
        href: "/creator-studio/assets",
      },
      {
        label: "Access Control",
        icon: LockKeyhole,
        href: "/creator-studio/access",
      },
    ],
  },
  {
    label: "SECURITY",
    items: [
      {
        label: "Audit Center",
        icon: ClipboardCheck,
        href: "/creator-studio/audit",
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        label: "Administration",
        icon: Settings,
        href: "/creator-studio/settings",
      },
    ],
  },
];

/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* =====================================================
          MOBILE HEADER
          ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link
          href="/creator-studio"
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
              CREATOR STUDIO
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
            href="/creator-studio"
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
                CREATOR STUDIO
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
                    item.href === "/creator-studio"
                      ? pathname === "/creator-studio"
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

        {/* Network Status */}

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
              Block #19,452,107
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
                CREATOR STUDIO
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
                  <CircleUserRound size={14} />
                </div>

                <span className="font-mono text-[10px] text-text">
                  0x82A4...91F2
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
                <span>CREATOR STUDIO</span>
                <ChevronRight size={12} />
                <span className="text-text">DASHBOARD</span>
              </div>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    System Overview
                  </h2>

                  <p className="mt-1.5 max-w-2xl text-sm text-muted">
                    Manage decentralized identities, registered assets,
                    access policies, and blockchain activity.
                  </p>
                </div>

                {/* Only meaningful dashboard action:
                    Register a new asset. */}

                <Link
                  href="/creator-studio/mint"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <Plus size={16} />
                  Register Asset
                </Link>
              </div>
            </div>

            {/* =================================================
                STATS
                ================================================= */}

            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-surface p-5"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      <Activity
                        size={15}
                        className="text-muted"
                      />
                    </div>

                    <p className="text-xs font-medium text-muted">
                      {stat.label}
                    </p>

                    <div className="mt-1 flex items-end justify-between gap-3">
                      <p className="font-display text-2xl font-semibold">
                        {stat.value}
                      </p>

                      <span className="pb-1 font-mono text-[9px] text-muted">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* =================================================
                QUICK ACTIONS
                ================================================= */}

            <section className="mb-8">
              <div className="mb-4">
                <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                  OPERATIONS
                </p>

                <h3 className="mt-1 font-display text-lg font-semibold">
                  Quick Actions
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <QuickAction
                  href="/creator-studio/identities"
                  icon={Fingerprint}
                  title="Register Identity"
                  description="Create or manage DIDs"
                />

                <QuickAction
                  href="/creator-studio/mint"
                  icon={Plus}
                  title="Register Asset"
                  description="Mint a digital asset"
                />

                <QuickAction
                  href="/creator-studio/access"
                  icon={LockKeyhole}
                  title="Manage Access"
                  description="Review and revoke access"
                />

                <QuickAction
                  href="/creator-studio/audit"
                  icon={ClipboardCheck}
                  title="View Audit"
                  description="Inspect blockchain events"
                />
              </div>
            </section>

            {/* =================================================
                ACTIVITY + SECURITY
                ================================================= */}

            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              {/* Recent Activity */}

              <section className="rounded-xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                      ACTIVITY
                    </p>

                    <h3 className="mt-1 font-display text-base font-semibold">
                      Recent Activity
                    </h3>
                  </div>

                  <Link
                    href="/creator-studio/audit"
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    View all
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {activities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div
                        key={`${activity.title}-${activity.time}`}
                        className="flex items-center gap-4 px-5 py-4"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.iconClass}`}
                        >
                          <Icon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-sm font-medium">
                              {activity.type}
                            </p>

                            <span className="font-mono text-[9px] text-muted">
                              {activity.identity}
                            </span>
                          </div>

                          <p className="mt-0.5 truncate text-xs text-muted">
                            {activity.title}
                          </p>
                        </div>

                        <span className="shrink-0 font-mono text-[9px] text-muted">
                          {activity.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Security */}

              <section className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border px-5 py-4">
                  <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                    SECURITY
                  </p>

                  <h3 className="mt-1 font-display text-base font-semibold">
                    System Status
                  </h3>
                </div>

                <div className="space-y-1 p-3">
                  <SecurityItem
                    icon={ShieldCheck}
                    label="Smart Contract"
                    value="Verified"
                  />

                  <SecurityItem
                    icon={Network}
                    label="Blockchain Network"
                    value="Connected"
                  />

                  <SecurityItem
                    icon={Fingerprint}
                    label="Identity Registry"
                    value="Operational"
                  />

                  <SecurityItem
                    icon={UserCog}
                    label="Role Management"
                    value="Active"
                  />

                  <SecurityItem
                    icon={Users}
                    label="Access Control"
                    value="Operational"
                  />
                </div>
              </section>
            </div>

            {/* =================================================
                BLOCKCHAIN TRANSACTIONS
                ================================================= */}

            <section className="mt-6 rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted">
                    BLOCKCHAIN
                  </p>

                  <h3 className="mt-1 font-display text-base font-semibold">
                    Recent Transactions
                  </h3>
                </div>

                <span className="flex items-center gap-1.5 font-mono text-[9px] text-live">
                  <span className="h-1.5 w-1.5 rounded-full bg-live" />
                  LIVE
                </span>
              </div>

              {/* Desktop table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        BLOCK
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        TRANSACTION
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        ACTION
                      </th>

                      <th className="px-5 py-3 font-mono text-[9px] font-semibold tracking-wider text-muted">
                        STATUS
                      </th>

                      <th className="px-5 py-3 text-right font-mono text-[9px] font-semibold tracking-wider text-muted">
                        TIME
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {transactions.map((tx) => (
                      <tr key={tx.block}>
                        <td className="px-5 py-3.5 font-mono text-[10px] text-text">
                          {tx.block}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[10px] text-muted">
                            {tx.hash}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-text">
                          {tx.action}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-live">
                            <CheckCircle2 size={12} />
                            {tx.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right font-mono text-[10px] text-muted">
                          {tx.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile transaction cards */}

              <div className="divide-y divide-border md:hidden">
                {transactions.map((tx) => (
                  <div
                    key={tx.block}
                    className="space-y-3 px-5 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text">
                        {tx.block}
                      </span>

                      <span className="flex items-center gap-1.5 font-mono text-[9px] text-live">
                        <CheckCircle2 size={11} />
                        {tx.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium">
                        {tx.action}
                      </p>

                      <p className="mt-1 font-mono text-[9px] text-muted">
                        {tx.hash}
                      </p>
                    </div>

                    <p className="font-mono text-[9px] text-muted">
                      {tx.time}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                FOOTER
                ================================================= */}

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-border pt-5 text-[10px] text-muted sm:flex-row">
              <p>
                BharatChain Creator Studio
              </p>

              <p className="font-mono">
                Decentralized Identity & Asset Management
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   QUICK ACTION COMPONENT
   ========================================================= */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30 hover:bg-accent-soft/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[11px] text-muted">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={15}
        className="shrink-0 text-muted transition group-hover:text-accent"
      />
    </Link>
  );
}

/* =========================================================
   SECURITY ITEM
   Informational only — intentionally not clickable.
   ========================================================= */

function SecurityItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-live-soft text-live">
        <Icon size={15} />
      </div>

      <span className="flex-1 text-xs text-text">
        {label}
      </span>

      <span className="flex items-center gap-1.5 font-mono text-[9px] text-live">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />
        {value}
      </span>
    </div>
  );
}