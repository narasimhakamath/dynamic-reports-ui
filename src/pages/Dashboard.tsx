import React from 'react';
import { CircleDollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityCard from '../components/ActivityCard';
import TasksCard from '../components/TasksCard';
import Chart from '../components/Chart';
import Card, { CardHeader, CardContent } from '../components/Card';

const Dashboard: React.FC = () => {
  const revenueData = [4200, 5100, 5800, 7200, 8100, 9600, 9800, 8200, 7800, 9000, 10200, 12000];
  const revenueLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const customersData = [380, 420, 490, 520, 560, 610, 630, 650, 700, 720, 750, 780];
  const customersLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Revenue" subtitle="Monthly revenue over the past year" />
          <CardContent>
            <Chart 
              data={revenueData} 
              labels={revenueLabels} 
              height={240} 
              lineColor="#3b82f6"
              fillColor="rgba(59, 130, 246, 0.1)"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Customers" subtitle="Monthly customer growth" />
          <CardContent>
            <Chart 
              data={customersData} 
              labels={customersLabels} 
              height={240} 
              lineColor="#8b5cf6"
              fillColor="rgba(139, 92, 246, 0.1)"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard />
        <TasksCard />
      </div>
    </div>
  );
};

export default Dashboard;