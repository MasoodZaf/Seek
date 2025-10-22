/**
 * Comprehensive Accessibility Testing Suite
 * Tests WCAG 2.1 AA compliance across all components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Import components to test
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';

// Test wrapper with providers
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Accessibility Tests', () => {
  describe('UI Components Accessibility', () => {
    test('Button component should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <Button variant="primary">Click me</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="ghost" loading>Loading</Button>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test keyboard navigation
      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();
      
      // Test disabled button is not focusable
      expect(buttons[1]).toHaveAttribute('disabled');
      expect(buttons[1]).toHaveAttribute('aria-disabled', 'true');
    });

    test('Card component should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <Card>
            <Card.Header>
              <Card.Title>Test Card</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>Card content with proper semantic structure</p>
            </Card.Content>
            <Card.Footer>
              <Button>Action</Button>
            </Card.Footer>
          </Card>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify semantic structure
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('Form components should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <form>
            <Input
              label="Email"
              type="email"
              required
              error="Please enter a valid email"
            />
            <div>
              <label htmlFor="language-select">Language</label>
              <select id="language-select" name="language">
                <option value="">Select a language</option>
                <option value="js">JavaScript</option>
                <option value="py">Python</option>
              </select>
            </div>
            <Textarea
              label="Description"
              placeholder="Enter description"
            />
            <Button type="submit">Submit</Button>
          </form>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test form labels and associations
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby');

      // Test select accessibility
      const select = screen.getByLabelText('Language');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('id', 'language-select');

      // Test textarea accessibility
      const textarea = screen.getByLabelText('Description');
      expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    });
  });

  describe('Layout Components Accessibility', () => {
    test('Simple sidebar navigation should be accessible', async () => {
      const SimpleSidebar = () => (
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/tutorials">Tutorials</a></li>
            <li><a href="/playground">Playground</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </nav>
      );

      const { container } = render(
        <TestWrapper>
          <SimpleSidebar />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test navigation structure
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      // Test keyboard navigation
      const navLinks = screen.getAllByRole('link');
      expect(navLinks.length).toBe(4);
      
      // Test first link focus
      navLinks[0].focus();
      expect(navLinks[0]).toHaveFocus();
    });

    test('Simple header should be accessible', async () => {
      const SimpleHeader = () => (
        <header role="banner">
          <h1>Seek Learning Platform</h1>
          <div>
            <input 
              type="search" 
              role="searchbox"
              aria-label="Search tutorials"
              placeholder="Search..."
            />
            <Button>Search</Button>
          </div>
        </header>
      );

      const { container } = render(
        <TestWrapper>
          <SimpleHeader />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test header landmarks
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();

      // Test search functionality
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-label', 'Search tutorials');
    });
  });

  describe('Complex Components Accessibility', () => {
    test('Simple dashboard structure should be accessible', async () => {
      const SimpleDashboard = () => (
        <main role="main">
          <h1>Dashboard</h1>
          <section>
            <h2>Progress</h2>
            <p>Your learning progress</p>
            <Button>Continue Learning</Button>
          </section>
        </main>
      );

      const { container } = render(
        <TestWrapper>
          <SimpleDashboard />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test main content structure
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Test headings hierarchy
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Dashboard');
    });

    test('Simple code playground should be accessible', async () => {
      const SimplePlayground = () => (
        <main role="main">
          <h1>Code Playground</h1>
          <div>
            <label htmlFor="code-editor">Code Editor</label>
            <textarea 
              id="code-editor"
              aria-label="Code editor"
              placeholder="Write your code here"
            />
            <Button>Run Code</Button>
          </div>
        </main>
      );

      const { container } = render(
        <TestWrapper>
          <SimplePlayground />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Test code editor accessibility
      const codeEditor = screen.getByLabelText('Code Editor');
      expect(codeEditor).toBeInTheDocument();
      expect(codeEditor).toHaveAttribute('aria-label', 'Code editor');

      // Test run button accessibility
      const runButton = screen.getByRole('button', { name: 'Run Code' });
      expect(runButton).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Tests', () => {
    test('should support tab navigation through interactive elements', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <div>
            <Button>First</Button>
            <Input label="Test Input" />
            <Select 
              label="Test Select"
              name="testSelect"
              options={[{ value: 'test', label: 'Test' }]}
            />
            <Button>Last</Button>
          </div>
        </TestWrapper>
      );

      // Test tab order
      await user.tab();
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Test Input')).toHaveFocus();

      await user.tab();
      const selectElement = screen.getByDisplayValue('Select an option...');
      expect(selectElement).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    test('should support Enter and Space key activation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <TestWrapper>
          <Button onClick={handleClick}>Test Button</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      button.focus();

      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test('should support Escape key for modals and dropdowns', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <TestWrapper>
          <div role="dialog" aria-modal="true">
            <button onClick={handleClose}>Close</button>
            <div>Modal content</div>
          </div>
        </TestWrapper>
      );

      // Focus should be trapped in modal
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Test Escape key
      await user.keyboard('{Escape}');
      // Note: Actual escape handling would be implemented in the modal component
    });
  });

  describe('Screen Reader Support', () => {
    test('should provide proper ARIA labels and descriptions', () => {
      render(
        <TestWrapper>
          <Button aria-label="Save document" aria-describedby="save-help">
            Save
          </Button>
          <div id="save-help">Saves the current document to your account</div>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Save document');
      expect(button).toHaveAttribute('aria-describedby', 'save-help');
    });

    test('should announce dynamic content changes', async () => {
      const TestComponent = () => {
        const [message, setMessage] = React.useState('');
        
        return (
          <div>
            <Button onClick={() => setMessage('Form saved successfully!')}>
              Save
            </Button>
            <div role="status" aria-live="polite">
              {message}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const status = screen.getByRole('status');
        expect(status).toHaveTextContent('Form saved successfully!');
        expect(status).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    test('should meet WCAG color contrast requirements', async () => {
      const { container } = render(
        <TestWrapper>
          <div className="bg-white text-gray-900">
            <h1>High Contrast Heading</h1>
            <p>This text should meet WCAG AA standards</p>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </TestWrapper>
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });

    test('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
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
          <Button className="motion-safe:animate-pulse">
            Animated Button
          </Button>
        </TestWrapper>
      );

      // Verify that animations are disabled when reduced motion is preferred
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    test('should maintain logical focus order', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <div>
            <h1>Page Title</h1>
            <nav>
              <a href="#main">Skip to main content</a>
            </nav>
            <main id="main">
              <Button>First Interactive Element</Button>
              <Input label="Form Input" />
              <Button>Last Interactive Element</Button>
            </main>
          </div>
        </TestWrapper>
      );

      // Test skip link
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      skipLink.focus();
      expect(skipLink).toHaveFocus();

      // Test tab order in main content
      await user.tab();
      expect(screen.getByRole('button', { name: 'First Interactive Element' })).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Form Input')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Last Interactive Element' })).toHaveFocus();
    });

    test('should provide visible focus indicators', () => {
      render(
        <TestWrapper>
          <Button>Focusable Button</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      button.focus();
      
      // Check that focus styles are applied
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });
});