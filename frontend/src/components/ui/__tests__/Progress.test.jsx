import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from '../Progress';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children, ...props }) => React.createElement('div', props, children),
      span: ({ children, ...props }) => React.createElement('span', props, children),
    },
  };
});

describe('Progress Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Progress value={50} />);
      const progressBar = container.querySelector('.bg-gradient-to-r');
      expect(progressBar).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders without label when showLabel is false', () => {
      render(<Progress value={50} showLabel={false} />);
      expect(screen.queryByText('Progress')).not.toBeInTheDocument();
    });

    it('renders without percentage when showPercentage is false', () => {
      render(<Progress value={50} showPercentage={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('renders custom label', () => {
      render(<Progress value={75} label="Loading files" />);
      expect(screen.getByText('Loading files')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('Value Calculations', () => {
    it('calculates percentage correctly with default max', () => {
      render(<Progress value={25} />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('calculates percentage correctly with custom max', () => {
      render(<Progress value={50} max={200} />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('handles values greater than max', () => {
      render(<Progress value={150} max={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('handles negative values', () => {
      render(<Progress value={-10} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles zero value', () => {
      render(<Progress value={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('rounds percentage to nearest integer', () => {
      render(<Progress value={33.7} />);
      expect(screen.getByText('34%')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        const { container } = render(<Progress value={50} size={size} />);
        const track = container.querySelector('.w-full.rounded-full');
        const sizeClass = size === 'xs' ? 'h-1' : size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : size === 'lg' ? 'h-4' : 'h-6';
        expect(track).toHaveClass(sizeClass);
      });
    });
  });

  describe('Variants', () => {
    const variants = ['primary', 'success', 'warning', 'error', 'gradient', 'rainbow'];
    
    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        const { container } = render(<Progress value={50} variant={variant} />);
        const progressBar = container.querySelector('.h-full.rounded-full');
        
        if (variant === 'gradient') {
          expect(progressBar).toHaveClass('from-blue-500', 'via-purple-500', 'to-pink-500');
        } else if (variant === 'rainbow') {
          expect(progressBar).toHaveClass('from-red-500', 'via-yellow-500', 'via-green-500', 'via-blue-500', 'to-purple-500');
        } else {
          expect(progressBar).toHaveClass(`from-${variant}-500`, `to-${variant}-600`);
        }
      });
    });
  });

  describe('Styles', () => {
    it('renders default style with gradient', () => {
      const { container } = render(<Progress value={50} />);
      const progressBar = container.querySelector('.bg-gradient-to-r');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders flat style without gradient', () => {
      const { container } = render(<Progress value={50} style="flat" />);
      const progressBar = container.querySelector('.bg-primary-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders glass style with backdrop blur', () => {
      const { container } = render(<Progress value={50} style="glass" />);
      const track = container.querySelector('.bg-white\\/20.backdrop-blur-sm');
      expect(track).toBeInTheDocument();
    });

    it('renders inset style with shadow', () => {
      const { container } = render(<Progress value={50} style="inset" />);
      const track = container.querySelector('.shadow-inner');
      expect(track).toBeInTheDocument();
    });

    it('renders elevated style with shadow', () => {
      const { container } = render(<Progress value={50} style="elevated" />);
      const progressBar = container.querySelector('.shadow-lg');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Special Effects', () => {
    it('renders striped pattern when striped is true', () => {
      const { container } = render(<Progress value={50} striped />);
      const stripedElement = container.querySelector('.bg-gradient-to-r.from-transparent.via-white\\/20.to-transparent');
      expect(stripedElement).toBeInTheDocument();
    });

    it('renders animated shimmer when animated is true', () => {
      const { container } = render(<Progress value={50} animated />);
      const shimmerElement = container.querySelector('.bg-gradient-to-r.from-transparent.via-white\\/40.to-transparent');
      expect(shimmerElement).toBeInTheDocument();
    });

    it('renders glow effect when glowing is true', () => {
      const { container } = render(<Progress value={50} glowing />);
      const track = container.querySelector('.shadow-glow');
      expect(track).toBeInTheDocument();
    });

    it('renders particle effect when progress is 100%', () => {
      const { container } = render(<Progress value={100} animate />);
      const particles = container.querySelectorAll('.bg-white.rounded-full');
      expect(particles.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      const { container } = render(<Progress value={50} animate={false} />);
      const progressBar = container.querySelector('.h-full.rounded-full');
      expect(progressBar).toBeInTheDocument();
    });

    it('applies pulse animation when animated is true and animate is false', () => {
      const { container } = render(<Progress value={50} animated animate={false} />);
      const progressBar = container.querySelector('.animate-pulse');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful progress information', () => {
      render(<Progress value={60} label="File upload" />);
      expect(screen.getByText('File upload')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('supports ARIA attributes', () => {
      const { container } = render(
        <Progress 
          value={75} 
          role="progressbar"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      );
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('maintains semantic structure', () => {
      render(<Progress value={50} label="Loading" />);
      const label = screen.getByText('Loading');
      const percentage = screen.getByText('50%');
      expect(label).toHaveClass('text-secondary-700');
      expect(percentage).toHaveClass('text-secondary-600');
    });
  });

  describe('Visual States', () => {
    it('shows empty state at 0%', () => {
      const { container } = render(<Progress value={0} />);
      const progressBar = container.querySelector('.h-full.rounded-full');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows full state at 100%', () => {
      render(<Progress value={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('handles intermediate values correctly', () => {
      render(<Progress value={33.33} />);
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('passes through additional props', () => {
      const { container } = render(
        <Progress 
          value={50} 
          data-testid="custom-progress"
          id="progress-1"
        />
      );
      const progress = container.querySelector('[data-testid="custom-progress"]');
      expect(progress).toHaveAttribute('id', 'progress-1');
    });

    it('applies custom className', () => {
      const { container } = render(<Progress value={50} className="custom-progress" />);
      const progress = container.querySelector('.custom-progress');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains consistent height across different values', () => {
      const { container, rerender } = render(<Progress value={10} size="md" />);
      let track = container.querySelector('.h-3');
      expect(track).toBeInTheDocument();

      rerender(<Progress value={90} size="md" />);
      track = container.querySelector('.h-3');
      expect(track).toBeInTheDocument();
    });

    it('scales appropriately with different sizes', () => {
      const { container, rerender } = render(<Progress value={50} size="xs" />);
      let track = container.querySelector('.h-1');
      expect(track).toBeInTheDocument();

      rerender(<Progress value={50} size="xl" />);
      track = container.querySelector('.h-6');
      expect(track).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      render(<Progress value={66.666} />);
      expect(screen.getByText('67%')).toBeInTheDocument();
    });

    it('handles very small values', () => {
      render(<Progress value={0.1} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles very large max values', () => {
      render(<Progress value={500} max={10000} />);
      expect(screen.getByText('5%')).toBeInTheDocument();
    });

    it('handles string values gracefully', () => {
      render(<Progress value="50" max="100" />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with complex effects', () => {
      const { container } = render(
        <Progress 
          value={75} 
          striped 
          animated 
          glowing 
          variant="gradient" 
          style="elevated"
        />
      );
      
      const progressBar = container.querySelector('.h-full.rounded-full');
      expect(progressBar).toBeInTheDocument();
      
      const effects = container.querySelectorAll('.absolute');
      expect(effects.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Integration', () => {
    it('uses consistent color tokens', () => {
      const { container } = render(<Progress value={50} variant="primary" />);
      const progressBar = container.querySelector('.from-primary-500.to-primary-600');
      expect(progressBar).toBeInTheDocument();
    });

    it('maintains dark mode compatibility', () => {
      render(<Progress value={50} />);
      const label = screen.getByText('Progress');
      const percentage = screen.getByText('50%');
      
      expect(label).toHaveClass('dark:text-secondary-300');
      expect(percentage).toHaveClass('dark:text-secondary-400');
    });
  });
});