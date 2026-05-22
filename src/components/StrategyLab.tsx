import { useState } from "react";
import { Play, Square, Code, FileText, Save, Terminal, CheckCircle2, Network } from "lucide-react";
import { useBopBridge } from "../hooks/useBopBridge";
import { VisualBuilder } from "./VisualBuilder";

interface ScriptFile {
  name: string;
  content: string;
  status: "idle" | "running" | "error";
}

const DEFAULT_SCRIPTS: ScriptFile[] = [
  {
    name: "kalshi_poly_arb.bop",
    status: "idle",
    content: `// BOP Strategy: Kalshi/Polymarket Arbitrage Loop
// Description: Monitors for >2c spread and executes atomic legs

def target_market = "TRUMP_WIN_2026"
def min_spread = 0.02
def size = 500

on MarketUpdate(target_market) {
  let poly_ask = POLY.getAsk(target_market)
  let kalshi_bid = KALSHI.getBid(target_market)

  if (kalshi_bid - poly_ask >= min_spread) {
    // Execute atomic cross-venue arbitrage
    execute {
      buy(POLY, target_market, size, poly_ask)
      sell(KALSHI, target_market, size, kalshi_bid)
    }
    log("Arb captured: Spread \${kalshi_bid - poly_ask}")
  }
}`
  },
  {
    name: "news_trigger.bop",
    status: "idle",
    content: `// BOP Strategy: News Squawk Event Trigger
// Description: Buys 'YES' on rate cut if WSJ publishes dovish article

listen SquawkFeed {
  onArticle(source: "WSJ", keywords: ["FED", "CUT"]) {
    let sentiment = AI.analyzeSentiment(article.body)
    
    if (sentiment > 0.8) {
      buy(AGGREGATED, "FED_CUT_JUNE", 1000, MARKET)
      log("Executed rate cut play on WSJ article")
      stop() // Only execute once
    }
  }
}`
  },
  {
    name: "whale_copy.bop",
    status: "running",
    content: `// BOP Strategy: Mirror Apex Trader
// Description: Copies trades from 0xa1cc...f44f proportionally

def target_wallet = "0xa1cc...f44f"
def copy_ratio = 0.1 // Trade 10% of their size

on WhaleTrade(target_wallet) {
  let my_size = trade.size * copy_ratio
  
  if (trade.side == BUY) {
    buy(trade.venue, trade.market, my_size, trade.price)
  } else {
    sell(trade.venue, trade.market, my_size, trade.price)
  }
  
  log("Mirrored \${trade.side} on \${trade.market}")
}`
  }
];

export function StrategyLab() {
  const [editorMode, setEditorMode] = useState<"code" | "visual">("code");
  const [scripts, setScripts] = useState<ScriptFile[]>(DEFAULT_SCRIPTS);
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "[SYSTEM] BOP Execution Engine Initialized.",
    "[SYSTEM] Loading modules: POLY_API, KALSHI_V2, SQUAWK_WS",
    "[ENGINE] whale_copy.bop is currently running. Listening for events..."
  ]);
  
  const { sendCommand } = useBopBridge();
  
  const activeScript = scripts[activeScriptIdx];

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = [...scripts];
    updated[activeScriptIdx].content = e.target.value;
    setScripts(updated);
  };

  const handleDeploy = () => {
    setConsoleOutput(prev => [...prev, `[BOP_BRIDGE] Deploying ${activeScript.name} to C++ Engine...`]);
    setTimeout(() => {
      sendCommand(`DEPLOY ${activeScript.name}`);
      const updated = [...scripts];
      updated[activeScriptIdx].status = "running";
      setScripts(updated);
      setConsoleOutput(prev => [...prev, `[ENGINE] Successfully deployed ${activeScript.name}. Active listeners attached.`]);
    }, 600);
  };

  const handleStop = () => {
    sendCommand(`STOP ${activeScript.name}`);
    const updated = [...scripts];
    updated[activeScriptIdx].status = "idle";
    setScripts(updated);
    setConsoleOutput(prev => [...prev, `[ENGINE] Terminated ${activeScript.name}.`]);
  };

  return (
    <div className="flex-1 flex overflow-hidden ">
      {/* Sidebar: Script List */}
      <div className="w-64 border-r flex flex-col" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}>
        <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-mu-border)" }}>
          <div className="flex items-center gap-2">
            <Code size={14} style={{ color: "var(--color-mu-cyan)" }} />
            <span className="mu-heading text-[12px]">Strategy Lab</span>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
          <div className="mu-label mb-2 px-1">Local Scripts (.bop)</div>
          {scripts.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveScriptIdx(i)}
              className="flex items-center justify-between px-3 py-2 rounded  text-left group"
              style={{ 
                background: activeScriptIdx === i ? "var(--color-mu-surface-high)" : "transparent",
                border: `1px solid ${activeScriptIdx === i ? "var(--color-mu-border-focus)" : "transparent"}`
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={12} style={{ color: "var(--color-mu-text-dim)" }} />
                <span className="text-[11px] font-bold truncate" style={{ color: activeScriptIdx === i ? "var(--color-mu-text)" : "var(--color-mu-text-dim)" }}>
                  {s.name}
                </span>
              </div>
              {s.status === "running" && (
                <div className="w-1.5 h-1.5 rounded-full mu-pulse-dot shrink-0" style={{ background: "var(--color-mu-green)" }} />
              )}
            </button>
          ))}
          <button className="mt-4 border border-dashed rounded py-2 text-[10px] font-bold uppercase " style={{ borderColor: "var(--color-mu-border-high)", color: "var(--color-mu-text-muted)" }}>
            + Create New Strategy
          </button>
        </div>
      </div>

      {/* Main Workspace: Editor & Console */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-mu-bg)]">
        {/* Editor Toolbar */}
        <div className="h-12 border-b px-4 flex items-center justify-between shrink-0" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-mid)" }}>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[13px] font-black" style={{ color: "var(--color-mu-accent)" }}>
              {activeScript.name}
            </span>
            {/* Mode Toggle */}
            <div className="flex items-center rounded overflow-hidden" style={{ background: "var(--color-mu-surface)", border: "1px solid var(--color-mu-border)" }}>
              <button 
                onClick={() => setEditorMode("code")}
                className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors"
                style={{ 
                  background: editorMode === "code" ? "var(--color-mu-surface-high)" : "transparent",
                  color: editorMode === "code" ? "var(--color-mu-text)" : "var(--color-mu-text-dim)"
                }}
              >
                <Code size={12} /> Code
              </button>
              <button 
                onClick={() => setEditorMode("visual")}
                className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors"
                style={{ 
                  background: editorMode === "visual" ? "var(--color-mu-surface-high)" : "transparent",
                  color: editorMode === "visual" ? "var(--color-mu-text)" : "var(--color-mu-text-dim)",
                  borderLeft: "1px solid var(--color-mu-border)"
                }}
              >
                <Network size={12} /> Visual
              </button>
            </div>
            
            {activeScript.status === "running" ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest" style={{ background: "rgba(44,182,125,0.1)", color: "var(--color-mu-green)", border: "1px solid rgba(44,182,125,0.2)" }}>
                <CheckCircle2 size={10} /> Deployed & Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest" style={{ background: "var(--color-mu-surface-high)", color: "var(--color-mu-text-muted)", border: "1px solid var(--color-mu-border)" }}>
                Draft
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-text)] hover:bg-[var(--color-mu-surface-high)] ">
              <Save size={14} />
            </button>
            {activeScript.status === "running" ? (
              <button 
                onClick={handleStop}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest  mu-glow-red"
                style={{ background: "var(--color-mu-red)", color: "#fff" }}
              >
                <Square size={10} fill="currentColor" /> Halt Execution
              </button>
            ) : (
              <button 
                onClick={handleDeploy}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest  mu-glow-green"
                style={{ background: "var(--color-mu-green)", color: "#000" }}
              >
                <Play size={10} fill="currentColor" /> Deploy to BOP
              </button>
            )}
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {editorMode === "code" ? (
            <>
              {/* Line Numbers Fake Rail */}
              <div className="w-10 h-full border-r flex flex-col pt-4 items-center shrink-0 font-mono text-[11px]" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)", color: "var(--color-mu-text-ghost)" }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeScript.content}
                onChange={handleEditorChange}
                className="flex-1 h-full resize-none outline-none p-4 font-mono text-[13px] leading-6 whitespace-pre"
                spellCheck={false}
                style={{ 
                  background: "var(--color-mu-bg)", 
                  color: "var(--color-mu-text-bright)",
                  tabSize: 2
                }}
              />
            </>
          ) : (
            <VisualBuilder />
          )}
        </div>

        {/* BOP Terminal Console */}
        <div className="h-48 border-t flex flex-col shrink-0" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface)" }}>
          <div className="px-3 py-1.5 border-b flex items-center justify-between" style={{ borderColor: "var(--color-mu-border)", background: "var(--color-mu-surface-mid)" }}>
            <div className="flex items-center gap-2">
              <Terminal size={12} style={{ color: "var(--color-mu-text-dim)" }} />
              <span className="mu-heading">BOP Engine Output</span>
            </div>
            <button className="text-[9px] font-bold text-[var(--color-mu-text-muted)] hover:text-[var(--color-mu-text)]" onClick={() => setConsoleOutput([])}>
              CLEAR
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed flex flex-col gap-1">
            {consoleOutput.map((log, i) => (
              <div key={i} style={{ color: log.includes("[SYSTEM]") ? "var(--color-mu-cyan)" : log.includes("[ENGINE]") ? "var(--color-mu-green)" : "var(--color-mu-text-dim)" }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
