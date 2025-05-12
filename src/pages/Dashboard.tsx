import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircleDollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import RechartsWrapper from '../components/Chart'; // Assuming you named the Recharts component file Chart.tsx
import Card, { CardHeader, CardContent } from '../components/Card';

interface Widget {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'LINECHART', 'BARCHART', 'PIECHART'
}

interface WidgetDataItem {
  xAxis: number;
  yAxis: string;
}

interface WidgetData {
  id: string;
  name: string;
  description: string;
  data: WidgetDataItem[];
}

const Dashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetData, setWidgetData] = useState<Record<string, WidgetData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get('https://dev.dfl.datanimbus.com/reports/widgets');
        const widgetsList = Array.isArray(response.data) ? response.data : response.data.widgets || [];
        setWidgets(widgetsList);
        setLoading(false);

        // Fetch data for each widget
        widgetsList.forEach((widget: Widget) => {
          fetchWidgetData(widget.id);
        });
      } catch (err) {
        console.error('Error fetching widgets:', err);
        setError('Failed to fetch widgets. Please try again later.');
        setLoading(false);
      }
    };

    const fetchWidgetData = async (widgetId: string) => {
      try {
        const response = await axios.get(`https://dev.dfl.datanimbus.com/reports/widgets/${widgetId}`);
        setWidgetData((prev) => ({
          ...prev,
          [widgetId]: response.data,
        }));
      } catch (err) {
        console.error(`Error fetching data for widget ${widgetId}:`, err);
      }
    };

    fetchWidgets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$92,438"
          icon={<CircleDollarSign size={24} />}
          change={12.5}
          iconClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Active Customers"
          value="2,781"
          icon={<Users size={24} />}
          change={3.2}
          iconClassName="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="New Orders"
          value="342"
          icon={<ShoppingCart size={24} />}
          change={-1.8}
          iconClassName="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Growth Rate"
          value="8.15%"
          icon={<TrendingUp size={24} />}
          change={2.3}
          iconClassName="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Dynamic Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map((widget) => {
          const data = widgetData[widget.id]?.data || [];
          const labels = data.map((item) => item.yAxis);
          const values = data.map((item) => item.xAxis);

          return (
            <Card key={widget.id}>
              <CardHeader title={widget.name} subtitle={widget.description} />
              <CardContent>
                {widget.type === 'LINECHART' && (
                  <RechartsWrapper
                    type="line"
                    data={values}
                    labels={labels}
                    height={240}
                    lineColor="#3b82f6"
                    // xAxisLabel={widget?.xAxisLabel}
                    // yAxisLabel={widget?.yAxisLabel}
                  />
                )}
                {widget?.type === 'BARCHART' && (
                  <RechartsWrapper
                    type="bar"
                    data={values}
                    labels={labels}
                    height={240}
                    barColor="#3b82f6"
                    // xAxisLabel={widget?.xAxisLabel}
                    // yAxisLabel={widget?.yAxisLabel}
                  />
                )}
                {widget?.type === 'PIECHART' && (
                  <RechartsWrapper
                    type="pie"
                    data={values}
                    labels={labels}
                    height={240}
                    pieColors={['#3b82f6', '#f87171', '#34d399', '#fbbf24', '#a78bfa']}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;