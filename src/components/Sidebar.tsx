import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Report } from '../types/report';

interface SidebarProps {
  closeSidebar: () => void;
  onReportSelect: (report: Report) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, onReportSelect }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('https://dev.dfl.datanimbus.com/reports/reports');
        setReports(Array.isArray(response.data) ? response.data : response.data.reports || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to fetch reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">DNlytics</h2>
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
          onClick={closeSidebar}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm p-4">
            {error}
          </div>
        )}

        <ul className="space-y-1">
          {reports.map((report) => (
            <li key={report.id}>
              <button
                onClick={() => {
                  onReportSelect(report);
                  closeSidebar();
                }}
                className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {report.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {report.description}
                  </p>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 ml-2 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;