"use client";

import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Fingerprint,
  History,
  KeyRound,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";

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
    status: "Owned",
    access: "Active",
    expiry: "Permanent",
  },
  {
    id: "BC-002",
    name: "Secure Firmware v4.2",
    type: "Firmware",
    version: "v4.2",
    status: "Owned",
    access: "Active",
    expiry: "Permanent",
  },
  {
    id: "BC-003",
    name: "RCM-2048 CAD Blueprint",
    type: "CAD / Engineering",
    version: "v1.8",
    status: "Access Granted",
    access: "Active",
    expiry: "Sep 27, 2026",
  },
  {
    id: "BC-005",
    name: "Navigation System Specification",
    type: "Document",
    version: "v3.1",
    status: "Access Granted",
    access: "Expiring Soon",
    expiry: "Oct 04, 2026",
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

export default function UserDashboard() {
  const ownedAssets = assets.filter(
    (asset) => asset.status === "Owned"
  ).length;

  const activeAccess = assets.filter(
    (asset) => asset.access === "Active"
  ).length;

  const expiringSoon = assets.filter(
    (asset) => asset.access === "Expiring Soon"
  ).length;

  return (
    <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* ============================================================ */}
        {/* WELCOME                                                        */}
        {/* ============================================================ */}

        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--live)]" />

                <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--live)]">
                  IDENTITY VERIFIED
                </span>
              </div>

              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {user.name.split(" ")[0]}.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Here&apos;s an overview of your assets, access permissions,
                identity, and recent activity.
              </p>
            </div>

            <Link
              href="/user/identity"
              className="flex w-fit items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Fingerprint size={15} />
              View Identity
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>

        {/* ============================================================ */}
        {/* IDENTITY BANNER                                                */}
        {/* ============================================================ */}

        <section className="mb-8 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] bg-[var(--bg)] px-5 py-3">
            <div className="flex items-center gap-2">
              <Fingerprint
                size={15}
                className="text-[var(--identity)]"
              />

              <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-[var(--identity)]">
                DECENTRALIZED IDENTITY
              </span>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-4">
            <IdentityItem
              label="DID"
              value={user.did}
              mono
            />

            <IdentityItem
              label="Wallet"
              value={user.wallet}
              mono
            />

            <IdentityItem
              label="Role"
              value={user.role}
            />

            <IdentityItem
              label="Department"
              value={user.department}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* STATS                                                          */}
        {/* ============================================================ */}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="My Assets"
            value={assets.length}
            icon={Box}
            href="/user/assets"
          />

          <StatCard
            label="Owned"
            value={ownedAssets}
            icon={Wallet}
            href="/user/assets"
          />

          <StatCard
            label="Active Access"
            value={activeAccess}
            icon={KeyRound}
            href="/user/access"
          />

          <StatCard
            label="Expiring Soon"
            value={expiringSoon}
            icon={Clock3}
            accent={expiringSoon > 0}
            href="/user/access"
          />
        </section>

        {/* ============================================================ */}
        {/* MAIN GRID                                                      */}
        {/* ============================================================ */}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* ========================================================== */}
          {/* MY ASSETS                                                    */}
          {/* ========================================================== */}

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  My Assets
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Assets owned or accessible by you
                </p>
              </div>

              <Link
                href="/user/assets"
                className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {assets.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/user/assets/${asset.id}`}
                  className="group flex items-center gap-4 px-5 py-4 transition hover:bg-[var(--bg)]"
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Box size={18} />
                  </div>

                  {/* Asset info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {asset.name}
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[var(--accent)]">
                        {asset.id}
                      </span>

                      <span className="text-[var(--text-muted)]">
                        ·
                      </span>

                      <span className="text-[10px] text-[var(--text-muted)]">
                        {asset.type}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <AssetStatus status={asset.status} />
                  </div>

                  {/* Access */}
                  <div className="hidden md:block md:w-28">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                      Access
                    </div>

                    <div className="mt-1">
                      <AccessStatus status={asset.access} />
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* ACCESS SUMMARY                                               */}
          {/* ========================================================== */}

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Access Summary
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Your current permissions
                </p>
              </div>

              <Link
                href="/user/access"
                className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                Manage
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-5">
              <div className="mb-5 grid grid-cols-3 gap-3">
                <MiniMetric
                  label="Active"
                  value="3"
                  icon={CheckCircle2}
                />

                <MiniMetric
                  label="Expiring"
                  value="1"
                  icon={Clock3}
                  accent
                />

                <MiniMetric
                  label="Revoked"
                  value="0"
                  icon={ShieldCheck}
                />
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[var(--live)]"
                  />

                  <span className="text-sm font-medium">
                    Access is verified on-chain
                  </span>
                </div>

                <p className="text-xs leading-5 text-[var(--text-muted)]">
                  Your permissions are tied to your wallet and verified
                  against the BharatChain access registry.
                </p>

                <Link
                  href="/user/access"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  View permissions
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* LOWER GRID                                                     */}
        {/* ============================================================ */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* ========================================================== */}
          {/* RECENT ACTIVITY                                              */}
          {/* ========================================================== */}

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Recent actions associated with your identity
                </p>
              </div>

              <Link
                href="/user/activity"
                className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                View history
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.type}-${index}`}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--live-soft)] text-[var(--live)]">
                    <CheckCircle2 size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">
                      {activity.type}
                    </div>

                    <div className="mt-1 truncate text-xs text-[var(--text-muted)]">
                      {activity.asset}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {activity.time}
                    </div>

                    <div className="mt-1 font-mono text-[9px] text-[var(--live)]">
                      {activity.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* IDENTITY & SECURITY                                          */}
          {/* ========================================================== */}

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <h3 className="font-display text-lg font-semibold">
                Identity & Security
              </h3>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Your decentralized identity status
              </p>
            </div>

            <div className="space-y-3 p-5">
              <SecurityRow
                label="Identity Status"
                value="Verified"
                status="success"
              />

              <SecurityRow
                label="Wallet"
                value="Connected"
                status="success"
              />

              <SecurityRow
                label="DID"
                value={user.did}
                status="success"
              />

              <SecurityRow
                label="Role"
                value={user.role}
                status="success"
              />
            </div>

            <div className="border-t border-[var(--border)] p-5">
              <Link
                href="/user/identity"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-xs font-medium transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <Fingerprint size={14} />
                View My Identity
              </Link>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* EXPIRING ACCESS NOTICE                                         */}
        {/* ============================================================ */}

        {expiringSoon > 0 && (
          <section className="mt-6 rounded-xl border border-[var(--asset)]/30 bg-[var(--surface)]">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--asset)]/10 text-[var(--asset)]">
                <Clock3 size={18} />
              </div>

              <div className="flex-1">
                <div className="font-medium">
                  Access permission expiring soon
                </div>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Your access to Navigation System Specification expires
                  on October 04, 2026.
                </p>
              </div>

              <Link
                href="/user/access"
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-medium text-white transition hover:opacity-90"
              >
                View Access
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* FOOTER                                                         */}
        {/* ============================================================ */}

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row">
          <span className="font-mono">
            BHARATCHAIN · USER WORKSPACE
          </span>

          <span className="font-mono">
            IDENTITY · ASSETS · ACCESS · ACTIVITY
          </span>
        </footer>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* COMPONENTS                                                               */
/* ======================================================================== */

function IdentityItem({
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
      <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </div>

      <div
        className={`text-sm font-medium ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.14em] text-[var(--text-muted)]">
          {label.toUpperCase()}
        </span>

        <Icon
          size={16}
          className={
            accent
              ? "text-[var(--asset)]"
              : "text-[var(--text-muted)]"
          }
        />
      </div>

      <div
        className={`font-display text-2xl font-bold ${
          accent ? "text-[var(--asset)]" : ""
        }`}
      >
        {value}
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-[var(--text-muted)] transition group-hover:text-[var(--accent)]">
        View details
        <ArrowUpRight size={11} />
      </div>
    </Link>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>

        <Icon
          size={13}
          className={
            accent
              ? "text-[var(--asset)]"
              : "text-[var(--live)]"
          }
        />
      </div>

      <div
        className={`mt-2 font-display text-xl font-bold ${
          accent ? "text-[var(--asset)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function AssetStatus({ status }: { status: string }) {
  const owned = status === "Owned";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${
        owned
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[var(--live-soft)] text-[var(--live)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          owned
            ? "bg-[var(--accent)]"
            : "bg-[var(--live)]"
        }`}
      />

      {status}
    </span>
  );
}

function AccessStatus({ status }: { status: string }) {
  const expiring = status === "Expiring Soon";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
        expiring
          ? "text-[var(--asset)]"
          : "text-[var(--live)]"
      }`}
    >
      {expiring ? (
        <Clock3 size={11} />
      ) : (
        <CheckCircle2 size={11} />
      )}

      {status}
    </span>
  );
}

function SecurityRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "success";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-3">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px]">
          {value}
        </span>

        {status === "success" && (
          <CheckCircle2
            size={13}
            className="text-[var(--live)]"
          />
        )}
      </div>
    </div>
  );
}