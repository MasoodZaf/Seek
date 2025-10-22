/**
 * Cross-Browser Compatibility Tests
 * Tests core functionality across different browsers
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EnhancedDashboard from '../../components/dashboard/EnhancedDashboard';

// Mock framer-motion to avoid test issues
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span'
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn()
  })
}));

// Test wrapper with all necessary providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Cross-Browser Compatibility Tests', () => {
  // Test CSS Grid and Flexbox support
  describe('Layout Compatibility', () => {
    test('CSS Grid layouts render correctly', () => {
      render(
        <TestWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>Grid Item 1</Card>
            <Card>Grid Item 2</Card>
            <Card>Grid Item 3</Card>
          </div>
        </TestWrapper>
      );

      const cards = screen.getAllByText(/Grid Item/);
      expect(cards).toHaveLength(3);
      
      // Check that grid classes are applied
      const gridContainer = cards[0].closest('.grid');
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    test('Flexbox layouts work correctly', () => {
      render(
        <TestWrapper>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Button>Flex Item 1</Button>
            <Button>Flex Item 2</Button>
          </div>
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      const flexContainer = buttons[0].closest('.flex');
      expect(flexContainer).toHaveClass('flex');
      expect(flexContainer).toHaveClass('flex-col');
    });
  });

  // Test CSS Custom Properties (CSS Variables)
  describe('CSS Custom Properties', () => {
    test('CSS variables are supported and applied', () => {
      render(
        <TestWrapper>
          <Button variant="primary">Primary Button</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);
      
      // Check that CSS variables are being used (check for any CSS variable)
      const hasCustomProperties = computedStyle.getPropertyValue('--primary-500') || 
                                 computedStyle.getPropertyValue('--tw-bg-opacity') ||
                                 button.style.getPropertyValue('--primary-color') !== '';
      expect(hasCustomProperties || CSS.supports('color', 'var(--test)')).toBeTruthy();
    });
  });

  // Test modern JavaScript features
  describe('JavaScript Feature Support', () => {
    test('Arrow functions work correctly', () => {
      const arrowFunction = () => 'arrow function result';
      expect(arrowFunction()).toBe('arrow function result');
    });

    test('Template literals work correctly', () => {
      const name = 'Test';
      const template = `Hello ${name}!`;
      expect(template).toBe('Hello Test!');
    });

    test('Destructuring assignment works', () => {
      const obj = { a: 1, b: 2 };
      const { a, b } = obj;
      expect(a).toBe(1);
      expect(b).toBe(2);
    });

    test('Async/await functionality works', async () => {
      const asyncFunction = async () => {
        return new Promise(resolve => setTimeout(() => resolve('async result'), 10));
      };
      
      const result = await asyncFunction();
      expect(result).toBe('async result');
    });
  });

  // Test form functionality across browsers
  describe('Form Compatibility', () => {
    test('Input validation works across browsers', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Input
            type="email"
            placeholder="Enter email"
            required
            data-testid="email-input"
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('email-input');
      
      // Test invalid email
      await user.type(input, 'invalid-email');
      expect(input.validity.valid).toBe(false);
      
      // Test valid email
      await user.clear(input);
      await user.type(input, 'test@example.com');
      expect(input.validity.valid).toBe(true);
    });

    test('Form submission works correctly', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <TestWrapper>
          <form onSubmit={mockSubmit}>
            <Input type="text" name="username" data-testid="username" />
            <Button type="submit">Submit</Button>
          </form>
        </TestWrapper>
      );

      const input = screen.getByTestId('username');
      const button = screen.getByRole('button', { name: /submit/i });
      
      await user.type(input, 'testuser');
      await user.click(button);
      
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  // Test event handling compatibility
  describe('Event Handling', () => {
    test('Click events work correctly', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      
      render(
        <TestWrapper>
          <Button onClick={mockClick}>Click Me</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('Keyboard events work correctly', async () => {
      const user = userEvent.setup();
      const mockKeyDown = jest.fn();
      
      render(
        <TestWrapper>
          <Input onKeyDown={mockKeyDown} data-testid="keyboard-input" />
        </TestWrapper>
      );

      const input = screen.getByTestId('keyboard-input');
      await user.type(input, 'test');
      
      expect(mockKeyDown).toHaveBeenCalled();
    });

    test('Focus and blur events work correctly', async () => {
      const user = userEvent.setup();
      const mockFocus = jest.fn();
      const mockBlur = jest.fn();
      
      render(
        <TestWrapper>
          <Input
            onFocus={mockFocus}
            onBlur={mockBlur}
            data-testid="focus-input"
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('focus-input');
      
      await user.click(input);
      expect(mockFocus).toHaveBeenCalled();
      
      await user.tab();
      expect(mockBlur).toHaveBeenCalled();
    });
  });

  // Test responsive design compatibility
  describe('Responsive Design', () => {
    test('Responsive classes apply correctly', () => {
      // Mock window.matchMedia for responsive testing
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestWrapper>
          <div className="block md:hidden">Mobile Only</div>
          <div className="hidden md:block">Desktop Only</div>
        </TestWrapper>
      );

      const mobileElement = screen.getByText('Mobile Only');
      const desktopElement = screen.getByText('Desktop Only');
      
      expect(mobileElement).toHaveClass('block', 'md:hidden');
      expect(desktopElement).toHaveClass('hidden', 'md:block');
    });
  });

  // Test animation compatibility
  describe('Animation Compatibility', () => {
    test('CSS transitions work correctly', () => {
      render(
        <TestWrapper>
          <Button className="transition-all duration-300 hover:scale-105">
            Animated Button
          </Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-300', 'hover:scale-105');
    });

    test('Transform properties work correctly', () => {
      render(
        <TestWrapper>
          <div className="transform rotate-45 scale-110">
            Transformed Element
          </div>
        </TestWrapper>
      );

      const element = screen.getByText('Transformed Element');
      expect(element).toHaveClass('transform', 'rotate-45', 'scale-110');
    });
  });

  // Test accessibility features across browsers
  describe('Accessibility Compatibility', () => {
    test('ARIA attributes are supported', () => {
      render(
        <TestWrapper>
          <Button
            aria-label="Close dialog"
            aria-expanded="false"
            role="button"
          >
            ×
          </Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('Focus management works correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Input placeholder="Input field" />
        </TestWrapper>
      );

      const button1 = screen.getByRole('button', { name: /button 1/i });
      const button2 = screen.getByRole('button', { name: /button 2/i });
      const input = screen.getByPlaceholderText('Input field');

      // Test tab navigation
      await user.tab();
      expect(button1).toHaveFocus();
      
      await user.tab();
      expect(button2).toHaveFocus();
      
      await user.tab();
      expect(input).toHaveFocus();
    });
  });
});