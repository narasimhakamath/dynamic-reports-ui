import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CircleDollarSign, Users, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
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
  const [refreshingWidgetId, setRefreshingWidgetId] = useState<string | null>(null);

  const fetchWidgetData = useCallback(async (widgetId: string) => {
    try {
      const response = await axios.get(`https://dev.dfl.datanimbus.com/reports/widgets/${widgetId}`);
      setWidgetData((prev) => ({
        ...prev,
        [widgetId]: response.data,
      }));
      setRefreshingWidgetId(null); // Clear refreshing state after data is fetched
    } catch (err) {
      console.error(`Error fetching data for widget ${widgetId}:`, err);
      setRefreshingWidgetId(null); // Ensure refreshing state is cleared even on error
    }
  }, []);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get('https://dev.dfl.datanimbus.com/reports/widgets');
        const widgetsList = Array.isArray(response.data) ? response.data : response.data.widgets || [];
        setWidgets(widgetsList);
        setLoading(false);

        // Fetch initial data for each widget
        widgetsList.forEach((widget: Widget) => {
          fetchWidgetData(widget.id);
        });
      } catch (err) {
        console.error('Error fetching widgets:', err);
        setError('Failed to fetch widgets. Please try again later.');
        setLoading(false);
      }
    };

    fetchWidgets();
  }, [fetchWidgetData]);

  const handleRefreshWidget = (widgetId: string) => {
    setRefreshingWidgetId(widgetId);
    fetchWidgetData(widgetId);
  };

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
        {/* ... StatCard components ... */}
      </div>

      {/* Dynamic Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map((widget) => {
          const data = widgetData[widget.id]?.data || [];
          const labels = data.map((item) => item.yAxis);
          const values = data.map((item) => item.xAxis);
          const isRefreshing = refreshingWidgetId === widget.id;

          return (
            <Card key={widget.id}>
              <CardHeader
                title={widget.name}
                subtitle={widget.description}
                action={
                  <button
                    onClick={() => handleRefreshWidget(widget.id)}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                }
              />
              <CardContent className="relative">
                {isRefreshing ? (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-md">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <>
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
                  </>
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