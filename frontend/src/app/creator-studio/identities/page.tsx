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
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { useIdentities, OnChainIdentity } from "../../../hooks/useIdentities";
import { useIdentityActions } from "../../../hooks/useIdentityActions";
import { ROLE_OPTIONS, ROLES } from "../../../lib/identityRegistry";
import { truncateAddress } from "../../../lib/identities";

type StatusFilter = "All Status" | "Active" | "Suspended" | "Revoked";
const statusOptions: StatusFilter[] = ["All Status", "Active", "Suspended", "Revoked"];

const roleFilterOptions = ["All Roles", ...ROLE_OPTIONS.map((r) => r.label)];

export default function IdentityManagementPage() {
  const { address: connectedAddress } = useAccount();
  const { identities, loading, error, refresh } = useIdentities();
  const actions = useIdentityActions();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");

  const [selectedIdentity, setSelectedIdentity] = useState<OnChainIdentity | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredIdentities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return identities.filter((identity) => {
      const matchesSearch =
        !query ||
        identity.did.toLowerCase().includes(query) ||
        identity.wallet.toLowerCase().includes(query);

      const matchesRole = roleFilter === "All Roles" || identity.roleLabel === roleFilter;

      const matchesStatus = statusFilter === "All Status" || identity.statusLabel === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [identities, search, roleFilter, statusFilter]);

  const activeCount = identities.filter((i) => i.statusLabel === "Active").length;
  const suspendedCount = identities.filter((i) => i.statusLabel === "Suspended").length;
  const revokedCount = identities.filter((i) => i.statusLabel === "Revoked").length;

  function copyText(value: string) {
    navigator.clipboard?.writeText(value);
  }

  async function handleStatusChange(wallet: string, action: "activate" | "suspend" | "revoke") {
    try {
      if (action === "activate") await actions.activateIdentity(wallet);
      if (action === "suspend") await actions.suspendIdentity(wallet);
      if (action === "revoke") await actions.revokeIdentity(wallet);
      await refresh();
      setSelectedIdentity(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Transaction failed.");
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-muted">
              <Link href="/creator-studio" className="transition-colors hover:text-accent">
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
                  Live registry read from the IdentityRegistry smart contract.
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => refresh()}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-bg"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : undefined} />
              Refresh
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={17} />
              Register Identity
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Identities"
            value={identities.length}
            description="Registered on-chain"
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
            label="Revoked"
            value={revokedCount}
            description="Standing removed"
            icon={XCircle}
            iconClass="bg-red-50 text-red-600"
          />
        </section>

        {/* Notice */}
        <section className="mt-6 rounded-2xl border border-accent/15 bg-accent-soft/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
              <KeyRound size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">Decentralized Identity Registry</h2>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-text-muted">
                Every row below comes from the <code>IdentityRegistry</code> contract's{" "}
                <code>IdentityRegistered</code> events plus a live <code>getIdentity</code> read per
                wallet. Name and department are not stored on-chain in this contract — only DID,
                wallet, role, status, and timestamps are.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-border bg-surface">
          <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Identity Registry</h2>

              <p className="mt-1 text-sm text-text-muted">
                {loading ? "Loading…" : `${filteredIdentities.length} of ${identities.length} identities shown`}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-[280px]">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search DID or wallet..."
                  className="h-10 w-full rounded-xl border border-border bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
              >
                {roleFilterOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
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
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-bg/60 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">DID</th>
                  <th className="px-5 py-3">Wallet</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3">Last Activity</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-text-muted">
                      Loading identities from the blockchain…
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredIdentities.map((identity) => (
                    <tr key={identity.wallet} className="border-b border-border last:border-0 hover:bg-bg/40">
                      <td className="px-5 py-4">
                        <button
                          onClick={() => copyText(identity.did)}
                          className="group flex items-center gap-2 font-mono text-xs text-text-muted transition hover:text-accent"
                          title="Copy DID"
                        >
                          <span className="max-w-[220px] truncate">{identity.did}</span>
                          <Copy size={13} className="opacity-0 transition group-hover:opacity-100" />
                        </button>

                        <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                          #{identity.sequence.toString().padStart(4, "0")}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => copyText(identity.wallet)}
                          className="group flex items-center gap-2 font-mono text-xs text-text-muted transition hover:text-accent"
                          title="Copy wallet"
                        >
                          {truncateAddress(identity.wallet)}
                          <Copy size={13} className="opacity-0 transition group-hover:opacity-100" />
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium">{identity.roleLabel}</span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={identity.statusLabel} />
                      </td>

                      <td className="px-5 py-4 text-sm text-text-muted">
                        {new Date(identity.registeredAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-sm text-text-muted">
                        {new Date(identity.lastActivityAt).toLocaleString()}
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
            {loading && (
              <p className="px-6 py-10 text-center text-sm text-text-muted">
                Loading identities from the blockchain…
              </p>
            )}

            {!loading &&
              filteredIdentities.map((identity) => (
                <div key={identity.wallet} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                        <User size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">{identity.roleLabel}</p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          #{identity.sequence.toString().padStart(4, "0")}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={identity.statusLabel} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MobileField label="DID" value={identity.did} mono />
                    <MobileField label="Wallet" value={identity.wallet} mono />
                    <MobileField label="Registered" value={new Date(identity.registeredAt).toLocaleDateString()} />
                    <MobileField label="Last Activity" value={new Date(identity.lastActivityAt).toLocaleString()} />
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

          {!loading && filteredIdentities.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-text-muted">
                <Search size={21} />
              </div>

              <h3 className="mt-4 text-sm font-semibold">No identities found</h3>

              <p className="mt-1 text-sm text-text-muted">
                {identities.length === 0
                  ? "No wallet has registered an identity yet."
                  : "Try changing your search or filters."}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Identity Details Modal */}
      {selectedIdentity && (
        <IdentityDetailsModal
          identity={selectedIdentity}
          isAdmin={connectedAddress?.toLowerCase() === selectedIdentity.wallet.toLowerCase() || true}
          busy={actions.isPending || actions.isConfirming}
          onClose={() => setSelectedIdentity(null)}
          onActivate={() => handleStatusChange(selectedIdentity.wallet, "activate")}
          onSuspend={() => handleStatusChange(selectedIdentity.wallet, "suspend")}
          onRevoke={() => handleStatusChange(selectedIdentity.wallet, "revoke")}
        />
      )}

      {/* Register Identity Modal */}
      {showRegisterModal && (
        <RegisterIdentityModal
          connectedAddress={connectedAddress}
          busy={actions.isPending || actions.isConfirming}
          onClose={() => setShowRegisterModal(false)}
          onRegisterSelf={async (did) => {
            await actions.registerSelf(did);
            await refresh();
            setShowRegisterModal(false);
          }}
          onRegisterOther={async (wallet, did, role) => {
            await actions.registerIdentity(wallet, did, role);
            await refresh();
            setShowRegisterModal(false);
          }}
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

          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>

          <p className="mt-1 text-xs text-text-muted">{description}</p>
        </div>

        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; className: string }> = {
    Active: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    Suspended: { icon: ShieldCheck, className: "bg-amber-50 text-amber-700 border-amber-100" },
    Revoked: { icon: XCircle, className: "bg-red-50 text-red-700 border-red-100" },
    Unregistered: { icon: XCircle, className: "bg-bg text-text-muted border-border" },
  };

  const item = config[status] ?? config.Unregistered;
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

function MobileField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-bg p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-1 truncate text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Identity Details Modal                                                     */
/* -------------------------------------------------------------------------- */

function IdentityDetailsModal({
  identity,
  isAdmin,
  busy,
  onClose,
  onActivate,
  onSuspend,
  onRevoke,
}: {
  identity: OnChainIdentity;
  isAdmin: boolean;
  busy: boolean;
  onClose: () => void;
  onActivate: () => void;
  onSuspend: () => void;
  onRevoke: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Fingerprint size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">{identity.roleLabel}</h2>
                <StatusBadge status={identity.statusLabel} />
              </div>

              <p className="mt-1 font-mono text-xs text-text-muted">
                #{identity.sequence.toString().padStart(4, "0")}
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

        <div className="space-y-6 p-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Identity Information
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Role" value={identity.roleLabel} />
              <DetailItem label="Registered" value={new Date(identity.registeredAt).toLocaleString()} />
              <DetailItem label="Status" value={identity.statusLabel} />
              <DetailItem label="Last Activity" value={new Date(identity.lastActivityAt).toLocaleString()} />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Decentralized Identity
            </p>

            <div className="space-y-3">
              <CopyRow label="DID" value={identity.did} />
              <CopyRow label="Wallet" value={identity.wallet} />
            </div>
          </div>

          {isAdmin && (
            <div className="border-t border-border pt-5">
              <div className="relative">
                <button
                  onClick={() => setShowActions((v) => !v)}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg disabled:opacity-50"
                >
                  <MoreHorizontal size={17} />
                  {busy ? "Submitting transaction…" : "Identity Actions"}
                </button>

                {showActions && !busy && (
                  <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                    {identity.statusLabel !== "Active" && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          onActivate();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-bg"
                      >
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        Activate Identity
                      </button>
                    )}

                    {identity.statusLabel !== "Suspended" && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          onSuspend();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-bg"
                      >
                        <ShieldCheck size={16} className="text-amber-600" />
                        Suspend Identity
                      </button>
                    )}

                    {identity.statusLabel !== "Revoked" && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          onRevoke();
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
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Register Identity Modal                                                    */
/* -------------------------------------------------------------------------- */

function RegisterIdentityModal({
  connectedAddress,
  busy,
  onClose,
  onRegisterSelf,
  onRegisterOther,
}: {
  connectedAddress?: string;
  busy: boolean;
  onClose: () => void;
  onRegisterSelf: (did: string) => Promise<void>;
  onRegisterOther: (wallet: string, did: string, role: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<"self" | "other">("self");
  const [did, setDid] = useState("");
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState<string>(ROLES.USER_ROLE);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (mode === "self") {
        await onRegisterSelf(did);
      } else {
        await onRegisterOther(wallet, did, role);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || busy || !did || (mode === "other" && !wallet);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Register Identity</h2>
            <p className="mt-1 text-sm text-text-muted">
              Writes a new identity directly to the IdentityRegistry contract.
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
          <div className="flex gap-2 rounded-xl border border-border bg-bg p-1">
            <button
              onClick={() => setMode("self")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === "self" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              Register my wallet
            </button>
            <button
              onClick={() => setMode("other")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === "other" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              Register another wallet
            </button>
          </div>

          {mode === "self" && connectedAddress && (
            <div className="rounded-lg bg-bg p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Connected Wallet
              </p>
              <p className="mt-1 font-mono text-sm">{connectedAddress}</p>
            </div>
          )}

          <FormField label="Decentralized Identifier (DID)">
            <div className="relative">
              <Fingerprint
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="did:bharatchain:8f3a...91c2"
                className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent"
              />
            </div>
          </FormField>

          {mode === "other" && (
            <>
              <FormField label="Wallet Address">
                <div className="relative">
                  <Wallet size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="0x..."
                    className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 font-mono text-xs outline-none focus:border-accent"
                  />
                </div>
              </FormField>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-text-muted">
                  Requires the connected wallet to hold <code>MANAGER_ROLE</code> on-chain.
                </p>
              </div>
            </>
          )}

          <div className="flex gap-3 border-t border-border pt-5">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:bg-bg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Fingerprint size={16} />
              {submitting || busy ? "Submitting…" : "Register Identity"}
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg p-3.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <p className="mt-1 truncate font-mono text-xs">{value}</p>
      </div>

      <button
        onClick={() => navigator.clipboard?.writeText(value)}
        className="shrink-0 rounded-lg p-2 text-text-muted transition hover:bg-surface hover:text-accent"
        title={`Copy ${label}`}
      >
        <Copy size={15} />
      </button>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}