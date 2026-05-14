import { useState, useEffect } from "react";
import { 
  Terminal, Activity, BarChart3, TrendingUp, Shield, Zap, Search, 
  Bell, Settings, ChevronDown, Filter, Info, ListFilter, Wallet,
  Newspaper, Gavel, Radio, MessageSquare, ExternalLink, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useBopBridge } from "./hooks/useBopBridge";
import "./App.css";

function App() {
  const [command, setCommand] = useState("");
  const { isConnected, lastUpdate, sendCommand } = useBopBridge();
  const [activeTab, setActiveTab] = useState("Analytics");
  const [marketFilter, setMarketFilter] = useState("Kalshi");

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    sendCommand(command);
    setCommand("");
  };

  const markets = [
    { name: "Kalshi", openInterest: "$668.43M", tvl: "-", notional7D: "$4.13B", volume30D: "$5.64B", users: "457.5M", color: "text-mu-green" },
    { name: "Polymarket", openInterest: "$444.34M", tvl: "$462.83M", notional7D: "$1.57B", volume30D: "$4.03B", users: "2.72M+", color: "text-mu-cyan" },
    { name: "PredictIt", openInterest: "$13.65M", tvl: "$13.97M", notional7D: "$170.63M", volume30D: "$139.33K", users: "90.00K", color: "text-blue-500" },
    { name: "Opinion", openInterest: "$8.12M", tvl: "$13.97M", notional7D: "$105.54M", volume30D: "$149.92K", users: "245.3K", color: "text-orange-500" },
    { name: "ForecastEx", openInterest: "$6.23M", tvl: "-", notional7D: "$5.87M", volume30D: "$296.76K", users: "3.9M", color: "text-mu-red" },
  ];

  return (
    <div className="h-screen flex flex-col bg-mu-bg text-mu-text overflow-hidden">
      {/* Primary Header */}
      <header className="flex items-center justify-between px-4 border-b border-mu-border h-14 bg-mu-surface/50 backdrop-blur-md z-10">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Zap size={22} className="text-mu-red mu-glow-red fill-mu-red" />
            <span className="font-black text-lg tracking-tighter uppercase italic">MUTerminal</span>
            <span className="bg-mu-red/10 text-mu-red text-[9px] font-bold px-1.5 py-0.5 rounded border border-mu-red/20 ml-1">BETA</span>
          </div>
          <nav className="flex items-center space-x-6 h-full font-medium text-[11px] uppercase tracking-wider">
            {["Discover", "Trade", "News", "Analytics", "Top Traders", "Arbitrage", "Portfolio"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "mu-tab-active" : "mu-tab-inactive"}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mu-text-muted group-focus-within:text-mu-cyan transition-colors" />
            <input 
              type="text" 
              placeholder="Search markets..." 
              className="bg-mu-surface border border-mu-border rounded-full py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:border-mu-cyan/50 focus:ring-1 focus:ring-mu-cyan/20 transition-all"
            />
          </div>
          <button className="p-2 text-mu-text-muted hover:text-mu-text transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-mu-red rounded-full ring-2 ring-mu-bg" />
          </button>
          <button className="bg-mu-red hover:bg-red-600 text-white text-[11px] font-bold px-4 py-1.5 rounded transition-all transform active:scale-95 shadow-lg shadow-mu-red/10">
            Sign in
          </button>
        </div>
      </header>

      {/* Sub-Header / Filters */}
      <div className="flex items-center px-4 py-2 border-b border-mu-border bg-mu-surface/30 space-x-2 overflow-x-auto no-scrollbar">
        {["Aggregator", "All Markets", "Kalshi", "Polymarket", "Opinion", "Predict", "Limitless", "SX Bet", "Probable", "Rain", "Forkast", "Gemini", "Overtime"].map(filter => (
          <button 
            key={filter}
            onClick={() => setMarketFilter(filter)}
            className={`px-3 py-1 rounded text-[10px] font-bold tracking-tight transition-all border ${
              marketFilter === filter 
              ? "bg-mu-surface-high border-mu-border-high text-mu-text shadow-sm" 
              : "border-transparent text-mu-text-muted hover:text-mu-text hover:bg-mu-surface/50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Key Metrics */}
        <aside className="w-72 border-r border-mu-border bg-mu-surface/20 flex flex-col p-4 space-y-6 mu-scrollbar overflow-y-auto">
          <div className="space-y-1">
            <span className="mu-stat-label">Open Interest</span>
            <div className="text-3xl font-bold tracking-tight text-mu-red">$668.4M</div>
          </div>

          <div className="mu-panel-high p-4 space-y-4">
            <div className="flex items-center space-x-2 border-b border-mu-border-high pb-3 mb-3">
              <div className="w-6 h-6 bg-mu-green rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm">K</div>
              <span className="font-bold text-sm tracking-tight">Kalshi</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="mu-stat-label flex items-center gap-1">Notional Volume <ChevronDown size={10} /></span>
                <span className="font-bold text-sm">$81.1B</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="mu-stat-label flex items-center gap-1">Total Volume <ChevronDown size={10} /></span>
                <span className="font-bold text-sm">$155.0B</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="mu-stat-label flex items-center gap-1">Transactions <ChevronDown size={10} /></span>
                <span className="font-bold text-sm">457.5M</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="mu-stat-label">Users</span>
                <span className="text-mu-text-muted text-xs">—</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="mu-stat-label">Revenue</span>
                <span className="text-mu-text-muted text-xs">—</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
             <button className="w-full mu-panel-high py-2 px-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-mu-border transition-colors">
                <Filter size={12} /> Apply Filter
             </button>
          </div>
        </aside>

        {/* Content View */}
        <section className="flex-1 flex flex-col min-w-0 bg-mu-bg/50 overflow-hidden">
          {/* Top Analytics Panel */}
          <div className="p-4 flex flex-col space-y-4 min-h-[350px]">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <button className="mu-panel-high p-1.5 text-mu-text-muted hover:text-mu-text transition-colors"><ListFilter size={16} /></button>
                   <div className="flex items-center space-x-1 bg-mu-red/10 border border-mu-red/20 px-2 py-1 rounded text-[10px] font-bold text-mu-red">
                      <div className="w-1.5 h-1.5 bg-mu-red rounded-full mr-1 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                      Notional Volume <span className="text-mu-text ml-1 opacity-50">×</span>
                   </div>
                </div>
                <div className="flex items-center space-x-1 bg-mu-surface p-0.5 rounded-md border border-mu-border">
                   {["1M", "3M", "6M", "1Y", "All"].map(range => (
                      <button 
                        key={range} 
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${range === 'All' ? 'bg-mu-red text-white' : 'text-mu-text-muted hover:text-mu-text'}`}
                      >
                        {range}
                      </button>
                   ))}
                </div>
             </div>

             {/* Mock Chart Area */}
             <div className="flex-1 mu-panel border-dashed border-mu-border-high relative flex flex-col items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-mu-red/5 to-transparent opacity-50"></div>
                
                {/* Visualizing a mock curve with SVG */}
                <svg className="absolute bottom-0 left-0 w-full h-48 pointer-events-none" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <path 
                    d="M0,180 Q100,170 200,160 T400,120 T600,150 T800,80 T1000,20" 
                    fill="none" 
                    stroke="var(--color-mu-red)" 
                    strokeWidth="3" 
                    className="mu-glow-red"
                  />
                  <path 
                    d="M0,180 Q100,170 200,160 T400,120 T600,150 T800,80 T1000,20 V200 H0 Z" 
                    fill="url(#gradient)" 
                    className="opacity-10"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-mu-red)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="z-10 flex flex-col items-center text-mu-text-muted group-hover:text-mu-text transition-colors">
                   <div className="text-4xl font-black italic opacity-5 border-b-4 border-current mb-2">μTERMINAL</div>
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Predictive Engine: Aggregating Signal...</span>
                </div>

                {/* Legend/Price Tags */}
                <div className="absolute top-8 left-8 space-y-1">
                   <div className="text-mu-text-muted text-[10px] font-bold">$1.0B</div>
                   <div className="text-mu-text-muted text-[10px] font-bold">$800.0M</div>
                   <div className="text-mu-text-muted text-[10px] font-bold">$600.0M</div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-around px-8">
                   {["2022", "2023", "2024", "2025", "2026"].map(year => (
                      <span key={year} className="text-mu-text-muted text-[10px] font-bold">{year}</span>
                   ))}
                </div>
             </div>
          </div>

          {/* Market Comparison Table */}
          <div className="flex-1 overflow-hidden flex flex-col border-t border-mu-border">
             <div className="grid grid-cols-10 text-[10px] font-black uppercase tracking-wider text-mu-text-muted px-4 py-3 bg-mu-surface/50 border-b border-mu-border">
                <div className="col-span-2">Name</div>
                <div className="text-right flex items-center justify-end gap-1">Open Interest <ChevronDown size={10} /></div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> TVL</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Notional 7D</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Notional 30D</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Volume 7D</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Volume 30D</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Revenue 30D</div>
                <div className="text-right flex items-center justify-end gap-1"><ArrowUpRight size={10} /> Users</div>
             </div>

             <div className="flex-1 overflow-y-auto mu-scrollbar bg-mu-bg/20">
                {markets.map((m, i) => (
                  <div key={i} className="grid grid-cols-10 text-[11px] font-bold px-4 py-3.5 border-b border-mu-border/30 hover:bg-mu-surface/40 transition-colors group cursor-pointer">
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] text-white bg-current ${m.color.replace('text-', 'bg-')}`}>{m.name[0]}</div>
                      <span className="group-hover:text-mu-cyan transition-colors">{m.name}</span>
                    </div>
                    <div className="text-right tabular-nums">{m.openInterest}</div>
                    <div className="text-right tabular-nums text-mu-text-muted">{m.tvl}</div>
                    <div className="text-right tabular-nums">{m.notional7D}</div>
                    <div className="text-right tabular-nums text-mu-text-muted">—</div>
                    <div className="text-right tabular-nums text-mu-text-muted">—</div>
                    <div className="text-right tabular-nums">{m.volume30D}</div>
                    <div className="text-right tabular-nums text-mu-text-muted">—</div>
                    <div className="text-right tabular-nums">{m.users}</div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </main>

      {/* Persistent Multi-Functional Footer */}
      <footer className="h-10 border-t border-mu-border bg-mu-surface flex items-center justify-between px-4 z-20">
         <div className="flex items-center space-x-6 h-full text-[10px] font-black uppercase tracking-wider">
            <button className="flex items-center space-x-2 text-mu-text-muted hover:text-mu-text transition-colors">
               <Wallet size={12} className="text-mu-cyan" />
               <span>Wallet Tracker</span>
            </button>
            <button className="flex items-center space-x-2 text-mu-text-muted hover:text-mu-text transition-colors">
               <Gavel size={12} className="text-mu-amber" />
               <span>Disputes</span>
            </button>
            <button className="flex items-center space-x-2 text-mu-text group">
               <Newspaper size={12} className="text-mu-red group-hover:scale-110 transition-transform" />
               <span className="border-b border-mu-red/50 pb-0.5">News Feed</span>
            </button>
         </div>

         {/* BOP Command Interface Integrated into Footer */}
         <div className="flex-1 max-w-2xl px-8 h-full">
            <form onSubmit={handleDispatch} className="flex items-center h-full space-x-3 border-x border-mu-border px-4">
              <span className="text-mu-red font-black text-xs italic tracking-tighter mu-glow-red">μT_CMD:</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="ENTER BOP EXECUTION STRING..."
                className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold text-mu-red placeholder:text-mu-text-muted/30 uppercase tracking-tight"
              />
              <div className="flex items-center space-x-2 text-[8px] font-black text-mu-text-muted opacity-50 uppercase">
                 <span className="bg-mu-border px-1 rounded">ENTER</span>
                 <span>DISPATCH</span>
              </div>
            </form>
         </div>

         <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-mu-green' : 'text-mu-red'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-mu-green mu-glow-green animate-pulse' : 'bg-mu-red mu-glow-red'}`} />
               <span>{isConnected ? 'STABLE' : 'OFFLINE'}</span>
            </div>
            <div className="flex items-center space-x-3 text-mu-text-muted">
               <Radio size={12} className="hover:text-mu-cyan cursor-pointer" />
               <MessageSquare size={12} className="hover:text-mu-cyan cursor-pointer" />
               <ExternalLink size={12} className="hover:text-mu-cyan cursor-pointer" />
            </div>
         </div>
      </footer>
    </div>
  );
}

export default App;
