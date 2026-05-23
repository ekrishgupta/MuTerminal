/**
 * NewsFeed - Professional news squawk with live-updating headlines,
 * keyword highlighting, and one-click trade execution.
 */
import { useState, useEffect } from "react";
import { Radio, Zap, ExternalLink, FileText, Scale } from "lucide-react";
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
  score?: number;
  pdfUrl?: string;
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

const SEED_LEGAL: Omit<NewsItem, "id" | "time">[] = [
  { title: "SEC v. Ripple Labs - Summary Judgment Denial (Docket 214)", source: "PACER AI", sentiment: "bull", ticker: "MU:XRP_ETF_2026", keywords: ["SEC", "RIPPLE", "JUDGMENT"], score: 82, pdfUrl: "gov.uscourts.nysd.551082.214.0.pdf" },
  { title: "FTC Final Rule: Non-Compete Clause Ban (Federal Register)", source: "FEDERAL REGISTER AI", sentiment: "bear", ticker: "MU:UBER_Q3_EARNINGS", keywords: ["FTC", "RULE", "UBER"], score: 41, pdfUrl: "FR-2024-04-23-NonCompete.pdf" },
  { title: "Chevron Deference Overturned: Loper Bright Enterprises v. Raimondo", source: "SCOTUS AI", sentiment: "neutral", ticker: "MU:EPA_EMISSION_REG", keywords: ["CHEVRON", "SCOTUS", "RULING"], score: 65, pdfUrl: "scotus_22-451_7m58.pdf" },
  { title: "United States v. Google LLC - Antitrust Findings of Fact", source: "PACER AI", sentiment: "bear", ticker: "MU:GOOG_BREAKUP_25", keywords: ["ANTITRUST", "GOOGLE"], score: 89, pdfUrl: "us_v_google_findings_24.pdf" },
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
  const [feedMode, setFeedMode] = useState<"squawk" | "legal">("squawk");
  const [items, setItems] = useState<NewsItem[]>(() =>
    SEED_NEWS.map((n, i) => ({ ...n, id: `n-${++newsId}`, time: Date.now() - i * 4 * 60000 }))
  );
  
  const [legalItems, setLegalItems] = useState<NewsItem[]>(() =>
    SEED_LEGAL.map((n, i) => ({ ...n, id: `l-${++newsId}`, time: Date.now() - i * 15 * 60000 }))
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
        <div className="flex items-center gap-4 bg-black p-1 rounded border" style={{ borderColor: "var(--color-mu-border)" }}>
          <button 
            onClick={() => setFeedMode("squawk")}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${feedMode === "squawk" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-text-bright)]" : "text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-text)]"}`}
          >
            <Radio size={12} style={{ color: feedMode === "squawk" ? "var(--color-mu-red)" : "inherit" }} />
            Squawk
          </button>
          <button 
            onClick={() => setFeedMode("legal")}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${feedMode === "legal" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-text-bright)]" : "text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-text)]"}`}
          >
            <Scale size={12} style={{ color: feedMode === "legal" ? "var(--color-mu-cyan)" : "inherit" }} />
            AI Legal Parser
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="mu-label">{feedMode === "squawk" ? "12 Active Sources" : "2 Document Ingestion Nodes"}</span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: feedMode === "squawk" ? "var(--color-mu-green)" : "var(--color-mu-cyan)", display: "inline-block" }}
          />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col divide-y"
        style={{ '--tw-divide-opacity': 1 } as any}
      >
        {(feedMode === "squawk" ? items : legalItems).map((item) => {
          const s = SENTIMENT_STYLE[item.sentiment];
          return (
            <div
              key={item.id}
              className="flex gap-3 px-4 py-3 group cursor-pointer hover:bg-[var(--color-mu-surface-mid)] transition-colors"
              style={{ borderColor: "var(--color-mu-border)" }}
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
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-accent)] transition-colors"
                  >
                    <Zap size={9} />
                    Quick Trade
                  </button>
                  {item.pdfUrl && (
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1"
                      style={{
                        color: "var(--color-mu-text-muted)",
                        background: "var(--color-mu-surface)",
                        border: "1px solid var(--color-mu-border)",
                      }}
                    >
                      <FileText size={8} />
                      {item.pdfUrl}
                    </span>
                  )}
                  {item.score !== undefined && (
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 ml-auto"
                      style={{
                        color: item.score > 60 ? "var(--color-mu-green)" : (item.score < 40 ? "var(--color-mu-red)" : "var(--color-mu-text-dim)"),
                        background: "var(--color-mu-surface)",
                        border: "1px solid var(--color-mu-border)",
                      }}
                    >
                      AI_CONF: {item.score}%
                    </span>
                  )}
                  <ExternalLink
                    size={10}
                    className={`${item.score !== undefined ? '' : 'ml-auto'} opacity-0 group-hover:opacity-60 `}
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
