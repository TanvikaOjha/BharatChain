import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

import { Providers } from "./providers";
import { TransactionStatusToast } from "../components/TransactionStatusToast";

import "./globals.css";

/* =========================================================
   FONTS
   ========================================================= */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

/* =========================================================
   METADATA
   ========================================================= */

export const metadata: Metadata = {
  title: "BharatChain",
  description:
    "Decentralized identity, digital asset ownership, and role-based access control.",
};

/* =========================================================
   ROOT LAYOUT
   ========================================================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${spaceGrotesk.variable}
          ${inter.variable}
          ${jetbrainsMono.variable}
          antialiased
        `}
      >
        <Providers>
          <main className="app-main">
            {children}
          </main>

          <TransactionStatusToast />
        </Providers>
      </body>
    </html>
  );
}