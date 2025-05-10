import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import ReportTable from './ReportTable';
import { Report, ReportData } from '../types/report';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop sidebar collapse
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const itemsPerPage = pageSize; // Use pageSize for the API call

  useEffect(() => {
    if (selectedReport) {
      fetchReportData(selectedReport.id, currentPage, pageSize);
    }
  }, [selectedReport, currentPage, pageSize]);

  const fetchReportData = async (reportId: string, page: number, count: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ReportData>(
        `https://dev.dfl.datanimbus.com/reports/${reportId}?count=${count}&page=${page}`
      );

      // Handle different potential response formats
      const responseData = response.data;

      // If the response is already in the expected format, use it directly
      if (responseData.data && responseData.pagination) {
        setReportData(responseData);
      }
      // If it's wrapped differently, try to extract the data and pagination
      else if (typeof responseData === 'object') {
        const data = responseData.data || responseData.items || responseData.results || [];
        const pagination = responseData.pagination || responseData.paging || {
          page: page,
          count: data.length,
          totalCount: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: page > 1
        };

        setReportData({ data, pagination });
      }
      // Fallback for unexpected formats
      else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to fetch report data. Please try again later.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
    setCurrentPage(1);
    setSidebarOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize); // Update the page size
    setCurrentPage(1); // Reset to the first page
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar backdrop */}
      <div className={`fixed inset-0 z-20 transition-opacity duration-200 ${
        sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div
          className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Sidebar */}
      <div className={`
        fixed z-30 inset-y-0 left-0 transition-all duration-300 ease-in-out transform
        md:translate-x-0 md:static md:inset-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'md:w-16 overflow-hidden' : 'w-64'}
      `}>
        <div className={sidebarCollapsed ? 'opacity-0 md:w-64' : 'w-full'}>
          <Sidebar
            closeSidebar={() => setSidebarOpen(false)}
            onReportSelect={handleReportSelect}
          />
        </div>

        {/* Collapsed sidebar icons - could be implemented with additional icons */}
        {sidebarCollapsed && (
          <div className="hidden md:flex flex-col items-center py-4">
            <div className="p-3 mb-4">
              <span className="font-bold text-lg text-gray-900 dark:text-white">DR</span>
            </div>
            {/* Add icon buttons for main navigation items if needed */}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        <Header
          openSidebar={() => setSidebarOpen(true)}
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {selectedReport ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedReport.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedReport.description}</p>
              <ReportTable
                fields={selectedReport?.fields || []}
                reportData={reportData}
                loading={loading}
                error={error}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange} // Pass the page size handler
              />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;