import React from 'react';
import { ReportData, ReportDataItem } from '../types/report';

interface ReportTableProps {
  reportData: ReportData | null;
  loading: boolean;
  error: string | null;
  onPageChange?: (page: number) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reportData,
  loading,
  error,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!reportData || !reportData.data || reportData.data.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No data available for this report.</p>
      </div>
    );
  }

  // Get all unique keys from data (excluding internal metadata)
  const allKeys = Array.from(
    new Set(
      reportData.data.flatMap(item =>
        Object.keys(item).filter(key => !['_metadata', '__v'].includes(key))
      )
    )
  ).sort(); // Sort keys for consistent display

  const handlePreviousPage = () => {
    if (onPageChange && reportData.pagination.hasPrevPage) {
      onPageChange(reportData.pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (onPageChange && reportData.pagination.hasNextPage) {
      onPageChange(reportData.pagination.page + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {allKeys.map(key => (
                <th 
                  key={key}
                  scope="col" 
                  className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {reportData.data.map((item: ReportDataItem) => (
              <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {allKeys.map(key => (
                  <td 
                    key={`${item._id}-${key}`} 
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                  >
                    {typeof item[key] === 'object' ? 
                      JSON.stringify(item[key]) : 
                      String(item[key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {reportData.pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing page {reportData.pagination.page} of {reportData.pagination.totalPages} ({reportData.pagination.totalCount} total items)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={!reportData.pagination.hasPrevPage}
              className={`px-3 py-1 text-sm rounded-md border ${
                reportData.pagination.hasPrevPage
                  ? 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!reportData.pagination.hasNextPage}
              className={`px-3 py-1 text-sm rounded-md border ${
                reportData.pagination.hasNextPage
                  ? 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;