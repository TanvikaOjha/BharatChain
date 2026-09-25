"use client";
// Same connect/disconnect/dropdown logic as Header.tsx, just restyled with the
// page's design tokens instead of inline styles. Kept as its own client
// component so page.tsx and NetworkGraph can stay server components.
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { truncateAddress } from "@/lib/identities"; // adjust path to match your alias if different

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-lg border border-border px-4 py-2 font-mono text-sm font-medium hover:border-text/30"
      >
        {truncateAddress(address ?? "")}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Connect wallet
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow)]">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent-soft"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}