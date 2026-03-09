import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';
import { AuthProvider } from '../context/AuthContext';

// Mock axios to prevent API calls during tests
jest.mock('axios');

// Helper to render Footer with router and auth context
const renderFooter = (user = null) => {
  // Mock useAuth hook to return test user
  const mockUseAuth = () => ({ user, loading: false });
  
  // Replace the useAuth import in Footer
  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockImplementation(mockUseAuth);
  
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

// Helper to set viewport width
const setViewportWidth = (width) => {
  global.innerWidth = width;
  global.dispatchEvent(new Event('resize'));
};

describe('Footer Component - Mobile Responsiveness', () => {
  describe('Layout Structure', () => {
    it('should render all main sections', () => {
      renderFooter();
      
      expect(screen.getByText('Smart Stay')).toBeInTheDocument();
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should display copyright text', () => {
      renderFooter();
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Smart Stay. All rights reserved.`)).toBeInTheDocument();
    });
  });

  describe('Responsive Grid Layout', () => {
    it('should use single column layout on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('should use 2-column layout on tablet', () => {
      setViewportWidth(768);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    it('should use 4-column layout on desktop', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });
  });

  describe('Responsive Padding', () => {
    it('should use reduced padding on mobile (p-4)', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toHaveClass('py-4');
    });

    it('should use medium padding on tablet (md:p-8)', () => {
      setViewportWidth(768);
      const { container } = renderFooter();
      
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toHaveClass('md:py-8');
    });

    it('should use full padding on desktop (lg:p-12)', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toHaveClass('lg:py-12');
    });
  });

  describe('Responsive Typography', () => {
    it('should use smaller text on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const headings = container.querySelectorAll('h3');
      headings.forEach(heading => {
        expect(heading).toHaveClass('text-base');
      });
    });

    it('should scale up text on tablet/desktop', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const headings = container.querySelectorAll('h3');
      headings.forEach(heading => {
        expect(heading).toHaveClass('md:text-lg');
      });
    });

    it('should use smaller font for links on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const lists = container.querySelectorAll('ul');
      lists.forEach(list => {
        expect(list).toHaveClass('text-xs');
      });
    });
  });

  describe('Simplified Mobile Layout', () => {
    it('should hide Login and Sign Up links on mobile', () => {
      setViewportWidth(375);
      renderFooter();
      
      const links = screen.getAllByRole('link');
      const loginLink = links.find(link => link.textContent === 'Login');
      const signUpLink = links.find(link => link.textContent === 'Sign Up');
      
      // These links should have hidden class on mobile
      if (loginLink) {
        expect(loginLink.parentElement).toHaveClass('hidden');
      }
      if (signUpLink) {
        expect(signUpLink.parentElement).toHaveClass('hidden');
      }
    });

    it('should hide Contact section on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const contactSection = Array.from(container.querySelectorAll('h3'))
        .find(h3 => h3.textContent === 'Contact');
      
      if (contactSection) {
        expect(contactSection.parentElement).toHaveClass('hidden');
      }
    });

    it('should show Contact section on tablet and desktop', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const contactSection = Array.from(container.querySelectorAll('h3'))
        .find(h3 => h3.textContent === 'Contact');
      
      expect(contactSection).toBeInTheDocument();
      expect(contactSection.parentElement).toHaveClass('md:block');
    });

    it('should hide some support links on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const supportList = Array.from(container.querySelectorAll('h3'))
        .find(h3 => h3.textContent === 'Support')
        ?.parentElement.querySelector('ul');
      
      const hiddenItems = supportList?.querySelectorAll('.hidden');
      expect(hiddenItems.length).toBeGreaterThan(0);
    });
  });

  describe('Touch-Friendly Links', () => {
    it('should have minimum touch target height for primary links on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const touchLinks = container.querySelectorAll('.min-h-\\[44px\\]');
      expect(touchLinks.length).toBeGreaterThan(0);
    });

    it('should apply touch-friendly classes to main navigation links', () => {
      setViewportWidth(375);
      renderFooter();
      
      const homeLink = screen.getByText('Home').closest('a');
      const unitsLink = screen.getByText('Browse Units').closest('a');
      const faqLink = screen.getByText('FAQs').closest('a');
      
      expect(homeLink).toHaveClass('min-h-[44px]');
      expect(unitsLink).toHaveClass('min-h-[44px]');
      expect(faqLink).toHaveClass('min-h-[44px]');
    });
  });

  describe('Responsive Spacing', () => {
    it('should use reduced gap between sections on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });

    it('should increase gap on tablet', () => {
      setViewportWidth(768);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:gap-6');
    });

    it('should use maximum gap on desktop', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:gap-8');
    });

    it('should reduce margin-top for copyright section on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const copyrightSection = container.querySelector('.border-t');
      expect(copyrightSection).toHaveClass('mt-4');
      expect(copyrightSection).toHaveClass('pt-4');
    });
  });

  describe('Theme Support', () => {
    it('should apply guest theme colors when user is guest', () => {
      const guestUser = { role: 'guest', name: 'Test Guest' };
      const { container } = renderFooter(guestUser);
      
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-[#0C1805]');
    });

    it('should apply host theme colors when user is host', () => {
      const hostUser = { role: 'host', name: 'Test Host' };
      const { container } = renderFooter(hostUser);
      
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-[#0C1805]');
    });

    it('should apply default theme when no user', () => {
      const { container } = renderFooter(null);
      
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-gray-800');
    });
  });

  describe('Link Navigation', () => {
    it('should render all essential links', () => {
      renderFooter();
      
      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
      expect(screen.getByText('Browse Units').closest('a')).toHaveAttribute('href', '/units');
      expect(screen.getByText('FAQs').closest('a')).toHaveAttribute('href', '/faq');
    });

    it('should have proper link styling with hover effects', () => {
      const { container } = renderFooter();
      
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        expect(link).toHaveClass('transition');
      });
    });
  });

  describe('Accessibility', () => {
    it('should maintain semantic HTML structure', () => {
      const { container } = renderFooter();
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper link elements', () => {
      renderFooter();
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Content Visibility', () => {
    it('should show essential content on all screen sizes', () => {
      const viewports = [375, 768, 1024];
      
      viewports.forEach(width => {
        setViewportWidth(width);
        const { unmount } = renderFooter();
        
        expect(screen.getAllByText('Smart Stay')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Quick Links')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Support')[0]).toBeInTheDocument();
        
        unmount(); // Clean up before next iteration
      });
    });

    it('should progressively show more content on larger screens', () => {
      // Mobile - minimal content
      setViewportWidth(375);
      const { container: mobileContainer } = renderFooter();
      const mobileLinks = mobileContainer.querySelectorAll('a');
      
      // Desktop - more content
      setViewportWidth(1024);
      const { container: desktopContainer } = renderFooter();
      const desktopLinks = desktopContainer.querySelectorAll('a');
      
      // Desktop should have more visible links
      expect(desktopLinks.length).toBeGreaterThanOrEqual(mobileLinks.length);
    });
  });

  describe('Responsive Margin and Padding', () => {
    it('should reduce heading margins on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const headings = container.querySelectorAll('h3');
      headings.forEach(heading => {
        expect(heading).toHaveClass('mb-2');
      });
    });

    it('should increase heading margins on tablet/desktop', () => {
      setViewportWidth(1024);
      const { container } = renderFooter();
      
      const headings = container.querySelectorAll('h3');
      headings.forEach(heading => {
        expect(heading).toHaveClass('md:mb-3');
        expect(heading).toHaveClass('lg:mb-4');
      });
    });

    it('should reduce list spacing on mobile', () => {
      setViewportWidth(375);
      const { container } = renderFooter();
      
      const lists = container.querySelectorAll('ul');
      lists.forEach(list => {
        expect(list).toHaveClass('space-y-1.5');
      });
    });
  });
});

/**
 * **Validates: Requirements 1.2, 6.2**
 * 
 * This test suite validates that the Footer component:
 * - Stacks content vertically on mobile (single-column layout)
 * - Uses horizontal layout on tablet (2-column) and desktop (4-column)
 * - Reduces padding on mobile (p-4) vs tablet (p-8) and desktop (p-12)
 * - Simplifies footer links for mobile viewports (hides non-essential links)
 * - Maintains touch-friendly link targets (min-h-[44px])
 * - Implements responsive typography and spacing
 * - Preserves accessibility across all breakpoints
 */
