/**
 * TimeAndSales - Real-time trade print tape (like Bloomberg TAS).
 */
import { useEffect, useRef, memo } from "react";
import type { Trade } from "../hooks/useMockMarket";

interface TimeAndSalesProps {
  trades: Trade[];
}

const TradeRow = memo(function TradeRow({ trade }: { trade: Trade }) {
  const isBuy = trade.side === "buy";
  const time = new Date(trade.time);
  const timeStr = `${time.getHours().toString().padStart(2,"0")}:${time.getMinutes().toString().padStart(2,"0")}:${time.getSeconds().toString().padStart(2,"0")}`;
  const sizeLabel = trade.size >= 1000 ? `${(trade.size / 1000).toFixed(1)}K` : trade.size.toString();

  return (
    <div
      className="grid items-center px-2 py-[3px] text-[10px] font-mono mu-slide-left"
      style={{
        gridTemplateColumns: "60px 56px 48px 40px",
        borderBottom: "1px solid var(--color-mu-border)",
      }}
    >
      <span style={{ color: "var(--color-mu-text-muted)" }}>{timeStr}</span>
      <span
        className="font-bold"
        style={{ color: isBuy ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
      >
        {trade.price.toFixed(3)}
      </span>
      <span
        className="text-right font-bold"
        style={{ color: trade.size > 500 ? "var(--color-mu-text)" : "var(--color-mu-text-dim)" }}
      >
        {sizeLabel}
      </span>
      <span
        className="text-right text-[8px] font-bold px-1 rounded"
        style={{
          color: "var(--color-mu-text-muted)",
          background: "var(--color-mu-surface-high)",
          border: "1px solid var(--color-mu-border)",
        }}
      >
        {trade.venue}
      </span>
    </div>
  );
});

export function TimeAndSales({ trades }: TimeAndSalesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [trades.length]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "var(--color-mu-border)" }}
      >
        <span className="mu-heading">Time &amp; Sales</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full mu-pulse-dot"
            style={{ background: "var(--color-mu-green)", display: "inline-block" }}
          />
          <span className="mu-label">Live</span>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid px-2 py-1 text-[9px] font-bold uppercase tracking-wider"
        style={{
          gridTemplateColumns: "60px 56px 48px 40px",
          color: "var(--color-mu-text-muted)",
          borderBottom: "1px solid var(--color-mu-border)",
          background: "var(--color-mu-surface-mid)",
        }}
      >
        <span>Time</span>
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Venue</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
        {trades.map((t) => (
          <TradeRow key={t.id} trade={t} />
        ))}
      </div>
    </div>
  );
}
