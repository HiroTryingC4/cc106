import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
  describe('Touch-Optimized Sizing', () => {
    it('should apply minimum 44px height for small size', () => {
      const { container } = render(
        <Button size="sm">Small Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('min-h-[44px]');
      expect(button).toHaveClass('min-w-[44px]');
    });

    it('should apply minimum 44px height for medium size on mobile', () => {
      const { container } = render(
        <Button size="md">Medium Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('should apply responsive height for medium size (48px on tablet+)', () => {
      const { container } = render(
        <Button size="md">Medium Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('md:min-h-[48px]');
    });

    it('should apply minimum 44px height for large size on mobile', () => {
      const { container } = render(
        <Button size="lg">Large Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('should apply responsive height for large size (52px on tablet+)', () => {
      const { container } = render(
        <Button size="lg">Large Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('md:min-h-[52px]');
    });
  });

  describe('Responsive Size Variants', () => {
    it('should apply small size styles', () => {
      const { container } = render(
        <Button size="sm">Small</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('should apply medium size styles (default)', () => {
      const { container } = render(
        <Button>Medium</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should apply large size styles', () => {
      const { container } = render(
        <Button size="lg">Large</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('Full Width Prop', () => {
    it('should not be full width by default', () => {
      const { container } = render(
        <Button>Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).not.toHaveClass('w-full');
    });

    it('should apply full width when fullWidth=true', () => {
      const { container } = render(
        <Button fullWidth={true}>Full Width Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('w-full');
    });

    it('should work with fullWidth and different sizes', () => {
      const { container } = render(
        <Button fullWidth={true} size="lg">Full Width Large</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('Button Variants', () => {
    it('should apply primary variant by default', () => {
      const { container } = render(
        <Button>Primary</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('bg-primary', 'text-white');
    });

    it('should apply secondary variant', () => {
      const { container } = render(
        <Button variant="secondary">Secondary</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });

    it('should apply danger variant', () => {
      const { container } = render(
        <Button variant="danger">Danger</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('bg-red-600', 'text-white');
    });

    it('should apply success variant', () => {
      const { container } = render(
        <Button variant="success">Success</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('bg-green-600', 'text-white');
    });

    it('should apply outline variant', () => {
      const { container } = render(
        <Button variant="outline">Outline</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('border-2', 'border-primary', 'text-primary');
    });
  });

  describe('Base Styling', () => {
    it('should always apply base button styles', () => {
      const { container } = render(
        <Button>Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('font-medium');
      expect(button).toHaveClass('rounded-md');
      expect(button).toHaveClass('transition');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Button className="custom-class">Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('font-medium'); // Should still have base classes
    });
  });

  describe('Button Behavior', () => {
    it('should render children content', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should handle onClick events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled={true}>
          Disabled
        </Button>
      );
      
      const button = screen.getByText('Disabled');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled styles', () => {
      const { container } = render(
        <Button disabled={true}>Disabled</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('cursor-not-allowed', 'opacity-60');
      expect(button).toBeDisabled();
    });

    it('should apply correct button type', () => {
      const { container } = render(
        <Button type="submit">Submit</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should default to button type', () => {
      const { container } = render(
        <Button>Button</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Prop Combinations', () => {
    it('should work with all props combined', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Button
          size="lg"
          variant="success"
          fullWidth={true}
          onClick={handleClick}
          className="extra-class"
        >
          Combined Props
        </Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
      expect(button).toHaveClass('min-h-[44px]', 'md:min-h-[52px]');
      expect(button).toHaveClass('bg-green-600', 'text-white');
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('extra-class');
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should work with fullWidth and small size for mobile layouts', () => {
      const { container } = render(
        <Button size="sm" fullWidth={true}>
          Mobile Full Width
        </Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('min-h-[44px]');
      expect(button).toHaveClass('min-w-[44px]');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Accessible</Button>);
      
      const button = screen.getByText('Accessible');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have focus ring styles', () => {
      const { container } = render(
        <Button>Focus Ring</Button>
      );
      
      const button = container.firstChild;
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:ring-offset-2');
    });
  });
});
