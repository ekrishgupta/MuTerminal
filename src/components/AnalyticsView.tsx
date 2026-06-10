import { useState, useRef, useEffect } from "react";
import { Play, Activity, TrendingUp, Target, Zap, BarChart2, FlaskConical, ShieldAlert } from "lucide-react";

interface BacktestResult {
  pnl: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  trades: number;
  equityCurve: number[];
}

export function AnalyticsView() {
  const [strategy, setStrategy] = useState("Cross_Venue_Arb");
  const [dataset, setDataset] = useState("2024_ELECTION_DEBATE");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleRunBacktest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate C++ Sidecar Backtest Engine Execution
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5 + Math.random() * 5;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        
        // Generate mock equity curve
        let currentEquity = 100000;
        const curve = [currentEquity];
        for (let i = 0; i < 150; i++) {
          const move = (Math.random() - 0.46) * 1200; // Upward bias
          currentEquity += move;
          curve.push(currentEquity);
        }

        setResult({
          pnl: currentEquity - 100000,
          winRate: 64.2,
          sharpe: 2.15,
          maxDrawdown: -4.5,
          trades: 1240,
          equityCurve: curve
        });
        setIsRunning(false);
      } else {
        setProgress(currentProgress);
      }
    }, 120);
  };

  const renderEquityCurve = () => {
    if (!result) return null;
    const { equityCurve } = result;
    const min = Math.min(...equityCurve);
    const max = Math.max(...equityCurve);
    const range = max - min;
    const isProfitable = result.pnl >= 0;
    const strokeColor = isProfitable ? "#00c087" : "#ff4d5a";

    return (
      <EquityChart data={equityCurve} color={strokeColor} min={min} max={max} range={range} />
    );
  };

  return (
    <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto bg-mu-bg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mu-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mu-purple/10 flex items-center justify-center border border-mu-purple/20">
            <FlaskConical size={18} className="text-mu-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-mu-text-bright">Backtesting Lab</h1>
            <p className="text-sm text-mu-text-dim">Simulate BOP algorithms against tick-level historical data</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Configuration Panel */}
        <div className="lg:w-[400px] flex flex-col gap-6">
          <div className="mu-card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-mu-blue" />
              <span className="text-[13px] font-bold text-mu-text-bright uppercase tracking-wider">Parameters</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Algorithm</label>
              <select 
                value={strategy}
                onChange={e => setStrategy(e.target.value)}
                className="bg-mu-surface-low border border-mu-border px-4 py-3 rounded-xl text-[13px] font-bold text-mu-text-bright focus:outline-none focus:border-mu-blue transition-colors appearance-none"
              >
                <option value="Cross_Venue_Arb">Cross_Venue_Arb</option>
                <option value="Trump_Volatility_Arb">Trump_Volatility_Arb</option>
                <option value="Yield_Farmer_Poly">Yield_Farmer_Poly</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-mu-text-dim uppercase tracking-wider">Historical Dataset</label>
              <select 
                value={dataset}
                onChange={e => setDataset(e.target.value)}
                className="bg-mu-surface-low border border-mu-border px-4 py-3 rounded-xl text-[13px] font-bold text-mu-text-bright focus:outline-none focus:border-mu-blue transition-colors appearance-none"
              >
                <option value="2024_ELECTION_DEBATE">June 2024 - Election Debate (Tick Level)</option>
                <option value="FOMC_RATE_HIKE_Q3">Q3 FOMC Rate Announcement (Tick Level)</option>
                <option value="SEC_RIPPLE_VERDICT">SEC vs Ripple Verdict Day (Tick Level)</option>
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-mu-border flex items-center justify-between text-[11px] font-medium text-mu-text-dim">
              <span>Engine: BOP_BACKTEST_v1</span>
              <span>Latency Sim: 15ms</span>
            </div>

            <button 
              onClick={handleRunBacktest}
              disabled={isRunning}
              className={`mt-2 w-full py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                isRunning 
                  ? "bg-mu-surface-high text-mu-text-muted border border-mu-border" 
                  : "bg-mu-text-bright text-black hover:bg-white hover:opacity-90 active:scale-95"
              }`}
            >
              {isRunning ? (
                <>
                  <Activity size={16} className="animate-spin text-mu-blue" />
                  <span className="text-mu-blue">Simulating {progress.toFixed(0)}%</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Run Simulation
                </>
              )}
            </button>
          </div>

          {/* Results Summary */}
          <div className="mu-card p-6 flex flex-col gap-4">
             <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-mu-green" />
              <span className="text-[13px] font-bold text-mu-text-bright uppercase tracking-wider">Report</span>
            </div>

            {!result ? (
               <div className="flex-1 min-h-[150px] flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-mu-text-ghost">
                 Waiting for execution
               </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-mu-border pb-3">
                  <span className="text-[12px] font-bold text-mu-text-dim uppercase tracking-wider">Net PnL</span>
                  <span className={`text-2xl font-bold tabular-nums ${result.pnl >= 0 ? "text-mu-green" : "text-mu-red"}`}>
                    {result.pnl >= 0 ? "+" : ""}${result.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-mu-border pb-3">
                  <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Win Rate</span>
                  <span className="text-[14px] font-bold text-mu-text-bright">
                    {result.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-mu-border pb-3">
                  <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Sharpe Ratio</span>
                  <span className="text-[14px] font-bold text-mu-blue">
                    {result.sharpe.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-mu-border pb-3">
                  <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Max Drawdown</span>
                  <span className="text-[14px] font-bold text-mu-red">
                    {result.maxDrawdown.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Total Trades</span>
                  <span className="text-[14px] font-bold text-mu-text-bright tabular-nums">
                    {result.trades.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Equity Curve Panel */}
        <div className="flex-1 mu-card p-0 flex flex-col overflow-hidden min-h-[400px]">
           <div className="px-6 py-4 border-b border-mu-border bg-mu-surface-low flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-mu-blue" />
                <span className="text-[13px] font-bold text-mu-text-bright uppercase tracking-wider">Equity Curve</span>
              </div>
              {result && (
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-mu-text-dim bg-mu-surface px-3 py-1.5 rounded border border-mu-border">
                   <span className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-mu-text-ghost"/> Init: $100K</span>
                 </div>
              )}
           </div>
           
           <div className="flex-1 relative bg-mu-bg/50 flex items-center justify-center">
             {!result ? (
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-mu-text-ghost flex flex-col items-center gap-3">
                  <BarChart2 size={32} className="opacity-20" />
                  Run simulation to plot timeline
                </div>
             ) : (
               <div className="absolute inset-0 p-6">
                 {renderEquityCurve()}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

// Minimal canvas implementation for the equity curve
function EquityChart({ data, color, min, max, range }: { data: number[], color: string, min: number, max: number, range: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 10;
    const chartHeight = height - padding * 2;

    const getX = (i: number) => (i / (data.length - 1)) * width;
    const getY = (val: number) => height - padding - ((val - min) / range) * chartHeight;

    // Gradient
    const gradient = ctx.createLinearGradient(0, getY(max), 0, height);
    gradient.addColorStop(0, color === '#00c087' ? 'rgba(0, 192, 135, 0.15)' : 'rgba(255, 77, 90, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Path area
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i]);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1]);
      const cx = (x1 + x2) / 2;
      ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Path stroke
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i]);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1]);
      const cx = (x1 + x2) / 2;
      ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

  }, [data, color, min, max, range]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
