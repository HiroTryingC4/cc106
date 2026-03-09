/**
 * ResponsiveTable Component
 * 
 * A responsive table that adapts to different screen sizes:
 * - Mobile (< 768px): Card-based layout with essential columns only
 * - Tablet/Desktop (>= 768px): Traditional table layout with all columns
 * - Fallback: Horizontal scroll with visual indicators
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.5
 * 
 * @param {Array} columns - Column definitions with header, accessor, render, essential flag
 * @param {Array} data - Array of data objects to display
 * @param {boolean} mobileCardView - Use card layout on mobile (default: true)
 * @param {boolean} allowHorizontalScroll - Allow horizontal scroll as fallback (default: true)
 * @param {string} emptyMessage - Message to display when no data (default: "No data available")
 * @param {function} onRowClick - Handler for row clicks
 * @param {string} className - Additional CSS classes
 */
import React, { useState, useEffect, useRef } from 'react';
import useViewport from '../hooks/useViewport';
import { getBreakpoint } from '../utils/responsive';

const ResponsiveTable = ({ 
  columns = [], 
  data = [], 
  mobileCardView = true,
  allowHorizontalScroll = true,
  emptyMessage = "No data available",
  onRowClick,
  className = ''
}) => {
  const viewport = useViewport();
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const tableRef = useRef(null);

  // Update breakpoint when viewport changes
  useEffect(() => {
    setBreakpoint(getBreakpoint());
  }, [viewport?.width]);

  // Check if table needs horizontal scroll indicator
  useEffect(() => {
    if (!allowHorizontalScroll || !tableRef.current) return;

    const checkScroll = () => {
      const element = tableRef.current;
      if (element) {
        const hasScroll = element.scrollWidth > element.clientWidth;
        setShowScrollIndicator(hasScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [data, allowHorizontalScroll]);

  // Filter essential columns for mobile
  const mobileColumns = columns.filter(col => col.essential !== false);
  const isMobile = breakpoint === 'mobile';

  // Render mobile card view
  const renderMobileCards = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            className={`
              bg-white rounded-lg shadow-md p-4
              ${onRowClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
            `}
          >
            {mobileColumns.map((column, colIndex) => (
              <div 
                key={colIndex} 
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <span className="font-medium text-sm text-gray-600">
                  {column.header}:
                </span>
                <span className="text-sm text-gray-900 text-right">
                  {column.render 
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor] || '-'
                  }
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Render desktop table view
  const renderDesktopTable = () => {
    return (
      <div className="relative">
        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-200 to-transparent pointer-events-none z-10 flex items-center justify-end pr-2">
            <span className="text-gray-500 text-xs">→</span>
          </div>
        )}

        {/* Table container with horizontal scroll */}
        <div 
          ref={tableRef}
          className="overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`
                      ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                    `}
                  >
                    {columns.map((column, colIndex) => (
                      <td 
                        key={colIndex} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render 
                          ? column.render(row[column.accessor], row)
                          : row[column.accessor] || '-'
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Mobile card view */}
      {isMobile && mobileCardView ? (
        renderMobileCards()
      ) : (
        /* Desktop/tablet table view */
        renderDesktopTable()
      )}
    </div>
  );
};

export default ResponsiveTable;
