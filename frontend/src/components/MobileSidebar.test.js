import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useLocation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/guest/dashboard',
  }),
}));

describe('MobileSidebar Component', () => {
  const mockOnClose = jest.fn();

  const mockGuestUser = {
    role: 'guest',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  const mockHostUser = {
    role: 'host',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  };

  const mockAdminUser = {
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
    // Reset location pathname mock
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/guest/dashboard',
    });
  });

  const renderComponent = (isOpen = true, user = mockGuestUser) => {
    useAuth.mockReturnValue({ user });
    return render(
      <BrowserRouter>
        <MobileSidebar isOpen={isOpen} onClose={mockOnClose} />
      </BrowserRouter>
    );
  };

  describe('Visibility and Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderComponent(false);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      renderComponent(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render backdrop overlay when open', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveAttribute('aria-modal', 'true');
      expect(drawer).toHaveAttribute('aria-label', 'Mobile navigation menu');
    });
  });

  describe('Drawer Dimensions and Positioning', () => {
    it('should be 256px wide (w-64)', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('w-64');
    });

    it('should be positioned at left edge', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('left-0');
      expect(drawer).toHaveClass('inset-y-0');
    });

    it('should be fixed positioned', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('fixed');
    });

    it('should have proper z-index for overlay', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('z-50');
    });
  });

  describe('Smooth Transitions', () => {
    it('should have transition classes for open/close animation', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('transition-transform');
      expect(drawer).toHaveClass('duration-300');
      expect(drawer).toHaveClass('ease-in-out');
    });

    it('should apply translate-x-0 when open', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('translate-x-0');
    });

    it('should have backdrop transition', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveClass('transition-opacity');
      expect(backdrop).toHaveClass('duration-300');
    });
  });

  describe('Backdrop Overlay', () => {
    it('should close drawer when backdrop is clicked', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have proper backdrop styling', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveClass('fixed');
      expect(backdrop).toHaveClass('inset-0');
      expect(backdrop).toHaveClass('z-40');
    });

    it('should hide backdrop on desktop (lg:hidden)', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveClass('lg:hidden');
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      renderComponent(true);
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toBeInTheDocument();
    });

    it('should close drawer when close button is clicked', () => {
      renderComponent(true);
      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should meet minimum touch target size (44px)', () => {
      renderComponent(true);
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toHaveClass('min-h-[44px]');
      expect(closeButton).toHaveClass('min-w-[44px]');
    });

    it('should have proper ARIA label', () => {
      renderComponent(true);
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  describe('User Role-Based Content', () => {
    it('should display guest menu items for guest user', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Units')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('should display host menu items for host user', () => {
      renderComponent(true, mockHostUser);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Verification')).toBeInTheDocument();
      expect(screen.getByText('My Units')).toBeInTheDocument();
      expect(screen.getByText('Booking')).toBeInTheDocument();
      expect(screen.getByText('Promo Codes')).toBeInTheDocument();
    });

    it('should display admin menu items for admin user', () => {
      renderComponent(true, mockAdminUser);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Host Verifications')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('should display correct panel title for guest', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText('guest Panel')).toBeInTheDocument();
    });

    it('should display correct panel title for host', () => {
      renderComponent(true, mockHostUser);
      expect(screen.getByText('host Panel')).toBeInTheDocument();
    });

    it('should display correct panel title for admin', () => {
      renderComponent(true, mockAdminUser);
      expect(screen.getByText('admin Panel')).toBeInTheDocument();
    });
  });

  describe('User Profile Section', () => {
    it('should display user name', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display user email', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display user initials in avatar', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display welcome message with first name', () => {
      renderComponent(true, mockGuestUser);
      expect(screen.getByText(/Welcome, John/)).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('should render logout button', () => {
      renderComponent(true);
      const logoutButton = screen.getByLabelText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });

    it('should meet minimum touch target size for logout button', () => {
      renderComponent(true);
      const logoutButton = screen.getByLabelText('Logout');
      expect(logoutButton).toHaveClass('min-h-[44px]');
      expect(logoutButton).toHaveClass('min-w-[44px]');
    });

    it('should show confirmation dialog on logout click', () => {
      window.confirm = jest.fn(() => false);
      renderComponent(true);
      const logoutButton = screen.getByLabelText('Logout');
      fireEvent.click(logoutButton);
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to logout?');
    });
  });

  describe('Navigation Links', () => {
    it('should render all navigation links as clickable', () => {
      renderComponent(true, mockGuestUser);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have minimum touch target size for navigation items', () => {
      renderComponent(true, mockGuestUser);
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('min-h-[44px]');
      });
    });

    it('should have proper spacing between navigation items', () => {
      const { container } = renderComponent(true, mockGuestUser);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('space-y-1');
    });
  });

  describe('Keyboard Interactions', () => {
    it('should close drawer on Escape key press', () => {
      renderComponent(true);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on other key presses', () => {
      renderComponent(true);
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Prevention', () => {
    it('should prevent body scroll when drawer is open', () => {
      renderComponent(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when drawer is closed', () => {
      const { rerender } = renderComponent(true);
      expect(document.body.style.overflow).toBe('hidden');

      useAuth.mockReturnValue({ user: mockGuestUser });
      rerender(
        <BrowserRouter>
          <MobileSidebar isOpen={false} onClose={mockOnClose} />
        </BrowserRouter>
      );

      expect(document.body.style.overflow).toBe('unset');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = renderComponent(true);
      expect(document.body.style.overflow).toBe('hidden');
      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide on desktop (lg:hidden)', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('lg:hidden');
    });

    it('should have proper mobile-only classes', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveClass('lg:hidden');
    });
  });

  describe('Styling and Theme', () => {
    it('should apply green theme for guest users', () => {
      renderComponent(true, mockGuestUser);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('bg-[#4E7B22]');
    });

    it('should apply green theme for host users', () => {
      renderComponent(true, mockHostUser);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('bg-[#4E7B22]');
    });

    it('should apply white theme for admin users', () => {
      renderComponent(true, mockAdminUser);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('bg-white');
    });

    it('should have shadow for depth', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('shadow-xl');
    });
  });

  describe('Scrollable Content', () => {
    it('should have scrollable navigation area', () => {
      const { container } = renderComponent(true, mockAdminUser);
      const scrollableArea = container.querySelector('.overflow-y-auto');
      expect(scrollableArea).toBeInTheDocument();
    });

    it('should use flex layout for proper footer positioning', () => {
      renderComponent(true);
      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('flex');
      expect(drawer).toHaveClass('flex-col');
    });
  });

  describe('Edge Cases', () => {
    it('should handle user without role gracefully', () => {
      const userWithoutRole = { firstName: 'Test', lastName: 'User', email: 'test@example.com' };
      renderComponent(true, userWithoutRole);
      // Should render without crashing
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle null user gracefully', () => {
      useAuth.mockReturnValue({ user: null });
      render(
        <BrowserRouter>
          <MobileSidebar isOpen={true} onClose={mockOnClose} />
        </BrowserRouter>
      );
      // Should render without crashing
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    it('should handle missing user properties', () => {
      const incompleteUser = { role: 'guest' };
      renderComponent(true, incompleteUser);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderComponent(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      renderComponent(true);
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
      expect(screen.getByLabelText('Logout')).toBeInTheDocument();
    });

    it('should have aria-hidden on backdrop', () => {
      const { container } = renderComponent(true);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
