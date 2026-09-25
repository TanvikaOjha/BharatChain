
"use client";

import { truncateAddress } from "@/lib/identities";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync, error } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  if (isConnected) {
    return (
      <button
        type="button"
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
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Connect wallet
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow)]">
          {connectors.map((connector) => (
            <button
              type="button"
              key={connector.uid}
              onClick={async () => {
                try {
                  await connectAsync({ connector });
                  setMenuOpen(false);
                  router.push("/user");
                } catch {
                  // Wallet rejected or connection failed.
                  // wagmi's error is displayed below.
                }
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent-soft"
            >
              {connector.name}
            </button>
          ))}

          {error && (
            <p className="mt-1 border-t border-border px-3 py-2 text-xs leading-relaxed text-red-500">
              {error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

