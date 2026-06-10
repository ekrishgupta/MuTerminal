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
    <div className="flex-1 flex flex-col overflow-hidden bg-mu-bg">
      <div className="px-6 py-4 flex items-center gap-4 border-b border-mu-border">
        <div className="flex items-center gap-1.5 text-mu-blue font-bold px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Users size={16} />
          <span>Leaderboard</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setViewMode("traders")}
             className={`mu-pill whitespace-nowrap ${viewMode === 'traders' ? 'bg-mu-surface-high text-mu-text-bright' : ''}`}
           >
             Whale Tracker
           </button>
           <button 
             onClick={() => setViewMode("strategies")}
             className={`mu-pill whitespace-nowrap ${viewMode === 'strategies' ? 'bg-mu-surface-high text-mu-text-bright' : ''}`}
           >
             Strategy Marketplace
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 px-6 py-4 gap-4 border-b border-mu-border bg-mu-surface-low">
        {viewMode === "traders" ? [
          { label: "Tracked Wallets", value: "1,247", color: "var(--color-mu-text-bright)" },
          { label: "Total Volume 30D", value: "$2.41B", color: "var(--color-mu-text-bright)" },
          { label: "Avg Win Rate (Top 10)", value: "63.8%", color: "var(--color-mu-green)" },
          { label: "Highest PnL 30D", value: "$248K", color: "var(--color-mu-blue)" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">{s.label}</div>
            <div className="text-[18px] font-bold mt-1 tabular-nums" style={{ color: s.color }}>{s.value}</div>
          </div>
        )) : [
          { label: "Active Marketplace Bots", value: "142", color: "var(--color-mu-text-bright)" },
          { label: "Total Strategy AUM", value: "$18.4M", color: "var(--color-mu-text-bright)" },
          { label: "Avg Win Rate", value: "71.2%", color: "var(--color-mu-green)" },
          { label: "Total Creator Fees 30D", value: "$1.2M", color: "var(--color-mu-blue)" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">{s.label}</div>
            <div className="text-[18px] font-bold mt-1 tabular-nums" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-6 py-2 border-b border-mu-border bg-mu-surface">
        <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider mr-2">Sort by:</span>
        {([["pnl30d", "30D PnL"], ["roi", "ROI %"], ["winRate", "Win Rate"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
              sortBy === key 
                ? "bg-mu-surface-high text-mu-text-bright border-mu-border-high" 
                : "bg-transparent text-mu-text-dim border-transparent hover:text-mu-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        <table className="w-full border-collapse">
          <thead className="bg-mu-surface sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="text-left pl-6 py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Rank</th>
              <th className="text-left py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">{viewMode === "traders" ? "Trader" : "Strategy"}</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">30D PnL</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">{viewMode === "traders" ? "ROI" : "AUM"}</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Win Rate</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">{viewMode === "traders" ? "Trades" : "Fee %"}</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">{viewMode === "traders" ? "Avg Size" : "Encryption"}</th>
              <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">{viewMode === "traders" ? "Top Market" : "Author"}</th>
              <th className="text-right pr-4 py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">30D Curve</th>
              <th className="text-right pr-6 py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mu-border">
            {viewMode === "traders" ? sorted.map((t) => {
              const isPos = t.pnl30d >= 0;
              return (
                <tr key={t.rank} className="hover:bg-mu-surface-high transition-colors cursor-pointer group">
                  <td className="pl-6 py-4">
                    <span className={`font-mono text-[13px] font-bold ${t.rank <= 3 ? "text-mu-blue" : "text-mu-text-dim"}`}>
                      #{t.rank}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-mu-surface-low border border-mu-border flex items-center justify-center text-[12px] font-bold text-mu-text-dim">
                        {t.label[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-mu-text-bright">{t.label}</span>
                          {t.verified && <Shield size={10} className="text-mu-blue" />}
                        </div>
                        <span className="font-mono text-[10px] text-mu-text-dim">{t.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <span className={`text-[13px] font-bold tabular-nums ${isPos ? "text-mu-green" : "text-mu-red"}`}>
                      {isPos ? "+" : ""}${(t.pnl30d / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="text-right py-4">
                    <span className={`text-[13px] font-bold tabular-nums ${isPos ? "text-mu-green" : "text-mu-red"}`}>
                      {isPos ? "+" : ""}{t.roi.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-mu-surface-low overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${t.winRate * 100}%`,
                            background: t.winRate > 0.65 ? "var(--color-mu-green)" : t.winRate > 0.55 ? "var(--color-mu-blue)" : "var(--color-mu-yellow)",
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-mu-text tabular-nums w-8">
                        {(t.winRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text tabular-nums">
                    {t.trades30d.toLocaleString()}
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text tabular-nums">
                    ${t.avgSize.toLocaleString()}
                  </td>
                  <td className="text-right py-4">
                    <span className="text-[10px] font-mono font-bold text-mu-blue bg-mu-blue/10 px-2 py-0.5 rounded border border-mu-blue/20">
                      {t.topMarket}
                    </span>
                  </td>
                  <td className="text-right pr-2 py-4 flex justify-end">
                    <PnLSparkline roi={t.roi} />
                  </td>
                  <td className="pr-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded text-mu-text-dim hover:text-mu-text-bright hover:bg-mu-surface-low transition-colors">
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFollow(t.rank); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          t.isFollowing 
                            ? "bg-mu-green-soft text-mu-green border border-mu-green/20" 
                            : "bg-mu-surface-low text-mu-text-dim border border-mu-border hover:text-mu-text-bright hover:border-mu-border-high"
                        }`}
                      >
                        <Copy size={12} />
                        {t.isFollowing ? "Follow" : "Copy"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : strategies.map((s, idx) => {
              const isPos = s.pnl30d >= 0;
              return (
                <tr key={s.id} className="hover:bg-mu-surface-high transition-colors cursor-pointer group">
                  <td className="pl-6 py-4">
                    <span className={`font-mono text-[13px] font-bold ${idx <= 2 ? "text-mu-blue" : "text-mu-text-dim"}`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-mu-blue/10 border border-mu-blue/20 flex items-center justify-center text-mu-blue">
                        <Code size={12} />
                      </div>
                      <span className="text-[13px] font-bold text-mu-text-bright font-mono">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <span className={`text-[13px] font-bold tabular-nums ${isPos ? "text-mu-green" : "text-mu-red"}`}>
                      {isPos ? "+" : ""}${(s.pnl30d / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="text-right py-4">
                    <span className="text-[13px] font-bold text-mu-text-bright tabular-nums">
                      ${(s.aum / 1000000).toFixed(2)}M
                    </span>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-mu-surface-low overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.winRate * 100}%`,
                            background: s.winRate > 0.65 ? "var(--color-mu-green)" : s.winRate > 0.55 ? "var(--color-mu-blue)" : "var(--color-mu-yellow)",
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-mu-text tabular-nums w-8">
                        {(s.winRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text tabular-nums">
                    {s.feePct}%
                  </td>
                  <td className="text-right py-4 flex justify-end">
                    {s.isEncrypted ? (
                       <div className="flex items-center gap-1 text-[10px] font-bold text-mu-green bg-mu-green-soft px-2 py-0.5 rounded border border-mu-green/20">
                         <Lock size={10}/> BOP_ENC
                       </div>
                    ) : (
                       <div className="text-[10px] font-bold text-mu-text-dim bg-mu-surface-low px-2 py-0.5 rounded border border-mu-border">
                         OPEN_SRC
                       </div>
                    )}
                  </td>
                  <td className="text-right py-4 font-mono text-[11px] text-mu-blue">
                    @{s.author}
                  </td>
                  <td className="text-right pr-2 py-4 flex justify-end">
                    <PnLSparkline roi={s.winRate * 100} />
                  </td>
                  <td className="pr-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStrategies((prev) => prev.map((st) => (st.id === s.id ? { ...st, isFollowing: !st.isFollowing } : st)));
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          s.isFollowing 
                            ? "bg-mu-blue/10 text-mu-blue border border-mu-blue/30" 
                            : "bg-mu-surface-low text-mu-text-dim border border-mu-border hover:text-mu-text-bright hover:border-mu-border-high"
                        }`}
                      >
                        <Copy size={12} />
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
