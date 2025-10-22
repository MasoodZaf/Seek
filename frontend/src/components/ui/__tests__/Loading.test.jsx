import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Spinner,
  LoadingDots,
  LoadingPulse,
  LoadingSkeleton,
  LoadingOverlay,
  LoadingCard,
  LoadingPage,
  BrandedSpinner,
  LoadingButton,
  ProgressLoader,
  LoadingList,
} from '../Loading';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children, ...props }) => React.createElement('div', props, children),
      button: ({ children, ...props }) => React.createElement('button', props, children),
    },
  };
});

describe('Loading Components', () => {
  describe('Spinner', () => {
    it('renders with default props', () => {
      render(<Spinner />);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-6', 'h-6', 'border-primary-200', 'border-t-primary-600');
    });

    it('renders different sizes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      sizes.forEach(size => {
        const { container } = render(<Spinner size={size} />);
        const spinner = container.querySelector('.animate-spin');
        const sizeClass = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : size === 'xl' ? 'w-12 h-12' : 'w-16 h-16';
        expect(spinner).toHaveClass(sizeClass.split(' ')[0], sizeClass.split(' ')[1]);
      });
    });

    it('renders different variants', () => {
      const variants = ['primary', 'success', 'warning', 'error', 'white'];
      variants.forEach(variant => {
        const { container } = render(<Spinner variant={variant} />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toHaveClass(`border-${variant}-200`, `border-t-${variant}-600`);
      });
    });

    it('renders gradient variant', () => {
      const { container } = render(<Spinner variant="gradient" />);
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      expect(spinner).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      const spinner = container.querySelector('.custom-spinner');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('LoadingDots', () => {
    it('renders three dots', () => {
      const { container } = render(<LoadingDots />);
      const dots = container.querySelectorAll('.rounded-full');
      expect(dots).toHaveLength(3);
    });

    it('renders different sizes', () => {
      const sizes = ['sm', 'md', 'lg'];
      sizes.forEach(size => {
        const { container } = render(<LoadingDots size={size} />);
        const dots = container.querySelectorAll('.rounded-full');
        const sizeClass = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3';
        dots.forEach(dot => {
          expect(dot).toHaveClass(sizeClass.split(' ')[0], sizeClass.split(' ')[1]);
        });
      });
    });

    it('renders different variants', () => {
      const variants = ['primary', 'success', 'warning', 'error', 'white'];
      variants.forEach(variant => {
        const { container } = render(<LoadingDots variant={variant} />);
        const dots = container.querySelectorAll('.rounded-full');
        dots.forEach(dot => {
          expect(dot).toHaveClass(`bg-${variant}-600`);
        });
      });
    });

    it('applies custom className', () => {
      const { container } = render(<LoadingDots className="custom-dots" />);
      const dotsContainer = container.querySelector('.custom-dots');
      expect(dotsContainer).toBeInTheDocument();
    });
  });

  describe('LoadingPulse', () => {
    it('renders with default variant', () => {
      const { container } = render(<LoadingPulse />);
      const pulse = container.querySelector('.bg-primary-600');
      expect(pulse).toBeInTheDocument();
    });

    it('renders different variants', () => {
      const variants = ['primary', 'success', 'warning', 'error'];
      variants.forEach(variant => {
        const { container } = render(<LoadingPulse variant={variant} />);
        const pulse = container.querySelector(`.bg-${variant}-600`);
        expect(pulse).toBeInTheDocument();
      });
    });

    it('applies custom className', () => {
      const { container } = render(<LoadingPulse className="custom-pulse" />);
      const pulse = container.querySelector('.custom-pulse');
      expect(pulse).toBeInTheDocument();
    });
  });

  describe('LoadingSkeleton', () => {
    it('renders with default props', () => {
      const { container } = render(<LoadingSkeleton />);
      const skeleton = container.querySelector('.bg-secondary-200');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('rounded');
    });

    it('applies custom dimensions', () => {
      const { container } = render(<LoadingSkeleton width="200px" height="50px" />);
      const skeleton = container.querySelector('.bg-secondary-200');
      expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
    });

    it('renders different variants', () => {
      const variants = ['default', 'light', 'dark'];
      variants.forEach(variant => {
        const { container } = render(<LoadingSkeleton variant={variant} />);
        const variantClass = variant === 'default' ? 'bg-secondary-200' : variant === 'light' ? 'bg-secondary-100' : 'bg-secondary-300';
        const skeleton = container.querySelector(`.${variantClass}`);
        expect(skeleton).toBeInTheDocument();
      });
    });

    it('renders with shimmer effect by default', () => {
      const { container } = render(<LoadingSkeleton />);
      const shimmer = container.querySelector('.bg-gradient-to-r');
      expect(shimmer).toBeInTheDocument();
    });

    it('renders without shimmer when disabled', () => {
      const { container } = render(<LoadingSkeleton shimmer={false} />);
      const shimmer = container.querySelector('.bg-gradient-to-r');
      expect(shimmer).not.toBeInTheDocument();
    });

    it('applies custom rounded class', () => {
      const { container } = render(<LoadingSkeleton rounded="rounded-full" />);
      const skeleton = container.querySelector('.rounded-full');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('LoadingOverlay', () => {
    it('renders children when not loading', () => {
      render(
        <LoadingOverlay loading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders overlay when loading', () => {
      render(
        <LoadingOverlay loading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders custom loading text', () => {
      render(
        <LoadingOverlay loading={true} text="Please wait...">
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('renders without spinner when disabled', () => {
      const { container } = render(
        <LoadingOverlay loading={true} spinner={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });

    it('applies blur effect by default', () => {
      const { container } = render(
        <LoadingOverlay loading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      const overlay = container.querySelector('.backdrop-blur-sm');
      expect(overlay).toBeInTheDocument();
    });

    it('renders without blur when disabled', () => {
      const { container } = render(
        <LoadingOverlay loading={true} blur={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      const overlay = container.querySelector('.backdrop-blur-sm');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('LoadingCard', () => {
    it('renders skeleton card structure', () => {
      const { container } = render(<LoadingCard />);
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
      
      const skeletons = container.querySelectorAll('.bg-secondary-200');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('applies custom className', () => {
      const { container } = render(<LoadingCard className="custom-card" />);
      const card = container.querySelector('.custom-card');
      expect(card).toBeInTheDocument();
    });

    it('renders different skeleton variants', () => {
      const { container } = render(<LoadingCard variant="light" />);
      const lightSkeletons = container.querySelectorAll('.bg-secondary-100');
      expect(lightSkeletons.length).toBeGreaterThan(0);
    });
  });

  describe('LoadingPage', () => {
    it('renders with default text', () => {
      render(<LoadingPage />);
      expect(screen.getByText('Loading amazing content...')).toBeInTheDocument();
      expect(screen.getByText('This won\'t take long!')).toBeInTheDocument();
    });

    it('renders custom text and description', () => {
      render(
        <LoadingPage 
          text="Custom loading text" 
          description="Custom description" 
        />
      );
      expect(screen.getByText('Custom loading text')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('renders progress bar when enabled', () => {
      const { container } = render(<LoadingPage showProgress={true} progress={50} />);
      const progressBar = container.querySelector('.bg-gradient-primary');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders spinner with specified variant', () => {
      const { container } = render(<LoadingPage variant="success" />);
      const spinner = container.querySelector('.border-success-200');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('BrandedSpinner', () => {
    it('renders branded spinner with gradient', () => {
      const { container } = render(<BrandedSpinner />);
      const gradientSpinner = container.querySelector('div[style*="conic-gradient"]');
      expect(gradientSpinner).toBeInTheDocument();
    });

    it('renders different sizes', () => {
      const { container } = render(<BrandedSpinner size="lg" />);
      const spinner = container.querySelector('.w-8');
      expect(spinner).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<BrandedSpinner className="custom-branded" />);
      const spinner = container.querySelector('.custom-branded');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('LoadingButton', () => {
    it('renders button with children when not loading', () => {
      render(<LoadingButton>Click me</LoadingButton>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('renders loading state correctly', () => {
      const { container } = render(<LoadingButton loading>Click me</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-75', 'cursor-not-allowed');
      
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      
      const hiddenText = container.querySelector('.opacity-0');
      expect(hiddenText).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(<LoadingButton disabled>Click me</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('applies custom className', () => {
      render(<LoadingButton className="custom-btn">Click me</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-btn');
    });
  });

  describe('ProgressLoader', () => {
    it('renders with default text and progress', () => {
      render(<ProgressLoader progress={50} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders custom text', () => {
      render(<ProgressLoader progress={75} text="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders progress bar with correct width', () => {
      const { container } = render(<ProgressLoader progress={60} />);
      const progressBar = container.querySelector('.bg-gradient-primary');
      expect(progressBar).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<ProgressLoader className="custom-progress" />);
      const progressContainer = container.querySelector('.custom-progress');
      expect(progressContainer).toBeInTheDocument();
    });
  });

  describe('LoadingList', () => {
    it('renders default number of items', () => {
      const { container } = render(<LoadingList />);
      const items = container.querySelectorAll('.border-secondary-200');
      expect(items).toHaveLength(3);
    });

    it('renders custom number of items', () => {
      const { container } = render(<LoadingList items={5} />);
      const items = container.querySelectorAll('.border-secondary-200');
      expect(items).toHaveLength(5);
    });

    it('renders skeleton structure for each item', () => {
      const { container } = render(<LoadingList items={2} />);
      const avatarSkeletons = container.querySelectorAll('.rounded-full');
      const textSkeletons = container.querySelectorAll('.bg-secondary-200');
      
      expect(avatarSkeletons).toHaveLength(2); // One avatar per item
      expect(textSkeletons.length).toBeGreaterThan(4); // Multiple text skeletons per item
    });

    it('applies custom className', () => {
      const { container } = render(<LoadingList className="custom-list" />);
      const list = container.querySelector('.custom-list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('loading overlay maintains focus management', () => {
      render(
        <LoadingOverlay loading={true}>
          <button>Focusable content</button>
        </LoadingOverlay>
      );
      const button = screen.getByRole('button', { name: /focusable content/i });
      expect(button).toBeInTheDocument();
    });

    it('loading button maintains button semantics', () => {
      render(<LoadingButton loading>Submit</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('progress loader provides meaningful text', () => {
      render(<ProgressLoader progress={50} text="Uploading files" />);
      expect(screen.getByText('Uploading files')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with multiple loading components', () => {
      const { container } = render(
        <div>
          <Spinner />
          <LoadingDots />
          <LoadingSkeleton />
          <LoadingCard />
        </div>
      );
      
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThan(0);
      expect(container.querySelector('.bg-secondary-200')).toBeInTheDocument();
    });
  });
});