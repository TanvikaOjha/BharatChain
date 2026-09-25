"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Copy,
  Fingerprint,
  KeyRound,
  Shield,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const identity = {
  did: "DID-0082",
  didFull: "did:bharatchain:8f3a...91c2",
  name: "Arjun Mehta",
  role: "Engineer",
  department: "Radar Systems",
  status: "Active",
  registered: "Aug 12, 2026",
  lastVerified: "2 min ago",
  wallet: "0x82A4...91F2",
  network: "BharatChain Network",
};

const credentials = [
  {
    name: "Organization Identity",
    issuer: "BharatChain Identity Registry",
    issued: "Aug 12, 2026",
    status: "Verified",
  },
  {
    name: "Engineering Role",
    issuer: "Radar Systems",
    issued: "Aug 12, 2026",
    status: "Verified",
  },
  {
    name: "Department Membership",
    issuer: "Radar Systems",
    issued: "Aug 12, 2026",
    status: "Verified",
  },
];

const securityEvents = [
  {
    title: "Identity Verified",
    description:
      "Your decentralized identity was successfully verified.",
    time: "2 min ago",
    icon: ShieldCheck,
  },
  {
    title: "Wallet Connected",
    description:
      "Wallet 0x82A4...91F2 is associated with your identity.",
    time: "2 min ago",
    icon: Wallet,
  },
  {
    title: "Role Verified",
    description:
      "Your Engineer role was confirmed by the identity registry.",
    time: "Sep 24, 2026",
    icon: Shield,
  },
];

export default function MyIdentityPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>My Workspace</span>
            <ChevronRight size={14} />
            <span className="text-[var(--text)]">
              My Identity
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
                My Identity
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Manage and verify the decentralized identity associated
                with your BharatChain account.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              <CheckCircle2
                size={16}
                className="text-[var(--live)]"
              />

              <span className="text-xs font-medium text-[var(--text)]">
                Identity Verified
              </span>
            </div>
          </div>
        </div>

        {/* Identity Hero */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] bg-[var(--accent-soft)] px-5 py-6 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-sm">
                <Fingerprint size={32} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-[var(--text)]">
                    {identity.name}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--live-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--live)]">
                    <CheckCircle2 size={11} />
                    {identity.status}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                  {identity.did}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {identity.role} • {identity.department}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              label="Identity ID"
              value={identity.did}
              mono
            />

            <InfoItem
              label="Role"
              value={identity.role}
            />

            <InfoItem
              label="Department"
              value={identity.department}
            />

            <InfoItem
              label="Registered"
              value={identity.registered}
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* DID */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={Fingerprint}
                title="Decentralized Identifier"
                description="Your unique identity reference on BharatChain."
              />

              <div className="space-y-4 p-5">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    DID
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="min-w-0 break-all font-mono text-xs text-[var(--text)]">
                      {identity.didFull}
                    </code>

                    <button
                      type="button"
                      className="shrink-0 rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                      title="Copy DID"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--live-soft)] text-[var(--live)]">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        Identity verified
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                        Your identity is currently active and associated
                        with a verified wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wallet */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={Wallet}
                title="Connected Wallet"
                description="The blockchain wallet associated with your identity."
              />

              <div className="p-5">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                      <Wallet size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text)]">
                        Connected Wallet
                      </p>

                      <p className="mt-1 break-all font-mono text-xs text-[var(--text-muted)]">
                        {identity.wallet}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
                    <InfoItem
                      label="Network"
                      value={identity.network}
                    />

                    <InfoItem
                      label="Last Verified"
                      value={identity.lastVerified}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Credentials */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={Shield}
                title="Verified Credentials"
                description="Claims and roles associated with your identity."
              />

              <div className="divide-y divide-[var(--border)]">
                {credentials.map((credential) => (
                  <div
                    key={credential.name}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--live-soft)] text-[var(--live)]">
                        <CheckCircle2 size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {credential.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          Issued by {credential.issuer}
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                          Issued {credential.issued}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full bg-[var(--live-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--live)]">
                      {credential.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Activity */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={KeyRound}
                title="Identity Security Activity"
                description="Recent events involving your identity."
              />

              <div className="divide-y divide-[var(--border)]">
                {securityEvents.map((event) => {
                  const Icon = event.icon;

                  return (
                    <div
                      key={event.title}
                      className="flex gap-4 p-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {event.title}
                          </p>

                          <span className="text-[10px] text-[var(--text-muted)]">
                            {event.time}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border)] p-4">
                <Link
                  href="/user/activity"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
                >
                  View Full Activity
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Identity Summary */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <SectionHeader
                icon={User}
                title="Identity Summary"
                description="Current identity information."
              />

              <div className="space-y-4 p-5">
                <SummaryRow
                  label="Name"
                  value={identity.name}
                />

                <SummaryRow
                  label="Identity"
                  value={identity.did}
                  mono
                />

                <SummaryRow
                  label="Role"
                  value={identity.role}
                />

                <SummaryRow
                  label="Department"
                  value={identity.department}
                />

                <SummaryRow
                  label="Status"
                  value="Active"
                  live
                />
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--live-soft)] text-[var(--live)]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Identity Integrity
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Your identity, wallet association, and verified
                    credentials are currently valid.
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-[var(--live)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
                    All checks passed
                  </div>
                </div>
              </div>
            </section>

            {/* Important note */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <KeyRound size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Your keys stay yours
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    BharatChain uses your connected wallet to prove
                    ownership and authorize blockchain actions. Never
                    share your private key or recovery phrase.
                  </p>
                </div>
              </div>
            </section>

            {/* Activity link */}
            <Link
              href="/user/activity"
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:bg-[var(--bg)]"
            >
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">
                  Identity History
                </p>

                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                  View blockchain activity
                </p>
              </div>

              <ArrowUpRight
                size={15}
                className="text-[var(--text-muted)]"
              />
            </Link>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Identity • BharatChain User Workspace
          </span>

          <span className="font-mono">
            Identity data currently mocked
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[var(--border)] p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon size={17} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--text)]">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
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
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm font-medium text-[var(--text)] ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono = false,
  live = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  live?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <span
        className={`text-right text-xs font-medium ${
          live ? "text-[var(--live)]" : "text-[var(--text)]"
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}