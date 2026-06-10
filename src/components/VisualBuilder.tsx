import { useState } from "react";
import { Zap, Target, ChevronDown, Plus, Trash2, ArrowRight } from "lucide-react";

export function VisualBuilder() {
  const [trigger, setTrigger] = useState("MarketUpdate");
  const [conditions, setConditions] = useState([{ field: "Spread", operator: ">=", value: "0.02" }]);
  const [actions, setActions] = useState([{ type: "Execute Arbitrage", target: "MU:TRUMP", size: "500" }]);

  return (
    <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10 bg-mu-bg relative">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, var(--color-mu-text) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Trigger Node */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mu-blue/10 flex items-center justify-center border border-mu-blue/20">
            <Zap size={14} className="text-mu-blue" />
          </div>
          <span className="text-[12px] font-bold text-mu-text-bright uppercase tracking-widest">1. Trigger Event</span>
        </div>
        
        <div className="mu-card p-6 flex flex-col gap-4 border-l-4 border-l-mu-blue">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-mu-text-dim uppercase tracking-tighter">Event Type</span>
              <div className="relative">
                <select 
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="appearance-none bg-mu-surface-high px-4 py-2 pr-10 rounded-lg text-[13px] font-bold border border-mu-border focus:border-mu-blue outline-none transition-all"
                  style={{ color: "var(--color-mu-text-bright)" }}
                >
                  <option value="MarketUpdate">Market Update</option>
                  <option value="WhaleTrade">Whale Detection</option>
                  <option value="SquawkFeed">News Squawk</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mu-text-dim pointer-events-none" />
              </div>
            </div>
            <div className="h-10 w-[1px] bg-mu-border mx-2 self-end mb-1" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-mu-text-dim uppercase tracking-tighter">Scope</span>
              <div className="px-4 py-2 bg-mu-surface-low border border-mu-border rounded-lg text-[13px] font-bold text-mu-text-dim">
                ALL VENUES (AGGREGATED)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions Node */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mu-yellow/10 flex items-center justify-center border border-mu-yellow/20">
            <Target size={14} className="text-mu-yellow" />
          </div>
          <span className="text-[12px] font-bold text-mu-text-bright uppercase tracking-widest">2. Logic Gates</span>
        </div>

        <div className="mu-card p-6 flex flex-col gap-4 border-l-4 border-l-mu-yellow">
          {conditions.map((cond, i) => (
            <div key={i} className="flex items-center gap-4 animate-fade-in">
              <div className="w-12 text-[11px] font-black text-mu-text-ghost uppercase">{i === 0 ? "IF" : "AND"}</div>
              
              <input 
                type="text" 
                value={cond.field}
                onChange={(e) => {
                  const newConds = [...conditions];
                  newConds[i].field = e.target.value;
                  setConditions(newConds);
                }}
                className="bg-mu-surface-high px-4 py-2 rounded-lg text-[13px] font-bold border border-mu-border outline-none w-48 focus:border-mu-yellow transition-all text-mu-text-bright"
              />

              <select 
                value={cond.operator}
                onChange={(e) => {
                  const newConds = [...conditions];
                  newConds[i].operator = e.target.value;
                  setConditions(newConds);
                }}
                className="appearance-none bg-mu-surface-high px-3 py-2 rounded-lg text-[13px] font-bold border border-mu-border outline-none text-center min-w-[60px]"
                style={{ color: "var(--color-mu-yellow)" }}
              >
                <option value="==">==</option>
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
                className="bg-mu-surface-high px-4 py-2 rounded-lg text-[13px] font-bold border border-mu-border outline-none w-32 focus:border-mu-yellow transition-all text-mu-text-bright"
              />

              <button 
                onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}
                className="p-2 rounded-lg text-mu-text-ghost hover:text-mu-red hover:bg-mu-red-soft transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button 
            onClick={() => setConditions([...conditions, { field: "Volume", operator: ">=", value: "1000" }])}
            className="flex items-center justify-center gap-2 mt-2 py-3 border border-dashed border-mu-border rounded-xl text-mu-text-dim hover:text-mu-text-bright hover:border-mu-text-dim transition-all text-[11px] font-bold uppercase tracking-widest"
          >
            <Plus size={14} /> Add Condition
          </button>
        </div>
      </div>

      {/* Execution Node */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mu-green/10 flex items-center justify-center border border-mu-green/20">
            <ArrowRight size={14} className="text-mu-green" />
          </div>
          <span className="text-[12px] font-bold text-mu-text-bright uppercase tracking-widest">3. Output Action</span>
        </div>

        <div className="mu-card p-6 flex flex-col gap-4 border-l-4 border-l-mu-green">
          {actions.map((act, i) => (
            <div key={i} className="flex items-center gap-4 animate-fade-in">
              <div className="w-12 text-[11px] font-black text-mu-text-ghost uppercase">THEN</div>
              
              <div className="relative">
                <select 
                  value={act.type}
                  onChange={(e) => {
                    const newActs = [...actions];
                    newActs[i].type = e.target.value;
                    setActions(newActs);
                  }}
                  className="appearance-none bg-mu-surface-high px-4 py-2 pr-10 rounded-lg text-[13px] font-bold border border-mu-border focus:border-mu-green outline-none transition-all text-mu-green"
                >
                  <option value="Execute Arbitrage">Atomic Arbitrage</option>
                  <option value="Market Buy">Limit Order (Buy)</option>
                  <option value="Market Sell">Limit Order (Sell)</option>
                  <option value="Log to Console">System Log</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mu-text-dim pointer-events-none" />
              </div>

              <input 
                type="text" 
                value={act.target}
                onChange={(e) => {
                  const newActs = [...actions];
                  newActs[i].target = e.target.value;
                  setActions(newActs);
                }}
                className="bg-mu-surface-high px-4 py-2 rounded-lg text-[13px] font-bold border border-mu-border outline-none w-48 focus:border-mu-green transition-all text-mu-text-bright"
                placeholder="Market ID"
              />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-mu-text-ghost uppercase">Size</span>
                <input 
                  type="text" 
                  value={act.size}
                  onChange={(e) => {
                    const newActs = [...actions];
                    newActs[i].size = e.target.value;
                    setActions(newActs);
                  }}
                  className="bg-mu-surface-high px-3 py-2 rounded-lg text-[13px] font-bold border border-mu-border outline-none w-20 text-right focus:border-mu-green transition-all text-mu-text-bright"
                />
              </div>

              <button 
                onClick={() => setActions(actions.filter((_, idx) => idx !== i))}
                className="p-2 rounded-lg text-mu-text-ghost hover:text-mu-red hover:bg-mu-red-soft transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button 
            onClick={() => setActions([...actions, { type: "Log to Console", target: "Output", size: "N/A" }])}
            className="flex items-center justify-center gap-2 mt-2 py-3 border border-dashed border-mu-border rounded-xl text-mu-text-dim hover:text-mu-text-bright hover:border-mu-text-dim transition-all text-[11px] font-bold uppercase tracking-widest"
          >
            <Plus size={14} /> Add Action
          </button>
        </div>
      </div>
    </div>
  );
}
