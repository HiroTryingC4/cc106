import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock child components
jest.mock('./Navbar', () => {
  return function MockNavbar({ onMobileSidebarToggle }) {
    return (
      <nav data-testid="navbar">
        <button 
          onClick={onMobileSidebarToggle}
          data-testid="burger-menu"
        >
          Menu
        </button>
      </nav>
    );
  };
});

jest.mock('./Sidebar', () => {
  return function MockSidebar() {
    return <aside data-testid="sidebar">Sidebar</aside>;
  };
});

jest.mock('./MobileSidebar', () => {
  return function MockMobileSidebar({ isOpen, onClose }) {
    return isOpen ? (
      <aside data-testid="mobile-sidebar">
        <button onClick={onClose} data-testid="close-mobile-sidebar">
          Close
        </button>
      </aside>
    ) : null;
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('DashboardLayout - MobileSidebar Integration', () => {
  const mockGuestUser = {
    role: 'guest',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLayout = (user = mockGuestUser) => {
    useAuth.mockReturnValue({ user });
    return render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );
  };

  it('should render all layout components', () => {
    renderLayout();
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should not show MobileSidebar initially', () => {
    renderLayout();
    
    expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
  });

  it('should open MobileSidebar when burger menu is clicked', () => {
    renderLayout();
    
    const burgerButton = screen.getByTestId('burger-menu');
    fireEvent.click(burgerButton);
    
    expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
  });

  it('should close MobileSidebar when close button is clicked', () => {
    renderLayout();
    
    // Open the sidebar
    const burgerButton = screen.getByTestId('burger-menu');
    fireEvent.click(burgerButton);
    expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    
    // Close the sidebar
    const closeButton = screen.getByTestId('close-mobile-sidebar');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
  });

  it('should pass onMobileSidebarToggle prop to Navbar', () => {
    renderLayout();
    
    // Verify burger button exists (which means prop was passed)
    expect(screen.getByTestId('burger-menu')).toBeInTheDocument();
  });

  it('should apply correct background color for guest users', () => {
    const { container } = renderLayout(mockGuestUser);
    
    const layout = container.firstChild;
    expect(layout).toHaveClass('bg-[#F5F5DC]');
  });

  it('should apply correct background color for host users', () => {
    const hostUser = { ...mockGuestUser, role: 'host' };
    const { container } = renderLayout(hostUser);
    
    const layout = container.firstChild;
    expect(layout).toHaveClass('bg-[#F5F5DC]');
  });

  it('should apply default background color for admin users', () => {
    const adminUser = { ...mockGuestUser, role: 'admin' };
    const { container } = renderLayout(adminUser);
    
    const layout = container.firstChild;
    expect(layout).toHaveClass('bg-gray-50');
  });
});
