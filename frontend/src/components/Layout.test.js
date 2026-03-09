import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { AuthProvider } from '../context/AuthContext';

// Mock child components
jest.mock('./Navbar', () => {
  return function MockNavbar({ onMobileSidebarToggle }) {
    return (
      <nav data-testid="navbar">
        <button onClick={onMobileSidebarToggle} data-testid="burger-menu">
          Menu
        </button>
      </nav>
    );
  };
});

jest.mock('./MobileSidebar', () => {
  return function MockMobileSidebar({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <aside data-testid="mobile-sidebar">
        <button onClick={onClose} data-testid="close-sidebar">
          Close
        </button>
      </aside>
    );
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    user: { role: 'guest', firstName: 'Test', lastName: 'User', email: 'test@example.com' },
  }),
}));

const renderLayout = (props = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Layout {...props}>
          <div data-testid="content">Test Content</div>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  describe('Basic Rendering', () => {
    it('should render navbar, content, and footer by default', () => {
      renderLayout();
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render children content', () => {
      renderLayout();
      
      expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
    });

    it('should hide footer when showFooter is false', () => {
      renderLayout({ showFooter: false });
      
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });
  });

  describe('MobileSidebar Integration', () => {
    it('should not render MobileSidebar initially', () => {
      renderLayout();
      
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
    });

    it('should render MobileSidebar when burger menu is clicked', () => {
      renderLayout();
      
      const burgerMenu = screen.getByTestId('burger-menu');
      fireEvent.click(burgerMenu);
      
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });

    it('should close MobileSidebar when close button is clicked', () => {
      renderLayout();
      
      // Open sidebar
      const burgerMenu = screen.getByTestId('burger-menu');
      fireEvent.click(burgerMenu);
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
      
      // Close sidebar
      const closeButton = screen.getByTestId('close-sidebar');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
    });

    it('should toggle MobileSidebar multiple times', () => {
      renderLayout();
      
      const burgerMenu = screen.getByTestId('burger-menu');
      
      // Open
      fireEvent.click(burgerMenu);
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
      
      // Close
      fireEvent.click(screen.getByTestId('close-sidebar'));
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
      
      // Open again
      fireEvent.click(burgerMenu);
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct flex layout structure', () => {
      const { container } = renderLayout();
      
      const layoutDiv = container.querySelector('.flex.flex-col.min-h-screen');
      expect(layoutDiv).toBeInTheDocument();
    });

    it('should have flex-grow on main content area', () => {
      renderLayout();
      
      const main = screen.getByTestId('content').parentElement;
      expect(main).toHaveClass('flex-grow');
    });
  });

  describe('Responsive Behavior', () => {
    it('should pass onMobileSidebarToggle to Navbar', () => {
      renderLayout();
      
      const burgerMenu = screen.getByTestId('burger-menu');
      expect(burgerMenu).toBeInTheDocument();
      
      // Verify clicking burger menu opens sidebar
      fireEvent.click(burgerMenu);
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });

    it('should pass isOpen prop to MobileSidebar', () => {
      renderLayout();
      
      // Initially closed
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
      
      // Open sidebar
      fireEvent.click(screen.getByTestId('burger-menu'));
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });

    it('should pass onClose prop to MobileSidebar', () => {
      renderLayout();
      
      // Open sidebar
      fireEvent.click(screen.getByTestId('burger-menu'));
      
      // Verify close button works
      const closeButton = screen.getByTestId('close-sidebar');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
    });
  });
});
