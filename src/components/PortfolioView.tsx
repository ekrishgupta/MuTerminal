import { useState } from "react";
import { ArrowUpRight, ShieldAlert, AlertOctagon, Flame, Percent, Activity, RefreshCw, Briefcase, ChevronRight } from "lucide-react";

export function PortfolioView() {
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);

  const handleKillSwitch = () => {
    if (confirm("WARNING: Engaging the Global Kill Switch will HALT all algorithmic execution and attempt to LIQUIDATE all open positions at market price. Proceed?")) {
      setKillSwitchEngaged(true);
      window.dispatchEvent(new CustomEvent("mu-notification", { 
        detail: "GLOBAL KILL SWITCH ENGAGED. HALTING ALL STRATEGIES AND LIQUIDATING POSITIONS." 
      }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-mu-bg">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mu-blue/10 flex items-center justify-center border border-mu-blue/20">
            <Briefcase size={18} className="text-mu-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-mu-text-bright">Vault & Positions</h1>
            <p className="text-sm text-mu-text-dim">Manage capital efficiency and cross-venue risk</p>
          </div>
        </div>

        <button 
          onClick={handleKillSwitch}
          disabled={killSwitchEngaged}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[12px] transition-all shadow-lg ${
            killSwitchEngaged 
              ? 'bg-mu-surface-high text-mu-text-muted cursor-not-allowed border border-mu-border' 
              : 'bg-mu-red text-white shadow-red-500/20 hover:opacity-90 active:scale-95'
          }`}
        >
          {killSwitchEngaged ? <Flame size={16} /> : <AlertOctagon size={16} />}
          {killSwitchEngaged ? "Liquidating..." : "Global Kill Switch"}
        </button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="mu-card p-6 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Net Liquidation Value</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-mu-text-bright tabular-nums">$142,592.80</span>
            <div className="flex items-center gap-1 text-mu-green font-bold text-[12px] mb-1">
              <ArrowUpRight size={14} />
              <span>+$1,240.21 (0.8%)</span>
            </div>
          </div>
        </div>

        <div className="mu-card p-6 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Available Margin</span>
          <span className="text-3xl font-bold text-mu-text-bright tabular-nums">$82,100.00</span>
          <div className="text-[11px] font-medium text-mu-text-dim mt-1">
            Utilization: <span className="text-mu-text">42.4%</span>
          </div>
        </div>

        <div className="mu-card p-6 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-mu-yellow/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
          <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Active Risk (Delta)</span>
          <span className="text-3xl font-bold text-mu-yellow tabular-nums">$60,492.80</span>
          <div className="flex items-center justify-between text-[11px] font-medium text-mu-text-dim mt-1">
            <div className="flex items-center gap-1.5 text-mu-red">
              <ShieldAlert size={12} />
              <span>VAR(95): $4,200</span>
            </div>
            <span className="text-mu-blue font-bold">Δ +0.45</span>
          </div>
        </div>

        <div className="mu-card p-6 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-mu-green/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
          <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Realized PnL (YTD)</span>
          <span className="text-3xl font-bold text-mu-green tabular-nums">+$28,491.00</span>
          <div className="text-[11px] font-medium text-mu-text-dim mt-1">
            Win Rate: <span className="text-mu-text font-bold">64%</span>
          </div>
        </div>
      </div>

      {/* Cross-Venue Balances */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mu-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Percent size={16} className="text-mu-text-dim" />
            <span className="text-[13px] font-bold text-mu-text-bright uppercase tracking-wider">Yield-Bearing Collateral</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-mu-text-bright tabular-nums">$82,100.00</span>
              <span className="text-[12px] font-medium text-mu-green">Blended APY: 5.12%</span>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-mu-text-dim font-medium">Poly (USDC)</span>
                <span className="font-bold text-mu-blue">8.4%</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-mu-text-dim font-medium">Kalshi (USD)</span>
                <span className="font-bold text-mu-green">4.8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mu-card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-mu-text-dim" />
              <span className="text-[13px] font-bold text-mu-text-bright uppercase tracking-wider">Smart Rebalancer</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-mu-border text-[11px] font-bold text-mu-text hover:text-mu-text-bright hover:bg-mu-surface-high transition-colors">
              <RefreshCw size={12} />
              Flash Rebalance
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center">
               <span className="text-[13px] font-medium text-mu-text">Polymarket</span>
               <span className="text-[13px] font-bold text-mu-text-bright tabular-nums">$12,100.00</span>
            </div>
            <div className="w-full h-1.5 bg-mu-surface-high rounded-full overflow-hidden">
               <div className="h-full bg-mu-blue w-[15%]" />
            </div>
            <div className="flex justify-between items-center mt-2">
               <span className="text-[13px] font-medium text-mu-text">Kalshi</span>
               <span className="text-[13px] font-bold text-mu-text-bright tabular-nums">$70,000.00</span>
            </div>
             <div className="w-full h-1.5 bg-mu-surface-high rounded-full overflow-hidden">
               <div className="h-full bg-mu-green w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="mu-card p-0 overflow-hidden flex flex-col flex-1 min-h-[300px]">
        <div className="px-6 py-4 border-b border-mu-border flex items-center justify-between bg-mu-surface-low">
          <h2 className="text-[14px] font-bold text-mu-text-bright uppercase tracking-wider">Open Positions</h2>
          <span className="text-[12px] font-medium text-mu-text-dim">4 Active Markets</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {killSwitchEngaged && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-mu-bg/80 backdrop-blur-sm gap-4 animate-fade-in">
               <div className="w-12 h-12 rounded-full border-2 border-mu-red border-t-transparent animate-spin" />
               <span className="text-[13px] font-bold text-mu-red uppercase tracking-[0.3em]">Liquidating Portfolio...</span>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead className="bg-mu-surface sticky top-0 z-10">
              <tr>
                <th className="pl-6 py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Market</th>
                <th className="py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Side</th>
                <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Size</th>
                <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Avg Entry</th>
                <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Mark Price</th>
                <th className="text-right py-3 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Notional</th>
                <th className="text-right py-3 pr-6 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Unrealized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mu-border">
              {[
                { asset: "TRUMP_WIN_2026", side: "LONG", size: 50000, entry: 0.582, mark: 0.612, notional: 30600, pnl: 1500 },
                { asset: "FED_CUT_JUNE", side: "SHORT", size: 25000, entry: 0.441, mark: 0.420, notional: 10500, pnl: 525 },
                { asset: "BTC_USD_100K", side: "LONG", size: 10000, entry: 0.280, mark: 0.328, notional: 3280, pnl: 480 },
                { asset: "OPEC_CUT_Q3", side: "LONG", size: 15000, entry: 0.420, mark: 0.374, notional: 5610, pnl: -690 },
              ].map((pos, i) => (
                <tr key={i} className="hover:bg-mu-surface-high transition-colors cursor-pointer group">
                  <td className="pl-6 py-4 font-bold text-[13px] text-mu-text-bright">
                    <div className="flex items-center gap-2">
                      {pos.asset}
                      <ChevronRight size={14} className="text-mu-text-ghost group-hover:text-mu-text-dim transition-colors" />
                    </div>
                  </td>
                  <td className="py-4">
                    <span 
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        pos.side === 'LONG' ? "bg-mu-green-soft text-mu-green" : "bg-mu-red-soft text-mu-red"
                      }`}
                    >
                      {pos.side}
                    </span>
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text tabular-nums">
                    {pos.size.toLocaleString()}
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text-dim tabular-nums">
                    {pos.entry.toFixed(3)}
                  </td>
                  <td className="text-right py-4 text-[13px] font-bold text-mu-text-bright tabular-nums">
                    {pos.mark.toFixed(3)}
                  </td>
                  <td className="text-right py-4 text-[13px] font-medium text-mu-text tabular-nums">
                    ${pos.notional.toLocaleString()}
                  </td>
                  <td className={`text-right py-4 pr-6 text-[13px] font-bold tabular-nums ${pos.pnl >= 0 ? "text-mu-green" : "text-mu-red"}`}>
                    {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
