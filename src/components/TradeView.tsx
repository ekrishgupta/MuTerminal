import { useState } from 'react';
import { useMockMarket } from "../hooks/useMockMarket";
import { LiveChart } from "./LiveChart";
import { WhaleTracker } from "./WhaleTracker";
import { OrderBook } from "./OrderBook";
import { TimeAndSales } from "./TimeAndSales";
import { ExecutionPanel } from "./ExecutionPanel";

export function TradeView() {
  const marketData = useMockMarket("TRUMP_WIN_2026");
  const [chartMode, setChartMode] = useState<"line" | "heatmap">("line");

  const handleOrderSubmit = (order: any) => {
    console.log("[TradeView] Order Submitted via BOP:", order);
    // In a real app this sends IPC to sidecar
    window.dispatchEvent(new CustomEvent("mu-notification", { 
      detail: `EXECUTED: ${order.side} ${order.qty} ${order.ticker} @ ${order.price.toFixed(3)} via BOP ULA`
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Ticker Header */}
      <div className="h-14 flex items-center justify-between px-4 shrink-0" style={{ borderBottom: "1px solid var(--color-mu-border)" }}>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight">{marketData.ticker.ticker}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] font-bold" style={{ color: "var(--color-mu-text-dim)" }}>Vol: {(marketData.ticker.volume24h/1e6).toFixed(2)}M</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--color-mu-text-dim)" }}>OI: ${(marketData.ticker.openInterest/1e6).toFixed(1)}M</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black font-mono tracking-tighter" style={{ color: marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)" }}>
            {marketData.ticker.lastPrice.toFixed(3)}
          </div>
          <div className="text-[11px] font-bold font-mono" style={{ color: marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)" }}>
            {marketData.ticker.change24h >= 0 ? "+" : ""}{marketData.ticker.change24h.toFixed(3)} ({marketData.ticker.changePct24h > 0 ? "+" : ""}{marketData.ticker.changePct24h.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Trade View Grid Layout */}
      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        {/* Center / Chart placeholder + Whale tracker */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex-[2] mu-panel overflow-hidden relative group p-0">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
              <div className="mu-label bg-[var(--color-mu-surface)]/80 px-1 rounded backdrop-blur">
                Live Chart (Mock)
              </div>
              <div className="flex items-center bg-black/80 rounded border overflow-hidden" style={{ borderColor: "var(--color-mu-border)" }}>
                <button 
                  onClick={() => setChartMode("line")}
                  className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${chartMode === "line" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-cyan)]" : "text-[var(--color-mu-text-dim)]"}`}
                >
                  SVG
                </button>
                <button 
                  onClick={() => setChartMode("heatmap")}
                  className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${chartMode === "heatmap" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-red)]" : "text-[var(--color-mu-text-dim)]"}`}
                >
                  DOM
                </button>
              </div>
            </div>
            <LiveChart 
              data={marketData.priceHistory} 
              color={marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)"} 
              mode={chartMode}
            />
          </div>
          <div className="flex-1 mu-panel overflow-hidden min-h-[200px]">
            <WhaleTracker />
          </div>
        </div>

        {/* Right Rail - Order Book & TAS */}
        <div className="w-[280px] flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="flex-[3] mu-panel overflow-hidden min-h-[300px]">
            <OrderBook 
              bids={marketData.bids} 
              asks={marketData.asks} 
              lastPrice={marketData.ticker.lastPrice}
              bidPrice={marketData.ticker.bidPrice}
              askPrice={marketData.ticker.askPrice}
              spread={marketData.ticker.spread}
              priceHistory={marketData.priceHistory}
            />
          </div>
          <div className="flex-[2] mu-panel overflow-hidden min-h-[200px]">
            <TimeAndSales trades={marketData.trades} />
          </div>
        </div>

        {/* Far Right Rail - Execution */}
        <div className="w-[240px] mu-panel overflow-hidden shrink-0">
          <ExecutionPanel 
            ticker={marketData.ticker.ticker}
            bidPrice={marketData.ticker.bidPrice}
            askPrice={marketData.ticker.askPrice}
            onOrder={handleOrderSubmit}
          />
        </div>
      </div>
    </div>
  );
}
