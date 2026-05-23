import React, { useMemo, useEffect, useRef } from 'react';

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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance Canvas Rendering
  useEffect(() => {
    if (mode !== "line" || !canvasRef.current || data.length < 2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI displays
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Draw Line
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";

    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Gradient Fill under line
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    // Parse the color (assuming it's a CSS variable, we can't easily parse it in pure JS canvas unless we use getComputedStyle, 
    // but for now we'll just use the raw color if it's hex, or fallback to a hardcoded cyan if it's a var)
    let fillBase = color;
    if (color.startsWith("var")) {
       fillBase = color.includes("green") ? "44, 182, 125" : color.includes("red") ? "224, 82, 82" : "59, 158, 202";
       gradient.addColorStop(0, `rgba(${fillBase}, 0.4)`);
       gradient.addColorStop(1, `rgba(${fillBase}, 0.0)`);
    } else {
       gradient.addColorStop(0, color);
       gradient.addColorStop(1, "transparent");
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Current Price Dot
    const lastX = w;
    const lastY = h - ((data[data.length - 1] - min) / range) * h;
    
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

  }, [data, color, mode]);

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

      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      
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
