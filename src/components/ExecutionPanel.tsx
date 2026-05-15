/**
 * ExecutionPanel - Professional order entry form.
 * Handles Buy/Sell, Limit/Market, IOC, and BOP protocol commands.
 */
import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

type OrderSide = "BUY" | "SELL";
type OrderType = "LIMIT" | "MARKET" | "IOC" | "FOK";

interface ExecutionPanelProps {
  ticker: string;
  bidPrice: number;
  askPrice: number;
  onOrder?: (order: {
    side: OrderSide;
    type: OrderType;
    qty: number;
    price: number;
    ticker: string;
  }) => void;
}

export function ExecutionPanel({ ticker, bidPrice, askPrice, onOrder }: ExecutionPanelProps) {
  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("LIMIT");
  const [qty, setQty] = useState("1000");
  const [price, setPrice] = useState(bidPrice.toString());
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleSetSide = (e: Event) => {
      const customEvent = e as CustomEvent<OrderSide>;
      setSide(customEvent.detail);
    };
    window.addEventListener("mu-set-side", handleSetSide);
    return () => window.removeEventListener("mu-set-side", handleSetSide);
  }, []);

  const effectivePrice = price ? parseFloat(price) : (side === "BUY" ? askPrice : bidPrice);
  const notional = (parseFloat(qty) || 0) * effectivePrice;
  const isValid = parseFloat(qty) > 0;

  const handleQuickQty = (v: number) => setQty(v.toString());
  const handleMid = () => setPrice(((bidPrice + askPrice) / 2).toFixed(3));
  const handleBestPrice = () => setPrice(side === "BUY" ? askPrice.toFixed(3) : bidPrice.toFixed(3));

  const handleSubmit = () => {
    if (!isValid || showConfirm) return;
    // Fat-finger guard: warn if notional > $10k
    if (notional > 10000) {
      setShowConfirm(true);
      return;
    }
    submitOrder();
  };

  const submitOrder = () => {
    onOrder?.({
      side,
      type: orderType,
      qty: parseFloat(qty),
      price: effectivePrice,
      ticker,
    });
    setShowConfirm(false);
    setQty("1000");
    setPrice("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "var(--color-mu-border)" }}
      >
        <span className="mu-heading">Execute Order</span>
        <span
          className="font-mono text-[10px] font-bold"
          style={{ color: "var(--color-mu-text-dim)" }}
        >
          {ticker}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto no-scrollbar">
        {/* Side selector */}
        <div className="grid grid-cols-2 gap-1">
          <button
            className="py-2.5 rounded text-[11px] font-black uppercase tracking-wider "
            style={{
              background: side === "BUY" ? "var(--color-mu-green)" : "var(--color-mu-surface-high)",
              color: side === "BUY" ? "#000" : "var(--color-mu-text-muted)",
              border: `1px solid ${side === "BUY" ? "var(--color-mu-green)" : "var(--color-mu-border-high)"}`,
            }}
            onClick={() => setSide("BUY")}
          >
            Buy / Yes
          </button>
          <button
            className="py-2.5 rounded text-[11px] font-black uppercase tracking-wider "
            style={{
              background: side === "SELL" ? "var(--color-mu-red)" : "var(--color-mu-surface-high)",
              color: side === "SELL" ? "#fff" : "var(--color-mu-text-muted)",
              border: `1px solid ${side === "SELL" ? "var(--color-mu-red)" : "var(--color-mu-border-high)"}`,
            }}
            onClick={() => setSide("SELL")}
          >
            Sell / No
          </button>
        </div>

        {/* Order type */}
        <div className="flex gap-1">
          {(["LIMIT", "MARKET", "IOC", "FOK"] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className="flex-1 py-1 rounded text-[9px] font-bold uppercase tracking-wider "
              style={{
                background: orderType === t ? "var(--color-mu-surface-top)" : "transparent",
                color: orderType === t ? "var(--color-mu-text)" : "var(--color-mu-text-muted)",
                border: `1px solid ${orderType === t ? "var(--color-mu-border-focus)" : "var(--color-mu-border)"}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="mu-label">Quantity</span>
            <span className="mu-label" style={{ color: "var(--color-mu-cyan)" }}>
              MAX: 10,000
            </span>
          </div>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="mu-input w-full text-right"
            style={{ fontSize: 13, fontWeight: 700 }}
            placeholder="0"
          />
          <div className="flex gap-1 mt-1">
            {[100, 500, 1000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => handleQuickQty(v)}
                className="flex-1 py-1 text-[9px] font-bold rounded "
                style={{
                  background: "var(--color-mu-surface-high)",
                  border: "1px solid var(--color-mu-border)",
                  color: "var(--color-mu-text-muted)",
                }}
              >
                {v >= 1000 ? `${v/1000}K` : v}
              </button>
            ))}
          </div>
        </div>

        {/* Price (only for LIMIT / IOC / FOK) */}
        {orderType !== "MARKET" && (
          <div>
            <span className="mu-label">Limit Price</span>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mu-input flex-1 text-right"
                style={{ fontSize: 13, fontWeight: 700 }}
                placeholder={effectivePrice.toFixed(3)}
                step="0.001"
              />
              <button
                onClick={handleMid}
                className="px-2 py-1 text-[9px] font-bold rounded "
                style={{
                  background: "var(--color-mu-surface-high)",
                  border: "1px solid var(--color-mu-border-high)",
                  color: "var(--color-mu-text-dim)",
                }}
              >
                MID
              </button>
              <button
                onClick={handleBestPrice}
                className="px-2 py-1 text-[9px] font-bold rounded "
                style={{
                  background: "var(--color-mu-surface-high)",
                  border: "1px solid var(--color-mu-border-high)",
                  color: "var(--color-mu-text-dim)",
                }}
              >
                BEST
              </button>
            </div>
          </div>
        )}

        {/* Notional preview */}
        <div
          className="rounded p-2 flex items-center justify-between"
          style={{
            background: "var(--color-mu-surface-high)",
            border: "1px solid var(--color-mu-border-high)",
          }}
        >
          <div>
            <div className="mu-label">Notional Value</div>
            <div
              className="font-mono text-[13px] font-black mt-0.5"
              style={{
                color: notional > 10000 ? "var(--color-mu-amber)" : "var(--color-mu-text)",
              }}
            >
              ${notional.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-right">
            <div className="mu-label">@ Venue</div>
            <div
              className="text-[10px] font-bold mt-0.5"
              style={{ color: "var(--color-mu-cyan)" }}
            >
              AGGREGATED
            </div>
          </div>
        </div>

        {/* Fat-finger warning */}
        {showConfirm && (
          <div
            className="rounded p-3 flex items-start gap-2 "
            style={{
              background: "rgba(217, 119, 6, 0.1)",
              border: "1px solid var(--color-mu-amber)",
            }}
          >
            <AlertTriangle size={14} style={{ color: "var(--color-mu-amber)", flexShrink: 0, marginTop: 1 }} />
            <div>
              <div className="text-[10px] font-black uppercase" style={{ color: "var(--color-mu-amber)" }}>
                Fat-finger Guard Active
              </div>
              <div className="text-[9px] mt-1" style={{ color: "var(--color-mu-text-dim)" }}>
                Order notional ${notional.toLocaleString()} exceeds $10K threshold. Confirm to proceed.
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitOrder}
                  className="mu-btn mu-btn-sell text-[9px] py-1"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="mu-btn mu-btn-ghost text-[9px] py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        {!showConfirm && (
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-3 rounded text-[11px] font-black uppercase tracking-widest "
            style={{
              background: isValid
                ? side === "BUY"
                  ? "var(--color-mu-green)"
                  : "var(--color-mu-red)"
                : "var(--color-mu-surface-high)",
              color: isValid ? (side === "BUY" ? "#000" : "#fff") : "var(--color-mu-text-muted)",
              border: "none",
              cursor: isValid ? "pointer" : "not-allowed",
              opacity: isValid ? 1 : 0.5,
            }}
          >
            {side === "BUY" ? "▲" : "▼"} {orderType} · {side} {parseFloat(qty || "0").toLocaleString()} @ {effectivePrice.toFixed(3)}
          </button>
        )}

        {/* Smart Route indicator */}
        <div
          className="rounded p-2"
          style={{
            background: "var(--color-mu-surface)",
            border: "1px solid var(--color-mu-border)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="mu-label">Smart Route (BOP)</span>
            <ChevronDown size={10} style={{ color: "var(--color-mu-text-muted)" }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--color-mu-surface-high)" }}>
              <div className="h-full rounded-full" style={{
                width: "62%", background: "var(--color-mu-green)"
              }} />
            </div>
            <span className="text-[9px] font-bold" style={{ color: "var(--color-mu-text-dim)" }}>
              POLY 62% / KALSHI 38%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
