/**
 * Unit tests for ResponsiveTable component
 * Tests responsive behavior, card layout, table layout, and scroll indicators
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveTable from './ResponsiveTable';

// Mock the hooks and utilities
jest.mock('../hooks/useViewport', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 1024, height: 768, orientation: 'landscape' }))
}));

jest.mock('../utils/responsive', () => ({
  getBreakpoint: jest.fn(() => 'desktop')
}));

const useViewport = require('../hooks/useViewport').default;
const { getBreakpoint } = require('../utils/responsive');

describe('ResponsiveTable Component', () => {
  const mockColumns = [
    { header: 'Name', accessor: 'name', essential: true },
    { header: 'Email', accessor: 'email', essential: true },
    { header: 'Phone', accessor: 'phone', essential: false },
    { header: 'Status', accessor: 'status', essential: false }
  ];

  const mockData = [
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'Inactive' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({ width: 1024, height: 768, orientation: 'landscape' });
      getBreakpoint.mockReturnValue('desktop');
    });

    it('should render table layout on desktop', () => {
      const { container } = render(
        <ResponsiveTable columns={mockColumns} data={mockData} />
      );

      // Should have table element
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      // Should show all columns
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should display all data rows in table', () => {
      render(<ResponsiveTable columns={mockColumns} data={mockData} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should show empty message when no data', () => {
      render(<ResponsiveTable columns={mockColumns} data={[]} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should show custom empty message', () => {
      render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={[]} 
          emptyMessage="No records found"
        />
      );

      expect(screen.getByText('No records found')).toBeInTheDocument();
    });

    it('should handle row clicks on desktop', () => {
      const handleRowClick = jest.fn();
      const { container } = render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={mockData} 
          onRowClick={handleRowClick}
        />
      );

      const firstRow = container.querySelector('tbody tr');
      fireEvent.click(firstRow);

      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('should render custom cell content', () => {
      const columnsWithRender = [
        { 
          header: 'Name', 
          accessor: 'name', 
          essential: true,
          render: (value) => <strong>{value.toUpperCase()}</strong>
        }
      ];

      render(<ResponsiveTable columns={columnsWithRender} data={mockData} />);

      expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
      expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({ width: 375, height: 667, orientation: 'portrait' });
      getBreakpoint.mockReturnValue('mobile');
    });

    it('should render card layout on mobile', () => {
      const { container } = render(
        <ResponsiveTable columns={mockColumns} data={mockData} />
      );

      // Should not have table element
      const table = container.querySelector('table');
      expect(table).not.toBeInTheDocument();

      // Should have card containers
      const cards = container.querySelectorAll('.rounded-lg.shadow-md');
      expect(cards.length).toBe(2);
    });

    it('should hide non-essential columns on mobile', () => {
      render(<ResponsiveTable columns={mockColumns} data={mockData} />);

      // Essential columns should be visible
      expect(screen.getAllByText(/Name:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Email:/i).length).toBeGreaterThan(0);

      // Non-essential columns should not be visible
      expect(screen.queryByText(/Phone:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Status:/i)).not.toBeInTheDocument();
    });

    it('should display data in card format', () => {
      render(<ResponsiveTable columns={mockColumns} data={mockData} />);

      // Check that data is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should show empty message when no data on mobile', () => {
      render(<ResponsiveTable columns={mockColumns} data={[]} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should handle row clicks on mobile cards', () => {
      const handleRowClick = jest.fn();
      const { container } = render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={mockData} 
          onRowClick={handleRowClick}
        />
      );

      const firstCard = container.querySelector('.rounded-lg.shadow-md');
      fireEvent.click(firstCard);

      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('should render custom cell content in cards', () => {
      const columnsWithRender = [
        { 
          header: 'Name', 
          accessor: 'name', 
          essential: true,
          render: (value) => <strong>{value.toUpperCase()}</strong>
        }
      ];

      render(<ResponsiveTable columns={columnsWithRender} data={mockData} />);

      expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
      expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
    });

    it('should disable card view when mobileCardView is false', () => {
      const { container } = render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={mockData} 
          mobileCardView={false}
        />
      );

      // Should render table even on mobile
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Tablet View', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({ width: 768, height: 1024, orientation: 'portrait' });
      getBreakpoint.mockReturnValue('tablet');
    });

    it('should render table layout on tablet', () => {
      const { container } = render(
        <ResponsiveTable columns={mockColumns} data={mockData} />
      );

      // Should have table element
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      // Should show all columns
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should update layout when viewport changes from mobile to desktop', () => {
      useViewport.mockReturnValue({ width: 375, height: 667, orientation: 'portrait' });
      getBreakpoint.mockReturnValue('mobile');

      const { container, rerender } = render(
        <ResponsiveTable columns={mockColumns} data={mockData} />
      );

      // Initially mobile - should have cards
      let cards = container.querySelectorAll('.rounded-lg.shadow-md');
      expect(cards.length).toBe(2);

      // Change to desktop
      useViewport.mockReturnValue({ width: 1024, height: 768, orientation: 'landscape' });
      getBreakpoint.mockReturnValue('desktop');

      rerender(<ResponsiveTable columns={mockColumns} data={mockData} />);

      // Should now have table
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty columns array', () => {
      const { container } = render(
        <ResponsiveTable columns={[]} data={mockData} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should handle missing accessor values', () => {
      const dataWithMissing = [
        { name: 'John Doe' }, // Missing email, phone, status
      ];

      render(<ResponsiveTable columns={mockColumns} data={dataWithMissing} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={mockData} 
          className="custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should handle all columns marked as non-essential on mobile', () => {
      const allNonEssential = mockColumns.map(col => ({ ...col, essential: false }));
      
      useViewport.mockReturnValue({ width: 375, height: 667, orientation: 'portrait' });
      getBreakpoint.mockReturnValue('mobile');

      const { container } = render(
        <ResponsiveTable columns={allNonEssential} data={mockData} />
      );

      // Should still render cards but with no content
      const cards = container.querySelectorAll('.rounded-lg.shadow-md');
      expect(cards.length).toBe(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure on desktop', () => {
      useViewport.mockReturnValue({ width: 1024, height: 768, orientation: 'landscape' });
      getBreakpoint.mockReturnValue('desktop');

      const { container } = render(
        <ResponsiveTable columns={mockColumns} data={mockData} />
      );

      const table = container.querySelector('table');
      const thead = container.querySelector('thead');
      const tbody = container.querySelector('tbody');

      expect(table).toBeInTheDocument();
      expect(thead).toBeInTheDocument();
      expect(tbody).toBeInTheDocument();
    });

    it('should have clickable cursor when onRowClick is provided', () => {
      const { container } = render(
        <ResponsiveTable 
          columns={mockColumns} 
          data={mockData} 
          onRowClick={() => {}}
        />
      );

      const firstRow = container.querySelector('tbody tr');
      expect(firstRow).toHaveClass('cursor-pointer');
    });
  });
});
