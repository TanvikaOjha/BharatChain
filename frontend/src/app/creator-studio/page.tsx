"use client";

import {
  Activity,
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  FileKey2,
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
import { useState } from "react";

const stats = [
  {
    label: "Active Identities",
    value: "143",
    change: "+12 this month",
    icon: Users,
    color: "identity",
  },
  {
    label: "Registered Assets",
    value: "27",
    change: "+4 this month",
    icon: Box,
    color: "asset",
  },
  {
    label: "Active Permissions",
    value: "86",
    change: "8 changes today",
    icon: LockKeyhole,
    color: "accent",
  },
  {
    label: "Audit Events",
    value: "1,284",
    change: "+37 today",
    icon: Activity,
    color: "live",
  },
];

const activities = [
  {
    type: "Asset Minted",
    description: "Radar Control Module",
    identity: "DID-0082",
    time: "2 min ago",
    icon: Box,
  },
  {
    type: "Ownership Assigned",
    description: "Secure Firmware v4.2",
    identity: "DID-0147",
    time: "18 min ago",
    icon: CircleUserRound,
  },
  {
    type: "Access Granted",
    description: "RCM-2048 CAD Blueprint",
    identity: "DID-0211",
    time: "34 min ago",
    icon: ShieldCheck,
  },
  {
    type: "Access Revoked",
    description: "Thermal Testing Report",
    identity: "DID-0042",
    time: "1 hr ago",
    icon: LockKeyhole,
  },
];

const transactions = [
  {
    block: "#19,452,107",
    transaction: "0x82A4...91F2",
    event: "NFT Minted",
    status: "Confirmed",
    time: "12:42:08",
  },
  {
    block: "#19,452,106",
    transaction: "0x31B7...A812",
    event: "Ownership Assigned",
    status: "Confirmed",
    time: "12:39:51",
  },
  {
    block: "#19,452,105",
    transaction: "0x91D2...72C1",
    event: "Permission Updated",
    status: "Confirmed",
    time: "12:36:24",
  },
  {
    block: "#19,452,104",
    transaction: "0x54C1...B029",
    event: "Access Revoked",
    status: "Confirmed",
    time: "12:31:09",
  },
];

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        active: true,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Identity Management",
        icon: Fingerprint,
      },
      {
        label: "Asset Registry",
        icon: Box,
      },
      {
        label: "Access Control",
        icon: LockKeyhole,
      },
    ],
  },
  {
    label: "SECURITY",
    items: [
      {
        label: "Audit Center",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        label: "Administration",
        icon: Settings,
      },
    ],
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-bg text-text">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-[72px] z-50
          h-[calc(100vh-72px)]
          w-[260px]
          border-r border-border
          bg-surface
          transition-transform duration-200
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-[82px] items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <Shield size={19} strokeWidth={2.2} />
              </div>

              <div>
                <p className="font-display text-[15px] font-bold tracking-tight">
                  BharatChain
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  Secure Registry
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 text-muted hover:bg-bg hover:text-text lg:hidden"
            >
              <X size={18} />
            </button>
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

                    return (
                      <button
                        key={item.label}
                        className={`
                          group flex w-full items-center gap-3
                          rounded-lg px-3 py-2.5
                          text-left text-[13px]
                          transition
                          ${
                            item.active
                              ? "bg-accent-soft text-accent"
                              : "text-muted hover:bg-bg hover:text-text"
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={item.active ? 2.2 : 1.8}
                        />

                        <span className="flex-1">{item.label}</span>

                        {item.active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Admin identity */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                <UserCog size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Administrator</p>

                <p className="mt-0.5 truncate font-mono text-[10px] text-muted">
                  DID-0001
                </p>
              </div>

              <span className="h-2 w-2 rounded-full bg-live" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-[260px]">
        {/* Mobile header */}
        <div className="flex h-14 items-center border-b border-border bg-surface px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-muted hover:bg-bg hover:text-text"
          >
            <Menu size={20} />
          </button>

          <span className="ml-3 font-display text-sm font-bold">
            Admin Dashboard
          </span>
        </div>

        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Administration
                </span>

                <span className="text-border">/</span>

                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Overview
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted">
                Manage decentralized identities, digital assets, access
                permissions, and blockchain activity.
              </p>
            </div>

            {/* Network status */}
            <div className="flex items-center gap-3 self-start rounded-lg border border-border bg-surface px-4 py-2.5 md:self-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
              </span>

              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  Network
                </p>
                <p className="text-xs font-semibold">Blockchain Live</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              const iconClass =
                stat.color === "identity"
                  ? "bg-[#E7F8F5] text-identity dark:bg-[#0D2926]"
                  : stat.color === "asset"
                    ? "bg-[#FBF2E3] text-asset dark:bg-[#2C2110]"
                    : stat.color === "live"
                      ? "bg-live-soft text-live"
                      : "bg-accent-soft text-accent";

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
                    >
                      <Icon size={19} />
                    </div>

                    <ArrowUpRight size={16} className="text-muted" />
                  </div>

                  <div className="mt-5">
                    <p className="text-xs text-muted">{stat.label}</p>

                    <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-muted">
                      {stat.change}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick actions */}
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold">
                  Quick Actions
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Common administrative operations
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction
                icon={Fingerprint}
                title="Register Identity"
                description="Create a new DID"
              />

              <QuickAction
                icon={Plus}
                title="Register Asset"
                description="Mint a digital asset"
              />

              <QuickAction
                icon={LockKeyhole}
                title="Manage Access"
                description="Grant or revoke permissions"
              />

              <QuickAction
                icon={ClipboardCheck}
                title="View Audit"
                description="Inspect blockchain events"
              />
            </div>
          </section>

          {/* Two-column section */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            {/* Recent activity */}
            <div className="rounded-xl border border-border bg-surface shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-display text-base font-bold">
                    Recent Activity
                  </h2>

                  <p className="mt-0.5 text-xs text-muted">
                    Latest identity, asset and permission events
                  </p>
                </div>

                <button className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                  View all
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="divide-y divide-border">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={`${activity.type}-${activity.identity}`}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg text-muted">
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-xs font-semibold">
                            {activity.type}
                          </p>

                          <span className="font-mono text-[10px] text-muted">
                            {activity.identity}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-muted">
                          {activity.description}
                        </p>
                      </div>

                      <span className="shrink-0 font-mono text-[10px] text-muted">
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security status */}
            <div className="rounded-xl border border-border bg-surface shadow-[var(--shadow)]">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-display text-base font-bold">
                  Security Status
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  Current system integrity
                </p>
              </div>

              <div className="space-y-3 p-5">
                <SecurityItem
                  icon={Fingerprint}
                  title="Decentralized Identity"
                  value="Operational"
                />

                <SecurityItem
                  icon={Box}
                  title="Asset Registry"
                  value="Operational"
                />

                <SecurityItem
                  icon={LockKeyhole}
                  title="RBAC Enforcement"
                  value="Active"
                />

                <SecurityItem
                  icon={Network}
                  title="Blockchain Network"
                  value="Connected"
                />

                <SecurityItem
                  icon={ShieldCheck}
                  title="Audit Integrity"
                  value="Verified"
                />
              </div>

              <div className="mx-5 mb-5 rounded-lg border border-live/20 bg-live-soft p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-live" size={16} />

                  <p className="text-xs font-semibold">
                    All systems operational
                  </p>
                </div>

                <p className="mt-1 pl-6 text-[10px] text-muted">
                  Last verification completed less than a minute ago.
                </p>
              </div>
            </div>
          </section>

          {/* Blockchain activity */}
          <section className="mt-7 rounded-xl border border-border bg-surface shadow-[var(--shadow)]">
            <div className="flex flex-col justify-between gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-base font-bold">
                  Blockchain Activity
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  Immutable record of system operations
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-live-soft px-2.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-live" />

                <span className="font-mono text-[9px] uppercase tracking-wider text-live">
                  Synced
                </span>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg/50">
                    <th className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                      Block
                    </th>

                    <th className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                      Transaction
                    </th>

                    <th className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                      Event
                    </th>

                    <th className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.block}
                      className="border-b border-border last:border-0 hover:bg-bg/50"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-text">
                        {tx.block}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-muted">
                        {tx.transaction}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium">
                        {tx.event}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-live-soft px-2 py-1 font-mono text-[9px] text-live">
                          <span className="h-1.5 w-1.5 rounded-full bg-live" />
                          {tx.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-[10px] text-muted">
                        {tx.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {transactions.map((tx) => (
                <div key={tx.block} className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{tx.block}</span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-live-soft px-2 py-1 font-mono text-[9px] text-live">
                      <span className="h-1.5 w-1.5 rounded-full bg-live" />
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs font-medium">{tx.event}</p>

                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-muted">
                      {tx.transaction}
                    </span>

                    <span className="font-mono text-[10px] text-muted">
                      {tx.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer information */}
          <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-live" />
              <span>RBAC protected administration</span>
            </div>

            <span className="font-mono">
              Network ID: BHARAT-CHAIN-01
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <button className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-accent/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 text-[10px] text-muted">{description}</p>
      </div>

      <ChevronRight
        size={15}
        className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </button>
  );
}

function SecurityItem({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg text-muted">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{title}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />

        <span className="font-mono text-[9px] text-live">
          {value}
        </span>
      </div>
    </div>
  );
}