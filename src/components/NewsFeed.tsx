/**
 * NewsFeed - Professional news squawk with live-updating headlines,
 * keyword highlighting, and one-click trade execution.
 */
import { useState, useEffect } from "react";
import { Radio, Zap, ExternalLink } from "lucide-react";
import { TickerMapper } from "../utils/TickerMapper";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: number;
  sentiment: "bull" | "bear" | "neutral";
  ticker: string;
  keywords: string[];
  isBreaking?: boolean;
}

const SEED_NEWS: Omit<NewsItem, "id" | "time">[] = [
  { title: "BREAKING: Fed Chair signals potential pause in June rate cycle amid cooling CPI", source: "Bloomberg", sentiment: "bull", ticker: "MU:FED_CUT_JUNE", keywords: ["FED", "CPI", "RATE"], isBreaking: true },
  { title: "Trump leads Harris by 4pts in new Pennsylvania survey — Decision Desk HQ", source: "DDHQ", sentiment: "bull", ticker: "MU:TRUMP_WIN_2026", keywords: ["POLL", "TRUMP"], isBreaking: false },
  { title: "SCOTUS agrees to hear Chevron-related regulatory challenge", source: "Reuters", sentiment: "neutral", ticker: "MU:SCOTUS_RULING", keywords: ["RULING", "SCOTUS"], isBreaking: false },
  { title: "Bitcoin spot ETFs see $480M inflow — largest since March", source: "CoinDesk", sentiment: "bull", ticker: "MU:BTC_USD_100K", keywords: ["ETF", "BTC"], isBreaking: false },
  { title: "OPEC+ emergency call scheduled; Saudi Arabia expected to signal further cuts", source: "WSJ", sentiment: "bull", ticker: "MU:OPEC_CUT_Q3", keywords: ["OPEC"], isBreaking: false },
  { title: "Ukraine peace talks stall after Moscow rejects latest framework", source: "AP", sentiment: "bear", ticker: "MU:UKRAINE_PEACE", keywords: ["UKRAINE", "PEACE"], isBreaking: false },
  { title: "NVDA announces $40B share buyback, raises guidance for FY27", source: "SEC", sentiment: "bull", ticker: "MU:NVDA_200_JUL", keywords: ["NVDA", "EARNINGS"], isBreaking: false },
  { title: "California gig-work ruling reversed — Prop 22 reinstated by appeals court", source: "Reuters", sentiment: "neutral", ticker: "MU:HARRIS_CA_GOV", keywords: ["RULING", "CALIFORNIA"], isBreaking: false },
];

let newsId = 0;

const KEYWORD_COLORS: Record<string, string> = {
  FED:     "var(--color-mu-cyan)",
  CPI:     "var(--color-mu-cyan)",
  RATE:    "var(--color-mu-cyan)",
  POLL:    "var(--color-mu-accent)",
  TRUMP:   "var(--color-mu-accent)",
  RULING:  "var(--color-mu-purple)",
  SCOTUS:  "var(--color-mu-purple)",
  ETF:     "var(--color-mu-green)",
  BTC:     "var(--color-mu-green)",
  OPEC:    "var(--color-mu-amber)",
  UKRAINE: "var(--color-mu-red)",
  PEACE:   "var(--color-mu-red)",
  NVDA:    "var(--color-mu-green)",
  EARNINGS:"var(--color-mu-green)",
  CALIFORNIA: "var(--color-mu-text-dim)",
};

function highlightKeywords(title: string, keywords: string[]) {
  let remaining = title;

  // Simple word-boundary highlight
  keywords.forEach((kw) => {
    const idx = remaining.toUpperCase().indexOf(kw);
    if (idx !== -1) {
      // just store for reference — we'll render with spans
    }
  });

  // Tokenize by word, highlight matching keywords
  return title.split(" ").map((word, i) => {
    const clean = word.toUpperCase().replace(/[^A-Z]/g, "");
    const match = keywords.find((k) => clean === k || clean.startsWith(k));
    if (match) {
      return (
        <span
          key={i}
          className="font-black"
          style={{ color: KEYWORD_COLORS[match] || "var(--color-mu-accent)" }}
        >
          {word}{" "}
        </span>
      );
    }
    return <span key={i}>{word} </span>;
  });
}

const SENTIMENT_STYLE = {
  bull:    { bar: "var(--color-mu-green)", badge: "rgba(44,182,125,0.15)", color: "var(--color-mu-green)", label: "BULL" },
  bear:    { bar: "var(--color-mu-red)",   badge: "rgba(224,82,82,0.12)",  color: "var(--color-mu-red)",   label: "BEAR" },
  neutral: { bar: "var(--color-mu-text-muted)", badge: "var(--color-mu-surface-high)", color: "var(--color-mu-text-muted)", label: "NTRL" },
};

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>(() =>
    SEED_NEWS.map((n, i) => ({ ...n, id: `n-${++newsId}`, time: Date.now() - i * 4 * 60000 }))
  );

  // Occasionally surface a new headline
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.7) {
        const template = SEED_NEWS[Math.floor(Math.random() * SEED_NEWS.length)];
        
        // Add dynamic mapping via TickerMapper
        const mapping = TickerMapper.mapHeadline(template.title);
        const dynamicTicker = mapping ? mapping.ticker : template.ticker;
        const dynamicKeywords = mapping ? Array.from(new Set([...template.keywords, ...mapping.keywords])) : template.keywords;
        
        setItems((prev) => [
          { ...template, id: `n-${++newsId}`, time: Date.now(), isBreaking: Math.random() > 0.85, ticker: dynamicTicker, keywords: dynamicKeywords },
          ...prev,
        ].slice(0, 40));
      }
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const formatAge = (t: number) => {
    const secs = Math.floor((Date.now() - t) / 1000);
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m`;
    return `${Math.floor(secs / 3600)}h`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden ">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}
      >
        <div className="flex items-center gap-2">
          <Radio size={14} style={{ color: "var(--color-mu-red)" }} className="" />
          <span className="mu-heading text-[12px]" style={{ color: "var(--color-mu-text)" }}>Live Squawk</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="mu-label">12 Active Sources</span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-mu-green)", display: "inline-block" }}
          />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col divide-y"
        style={{ '--tw-divide-opacity': 1 } as any}
      >
        {items.map((item) => {
          const s = SENTIMENT_STYLE[item.sentiment];
          return (
            <div
              key={item.id}
              className="flex gap-3 px-4 py-3 group cursor-pointer "
              style={{ borderColor: "var(--color-mu-border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-mu-surface-mid)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Sentiment bar */}
              <div
                className="w-0.5 rounded-full shrink-0 self-stretch"
                style={{ background: s.bar, minHeight: 40 }}
              />

              <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center gap-2 mb-1">
                  {item.isBreaking && (
                    <span
                      className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider "
                      style={{
                        background: "rgba(224,82,82,0.15)",
                        color: "var(--color-mu-red)",
                        border: "1px solid rgba(224,82,82,0.3)",
                      }}
                    >
                      BREAKING
                    </span>
                  )}
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--color-mu-surface-high)",
                      color: "var(--color-mu-text-muted)",
                      border: "1px solid var(--color-mu-border)",
                    }}
                  >
                    {item.source}
                  </span>
                  <span className="text-[9px]" style={{ color: "var(--color-mu-text-muted)" }}>
                    {formatAge(item.time)} ago
                  </span>
                  <span
                    className="text-[8px] font-black px-1 py-0.5 rounded ml-auto"
                    style={{
                      background: s.badge,
                      color: s.color,
                      border: `1px solid ${s.bar}40`,
                    }}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Title with keyword highlights */}
                <p className="text-[11px] font-bold leading-snug mb-2"
                  style={{ color: "var(--color-mu-text)" }}>
                  {highlightKeywords(item.title, item.keywords)}
                </p>

                {/* Action row */}
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      color: "var(--color-mu-cyan)",
                      background: "rgba(59,158,202,0.08)",
                      border: "1px solid rgba(59,158,202,0.2)",
                    }}
                  >
                    {item.ticker}
                  </span>
                  <button
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider "
                    style={{ color: "var(--color-mu-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-mu-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mu-text-muted)")}
                  >
                    <Zap size={9} />
                    Quick Trade
                  </button>
                  <ExternalLink
                    size={10}
                    className="ml-auto opacity-0 group-hover:opacity-60 "
                    style={{ color: "var(--color-mu-text-muted)" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
