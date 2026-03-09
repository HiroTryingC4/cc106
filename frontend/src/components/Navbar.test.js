import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as AuthContext from '../context/AuthContext';

// Mock the useAuth hook
const mockUseAuth = (authValue) => {
  jest.spyOn(AuthContext, 'useAuth').mockReturnValue(authValue);
};

const renderNavbar = (authValue = { user: null, logout: jest.fn() }) => {
  mockUseAuth(authValue);
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar Component - Mobile Responsiveness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Responsive Logo Sizing', () => {
    it('should render logo with responsive text classes', () => {
      renderNavbar();
      const logo = screen.getByText('Smart Stay');
      
      // Check for responsive text size classes
      expect(logo.className).toMatch(/text-xl/);
      expect(logo.className).toMatch(/md:text-2xl/);
      expect(logo.className).toMatch(/lg:text-3xl/);
    });
  });

  describe('Hamburger Menu Button', () => {
    it('should render hamburger button with touch-optimized sizing', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Check for minimum 44px touch target
      expect(menuButton.className).toMatch(/min-h-\[44px\]/);
      expect(menuButton.className).toMatch(/min-w-\[44px\]/);
    });

    it('should have proper ARIA attributes', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle mobile menu when clicked', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Initially closed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to open
      fireEvent.click(menuButton);
      
      // Should change to close icon and update aria-expanded
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should display mobile menu items when opened', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Check for mobile menu items
      const mobileLinks = screen.getAllByRole('link');
      expect(mobileLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Desktop Navigation Visibility', () => {
    it('should hide desktop navigation on mobile with lg:flex class', () => {
      renderNavbar();
      
      // Find the desktop navigation container
      const desktopNav = document.querySelector('.hidden.lg\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });
  });

  describe('Mobile Menu Items Touch Targets', () => {
    it('should render mobile menu items with minimum 44px height', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Check mobile menu links - get the parent element that has the min-h class
      const unitsLinks = screen.getAllByText('Units');
      const mobileUnitsLink = unitsLinks.find(link => 
        link.className.includes('block') && link.className.includes('min-h-[44px]')
      );
      expect(mobileUnitsLink).toBeTruthy();
      expect(mobileUnitsLink.className).toMatch(/min-h-\[44px\]/);
    });
  });

  describe('Guest/Host User View', () => {
    it('should render notification bell with touch-optimized sizing for guest users', () => {
      const guestAuthContext = {
        user: { role: 'guest', firstName: 'John' },
        logout: jest.fn(),
      };
      
      renderNavbar(guestAuthContext);
      const notificationLink = screen.getByLabelText('Notifications');
      
      // Check for minimum 44px touch target
      expect(notificationLink.className).toMatch(/min-h-\[44px\]/);
      expect(notificationLink.className).toMatch(/min-w-\[44px\]/);
    });

    it('should hide date display on mobile for guest users', () => {
      const guestAuthContext = {
        user: { role: 'guest', firstName: 'John' },
        logout: jest.fn(),
      };
      
      renderNavbar(guestAuthContext);
      
      // Date display should have hidden md:flex classes
      const dateDisplay = document.querySelector('.hidden.md\\:flex');
      expect(dateDisplay).toBeInTheDocument();
    });
  });

  describe('Responsive Spacing', () => {
    it('should use responsive padding on navbar container', () => {
      renderNavbar();
      
      // Check for responsive padding classes
      const navContainer = document.querySelector('.px-4.md\\:px-6');
      expect(navContainer).toBeInTheDocument();
    });

    it('should use responsive spacing between elements', () => {
      const guestAuthContext = {
        user: { role: 'guest', firstName: 'John' },
        logout: jest.fn(),
      };
      
      renderNavbar(guestAuthContext);
      
      // Check for responsive spacing
      const rightSection = document.querySelector('.space-x-2.md\\:space-x-4');
      expect(rightSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain focus indicators on interactive elements', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Check for focus ring classes
      expect(menuButton.className).toMatch(/focus:outline-none/);
      expect(menuButton.className).toMatch(/focus:ring-2/);
    });

    it('should close mobile menu when menu item is clicked', () => {
      renderNavbar();
      const menuButton = screen.getByLabelText('Open menu');
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Verify menu is open
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
      
      // Click a menu item
      const unitsLinks = screen.getAllByText('Units');
      const mobileUnitsLink = unitsLinks.find(link => 
        link.className.includes('block') && link.className.includes('min-h-[44px]')
      );
      fireEvent.click(mobileUnitsLink);
      
      // Menu should be closed (button should say "Open menu" again)
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });
  });

  describe('Breakpoint Behavior', () => {
    it('should show hamburger menu button only below lg breakpoint', () => {
      renderNavbar();
      
      // Hamburger button container should have lg:hidden class
      const hamburgerContainer = document.querySelector('.lg\\:hidden');
      expect(hamburgerContainer).toBeInTheDocument();
    });

    it('should show desktop navigation only at lg breakpoint and above', () => {
      renderNavbar();
      
      // Desktop nav should have hidden lg:flex classes
      const desktopNav = document.querySelector('.hidden.lg\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });
  });
});
