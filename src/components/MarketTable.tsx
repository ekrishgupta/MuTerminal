/**
 * MarketTable - Venue aggregator with sortable columns, live OI data.
 */
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Market {
  name: string;
  openInterest: number;
  tvl: number | null;
  notional7D: number | null;
  volume30D: number;
  transactions: number;
  users: string;
  color: string;
  initial: string;
  type: "regulated" | "defi" | "hybrid";
  status: "live" | "degraded" | "offline";
}

const MARKETS: Market[] = [
  { name: "Kalshi", openInterest: 668430000, tvl: null, notional7D: 4130000000, volume30D: 5640000000, transactions: 457500000, users: "457.5M", color: "#2cb67d", initial: "K", type: "regulated", status: "live" },
  { name: "Polymarket", openInterest: 444340000, tvl: 462830000, notional7D: 1570000000, volume30D: 4030000000, transactions: 488100000, users: "2.72M+", color: "#3b9eca", initial: "P", type: "defi", status: "live" },
  { name: "PredictIt", openInterest: 13650000, tvl: 13970000, notional7D: 302460000, volume30D: 792550000, transactions: 2900000, users: "90K", color: "#5a7ec4", initial: "PI", type: "regulated", status: "live" },
  { name: "Opinion Markets", openInterest: 8120000, tvl: 8120000, notional7D: 105540000, volume30D: 459260000, transactions: 9800000, users: "245K", color: "#d97706", initial: "OP", type: "defi", status: "live" },
  { name: "ForecastEx", openInterest: 6230000, tvl: null, notional7D: 5870000, volume30D: 29680000, transactions: 3900000, users: "3.9M", color: "#e05252", initial: "FX", type: "regulated", status: "live" },
  { name: "Rain", openInterest: 3440000, tvl: 3480000, notional7D: null, volume30D: 2550000, transactions: 0, users: "—", color: "#f3d849", initial: "RN", type: "defi", status: "live" },
  { name: "Limitless", openInterest: 967000, tvl: 527920, notional7D: null, volume30D: 286890000, transactions: 10500000, users: "247K", color: "#7c5cbf", initial: "LM", type: "defi", status: "live" },
  { name: "SX Bet", openInterest: 636610, tvl: null, notional7D: null, volume30D: 52640000, transactions: 1600000, users: "5.2K", color: "#e8758a", initial: "SX", type: "defi", status: "degraded" },
  { name: "Myriad", openInterest: 541890, tvl: 637500, notional7D: 561860, volume30D: 3730000, transactions: 5400000, users: "67K", color: "#6466f1", initial: "MY", type: "defi", status: "live" },
];

type SortKey = "openInterest" | "tvl" | "notional7D" | "volume30D" | "transactions";

function fmt(v: number | null, prefix = "$"): string {
  if (v === null || v === 0) return "—";
  if (v >= 1e9) return `${prefix}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${prefix}${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${prefix}${(v / 1e3).toFixed(0)}K`;
  return `${prefix}${v.toFixed(0)}`;
}

export function MarketTable() {
  const [sortKey, setSortKey] = useState<SortKey>("openInterest");
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc((d) => !d);
    else { setSortKey(key); setSortDesc(true); }
  };

  const sorted = [...MARKETS].sort((a, b) => {
    const av = a[sortKey] ?? -1;
    const bv = b[sortKey] ?? -1;
    return sortDesc ? bv - av : av - bv;
  });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronDown size={9} style={{ opacity: 0.3 }} />;
    return sortDesc
      ? <ChevronDown size={9} style={{ color: "var(--color-mu-accent)" }} />
      : <ChevronUp size={9} style={{ color: "var(--color-mu-accent)" }} />;
  };

  const totalOI = MARKETS.reduce((s, m) => s + m.openInterest, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden ">
      {/* Summary bar */}
      <div
        className="grid grid-cols-4 px-4 py-2.5 border-b gap-6"
        style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}
      >
        {[
          { label: "Aggregated Open Interest", value: fmt(totalOI), color: "var(--color-mu-accent)" },
          { label: "Venues Monitored", value: `${MARKETS.length} Active`, color: "var(--color-mu-text-bright)" },
          { label: "30D Combined Volume", value: fmt(MARKETS.reduce((s, m) => s + m.volume30D, 0)), color: "var(--color-mu-cyan)" },
          { label: "Status", value: "All Systems Go", color: "var(--color-mu-green)" },
        ].map((s) => (
          <div key={s.label}>
            <div className="mu-label">{s.label}</div>
            <div className="text-[14px] font-black mt-1 font-mono" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead className="mu-table-header">
            <tr>
              <th className="text-left pl-4" style={{ width: "22%" }}>Exchange Venue</th>
              <th className="text-left" style={{ width: "8%" }}>Type</th>
              <th
                className="text-right cursor-pointer hover:text-opacity-80"
                onClick={() => handleSort("openInterest")}
                style={{ width: "14%" }}
              >
                <div className="flex items-center justify-end gap-1">
                  Open Interest <SortIcon k="openInterest" />
                </div>
              </th>
              <th
                className="text-right cursor-pointer"
                onClick={() => handleSort("tvl")}
                style={{ width: "12%" }}
              >
                <div className="flex items-center justify-end gap-1">TVL <SortIcon k="tvl" /></div>
              </th>
              <th
                className="text-right cursor-pointer"
                onClick={() => handleSort("notional7D")}
                style={{ width: "14%" }}
              >
                <div className="flex items-center justify-end gap-1">Notional 7D <SortIcon k="notional7D" /></div>
              </th>
              <th
                className="text-right cursor-pointer"
                onClick={() => handleSort("volume30D")}
                style={{ width: "14%" }}
              >
                <div className="flex items-center justify-end gap-1">Volume 30D <SortIcon k="volume30D" /></div>
              </th>
              <th
                className="text-right cursor-pointer"
                onClick={() => handleSort("transactions")}
                style={{ width: "12%" }}
              >
                <div className="flex items-center justify-end gap-1">Transactions <SortIcon k="transactions" /></div>
              </th>
              <th className="text-right pr-4" style={{ width: "12%" }}>Active Users</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => {
              const oiPct = (m.openInterest / totalOI) * 100;
              return (
                <tr key={m.name} className="mu-table-row group">
                  <td className="pl-4">
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <span
                        className="font-mono text-[10px] font-bold w-4 text-right"
                        style={{ color: "var(--color-mu-text-muted)" }}
                      >
                        {i + 1}
                      </span>
                      {/* Avatar */}
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black"
                        style={{ background: m.color + "22", border: `1px solid ${m.color}40`, color: m.color }}
                      >
                        {m.initial}
                      </div>
                      {/* Name */}
                      <div>
                        <div
                          className="text-[11px] font-bold group-hover:text-[var(--color-mu-cyan)] "
                          style={{ color: "var(--color-mu-text)" }}
                        >
                          {m.name}
                        </div>
                        {/* OI bar */}
                        <div
                          className="h-0.5 rounded-full mt-1"
                          style={{
                            width: `${Math.max(4, oiPct)}%`,
                            background: m.color,
                            opacity: 0.6,
                            maxWidth: 80,
                          }}
                        />
                      </div>
                      <ExternalLink
                        size={10}
                        className="ml-auto opacity-0 group-hover:opacity-40 "
                        style={{ color: "var(--color-mu-text-muted)" }}
                      />
                    </div>
                  </td>
                  <td>
                    <span
                      className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                      style={{
                        background: m.type === "regulated" ? "rgba(44,182,125,0.1)" : "rgba(59,158,202,0.1)",
                        color: m.type === "regulated" ? "var(--color-mu-green)" : "var(--color-mu-cyan)",
                        border: `1px solid ${m.type === "regulated" ? "rgba(44,182,125,0.25)" : "rgba(59,158,202,0.25)"}`,
                      }}
                    >
                      {m.type === "regulated" ? "REG" : "DEFI"}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: "var(--color-mu-text)" }}
                    >
                      {fmt(m.openInterest)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--color-mu-text-dim)" }}
                    >
                      {fmt(m.tvl)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--color-mu-text-dim)" }}
                    >
                      {fmt(m.notional7D)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: "var(--color-mu-text)" }}
                    >
                      {fmt(m.volume30D)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--color-mu-text-dim)" }}
                    >
                      {fmt(m.transactions, "")}
                    </span>
                  </td>
                  <td className="text-right pr-4">
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--color-mu-surface-high)",
                        border: "1px solid var(--color-mu-border-high)",
                        color: "var(--color-mu-text-dim)",
                      }}
                    >
                      {m.users}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
