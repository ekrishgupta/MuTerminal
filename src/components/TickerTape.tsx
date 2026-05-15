/**
 * TickerTape - Scrolling market data bar across the top of the terminal.
 * Shows live-updating prices for multiple markets.
 */
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  venue: string;
}

const BASE_TICKERS: TickerItem[] = [
  { symbol: "TRUMP_WIN_2026", price: 0.612, change: 0.024, venue: "POLY" },
  { symbol: "FED_CUT_JUNE", price: 0.441, change: -0.038, venue: "KALSHI" },
  { symbol: "BTC_USD_100K", price: 0.328, change: 0.071, venue: "POLY" },
  { symbol: "NVDA_200_JUL", price: 0.551, change: 0.012, venue: "KALSHI" },
  { symbol: "SPX_6K_DEC", price: 0.489, change: -0.009, venue: "PI" },
  { symbol: "RECESSION_2026", price: 0.221, change: 0.005, venue: "POLY" },
  { symbol: "HARRIS_CA_GOV", price: 0.761, change: -0.014, venue: "KALSHI" },
  { symbol: "SCOTUS_RULING", price: 0.543, change: 0.033, venue: "POLY" },
  { symbol: "UKRAINE_PEACE", price: 0.189, change: 0.041, venue: "POLY" },
  { symbol: "OPEC_CUT_Q3", price: 0.374, change: -0.022, venue: "KALSHI" },
  { symbol: "DOGE_USD_0.5", price: 0.291, change: 0.058, venue: "PI" },
  { symbol: "DEBT_CEILING_Q4", price: 0.832, change: -0.003, venue: "KALSHI" },
];

export function TickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>(BASE_TICKERS);

  useEffect(() => {
    const id = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => ({
          ...t,
          price: parseFloat(
            Math.min(0.98, Math.max(0.02, t.price + (Math.random() - 0.5) * 0.004)).toFixed(3)
          ),
          change: parseFloat((t.change + (Math.random() - 0.5) * 0.001).toFixed(3)),
        }))
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Duplicate for seamless loop
  const items = [...tickers, ...tickers];

  return (
    <div
      className="h-7 border-b overflow-hidden relative flex items-center"
      style={{
        background: "var(--color-mu-surface)",
        borderColor: "var(--color-mu-border)",
      }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--color-mu-surface), transparent)" }}
      />
      {/* Label */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center px-3 z-20"
        style={{
          background: "var(--color-mu-surface-high)",
          borderRight: "1px solid var(--color-mu-border-high)",
        }}
      >
        <span className="mu-label" style={{ color: "var(--color-mu-accent)" }}>
          LIVE
        </span>
        <span
          className="ml-1.5 w-1.5 h-1.5 rounded-full mu-pulse-dot"
          style={{ background: "var(--color-mu-accent)" }}
        />
      </div>

      <div className="ml-16 flex items-center overflow-hidden w-full">
        <div className="mu-ticker-scroll">
          {items.map((t, i) => {
            const up = t.change >= 0;
            return (
              <div
                key={`${t.symbol}-${i}`}
                className="flex items-center shrink-0 px-4"
                style={{ borderRight: "1px solid var(--color-mu-border)" }}
              >
                <span
                  className="text-[10px] font-bold tracking-tight mr-2"
                  style={{ color: "var(--color-mu-text-dim)" }}
                >
                  {t.symbol}
                </span>
                <span
                  className="text-[11px] font-mono font-bold mr-1.5"
                  style={{ color: up ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                >
                  {t.price.toFixed(3)}
                </span>
                <span
                  className="flex items-center text-[9px] font-bold"
                  style={{ color: up ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                >
                  {up ? <TrendingUp size={9} className="mr-0.5" /> : <TrendingDown size={9} className="mr-0.5" />}
                  {up ? "+" : ""}{(t.change * 100).toFixed(1)}c
                </span>
                <span
                  className="ml-2 text-[8px] font-bold px-1 rounded"
                  style={{
                    color: "var(--color-mu-text-muted)",
                    background: "var(--color-mu-surface-high)",
                    border: "1px solid var(--color-mu-border)",
                  }}
                >
                  {t.venue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--color-mu-surface), transparent)" }}
      />
    </div>
  );
}
