import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/guest/dashboard',
  }),
}));

// Mock user data
const mockGuestUser = {
  id: 1,
  email: 'guest@test.com',
  firstName: 'Test',
  lastName: 'Guest',
  role: 'guest'
};

const mockHostUser = {
  id: 2,
  email: 'host@test.com',
  firstName: 'Test',
  lastName: 'Host',
  role: 'host'
};

const mockAdminUser = {
  id: 3,
  email: 'admin@test.com',
  firstName: 'Test',
  lastName: 'Admin',
  role: 'admin'
};

// Helper to render with auth context
const renderWithAuth = (user) => {
  useAuth.mockReturnValue({ user });
  return render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Sidebar Component - Responsive Visibility', () => {
  describe('Desktop visibility (>= 1024px)', () => {
    beforeEach(() => {
      // Mock desktop viewport
      global.innerWidth = 1280;
      global.innerHeight = 800;
    });

    test('should be visible on desktop for guest users', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass('lg:flex');
      expect(sidebar).not.toHaveClass('lg:hidden');
    });

    test('should be visible on desktop for host users', () => {
      const { container } = renderWithAuth(mockHostUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass('lg:flex');
    });

    test('should be visible on desktop for admin users', () => {
      const { container } = renderWithAuth(mockAdminUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass('lg:flex');
    });

    test('should maintain fixed width of 256px (w-64) on desktop', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toHaveClass('w-64');
    });

    test('should display all navigation items on desktop', () => {
      renderWithAuth(mockGuestUser);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Units')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });
  });

  describe('Mobile and tablet visibility (< 1024px)', () => {
    test('should have hidden class for mobile/tablet viewports', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      // Sidebar should have 'hidden' class which hides it on mobile/tablet
      expect(sidebar).toHaveClass('hidden');
      // And 'lg:flex' which shows it on desktop
      expect(sidebar).toHaveClass('lg:flex');
    });

    test('should apply responsive visibility classes correctly', () => {
      const { container } = renderWithAuth(mockHostUser);
      const sidebar = container.querySelector('aside');
      
      // Check that the sidebar has the correct responsive classes
      const classes = sidebar.className;
      expect(classes).toContain('hidden');
      expect(classes).toContain('lg:flex');
    });
  });

  describe('Desktop functionality preservation', () => {
    beforeEach(() => {
      global.innerWidth = 1280;
      global.innerHeight = 800;
    });

    test('should display user profile section at bottom', () => {
      renderWithAuth(mockGuestUser);
      
      expect(screen.getByText('Test Guest')).toBeInTheDocument();
      expect(screen.getByText('guest@test.com')).toBeInTheDocument();
    });

    test('should display role-specific panel header', () => {
      renderWithAuth(mockGuestUser);
      
      expect(screen.getByText('guest Panel')).toBeInTheDocument();
      expect(screen.getByText(/Welcome, Test/)).toBeInTheDocument();
    });

    test('should display logout button', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const logoutButton = container.querySelector('button[title="Logout"]');
      
      expect(logoutButton).toBeInTheDocument();
    });

    test('should maintain full-height layout', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toHaveClass('min-h-screen');
      expect(sidebar).toHaveClass('flex-col');
    });

    test('should display correct menu items for guest role', () => {
      renderWithAuth(mockGuestUser);
      
      const guestMenuItems = ['Dashboard', 'Units', 'Recommendations', 'My Bookings', 'Messages'];
      guestMenuItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test('should display correct menu items for host role', () => {
      renderWithAuth(mockHostUser);
      
      const hostMenuItems = ['Dashboard', 'Verification', 'My Units', 'Booking', 'Promo Codes'];
      hostMenuItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test('should display correct menu items for admin role', () => {
      renderWithAuth(mockAdminUser);
      
      const adminMenuItems = ['Dashboard', 'Users', 'Host Verifications', 'Units', 'Reviews'];
      adminMenuItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test('should apply correct background color for guest/host roles', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toHaveClass('bg-[#4E7B22]');
    });

    test('should apply correct background color for admin role', () => {
      const { container } = renderWithAuth(mockAdminUser);
      const sidebar = container.querySelector('aside');
      
      expect(sidebar).toHaveClass('bg-white');
    });
  });

  describe('Requirements validation', () => {
    test('Requirement 3.1: Desktop layout preservation - sidebar visible on desktop', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      // Sidebar should be visible on desktop (lg:flex)
      expect(sidebar).toHaveClass('lg:flex');
      expect(sidebar).toHaveClass('w-64');
      expect(sidebar).toHaveClass('min-h-screen');
    });

    test('Requirement 7.2: Navigation accessibility - sidebar hidden on mobile, visible on desktop', () => {
      const { container } = renderWithAuth(mockGuestUser);
      const sidebar = container.querySelector('aside');
      
      // Hidden on mobile/tablet
      expect(sidebar).toHaveClass('hidden');
      // Visible on desktop
      expect(sidebar).toHaveClass('lg:flex');
    });

    test('All desktop functionality maintained - navigation, profile, logout', () => {
      renderWithAuth(mockGuestUser);
      
      // Navigation items present
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Profile section present
      expect(screen.getByText('Test Guest')).toBeInTheDocument();
      
      // Logout button present
      const { container } = renderWithAuth(mockGuestUser);
      const logoutButton = container.querySelector('button[title="Logout"]');
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
