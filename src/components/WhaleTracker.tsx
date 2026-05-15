/**
 * WhaleTracker - Real-time whale / alpha surveillance panel.
 * Simulates large order detection across venues.
 */
import { useEffect, useState } from "react";
import { Activity, ExternalLink, AlertCircle } from "lucide-react";

interface WhaleEvent {
  id: string;
  time: number;
  wallet: string;
  market: string;
  side: "BUY" | "SELL";
  size: number;
  notional: number;
  price: number;
  venue: "POLY" | "KALSHI" | "PI";
  type: "WHALE" | "SIGNAL" | "ARB" | "INFO";
}

const MARKETS = [
  "TRUMP_WIN_2026", "FED_CUT_JUNE", "BTC_USD_100K",
  "NVDA_200_JUL", "SPX_6K_DEC", "UKRAINE_PEACE", "SCOTUS_RULING"
];

const WALLETS = [
  "0x3f...8a2d", "0xa1...c44f", "0x91...e12b",
  "0x2d...7f30", "kalshi:pro_desk_7", "kalshi:apex_mm",
];

let eventId = 0;

function generateEvent(): WhaleEvent {
  const size = Math.round(Math.random() * 40000 + 5000);
  const price = parseFloat((Math.random() * 0.7 + 0.15).toFixed(3));
  const notional = size * price;
  const type: WhaleEvent["type"] =
    notional > 30000 ? "WHALE" :
    Math.random() > 0.7 ? "ARB" :
    Math.random() > 0.5 ? "SIGNAL" : "INFO";

  return {
    id: `w-${++eventId}`,
    time: Date.now(),
    wallet: WALLETS[Math.floor(Math.random() * WALLETS.length)],
    market: MARKETS[Math.floor(Math.random() * MARKETS.length)],
    side: Math.random() > 0.5 ? "BUY" : "SELL",
    size,
    notional,
    price,
    venue: ["POLY", "KALSHI", "PI"][Math.floor(Math.random() * 3)] as WhaleEvent["venue"],
    type,
  };
}

const TYPE_STYLE: Record<WhaleEvent["type"], { color: string; bg: string; border: string; label: string }> = {
  WHALE:  { color: "var(--color-mu-accent)", bg: "rgba(232,160,32,0.08)", border: "rgba(232,160,32,0.3)", label: "WHALE" },
  SIGNAL: { color: "var(--color-mu-cyan)",   bg: "rgba(59,158,202,0.06)",  border: "rgba(59,158,202,0.25)", label: "SIGNAL" },
  ARB:    { color: "var(--color-mu-purple)", bg: "rgba(124,92,191,0.08)",  border: "rgba(124,92,191,0.25)", label: "ARB" },
  INFO:   { color: "var(--color-mu-text-dim)",bg: "transparent",            border: "var(--color-mu-border)", label: "INFO" },
};

export function WhaleTracker() {
  const [events, setEvents] = useState<WhaleEvent[]>(() =>
    Array.from({ length: 6 }, generateEvent).sort((a, b) => b.time - a.time)
  );

  useEffect(() => {
    const roll = () => {
      if (Math.random() < 0.35) {
        setEvents((prev) => [generateEvent(), ...prev].slice(0, 50));
      }
    };
    const id = setInterval(roll, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "var(--color-mu-border)" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={12} style={{ color: "var(--color-mu-accent)" }} />
          <span className="mu-heading">Alpha Monitor</span>
        </div>
        <span className="mu-label">Threshold: $10K</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1 p-2">
        {events.map((ev) => {
          const style = TYPE_STYLE[ev.type];
          const time = new Date(ev.time);
          const timeStr = `${time.getHours().toString().padStart(2,"0")}:${time.getMinutes().toString().padStart(2,"0")}:${time.getSeconds().toString().padStart(2,"0")}`;

          return (
            <div
              key={ev.id}
              className="rounded px-2 py-2  flex items-start justify-between gap-2 group cursor-pointer"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      color: style.color,
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {style.label}
                  </span>
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{ color: "var(--color-mu-text-muted)" }}
                  >
                    {timeStr}
                  </span>
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: ev.side === "BUY" ? "var(--color-mu-green)" : "var(--color-mu-red)" }}
                  >
                    {ev.side}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-mono text-[10px] font-black"
                    style={{ color: style.color }}
                  >
                    {ev.market}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: "var(--color-mu-text)" }}
                  >
                    ${ev.notional >= 1000 ? `${(ev.notional/1000).toFixed(1)}K` : ev.notional.toFixed(0)}
                  </span>
                  <span
                    className="text-[9px]"
                    style={{ color: "var(--color-mu-text-dim)" }}
                  >
                    {ev.size.toLocaleString()} @ {ev.price.toFixed(3)} · {ev.venue}
                  </span>
                </div>
                <div
                  className="font-mono text-[8px] mt-0.5 truncate"
                  style={{ color: "var(--color-mu-text-muted)" }}
                >
                  {ev.wallet}
                </div>
              </div>
              <ExternalLink
                size={10}
                className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 "
                style={{ color: "var(--color-mu-text-muted)" }}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom warning bar */}
      <div
        className="px-3 py-1.5 border-t flex items-center gap-2"
        style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-mid)" }}
      >
        <AlertCircle size={10} style={{ color: "var(--color-mu-text-muted)" }} />
        <span className="mu-label">Monitoring 12 top wallets · Poly + Kalshi</span>
      </div>
    </div>
  );
}
