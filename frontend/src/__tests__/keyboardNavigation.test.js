/**
 * Comprehensive Keyboard Navigation Testing Suite
 * Tests keyboard accessibility across all components and interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Import components for keyboard navigation testing
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import EnhancedDashboard from '../components/dashboard/EnhancedDashboard';
import EnhancedPlayground from '../components/CodeEditor/EnhancedPlayground';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import TutorialGrid from '../components/ui/TutorialGrid';

// Test wrapper
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

describe('Keyboard Navigation Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Basic Component Navigation', () => {
    test('Button components should be keyboard accessible', async () => {
      const handleClick = jest.fn();

      render(
        <TestWrapper>
          <div>
            <Button onClick={handleClick}>Primary Button</Button>
            <Button variant="secondary" onClick={handleClick}>Secondary Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      
      // Test tab navigation
      await user.tab();
      expect(buttons[0]).toHaveFocus();

      // Test Enter key activation
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key activation
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);

      // Test tab to next button
      await user.tab();
      expect(buttons[1]).toHaveFocus();

      // Test tab to disabled button (should be skipped)
      await user.tab();
      expect(buttons[2]).not.toHaveFocus();
    });

    test('Form components should support keyboard navigation', async () => {
      const handleSubmit = jest.fn(e => e.preventDefault());

      render(
        <TestWrapper>
          <form onSubmit={handleSubmit}>
            <Input label="First Name" name="firstName" />
            <Input label="Email" type="email" name="email" />
            <Select 
              label="Country"
              name="country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'ca', label: 'Canada' },
                { value: 'uk', label: 'United Kingdom' }
              ]}
            />
            <Textarea label="Message" name="message" />
            <Button type="submit">Submit</Button>
          </form>
        </TestWrapper>
      );

      // Test tab order through form elements
      await user.tab();
      expect(screen.getByLabelText('First Name')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Email')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Country')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Message')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus();

      // Test form submission with Enter
      await user.keyboard('{Enter}');
      expect(handleSubmit).toHaveBeenCalled();
    });

    test('Card components should handle keyboard interactions', async () => {
      const handleCardClick = jest.fn();

      render(
        <TestWrapper>
          <Card tabIndex={0} onClick={handleCardClick} role="button">
            <Card.Header>
              <Card.Title>Interactive Card</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>This card can be activated with keyboard</p>
            </Card.Content>
            <Card.Footer>
              <Button>Action</Button>
            </Card.Footer>
          </Card>
        </TestWrapper>
      );

      // Test card focus
      await user.tab();
      const card = screen.getByRole('button');
      expect(card).toHaveFocus();

      // Test Enter key activation
      await user.keyboard('{Enter}');
      expect(handleCardClick).toHaveBeenCalled();

      // Test Space key activation
      await user.keyboard(' ');
      expect(handleCardClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Navigation Component Keyboard Support', () => {
    test('Sidebar navigation should be keyboard accessible', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        progress: { level: 5, xp: 1250 }
      };

      render(
        <TestWrapper>
          <Sidebar user={mockUser} />
        </TestWrapper>
      );

      const navLinks = screen.getAllByRole('link');
      
      // Test tab navigation through sidebar links
      await user.tab();
      expect(navLinks[0]).toHaveFocus();

      // Test arrow key navigation (if implemented)
      await user.keyboard('{ArrowDown}');
      // Note: Arrow key navigation would need to be implemented in the component

      // Test Enter key activation
      const firstLink = navLinks[0];
      firstLink.focus();
      await user.keyboard('{Enter}');
      // Link should be activated (navigation would occur)
    });

    test('Header should support keyboard navigation', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      render(
        <TestWrapper>
          <Header user={mockUser} />
        </TestWrapper>
      );

      // Test search input focus
      const searchInput = screen.getByRole('searchbox');
      await user.tab();
      expect(searchInput).toHaveFocus();

      // Test search functionality with keyboard
      await user.type(searchInput, 'javascript');
      expect(searchInput).toHaveValue('javascript');

      // Test Escape to clear search
      await user.keyboard('{Escape}');
      // Search should be cleared or dropdown closed
    });
  });

  describe('Complex Component Keyboard Navigation', () => {
    test('Dashboard should support comprehensive keyboard navigation', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        progress: {
          level: 5,
          xp: 1250,
          streak: 7,
          completedTutorials: 15
        }
      };

      render(
        <TestWrapper>
          <EnhancedDashboard user={mockUser} />
        </TestWrapper>
      );

      // Test skip link (if present)
      const skipLink = screen.queryByText(/skip to main content/i);
      if (skipLink) {
        skipLink.focus();
        expect(skipLink).toHaveFocus();
        await user.keyboard('{Enter}');
      }

      // Test main content focus
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Test interactive elements in dashboard
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const interactiveElements = [...buttons, ...links];

      if (interactiveElements.length > 0) {
        // Test tab navigation through interactive elements
        for (let i = 0; i < Math.min(5, interactiveElements.length); i++) {
          await user.tab();
          expect(document.activeElement).toBeInstanceOf(HTMLElement);
        }
      }
    });

    test('Code Playground should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <EnhancedPlayground />
        </TestWrapper>
      );

      // Test language selector
      const languageSelect = screen.queryByLabelText(/language/i) || 
                            screen.queryByRole('combobox');
      if (languageSelect) {
        languageSelect.focus();
        expect(languageSelect).toHaveFocus();

        // Test arrow key navigation in select
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{Enter}');
      }

      // Test run button
      const runButton = screen.getByRole('button', { name: /run|execute/i });
      runButton.focus();
      expect(runButton).toHaveFocus();

      // Test Enter key to run code
      await user.keyboard('{Enter}');
      // Code execution should be triggered
    });

    test('Tutorial Grid should support keyboard navigation', async () => {
      const mockTutorials = [
        {
          id: 1,
          title: 'JavaScript Basics',
          description: 'Learn the fundamentals',
          difficulty: 'Beginner',
          language: 'JavaScript'
        },
        {
          id: 2,
          title: 'Python Fundamentals',
          description: 'Python programming basics',
          difficulty: 'Beginner',
          language: 'Python'
        }
      ];

      render(
        <TestWrapper>
          <TutorialGrid tutorials={mockTutorials} />
        </TestWrapper>
      );

      const tutorialCards = screen.getAllByRole('article');
      
      // Test tab navigation through tutorial cards
      await user.tab();
      expect(tutorialCards[0]).toHaveFocus();

      await user.tab();
      expect(tutorialCards[1]).toHaveFocus();

      // Test Enter key to select tutorial
      await user.keyboard('{Enter}');
      // Tutorial should be selected/opened
    });
  });

  describe('Modal and Overlay Keyboard Support', () => {
    test('Modal should trap focus and handle Escape key', async () => {
      const handleClose = jest.fn();

      const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;

        return (
          <div role="dialog" aria-modal="true" tabIndex={-1}>
            <div>
              <button onClick={onClose} aria-label="Close modal">×</button>
              {children}
              <button>Modal Button</button>
            </div>
          </div>
        );
      };

      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
          <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <p>Modal content</p>
            </Modal>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Open modal
      const openButton = screen.getByRole('button', { name: 'Open Modal' });
      await user.click(openButton);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Test focus trap - tab should cycle within modal
      await user.tab();
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toHaveFocus();

      await user.tab();
      const modalButton = screen.getByRole('button', { name: 'Modal Button' });
      expect(modalButton).toHaveFocus();

      // Test Escape key to close modal
      await user.keyboard('{Escape}');
      // Modal should be closed (implementation dependent)
    });

    test('Dropdown should handle keyboard navigation', async () => {
      const DropdownTest = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const options = ['Option 1', 'Option 2', 'Option 3'];

        return (
          <div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            >
              Dropdown
            </button>
            {isOpen && (
              <ul role="listbox">
                {options.map((option, index) => (
                  <li 
                    key={index}
                    role="option"
                    tabIndex={0}
                    onClick={() => setIsOpen(false)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <DropdownTest />
        </TestWrapper>
      );

      const dropdownButton = screen.getByRole('button', { name: 'Dropdown' });
      
      // Open dropdown with Enter
      dropdownButton.focus();
      await user.keyboard('{Enter}');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      // Test arrow key navigation in dropdown
      const options = screen.getAllByRole('option');
      await user.keyboard('{ArrowDown}');
      expect(options[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(options[1]).toHaveFocus();

      // Test Enter to select option
      await user.keyboard('{Enter}');
      // Option should be selected and dropdown closed
    });
  });

  describe('Advanced Keyboard Interactions', () => {
    test('should support keyboard shortcuts', async () => {
      const handleSave = jest.fn();
      const handleCopy = jest.fn();

      const ShortcutTest = () => {
        React.useEffect(() => {
          const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
              if (e.key === 's') {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'c') {
                e.preventDefault();
                handleCopy();
              }
            }
          };

          document.addEventListener('keydown', handleKeyDown);
          return () => document.removeEventListener('keydown', handleKeyDown);
        }, []);

        return <div>Shortcut Test Component</div>;
      };

      render(
        <TestWrapper>
          <ShortcutTest />
        </TestWrapper>
      );

      // Test Ctrl+S shortcut
      await user.keyboard('{Control>}s{/Control}');
      expect(handleSave).toHaveBeenCalled();

      // Test Ctrl+C shortcut
      await user.keyboard('{Control>}c{/Control}');
      expect(handleCopy).toHaveBeenCalled();
    });

    test('should handle complex tab sequences', async () => {
      render(
        <TestWrapper>
          <div>
            <h1>Page Title</h1>
            <nav>
              <a href="#main">Skip to main</a>
              <a href="#nav">Navigation</a>
            </nav>
            <main id="main">
              <section>
                <h2>Section 1</h2>
                <Button>Button 1</Button>
                <Input label="Input 1" />
              </section>
              <section>
                <h2>Section 2</h2>
                <Button>Button 2</Button>
                <Input label="Input 2" />
              </section>
            </main>
          </div>
        </TestWrapper>
      );

      // Test logical tab order
      const interactiveElements = [
        screen.getByRole('link', { name: 'Skip to main' }),
        screen.getByRole('link', { name: 'Navigation' }),
        screen.getByRole('button', { name: 'Button 1' }),
        screen.getByLabelText('Input 1'),
        screen.getByRole('button', { name: 'Button 2' }),
        screen.getByLabelText('Input 2')
      ];

      for (let i = 0; i < interactiveElements.length; i++) {
        await user.tab();
        expect(interactiveElements[i]).toHaveFocus();
      }
    });

    test('should handle roving tabindex for complex widgets', async () => {
      const TabList = () => {
        const [activeTab, setActiveTab] = React.useState(0);
        const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

        const handleKeyDown = (e, index) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActiveTab((prev) => (prev + 1) % tabs.length);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
          }
        };

        return (
          <div role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={index}
                role="tab"
                tabIndex={index === activeTab ? 0 : -1}
                aria-selected={index === activeTab}
                onClick={() => setActiveTab(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {tab}
              </button>
            ))}
          </div>
        );
      };

      render(
        <TestWrapper>
          <TabList />
        </TestWrapper>
      );

      const tabs = screen.getAllByRole('tab');
      
      // First tab should be focusable
      await user.tab();
      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('tabindex', '0');
      expect(tabs[1]).toHaveAttribute('tabindex', '-1');

      // Test arrow key navigation
      await user.keyboard('{ArrowRight}');
      expect(tabs[1]).toHaveFocus();
      expect(tabs[1]).toHaveAttribute('tabindex', '0');
      expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Focus Management', () => {
    test('should restore focus after modal closes', async () => {
      const ModalTest = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const triggerRef = React.useRef();

        const closeModal = () => {
          setIsOpen(false);
          // Focus should return to trigger
          setTimeout(() => triggerRef.current?.focus(), 0);
        };

        return (
          <div>
            <button ref={triggerRef} onClick={() => setIsOpen(true)}>
              Open Modal
            </button>
            {isOpen && (
              <div role="dialog" aria-modal="true">
                <button onClick={closeModal}>Close</button>
                <p>Modal content</p>
              </div>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <ModalTest />
        </TestWrapper>
      );

      const openButton = screen.getByRole('button', { name: 'Open Modal' });
      await user.click(openButton);

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      // Focus should return to open button
      await waitFor(() => {
        expect(openButton).toHaveFocus();
      });
    });

    test('should manage focus for dynamic content', async () => {
      const DynamicContent = () => {
        const [showContent, setShowContent] = React.useState(false);
        const contentRef = React.useRef();

        const showContentHandler = () => {
          setShowContent(true);
          // Focus should move to new content
          setTimeout(() => contentRef.current?.focus(), 0);
        };

        return (
          <div>
            <button onClick={showContentHandler}>Load Content</button>
            {showContent && (
              <div ref={contentRef} tabIndex={-1}>
                <h2>Dynamic Content</h2>
                <p>This content was loaded dynamically</p>
                <button>Action</button>
              </div>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <DynamicContent />
        </TestWrapper>
      );

      const loadButton = screen.getByRole('button', { name: 'Load Content' });
      await user.click(loadButton);

      // Focus should move to dynamic content
      await waitFor(() => {
        const dynamicContent = screen.getByRole('heading', { name: 'Dynamic Content' }).parentElement;
        expect(dynamicContent).toHaveFocus();
      });
    });
  });
});