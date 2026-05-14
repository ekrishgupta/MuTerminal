import { useEffect, useState } from "react";
import { 
  Zap, Search, Bell, ChevronDown, ListFilter, Wallet,
  Newspaper, Gavel, Radio, MessageSquare, ExternalLink, ArrowUpRight,
  TrendingUp, Activity, BarChart3, Shield, Terminal, Settings, X, Command
} from "lucide-react";
import { useBopBridge } from "./hooks/useBopBridge";
import { useTerminalStore, AppView } from "./store/useTerminalStore";
import { MarketTable } from "./components/MarketTable";
import { NewsFeed } from "./components/NewsFeed";
import "./App.css";

// --- Sub-Components ---

const NavItem = ({ name, index }: { name: AppView, index: number }) => {
  const { activeView, setActiveView } = useTerminalStore();
  return (
    <button 
      onClick={() => setActiveView(name)}
      className={activeView === name ? "mu-tab-active" : "mu-tab-inactive"}
    >
      <div className="flex items-center space-x-1">
         <span>{name}</span>
         <span className="text-[8px] opacity-20 font-black">[{index + 1}]</span>
      </div>
    </button>
  );
};

const MarketFilterBtn = ({ name }: { name: string }) => {
  const { marketFilter, setMarketFilter } = useTerminalStore();
  const active = marketFilter === name;
  return (
    <button 
      onClick={() => setMarketFilter(name)}
      className={`px-3 py-1 rounded text-[10px] font-bold tracking-tight transition-all border ${
        active 
        ? "bg-mu-surface-high border-mu-border-high text-mu-text shadow-sm" 
        : "border-transparent text-mu-text-muted hover:text-mu-text hover:bg-mu-surface/50"
      }`}
    >
      {name}
    </button>
  );
};

// --- Command Palette ---

const CommandPalette = () => {
   const { isCommandPaletteOpen, toggleCommandPalette, setActiveView } = useTerminalStore();
   const [query, setQuery] = useState("");

   if (!isCommandPaletteOpen) return null;

   const options = [
      { name: "Trade: US Elections", shortcut: "G T", action: () => setActiveView("Trade") },
      { name: "Market Discovery", shortcut: "G D", action: () => setActiveView("Discover") },
      { name: "Global Analytics", shortcut: "G A", action: () => setActiveView("Analytics") },
      { name: "Live News Squawk", shortcut: "G N", action: () => setActiveView("News") },
      { name: "Portfolio & PnL", shortcut: "G P", action: () => setActiveView("Portfolio") },
      { name: "Settings & API Keys", shortcut: ",", action: () => {} },
   ];

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-mu-bg/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200" onClick={toggleCommandPalette}>
         <div className="w-full max-w-xl mu-panel-high shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center p-4 border-b border-mu-border-high bg-mu-surface">
               <Search size={18} className="text-mu-cyan mr-3" />
               <input 
                  autoFocus 
                  type="text" 
                  placeholder="Type a command or market..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-mu-text uppercase tracking-tight placeholder:text-mu-text-muted/30"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
               />
               <kbd className="bg-mu-bg border border-mu-border px-1.5 py-0.5 rounded text-[10px] font-black text-mu-text-muted">ESC</kbd>
            </div>
            <div className="p-2 space-y-1">
               {options.filter(o => o.name.toLowerCase().includes(query.toLowerCase())).map((opt, i) => (
                  <button key={i} onClick={() => { opt.action(); toggleCommandPalette(); }} className="w-full flex items-center justify-between p-3 rounded hover:bg-mu-cyan/10 group transition-all">
                     <span className="text-xs font-bold uppercase tracking-widest text-mu-text-dim group-hover:text-mu-text">{opt.name}</span>
                     <span className="text-[10px] font-black text-mu-text-muted group-hover:text-mu-cyan">{opt.shortcut}</span>
                  </button>
               ))}
            </div>
            <div className="p-3 border-t border-mu-border-high bg-mu-bg flex items-center justify-between">
               <div className="flex items-center space-x-4 text-[9px] font-black text-mu-text-muted uppercase">
                  <div className="flex items-center space-x-1"><ChevronDown size={10} /> <span>Navigate</span></div>
                  <div className="flex items-center space-x-1"><X size={10} /> <span>Select</span></div>
               </div>
               <div className="text-[9px] font-black text-mu-text-muted uppercase italic">μT_KERNEL_v0.1</div>
            </div>
         </div>
      </div>
   );
}

// --- Views ---

const TradeView = ({ lastUpdate }: { lastUpdate: any }) => {
  const [bids, setBids] = useState<[number, number][]>([]);
  const [asks, setAsks] = useState<[number, number][]>([]);

  useEffect(() => {
    if (lastUpdate?.type === "depth") {
      if (lastUpdate.bids) setBids(lastUpdate.bids);
      if (lastUpdate.asks) setAsks(lastUpdate.asks);
    }
  }, [lastUpdate]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-12 gap-2 flex-1 p-2 overflow-hidden">
        {/* Aggregated Order Book */}
        <div className="col-span-8 mu-panel flex flex-col p-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 size={16} className="text-mu-cyan" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Unified Order Book</h2>
            </div>
            <div className="text-[10px] font-mono text-mu-cyan px-2 py-0.5 bg-mu-cyan/10 rounded border border-mu-cyan/20">
              {lastUpdate?.ticker || "MU:TRUMP_WIN_2024"}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-8 font-mono text-xs overflow-hidden">
            <div className="flex flex-col-reverse justify-end mu-scrollbar overflow-y-auto pr-4">
              <div className="flex justify-between border-b border-mu-border pb-1 mb-2 text-mu-text-muted font-bold tracking-tighter uppercase text-[9px]">
                <span>Price (USD)</span>
                <span>Size</span>
              </div>
              {(asks.length > 0 ? asks : [...Array(20)]).map((row, i) => (
                <div key={i} className="flex justify-between py-1 px-2 hover:bg-mu-red/10 rounded-sm transition-colors group cursor-pointer relative overflow-hidden">
                  {Array.isArray(row) && <div className="absolute inset-0 bg-mu-red/5 origin-left animate-in slide-in-from-left-full duration-500" style={{ width: `${Math.min(100, (row[1] / 5000) * 100)}%` }} />}
                  <span className="text-mu-red mu-glow-red z-10">{Array.isArray(row) ? row[0].toFixed(3) : "---"}</span>
                  <span className="text-mu-text-dim group-hover:text-mu-text z-10">{Array.isArray(row) ? row[1].toLocaleString() : "---"}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-start mu-scrollbar overflow-y-auto pl-4">
               <div className="flex justify-between border-b border-mu-border pb-1 mb-2 text-mu-text-muted font-bold tracking-tighter uppercase text-[9px]">
                <span>Price (USD)</span>
                <span>Size</span>
              </div>
              {(bids.length > 0 ? bids : [...Array(20)]).map((row, i) => (
                <div key={i} className="flex justify-between py-1 px-2 hover:bg-mu-green/10 rounded-sm transition-colors group cursor-pointer relative overflow-hidden">
                  {Array.isArray(row) && <div className="absolute inset-0 bg-mu-green/5 origin-right animate-in slide-in-from-right-full duration-500" style={{ width: `${Math.min(100, (row[1] / 5000) * 100)}%` }} />}
                  <span className="text-mu-green mu-glow-green z-10">{Array.isArray(row) ? row[0].toFixed(3) : "---"}</span>
                  <span className="text-mu-text-dim group-hover:text-mu-text z-10">{Array.isArray(row) ? row[1].toLocaleString() : "---"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Execution & Alpha */}
        <div className="col-span-4 flex flex-col space-y-2">
          <div className="mu-panel p-3 flex-1">
             <div className="flex items-center space-x-2 mb-4">
              <Activity size={16} className="text-mu-green" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Market Execution</h2>
            </div>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                  <button className="bg-mu-green border border-mu-green/50 text-mu-bg text-[11px] font-black py-2.5 rounded hover:bg-green-400 transition-all uppercase shadow-lg shadow-mu-green/20">BUY / YES</button>
                  <button className="bg-mu-red border border-mu-red/50 text-mu-bg text-[11px] font-black py-2.5 rounded hover:bg-red-400 transition-all uppercase shadow-lg shadow-mu-red/20">SELL / NO</button>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between items-center"><label className="mu-stat-label">Quantity</label><span className="text-[9px] font-bold text-mu-cyan">MAX: 5.2K</span></div>
                  <input type="text" className="w-full mu-panel-high bg-transparent px-3 py-3 text-sm font-mono focus:outline-none focus:border-mu-cyan/50 focus:ring-1 focus:ring-mu-cyan/20 transition-all" placeholder="0.00" />
               </div>
               <div className="space-y-1">
                  <label className="mu-stat-label">Limit Price (USD)</label>
                  <div className="flex items-center space-x-2">
                    <input type="text" className="flex-1 mu-panel-high bg-transparent px-3 py-3 text-sm font-mono focus:outline-none focus:border-mu-cyan/50" placeholder="0.500" />
                    <button className="bg-mu-surface-high border border-mu-border-high px-4 py-3 text-[10px] font-black rounded hover:text-mu-cyan transition-colors">MID</button>
                  </div>
               </div>
               <button className="w-full bg-mu-cyan text-mu-bg text-[11px] font-black py-4 rounded shadow-lg shadow-mu-cyan/30 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-widest">Execute BOP Protocol</button>
            </div>
          </div>
          
          <div className="mu-panel p-3 h-48 flex flex-col">
             <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={16} className="text-mu-amber" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Alpha Monitor</h2>
            </div>
            <div className="flex-1 mu-scrollbar overflow-y-auto text-[10px] font-mono space-y-1 opacity-80">
               <div className="text-mu-green animate-in fade-in duration-500">[INFO] Arb Loop detected: POLY(0.58) vs KALSHI(0.61) | Spread: 3c</div>
               <div className="text-mu-text-muted">[10:24:02] Syncing tickers for US_ELECTIONS...</div>
               <div className="text-mu-amber">[WARN] Low liquidity on Kalshi:TRUMP_NO</div>
               <div className="text-mu-cyan">[TRADE] Bought 500 shares @ 0.585 (Polymarket)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = () => (
  <div className="flex-1 p-4 flex flex-col space-y-4 animate-in slide-in-from-right-2 duration-300">
    <div className="grid grid-cols-4 gap-4">
       {[
         { label: "Volume 24H", value: "$412.5M", change: "+12.4%", color: "text-mu-green" },
         { label: "Open Interest", value: "$1.2B", change: "+2.1%", color: "text-mu-cyan" },
         { label: "Daily Active", value: "14,291", change: "-0.5%", color: "text-mu-red" },
         { label: "Resolved Value", value: "$42.1B", change: "+5.1%", color: "text-mu-amber" }
       ].map((stat, i) => (
         <div key={i} className="mu-panel p-4 flex flex-col space-y-1 group hover:border-mu-cyan/30 transition-all cursor-crosshair">
            <span className="mu-stat-label group-hover:text-mu-cyan">{stat.label}</span>
            <div className="flex items-end justify-between">
               <span className="text-2xl font-black tracking-tight">{stat.value}</span>
               <span className={`${stat.color} text-[10px] font-black bg-current/10 px-1.5 py-0.5 rounded border border-current/20`}>{stat.change}</span>
            </div>
         </div>
       ))}
    </div>
    
    <div className="flex-1 mu-panel flex flex-col p-4 relative overflow-hidden">
       <div className="flex items-center justify-between mb-8">
          <div className="font-black italic text-mu-text-muted opacity-50 uppercase tracking-tighter">Market Volatility Index (MVI)</div>
          <div className="flex items-center space-x-1 bg-mu-surface-high p-0.5 rounded-md border border-mu-border">
             {["5M", "1H", "1D", "1W", "1M"].map(r => (
               <button key={r} className={`px-4 py-1.5 rounded text-[10px] font-black transition-all ${r === '1D' ? 'bg-mu-red text-white' : 'text-mu-text-muted hover:text-mu-text'}`}>{r}</button>
             ))}
          </div>
       </div>
       <div className="flex-1 border-b border-l border-mu-border-high relative">
          <svg className="absolute bottom-0 left-0 w-full h-full p-8" viewBox="0 0 1000 400" preserveAspectRatio="none">
             <path className="animate-in fade-in slide-in-from-left duration-1000" d="M0,350 L100,320 L200,340 L300,280 L400,220 L500,250 L600,180 L700,200 L800,120 L900,140 L1000,50" fill="none" stroke="var(--color-mu-cyan)" strokeWidth="3" />
             <path className="opacity-20" d="M0,300 L100,280 L200,290 L300,310 L400,340 L500,320 L600,300 L700,330 L800,310 L900,280 L1000,250" fill="none" stroke="var(--color-mu-red)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
       </div>
    </div>
  </div>
);

// --- Main App Component ---

function App() {
  const [command, setCommand] = useState("");
  const { isConnected, lastUpdate, sendCommand } = useBopBridge();
  const { activeView, setActiveView, toggleCommandPalette, isCommandPaletteOpen } = useTerminalStore();

  // Keyboard Shortcuts (Snappiness)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K: Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      // ESC: Close Palette
      if (e.key === "Escape" && isCommandPaletteOpen) {
         toggleCommandPalette();
      }
      // Alt + [1-7]: View Switching
      if (e.altKey && e.key >= "1" && e.key <= "7") {
        const views: AppView[] = ["Discover", "Trade", "News", "Analytics", "Top Traders", "Arbitrage", "Portfolio"];
        setActiveView(views[parseInt(e.key) - 1]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveView, toggleCommandPalette, isCommandPaletteOpen]);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    sendCommand(command);
    setCommand("");
  };

  return (
    <div className="h-screen flex flex-col bg-mu-bg text-mu-text overflow-hidden selection:bg-mu-cyan/30">
      <CommandPalette />

      {/* Primary Header */}
      <header className="flex items-center justify-between px-4 border-b border-mu-border h-14 bg-mu-surface z-50">
        <div className="flex items-center space-x-12">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setActiveView("Trade")}>
            <Zap size={22} className="text-mu-red mu-glow-red fill-mu-red group-hover:scale-110 transition-transform" />
            <span className="font-black text-xl tracking-tighter uppercase italic">μTerminal</span>
            <span className="bg-mu-red/10 text-mu-red text-[8px] font-black px-1.5 py-0.5 rounded border border-mu-red/20 ml-2 tracking-widest">BOP_CORE_v1.2</span>
          </div>
          <nav className="flex items-center space-x-6 h-full font-black text-[10px] uppercase tracking-[0.1em]">
            {(["Discover", "Trade", "News", "Analytics", "Top Traders", "Arbitrage", "Portfolio"] as AppView[]).map((tab, i) => (
              <NavItem key={tab} name={tab} index={i} />
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-4 text-[9px] font-black uppercase text-mu-text-muted">
             <div className="flex items-center space-x-1.5"><Activity size={12} className="text-mu-cyan" /> <span>LATENCY: 12ms</span></div>
             <div className="flex items-center space-x-1.5"><Shield size={12} className="text-mu-green" /> <span>RISK: NOMINAL</span></div>
          </div>
          <div className="flex items-center space-x-1">
             <button className="p-2 text-mu-text-muted hover:text-mu-text transition-colors"><Settings size={18} /></button>
             <button className="p-2 text-mu-text-muted hover:text-mu-text transition-colors" onClick={toggleCommandPalette}><Command size={18} /></button>
          </div>
          <button className="bg-mu-red hover:bg-red-600 text-white text-[11px] font-black px-6 py-2 rounded-sm transition-all transform active:scale-95 shadow-lg shadow-mu-red/30 uppercase tracking-tighter">
            Engine Auth
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         {/* Sub-Nav / Venue Filters */}
         <div className="flex items-center px-4 py-2 bg-mu-surface/30 space-x-2 overflow-x-auto no-scrollbar border-b border-mu-border min-h-[44px]">
            {["Aggregator", "Kalshi", "Polymarket", "PredictIt", "Limitless", "Opinion", "Rain", "Overtime"].map(f => (
              <MarketFilterBtn key={f} name={f} />
            ))}
         </div>

         {/* Layout Split: Sidebar + Content */}
         <div className="flex-1 flex overflow-hidden">
            {/* Context Sidebar (Changes based on view) */}
            <aside className="w-80 border-r border-mu-border bg-mu-bg p-4 flex flex-col space-y-6 mu-scrollbar overflow-y-auto">
               <div className="space-y-1">
                  <span className="mu-stat-label">Aggregated Open Interest</span>
                  <div className="text-3xl font-black tracking-tighter text-mu-red italic">$668,432,192</div>
               </div>

               <div className="mu-panel-high p-4 space-y-5 border-l-4 border-l-mu-green">
                  <div className="flex items-center justify-between border-b border-mu-border-high pb-3">
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 bg-mu-green rounded-md flex items-center justify-center text-[10px] font-black text-mu-bg">K</div>
                       <span className="font-black text-xs tracking-widest uppercase">Kalshi.com</span>
                    </div>
                    <ExternalLink size={12} className="text-mu-text-muted" />
                  </div>
                  
                  <div className="space-y-3">
                    {[
                       { label: "Notional Vol", val: "$81.1B" },
                       { label: "Total Transactions", val: "457.5M" },
                       { label: "Active Nodes", val: "128" }
                    ].map((stat, i) => (
                       <div key={i} className="flex justify-between items-center group">
                          <span className="mu-stat-label group-hover:text-mu-text-dim transition-colors">{stat.label}</span>
                          <span className="font-bold text-xs tabular-nums tracking-tight">{stat.val}</span>
                       </div>
                    ))}
                  </div>
               </div>

               <div className="mu-panel-high p-4 space-y-2">
                  <span className="mu-stat-label">Network Status</span>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-mu-text-muted uppercase">BOP Engine</span>
                     <span className="text-mu-green font-black text-[10px] uppercase">STABLE</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-mu-text-muted uppercase">Data Stream</span>
                     <span className="text-mu-cyan font-black text-[10px] uppercase">ENCRYPTED</span>
                  </div>
               </div>
            </aside>

            {/* Viewport */}
            <section className="flex-1 flex flex-col min-w-0 bg-mu-bg overflow-hidden relative">
               {activeView === "Trade" && <TradeView lastUpdate={lastUpdate} />}
               {activeView === "Discover" && <MarketTable />}
               {activeView === "News" && <NewsFeed />}
               {activeView === "Analytics" && <AnalyticsView />}
               {(activeView === "Portfolio" || activeView === "Top Traders" || activeView === "Arbitrage") && (
                 <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-40 animate-pulse">
                    <Activity size={64} className="text-mu-red" />
                    <div className="flex flex-col items-center">
                       <div className="font-black uppercase tracking-[0.6em] text-2xl italic">KERNEL_RESTRICTED</div>
                       <div className="font-mono text-xs mt-2 uppercase tracking-widest text-mu-cyan">Elevated BOP permissions required to access {activeView} module</div>
                    </div>
                 </div>
               )}
            </section>
         </div>
      </main>

      {/* Persistent Industrial Footer */}
      <footer className="h-10 border-t border-mu-border bg-mu-surface flex items-center justify-between px-4 z-[60] shadow-2xl">
         <div className="flex items-center space-x-8 h-full text-[10px] font-black uppercase tracking-widest italic">
            <button className="flex items-center space-x-2 text-mu-text-muted hover:text-mu-cyan transition-colors">
               <Wallet size={12} />
               <span>Asset Manager</span>
            </button>
            <button className="flex items-center space-x-2 text-mu-text-muted hover:text-mu-amber transition-colors">
               <Gavel size={12} />
               <span>Resolution</span>
            </button>
            <button className="flex items-center space-x-2 text-mu-red mu-glow-red" onClick={() => setActiveView("News")}>
               <Radio size={12} />
               <span className="border-b-2 border-mu-red/50">Terminal Squawk</span>
            </button>
         </div>

         {/* BOP Command Interface */}
         <div className="flex-1 max-w-3xl px-12 h-full">
            <form onSubmit={handleDispatch} className="flex items-center h-full space-x-4 border-x border-mu-border px-6 group bg-mu-bg/20">
              <span className="text-mu-cyan font-black text-xs italic tracking-tighter group-focus-within:text-mu-red transition-colors shrink-0">μT_CMD&gt;</span>
              <input
                id="main-cmd-input"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="ENTER BOP EXECUTION STRING... (CMD+K FOR OPTIONS)"
                className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold text-mu-cyan focus:text-mu-red placeholder:text-mu-text-muted/20 uppercase tracking-widest"
              />
              <div className="flex items-center space-x-3 text-[8px] font-black text-mu-text-muted opacity-40 uppercase shrink-0">
                 <div className="flex items-center space-x-1"><Command size={10} /> <span>K</span></div>
                 <div className="w-px h-3 bg-mu-border" />
                 <span>DISPATCH</span>
              </div>
            </form>
         </div>

         <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-mu-green mu-glow-green' : 'text-mu-red mu-glow-red'}`}>
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-mu-green animate-pulse' : 'bg-mu-red'}`} />
               <span>{isConnected ? 'STABLE_NODE' : 'OFFLINE_LINK'}</span>
            </div>
            <div className="flex items-center space-x-4 text-mu-text-muted border-l border-mu-border pl-6">
               <Settings size={14} className="hover:text-mu-cyan cursor-pointer transition-colors" />
               <ExternalLink size={14} className="hover:text-mu-cyan cursor-pointer transition-colors" />
            </div>
         </div>
      </footer>
    </div>
  );
}

export default App;
