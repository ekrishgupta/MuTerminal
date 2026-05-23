import { useState, useEffect } from "react";
import { Activity, Zap, ArrowRight, ShieldAlert, ArrowDownUp } from "lucide-react";
import { useBopBridge } from "../hooks/useBopBridge";

interface ArbOpportunity {
  id: string;
  market: string;
  venueBuy: "POLY" | "KALSHI" | "PI";
  venueSell: "POLY" | "KALSHI" | "PI";
  buyPrice: number;
  sellPrice: number;
  spread: number;
  maxSize: number;
  netProfit: number;
  status: "ACTIVE" | "EXECUTING" | "MISSED";
}

const SEED_OPPS: Omit<ArbOpportunity, "id" | "status">[] = [
  { market: "TRUMP_WIN_2026", venueBuy: "POLY", venueSell: "KALSHI", buyPrice: 0.612, sellPrice: 0.635, spread: 0.023, maxSize: 5000, netProfit: 115 },
  { market: "FED_CUT_JUNE", venueBuy: "KALSHI", venueSell: "POLY", buyPrice: 0.280, sellPrice: 0.295, spread: 0.015, maxSize: 12000, netProfit: 180 },
  { market: "SCOTUS_RULING", venueBuy: "POLY", venueSell: "PI", buyPrice: 0.450, sellPrice: 0.461, spread: 0.011, maxSize: 2500, netProfit: 27.5 },
  { market: "BTC_USD_100K", venueBuy: "POLY", venueSell: "KALSHI", buyPrice: 0.880, sellPrice: 0.892, spread: 0.012, maxSize: 8000, netProfit: 96 },
];

let arbId = 0;

export function ArbitrageMonitor() {
  const [opps, setOpps] = useState<ArbOpportunity[]>(() => 
    SEED_OPPS.map(o => ({ ...o, id: `arb-${++arbId}`, status: "ACTIVE" }))
  );

  const { isConnected, lastUpdate } = useBopBridge();

  useEffect(() => {
    if (!lastUpdate || (lastUpdate as any).type !== 'arb') return;
    
    const arb = lastUpdate as any;
    setOpps(prev => {
      // Find if we already have this opp
      const existing = prev.find(o => o.id === arb.id);
      if (existing) {
        return prev.map(o => o.id === arb.id ? { ...o, ...arb } : o);
      } else {
        return [{
          id: arb.id,
          market: arb.market || "UNKNOWN",
          venueBuy: arb.venueBuy || "POLY",
          venueSell: arb.venueSell || "KALSHI",
          buyPrice: arb.buyPrice || 0,
          sellPrice: arb.sellPrice || 0,
          spread: arb.spread || 0,
          maxSize: arb.maxSize || 0,
          netProfit: arb.netProfit || 0,
          status: arb.status || "ACTIVE",
        }, ...prev].slice(0, 10); // Keep last 10
      }
    });
  }, [lastUpdate]);

  // Simulate spread fluctuations
  useEffect(() => {
    if (isConnected) return;
    const id = setInterval(() => {
      setOpps(prev => prev.map(opp => {
        if (opp.status !== "ACTIVE") return opp;
        const drift = (Math.random() - 0.5) * 0.004;
        const newBuy = Math.max(0.01, opp.buyPrice + drift);
        const newSell = Math.max(0.01, opp.sellPrice + drift * 0.8);
        const newSpread = newSell - newBuy;
        
        // If spread closes, mark missed
        if (newSpread <= 0.002) {
          return { ...opp, status: "MISSED", buyPrice: newBuy, sellPrice: newSell, spread: newSpread, netProfit: 0 };
        }
        
        return { 
          ...opp, 
          buyPrice: newBuy, 
          sellPrice: newSell, 
          spread: newSpread,
          netProfit: newSpread * opp.maxSize 
        };
      }));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const handleExecute = (id: string) => {
    setOpps(prev => prev.map(o => o.id === id ? { ...o, status: "EXECUTING" } : o));
    
    // Simulate BOP atomic execution
    setTimeout(() => {
      setOpps(prev => prev.filter(o => o.id !== id));
      window.dispatchEvent(new CustomEvent("mu-notification", { 
        detail: `ARB EXECUTED: Captured $${(opps.find(o => o.id === id)?.netProfit || 0).toFixed(2)} on ${opps.find(o => o.id === id)?.market}`
      }));
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-mu-bg)]">
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}>
        <div className="flex items-center gap-3">
          <ArrowDownUp size={16} style={{ color: "var(--color-mu-purple)" }} />
          <span className="mu-heading text-[14px]">Cross-Exchange Arbitrage Monitor</span>
          <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest" style={{ background: "rgba(124,92,191,0.15)", color: "var(--color-mu-purple)", border: "1px solid rgba(124,92,191,0.3)" }}>BOP SCANNER ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="mu-label">Total Arb PnL (24h)</div>
            <div className="font-mono text-[13px] font-black" style={{ color: "var(--color-mu-green)" }}>+$1,284.50</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <div className="grid gap-3">
          {opps.length === 0 && (
            <div className="text-center py-12 opacity-50">
              <Activity size={32} className="mx-auto mb-3 animate-pulse" style={{ color: "var(--color-mu-purple)" }} />
              <div className="mu-label">Scanning venues for inefficiencies...</div>
            </div>
          )}
          {opps.map(opp => (
            <div key={opp.id} className="mu-panel p-0 overflow-hidden flex flex-col group relative" style={{ opacity: opp.status === "MISSED" ? 0.4 : 1 }}>
              {opp.status === "EXECUTING" && (
                <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div className="text-[11px] font-black tracking-widest uppercase mu-pulse-dot" style={{ color: "var(--color-mu-cyan)" }}>
                    EXECUTING ATOMIC LEGS...
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-high)" }}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] font-black" style={{ color: "var(--color-mu-text-bright)" }}>{opp.market}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--color-mu-surface-mid)", color: "var(--color-mu-text-dim)", border: "1px solid var(--color-mu-border)" }}>
                    Max Size: {opp.maxSize.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold mr-2" style={{ color: "var(--color-mu-text-dim)" }}>Net Arb Profit</span>
                  <span className="font-mono text-[15px] font-black" style={{ color: "var(--color-mu-green)" }}>
                    ${opp.netProfit.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="px-4 py-4 flex items-center justify-between gap-8">
                {/* Leg 1: BUY */}
                <div className="flex-1 flex items-center justify-between p-3 rounded" style={{ background: "rgba(44,182,125,0.05)", border: "1px solid rgba(44,182,125,0.15)" }}>
                  <div>
                    <div className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "var(--color-mu-green)" }}>LEG 1: BUY</div>
                    <div className="font-bold text-[11px]" style={{ color: "var(--color-mu-text-dim)" }}>@ {opp.venueBuy}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[16px] font-black" style={{ color: "var(--color-mu-green)" }}>{opp.buyPrice.toFixed(3)}</div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-1">
                  <ArrowRight size={16} style={{ color: "var(--color-mu-text-dim)" }} />
                  <span className="font-mono text-[10px] font-bold" style={{ color: "var(--color-mu-purple)" }}>
                    Δ {(opp.spread * 100).toFixed(1)}¢
                  </span>
                </div>

                {/* Leg 2: SELL */}
                <div className="flex-1 flex items-center justify-between p-3 rounded" style={{ background: "rgba(224,82,82,0.05)", border: "1px solid rgba(224,82,82,0.15)" }}>
                  <div>
                    <div className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "var(--color-mu-red)" }}>LEG 2: SELL</div>
                    <div className="font-bold text-[11px]" style={{ color: "var(--color-mu-text-dim)" }}>@ {opp.venueSell}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[16px] font-black" style={{ color: "var(--color-mu-red)" }}>{opp.sellPrice.toFixed(3)}</div>
                  </div>
                </div>
                
                {/* Execute */}
                <div className="shrink-0 w-32">
                  <button 
                    disabled={opp.status !== "ACTIVE"}
                    onClick={() => handleExecute(opp.id)}
                    className="w-full py-3 rounded text-[10px] font-black tracking-widest uppercase transition-all"
                    style={{ 
                      background: opp.status === "ACTIVE" ? "var(--color-mu-purple)" : "var(--color-mu-surface-high)",
                      color: opp.status === "ACTIVE" ? "#fff" : "var(--color-mu-text-muted)"
                    }}
                  >
                    {opp.status === "MISSED" ? "Spread Closed" : "Atomic Arb"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
