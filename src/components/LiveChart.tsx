import React, { useMemo } from 'react';

interface LiveChartProps {
  data: number[];
  color?: string;
  mode?: "line" | "heatmap";
}

export const LiveChart: React.FC<LiveChartProps> = ({ data, color = 'var(--color-mu-cyan)', mode = "line" }) => {
  const points = useMemo(() => {
    if (data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1 || 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  }, [data]);

  if (data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-30 font-black tracking-widest text-xs" style={{ color: 'var(--color-mu-text-dim)' }}>
        AWAITING TICK DATA...
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const lastPrice = data[data.length - 1];

  if (mode === "heatmap") {
    // Generate simulated heatmap blocks
    const heatBlocks = Array.from({ length: 40 }).map((_, i) => {
      const isAsk = i < 20;
      const distFromMid = isAsk ? 20 - i : i - 19;
      // Closer to mid = higher intensity, but add some noise
      const intensity = Math.max(0.1, 1 - (distFromMid * 0.05) + (Math.random() * 0.3 - 0.15));
      const opacity = Math.min(1, Math.max(0, intensity));
      const c = isAsk ? "var(--color-mu-red)" : "var(--color-mu-green)";
      return (
        <div 
          key={i} 
          className="w-full border-b"
          style={{ 
            height: '2.5%', 
            background: c, 
            opacity: opacity * 0.6,
            borderColor: "rgba(0,0,0,0.2)"
          }}
        />
      );
    });

    return (
      <div className="w-full h-full relative group bg-black overflow-hidden flex">
        <div className="w-full h-full flex flex-col">
          {heatBlocks}
        </div>
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
          <div className="w-full border-t-2 border-dashed border-white/50" />
          <div className="bg-black/80 px-2 py-1 rounded text-[10px] font-black tracking-widest text-white backdrop-blur">
            MID: {lastPrice.toFixed(3)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-mu-surface-high) 1px, transparent 1px), linear-gradient(90deg, var(--color-mu-surface-high) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.1 }}></div>
      
      {/* Price Labels */}
      <div className="absolute right-2 top-2 text-[9px] font-mono font-bold" style={{ color: 'var(--color-mu-text-dim)' }}>
        {max.toFixed(3)}
      </div>
      <div className="absolute right-2 bottom-2 text-[9px] font-mono font-bold" style={{ color: 'var(--color-mu-text-dim)' }}>
        {min.toFixed(3)}
      </div>

      <svg className="w-full h-full preserve-3d" viewBox="0 -10 100 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Fill Area */}
        <polygon 
          points={`0,100 ${points} 100,100`} 
          fill="url(#chartGradient)" 
        />
        
        {/* Line */}
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        />
        
        {/* Current Price Dot */}
        {points && (
          <circle 
            cx="100" 
            cy={100 - ((lastPrice - min) / (max - min || 1)) * 100} 
            r="2" 
            fill={color} 
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Last Price Tag */}
      <div className="absolute right-0 flex items-center shadow-lg" style={{ 
        top: `${Math.max(5, Math.min(95, ((max - lastPrice) / (max - min || 1)) * 100))}%`,
        transform: 'translateY(-50%)',
        background: color,
        color: 'black',
        padding: '2px 4px',
        fontSize: '9px',
        fontWeight: '900',
        fontFamily: 'monospace'
      }}>
        {lastPrice.toFixed(3)}
      </div>
    </div>
  );
};
