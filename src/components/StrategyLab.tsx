import { useState } from "react";
import { Play, Square, Code, FileText, Save, Terminal, Network, Plus } from "lucide-react";
import { useBopBridge } from "../hooks/useBopBridge";
import { VisualBuilder } from "./VisualBuilder";

interface ScriptFile {
  name: string;
  content: string;
  status: "idle" | "running" | "error";
}

const DEFAULT_SCRIPTS: ScriptFile[] = [
  {
    name: "cross_venue_arb.bop",
    status: "idle",
    content: `// BOP Strategy: Kalshi/Polymarket Arbitrage
// Description: Executes when spread > 2 cents

def target = "MU:TRUMP"
def min_spread = 0.02

on MarketUpdate(target) {
  let p_ask = POLY.getAsk(target)
  let k_bid = KALSHI.getBid(target)

  if (k_bid - p_ask >= min_spread) {
    execute_atomic {
      buy(POLY, target, 500, p_ask)
      sell(KALSHI, target, 500, k_bid)
    }
  }
}`
  },
  {
    name: "whale_shadow.bop",
    status: "running",
    content: `// BOP Strategy: Whale Shadowing
// Description: Copy-trade top conviction wallets

on WhaleTrade("0xa1cc...f44f") {
  if (trade.notional > 50000) {
    buy(trade.venue, trade.market, 1000, trade.price)
    log("Shadowed whale buy on \${trade.market}")
  }
}`
  }
];

export function StrategyLab() {
  const [editorMode, setEditorMode] = useState<"code" | "visual">("code");
  const [scripts, setScripts] = useState<ScriptFile[]>(DEFAULT_SCRIPTS);
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "[SYSTEM] BOP Execution Engine Initialized.",
    "[SYSTEM] Bridge connected to local sidecar.",
    "[ENGINE] whale_shadow.bop status: RUNNING"
  ]);
  
  const { sendCommand } = useBopBridge();
  const activeScript = scripts[activeScriptIdx];

  const handleDeploy = () => {
    setConsoleOutput(prev => [...prev, `[BOP_BRIDGE] Compiling and deploying ${activeScript.name}...`]);
    setTimeout(() => {
      sendCommand(`DEPLOY ${activeScript.name}`);
      const updated = [...scripts];
      updated[activeScriptIdx].status = "running";
      setScripts(updated);
      setConsoleOutput(prev => [...prev, `[ENGINE] ${activeScript.name} is now active.`]);
    }, 800);
  };

  const handleStop = () => {
    sendCommand(`STOP ${activeScript.name}`);
    const updated = [...scripts];
    updated[activeScriptIdx].status = "idle";
    setScripts(updated);
    setConsoleOutput(prev => [...prev, `[ENGINE] Terminated ${activeScript.name}.`]);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-mu-bg">
      {/* Sidebar */}
      <div className="w-64 border-r border-mu-border flex flex-col bg-mu-surface-low">
        <div className="h-14 border-b border-mu-border flex items-center px-4 gap-2">
          <Cpu size={16} className="text-mu-blue" />
          <span className="text-[14px] font-bold text-mu-text-bright">Algo Manager</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          <div className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider mb-2 px-1">Scripts</div>
          {scripts.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveScriptIdx(i)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${activeScriptIdx === i ? 'bg-mu-surface-high text-mu-text-bright border border-mu-border-high shadow-lg' : 'text-mu-text-dim hover:text-mu-text'}`}
            >
              <div className="flex items-center gap-3">
                <FileText size={14} className={activeScriptIdx === i ? "text-mu-blue" : "text-mu-text-ghost"} />
                <span className="text-[12px] font-medium">{s.name}</span>
              </div>
              {s.status === "running" && (
                <div className="w-1.5 h-1.5 rounded-full bg-mu-green animate-pulse" />
              )}
            </button>
          ))}
          <button className="mt-4 flex items-center justify-center gap-2 py-2 border border-dashed border-mu-border rounded-lg text-mu-text-dim hover:text-mu-text-bright transition-colors text-[12px] font-medium">
            <Plus size={14} /> New Algo
          </button>
        </div>

        <div className="p-4 border-t border-mu-border">
          <div className="flex items-center justify-between text-[11px] font-bold mb-2">
            <span className="text-mu-text-dim uppercase">CPU LOAD</span>
            <span className="text-mu-green">4.2%</span>
          </div>
          <div className="w-full h-1 bg-mu-surface-high rounded-full overflow-hidden">
            <div className="h-full bg-mu-green w-[4.2%]" />
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-mu-border flex items-center justify-between px-6 bg-mu-bg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-mu-text-bright">{activeScript.name}</span>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${activeScript.status === 'running' ? 'bg-mu-green-soft text-mu-green' : 'bg-mu-surface-high text-mu-text-dim'}`}>
                {activeScript.status}
              </div>
            </div>
            
            <div className="flex items-center bg-mu-surface-low rounded-lg p-0.5 border border-mu-border">
              <button 
                onClick={() => setEditorMode("code")}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-2 transition-all ${editorMode === "code" ? 'bg-mu-surface-high text-mu-text-bright shadow-sm' : 'text-mu-text-dim hover:text-mu-text'}`}
              >
                <Code size={13} /> Code
              </button>
              <button 
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-2 transition-all ${editorMode === "visual" ? 'bg-mu-surface-high text-mu-text-bright shadow-sm' : 'text-mu-text-dim hover:text-mu-text'}`}
              >
                <Network size={13} /> Visual
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-mu-text-dim hover:text-mu-text-bright hover:bg-mu-surface-high transition-all">
              <Save size={18} />
            </button>
            {activeScript.status === "running" ? (
              <button 
                onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-mu-red text-white text-[12px] font-bold shadow-lg shadow-red-500/10 hover:opacity-90 active:scale-95 transition-all"
              >
                <Square size={14} fill="white" /> Halt Execution
              </button>
            ) : (
              <button 
                onClick={handleDeploy}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-mu-green text-black text-[12px] font-bold shadow-lg shadow-green-500/10 hover:opacity-90 active:scale-95 transition-all"
              >
                <Play size={14} fill="black" /> Deploy Strategy
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {editorMode === "code" ? (
            <div className="h-full flex bg-[#0d0e11]">
              <div className="w-12 border-r border-mu-border/50 flex flex-col pt-6 items-center text-mu-text-ghost font-mono text-[12px] select-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-6 flex items-center">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeScript.content}
                readOnly
                className="flex-1 h-full resize-none outline-none p-6 font-mono text-[14px] leading-6 bg-transparent text-mu-text-bright"
                spellCheck={false}
              />
            </div>
          ) : (
            <VisualBuilder />
          )}
        </div>

        {/* Terminal Console */}
        <div className="h-56 border-t border-mu-border bg-mu-surface-low flex flex-col">
          <div className="h-10 border-b border-mu-border flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-mu-text-dim" />
              <span className="text-[11px] font-bold text-mu-text-dim uppercase tracking-wider">Engine Runtime Output</span>
            </div>
            <button className="text-[10px] font-bold text-mu-text-ghost hover:text-mu-text-dim" onClick={() => setConsoleOutput([])}>CLEAR</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed flex flex-col gap-1">
            {consoleOutput.map((log, i) => (
              <div key={i} className={log.includes("[SYSTEM]") ? "text-mu-blue" : log.includes("[ENGINE]") ? "text-mu-green" : "text-mu-text-dim"}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Cpu = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M15 2v2" />
    <path d="M9 2v2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M15 20v2" />
    <path d="M9 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
  </svg>
);
