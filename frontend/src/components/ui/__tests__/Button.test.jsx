import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      button: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('button', { ref, ...props }, children)
      )),
      div: ({ children, ...props }) => React.createElement('div', props, children),
    },
  };
});

describe('Button Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error', 'ghost'];
    
    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`btn-${variant}`);
      });
    });

    it('applies gradient class when gradient prop is true', () => {
      render(<Button variant="primary" gradient>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-primary-gradient');
    });
  });

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Button size={size}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`min-h-[${size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '48px' : '56px'}]`);
      });
    });
  });

  describe('States', () => {
    it('renders disabled state correctly', () => {
      render(<Button disabled>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('renders loading state correctly', () => {
      render(<Button loading>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      
      // Check that content is hidden during loading
      const content = button.querySelector('.opacity-0');
      expect(content).toBeInTheDocument();
    });

    it('applies glow class when glow prop is true', () => {
      render(<Button glow>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-glow');
    });

    it('applies full width class when fullWidth prop is true', () => {
      render(<Button fullWidth>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Icons', () => {
    it('renders left icon correctly', () => {
      render(
        <Button icon={ChevronRightIcon} iconPosition="left">
          Test
        </Button>
      );
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
      
      // Check icon is positioned before text
      const content = button.querySelector('.flex');
      expect(content).toBeInTheDocument();
    });

    it('renders right icon correctly', () => {
      render(
        <Button icon={ChevronRightIcon} iconPosition="right">
          Test
        </Button>
      );
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct icon size based on button size', () => {
      render(<Button icon={ChevronRightIcon} size="lg">Test</Button>);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('w-5', 'h-5');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Test</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Test</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} loading>Test</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard navigation', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Test</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper focus indicators', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });

    it('supports ARIA attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Test
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('maintains semantic button role', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      render(<Button animate={false}>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders with animation by default', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      // With mocked framer-motion, it should still render as button
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Loading Spinner', () => {
    it('shows loading spinner with correct size', () => {
      render(<Button loading size="lg">Test</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-5', 'h-5');
    });

    it('hides content when loading', () => {
      render(<Button loading>Test Content</Button>);
      const button = screen.getByRole('button');
      const hiddenContent = button.querySelector('.opacity-0');
      expect(hiddenContent).toBeInTheDocument();
      // Content should be hidden but still present in DOM
      expect(button).toHaveTextContent('Test Content');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles text truncation for long content', () => {
      render(<Button>This is a very long button text that should be truncated</Button>);
      const button = screen.getByRole('button');
      const textSpan = button.querySelector('.truncate');
      expect(textSpan).toBeInTheDocument();
    });

    it('maintains minimum height constraints', () => {
      render(<Button size="xs">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[24px]');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(<Button ref={ref}>Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Custom Props', () => {
    it('passes through additional props', () => {
      render(<Button data-testid="custom-button" type="submit">Test</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });
});