import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
  describe('Responsive Padding', () => {
    it('should apply default responsive padding (p-4 md:p-6 lg:p-8)', () => {
      const { container } = render(
        <Card>
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-4', 'md:p-6', 'lg:p-8');
    });

    it('should apply no padding when padding="none"', () => {
      const { container } = render(
        <Card padding="none">
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-0');
      expect(card).not.toHaveClass('p-4');
    });

    it('should apply small responsive padding when padding="sm"', () => {
      const { container } = render(
        <Card padding="sm">
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-3', 'md:p-4');
    });

    it('should apply large responsive padding when padding="lg"', () => {
      const { container } = render(
        <Card padding="lg">
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-6', 'md:p-8', 'lg:p-10');
    });
  });

  describe('Hover Effects', () => {
    it('should not apply hover effects by default', () => {
      const { container } = render(
        <Card>
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).not.toHaveClass('hover:shadow-lg');
      expect(card).not.toHaveClass('active:shadow-lg');
    });

    it('should apply hover and active effects when hover=true', () => {
      const { container } = render(
        <Card hover={true}>
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-lg');
      expect(card).toHaveClass('active:shadow-lg');
      expect(card).toHaveClass('transition-shadow');
    });

    it('should apply both touch (active) and mouse (hover) effects', () => {
      const { container } = render(
        <Card hover={true}>
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      // Verify both hover (mouse) and active (touch) pseudo-classes are present
      expect(card.className).toContain('hover:shadow-lg');
      expect(card.className).toContain('active:shadow-lg');
    });
  });

  describe('Base Styling', () => {
    it('should always apply base card styles', () => {
      const { container } = render(
        <Card>
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-md');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('bg-white'); // Should still have base classes
    });
  });

  describe('Content Rendering', () => {
    it('should render children content', () => {
      render(
        <Card>
          <div>Test Content</div>
        </Card>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Prop Combinations', () => {
    it('should work with all props combined', () => {
      const { container } = render(
        <Card padding="lg" hover={true} className="extra-class">
          <div>Test Content</div>
        </Card>
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-6', 'md:p-8', 'lg:p-10');
      expect(card).toHaveClass('hover:shadow-lg');
      expect(card).toHaveClass('active:shadow-lg');
      expect(card).toHaveClass('extra-class');
      expect(card).toHaveClass('bg-white');
    });
  });
});
