import React, { useState, useEffect, useRef } from 'react';
import { ReportData, ReportDataItem, ReportField } from '../types/report';

interface ReportTableProps {
  fields: ReportField[];
  reportData: ReportData | null;
  reportId: string; // Add reportId to props
  loading: boolean;
  error: string | null;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  searchable?: string[];
}

const ReportTable: React.FC<ReportTableProps> = ({
  fields,
  reportData,
  reportId, // Destructure reportId
  loading,
  error,
  onPageChange,
  onPageSizeChange,
  searchable = [],
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Track the current report ID to detect report changes
  const currentReportId = useRef<string | null>(null);

  useEffect(() => {
    // Check if the report ID has changed
    if (currentReportId.current !== reportId) {
      setSelectedRows(new Set()); // Clear selected rows only on report change
      currentReportId.current = reportId; // Update the current report ID
    }
  }, [reportId]); // Depend on reportId instead of reportData

  const handleRowClick = (rowId: string, event: React.MouseEvent<HTMLTableRowElement>) => {
    // Check if the user is selecting text
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return; // Do not select the row if text is being highlighted
    }
  
    // Proceed with row selection logic
    setSelectedRows((prev) => {
      const updated = new Set(prev);
      if (updated.has(rowId)) {
        updated.delete(rowId);
      } else {
        updated.add(rowId);
      }
      return updated;
    });
  };

  const handleExportSelectedRows = () => {
    const selectedData = reportData?.data.filter((item) => selectedRows.has(item._id));
    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected-rows.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUnselectAll = () => {
    setSelectedRows(new Set());
    setShowConfirmationModal(false);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
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

  return (
    <div className="space-y-4">
      {/* Export and Unselect All Buttons */}
      {selectedRows.size > 0 && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleExportSelectedRows}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Export Selected Rows ({selectedRows.size})
          </button>
          <button
            onClick={() => setShowConfirmationModal(true)}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Unselect All
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Unselect All
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to unselect all rows? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-3 py-1.5 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUnselectAll}
                className="px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white text-xs rounded hover:bg-red-700 dark:hover:bg-red-800"
              >
                Unselect All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {fields.map((field) => (
                <th
                  key={field?.key}
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider"
                >
                  {field?.label || field?.key}
                  {searchable.includes(field.key) && (
                    <input
                      type="text"
                      placeholder={`Search ${field.label || field.key}`}
                      className="mt-2 block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {reportData.data.map((item: ReportDataItem) => (
              <tr
                key={item._id}
                onClick={() => handleRowClick(item._id)}
                className={`cursor-pointer ${
                  selectedRows.has(item._id) ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                {fields.map((field) => (
                  <td
                    key={`${item._id}-${field.key}`}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                  >
                    {typeof item[field.key] === 'object'
                      ? JSON.stringify(item[field.key])
                      : String(item[field.key] ?? '-')}
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
          <div className="flex items-center space-x-4">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <label htmlFor="pageSize" className="text-sm text-gray-500 dark:text-gray-400">
                Rows per page:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange && onPageChange(reportData.pagination.page - 1)}
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
                onClick={() => onPageChange && onPageChange(reportData.pagination.page + 1)}
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
        </div>
      )}
    </div>
  );
};

export default ReportTable;