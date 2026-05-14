import { Radio, Newspaper, MessageSquare, ExternalLink } from "lucide-react";

export const NewsFeed = () => {
  const news = [
    { title: "Trump leads Harris by 2% in latest Michigan poll", source: "Decision Desk HQ", time: "2m ago", sentiment: "positive", ticker: "MU:TRUMP" },
    { title: "Fed meeting minutes hint at potential June pause", source: "WSJ", time: "12m ago", sentiment: "neutral", ticker: "MU:FED_JUNE" },
    { title: "California court rules in favor of gig-work legality", source: "Reuters", time: "45m ago", sentiment: "positive", ticker: "MU:UBER_LYFT" },
    { title: "New York jury begins deliberations in civil trial", source: "AP News", time: "1h ago", sentiment: "neutral", ticker: "MU:NY_VERDICT" },
    { title: "Bitcoin hits new 30-day high amid ETF inflows", source: "Bloomberg", time: "2h ago", sentiment: "positive", ticker: "MU:BTC_70K" },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
       <div className="flex items-center justify-between border-b border-mu-border pb-4">
          <div className="flex items-center space-x-2 text-mu-red mu-glow-red">
             <Radio size={20} className="animate-pulse" />
             <h2 className="font-black uppercase tracking-widest text-lg italic">Live Squawk</h2>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-mu-text-muted">
             <span>ACTIVE SOURCES: 12</span>
             <span className="w-1.5 h-1.5 bg-mu-green rounded-full shadow-[0_0_5px_var(--color-mu-green-glow)]"></span>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto mu-scrollbar space-y-3">
          {news.map((item, i) => (
            <div key={i} className="mu-panel-high p-4 hover:border-mu-cyan/30 transition-all group cursor-pointer border-l-4 border-l-mu-border-high hover:border-l-mu-cyan">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                     <span className="text-[9px] font-black bg-mu-surface px-1.5 py-0.5 rounded text-mu-text-muted border border-mu-border uppercase">{item.source}</span>
                     <span className="text-[9px] font-bold text-mu-text-muted">{item.time}</span>
                  </div>
                  <ExternalLink size={14} className="text-mu-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <h3 className="text-sm font-bold leading-tight group-hover:text-mu-cyan transition-colors mb-3 tracking-tight">{item.title}</h3>
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                     <div className="text-[10px] font-mono bg-mu-cyan/10 text-mu-cyan px-2 py-0.5 rounded border border-mu-cyan/20">{item.ticker}</div>
                     <button className="text-[9px] font-black uppercase text-mu-cyan border-b border-mu-cyan/20 hover:border-mu-cyan transition-all">Quick Trade</button>
                  </div>
                  <div className="flex items-center space-x-3 text-mu-text-muted">
                     <MessageSquare size={12} className="hover:text-mu-text" />
                     <div className={`w-2 h-2 rounded-full ${item.sentiment === 'positive' ? 'bg-mu-green' : 'bg-mu-amber'}`} />
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};
