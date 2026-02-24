/**
 * Table Component
 * 
 * Reusable data table with advanced features.
 * Features:
 * - Column sorting (ascending/descending)
 * - Per-column filtering with text input
 * - Pagination with configurable items per page
 * - Row selection with checkboxes
 * - CSV export functionality
 * - Custom cell rendering
 * - Click handlers for rows
 * 
 * @param {Array} columns - Column definitions with header, accessor, render, sortable, filterable
 * @param {Array} data - Array of data objects to display
 * @param {function} onSort - Optional external sort handler
 * @param {boolean} sortable - Enable/disable sorting (default: true)
 * @param {boolean} pagination - Enable/disable pagination (default: true)
 * @param {number} itemsPerPage - Items per page (default: 10)
 * @param {function} onRowClick - Handler for row clicks
 * @param {boolean} exportable - Show export button (default: false)
 * @param {function} onExport - Custom export handler
 * @param {boolean} selectable - Enable row selection (default: false)
 * @param {function} onSelectionChange - Handler for selection changes
 */
import React, { useState } from 'react';
import Button from './Button';

const Table = ({ 
  columns, 
  data, 
  onSort, 
  sortable = true,
  pagination = true,
  itemsPerPage = 10,
  onRowClick,
  exportable = false,
  onExport,
  selectable = false,
  onSelectionChange
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  // Sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  // Filtering
  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1); // Reset to first page
  };

  // Row selection
  const handleRowSelect = (row, index) => {
    const rowId = row.id || index;
    setSelectedRows(prev => {
      const newSelection = prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId];
      
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allIds = filteredData.map((row, index) => row.id || index);
      setSelectedRows(allIds);
      if (onSelectionChange) onSelectionChange(allIds);
    }
  };

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (filterValue) {
        filtered = filtered.filter(row => {
          const cellValue = String(row[key] || '').toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });
    
    return filtered;
  }, [data, filters]);

  // Sort data locally if no onSort handler provided
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || onSort) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredData, sortConfig, onSort]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (onExport) {
      onExport('csv');
      return;
    }

    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = col.accessor ? row[col.accessor] : '';
        return `"${value}"`;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div>
      {/* Export Button */}
      {exportable && (
        <div className="mb-4 flex justify-end">
          <Button size="sm" variant="secondary" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="space-y-2">
                    <div
                      onClick={() => column.sortable !== false && handleSort(column.accessor)}
                      className={`flex items-center gap-2 ${
                        sortable && column.sortable !== false ? 'cursor-pointer hover:text-gray-700' : ''
                      }`}
                    >
                      {column.header}
                      {sortable && column.sortable !== false && sortConfig.key === column.accessor && (
                        <span className="text-blue-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    {column.filterable !== false && (
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters[column.accessor] || ''}
                        onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = row.id || rowIndex;
                const isSelected = selectedRows.includes(rowId);
                
                return (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelect(row, rowIndex)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-sm text-gray-900">
                        {column.render 
                          ? column.render(row[column.accessor], row)
                          : row[column.accessor]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
