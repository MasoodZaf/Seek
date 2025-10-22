import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-secondary-100', 'text-secondary-800');
    });

    it('renders children correctly', () => {
      render(<Badge>Test Content</Badge>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Badge className="custom-badge">Test</Badge>);
      const badge = screen.getByText('Test');
      expect(badge).toHaveClass('custom-badge');
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'primary', 'success', 'warning', 'error'];
    
    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Badge variant={variant}>Badge {variant}</Badge>);
        const badge = screen.getByText(`Badge ${variant}`);
        
        if (variant === 'default') {
          expect(badge).toHaveClass('bg-secondary-100', 'text-secondary-800');
        } else {
          expect(badge).toHaveClass(`bg-${variant}-100`, `text-${variant}-800`);
        }
      });
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Badge size={size}>Badge {size}</Badge>);
        const badge = screen.getByText(`Badge ${size}`);
        
        const sizeClasses = {
          sm: ['px-2', 'py-0.5', 'text-xs'],
          md: ['px-2.5', 'py-1', 'text-xs'],
          lg: ['px-3', 'py-1.5', 'text-sm']
        };
        
        sizeClasses[size].forEach(className => {
          expect(badge).toHaveClass(className);
        });
      });
    });
  });

  describe('Base Classes', () => {
    it('applies base styling classes', () => {
      render(<Badge>Test Badge</Badge>);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-full',
        'font-medium'
      );
    });

    it('renders as span element', () => {
      render(<Badge>Test Badge</Badge>);
      const badge = screen.getByText('Test Badge');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Custom Props', () => {
    it('passes through additional props', () => {
      render(<Badge data-testid="custom-badge" title="Badge tooltip">Test</Badge>);
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toHaveAttribute('title', 'Badge tooltip');
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable Badge</Badge>);
      const badge = screen.getByText('Clickable Badge');
      
      badge.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Handling', () => {
    it('handles numeric content', () => {
      render(<Badge>{42}</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('handles JSX content', () => {
      render(
        <Badge>
          <span>Complex</span> Content
        </Badge>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles empty content gracefully', () => {
      render(<Badge></Badge>);
      const badge = document.querySelector('.inline-flex.items-center.rounded-full');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(
        <Badge 
          aria-label="Status badge" 
          role="status"
          aria-live="polite"
        >
          Active
        </Badge>
      );
      const badge = screen.getByText('Active');
      expect(badge).toHaveAttribute('aria-label', 'Status badge');
      expect(badge).toHaveAttribute('role', 'status');
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });

    it('maintains semantic meaning', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('text-error-800');
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent border radius', () => {
      render(<Badge>Rounded Badge</Badge>);
      const badge = screen.getByText('Rounded Badge');
      expect(badge).toHaveClass('rounded-full');
    });

    it('maintains consistent font weight', () => {
      render(<Badge>Medium Weight</Badge>);
      const badge = screen.getByText('Medium Weight');
      expect(badge).toHaveClass('font-medium');
    });

    it('maintains inline-flex display', () => {
      render(<Badge>Inline Badge</Badge>);
      const badge = screen.getByText('Inline Badge');
      expect(badge).toHaveClass('inline-flex', 'items-center');
    });
  });

  describe('Color Combinations', () => {
    it('ensures proper contrast for primary variant', () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
    });

    it('ensures proper contrast for success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-success-100', 'text-success-800');
    });

    it('ensures proper contrast for warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-warning-100', 'text-warning-800');
    });

    it('ensures proper contrast for error variant', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-error-100', 'text-error-800');
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains size consistency across different content lengths', () => {
      const { rerender } = render(<Badge size="md">A</Badge>);
      const shortBadge = screen.getByText('A');
      expect(shortBadge).toHaveClass('px-2.5', 'py-1');

      rerender(<Badge size="md">Very Long Badge Text</Badge>);
      const longBadge = screen.getByText('Very Long Badge Text');
      expect(longBadge).toHaveClass('px-2.5', 'py-1');
    });

    it('scales appropriately with different sizes', () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);
      let badge = screen.getByText('Small');
      expect(badge).toHaveClass('text-xs');

      rerender(<Badge size="lg">Large</Badge>);
      badge = screen.getByText('Large');
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long text content', () => {
      const longText = 'This is a very long badge text that might wrap or overflow';
      render(<Badge>{longText}</Badge>);
      const badge = screen.getByText(longText);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex');
    });

    it('handles special characters', () => {
      render(<Badge>★ ♥ ✓ ⚠ ✗</Badge>);
      const badge = screen.getByText('★ ♥ ✓ ⚠ ✗');
      expect(badge).toBeInTheDocument();
    });

    it('handles whitespace-only content', () => {
      render(<Badge>   </Badge>);
      const badge = document.querySelector('.inline-flex.items-center.rounded-full');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works well within other components', () => {
      render(
        <div>
          <h1>Title <Badge variant="primary">New</Badge></h1>
          <p>Description with <Badge variant="success">Status</Badge> badge</p>
        </div>
      );
      
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('New')).toHaveClass('bg-primary-100');
      expect(screen.getByText('Status')).toHaveClass('bg-success-100');
    });

    it('maintains styling when used in flex containers', () => {
      render(
        <div className="flex items-center gap-2">
          <Badge variant="primary">Badge 1</Badge>
          <Badge variant="success">Badge 2</Badge>
        </div>
      );
      
      const badge1 = screen.getByText('Badge 1');
      const badge2 = screen.getByText('Badge 2');
      
      expect(badge1).toHaveClass('inline-flex');
      expect(badge2).toHaveClass('inline-flex');
    });
  });
});