import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  className?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  className = '',
  iconClassName = ''
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className={className}>
      <div className="flex items-center p-5">
        <div className={`
          flex-shrink-0 mr-4 w-12 h-12 rounded-lg flex items-center justify-center
          ${iconClassName || 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}
        `}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</h3>
          
          {typeof change !== 'undefined' && (
            <div className="flex items-center mt-1">
              {isPositive && (
                <>
                  <TrendingUp size={16} className="mr-1 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">+{change}%</span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown size={16} className="mr-1 text-red-500" />
                  <span className="text-sm font-medium text-red-500">{change}%</span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">0%</span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;