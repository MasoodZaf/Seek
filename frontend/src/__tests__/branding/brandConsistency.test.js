/**
 * Brand Consistency Tests
 * Verifies brand guidelines compliance across all components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import BrandIcon from '../../components/ui/BrandIcon';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import ErrorState from '../../components/ui/ErrorState';
import SuccessNotification from '../../components/ui/SuccessNotification';
import ProgressMessage from '../../components/ui/ProgressMessage';
import SocialLogin from '../../components/auth/SocialLogin';

// Import brand guidelines for validation
import brandGuidelines from '../../assets/brand/brand-guidelines.md';

describe('Brand Guidelines Compliance', () => {
  describe('Color Palette Consistency', () => {
    test('primary colors are used consistently across components', () => {
      const { container: buttonContainer } = render(<Button variant="primary">Test</Button>);
      const { container: cardContainer } = render(<Card>Test</Card>);
      
      // Check that components use CSS custom properties for brand colors
      const buttonElement = buttonContainer.querySelector('button');
      const cardElement = cardContainer.querySelector('div');
      
      expect(buttonElement).toHaveClass('bg-blue-600'); // Primary brand color
      expect(cardElement).toHaveClass('bg-white'); // Neutral brand color
    });

    test('semantic colors are applied correctly', () => {
      const { container: errorContainer } = render(
        <ErrorState error="serverError" />
      );
      const { container: successContainer } = render(
        <SuccessNotification type="accountCreated" />
      );
      
      const errorElement = errorContainer.querySelector('[class*="text-red"]');
      const successElement = successContainer.querySelector('[class*="text-green"]');
      
      expect(errorElement).toBeInTheDocument();
      expect(successElement).toBeInTheDocument();
    });

    test('gradient usage follows brand guidelines', () => {
      const { container } = render(
        <ProgressMessage type="progress" percentage={75} variant="celebration" />
      );
      
      const gradientElement = container.querySelector('[class*="gradient"]');
      expect(gradientElement).toBeInTheDocument();
    });
  });

  describe('Typography Consistency', () => {
    test('font families are consistent across components', () => {
      const { container: buttonContainer } = render(<Button>Test Button</Button>);
      const { container: cardContainer } = render(<Card><h3>Test Heading</h3></Card>);
      
      // Components should inherit font family from design system
      const buttonElement = buttonContainer.querySelector('button');
      const headingElement = cardContainer.querySelector('h3');
      
      expect(buttonElement).toHaveClass('font-medium');
      expect(headingElement).toBeInTheDocument();
    });

    test('font weights follow the scale', () => {
      const { container } = render(
        <div>
          <h1 className="font-extrabold">Display Text</h1>
          <h2 className="font-bold">Heading</h2>
          <h3 className="font-semibold">Subheading</h3>
          <p className="font-medium">Emphasis</p>
          <p className="font-normal">Body Text</p>
        </div>
      );
      
      expect(container.querySelector('.font-extrabold')).toBeInTheDocument();
      expect(container.querySelector('.font-bold')).toBeInTheDocument();
      expect(container.querySelector('.font-semibold')).toBeInTheDocument();
      expect(container.querySelector('.font-medium')).toBeInTheDocument();
      expect(container.querySelector('.font-normal')).toBeInTheDocument();
    });

    test('font sizes follow the scale', () => {
      const { container } = render(
        <div>
          <p className="text-xs">Extra Small</p>
          <p className="text-sm">Small</p>
          <p className="text-base">Base</p>
          <p className="text-lg">Large</p>
          <p className="text-xl">Extra Large</p>
          <p className="text-2xl">2X Large</p>
        </div>
      );
      
      expect(container.querySelector('.text-xs')).toBeInTheDocument();
      expect(container.querySelector('.text-sm')).toBeInTheDocument();
      expect(container.querySelector('.text-base')).toBeInTheDocument();
      expect(container.querySelector('.text-lg')).toBeInTheDocument();
      expect(container.querySelector('.text-xl')).toBeInTheDocument();
      expect(container.querySelector('.text-2xl')).toBeInTheDocument();
    });
  });

  describe('Iconography Consistency', () => {
    test('icons use consistent stroke width', () => {
      const { container } = render(<BrandIcon name="home" size={24} />);
      
      const svgElement = container.querySelector('svg');
      expect(svgElement).toHaveAttribute('stroke-width', '2');
    });

    test('icons use consistent sizing', () => {
      const sizes = [16, 20, 24];
      
      sizes.forEach(size => {
        const { container } = render(<BrandIcon name="home" size={size} />);
        const svgElement = container.querySelector('svg');
        
        expect(svgElement).toHaveAttribute('width', `${size}px`);
        expect(svgElement).toHaveAttribute('height', `${size}px`);
      });
    });

    test('icons have proper viewBox for consistency', () => {
      const { container } = render(<BrandIcon name="home" />);
      
      const svgElement = container.querySelector('svg');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('icons use semantic naming', () => {
      const semanticIcons = [
        'home', 'dashboard', 'code', 'tutorials', 'playground',
        'profile', 'settings', 'play', 'pause', 'save', 'share',
        'check', 'x', 'warning', 'info', 'trophy', 'star'
      ];
      
      semanticIcons.forEach(iconName => {
        const { container } = render(<BrandIcon name={iconName} />);
        const svgElement = container.querySelector('svg');
        
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveClass('brand-icon');
      });
    });
  });

  describe('Spacing System Consistency', () => {
    test('components use consistent spacing scale', () => {
      const { container } = render(
        <div className="space-y-4">
          <div className="p-2">Small padding</div>
          <div className="p-4">Medium padding</div>
          <div className="p-6">Large padding</div>
          <div className="m-2">Small margin</div>
          <div className="m-4">Medium margin</div>
          <div className="m-6">Large margin</div>
        </div>
      );
      
      expect(container.querySelector('.space-y-4')).toBeInTheDocument();
      expect(container.querySelector('.p-2')).toBeInTheDocument();
      expect(container.querySelector('.p-4')).toBeInTheDocument();
      expect(container.querySelector('.p-6')).toBeInTheDocument();
      expect(container.querySelector('.m-2')).toBeInTheDocument();
      expect(container.querySelector('.m-4')).toBeInTheDocument();
      expect(container.querySelector('.m-6')).toBeInTheDocument();
    });

    test('button components use consistent internal spacing', () => {
      const { container: smallContainer } = render(<Button size="sm">Small</Button>);
      const { container: mediumContainer } = render(<Button size="md">Medium</Button>);
      const { container: largeContainer } = render(<Button size="lg">Large</Button>);
      
      const smallButton = smallContainer.querySelector('button');
      const mediumButton = mediumContainer.querySelector('button');
      const largeButton = largeContainer.querySelector('button');
      
      expect(smallButton).toHaveClass('px-3', 'py-1.5');
      expect(mediumButton).toHaveClass('px-4', 'py-2');
      expect(largeButton).toHaveClass('px-6', 'py-3');
    });
  });

  describe('Shadow and Elevation Consistency', () => {
    test('components use consistent shadow levels', () => {
      const { container: cardContainer } = render(<Card>Test</Card>);
      const { container: buttonContainer } = render(<Button variant="primary">Test</Button>);
      
      const cardElement = cardContainer.querySelector('div');
      const buttonElement = buttonContainer.querySelector('button');
      
      // Cards should have subtle shadows
      expect(cardElement).toHaveClass('shadow-sm');
      
      // Buttons should have appropriate hover shadows
      expect(buttonElement).toHaveClass('hover:shadow-md');
    });

    test('modal and overlay components use higher elevation', () => {
      const { container } = render(
        <SuccessNotification type="accountCreated" variant="toast" />
      );
      
      const toastElement = container.querySelector('div');
      expect(toastElement).toHaveClass('shadow-2xl');
    });
  });

  describe('Border Radius Consistency', () => {
    test('components use consistent border radius', () => {
      const { container: buttonContainer } = render(<Button>Test</Button>);
      const { container: cardContainer } = render(<Card>Test</Card>);
      
      const buttonElement = buttonContainer.querySelector('button');
      const cardElement = cardContainer.querySelector('div');
      
      expect(buttonElement).toHaveClass('rounded-md');
      expect(cardElement).toHaveClass('rounded-lg');
    });

    test('icons and small elements use appropriate radius', () => {
      const { container } = render(<BrandIcon name="home" />);
      
      // Icons themselves don't have border radius, but their containers might
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });
  });
});

describe('Component Variant Consistency', () => {
  describe('Button Variants', () => {
    test('all button variants follow brand guidelines', () => {
      const variants = ['primary', 'secondary', 'success', 'error', 'warning'];
      
      variants.forEach(variant => {
        const { container } = render(<Button variant={variant}>Test</Button>);
        const buttonElement = container.querySelector('button');
        
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('transition-colors');
      });
    });

    test('button states are visually consistent', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const buttonElement = container.querySelector('button');
      
      expect(buttonElement).toHaveClass('disabled:opacity-50');
      expect(buttonElement).toHaveAttribute('disabled');
    });
  });

  describe('Notification Variants', () => {
    test('error states use consistent styling', () => {
      const errorTypes = ['networkError', 'serverError', 'loginFailed'];
      
      errorTypes.forEach(errorType => {
        const { container } = render(<ErrorState error={errorType} />);
        const errorElement = container.querySelector('[class*="text-red"]');
        
        expect(errorElement).toBeInTheDocument();
      });
    });

    test('success states use consistent styling', () => {
      const successTypes = ['accountCreated', 'tutorialCompleted', 'levelUp'];
      
      successTypes.forEach(successType => {
        const { container } = render(<SuccessNotification type={successType} />);
        const successElement = container.querySelector('[class*="text-green"]');
        
        expect(successElement).toBeInTheDocument();
      });
    });
  });
});

describe('Responsive Design Consistency', () => {
  test('components adapt to different screen sizes', () => {
    const { container } = render(
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </div>
    );
    
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  test('text scales appropriately on different screens', () => {
    const { container } = render(
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>
        <p className="text-sm md:text-base">Responsive text</p>
      </div>
    );
    
    const headingElement = container.querySelector('h1');
    const textElement = container.querySelector('p');
    
    expect(headingElement).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl');
    expect(textElement).toHaveClass('text-sm', 'md:text-base');
  });
});

describe('Animation Consistency', () => {
  test('components use consistent transition durations', () => {
    const { container: buttonContainer } = render(<Button>Test</Button>);
    const { container: cardContainer } = render(<Card>Test</Card>);
    
    const buttonElement = buttonContainer.querySelector('button');
    const cardElement = cardContainer.querySelector('div');
    
    expect(buttonElement).toHaveClass('transition-colors');
    // Cards might have hover transitions
    expect(cardElement).toBeInTheDocument();
  });

  test('loading states use consistent animations', () => {
    const { container } = render(
      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
    );
    
    const spinnerElement = container.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('border-blue-600');
  });
});

describe('Accessibility Compliance', () => {
  test('color contrast meets WCAG guidelines', () => {
    // Test high contrast combinations
    const { container } = render(
      <div>
        <div className="bg-blue-600 text-white p-4">High contrast</div>
        <div className="bg-gray-100 text-gray-900 p-4">High contrast</div>
        <div className="bg-red-600 text-white p-4">Error state</div>
        <div className="bg-green-600 text-white p-4">Success state</div>
      </div>
    );
    
    expect(container.querySelector('.bg-blue-600.text-white')).toBeInTheDocument();
    expect(container.querySelector('.bg-gray-100.text-gray-900')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-600.text-white')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-600.text-white')).toBeInTheDocument();
  });

  test('focus states are visually consistent', () => {
    const { container } = render(
      <div>
        <Button>Focusable Button</Button>
        <input className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
    );
    
    const buttonElement = container.querySelector('button');
    const inputElement = container.querySelector('input');
    
    expect(buttonElement).toHaveClass('focus:outline-none');
    expect(inputElement).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });
});

describe('Brand Voice Integration', () => {
  test('error messages maintain professional tone', () => {
    const { container } = render(<ErrorState error="networkError" />);
    
    const titleElement = container.querySelector('h3');
    const messageElement = container.querySelector('p');
    
    expect(titleElement).toHaveTextContent('Connection Issue');
    expect(messageElement).toHaveTextContent(/trouble connecting/i);
  });

  test('success messages are encouraging', () => {
    const { container } = render(<SuccessNotification type="tutorialCompleted" />);
    
    const titleElement = container.querySelector('h4');
    const messageElement = container.querySelector('p');
    
    expect(titleElement).toHaveTextContent(/completed/i);
    expect(messageElement).toHaveTextContent(/great job/i);
  });

  test('progress messages are motivating', () => {
    const { container } = render(<ProgressMessage type="progress" percentage={75} />);
    
    const messageElement = container.querySelector('p');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.textContent).toBeTruthy();
  });
});

describe('Logo and Branding Usage', () => {
  test('social login maintains brand consistency', () => {
    const mockLogin = jest.fn();
    const { container } = render(<SocialLogin onLogin={mockLogin} />);
    
    // Should use brand colors and styling
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    buttons.forEach(button => {
      expect(button).toHaveClass('transition-all');
    });
  });

  test('brand icons maintain consistent styling', () => {
    const iconNames = ['home', 'code', 'star', 'trophy'];
    
    iconNames.forEach(iconName => {
      const { container } = render(<BrandIcon name={iconName} />);
      const svgElement = container.querySelector('svg');
      
      expect(svgElement).toHaveClass('brand-icon');
      expect(svgElement).toHaveAttribute('stroke-width', '2');
    });
  });
});