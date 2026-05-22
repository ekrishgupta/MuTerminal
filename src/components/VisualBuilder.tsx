import { useState } from "react";
import { Zap, Target, Play, ChevronDown, Plus, Trash2 } from "lucide-react";

export function VisualBuilder() {
  const [trigger, setTrigger] = useState("MarketUpdate");
  const [conditions, setConditions] = useState([{ field: "Spread", operator: ">=", value: "0.02" }]);
  const [actions, setActions] = useState([{ type: "Execute Arbitrage", target: "TRUMP_WIN_2026", size: "500" }]);

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-[var(--color-mu-bg)]">
      
      {/* Trigger Node */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--color-mu-text-dim)" }}>
          <Zap size={12} />
          1. Trigger Event
        </div>
        <div className="mu-panel p-4 flex flex-col gap-3 border-l-2" style={{ borderLeftColor: "var(--color-mu-cyan)" }}>
          <div className="flex items-center gap-4">
            <span className="mu-label">WHEN</span>
            <div className="relative">
              <select 
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="appearance-none bg-black px-3 py-1.5 pr-8 rounded text-[12px] font-bold border outline-none"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-cyan)" }}
              >
                <option value="MarketUpdate">Market Update</option>
                <option value="WhaleTrade">Whale Trade</option>
                <option value="SquawkFeed">News Squawk</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2 pointer-events-none" style={{ color: "var(--color-mu-text-dim)" }} />
            </div>
            <span className="mu-label">OCCURS ON ANY TICKER</span>
          </div>
        </div>
      </div>

      {/* Conditions Node */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--color-mu-text-dim)" }}>
          <Target size={12} />
          2. Conditions
        </div>
        <div className="mu-panel p-4 flex flex-col gap-3 border-l-2" style={{ borderLeftColor: "var(--color-mu-amber)" }}>
          {conditions.map((cond, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="mu-label w-8">{i === 0 ? "IF" : "AND"}</span>
              <input 
                type="text" 
                value={cond.field}
                onChange={(e) => {
                  const newConds = [...conditions];
                  newConds[i].field = e.target.value;
                  setConditions(newConds);
                }}
                className="bg-black px-3 py-1.5 rounded text-[12px] font-bold border outline-none w-32"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
              />
              <select 
                value={cond.operator}
                onChange={(e) => {
                  const newConds = [...conditions];
                  newConds[i].operator = e.target.value;
                  setConditions(newConds);
                }}
                className="appearance-none bg-black px-3 py-1.5 rounded text-[12px] font-bold border outline-none text-center"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-amber)" }}
              >
                <option value="==">==</option>
                <option value="!=">!=</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
              <input 
                type="text" 
                value={cond.value}
                onChange={(e) => {
                  const newConds = [...conditions];
                  newConds[i].value = e.target.value;
                  setConditions(newConds);
                }}
                className="bg-black px-3 py-1.5 rounded text-[12px] font-bold border outline-none w-24"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
              />
              <button 
                onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-black/20 text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-red)] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setConditions([...conditions, { field: "Volume", operator: ">=", value: "1000" }])}
            className="flex items-center justify-center gap-1 mt-2 py-1.5 border border-dashed rounded text-[10px] font-bold uppercase transition-colors"
            style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text-dim)" }}
          >
            <Plus size={12} /> Add Condition
          </button>
        </div>
      </div>

      {/* Actions Node */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--color-mu-text-dim)" }}>
          <Play size={12} />
          3. Execution
        </div>
        <div className="mu-panel p-4 flex flex-col gap-3 border-l-2" style={{ borderLeftColor: "var(--color-mu-green)" }}>
          {actions.map((act, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="mu-label w-8">THEN</span>
              <div className="relative">
                <select 
                  value={act.type}
                  onChange={(e) => {
                    const newActs = [...actions];
                    newActs[i].type = e.target.value;
                    setActions(newActs);
                  }}
                  className="appearance-none bg-black px-3 py-1.5 pr-8 rounded text-[12px] font-bold border outline-none"
                  style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-green)" }}
                >
                  <option value="Execute Arbitrage">Execute Arbitrage</option>
                  <option value="Market Buy">Market Buy</option>
                  <option value="Market Sell">Market Sell</option>
                  <option value="Log to Console">Log to Console</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-2 pointer-events-none" style={{ color: "var(--color-mu-text-dim)" }} />
              </div>
              <span className="mu-label">ON</span>
              <input 
                type="text" 
                value={act.target}
                onChange={(e) => {
                  const newActs = [...actions];
                  newActs[i].target = e.target.value;
                  setActions(newActs);
                }}
                className="bg-black px-3 py-1.5 rounded text-[12px] font-bold border outline-none w-32"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
                placeholder="Target Market"
              />
              <span className="mu-label">SIZE</span>
              <input 
                type="text" 
                value={act.size}
                onChange={(e) => {
                  const newActs = [...actions];
                  newActs[i].size = e.target.value;
                  setActions(newActs);
                }}
                className="bg-black px-3 py-1.5 rounded text-[12px] font-bold border outline-none w-20 text-right"
                style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
              />
              <button 
                onClick={() => setActions(actions.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-black/20 text-[var(--color-mu-text-dim)] hover:text-[var(--color-mu-red)] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setActions([...actions, { type: "Log to Console", target: "Output", size: "N/A" }])}
            className="flex items-center justify-center gap-1 mt-2 py-1.5 border border-dashed rounded text-[10px] font-bold uppercase transition-colors"
            style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text-dim)" }}
          >
            <Plus size={12} /> Add Action
          </button>
        </div>
      </div>

    </div>
  );
}
