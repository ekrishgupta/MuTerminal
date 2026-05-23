import { memo, useMemo } from "react";
import type { DepthLevel } from "../hooks/useMockMarket";

interface OrderBookProps {
  bids: DepthLevel[];
  asks: DepthLevel[];
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  priceHistory: number[];
}

const DISPLAY_LEVELS = 18;

const DepthRow = memo(function DepthRow({
  level,
  side,
  maxTotal,
}: {
  level: DepthLevel;
  side: "bid" | "ask";
  maxTotal: number;
}) {
  const pct = Math.min(100, (level.total / maxTotal) * 100);
  const isBid = side === "bid";

  return (
    <div className="relative flex items-center justify-between px-4 py-[2px] cursor-pointer group hover:bg-mu-surface-high transition-colors">
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-300"
        style={{
          width: `${pct}%`,
          backgroundColor: isBid ? "rgba(0, 192, 135, 0.06)" : "rgba(255, 77, 90, 0.06)",
        }}
      />
      <span className={`relative font-mono text-[12px] font-bold z-10 ${isBid ? "text-mu-green" : "text-mu-red"}`}>
        {level.price.toFixed(3)}
      </span>
      <span className="relative font-mono text-[12px] text-mu-text z-10">
        {level.size.toLocaleString()}
      </span>
      <span className="relative font-mono text-[11px] text-mu-text-dim z-10 text-right min-w-[50px]">
        {(level.total / 1000).toFixed(1)}K
      </span>
    </div>
  );
});

export function OrderBook({
  bids,
  asks,
  lastPrice,
  spread,
  priceHistory,
}: OrderBookProps) {
  const displayAsks = useMemo(() => asks.slice(0, DISPLAY_LEVELS).reverse(), [asks]);
  const displayBids = useMemo(() => bids.slice(0, DISPLAY_LEVELS), [bids]);
  
  const maxTotal = useMemo(() => 
    Math.max(...[...bids, ...asks].map((l) => l.total).filter(Boolean), 1)
  , [bids, asks]);

  const isPositive = priceHistory.length > 1 &&
    priceHistory[priceHistory.length - 1] >= priceHistory[priceHistory.length - 2];

  return (
    <div className="flex flex-col h-full bg-mu-surface text-mu-text select-none">
      <div className="h-11 flex items-center justify-between px-4 border-b border-mu-border">
        <span className="text-[12px] font-bold text-mu-text-bright uppercase tracking-tight">Order Book</span>
        <span className="text-[10px] font-medium text-mu-text-dim">Unified • 0.001</span>
      </div>

      <div className="grid grid-cols-3 px-4 py-1.5 text-[10px] font-bold text-mu-text-dim uppercase border-b border-mu-border bg-mu-surface-low">
        <span>Price</span>
        <span className="text-center">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {displayAsks.map((level, i) => (
          <DepthRow key={`ask-${i}`} level={level} side="ask" maxTotal={maxTotal} />
        ))}
      </div>

      <div className="py-3 px-4 border-y border-mu-border bg-mu-surface-low flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[18px] font-bold ${isPositive ? "text-mu-green" : "text-mu-red"}`}>
            {lastPrice.toFixed(3)}
          </span>
          <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isPositive ? "bg-mu-green-soft text-mu-green" : "bg-mu-red-soft text-mu-red"}`}>
            {isPositive ? '▲' : '▼'}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-mu-text-dim uppercase tracking-tighter">Spread</span>
          <span className="font-mono text-[12px] font-bold text-mu-text-bright">{(spread * 100).toFixed(1)}¢</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {displayBids.map((level, i) => (
          <DepthRow key={`bid-${i}`} level={level} side="bid" maxTotal={maxTotal} />
        ))}
      </div>
    </div>
  );
}
