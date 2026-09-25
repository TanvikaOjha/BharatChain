"use client";

import {
  History,
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

const navGroups = [
  {
    label: "MY WORKSPACE",
    items: [
      {
        label: "Dashboard",
        href: "/user",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MY RESOURCES",
    items: [
      {
        label: "My Assets",
        href: "/user/assets",
        icon: Network,
      },
      {
        label: "My Access",
        href: "/user/access",
        icon: LockKeyhole,
      },
    ],
  },
  {
    label: "IDENTITY",
    items: [
      {
        label: "My Identity",
        href: "/user/identity",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "ACTIVITY",
    items: [
      {
        label: "Activity & History",
        href: "/user/activity",
        icon: History,
      },
    ],
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* ================================================================ */}
      {/* MOBILE HEADER                                                     */}
      {/* ================================================================ */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:hidden">
        <Link href="/user">
          <div className="font-display text-lg font-bold tracking-tight">
            BharatChain
          </div>

          <div className="font-mono text-[9px] tracking-[0.18em] text-[var(--text-muted)]">
            USER WORKSPACE
          </div>
        </Link>

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border border-[var(--border)] p-2 transition hover:bg-[var(--bg)]"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ================================================================ */}
      {/* MOBILE OVERLAY                                                    */}
      {/* ================================================================ */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================================================================ */}
      {/* SIDEBAR                                                           */}
      {/* ================================================================ */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <Link
            href="/user"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="font-display text-xl font-bold tracking-tight">
              BharatChain
            </div>

            <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)]">
              USER WORKSPACE
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-[var(--bg)] lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 px-3 font-mono text-[9px] font-medium tracking-[0.18em] text-[var(--text-muted)]">
                {group.label}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/user"
                      ? pathname === "/user"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.8} />

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-[var(--border)] p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--live)]" />

              <span className="font-mono text-[10px] tracking-wide text-[var(--live)]">
                NETWORK ONLINE
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Wallet size={13} />

              <span className="truncate font-mono">
                0x82A4...91F2
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* PAGE CONTENT                                                      */}
      {/* ================================================================ */}

      <main className="min-h-screen lg:pl-64">
        {/* Desktop Topbar */}
        <div className="hidden h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-8 lg:flex">
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--text-muted)]">
              USER WORKSPACE
            </div>

            <h1 className="font-display text-lg font-semibold">
              {getPageTitle(pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Network */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--live)]" />

              <span className="font-mono text-[10px] tracking-wide text-[var(--text-muted)]">
                NETWORK ONLINE
              </span>
            </div>

            <div className="h-5 w-px bg-[var(--border)]" />

            {/* Wallet */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Wallet size={14} />

              <span className="font-mono">
                0x82A4...91F2
              </span>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

/* ======================================================================== */
/* PAGE TITLE                                                               */
/* ======================================================================== */

function getPageTitle(pathname: string) {
  if (pathname === "/user") {
    return "Dashboard";
  }

  if (pathname.startsWith("/user/assets")) {
    return "My Assets";
  }

  if (pathname.startsWith("/user/access")) {
    return "My Access";
  }

  if (pathname.startsWith("/user/identity")) {
    return "My Identity";
  }

  if (pathname.startsWith("/user/activity")) {
    return "Activity & History";
  }

  return "User Workspace";
}