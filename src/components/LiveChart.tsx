import React, { useEffect, useRef } from 'react';

interface LiveChartProps {
  data: number[];
  color?: string;
}

export const LiveChart: React.FC<LiveChartProps> = ({ data, color = '#00c087' }) => {
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

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 0.001;
    const padding = height * 0.1;
    const chartHeight = height - padding * 2;

    const getX = (i: number) => (i / (data.length - 1)) * width;
    const getY = (val: number) => height - padding - ((val - min) / range) * chartHeight;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, getY(max), 0, height);
    gradient.addColorStop(0, color.startsWith('var') ? 'rgba(0, 192, 135, 0.15)' : color.replace(')', ', 0.15)'));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Draw area
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    
    // Bezier curve approximation
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

    // Draw line
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
    ctx.strokeStyle = color.startsWith('var') ? '#00c087' : color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw last price dot
    const lastX = getX(data.length - 1);
    const lastY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color.startsWith('var') ? '#00c087' : color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [data, color]);

  if (data.length < 2) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-20 gap-3">
         <div className="w-12 h-12 rounded-full border-2 border-mu-text-dim border-t-transparent animate-spin" />
         <span className="text-[11px] font-bold tracking-widest uppercase">Initializing Stream...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-mu-bg">
       <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
