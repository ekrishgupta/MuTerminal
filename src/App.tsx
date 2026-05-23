import { useState, useEffect } from "react";
import { 
  Settings, 
  Search, 
  Filter, 
  Bookmark, 
  TrendingUp, 
  Target
} from "lucide-react";
import { useTerminalStore } from "./store/useTerminalStore";
import { useBopBridge } from "./hooks/useBopBridge";
import { useMockMarket } from "./hooks/useMockMarket";
import { CryptoKeyVault } from "./utils/CryptoKeyVault";

import { NewsFeed } from "./components/NewsFeed";
import { OrderBook } from "./components/OrderBook";
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

const NavItem = ({ name, active, onClick, disabled }: { name: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
  <button 
    disabled={disabled}
    onClick={onClick}
    className={`mu-nav-item ${active ? 'mu-nav-item-active' : ''} ${disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
  >
    {name}
  </button>
);

const PriceTicker = ({ symbol, price, change }: { symbol: string, price: string, change: string }) => {
  const isPositive = change.startsWith("+");
  return (
    <div className="flex items-center gap-1.5 px-3 border-l border-mu-border text-[11px] font-semibold">
      <span className="text-mu-text-dim uppercase">{symbol}</span>
      <span className="text-mu-text-bright tabular-nums">{price}</span>
      <span className={isPositive ? "text-mu-green" : "text-mu-red"}>{change}</span>
    </div>
  );
};

const PredictCard = ({ title, options, vol, time, icon }: { title: string, options: { label: string, prob: string }[], vol: string, time: string, icon: string }) => (
  <div className="mu-card flex flex-col gap-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-mu-surface-high flex items-center justify-center text-xl">
          {icon}
        </div>
        <h3 className="text-[15px] font-bold text-mu-text-bright leading-tight">{title}</h3>
      </div>
      <Bookmark size={18} className="text-mu-text-dim hover:text-mu-text-bright cursor-pointer" />
    </div>
    
    <div className="flex flex-col gap-2 mt-1">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center justify-between group">
          <span className="text-[13px] font-medium text-mu-text">{opt.label}</span>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-bold text-mu-text-bright tabular-nums">{opt.prob}</span>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="mu-btn-yes text-[11px] px-3 py-1">Yes</button>
              <button className="mu-btn-no text-[11px] px-3 py-1">No</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-mu-border">
      <div className="flex items-center gap-3 text-[11px] font-medium text-mu-text-dim">
        <span>{vol} Vol.</span>
        <span>•</span>
        <span>{time}</span>
      </div>
      <div className="flex gap-2">
        <button className="mu-btn-yes text-[11px] px-4 py-1.5 opacity-100 group-hover:opacity-0 transition-opacity">Yes</button>
        <button className="mu-btn-no text-[11px] px-4 py-1.5 opacity-100 group-hover:opacity-0 transition-opacity">No</button>
      </div>
    </div>
  </div>
);

const PredictView = () => (
  <div className="flex-1 flex flex-col overflow-hidden bg-mu-bg">
    <div className="px-6 py-4 flex items-center gap-4 border-b border-mu-border">
      <div className="flex items-center gap-1.5 text-mu-blue font-bold px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
        <TrendingUp size={16} />
        <span>Trending</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["Politics", "Sports", "Crypto", "Finance", "Geopolitics", "Earnings", "Tech", "Culture", "World", "Econo", "Climate"].map(cat => (
          <button key={cat} className="mu-pill whitespace-nowrap">{cat}</button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mu-text-dim" />
          <input 
            type="text" 
            placeholder="Search events..."
            className="bg-mu-surface-low border border-mu-border rounded-full py-1.5 pl-9 pr-4 text-[13px] w-64 focus:outline-none focus:border-mu-text-dim transition-colors"
          />
        </div>
        <button className="p-2 rounded-full border border-mu-border text-mu-text-dim hover:text-mu-text-bright"><Filter size={18} /></button>
        <button className="p-2 rounded-full border border-mu-border text-mu-text-dim hover:text-mu-text-bright"><Bookmark size={18} /></button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PredictCard 
          title="2026 FIFA World Cup Winner" 
          icon="⚽️"
          options={[
            { label: "Spain", prob: "17%" },
            { label: "New Zealand", prob: "<1%" }
          ]} 
          vol="$23.6M" 
          time="2y" 
        />
        <PredictCard 
          title="US x Iran permanent peace deal by...?" 
          icon="🇮🇷"
          options={[
            { label: "April 22", prob: "<1%" },
            { label: "April 30", prob: "<1%" }
          ]} 
          vol="$93.9M" 
          time="7mo" 
        />
        <PredictCard 
          title="Iran ceasefire continues through...?" 
          icon="🕊️"
          options={[
            { label: "May 20", prob: "100%" },
            { label: "May 27", prob: "91%" }
          ]} 
          vol="$12.7M" 
          time="4d" 
        />
        <PredictCard 
          title="Iran closes its airspace by...?" 
          icon="🇮🇷"
          options={[
            { label: "May 8", prob: "<1%" },
            { label: "May 31", prob: "26%" }
          ]} 
          vol="$23.8M" 
          time="7d" 
        />
         <PredictCard 
          title="Democratic Presidential Nominee 2028" 
          icon="🇺🇸"
          options={[
            { label: "Stephen A. Smith", prob: "1%" },
            { label: "Gretchen Whitmer", prob: "1%" }
          ]} 
          vol="$2.3M" 
          time="2y" 
        />
        <PredictCard 
          title="2026 NBA Champion" 
          icon="🏆"
          options={[
            { label: "Oklahoma City Thunder", prob: "65%" },
            { label: "Houston Rockets", prob: "<1%" }
          ]} 
          vol="$321.2M" 
          time="38d" 
        />
      </div>
    </div>
  </div>
);

function App() {
  const { activeView, setActiveView } = useTerminalStore();
  const { isConnected } = useBopBridge();
  const marketData = useMockMarket();
  const [hasKeys, setHasKeys] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKeys = async () => {
      const poly = await CryptoKeyVault.getKey("POLY");
      const kalshi = await CryptoKeyVault.getKey("KALSHI");
      setHasKeys(!!(poly || kalshi));
    };
    checkKeys();
    const handleRefresh = () => checkKeys();
    window.addEventListener("mu-refresh-keys", handleRefresh);
    return () => window.removeEventListener("mu-refresh-keys", handleRefresh);
  }, []);

  useEffect(() => {
    if (hasKeys === false && activeView !== "Settings") {
      setActiveView("Settings");
    }
  }, [hasKeys, activeView, setActiveView]);

  return (
    <div className="h-screen flex flex-col bg-mu-bg text-mu-text">
      {/* Liquid Header */}
      <header className="h-14 border-b border-mu-border flex items-center justify-between px-4 shrink-0 z-50 bg-mu-bg">
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("Trade")}>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
               <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            <span className="font-bold text-[18px] tracking-tight text-mu-text-bright">Liquid</span>
          </div>
          <nav className="flex items-center h-full">
            <NavItem name="Trade" active={activeView === "Trade"} onClick={() => setActiveView("Trade")} disabled={hasKeys === false} />
            <NavItem name="Predict" active={activeView === "Predict" || activeView === "Discover"} onClick={() => setActiveView("Predict")} disabled={hasKeys === false} />
            <NavItem name="Leaderboard" active={activeView === "Top Traders"} onClick={() => setActiveView("Top Traders")} disabled={hasKeys === false} />
            <NavItem name="Points" active={activeView === "Analytics"} onClick={() => setActiveView("Analytics")} disabled={hasKeys === false} />
            <NavItem name="Vault" active={activeView === "Portfolio"} onClick={() => setActiveView("Portfolio")} disabled={hasKeys === false} />
            <NavItem name="Referral" active={false} onClick={() => {}} disabled={hasKeys === false} />
          </nav>
        </div>

        <div className="flex items-center h-full">
          <div className="hidden xl:flex items-center h-full mr-4">
            <PriceTicker symbol="GOLD" price="4,503.8" change="-2.43%" />
            <PriceTicker symbol="EURUSD" price="1.1571" change="-0.01%" />
            <PriceTicker symbol="NDX" price="18,432" change="-1.36%" />
            <PriceTicker symbol="OPENAI" price="912.91" change="-0.13%" />
            <PriceTicker symbol="BTC" price="70,351" change="+0.07%" />
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-mu-border">
            <button className="p-1.5 text-mu-text-dim hover:text-mu-text-bright"><Search size={18} /></button>
            <button className="p-1.5 text-mu-text-dim hover:text-mu-text-bright" onClick={() => setActiveView("Settings")}><Settings size={18} /></button>
            <button className="bg-white text-black font-bold px-4 py-1.5 rounded-md text-[13px] ml-2">Log in</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Only show sidebar in Trade view or if keys missing */}
        {(activeView === "Trade" || hasKeys === false) && (
          <aside className="w-64 flex flex-col shrink-0 border-r border-mu-border bg-mu-surface-low">
            <div className="p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="mu-label">System Status</div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-mu-text">BOP Engine</span>
                  <span className={`text-[12px] font-bold ${isConnected ? 'text-mu-green' : 'text-mu-yellow'}`}>
                    {isConnected ? "ONLINE" : "STANDBY"}
                  </span>
                </div>
              </div>

              {!hasKeys && (
                <div className="p-4 rounded-xl border border-dashed border-mu-border-high bg-mu-surface-high/30 flex flex-col gap-3">
                  <div className="text-[12px] font-bold text-mu-yellow">Setup Required</div>
                  <p className="text-[11px] leading-relaxed text-mu-text-dim">Connect exchange API keys to initialize universal liquidity.</p>
                  <button 
                    onClick={() => setActiveView("Settings")}
                    className="w-full bg-mu-blue text-white font-bold py-2 rounded-lg text-[12px]"
                  >
                    Configure Keys
                  </button>
                </div>
              )}

              {hasKeys && activeView === "Trade" && (
                <div className="flex flex-col gap-4">
                  <div className="mu-label">Venue Selection</div>
                  <div className="flex flex-col gap-1">
                    {["Aggregated", "Polymarket", "Kalshi"].map((v, i) => (
                      <button key={v} className={`text-left px-3 py-2 rounded-lg text-[13px] font-medium ${i === 0 ? 'bg-mu-surface-high text-mu-text-bright' : 'text-mu-text-dim hover:text-mu-text-bright'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto p-4 border-t border-mu-border">
               <div className="mu-label mb-1">Portfolio Value</div>
               <div className="text-[18px] font-bold text-mu-text-bright tabular-nums">$0.00</div>
            </div>
          </aside>
        )}

        <section className="flex-1 flex flex-col overflow-hidden">
          {hasKeys === false && activeView !== "Settings" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-mu-surface-high flex items-center justify-center border border-mu-border">
                <Target size={32} className="text-mu-text-dim" />
              </div>
              <div className="max-w-md flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-mu-text-bright">Connect to Trade</h2>
                <p className="text-mu-text-dim">MuTerminal requires connection to prediction market venues before it can aggregate liquidity and alpha feeds.</p>
              </div>
              <button 
                onClick={() => setActiveView("Settings")}
                className="bg-white text-black font-bold px-8 py-3 rounded-xl text-[14px]"
              >
                Go to Configuration
              </button>
            </div>
          )}

          {hasKeys !== false && (
            <>
              {activeView === "Predict" && <PredictView />}
              {activeView === "Trade" && (
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 flex flex-col min-w-0 border-r border-mu-border">
                    <div className="h-14 flex items-center justify-between px-6 border-b border-mu-border">
                       <div className="flex items-center gap-3">
                         <span className="text-lg font-bold text-mu-text-bright">{marketData.ticker.ticker}</span>
                         <span className="mu-pill bg-mu-surface-high border-none text-[11px]">HIP-3</span>
                         <span className="text-mu-text-dim font-medium">25x</span>
                       </div>
                       <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end">
                           <span className="text-[11px] text-mu-text-dim font-bold">LAST PRICE</span>
                           <span className="text-[15px] font-bold text-mu-text-bright tabular-nums">{marketData.ticker.lastPrice.toFixed(3)}</span>
                         </div>
                         <div className="flex flex-col items-end">
                           <span className="text-[11px] text-mu-text-dim font-bold">24H CHANGE</span>
                           <span className={`text-[15px] font-bold tabular-nums ${marketData.ticker.change24h >= 0 ? 'text-mu-green' : 'text-mu-red'}`}>
                             {marketData.ticker.change24h >= 0 ? '+' : ''}{marketData.ticker.change24h.toFixed(3)} ({marketData.ticker.changePct24h}%)
                           </span>
                         </div>
                       </div>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                       <LiveChart data={marketData.priceHistory} color={marketData.ticker.change24h >= 0 ? 'var(--color-mu-green)' : 'var(--color-mu-red)'} />
                       <div className="absolute bottom-4 left-6 flex gap-2">
                          {["1m", "5m", "15m", "1h", "4h", "1d"].map(t => (
                            <button key={t} className="mu-pill bg-mu-bg/50 backdrop-blur border-mu-border-high">{t}</button>
                          ))}
                       </div>
                    </div>
                    <div className="h-48 border-t border-mu-border overflow-hidden">
                       <WhaleTracker />
                    </div>
                  </div>
                  <div className="w-[320px] flex flex-col shrink-0">
                    <div className="flex-1 min-h-0 border-b border-mu-border">
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
                    <div className="h-64">
                       <ExecutionPanel 
                        ticker={marketData.ticker.ticker}
                        bidPrice={marketData.ticker.bidPrice}
                        askPrice={marketData.ticker.askPrice}
                        onOrder={() => {}}
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeView === "Discover" && <PredictView />}
              {activeView === "Top Traders" && <TopTradersView />}
              {activeView === "Portfolio" && <PortfolioView />}
              {activeView === "Arbitrage" && <ArbitrageMonitor />}
              {activeView === "Settings" && <SettingsView />}
              {activeView === "Analytics" && <AnalyticsView />}
              {activeView === "Strategies" && <StrategyLab />}
              {activeView === "News" && <NewsFeed />}
            </>
          )}
        </section>
      </main>

      <footer className="h-8 border-t border-mu-border bg-mu-surface-low flex items-center justify-between px-4 shrink-0 z-50 text-[11px]">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-mu-green' : 'bg-mu-yellow'}`} />
               <span className="font-medium">{isConnected ? "CONNECTED" : "WAITING FOR ENGINE"}</span>
            </div>
            <span className="text-mu-text-dim">|</span>
            <span className="text-mu-text-dim font-medium uppercase tracking-wider">MuTerminal Kernel v1.0.2</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
               <span className="text-mu-text-dim uppercase">Latency:</span>
               <span className="text-mu-text-bright font-bold">12ms</span>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="text-mu-text-dim uppercase">Uptime:</span>
               <span className="text-mu-text-bright font-bold">99.98%</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

export default App;
