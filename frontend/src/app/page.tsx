import Link from "next/link";
import NetworkGraph from "@/components/NetworkGraph";
import ThemeToggle from "@/components/ThemeToggle";
import ConnectWallet from "@/components/ConnectWallet";
import { Shield, User as UserIcon, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/creator-studio", label: "Creator Studio" },
  { href: "/agent-terminal", label: "Agent Terminal" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text md:h-screen md:overflow-hidden">
      {/* Nav */}
      <header className="flex h-[72px] items-center justify-between border-b border-border px-6 md:px-12 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <Shield
            size={22}
            className="text-accent"
            strokeWidth={2.25}
          />

          <div className="leading-tight">
            <p className="font-display text-base font-semibold">
              Bharat Chain
            </p>
            <p className="text-[11px] text-muted">
              Secure Registry
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ConnectWallet />
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] items-center px-6 py-8 md:px-10 lg:px-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 xl:gap-14">
          
          {/* Left: Copy */}
          <div className="flex flex-col items-start gap-5 lg:max-w-[600px]">
            <div className="flex items-center gap-2 rounded-full border border-live/30 bg-live-soft px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-live" />

              <span className="text-xs font-medium text-live">
                Network live
              </span>

              <span className="font-mono text-xs text-muted">
                Block 19,452,107
              </span>
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Decentralized identity,
              <br />
              verified assets.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted lg:text-lg">
              A role-based registry for verifiable digital identity and asset
              records. Every operation runs through transparent, auditable
              smart contracts — no intermediaries, no hidden state.
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/marketplace"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Explore network
              </Link>

              <button
                type="button"
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-text/30"
              >
                View documentation
              </button>
            </div>
          </div>

          {/* Right: Network + Login */}
          <div className="flex w-full items-center justify-center gap-6 xl:gap-10">
            
            {/* Graph */}
            <div className="w-[min(42vw,560px)] shrink-0">
              <NetworkGraph />
            </div>

            {/* Login Cards */}
            <div className="flex w-[280px] shrink-0 flex-col gap-4">
              <LoginCard
                icon={<Shield size={20} className="text-accent" />}
                iconBg="var(--accent-soft)"
                title="Admin login"
                subtitle="System management"
                cta="Log in as admin"
              />

              <LoginCard
                icon={<UserIcon size={20} className="text-identity" />}
                iconBg="color-mix(in srgb, var(--identity) 14%, transparent)"
                title="User login"
                subtitle="Access your wallet"
                cta="Log in as user"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginCard({
  icon,
  iconBg,
  title,
  subtitle,
  cta,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface/90 p-5 shadow-[var(--shadow)] backdrop-blur-md">
      {/* Card heading */}
      <div className="mb-5 flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: iconBg }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-muted">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Login button */}
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-text/30 hover:bg-accent-soft"
      >
        <span>{cta}</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}