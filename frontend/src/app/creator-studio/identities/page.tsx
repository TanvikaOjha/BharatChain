"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Copy,
  Fingerprint,
  KeyRound,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  User,
  UserCog,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type IdentityStatus = "Active" | "Suspended" | "Revoked";

type Identity = {
  id: string;
  name: string;
  did: string;
  wallet: string;
  role: string;
  department: string;
  status: IdentityStatus;
  registered: string;
  lastActivity: string;
  assets: number;
};

const identities: Identity[] = [
  {
    id: "DID-0082",
    name: "Arjun Mehta",
    did: "did:bharatchain:8f3a...91c2",
    wallet: "0x82A4...91F2",
    role: "Engineer",
    department: "Radar Systems",
    status: "Active",
    registered: "Aug 12, 2026",
    lastActivity: "2 min ago",
    assets: 4,
  },
  {
    id: "DID-0147",
    name: "Priya Sharma",
    did: "did:bharatchain:4a72...c831",
    wallet: "0x31B7...A812",
    role: "Manager",
    department: "Firmware Division",
    status: "Active",
    registered: "Aug 15, 2026",
    lastActivity: "18 min ago",
    assets: 7,
  },
  {
    id: "DID-0211",
    name: "Rahul Verma",
    did: "did:bharatchain:91d2...72c1",
    wallet: "0x91D2...72C1",
    role: "Engineer",
    department: "Engineering Team Alpha",
    status: "Active",
    registered: "Aug 21, 2026",
    lastActivity: "34 min ago",
    assets: 3,
  },
  {
    id: "DID-0042",
    name: "Neha Kapoor",
    did: "did:bharatchain:54c1...b029",
    wallet: "0x54C1...B029",
    role: "Auditor",
    department: "Security & Compliance",
    status: "Suspended",
    registered: "Jul 28, 2026",
    lastActivity: "1 hr ago",
    assets: 2,
  },
  {
    id: "DID-0104",
    name: "Vikram Singh",
    did: "did:bharatchain:72f1...d820",
    wallet: "0x72F1...D820",
    role: "Engineer",
    department: "Navigation Systems",
    status: "Active",
    registered: "Aug 08, 2026",
    lastActivity: "2 hrs ago",
    assets: 5,
  },
  {
    id: "DID-0178",
    name: "Aisha Khan",
    did: "did:bharatchain:a921...c441",
    wallet: "0xA921...C441",
    role: "Engineer",
    department: "Sensor Systems",
    status: "Revoked",
    registered: "Aug 18, 2026",
    lastActivity: "Sep 25, 2026",
    assets: 1,
  },
  {
    id: "DID-0026",
    name: "Rohan Desai",
    did: "did:bharatchain:31e8...442a",
    wallet: "0x31E8...442A",
    role: "Admin",
    department: "Platform Operations",
    status: "Active",
    registered: "Jul 19, 2026",
    lastActivity: "3 hrs ago",
    assets: 9,
  },
  {
    id: "DID-0193",
    name: "Kavya Nair",
    did: "did:bharatchain:7b12...e902",
    wallet: "0x7B12...E902",
    role: "Engineer",
    department: "Thermal Systems",
    status: "Active",
    registered: "Aug 22, 2026",
    lastActivity: "5 hrs ago",
    assets: 2,
  },
];

const roleOptions = ["All Roles", "Admin", "Manager", "Engineer", "Auditor"];

const statusOptions = [
  "All Status",
  "Active",
  "Suspended",
  "Revoked",
] as const;

export default function IdentityManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("All Status");

  const [selectedIdentity, setSelectedIdentity] =
    useState<Identity | null>(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [identityList, setIdentityList] = useState(identities);

  const filteredIdentities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return identityList.filter((identity) => {
      const matchesSearch =
        !query ||
        identity.name.toLowerCase().includes(query) ||
        identity.id.toLowerCase().includes(query) ||
        identity.did.toLowerCase().includes(query) ||
        identity.wallet.toLowerCase().includes(query) ||
        identity.department.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All Roles" || identity.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        identity.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, identityList]);

  const activeCount = identityList.filter(
    (identity) => identity.status === "Active"
  ).length;

  const suspendedCount = identityList.filter(
    (identity) => identity.status === "Suspended"
  ).length;

  const revokedCount = identityList.filter(
    (identity) => identity.status === "Revoked"
  ).length;

  const totalAssets = identityList.reduce(
    (sum, identity) => sum + identity.assets,
    0
  );

  function copyText(value: string) {
    navigator.clipboard?.writeText(value);
  }

  function updateIdentityStatus(
    identityId: string,
    status: IdentityStatus
  ) {
    setIdentityList((current) =>
      current.map((identity) =>
        identity.id === identityId
          ? { ...identity, status }
          : identity
      )
    );

    setSelectedIdentity((current) =>
      current?.id === identityId
        ? { ...current, status }
        : current
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-muted">
              <Link
                href="/creator-studio"
                className="transition-colors hover:text-accent"
              >
                Creator Studio
              </Link>

              <ChevronRight size={14} />

              <span>Identity Management</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Fingerprint size={21} />
              </div>

              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Identity Management
                </h1>

                <p className="mt-0.5 text-sm text-text-muted">
                  Register, verify, and manage decentralized identities.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={17} />
            Register Identity
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-8">
        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Identities"
            value={identityList.length}
            description="Registered DIDs"
            icon={Fingerprint}
            iconClass="bg-accent-soft text-accent"
          />

          <StatCard
            label="Active Identities"
            value={activeCount}
            description="Currently verified"
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Suspended"
            value={suspendedCount}
            description="Require attention"
            icon={ShieldCheck}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Assets Linked"
            value={totalAssets}
            description="Across all identities"
            icon={Wallet}
            iconClass="bg-indigo-50 text-indigo-600"
          />
        </section>

        {/* Security notice */}
        <section className="mt-6 rounded-2xl border border-accent/15 bg-accent-soft/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
              <KeyRound size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Decentralized Identity Registry
              </h2>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-text-muted">
                Each identity is represented by a decentralized identifier
                (DID) and linked wallet. Identity registration and status
                changes are intended to be recorded through the BharatChain
                identity layer.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Identity Registry
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {filteredIdentities.length} of {identityList.length} identities
                shown
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}
              <div className="relative min-w-[280px]">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search DID, name, wallet..."
                  className="h-10 w-full rounded-xl border border-border bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
              </div>

              {/* Role */}
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {roleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as (typeof statusOptions)[number]
                  )
                }
                className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-border bg-bg/60 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Identity</th>
                  <th className="px-5 py-3">DID</th>
                  <th className="px-5 py-3">Wallet</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Assets</th>
                  <th className="px-5 py-3">Last Activity</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredIdentities.map((identity) => (
                  <tr
                    key={identity.id}
                    className="border-b border-border last:border-0 hover:bg-bg/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                          <User size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            {identity.name}
                          </p>

                          <p className="mt-0.5 text-xs text-text-muted">
                            {identity.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => copyText(identity.did)}
                        className="group flex items-center gap-2 font-mono text-xs text-text-muted transition hover:text-accent"
                        title="Copy DID"
                      >
                        {identity.did}
                        <Copy
                          size={13}
                          className="opacity-0 transition group-hover:opacity-100"
                        />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => copyText(identity.wallet)}
                        className="group flex items-center gap-2 font-mono text-xs text-text-muted transition hover:text-accent"
                        title="Copy wallet"
                      >
                        {identity.wallet}
                        <Copy
                          size={13}
                          className="opacity-0 transition group-hover:opacity-100"
                        />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {identity.role}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {identity.department}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={identity.status} />
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold">
                        {identity.assets}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-text-muted">
                      {identity.lastActivity}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedIdentity(identity)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                      >
                        View
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="divide-y divide-border lg:hidden">
            {filteredIdentities.map((identity) => (
              <div key={identity.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <User size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {identity.name}
                      </p>

                      <p className="mt-0.5 text-xs text-text-muted">
                        {identity.id}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={identity.status} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MobileField
                    label="DID"
                    value={identity.did}
                    mono
                  />

                  <MobileField
                    label="Wallet"
                    value={identity.wallet}
                    mono
                  />

                  <MobileField
                    label="Role"
                    value={identity.role}
                  />

                  <MobileField
                    label="Department"
                    value={identity.department}
                  />

                  <MobileField
                    label="Linked Assets"
                    value={String(identity.assets)}
                  />

                  <MobileField
                    label="Last Activity"
                    value={identity.lastActivity}
                  />
                </div>

                <button
                  onClick={() => setSelectedIdentity(identity)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
                >
                  View Identity
                  <ArrowUpRight size={15} />
                </button>
              </div>
            ))}
          </div>

          {filteredIdentities.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-text-muted">
                <Search size={21} />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No identities found
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* Bottom information */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={Fingerprint}
            title="DID-Based Identity"
            description="Every registered identity receives a unique decentralized identifier."
          />

          <InfoCard
            icon={ShieldCheck}
            title="Role-Based Access"
            description="Identity roles can be used to determine what resources and actions are permitted."
          />

          <InfoCard
            icon={Users}
            title="Identity Lifecycle"
            description="Registration, suspension, and revocation provide administrative control over identity status."
          />
        </section>
      </main>

      {/* Identity Details Modal */}
      {selectedIdentity && (
        <IdentityDetailsModal
          identity={selectedIdentity}
          onClose={() => setSelectedIdentity(null)}
          onStatusChange={(status) =>
            updateIdentityStatus(selectedIdentity.id, status)
          }
        />
      )}

      {/* Register Identity Modal */}
      {showRegisterModal && (
        <RegisterIdentityModal
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{label}</p>

          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-text-muted">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: IdentityStatus }) {
  const config = {
    Active: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    Suspended: {
      icon: ShieldCheck,
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    Revoked: {
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-100",
    },
  };

  const item = config[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function MobileField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-bg p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-sm font-medium ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-text-muted">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Identity Details Modal                                                     */
/* -------------------------------------------------------------------------- */

function IdentityDetailsModal({
  identity,
  onClose,
  onStatusChange,
}: {
  identity: Identity;
  onClose: () => void;
  onStatusChange: (status: IdentityStatus) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Fingerprint size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">
                  {identity.name}
                </h2>

                <StatusBadge status={identity.status} />
              </div>

              <p className="mt-1 font-mono text-xs text-text-muted">
                {identity.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-bg hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal content */}
        <div className="space-y-6 p-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Identity Information
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Identity ID" value={identity.id} />

              <DetailItem
                label="Registered"
                value={identity.registered}
              />

              <DetailItem
                label="Name"
                value={identity.name}
              />

              <DetailItem
                label="Role"
                value={identity.role}
              />

              <DetailItem
                label="Department"
                value={identity.department}
              />

              <DetailItem
                label="Linked Assets"
                value={`${identity.assets} assets`}
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Decentralized Identity
            </p>

            <div className="space-y-3">
              <CopyRow
                label="DID"
                value={identity.did}
              />

              <CopyRow
                label="Wallet"
                value={identity.wallet}
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Activity
            </p>

            <div className="rounded-xl border border-border bg-bg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  Last Activity
                </span>

                <span className="text-sm font-semibold">
                  {identity.lastActivity}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-5">
            <div className="relative">
              <button
                onClick={() => setShowActions((value) => !value)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg"
              >
                <MoreHorizontal size={17} />
                Identity Actions
              </button>

              {showActions && (
                <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                  {identity.status !== "Active" && (
                    <button
                      onClick={() => {
                        onStatusChange("Active");
                        setShowActions(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-bg"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600"
                      />
                      Activate Identity
                    </button>
                  )}

                  {identity.status !== "Suspended" && (
                    <button
                      onClick={() => {
                        onStatusChange("Suspended");
                        setShowActions(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-bg"
                    >
                      <ShieldCheck
                        size={16}
                        className="text-amber-600"
                      />
                      Suspend Identity
                    </button>
                  )}

                  {identity.status !== "Revoked" && (
                    <button
                      onClick={() => {
                        onStatusChange("Revoked");
                        setShowActions(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle size={16} />
                      Revoke Identity
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Register Identity Modal                                                    */
/* -------------------------------------------------------------------------- */

function RegisterIdentityModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState("Engineer");
  const [department, setDepartment] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Register Identity
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Create a new decentralized identity record.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-bg hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <FormField
            label="Identity Name"
            placeholder="e.g. Arjun Mehta"
            value={name}
            onChange={setName}
          />

          <FormField
            label="Wallet Address"
            placeholder="0x..."
            value={wallet}
            onChange={setWallet}
            mono
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Role
              </label>

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Engineer</option>
                <option>Auditor</option>
              </select>
            </div>

            <FormField
              label="Department"
              placeholder="e.g. Radar Systems"
              value={department}
              onChange={setDepartment}
            />
          </div>

          <div className="rounded-xl border border-accent/15 bg-accent-soft/50 p-4">
            <div className="flex gap-3">
              <Fingerprint
                size={18}
                className="mt-0.5 shrink-0 text-accent"
              />

              <div>
                <p className="text-sm font-semibold">
                  DID generation
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  The decentralized identifier will be generated by the
                  identity layer after registration.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border pt-5">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg"
            >
              Cancel
            </button>

            <button
              onClick={onClose}
              disabled={!name || !wallet || !department}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Fingerprint size={16} />
              Register Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-bg p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function CopyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg p-3.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>

        <p className="mt-1 truncate font-mono text-xs">{value}</p>
      </div>

      <button
        onClick={() =>
          navigator.clipboard?.writeText(value)
        }
        className="shrink-0 rounded-lg p-2 text-text-muted transition hover:bg-surface hover:text-accent"
        title={`Copy ${label}`}
      >
        <Copy size={15} />
      </button>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/10 ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}