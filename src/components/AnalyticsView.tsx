import { useState } from "react";
import { Play, Activity, TrendingUp, Target, Zap, BarChart2 } from "lucide-react";

interface BacktestResult {
  pnl: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  trades: number;
  equityCurve: number[];
}

export function AnalyticsView() {
  const [strategy, setStrategy] = useState("Arbitrage_Core_v2");
  const [dataset, setDataset] = useState("2024_ELECTION_DEBATE_KALSHI_POLY");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleRunBacktest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate C++ Sidecar Backtest
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5 + Math.random() * 5;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        
        // Generate mock equity curve
        let currentEquity = 10000;
        const curve = [currentEquity];
        for (let i = 0; i < 100; i++) {
          const move = (Math.random() - 0.45) * 200; // Slight upward bias
          currentEquity += move;
          curve.push(currentEquity);
        }

        setResult({
          pnl: currentEquity - 10000,
          winRate: 64.2,
          sharpe: 2.1,
          maxDrawdown: -4.5,
          trades: 124,
          equityCurve: curve
        });
        setIsRunning(false);
      } else {
        setProgress(currentProgress);
      }
    }, 100);
  };

  // Simple SVG charting
  const renderEquityCurve = () => {
    if (!result) return null;
    const { equityCurve } = result;
    const min = Math.min(...equityCurve);
    const max = Math.max(...equityCurve);
    const range = max - min;
    const width = 800;
    const height = 300;

    const points = equityCurve.map((val, i) => {
      const x = (i / (equityCurve.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    const isProfitable = result.pnl >= 0;
    const strokeColor = isProfitable ? "var(--color-mu-green)" : "var(--color-mu-red)";
    const fillColor = isProfitable ? "rgba(44,182,125,0.1)" : "rgba(255,85,85,0.1)";

    return (
      <div className="relative w-full h-full p-4">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="var(--color-mu-border)" strokeWidth="1" strokeDasharray="4 4" />
          
          <path 
            d={`M 0,${height} L ${points} L ${width},${height} Z`} 
            fill={fillColor} 
          />
          <polyline 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="2" 
            points={points} 
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 bg-[var(--color-mu-bg)] overflow-y-auto">
      <div className="flex items-center gap-3 border-b pb-4 shrink-0" style={{ borderColor: "var(--color-mu-border)" }}>
        <BarChart2 size={24} style={{ color: "var(--color-mu-accent)" }} />
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "var(--color-mu-text-bright)" }}>
          Quantitative Analytics & Backtesting
        </h1>
      </div>

      <div className="flex gap-6 shrink-0">
        <div className="mu-panel p-4 flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--color-mu-cyan)" }} />
            <span className="mu-heading">Strategy Configuration</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="mu-label">Target Strategy</label>
              <select 
                value={strategy}
                onChange={e => setStrategy(e.target.value)}
                className="bg-black px-3 py-2 rounded text-[12px] font-bold border outline-none"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
              >
                <option value="Arbitrage_Core_v2">Arbitrage_Core_v2</option>
                <option value="Trump_Volatility_Arb">Trump_Volatility_Arb</option>
                <option value="Yield_Farmer_Poly">Yield_Farmer_Poly</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="mu-label">Historical Dataset</label>
              <select 
                value={dataset}
                onChange={e => setDataset(e.target.value)}
                className="bg-black px-3 py-2 rounded text-[12px] font-bold border outline-none"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
              >
                <option value="2024_ELECTION_DEBATE_KALSHI_POLY">Jun 2024 - Election Debate (Tick Level)</option>
                <option value="FOMC_RATE_HIKE_Q3">Q3 FOMC Rate Announcement (Tick Level)</option>
                <option value="SEC_RIPPLE_VERDICT">SEC vs Ripple Verdict Day (Tick Level)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="mt-2 py-3 flex items-center justify-center gap-2 rounded text-[12px] font-black uppercase tracking-widest transition-all"
            style={{ 
              background: isRunning ? "transparent" : "var(--color-mu-accent)",
              border: isRunning ? "1px solid var(--color-mu-border)" : "none",
              color: isRunning ? "var(--color-mu-text-dim)" : "black"
            }}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <Activity size={14} className="animate-spin" />
                Processing {progress.toFixed(0)}%
              </span>
            ) : (
              <>
                <Play size={14} fill="black" /> Run Historical Backtest
              </>
            )}
          </button>
        </div>

        {/* Stats Summary Panel */}
        <div className="w-[300px] mu-panel p-4 flex flex-col gap-4">
           <div className="flex items-center gap-2">
            <Target size={14} style={{ color: "var(--color-mu-green)" }} />
            <span className="mu-heading">Simulation Results</span>
          </div>

          {!result ? (
             <div className="flex-1 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--color-mu-text-ghost)" }}>
               Awaiting Simulation
             </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--color-mu-border)" }}>
                <span className="mu-label">Net PnL</span>
                <span className={`text-[16px] font-black tracking-wider ${result.pnl >= 0 ? "text-[var(--color-mu-green)]" : "text-[var(--color-mu-red)]"}`}>
                  {result.pnl >= 0 ? "+" : ""}${result.pnl.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--color-mu-border)" }}>
                <span className="mu-label">Win Rate</span>
                <span className="text-[14px] font-bold" style={{ color: "var(--color-mu-text-bright)" }}>
                  {result.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--color-mu-border)" }}>
                <span className="mu-label">Sharpe Ratio</span>
                <span className="text-[14px] font-bold" style={{ color: "var(--color-mu-text-bright)" }}>
                  {result.sharpe.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="mu-label">Max Drawdown</span>
                <span className="text-[14px] font-bold text-[var(--color-mu-red)]">
                  {result.maxDrawdown.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equity Curve Panel */}
      <div className="flex-1 mu-panel flex flex-col overflow-hidden">
         <div className="p-4 border-b shrink-0 flex justify-between items-center" style={{ borderColor: "var(--color-mu-border)" }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: "var(--color-mu-purple)" }} />
              <span className="mu-heading">Equity Curve (Simulated)</span>
            </div>
            {result && (
               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-mu-text-dim)" }}>
                 <span className="flex items-center gap-1"><Zap size={10}/> Initial: $10,000.00</span>
                 <span className="flex items-center gap-1"><Target size={10}/> Trades: {result.trades}</span>
               </div>
            )}
         </div>
         <div className="flex-1 min-h-[300px] flex items-center justify-center" style={{ background: "var(--color-mu-surface-high)" }}>
           {!result ? (
              <div className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2" style={{ color: "var(--color-mu-text-ghost)" }}>
                <Activity size={14} /> Run backtest to visualize equity curve
              </div>
           ) : (
             renderEquityCurve()
           )}
         </div>
      </div>
    </div>
  );
}
