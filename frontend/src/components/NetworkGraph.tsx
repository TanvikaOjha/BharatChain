// Replaces the old scattered-icon background with a deliberate two-ring
// diagram radiating from the core registry node. Coordinates are hardcoded
// (never Math.random) so server and client render identically — random
// positions would cause a hydration mismatch in Next.js.
import { Shield, Fingerprint, FileText, Database, User } from "lucide-react";

type Kind = "core" | "identity" | "asset" | "tx" | "user";
interface Node { id: string; kind: Kind; cx: number; cy: number; label?: string }

// Coordinate space is 0–640; converted to % below so it scales responsively.
const NODES: Node[] = [
  { id: "core", kind: "core", cx: 320, cy: 320, label: "Core_Reg" },
  { id: "n1", kind: "identity", cx: 320, cy: 140, label: "DID · 0x4a1f" },
  { id: "n2", kind: "identity", cx: 150, cy: 230 },
  { id: "n3", kind: "identity", cx: 490, cy: 230 },
  { id: "n4", kind: "asset", cx: 320, cy: 500, label: "NFT #8631" },
  { id: "n5", kind: "asset", cx: 150, cy: 410 },
  { id: "n6", kind: "asset", cx: 490, cy: 410 },
  { id: "n7", kind: "tx", cx: 195, cy: 320, label: "Tx · 0x7cac" },
  { id: "n8", kind: "tx", cx: 445, cy: 320 },
  { id: "n9", kind: "user", cx: 65, cy: 110, label: "User_6988" },
  { id: "n10", kind: "user", cx: 575, cy: 110 },
  { id: "n11", kind: "user", cx: 65, cy: 530 },
  { id: "n12", kind: "user", cx: 575, cy: 530, label: "User_1033" },
];

// Straight-to-core links plus a few outer links, so it reads as a mesh
// rather than a plain hub-and-spoke.
const PRIMARY: [string, string][] = [
  ["core", "n1"], ["core", "n2"], ["core", "n3"], ["core", "n4"],
  ["core", "n5"], ["core", "n6"], ["core", "n7"], ["core", "n8"],
];
const SECONDARY: [string, string][] = [
  ["n2", "n9"], ["n1", "n10"], ["n5", "n11"], ["n4", "n12"],
];

const ICONS: Record<Kind, typeof Shield> = { core: Shield, identity: Fingerprint, asset: FileText, tx: Database, user: User };
const SIZE: Record<Kind, number> = { core: 56, identity: 34, asset: 34, tx: 34, user: 28 };
const COLOR: Record<Kind, string> = {
  core: "var(--accent)", identity: "var(--identity)", asset: "var(--asset)",
  tx: "var(--tx)", user: "var(--text-muted)",
};

const find = (id: string) => NODES.find((n) => n.id === id)!;

export default function NetworkGraph() {
  return (
    <div className="relative aspect-square w-full max-w-[640px]">
      {/* Glow anchors the eye on the core node instead of every icon competing equally */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      {/* Lines fade out toward the edges so they never fight the login cards */}
      <svg
        viewBox="0 0 640 640"
        className="absolute inset-0 h-full w-full"
        style={{ maskImage: "radial-gradient(circle at 50% 50%, black 55%, transparent 85%)" }}
      >
        {PRIMARY.map(([a, b]) => {
          const f = find(a), t = find(b);
          return <line key={a + b} x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy} stroke="var(--border)" strokeWidth={1.5} />;
        })}
        {SECONDARY.map(([a, b]) => {
          const f = find(a), t = find(b);
          return <line key={a + b} x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy} stroke="var(--border)" strokeWidth={1} opacity={0.6} />;
        })}
      </svg>

      {NODES.map((node) => {
        const Icon = ICONS[node.kind];
        const size = SIZE[node.kind];
        const color = COLOR[node.kind];
        const isCore = node.kind === "core";
        return (
          <div
            key={node.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${(node.cx / 640) * 100}%`, top: `${(node.cy / 640) * 100}%` }}
          >
            <div
              className="flex items-center justify-center rounded-full bg-surface"
              style={{
                width: size, height: size,
                border: `${isCore ? 2 : 1}px solid ${isCore ? color : "var(--border)"}`,
                boxShadow: isCore ? `0 0 0 6px color-mix(in srgb, ${color} 12%, transparent)` : undefined,
              }}
            >
              <Icon size={isCore ? 22 : 14} color={color} strokeWidth={2} />
            </div>
            {node.label && (
              <span className="whitespace-nowrap rounded-full bg-surface/80 px-2 py-0.5 font-mono text-[11px] text-muted backdrop-blur-sm">
                {node.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}