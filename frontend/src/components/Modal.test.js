import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal Component - Responsive Behavior', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal Content</div>
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = 'unset';
  });

  describe('Basic Functionality', () => {
    it('should render when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should prevent body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Responsive Sizing - Requirement 12.1, 12.4', () => {
    it('should apply full-screen styling on mobile (no rounded corners)', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const modalContent = container.querySelector('.bg-white.shadow-xl');
      
      // Check for rounded-none class (mobile) and md:rounded-lg (desktop)
      expect(modalContent.className).toContain('rounded-none');
      expect(modalContent.className).toContain('md:rounded-lg');
    });

    it('should have no padding on mobile, padding on desktop', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const centeringWrapper = container.querySelector('.flex.min-h-full');
      
      // Check for p-0 (mobile) and md:p-4 (desktop)
      expect(centeringWrapper.className).toContain('p-0');
      expect(centeringWrapper.className).toContain('md:p-4');
    });

    it('should apply correct size classes for different size props', () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full'];
      
      sizes.forEach(size => {
        const { container } = render(<Modal {...defaultProps} size={size} />);
        const modalContent = container.querySelector('.bg-white.shadow-xl');
        
        // All sizes should have max-w class
        expect(modalContent.className).toMatch(/max-w-/);
      });
    });

    it('should have max-h-screen on mobile and max-h-[90vh] on desktop', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const modalContent = container.querySelector('.bg-white.shadow-xl');
      
      expect(modalContent.className).toContain('max-h-screen');
      expect(modalContent.className).toContain('md:max-h-[90vh]');
    });
  });

  describe('Responsive Padding - Requirement 12.2', () => {
    it('should apply mobile padding (p-4) to header', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const header = container.querySelector('.sticky.top-0');
      
      expect(header.className).toContain('px-4');
      expect(header.className).toContain('py-3');
    });

    it('should apply desktop padding (md:p-6) to header', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const header = container.querySelector('.sticky.top-0');
      
      expect(header.className).toContain('md:px-6');
      expect(header.className).toContain('md:py-4');
    });

    it('should apply mobile padding (p-4) to content', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const content = container.querySelector('.px-4.py-4');
      
      expect(content).toBeInTheDocument();
    });

    it('should apply desktop padding (md:p-6) to content', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const content = container.querySelector('.px-4.py-4');
      
      expect(content.className).toContain('md:px-6');
      expect(content.className).toContain('md:py-6');
    });
  });

  describe('Sticky Header - Requirement 12.3', () => {
    it('should have sticky header with top-0', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const header = container.querySelector('.sticky.top-0');
      
      expect(header).toBeInTheDocument();
      expect(header.className).toContain('sticky');
      expect(header.className).toContain('top-0');
    });

    it('should have z-10 on header to stay above content', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const header = container.querySelector('.sticky.top-0');
      
      expect(header.className).toContain('z-10');
    });

    it('should have white background on sticky header', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const header = container.querySelector('.sticky.top-0');
      
      expect(header.className).toContain('bg-white');
    });
  });

  describe('Touch-Friendly Close Button - Requirement 4.1, 4.2', () => {
    it('should have minimum 44px height for touch target', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      
      expect(closeButton.className).toContain('min-h-[44px]');
    });

    it('should have minimum 44px width for touch target', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      
      expect(closeButton.className).toContain('min-w-[44px]');
    });

    it('should have flex centering for icon', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      
      expect(closeButton.className).toContain('flex');
      expect(closeButton.className).toContain('items-center');
      expect(closeButton.className).toContain('justify-center');
    });
  });

  describe('Vertical Scrolling - Requirement 12.3', () => {
    it('should have overflow-y-auto on modal container', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const scrollContainer = container.querySelector('.fixed.inset-0.overflow-y-auto');
      
      expect(scrollContainer).toBeInTheDocument();
    });

    it('should have overflow-y-auto on modal content', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const modalContent = container.querySelector('.bg-white.shadow-xl');
      
      expect(modalContent.className).toContain('overflow-y-auto');
    });
  });

  describe('Responsive Typography - Requirement 5.1', () => {
    it('should have responsive title sizing', () => {
      render(<Modal {...defaultProps} />);
      const title = screen.getByText('Test Modal');
      
      expect(title.className).toContain('text-lg');
      expect(title.className).toContain('md:text-xl');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on close button', () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      
      expect(closeButton).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Modal {...defaultProps} />);
      const title = screen.getByText('Test Modal');
      
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Long Content Handling', () => {
    it('should handle long content with scrolling', () => {
      const longContent = (
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>Line {i + 1} of content</p>
          ))}
        </div>
      );

      const { container } = render(
        <Modal {...defaultProps}>
          {longContent}
        </Modal>
      );

      const modalContent = container.querySelector('.bg-white.shadow-xl');
      expect(modalContent.className).toContain('overflow-y-auto');
    });
  });

  describe('Form Content Accessibility - Requirement 12.3', () => {
    it('should ensure form fields are accessible within modal', () => {
      const formContent = (
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      );

      render(
        <Modal {...defaultProps}>
          {formContent}
        </Modal>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
