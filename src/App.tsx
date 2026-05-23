import { useEffect, useState } from "react";
import {
  Zap, Search, Wallet, Radio, Settings, Command, Activity, Shield, Command as CommandIcon, ChevronDown, Code
} from "lucide-react";
import { useTerminalStore, AppView } from "./store/useTerminalStore";
import { useBopBridge } from "./hooks/useBopBridge";
import { useMockMarket } from "./hooks/useMockMarket";

import { MarketTable } from "./components/MarketTable";
import { NewsFeed } from "./components/NewsFeed";
import { TickerTape } from "./components/TickerTape";
import { OrderBook } from "./components/OrderBook";
import { TimeAndSales } from "./components/TimeAndSales";
import { ExecutionPanel } from "./components/ExecutionPanel";
import { WhaleTracker } from "./components/WhaleTracker";
import { TopTradersView } from "./components/TopTradersView";
import { StrategyLab } from "./components/StrategyLab";
import { PortfolioView } from "./components/PortfolioView";
import { LiveChart } from "./components/LiveChart";
import { ArbitrageMonitor } from "./components/ArbitrageMonitor";
import { SettingsView } from "./components/SettingsView";
import { AnalyticsView } from "./components/AnalyticsView";

import "./App.css";

const NavItem = ({ name, index }: { name: AppView, index: number }) => {
  const { activeView, setActiveView } = useTerminalStore();
  return (
    <button
      onClick={() => setActiveView(name)}
      className={activeView === name ? "mu-tab-active" : "mu-tab-inactive"}
    >
      <div className="flex items-center gap-1.5">
        <span>{name}</span>
        <span className="text-[9px] opacity-40 font-bold tracking-widest">[F{index + 1}]</span>
      </div>
    </button>
  );
};

const CommandPalette = () => {
  const { isCommandPaletteOpen, toggleCommandPalette, setActiveView } = useTerminalStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = [
    { name: "Trade: US Elections", shortcut: "G T", action: () => setActiveView("Trade") },
    { name: "Market Discovery", shortcut: "G D", action: () => setActiveView("Discover") },
    { name: "Live News Squawk", shortcut: "G N", action: () => setActiveView("News") },
    { name: "Global Analytics", shortcut: "G A", action: () => setActiveView("Analytics") },
    { name: "Portfolio & PnL", shortcut: "G P", action: () => setActiveView("Portfolio") },
    { name: "Arbitrage Monitor", shortcut: "G R", action: () => setActiveView("Arbitrage") },
    { name: "Top Traders", shortcut: "G W", action: () => setActiveView("Top Traders") },
    { name: "Algorithm & Strategy Lab", shortcut: "G S", action: () => setActiveView("Strategies") },
  ];

  const filteredOptions = options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => setSelectedIndex(0), [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[selectedIndex]) {
        filteredOptions[selectedIndex].action();
        toggleCommandPalette();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm   " onClick={toggleCommandPalette}>
      <div className="w-full max-w-xl mu-panel-high shadow-2xl overflow-hidden   " onClick={e => e.stopPropagation()}>
        <div className="flex items-center p-4 border-b border-mu-border-high" style={{ background: "var(--color-mu-surface)" }}>
          <Search size={18} style={{ color: "var(--color-mu-accent)" }} className="mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="TYPE COMMAND OR MARKET..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold uppercase tracking-wide"
            style={{ color: "var(--color-mu-text)" }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="px-1.5 py-0.5 rounded text-[9px] font-black" style={{ background: "var(--color-mu-surface-high)", color: "var(--color-mu-text-muted)", border: "1px solid var(--color-mu-border)" }}>ESC</kbd>
        </div>
        <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto mu-scrollbar">
          {filteredOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => { opt.action(); toggleCommandPalette(); }}
              className={`w-full flex items-center justify-between p-3 rounded  ${i === selectedIndex ? "bg-[var(--color-mu-surface-high)]" : "hover:bg-[var(--color-mu-surface-mid)]"}`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-widest ${i === selectedIndex ? "text-[var(--color-mu-accent)]" : "text-[var(--color-mu-text-dim)]"}`}>{opt.name}</span>
              <span className={`text-[9px] font-black ${i === selectedIndex ? "text-[var(--color-mu-accent)]" : "text-[var(--color-mu-text-muted)]"}`}>{opt.shortcut}</span>
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="p-8 text-center mu-label tracking-[0.2em]">
              NO RESULTS FOUND FOR "{query}"
            </div>
          )}
        </div>
        <div className="p-3 border-t border-mu-border-high flex items-center justify-between" style={{ background: "var(--color-mu-surface-mid)" }}>
          <div className="flex items-center gap-4 text-[9px] font-black text-[var(--color-mu-text-muted)] uppercase">
            <div className="flex items-center gap-1"><ChevronDown size={10} /> <span>NAVIGATE</span></div>
            <div className="flex items-center gap-1"><CommandIcon size={10} /> <span>EXECUTE</span></div>
          </div>
          <div className="text-[9px] font-black text-[var(--color-mu-text-muted)] uppercase italic">μT_KERNEL_v1.0</div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Layout ---

function App() {
  const [command, setCommand] = useState("");
  const { isConnected } = useBopBridge();
  const { activeView, setActiveView, toggleCommandPalette, isCommandPaletteOpen } = useTerminalStore();
  const marketData = useMockMarket("TRUMP_WIN_2026");
  const [chartMode, setChartMode] = useState<"line" | "heatmap">("line");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") {
          e.target.blur();
        }
        return;
      }

      // Mac uses 'metaKey', Windows uses 'ctrlKey'
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        document.getElementById("main-cmd-input")?.focus();
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        toggleCommandPalette();
      }
      
      // Bloomberg/ToS Function Keys
      if (e.key >= "F1" && e.key <= "F6") {
        e.preventDefault();
        const views: AppView[] = ["Discover", "Trade", "Strategies", "News", "Top Traders", "Portfolio"];
        const index = parseInt(e.key.substring(1)) - 1;
        if (index >= 0 && index < views.length) {
          setActiveView(views[index]);
        }
      }

      // Standard Trader Hotkeys
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        setActiveView("Trade");
        window.dispatchEvent(new CustomEvent("mu-set-side", { detail: "BUY" }));
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setActiveView("Trade");
        window.dispatchEvent(new CustomEvent("mu-set-side", { detail: "SELL" }));
      }
    };
    
    // Attach to document to ensure it catches everything
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setActiveView, toggleCommandPalette, isCommandPaletteOpen]);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    setCommand("");
  };

  const handleOrderSubmit = (order: any) => {
    console.log("[App] Order Submitted via BOP:", order);
    // In a real app this sends IPC to sidecar
    window.dispatchEvent(new CustomEvent("mu-notification", { 
      detail: `EXECUTED: ${order.side} ${order.qty} ${order.ticker} @ ${order.price.toFixed(3)} via BOP ULA`
    }));
  };

  const [notification, setNotification] = useState<string | null>(null);
  
  useEffect(() => {
    const handleNotif = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      setNotification(msg);
      setTimeout(() => setNotification(null), 4000);
    };
    window.addEventListener("mu-notification", handleNotif);
    return () => window.removeEventListener("mu-notification", handleNotif);
  }, []);

  return (
    <div className="h-screen flex flex-col selection:bg-[rgba(232,160,32,0.3)]">
      {notification && (
        <div className="fixed top-16 right-4 z-[200] px-4 py-2 rounded shadow-2xl border flex items-center gap-2" 
             style={{ background: 'var(--color-mu-green)', color: 'black', borderColor: 'rgba(255,255,255,0.2)' }}>
          <Zap size={14} />
          <span className="font-mono text-[11px] font-black tracking-widest">{notification}</span>
        </div>
      )}
      <CommandPalette />

      {/* Top Ticker Tape */}
      <TickerTape />

      {/* Primary Header */}
      <header className="flex items-center justify-between px-4 h-12 z-50 shrink-0" style={{ background: "var(--color-mu-surface)", borderBottom: "1px solid var(--color-mu-border)" }}>
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveView("Trade")}>
            <Zap size={18} style={{ color: "var(--color-mu-accent)" }} className="mu-glow-accent group-hover:scale-110 " />
            <span className="font-black text-[15px] tracking-tighter italic" style={{ color: "var(--color-mu-text-bright)" }}>
              <span className="lowercase">μ</span>TERMINAL
            </span>
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded tracking-widest" style={{ background: "rgba(232,160,32,0.1)", color: "var(--color-mu-accent)", border: "1px solid rgba(232,160,32,0.2)" }}>BOP_v1.0</span>
          </div>
          <nav className="flex items-center gap-6 h-full font-black text-[10px] uppercase tracking-widest">
            {(["Discover", "Trade", "Strategies", "News", "Top Traders", "Portfolio"] as AppView[]).map((tab, i) => (
              <NavItem key={tab} name={tab} index={i} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-[9px] font-black uppercase text-[var(--color-mu-text-muted)]">
            <div className="flex items-center gap-1.5"><Activity size={12} style={{ color: "var(--color-mu-cyan)" }} /> <span>LAT: 12ms</span></div>
            <div className="flex items-center gap-1.5"><Shield size={12} style={{ color: "var(--color-mu-green)" }} /> <span>SECURE</span></div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-text)] " onClick={() => setActiveView("Settings")}><Settings size={16} /></button>
            <button className="p-1.5 text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-text)] " onClick={toggleCommandPalette}><Command size={16} /></button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Context & Routing */}
        <aside className="w-56 flex flex-col shrink-0" style={{ background: "var(--color-mu-surface-mid)", borderRight: "1px solid var(--color-mu-border)" }}>
          <div className="p-3 border-b" style={{ borderColor: "var(--color-mu-border)" }}>
            <div className="mu-label mb-1">System Status</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[var(--color-mu-text-dim)] uppercase">BOP Engine</span>
              <span className="text-[9px] font-black uppercase" style={{ color: isConnected ? "var(--color-mu-green)" : "var(--color-mu-amber)" }}>{isConnected ? "ONLINE" : "STANDBY"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[var(--color-mu-text-dim)] uppercase">Smart Router</span>
              <span className="text-[9px] font-black uppercase" style={{ color: "var(--color-mu-cyan)" }}>ACTIVE</span>
            </div>
          </div>

          <div className="p-3 border-b" style={{ borderColor: "var(--color-mu-border)" }}>
            <div className="mu-label mb-1">Venue Filter</div>
            <div className="flex flex-col gap-1">
              {["AGGREGATED", "POLYMARKET", "KALSHI", "PREDICTIT", "OPINION"].map((v, i) => (
                <button key={v} className="text-left px-2 py-1.5 rounded text-[10px] font-bold " style={{ background: i === 0 ? "var(--color-mu-surface-high)" : "transparent", color: i === 0 ? "var(--color-mu-text)" : "var(--color-mu-text-dim)", border: `1px solid ${i===0 ? "var(--color-mu-border-focus)" : "transparent"}` }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-3 border-t" style={{ borderColor: "var(--color-mu-border)" }}>
            <div className="mu-label mb-1">Global PnL (Today)</div>
            <div className="font-mono text-[16px] font-black" style={{ color: "var(--color-mu-green)" }}>+$2,412.50</div>
          </div>
        </aside>

        {/* Viewport */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[var(--color-mu-bg)]">
          {activeView === "Trade" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Ticker Header */}
              <div className="h-14 flex items-center justify-between px-4 shrink-0" style={{ borderBottom: "1px solid var(--color-mu-border)" }}>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-tight">{marketData.ticker.ticker}</h1>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] font-bold" style={{ color: "var(--color-mu-text-dim)" }}>Vol: {(marketData.ticker.volume24h/1e6).toFixed(2)}M</span>
                    <span className="text-[11px] font-bold" style={{ color: "var(--color-mu-text-dim)" }}>OI: ${(marketData.ticker.openInterest/1e6).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono tracking-tighter" style={{ color: marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)" }}>
                    {marketData.ticker.lastPrice.toFixed(3)}
                  </div>
                  <div className="text-[11px] font-bold font-mono" style={{ color: marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)" }}>
                    {marketData.ticker.change24h >= 0 ? "+" : ""}{marketData.ticker.change24h.toFixed(3)} ({marketData.ticker.changePct24h > 0 ? "+" : ""}{marketData.ticker.changePct24h.toFixed(2)}%)
                  </div>
                </div>
              </div>

              {/* Trade View Grid Layout */}
              <div className="flex-1 flex overflow-hidden p-1 gap-1">
                {/* Center / Chart placeholder + Whale tracker */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  <div className="flex-[2] mu-panel overflow-hidden relative group p-0">
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
                      <div className="mu-label bg-[var(--color-mu-surface)]/80 px-1 rounded backdrop-blur">
                        Live Chart (Mock)
                      </div>
                      <div className="flex items-center bg-black/80 rounded border overflow-hidden" style={{ borderColor: "var(--color-mu-border)" }}>
                        <button 
                          onClick={() => setChartMode("line")}
                          className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${chartMode === "line" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-cyan)]" : "text-[var(--color-mu-text-dim)]"}`}
                        >
                          SVG
                        </button>
                        <button 
                          onClick={() => setChartMode("heatmap")}
                          className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${chartMode === "heatmap" ? "bg-[var(--color-mu-surface-high)] text-[var(--color-mu-red)]" : "text-[var(--color-mu-text-dim)]"}`}
                        >
                          DOM
                        </button>
                      </div>
                    </div>
                    <LiveChart 
                      data={marketData.priceHistory} 
                      color={marketData.ticker.change24h >= 0 ? "var(--color-mu-green)" : "var(--color-mu-red)"} 
                      mode={chartMode}
                    />
                  </div>
                  <div className="flex-1 mu-panel overflow-hidden min-h-[200px]">
                    <WhaleTracker />
                  </div>
                </div>

                {/* Right Rail - Order Book & TAS */}
                <div className="w-[280px] flex flex-col gap-1 shrink-0 overflow-hidden">
                  <div className="flex-[3] mu-panel overflow-hidden min-h-[300px]">
                    <OrderBook 
                      bids={marketData.bids} 
                      asks={marketData.asks} 
                      lastPrice={marketData.ticker.lastPrice}
                      bidPrice={marketData.ticker.bidPrice}
                      askPrice={marketData.ticker.askPrice}
                      spread={marketData.ticker.spread}
                      priceHistory={marketData.priceHistory}
                    />
                  </div>
                  <div className="flex-[2] mu-panel overflow-hidden min-h-[200px]">
                    <TimeAndSales trades={marketData.trades} />
                  </div>
                </div>

                {/* Far Right Rail - Execution */}
                <div className="w-[240px] mu-panel overflow-hidden shrink-0">
                  <ExecutionPanel 
                    ticker={marketData.ticker.ticker}
                    bidPrice={marketData.ticker.bidPrice}
                    askPrice={marketData.ticker.askPrice}
                    onOrder={handleOrderSubmit}
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === "Discover" && <MarketTable />}
          {activeView === "Strategies" && <StrategyLab />}
          {activeView === "News" && <NewsFeed />}
          {activeView === "Top Traders" && <TopTradersView />}
          {activeView === "Portfolio" && <PortfolioView />}
          {activeView === "Arbitrage" && <ArbitrageMonitor />}
          {activeView === "Settings" && <SettingsView />}
          
          {activeView === "Analytics" && <AnalyticsView />}
        </section>
      </main>

      {/* Terminal Footer / CLI */}
      <footer className="h-9 border-t flex items-center shrink-0 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-top)" }}>
        
        {/* Left Quick Links */}
        <div className="flex items-center gap-6 px-4 h-full border-r" style={{ borderColor: "var(--color-mu-border)" }}>
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-accent)] " onClick={() => setActiveView("Portfolio")}>
            <Wallet size={10} /> <span>Assets</span>
          </button>
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-accent)] " onClick={() => setActiveView("Strategies")}>
            <Code size={10} /> <span>Algos</span>
          </button>
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-accent)] " onClick={() => setActiveView("News")}>
            <Radio size={10} /> <span>Squawk</span>
          </button>
        </div>

        {/* CLI Input */}
        <form onSubmit={handleDispatch} className="flex-1 flex items-center h-full px-4 gap-3 bg-[var(--color-mu-bg)]">
          <span className="font-black text-[11px] italic tracking-tighter shrink-0" style={{ color: "var(--color-mu-accent)" }}>μT&gt;</span>
          <input
            id="main-cmd-input"
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="ENTER BOP COMMAND STRING... (CMD+K FOR PALETTE)"
            className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold font-mono text-[var(--color-mu-text-bright)] placeholder:text-[var(--color-mu-text-ghost)] uppercase"
            autoComplete="off"
          />
        </form>

        {/* Right Status */}
        <div className="flex items-center h-full px-4 border-l" style={{ borderColor: "var(--color-mu-border)" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest" style={{ color: isConnected ? "var(--color-mu-green)" : "var(--color-mu-amber)" }}>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "" : ""}`} style={{ background: isConnected ? "var(--color-mu-green)" : "var(--color-mu-amber)" }} />
            <span>{isConnected ? "WS_OK" : "STANDBY"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
