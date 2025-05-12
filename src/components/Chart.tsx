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
}

const RechartsWrapper: FC<ChartProps> = ({
  type,
  data,
  labels,
  height = 240,
  lineColor = '#3b82f6',
  barColor = '#3b82f6',
  pieColors = ['#3b82f6', '#f87171', '#34d399', '#fbbf24', '#a78bfa'],
  textColor = '#6b7280',
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
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip />
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
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip />
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
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return <p>Unsupported chart type</p>;
  }
};

export default RechartsWrapper;