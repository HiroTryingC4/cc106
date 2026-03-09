import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Input Component', () => {
  describe('Mobile-First Responsive Styling', () => {
    it('should apply full-width styling', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('w-full');
    });

    it('should apply minimum 44px height for touch interaction', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('min-h-[44px]');
    });

    it('should apply responsive padding (mobile: px-3 py-2, tablet+: md:px-4 md:py-2.5)', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('px-3', 'py-2');
      expect(input).toHaveClass('md:px-4', 'md:py-2.5');
    });

    it('should apply minimum 16px font size on mobile to prevent iOS auto-zoom', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('text-base'); // text-base = 16px
    });

    it('should apply responsive font size (mobile: text-base, tablet+: md:text-sm)', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('text-base', 'md:text-sm');
    });

    it('should apply rounded-lg border radius', () => {
      const { container } = render(
        <Input name="test" label="Test Input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('rounded-lg');
    });
  });

  describe('Responsive Label Sizing', () => {
    it('should apply responsive label font size (mobile: text-base, tablet+: md:text-sm)', () => {
      const { container } = render(
        <Input name="test" label="Test Label" />
      );
      
      const label = container.querySelector('label');
      expect(label).toHaveClass('text-base', 'md:text-sm');
    });

    it('should apply responsive label margin (mobile: mb-1.5, tablet+: md:mb-1)', () => {
      const { container } = render(
        <Input name="test" label="Test Label" />
      );
      
      const label = container.querySelector('label');
      expect(label).toHaveClass('mb-1.5', 'md:mb-1');
    });

    it('should render label with required indicator', () => {
      render(
        <Input name="test" label="Required Field" required={true} />
      );
      
      expect(screen.getByText('Required Field')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-red-500');
    });

    it('should not render label when not provided', () => {
      const { container } = render(
        <Input name="test" />
      );
      
      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('Responsive Error Message Sizing', () => {
    it('should apply responsive error message font size (mobile: text-base, tablet+: md:text-sm)', () => {
      const { container } = render(
        <Input name="test" label="Test" error="Error message" />
      );
      
      const errorMsg = container.querySelector('.text-red-500');
      expect(errorMsg).toHaveClass('text-base', 'md:text-sm');
    });

    it('should display error message when error prop is provided', () => {
      render(
        <Input name="test" label="Test" error="This field is required" />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should apply red border when error is present', () => {
      const { container } = render(
        <Input name="test" label="Test" error="Error" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });

    it('should not display helper text when error is present', () => {
      render(
        <Input 
          name="test" 
          label="Test" 
          error="Error message"
          helperText="Helper text"
        />
      );
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text Styling', () => {
    it('should apply responsive helper text font size (mobile: text-base, tablet+: md:text-sm)', () => {
      const { container } = render(
        <Input name="test" label="Test" helperText="Helper text" />
      );
      
      const helperText = container.querySelector('.text-gray-500');
      expect(helperText).toHaveClass('text-base', 'md:text-sm');
    });

    it('should display helper text when provided and no error', () => {
      render(
        <Input name="test" label="Test" helperText="This is helpful" />
      );
      
      expect(screen.getByText('This is helpful')).toBeInTheDocument();
    });
  });

  describe('Input Types and Attributes', () => {
    it('should default to text type', () => {
      const { container } = render(
        <Input name="test" label="Test" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should accept different input types', () => {
      const { container } = render(
        <Input name="email" label="Email" type="email" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should apply name attribute', () => {
      const { container } = render(
        <Input name="username" label="Username" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should apply placeholder', () => {
      const { container } = render(
        <Input name="test" label="Test" placeholder="Enter text" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('should apply required attribute', () => {
      const { container } = render(
        <Input name="test" label="Test" required={true} />
      );
      
      const input = container.querySelector('input');
      expect(input).toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styles', () => {
      const { container } = render(
        <Input name="test" label="Test" disabled={true} />
      );
      
      const input = container.querySelector('input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('bg-gray-100', 'cursor-not-allowed');
    });

    it('should not apply disabled styles by default', () => {
      const { container } = render(
        <Input name="test" label="Test" />
      );
      
      const input = container.querySelector('input');
      expect(input).not.toBeDisabled();
      expect(input).toHaveClass('bg-white');
    });
  });

  describe('Value and onChange', () => {
    it('should display value', () => {
      const { container } = render(
        <Input name="test" label="Test" value="Test value" onChange={() => {}} />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveValue('Test value');
    });

    it('should call onChange when value changes', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Input name="test" label="Test" value="" onChange={handleChange} />
      );
      
      const input = container.querySelector('input');
      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className for wrapper', () => {
      const { container } = render(
        <Input name="test" label="Test" className="custom-wrapper" />
      );
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-wrapper');
      expect(wrapper).toHaveClass('mb-4'); // Should still have base classes
    });

    it('should accept custom inputClassName for input element', () => {
      const { container } = render(
        <Input name="test" label="Test" inputClassName="custom-input" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass('w-full'); // Should still have base classes
    });

    it('should work with both className and inputClassName', () => {
      const { container } = render(
        <Input 
          name="test" 
          label="Test" 
          className="custom-wrapper"
          inputClassName="custom-input"
        />
      );
      
      const wrapper = container.firstChild;
      const input = container.querySelector('input');
      expect(wrapper).toHaveClass('custom-wrapper');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Focus Styles', () => {
    it('should apply focus ring styles', () => {
      const { container } = render(
        <Input name="test" label="Test" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('focus:ring-primary');
      expect(input).toHaveClass('focus:border-transparent');
    });
  });

  describe('Border Styles', () => {
    it('should apply default border color when no error', () => {
      const { container } = render(
        <Input name="test" label="Test" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-gray-300');
    });

    it('should apply error border color when error is present', () => {
      const { container } = render(
        <Input name="test" label="Test" error="Error" />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input via htmlFor and id', () => {
      const { container } = render(
        <Input name="username" label="Username" />
      );
      
      const label = container.querySelector('label');
      const input = container.querySelector('input');
      
      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should be keyboard accessible', () => {
      const { container } = render(
        <Input name="test" label="Test" />
      );
      
      const input = container.querySelector('input');
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe('Additional Props', () => {
    it('should pass through additional props to input element', () => {
      const { container } = render(
        <Input 
          name="test" 
          label="Test"
          maxLength={10}
          autoComplete="off"
          data-testid="custom-input"
        />
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('maxLength', '10');
      expect(input).toHaveAttribute('autoComplete', 'off');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
    });
  });

  describe('Prop Combinations', () => {
    it('should work with all props combined', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Input
          name="email"
          label="Email Address"
          type="email"
          value="test@example.com"
          onChange={handleChange}
          placeholder="Enter your email"
          required={true}
          helperText="We'll never share your email"
          className="custom-wrapper"
          inputClassName="custom-input"
        />
      );
      
      const wrapper = container.firstChild;
      const input = container.querySelector('input');
      const label = container.querySelector('label');
      
      expect(wrapper).toHaveClass('custom-wrapper', 'mb-4');
      expect(input).toHaveClass('custom-input', 'w-full', 'min-h-[44px]');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveValue('test@example.com');
      expect(input).toHaveAttribute('placeholder', 'Enter your email');
      expect(input).toBeRequired();
      expect(label).toBeInTheDocument();
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
      
      fireEvent.change(input, { target: { value: 'new@example.com' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should prioritize error message over helper text', () => {
      render(
        <Input
          name="test"
          label="Test"
          error="This is an error"
          helperText="This is helper text"
        />
      );
      
      expect(screen.getByText('This is an error')).toBeInTheDocument();
      expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
    });
  });
});
