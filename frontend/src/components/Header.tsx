'use client';
 
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useNetworkGuard } from '../hooks/useNetworkGuard';
import { truncateAddress } from '../lib/identities';
import { NotificationCenter } from './NotificationCenter';
 
export function Header() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isWrongNetwork, isSwitching, switchToRequiredNetwork } = useNetworkGuard();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const nextTheme = storedTheme === 'dark' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };
 
  return (
    <>
      {isWrongNetwork && (
        <div className="network-banner" role="alert">
          Wrong network detected.{' '}
          <button onClick={switchToRequiredNetwork} disabled={isSwitching}>
            {isSwitching ? 'Switching…' : 'Switch to Sepolia'}
          </button>
        </div>
      )}
 
      <header className="app-header card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
        <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 700 }}>
            On-Chain DRM
          </Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/creator-studio">Creator Studio</Link>
          <Link href="/agent-terminal">Agent Terminal</Link>
        </nav>
 
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
 
          {isConnected && <NotificationCenter />}
 
          {isConnected ? (
            <button onClick={() => disconnect()}>{truncateAddress(address ?? '')}</button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setConnectMenuOpen((v) => !v)}>Connect Wallet</button>
              {connectMenuOpen && (
                <div className="card" style={{ position: 'absolute', right: 0, top: '2.5rem', padding: '0.5rem', zIndex: 20 }}>
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => {
                        connect({ connector });
                        setConnectMenuOpen(false);
                      }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0.6rem' }}
                    >
                      {connector.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}