import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Navigation } from "lucide-react";

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
    <div className="flex flex-col h-full bg-mu-surface select-none">
      {/* Header */}
      <div className="h-11 flex items-center justify-between px-4 border-b border-mu-border shrink-0">
        <span className="text-[12px] font-bold text-mu-text-bright uppercase tracking-tight">Execute</span>
        <span className="text-[10px] font-bold font-mono bg-mu-surface-high px-2 py-0.5 rounded text-mu-text-dim">
          {ticker}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
        {/* Side Toggle */}
        <div className="flex rounded-lg overflow-hidden bg-mu-surface-low border border-mu-border p-1">
          <button
            className={`flex-1 py-2 text-[12px] font-bold transition-all rounded-md ${
              side === "BUY" 
                ? "bg-mu-green text-black shadow-sm" 
                : "text-mu-text hover:text-mu-text-bright hover:bg-mu-surface-high"
            }`}
            onClick={() => setSide("BUY")}
          >
            Buy / Yes
          </button>
          <button
            className={`flex-1 py-2 text-[12px] font-bold transition-all rounded-md ${
              side === "SELL" 
                ? "bg-mu-red text-white shadow-sm" 
                : "text-mu-text hover:text-mu-text-bright hover:bg-mu-surface-high"
            }`}
            onClick={() => setSide("SELL")}
          >
            Sell / No
          </button>
        </div>

        {/* Order Type */}
        <div className="grid grid-cols-4 gap-1">
          {(["LIMIT", "MARKET", "IOC", "FOK"] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                orderType === t 
                  ? "bg-mu-surface-high text-mu-text-bright border border-mu-border-high" 
                  : "bg-transparent text-mu-text-dim border border-transparent hover:text-mu-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Quantity</span>
              <span className="text-[10px] font-medium text-mu-blue">Max: 10K</span>
            </div>
            <div className="relative flex items-center">
               <input
                 type="number"
                 value={qty}
                 onChange={(e) => setQty(e.target.value)}
                 className="w-full bg-mu-surface-low border border-mu-border rounded-lg py-2 pl-3 pr-16 text-[14px] font-bold text-mu-text-bright tabular-nums focus:outline-none focus:border-mu-blue transition-colors"
                 placeholder="0"
               />
               <span className="absolute right-3 text-[11px] font-medium text-mu-text-dim uppercase">Shares</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              {[100, 500, 1000, 5000].map((v) => (
                <button
                  key={v}
                  onClick={() => handleQuickQty(v)}
                  className="flex-1 py-1 rounded border border-mu-border bg-mu-surface-low text-[10px] font-bold text-mu-text-dim hover:text-mu-text hover:border-mu-border-high transition-colors"
                >
                  {v >= 1000 ? `${v/1000}K` : v}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          {orderType !== "MARKET" && (
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Limit Price</span>
              <div className="flex gap-2">
                <div className="relative flex items-center flex-1">
                   <input
                     type="number"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     className="w-full bg-mu-surface-low border border-mu-border rounded-lg py-2 pl-6 pr-3 text-[14px] font-bold text-mu-text-bright tabular-nums focus:outline-none focus:border-mu-blue transition-colors"
                     placeholder={effectivePrice.toFixed(3)}
                     step="0.001"
                   />
                   <span className="absolute left-3 text-[12px] font-bold text-mu-text-dim">$</span>
                </div>
                <button onClick={handleMid} className="px-3 rounded-lg border border-mu-border bg-mu-surface-low text-[10px] font-bold text-mu-text-dim hover:text-mu-text hover:bg-mu-surface-high transition-colors">
                  MID
                </button>
                <button onClick={handleBestPrice} className="px-3 rounded-lg border border-mu-border bg-mu-surface-low text-[10px] font-bold text-mu-text-dim hover:text-mu-text hover:bg-mu-surface-high transition-colors">
                  BEST
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notional Preview */}
        <div className="mt-2 p-3 rounded-lg border border-mu-border bg-mu-surface-low flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Notional Value</span>
            <span className={`text-[15px] font-bold tabular-nums ${notional > 10000 ? 'text-mu-amber' : 'text-mu-text-bright'}`}>
              ${notional.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Venue</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-mu-blue">
              <Navigation size={10} /> AGGREGATED
            </span>
          </div>
        </div>

        {/* Fat-finger Guard */}
        {showConfirm && (
          <div className="mt-2 p-3 rounded-xl border border-mu-amber/30 bg-mu-amber/5 flex flex-col gap-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-mu-amber shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-mu-amber uppercase tracking-wider">Fat-Finger Guard</span>
                <span className="text-[11px] text-mu-text-dim leading-relaxed">
                  Order notional <strong>${notional.toLocaleString()}</strong> exceeds the $10,000 threshold.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <button onClick={() => setShowConfirm(false)} className="py-2 rounded-lg bg-mu-surface-high text-[11px] font-bold text-mu-text-dim hover:text-mu-text-bright">
                 Cancel
               </button>
               <button onClick={submitOrder} className="py-2 rounded-lg bg-mu-amber text-black text-[11px] font-bold hover:opacity-90 active:scale-95">
                 Confirm Order
               </button>
            </div>
          </div>
        )}

        {/* Smart Router Visualization */}
        {!showConfirm && (
          <div className="mt-auto pt-2 flex flex-col gap-2">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">
                   <CheckCircle2 size={10} className="text-mu-green" /> Smart Router (BOP)
                </div>
                <span className="text-[10px] font-bold text-mu-text-ghost">Auto-Split</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-mu-surface-high flex">
                   <div className="h-full bg-mu-blue" style={{ width: '62%' }} />
                   <div className="h-full bg-mu-green" style={{ width: '38%' }} />
                </div>
                <span className="text-[9px] font-bold text-mu-text-dim tabular-nums">
                   62% / 38%
                </span>
             </div>
          </div>
        )}
      </div>

      {/* Submit Button Area */}
      {!showConfirm && (
        <div className="p-4 border-t border-mu-border shrink-0 bg-mu-surface">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all shadow-lg ${
              !isValid 
                ? "bg-mu-surface-high text-mu-text-muted border border-mu-border" 
                : side === "BUY"
                  ? "bg-mu-green text-black hover:opacity-90 active:scale-95 shadow-mu-green/10"
                  : "bg-mu-red text-white hover:opacity-90 active:scale-95 shadow-mu-red/10"
            }`}
          >
            {side === "BUY" ? "Execute Buy" : "Execute Sell"}
          </button>
        </div>
      )}
    </div>
  );
}
