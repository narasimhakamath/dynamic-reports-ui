import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: number[];
  labels: string[];
  title?: string;
  className?: string;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  gridColor?: string;
  textColor?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  labels,
  height = 200,
  className = '',
  lineColor = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  gridColor = 'rgba(229, 231, 235, 0.5)',
  textColor = '#9ca3af'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // For high-resolution displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${height}px`;

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = canvas.offsetWidth - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...data) * 1.1; // Add 10% space at the top
    
    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + chartHeight - (i / gridCount) * chartHeight;
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      
      // Draw Y-axis labels
      const value = (i / gridCount) * maxValue;
      ctx.fillStyle = textColor;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(value).toString(), padding.left - 8, y);
    }
    
    // Draw data
    const pointWidth = chartWidth / (data.length - 1);
    
    // Fill area under the line
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    
    data.forEach((value, index) => {
      const x = padding.left + index * pointWidth;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + index * pointWidth;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    data.forEach((value, index) => {
      const x = padding.left + index * pointWidth;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    labels.forEach((label, index) => {
      const x = padding.left + index * pointWidth;
      const y = padding.top + chartHeight + 10;
      ctx.fillText(label, x, y);
    });
    
  }, [data, labels, height, lineColor, fillColor, gridColor, textColor]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full"></canvas>
    </div>
  );
};

export default Chart;