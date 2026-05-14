import { useState } from "react";
import { Terminal, Activity, BarChart3, TrendingUp, Shield, Zap } from "lucide-react";
import "./App.css";

function App() {
  const [command, setCommand] = useState("");

  return (
    <div className="h-screen flex flex-col p-2 space-y-2 select-none">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-2 mu-panel border-mu-cyan/20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-mu-cyan mu-glow">
            <Zap size={20} className="fill-mu-cyan" />
            <span className="font-bold tracking-tighter text-xl">MUTerminal</span>
          </div>
          <nav className="flex items-center space-x-6 text-xs font-medium uppercase tracking-widest text-mu-dim">
            <a href="#" className="text-mu-text hover:text-mu-cyan transition-colors">Markets</a>
            <a href="#" className="hover:text-mu-cyan transition-colors">Portfolio</a>
            <a href="#" className="hover:text-mu-cyan transition-colors">BOP Scripts</a>
            <a href="#" className="hover:text-mu-cyan transition-colors">Settings</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4 text-[10px] uppercase font-bold tracking-tighter">
          <div className="flex items-center space-x-1 text-mu-green">
            <div className="w-1.5 h-1.5 bg-mu-green rounded-full animate-pulse" />
            <span>BOP Engine Active</span>
          </div>
          <div className="flex items-center space-x-1 text-mu-dim">
            <Shield size={12} />
            <span>Risk Gates: OK</span>
          </div>
          <div className="px-2 py-0.5 bg-mu-border text-mu-text rounded-sm">
            v0.1.0-alpha
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-12 gap-2 overflow-hidden">
        {/* Left Column: Aggregated Depth */}
        <section className="col-span-8 flex flex-col space-y-2">
          <div className="flex-1 mu-panel p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 size={16} className="text-mu-cyan" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Unified Order Book</h2>
              </div>
              <div className="text-[10px] text-mu-dim font-mono">MU:TRUMP_WIN_2024</div>
            </div>
            
            {/* Mock Order Book */}
            <div className="flex-1 grid grid-cols-2 gap-4 font-mono text-xs overflow-hidden">
              {/* ASKS (Sellers) */}
              <div className="flex flex-col-reverse justify-end mu-scrollbar overflow-y-auto">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-mu-red/5 group">
                    <span className="text-mu-red mu-glow">{(0.62 + i * 0.001).toFixed(3)}</span>
                    <span className="text-mu-dim group-hover:text-mu-text">{(Math.random() * 5000).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              {/* BIDS (Buyers) */}
              <div className="flex flex-col justify-start mu-scrollbar overflow-y-auto">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-mu-green/5 group">
                    <span className="text-mu-green mu-glow">{(0.61 - i * 0.001).toFixed(3)}</span>
                    <span className="text-mu-dim group-hover:text-mu-text">{(Math.random() * 5000).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Middle: Activity/Arb Scanner */}
          <div className="h-40 mu-panel p-3 overflow-hidden flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={16} className="text-mu-amber" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Alpha Monitor</h2>
            </div>
            <div className="flex-1 overflow-y-auto text-[10px] font-mono space-y-1 mu-scrollbar">
              <div className="text-mu-green">[INFO] Arb Loop detected: POLY(0.58) vs KALSHI(0.61) | Spread: 3c</div>
              <div className="text-mu-dim">[10:24:02] Syncing tickers for US_ELECTIONS...</div>
              <div className="text-mu-amber">[WARN] Low liquidity on Kalshi:TRUMP_NO</div>
              <div className="text-mu-cyan">[TRADE] Bought 500 shares @ 0.585 (Polymarket)</div>
            </div>
          </div>
        </section>

        {/* Right Column: Positions & Watchlist */}
        <section className="col-span-4 flex flex-col space-y-2">
          <div className="flex-1 mu-panel p-3">
            <div className="flex items-center space-x-2 mb-4">
              <Activity size={16} className="text-mu-green" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Active Positions</h2>
            </div>
            <div className="space-y-3">
              <div className="p-2 bg-mu-bg border border-mu-border/50 rounded-sm">
                <div className="flex justify-between text-[10px] font-bold text-mu-dim mb-1">
                  <span>TRUMP_WIN</span>
                  <span className="text-mu-green">+12.4%</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>5,200 @ 0.54</span>
                  <span className="text-mu-green">+$416.00</span>
                </div>
              </div>
              <div className="p-2 bg-mu-bg border border-mu-border/50 rounded-sm">
                <div className="flex justify-between text-[10px] font-bold text-mu-dim mb-1">
                  <span>FED_HIKE_JUN</span>
                  <span className="text-mu-red">-2.1%</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span>1,000 @ 0.12</span>
                  <span className="text-mu-red">-$2.52</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BOP Command Line */}
      <footer className="mu-panel bg-mu-bg border-mu-cyan/30 flex items-center px-4 py-2 space-x-4">
        <Terminal size={18} className="text-mu-cyan mu-glow" />
        <span className="text-mu-cyan font-bold font-mono text-sm leading-none pt-0.5 mr-2">μT&gt;</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="ENTER BOP COMMAND OR SCRIPT..."
          className="flex-1 bg-transparent border-none outline-none text-mu-cyan font-mono text-sm placeholder:text-mu-dim/50 uppercase"
          autoFocus
        />
        <div className="text-[10px] text-mu-dim font-bold tracking-widest">
          PRESS [ENTER] TO DISPATCH
        </div>
      </footer>
    </div>
  );
}

export default App;
