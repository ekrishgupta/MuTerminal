import { ArrowUpRight, ChevronDown } from "lucide-react";

export const MarketTable = () => {
  const markets = [
    { name: "Kalshi", openInterest: "$668.43M", tvl: "-", notional7D: "$4.13B", volume30D: "$5.64B", users: "457.5M", color: "bg-mu-green", tr30d: "457.5M" },
    { name: "Polymarket", openInterest: "$444.34M", tvl: "$462.83M", notional7D: "$1.57B", volume30D: "$4.03B", users: "2.72M+", color: "bg-mu-cyan", tr30d: "488.1M" },
    { name: "PredictIt", openInterest: "$13.65M", tvl: "$13.97M", notional7D: "$302.46M", volume30D: "$792.55M", users: "90.00K", color: "bg-blue-500", tr30d: "2.9M" },
    { name: "Opinion", openInterest: "$8.12M", tvl: "$8.12M", notional7D: "$105.54M", volume30D: "$459.26M", users: "245.3K", color: "bg-orange-500", tr30d: "9.8M" },
    { name: "ForecastEx", openInterest: "$6.23M", tvl: "-", notional7D: "$5.87M", volume30D: "$29.68M", users: "3.9M", color: "bg-mu-red", tr30d: "3.9M" },
    { name: "Rain", openInterest: "$3.44M", tvl: "$3.48M", notional7D: "-", volume30D: "$2.55M", users: "-", color: "bg-yellow-400", tr30d: "-" },
    { name: "Limitless", openInterest: "$967.17K", tvl: "$527.92K", notional7D: "-", volume30D: "$286.89M", users: "247.3K", color: "bg-purple-500", tr30d: "10.5M" },
    { name: "SX Bet", openInterest: "$636.61K", tvl: "-", notional7D: "-", volume30D: "$52.64M", users: "5.2K", color: "bg-pink-500", tr30d: "1.6M" },
    { name: "Myriad", openInterest: "$541.89K", tvl: "$637.50K", notional7D: "$561.86K", volume30D: "$3.73M", users: "67.0K", color: "bg-indigo-500", tr30d: "5.4M" },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col border-t border-mu-border">
      <div className="grid grid-cols-12 text-[10px] font-black uppercase tracking-wider text-mu-text-muted px-4 py-3 bg-mu-surface/50 border-b border-mu-border">
        <div className="col-span-3">Exchange Venue</div>
        <div className="text-right flex items-center justify-end gap-1">Open Interest <ChevronDown size={10} /></div>
        <div className="text-right flex items-center justify-end gap-1">TVL</div>
        <div className="text-right flex items-center justify-end gap-1">Notional 7D</div>
        <div className="text-right flex items-center justify-end gap-1">Volume 30D</div>
        <div className="text-right flex items-center justify-end gap-1">Transactions</div>
        <div className="text-right col-span-2 pr-4">Active Users</div>
      </div>

      <div className="flex-1 overflow-y-auto mu-scrollbar bg-mu-bg/20">
        {markets.map((m, i) => (
          <div key={i} className="grid grid-cols-12 text-[11px] font-bold px-4 py-4 border-b border-mu-border/30 hover:bg-mu-surface/40 transition-colors group cursor-pointer">
            <div className="col-span-3 flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-white font-black ${m.color}`}>{m.name[0]}</div>
              <span className="group-hover:text-mu-cyan transition-colors text-xs">{m.name}</span>
            </div>
            <div className="text-right tabular-nums self-center">{m.openInterest}</div>
            <div className="text-right tabular-nums text-mu-text-muted self-center">{m.tvl}</div>
            <div className="text-right tabular-nums self-center">{m.notional7D}</div>
            <div className="text-right tabular-nums self-center">{m.volume30D}</div>
            <div className="text-right tabular-nums text-mu-text-muted self-center">{m.tr30d}</div>
            <div className="text-right col-span-2 pr-4 tabular-nums self-center">
               <span className="bg-mu-surface-high px-2 py-0.5 rounded border border-mu-border-high">{m.users}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
