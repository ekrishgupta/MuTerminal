/**
 * PortfolioView - Professional asset management and open positions interface.
 */
import { useState } from "react";
import { ArrowUpRight, Wallet, ShieldAlert, AlertOctagon, Flame, Percent, Activity, RefreshCw } from "lucide-react";

export function PortfolioView() {
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);

  const handleKillSwitch = () => {
    if (confirm("WARNING: Engaing the Global Kill Switch will HALT all algorithmic execution and attempt to LIQUIDATE all open positions at market price. Proceed?")) {
      setKillSwitchEngaged(true);
      window.dispatchEvent(new CustomEvent("mu-notification", { 
        detail: "GLOBAL KILL SWITCH ENGAGED. HALTING ALL STRATEGIES AND LIQUIDATING POSITIONS." 
      }));
    }
  };
  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden  bg-[var(--color-mu-bg)]">
      {/* Top Equities Row */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="mu-panel p-4 flex flex-col gap-1 border-l-4" style={{ borderLeftColor: "var(--color-mu-accent)" }}>
          <span className="mu-label">Net Liquidation Value</span>
          <span className="mu-value-lg">$142,592.80</span>
          <div className="flex items-center gap-1 text-[10px] font-bold mt-1" style={{ color: "var(--color-mu-green)" }}>
            <ArrowUpRight size={10} />
            <span>+$1,240.21 (0.8%) TODAY</span>
          </div>
        </div>
        <div className="mu-panel p-4 flex flex-col gap-1">
          <span className="mu-label">Available Margin</span>
          <span className="mu-value-lg" style={{ color: "var(--color-mu-text)" }}>$82,100.00</span>
          <div className="flex items-center gap-1 text-[10px] font-bold mt-1" style={{ color: "var(--color-mu-text-dim)" }}>
            <span>UTILIZATION: 42.4%</span>
          </div>
        </div>
        <div className="mu-panel p-4 flex flex-col gap-1">
          <span className="mu-label">Active Risk (Delta)</span>
          <span className="mu-value-lg" style={{ color: "var(--color-mu-amber)" }}>$60,492.80</span>
          <div className="flex items-center justify-between text-[10px] font-bold mt-1" style={{ color: "var(--color-mu-text-dim)" }}>
            <div className="flex items-center gap-1">
              <ShieldAlert size={10} />
              <span>VAR (95%): $4,200</span>
            </div>
            <span style={{ color: "var(--color-mu-cyan)" }}>Δ +0.45</span>
          </div>
        </div>
        <div className="mu-panel p-4 flex flex-col gap-1">
          <span className="mu-label">Realized PnL (YTD)</span>
          <span className="mu-value-lg" style={{ color: "var(--color-mu-green)" }}>+$28,491.00</span>
          <div className="flex items-center gap-1 text-[10px] font-bold mt-1" style={{ color: "var(--color-mu-green)" }}>
            <ArrowUpRight size={10} />
            <span>WIN RATE: 64%</span>
          </div>
        </div>
      </div>

      {/* Capital Efficiency Row */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <div className="mu-panel p-4 flex flex-col gap-1 border-l-4" style={{ borderLeftColor: "var(--color-mu-purple)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Percent size={12} style={{ color: "var(--color-mu-purple)" }} />
            <span className="mu-label">Yield-Bearing Collateral</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="mu-value-lg">$82,100.00</span>
              <div className="flex items-center gap-2 text-[10px] font-bold mt-1" style={{ color: "var(--color-mu-green)" }}>
                <span>BLENDED APY: 5.12%</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-right flex flex-col gap-1" style={{ color: "var(--color-mu-text-dim)" }}>
              <div className="flex justify-between gap-4"><span>Poly (USDC)</span><span className="text-[var(--color-mu-cyan)]">8.4%</span></div>
              <div className="flex justify-between gap-4"><span>Kalshi (USD)</span><span className="text-[var(--color-mu-green)]">4.8%</span></div>
            </div>
          </div>
        </div>

        <div className="mu-panel p-4 flex items-center justify-between border-l-4" style={{ borderLeftColor: "var(--color-mu-cyan)" }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={12} style={{ color: "var(--color-mu-cyan)" }} />
              <span className="mu-label">Cross-Venue Margin Rebalancer</span>
            </div>
            <span className="text-[12px] font-mono font-bold" style={{ color: "var(--color-mu-text-bright)" }}>Poly: $12k | Kalshi: $70k</span>
            <span className="text-[9px] font-bold text-[var(--color-mu-amber)]">Warning: Polymarket Liquidity Low</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[var(--color-mu-surface-high)]" style={{ border: "1px solid var(--color-mu-cyan)", color: "var(--color-mu-cyan)" }}>
            <RefreshCw size={12} />
            Flash Rebalance
          </button>
        </div>
      </div>

      {/* Positions Table */}
      <div className="flex-1 mu-panel flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-mid)" }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet size={14} style={{ color: "var(--color-mu-cyan)" }} />
              <h2 className="mu-heading">Open Positions</h2>
            </div>
            <span className="mu-label">4 Active Markets</span>
          </div>
          
          <button 
            onClick={handleKillSwitch}
            disabled={killSwitchEngaged}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${killSwitchEngaged ? 'opacity-50 cursor-not-allowed' : 'mu-glow-red hover:scale-105'}`}
            style={{ 
              background: killSwitchEngaged ? "var(--color-mu-surface-high)" : "rgba(224,82,82,0.15)", 
              color: killSwitchEngaged ? "var(--color-mu-text-muted)" : "var(--color-mu-red)", 
              border: `1px solid ${killSwitchEngaged ? "var(--color-mu-border)" : "var(--color-mu-red)"}` 
            }}
          >
            {killSwitchEngaged ? <Flame size={12} /> : <AlertOctagon size={12} />}
            {killSwitchEngaged ? "LIQUIDATING..." : "GLOBAL KILL SWITCH"}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="mu-table-header">
              <tr>
                <th className="pl-4 py-3">Market</th>
                <th className="py-3">Side</th>
                <th className="text-right py-3">Size</th>
                <th className="text-right py-3">Avg Entry</th>
                <th className="text-right py-3">Mark Price</th>
                <th className="text-right py-3">Notional</th>
                <th className="text-right py-3 pr-4">Unrealized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-mu-border)", opacity: killSwitchEngaged ? 0.3 : 1 }}>
              {[
                { asset: "TRUMP_WIN_2026", side: "LONG", size: 50000, entry: 0.582, mark: 0.612, notional: 30600, pnl: 1500 },
                { asset: "FED_CUT_JUNE", side: "SHORT", size: 25000, entry: 0.441, mark: 0.420, notional: 10500, pnl: 525 },
                { asset: "BTC_USD_100K", side: "LONG", size: 10000, entry: 0.280, mark: 0.328, notional: 3280, pnl: 480 },
                { asset: "OPEC_CUT_Q3", side: "LONG", size: 15000, entry: 0.420, mark: 0.374, notional: 5610, pnl: -690 },
              ].map((pos, i) => (
                <tr key={i} className="mu-table-row relative">
                  {killSwitchEngaged && (
                    <td colSpan={7} className="absolute inset-0 z-10 flex items-center justify-center">
                      <span className="text-[12px] font-black uppercase tracking-widest mu-pulse-dot" style={{ color: "var(--color-mu-red)" }}>CLOSING...</span>
                    </td>
                  )}
                  <td className="pl-4 py-3 font-mono text-[11px] font-bold" style={{ color: "var(--color-mu-cyan)" }}>
                    {pos.asset}
                  </td>
                  <td className="py-3">
                    <span 
                      className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                      style={{ 
                        background: pos.side === 'LONG' ? "rgba(44,182,125,0.1)" : "rgba(224,82,82,0.1)", 
                        color: pos.side === 'LONG' ? "var(--color-mu-green)" : "var(--color-mu-red)",
                        border: `1px solid ${pos.side === 'LONG' ? "rgba(44,182,125,0.2)" : "rgba(224,82,82,0.2)"}`
                      }}
                    >
                      {pos.side}
                    </span>
                  </td>
                  <td className="text-right py-3 font-mono text-[11px]" style={{ color: "var(--color-mu-text)" }}>
                    {pos.size.toLocaleString()}
                  </td>
                  <td className="text-right py-3 font-mono text-[11px]" style={{ color: "var(--color-mu-text-dim)" }}>
                    {pos.entry.toFixed(3)}
                  </td>
                  <td className="text-right py-3 font-mono text-[11px] font-bold" style={{ color: "var(--color-mu-text)" }}>
                    {pos.mark.toFixed(3)}
                  </td>
                  <td className="text-right py-3 font-mono text-[11px]" style={{ color: "var(--color-mu-text)" }}>
                    \${pos.notional.toLocaleString()}
                  </td>
                  <td className="text-right py-3 pr-4 font-mono text-[12px] font-black" style={{ color: pos.pnl >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)" }}>
                    {pos.pnl >= 0 ? "+" : ""}\${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
