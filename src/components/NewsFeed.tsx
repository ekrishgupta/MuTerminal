import { useState, useEffect } from "react";
import { Zap, ExternalLink, Search, TrendingUp, Filter } from "lucide-react";
import { TickerMapper } from "../utils/TickerMapper";
import { useTerminalStore } from "../store/useTerminalStore";

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

let newsId = 0;

function highlightKeywords(title: string, keywords: string[]) {
  return title.split(" ").map((word, i) => {
    const clean = word.toUpperCase().replace(/[^A-Z]/g, "");
    const isMatched = keywords.some((k) => clean === k || clean.startsWith(k));
    if (isMatched) {
      return (
        <span key={i} className="text-mu-text-bright font-bold">
          {word}{" "}
        </span>
      );
    }
    return <span key={i}>{word} </span>;
  });
}

export function NewsFeed() {
  const { setActiveView, setSelectedMarket } = useTerminalStore();
  const [items, setItems] = useState<NewsItem[]>(() =>
    SEED_NEWS.map((n, i) => ({ ...n, id: `n-${++newsId}`, time: Date.now() - i * 4 * 60000 }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.8) {
        const template = SEED_NEWS[Math.floor(Math.random() * SEED_NEWS.length)];
        const mapping = TickerMapper.mapHeadline(template.title);
        const dynamicTicker = mapping ? mapping.ticker : template.ticker;
        const dynamicKeywords = mapping ? Array.from(new Set([...template.keywords, ...mapping.keywords])) : template.keywords;
        
        setItems((prev) => [
          { ...template, id: `n-${++newsId}`, time: Date.now(), isBreaking: Math.random() > 0.9, ticker: dynamicTicker, keywords: dynamicKeywords },
          ...prev,
        ].slice(0, 40));
      }
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const formatAge = (t: number) => {
    const secs = Math.floor((Date.now() - t) / 1000);
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m`;
    return `${Math.floor(secs / 3600)}h`;
  };

  const handleQuickTrade = (ticker: string) => {
    setSelectedMarket(ticker);
    setActiveView("Trade");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-mu-bg">
      {/* Search & Category Bar */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-mu-border">
        <div className="flex items-center gap-1.5 text-mu-red font-bold px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <TrendingUp size={16} />
          <span>Squawk</span>
        </div>
        <div className="flex items-center gap-2">
          {["All", "Macro", "Elections", "Tech", "Crypto"].map(cat => (
            <button key={cat} className={`mu-pill ${cat === 'All' ? 'bg-mu-surface-high text-mu-text-bright' : ''}`}>{cat}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mu-text-dim" />
            <input 
              type="text" 
              placeholder="Filter news..."
              className="bg-mu-surface-low border border-mu-border rounded-full py-1.5 pl-9 pr-4 text-[13px] w-64 focus:outline-none focus:border-mu-text-dim transition-colors"
            />
          </div>
          <button className="p-2 rounded-full border border-mu-border text-mu-text-dim hover:text-mu-text-bright"><Filter size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="mu-card group cursor-pointer border-transparent hover:border-mu-border-high"
            onClick={() => handleQuickTrade(item.ticker)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.isBreaking && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-mu-red text-white">BREAKING</span>
                )}
                <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">{item.source}</span>
                <span className="text-[11px] text-mu-text-ghost">•</span>
                <span className="text-[11px] text-mu-text-dim font-medium">{formatAge(item.time)} ago</span>
              </div>
              <div className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                item.sentiment === 'bull' ? 'bg-mu-green-soft text-mu-green border-mu-green/20' : 
                item.sentiment === 'bear' ? 'bg-mu-red-soft text-mu-red border-mu-red/20' : 
                'bg-mu-surface-high text-mu-text-dim border-mu-border'
              }`}>
                {item.sentiment.toUpperCase()}
              </div>
            </div>

            <h3 className="text-[15px] font-semibold text-mu-text leading-snug group-hover:text-mu-text-bright transition-colors">
              {highlightKeywords(item.title, item.keywords)}
            </h3>

            <div className="mt-4 pt-4 border-t border-mu-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-mono font-bold text-mu-blue bg-blue-500/10 px-2 py-0.5 rounded">{item.ticker}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleQuickTrade(item.ticker); }}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-mu-text-dim hover:text-mu-text-bright transition-colors"
                >
                  <Zap size={12} className="text-mu-yellow" />
                  Quick Trade
                </button>
              </div>
              <div className="flex items-center gap-4">
                 {item.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-mu-surface-high rounded-full overflow-hidden">
                        <div className="h-full bg-mu-blue" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-mu-text-dim">AI:{item.score}%</span>
                    </div>
                 )}
                 <ExternalLink size={14} className="text-mu-text-ghost opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
