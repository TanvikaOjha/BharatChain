// app/layout.tsx
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '../components/Header';
import { TransactionStatusToast } from '../components/TransactionStatusToast';
import './globals.css';

export const metadata: Metadata = {
  title: 'On-Chain DRM for the AI Era',
  description: 'Decentralized identity, NFT ownership, and RBAC-gated access control for AI training data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="app-main">{children}</main>
          <TransactionStatusToast />
        </Providers>
      </body>
    </html>
  );
}