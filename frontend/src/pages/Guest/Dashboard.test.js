import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import GuestDashboard from './Dashboard';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'mock-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AuthProvider>
  );
};

const mockDashboardData = {
  success: true,
  stats: {
    totalBookings: 5,
    upcomingBookings: 2,
    completedBookings: 3,
    totalSpent: 15000
  },
  bookings: []
};

const mockBrowsingAnalytics = {
  success: true,
  analytics: {
    totalViews: 0
  }
};

const mockRecommendations = {
  success: true,
  recommendations: []
};

describe('GuestDashboard - Responsive Stats Grid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockImplementation((url) => {
      if (url.includes('/dashboard')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockDashboardData)
        });
      }
      if (url.includes('/browsing-history/analytics')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBrowsingAnalytics)
        });
      }
      if (url.includes('/recommendations')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockRecommendations)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  test('stats grid has correct responsive classes', async () => {
    const { container } = renderWithProviders(<GuestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    });

    // Find the stats grid container
    const statsGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    
    expect(statsGrid).toBeInTheDocument();
    expect(statsGrid).toHaveClass('grid');
    expect(statsGrid).toHaveClass('grid-cols-1'); // Mobile: 1 column
    expect(statsGrid).toHaveClass('sm:grid-cols-2'); // Small tablet: 2 columns (640px+)
    expect(statsGrid).toHaveClass('lg:grid-cols-4'); // Desktop: 4 columns (1024px+)
  });

  test('stats grid contains all four stat cards', async () => {
    renderWithProviders(<GuestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    });

    // Verify all stat cards are present
    expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Total Spend')).toBeInTheDocument();

    // Verify stat values
    expect(screen.getByText('5')).toBeInTheDocument(); // totalBookings
    expect(screen.getByText('2')).toBeInTheDocument(); // upcomingBookings
    expect(screen.getByText('3')).toBeInTheDocument(); // completedBookings
    expect(screen.getByText('₱15000')).toBeInTheDocument(); // totalSpent
  });

  test('stats grid uses correct gap spacing', async () => {
    const { container } = renderWithProviders(<GuestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    });

    const statsGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    
    expect(statsGrid).toHaveClass('gap-6'); // Consistent gap across all breakpoints
  });

  test('stat cards have hover effects', async () => {
    const { container } = renderWithProviders(<GuestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    });

    // Find all stat cards
    const statCards = container.querySelectorAll('.shadow-sm.hover\\:shadow-md');
    
    expect(statCards.length).toBe(4);
    statCards.forEach(card => {
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('transition-shadow');
    });
  });

  test('validates requirement 13.2 - responsive grid layout', async () => {
    const { container } = renderWithProviders(<GuestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    });

    const statsGrid = container.querySelector('.grid');
    
    // Requirement 13.2: WHEN statistics or metrics are displayed, 
    // THE Guest_Dashboard SHALL use responsive grid layouts 
    // (1 column mobile, 2 columns tablet, 4 columns desktop)
    
    // Mobile (< 640px): grid-cols-1
    expect(statsGrid.classList.contains('grid-cols-1')).toBe(true);
    
    // Small tablet (640px-1023px): sm:grid-cols-2
    expect(statsGrid.classList.contains('sm:grid-cols-2')).toBe(true);
    
    // Desktop (>= 1024px): lg:grid-cols-4
    expect(statsGrid.classList.contains('lg:grid-cols-4')).toBe(true);
  });
});
