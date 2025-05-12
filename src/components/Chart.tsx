// Chart.tsx (using Recharts)
import React, { FC } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: number[];
  labels: string[];
  height?: number;
  lineColor?: string;
  barColor?: string;
  pieColors?: string[];
  fillColor?: string;
  textColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string | number;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const label = payload[0].name;
    const value = payload[0].value;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#f9f9f9', padding: '8px', border: '1px solid #ccc' }}>
        <p className="label" style={{ color: '#333' }}>{`${label}: ${value}`}</p>
        {/* You can add more information here if needed */}
      </div>
    );
  }

  return null;
};

const RechartsWrapper: FC<ChartProps> = ({
  type,
  data,
  labels,
  height = 240,
  lineColor = '#3b82f6',
  barColor = '#3b82f6',
  pieColors = ['#3b82f6', '#f87171', '#34d399', '#fbbf24', '#a78bfa'],
  textColor = '#6b7280',
  xAxisLabel,
  yAxisLabel,
}) => {
  const formattedData = data.map((value, index) => ({
    name: labels[index],
    value,
  }));

  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={textColor} label={xAxisLabel} />
            <YAxis stroke={textColor} label={yAxisLabel} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={lineColor} fill={lineColor} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={textColor} label={xAxisLabel} />
            <YAxis stroke={textColor} label={yAxisLabel} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill={barColor} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={pieColors[0]}
              label
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} /> {/* Apply the custom tooltip here */}
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return <p>Unsupported chart type</p>;
  }
};

export default RechartsWrapper;