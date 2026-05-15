/**
 * OrderBook - Aggregated bid/ask depth with size bars and sparkline.
 * Professional Bloomberg/CQG-style order book display.
 */
import { useRef, useEffect, memo } from "react";
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

function PriceMiniChart({ prices }: { prices: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prices.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 0.01;
    const lastIsHigher = prices[prices.length - 1] >= prices[0];

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const color = lastIsHigher ? "44, 182, 125" : "224, 82, 82";
    gradient.addColorStop(0, `rgba(${color}, 0.3)`);
    gradient.addColorStop(1, `rgba(${color}, 0.0)`);

    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    // Close path for fill
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = `rgba(${color}, 0.9)`;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [prices]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={36}
      style={{ display: "block" }}
    />
  );
}

const DISPLAY_LEVELS = 16;

const DepthRow = memo(function DepthRow({
  level,
  side,
  maxTotal,
  onClick,
}: {
  level: DepthLevel;
  side: "bid" | "ask";
  maxTotal: number;
  onClick?: (price: number) => void;
}) {
  const pct = Math.min(100, (level.total / maxTotal) * 100);
  const isBid = side === "bid";

  return (
    <div
      className="relative flex items-center justify-between px-3 py-[3px] cursor-pointer group"
      style={{ minHeight: 20 }}
      onClick={() => onClick?.(level.price)}
    >
      {/* Depth visualization bar */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: isBid
            ? "rgba(44, 182, 125, 0.09)"
            : "rgba(224, 82, 82, 0.09)",
          borderLeft: `1px solid ${isBid ? "rgba(44,182,125,0.2)" : "rgba(224,82,82,0.2)"}`
        }}
      />
      <span
        className="relative font-mono text-[11px] font-bold z-10 "
        style={{ color: isBid ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
      >
        {level.price.toFixed(3)}
      </span>
      <span
        className="relative font-mono text-[11px] z-10"
        style={{ color: "var(--color-mu-text-dim)" }}
      >
        {level.size.toLocaleString()}
      </span>
      <span
        className="relative font-mono text-[10px] z-10"
        style={{ color: "var(--color-mu-text-muted)", minWidth: 50, textAlign: "right" }}
      >
        {(level.total / 1000).toFixed(1)}K
      </span>
    </div>
  );
});

export function OrderBook({
  bids,
  asks,
  lastPrice,
  bidPrice,
  askPrice,
  spread,
  priceHistory,
}: OrderBookProps) {
  const displayAsks = asks.slice(0, DISPLAY_LEVELS).reverse();
  const displayBids = bids.slice(0, DISPLAY_LEVELS);
  const maxTotal = Math.max(
    ...[...bids, ...asks].map((l) => l.total).filter(Boolean)
  );

  const isPositive = priceHistory.length > 1 &&
    priceHistory[priceHistory.length - 1] >= priceHistory[priceHistory.length - 2];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between border-b"
        style={{ borderColor: "var(--color-mu-border)" }}
      >
        <span className="mu-heading">Order Book</span>
        <div className="flex items-center gap-3">
          <div
            className="px-2 py-0.5 rounded text-[9px] font-bold"
            style={{
              background: "var(--color-mu-surface-high)",
              border: "1px solid var(--color-mu-border-high)",
              color: "var(--color-mu-text-muted)",
            }}
          >
            Unified · 0.001 tick
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          color: "var(--color-mu-text-muted)",
          borderBottom: "1px solid var(--color-mu-border)",
          background: "var(--color-mu-surface-mid)",
        }}
      >
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Ask levels (reversed, highest at top) */}
      <div className="flex flex-col overflow-hidden" style={{ flex: "0 0 auto" }}>
        {displayAsks.map((level, i) => (
          <DepthRow key={`ask-${i}`} level={level} side="ask" maxTotal={maxTotal} />
        ))}
      </div>

      {/* Mid price bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-y"
        style={{
          background: "var(--color-mu-surface-high)",
          borderColor: "var(--color-mu-border-high)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[15px] font-black"
            style={{ color: isPositive ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
          >
            {lastPrice.toFixed(3)}
          </span>
          <PriceMiniChart prices={priceHistory} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="mu-label">Spread</div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: "var(--color-mu-text-dim)" }}
            >
              {(spread * 100).toFixed(1)}¢
            </div>
          </div>
          <div className="text-right">
            <div className="mu-label">Bid</div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: "var(--color-mu-green)" }}
            >
              {bidPrice.toFixed(3)}
            </div>
          </div>
          <div className="text-right">
            <div className="mu-label">Ask</div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: "var(--color-mu-red)" }}
            >
              {askPrice.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* Bid levels */}
      <div className="flex flex-col overflow-hidden" style={{ flex: "0 0 auto" }}>
        {displayBids.map((level, i) => (
          <DepthRow key={`bid-${i}`} level={level} side="bid" maxTotal={maxTotal} />
        ))}
      </div>
    </div>
  );
}
