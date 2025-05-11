import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: number[];
  labels: string[];
  type?: 'line' | 'bar' | 'pie'; // Add support for 'pie' type
  title?: string;
  className?: string;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  barColor?: string;
  gridColor?: string;
  textColor?: string;
  pieColors?: string[]; // Add colors for pie chart slices
}

const Chart: React.FC<ChartProps> = ({
  data,
  labels,
  type = 'line', // Default to 'line'
  height = 200,
  className = '',
  lineColor = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  barColor = '#3b82f6',
  gridColor = 'rgba(229, 231, 235, 0.5)',
  textColor = '#9ca3af',
  pieColors = ['#3b82f6', '#f87171', '#34d399', '#fbbf24', '#a78bfa'], // Default pie colors
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

    if (type === 'line') {
      // Draw line chart
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
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

      // Draw X-axis labels
      ctx.fillStyle = textColor;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const pointWidth = chartWidth / (data.length - 1);
      labels.forEach((label, index) => {
        const x = padding.left + index * pointWidth;
        const y = padding.top + chartHeight + 10;
        ctx.fillText(label, x, y);
      });

      // Draw line chart
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
    } else if (type === 'bar') {
      // Draw bar chart
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      const barWidth = chartWidth / data.length - 10; // Add spacing between bars
      data.forEach((value, index) => {
        const x = padding.left + index * (barWidth + 10);
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        const barHeight = (value / maxValue) * chartHeight;

        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);
      });
    } else if (type === 'pie') {
      // Draw pie chart
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      const total = data.reduce((sum, value) => sum + value, 0);
      let startAngle = 0;

      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 20, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = pieColors[index % pieColors.length];
        ctx.fill();

        startAngle = endAngle;
      });

      // Draw labels
      startAngle = 0;
      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + sliceAngle / 2;

        const x = canvas.width / 2 + Math.cos(midAngle) * (Math.min(canvas.width, canvas.height) / 2 - 40);
        const y = canvas.height / 2 + Math.sin(midAngle) * (Math.min(canvas.width, canvas.height) / 2 - 40);

        ctx.fillStyle = textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[index], x, y);

        startAngle += sliceAngle;
      });
    }
  }, [data, labels, type, height, lineColor, fillColor, barColor, gridColor, textColor, pieColors]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full"></canvas>
    </div>
  );
};

export default Chart;