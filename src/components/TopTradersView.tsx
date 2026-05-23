/**
 * TopTradersView - Professional leaderboard / whale following interface.
 * Shows ranked traders with PnL, win rate, and copy-trade functionality.
 */
import { useState, useEffect } from "react";
import { Copy, Eye, Shield, Users, Code, Lock } from "lucide-react";

interface Trader {
  rank: number;
  address: string;
  label: string;
  pnl30d: number;
  winRate: number;
  trades30d: number;
  avgSize: number;
  roi: number;
  topMarket: string;
  isFollowing: boolean;
  verified: boolean;
}

interface Strategy {
  id: string;
  name: string;
  author: string;
  pnl30d: number;
  winRate: number;
  aum: number;
  feePct: number;
  isFollowing: boolean;
  isEncrypted: boolean;
}

const INITIAL_TRADERS: Trader[] = [
  { rank: 1, address: "0x3f91...8a2d", label: "apex_arb",    pnl30d: 248412, winRate: 0.731, trades30d: 412, avgSize: 8200,  roi: 34.2, topMarket: "TRUMP_WIN_2026",  isFollowing: false, verified: true },
  { rank: 2, address: "0xa1cc...f44f", label: "kalshi_pro7",  pnl30d: 191880, winRate: 0.682, trades30d: 298, avgSize: 12400, roi: 28.7, topMarket: "FED_CUT_JUNE",    isFollowing: true,  verified: true },
  { rank: 3, address: "0x91bb...e12b", label: "poly_whale_1", pnl30d: 142340, winRate: 0.649, trades30d: 517, avgSize: 4100,  roi: 22.1, topMarket: "BTC_USD_100K",    isFollowing: false, verified: false },
  { rank: 4, address: "0x2d44...7f30", label: "event_sage",   pnl30d: 98220,  winRate: 0.621, trades30d: 181, avgSize: 18000, roi: 18.4, topMarket: "SCOTUS_RULING",   isFollowing: false, verified: true },
  { rank: 5, address: "0xf812...3c9a", label: "quant_desk3",  pnl30d: 74190,  winRate: 0.601, trades30d: 892, avgSize: 2200,  roi: 14.9, topMarket: "SPX_6K_DEC",      isFollowing: false, verified: false },
  { rank: 6, address: "0x77de...1b44", label: "news_alpha",   pnl30d: 61440,  winRate: 0.588, trades30d: 244, avgSize: 6700,  roi: 12.3, topMarket: "UKRAINE_PEACE",   isFollowing: false, verified: true },
  { rank: 7, address: "0xcc22...aef0", label: "mm_kalshi",    pnl30d: 52180,  winRate: 0.571, trades30d: 1241,avgSize: 1100,  roi: 10.4, topMarket: "NVDA_200_JUL",    isFollowing: false, verified: false },
  { rank: 8, address: "0x44fa...2210", label: "the_hedger",   pnl30d: 44010,  winRate: 0.562, trades30d: 88,  avgSize: 22000, roi: 8.8,  topMarket: "DEBT_CEILING_Q4", isFollowing: false, verified: true },
];

const INITIAL_STRATEGIES: Strategy[] = [
  { id: "s1", name: "Trump_Volatility_Arb", author: "apex_arb", pnl30d: 182400, winRate: 0.82, aum: 1250000, feePct: 15, isFollowing: true, isEncrypted: true },
  { id: "s2", name: "Yield_Farmer_Poly", author: "quant_desk3", pnl30d: 84000, winRate: 0.95, aum: 4500000, feePct: 5, isFollowing: false, isEncrypted: true },
  { id: "s3", name: "FOMC_Rate_Scaler", author: "kalshi_pro7", pnl30d: 65100, winRate: 0.61, aum: 800000, feePct: 20, isFollowing: false, isEncrypted: false },
  { id: "s4", name: "SCOTUS_Trend_Follow", author: "event_sage", pnl30d: 42000, winRate: 0.58, aum: 250000, feePct: 10, isFollowing: false, isEncrypted: true },
];

function PnLSparkline({ roi }: { roi: number }) {
  const points = Array.from({ length: 12 }, (_, i) => {
    const noise = (Math.random() - 0.4) * roi * 0.3;
    return (roi / 12) * (i + 1) + noise;
  });
  const min = Math.min(0, ...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const h = 24;
  const w = 64;
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path
        d={pathD}
        fill="none"
        stroke={roi >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopTradersView() {
  const [viewMode, setViewMode] = useState<"traders" | "strategies">("traders");
  const [traders, setTraders] = useState<Trader[]>(INITIAL_TRADERS);
  const [strategies, setStrategies] = useState<Strategy[]>(INITIAL_STRATEGIES);
  const [sortBy, setSortBy] = useState<"pnl30d" | "roi" | "winRate">("pnl30d");

  const sorted = [...traders].sort((a, b) => b[sortBy] - a[sortBy]);

  const toggleFollow = (rank: number) => {
    setTraders((prev) =>
      prev.map((t) => (t.rank === rank ? { ...t, isFollowing: !t.isFollowing } : t))
    );
  };

  // Jitter PnL values for live feel
  useEffect(() => {
    const id = setInterval(() => {
      setTraders((prev) =>
        prev.map((t) => ({
          ...t,
          pnl30d: Math.round(t.pnl30d + (Math.random() - 0.48) * 800),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden ">
      {/* Header Toggle */}
      <div className="px-4 py-2 border-b flex items-center gap-4 bg-[var(--color-mu-surface)]" style={{ borderColor: "var(--color-mu-border)" }}>
        <div className="flex items-center gap-2 bg-black p-1 rounded border" style={{ borderColor: "var(--color-mu-border)" }}>
          <button 
            onClick={() => setViewMode("traders")}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${viewMode === "traders" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-text-bright)]" : "text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-text)]"}`}
          >
            <Users size={12} style={{ color: viewMode === "traders" ? "var(--color-mu-accent)" : "inherit" }} />
            Whale Tracker
          </button>
          <button 
            onClick={() => setViewMode("strategies")}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${viewMode === "strategies" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-text-bright)]" : "text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-text)]"}`}
          >
            <Code size={12} style={{ color: viewMode === "strategies" ? "var(--color-mu-cyan)" : "inherit" }} />
            Strategy Marketplace
          </button>
        </div>
      </div>
      {/* Stats bar */}
      <div
        className="grid grid-cols-4 border-b px-4 py-3 gap-4"
        style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}
      >
        {viewMode === "traders" ? [
          { label: "Tracked Wallets", value: "1,247", color: "var(--color-mu-cyan)" },
          { label: "Total Volume 30D", value: "$2.41B", color: "var(--color-mu-text-bright)" },
          { label: "Avg Win Rate (Top 10)", value: "63.8%", color: "var(--color-mu-green)" },
          { label: "Highest PnL 30D", value: "$248K", color: "var(--color-mu-accent)" },
        ].map((s) => (
          <div key={s.label}>
            <div className="mu-label">{s.label}</div>
            <div
              className="text-[15px] font-black mt-1 font-mono"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </div>
        )) : [
          { label: "Active Marketplace Bots", value: "142", color: "var(--color-mu-cyan)" },
          { label: "Total Strategy AUM", value: "$18.4M", color: "var(--color-mu-text-bright)" },
          { label: "Avg Win Rate", value: "71.2%", color: "var(--color-mu-green)" },
          { label: "Total Creator Fees 30D", value: "$1.2M", color: "var(--color-mu-accent)" },
        ].map((s) => (
          <div key={s.label}>
            <div className="mu-label">{s.label}</div>
            <div
              className="text-[15px] font-black mt-1 font-mono"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Sort controls */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b"
        style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-mid)" }}
      >
        <span className="mu-label mr-2">Sort by:</span>
        {([["pnl30d", "30D PnL"], ["roi", "ROI %"], ["winRate", "Win Rate"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className="px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider "
            style={{
              background: sortBy === key ? "var(--color-mu-surface-top)" : "transparent",
              color: sortBy === key ? "var(--color-mu-text)" : "var(--color-mu-text-muted)",
              border: `1px solid ${sortBy === key ? "var(--color-mu-border-focus)" : "var(--color-mu-border)"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead className="mu-table-header">
            <tr>
              <th className="text-left pl-4">Rank</th>
              <th className="text-left">{viewMode === "traders" ? "Trader" : "Strategy"}</th>
              <th className="text-right">30D PnL</th>
              <th className="text-right">{viewMode === "traders" ? "ROI" : "AUM"}</th>
              <th className="text-right">Win Rate</th>
              <th className="text-right">{viewMode === "traders" ? "Trades" : "Fee %"}</th>
              <th className="text-right">{viewMode === "traders" ? "Avg Size" : "Encryption"}</th>
              <th className="text-right">{viewMode === "traders" ? "Top Market" : "Author"}</th>
              <th className="text-right pr-4">30D Curve</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewMode === "traders" ? sorted.map((t) => {
              const isPos = t.pnl30d >= 0;
              return (
                <tr key={t.rank} className="mu-table-row">
                  <td className="pl-4">
                    <span
                      className="font-mono text-[12px] font-black"
                      style={{
                        color: t.rank <= 3 ? "var(--color-mu-accent)" : "var(--color-mu-text-muted)",
                      }}
                    >
                      #{t.rank}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black"
                        style={{
                          background: "var(--color-mu-surface-high)",
                          border: "1px solid var(--color-mu-border-high)",
                          color: "var(--color-mu-text-dim)",
                        }}
                      >
                        {t.label[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: "var(--color-mu-text)" }}
                          >
                            {t.label}
                          </span>
                          {t.verified && (
                            <Shield size={9} style={{ color: "var(--color-mu-cyan)" }} />
                          )}
                        </div>
                        <div
                          className="font-mono text-[8px]"
                          style={{ color: "var(--color-mu-text-muted)" }}
                        >
                          {t.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[12px] font-black"
                      style={{ color: isPos ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                    >
                      {isPos ? "+" : ""}${(t.pnl30d / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: isPos ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                    >
                      {isPos ? "+" : ""}{t.roi.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ width: 40, background: "var(--color-mu-surface-high)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${t.winRate * 100}%`,
                            background: t.winRate > 0.65 ? "var(--color-mu-green)" : t.winRate > 0.55 ? "var(--color-mu-cyan)" : "var(--color-mu-amber)",
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: "var(--color-mu-text-dim)", width: 36, textAlign: "right" }}
                      >
                        {(t.winRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right font-mono" style={{ color: "var(--color-mu-text-dim)" }}>
                    {t.trades30d.toLocaleString()}
                  </td>
                  <td className="text-right font-mono" style={{ color: "var(--color-mu-text-dim)" }}>
                    ${t.avgSize.toLocaleString()}
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                      style={{
                        color: "var(--color-mu-cyan)",
                        background: "rgba(59,158,202,0.08)",
                        border: "1px solid rgba(59,158,202,0.2)",
                      }}
                    >
                      {t.topMarket}
                    </span>
                  </td>
                  <td className="text-right pr-2">
                    <PnLSparkline roi={t.roi} />
                  </td>
                  <td className="pr-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        className="p-1.5 rounded "
                        style={{
                          background: "var(--color-mu-surface-high)",
                          border: "1px solid var(--color-mu-border-high)",
                          color: "var(--color-mu-text-muted)",
                        }}
                        title="View profile"
                      >
                        <Eye size={10} />
                      </button>
                      <button
                        onClick={() => toggleFollow(t.rank)}
                        className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider "
                        style={{
                          background: t.isFollowing ? "rgba(44,182,125,0.15)" : "var(--color-mu-surface-high)",
                          color: t.isFollowing ? "var(--color-mu-green)" : "var(--color-mu-text-muted)",
                          border: `1px solid ${t.isFollowing ? "var(--color-mu-green-dim)" : "var(--color-mu-border-high)"}`,
                        }}
                      >
                        <Copy size={8} className="inline mr-1" />
                        {t.isFollowing ? "Follow" : "Copy"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : strategies.map((s, idx) => {
              const isPos = s.pnl30d >= 0;
              return (
                <tr key={s.id} className="mu-table-row">
                  <td className="pl-4">
                    <span
                      className="font-mono text-[12px] font-black"
                      style={{
                        color: idx <= 2 ? "var(--color-mu-cyan)" : "var(--color-mu-text-muted)",
                      }}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black"
                        style={{
                          background: "rgba(59,158,202,0.15)",
                          border: "1px solid rgba(59,158,202,0.3)",
                          color: "var(--color-mu-cyan)",
                        }}
                      >
                        <Code size={10} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold font-mono" style={{ color: "var(--color-mu-text)" }}>
                          {s.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[12px] font-black"
                      style={{ color: isPos ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                    >
                      {isPos ? "+" : ""}${(s.pnl30d / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="font-mono text-[11px] font-bold" style={{ color: "var(--color-mu-text-bright)" }}>
                      ${(s.aum / 1000000).toFixed(2)}M
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ width: 40, background: "var(--color-mu-surface-high)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.winRate * 100}%`,
                            background: s.winRate > 0.65 ? "var(--color-mu-green)" : s.winRate > 0.55 ? "var(--color-mu-cyan)" : "var(--color-mu-amber)",
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: "var(--color-mu-text-dim)", width: 36, textAlign: "right" }}
                      >
                        {(s.winRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right font-mono" style={{ color: "var(--color-mu-text-dim)" }}>
                    {s.feePct}%
                  </td>
                  <td className="text-right flex items-center justify-end h-full pt-3">
                    {s.isEncrypted ? (
                       <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-[var(--color-mu-green)] bg-[rgba(44,182,125,0.1)] px-1.5 py-0.5 rounded border border-[rgba(44,182,125,0.2)]">
                         <Lock size={8}/> BOP_ENC
                       </span>
                    ) : (
                       <span className="text-[9px] uppercase tracking-widest font-black text-[var(--color-mu-text-muted)] bg-[var(--color-mu-surface-high)] px-1.5 py-0.5 rounded border border-[var(--color-mu-border)]">
                         OPEN_SRC
                       </span>
                    )}
                  </td>
                  <td className="text-right font-mono" style={{ color: "var(--color-mu-accent)" }}>
                    @{s.author}
                  </td>
                  <td className="text-right pr-2">
                    <PnLSparkline roi={s.winRate * 100} />
                  </td>
                  <td className="pr-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => {
                          setStrategies((prev) => prev.map((st) => (st.id === s.id ? { ...st, isFollowing: !st.isFollowing } : st)));
                        }}
                        className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider "
                        style={{
                          background: s.isFollowing ? "rgba(59,158,202,0.15)" : "var(--color-mu-surface-high)",
                          color: s.isFollowing ? "var(--color-mu-cyan)" : "var(--color-mu-text-muted)",
                          border: `1px solid ${s.isFollowing ? "var(--color-mu-cyan)" : "var(--color-mu-border-high)"}`,
                        }}
                      >
                        <Copy size={8} className="inline mr-1" />
                        {s.isFollowing ? "Active" : "Allocate"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
