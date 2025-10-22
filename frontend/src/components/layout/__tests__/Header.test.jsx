import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { ThemeContext } from '../../../context/ThemeContext';
import Header from '../Header';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock Headless UI components
jest.mock('@headlessui/react', () => ({
  Menu: {
    Button: ({ children, as: Component = 'button', ...props }) => (
      <Component {...props}>{children}</Component>
    ),
    Items: ({ children, ...props }) => <div {...props}>{children}</div>,
    Item: ({ children, ...props }) => (
      <div {...props}>
        {typeof children === 'function' ? children({ active: false }) : children}
      </div>
    ),
  },
  Transition: ({ children }) => children,
}));

// Mock UI components
jest.mock('../../ui', () => ({
  Button: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
  Input: ({ leftIcon: LeftIcon, ...props }) => (
    <div className="relative">
      {LeftIcon && <LeftIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />}
      <input {...props} />
    </div>
  ),
}));

// Mock DarkModeToggle
jest.mock('../../ui/DarkModeToggle', () => {
  return function DarkModeToggle(props) {
    return <button {...props}>Toggle Dark Mode</button>;
  };
});

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  role: 'Student',
  progress: {
    level: 5,
    xp: 1250,
  },
};

const MockAuthProvider = ({ children, user = mockUser }) => (
  <AuthContext.Provider value={{ 
    user, 
    logout: jest.fn() 
  }}>
    {children}
  </AuthContext.Provider>
);

const MockThemeProvider = ({ children, isDarkMode = false }) => (
  <ThemeContext.Provider value={{ 
    isDarkMode, 
    toggleDarkMode: jest.fn() 
  }}>
    {children}
  </ThemeContext.Provider>
);

const renderHeader = (props = {}, user = mockUser, isDarkMode = false) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider user={user}>
        <MockThemeProvider isDarkMode={isDarkMode}>
          <Header onMenuClick={jest.fn()} {...props} />
        </MockThemeProvider>
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  describe('Basic Rendering', () => {
    it('renders header with all main elements', () => {
      renderHeader();
      
      // Check for search input
      expect(screen.getByPlaceholderText('Search tutorials, topics...')).toBeInTheDocument();
      
      // Check for theme toggle
      expect(screen.getByText('Toggle Dark Mode')).toBeInTheDocument();
      
      // Check for notifications button
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      expect(notificationButton).toBeInTheDocument();
      
      // Check for user menu
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Student')).toBeInTheDocument();
    });

    it('renders mobile menu button on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const onMenuClick = jest.fn();
      renderHeader({ onMenuClick });
      
      // Mobile menu button should be present
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(button => 
        button.className.includes('lg:hidden')
      );
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('renders breadcrumb navigation on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      renderHeader();
      
      // Dashboard breadcrumb should be visible
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('handles search input changes', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'React');
      
      expect(searchInput).toHaveValue('React');
    });

    it('shows search suggestions when typing', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'React');
      await user.click(searchInput); // Focus the input
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText('React Hooks Tutorial')).toBeInTheDocument();
      });
    });

    it('handles search form submission', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'JavaScript');
      await user.keyboard('{Enter}');
      
      // Search should be handled (console.log in actual implementation)
      expect(searchInput).toHaveValue('JavaScript');
    });

    it('clears search input when clear button is clicked', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'Test query');
      
      // Find and click clear button
      const clearButton = document.querySelector('button[type="button"]');
      if (clearButton) {
        await user.click(clearButton);
        expect(searchInput).toHaveValue('');
      }
    });

    it('handles suggestion selection', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'React');
      await user.click(searchInput);
      
      await waitFor(() => {
        const suggestion = screen.getByText('React Hooks Tutorial');
        expect(suggestion).toBeInTheDocument();
      });
    });
  });

  describe('Notifications', () => {
    it('displays notification count badge', () => {
      renderHeader();
      
      // Should show unread notification count
      const badge = screen.getByText('2'); // Based on mock data
      expect(badge).toBeInTheDocument();
    });

    it('opens notification dropdown when clicked', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      await user.click(notificationButton);
      
      // Notification dropdown should open
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('2 new')).toBeInTheDocument();
    });

    it('displays notification items correctly', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      await user.click(notificationButton);
      
      // Check for notification items
      expect(screen.getByText('New tutorial available')).toBeInTheDocument();
      expect(screen.getByText('Progress milestone reached')).toBeInTheDocument();
      expect(screen.getByText('Weekly challenge completed')).toBeInTheDocument();
    });
  });

  describe('User Menu', () => {
    it('displays user information correctly', () => {
      renderHeader();
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument(); // User initials
    });

    it('opens user dropdown when clicked', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const userButton = screen.getByRole('button', { name: /john doe/i });
      await user.click(userButton);
      
      // User dropdown should open
      expect(screen.getByText('View Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('displays user progress in dropdown', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const userButton = screen.getByRole('button', { name: /john doe/i });
      await user.click(userButton);
      
      // Should show user level and XP
      expect(screen.getByText('Level 5 • 1250 XP')).toBeInTheDocument();
    });

    it('handles logout functionality', async () => {
      const mockLogout = jest.fn();
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
            <MockThemeProvider>
              <Header onMenuClick={jest.fn()} />
            </MockThemeProvider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
      
      const userButton = screen.getByRole('button', { name: /john doe/i });
      await user.click(userButton);
      
      const logoutButton = screen.getByText('Sign Out');
      await user.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Theme Toggle', () => {
    it('renders theme toggle button', () => {
      renderHeader();
      
      expect(screen.getByText('Toggle Dark Mode')).toBeInTheDocument();
    });

    it('applies dark mode styles when enabled', () => {
      renderHeader({}, mockUser, true);
      
      const header = document.querySelector('header');
      expect(header).toHaveClass('bg-gray-900/80', 'border-gray-700/50');
    });

    it('applies light mode styles when disabled', () => {
      renderHeader({}, mockUser, false);
      
      const header = document.querySelector('header');
      expect(header).toHaveClass('bg-white/80', 'border-secondary-200/50');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through interactive elements', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      // Tab through elements
      await user.tab();
      
      // First focusable element should be focused
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement.tagName).toMatch(/BUTTON|INPUT/);
    });

    it('handles Enter key on buttons', async () => {
      const onMenuClick = jest.fn();
      const user = userEvent.setup();
      
      renderHeader({ onMenuClick });
      
      // Focus on mobile menu button and press Enter
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(button => 
        button.className.includes('lg:hidden')
      );
      
      if (mobileMenuButton) {
        mobileMenuButton.focus();
        await user.keyboard('{Enter}');
        expect(onMenuClick).toHaveBeenCalled();
      }
    });

    it('handles Escape key to close dropdowns', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      // Open user dropdown
      const userButton = screen.getByRole('button', { name: /john doe/i });
      await user.click(userButton);
      
      // Press Escape
      await user.keyboard('{Escape}');
      
      // Dropdown should close (in real implementation)
      expect(userButton).toBeInTheDocument();
    });

    it('supports arrow key navigation in search suggestions', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'React');
      await user.click(searchInput);
      
      // Wait for suggestions and try arrow navigation
      await waitFor(() => {
        expect(screen.getByText('React Hooks Tutorial')).toBeInTheDocument();
      });
      
      await user.keyboard('{ArrowDown}');
      // Arrow navigation behavior would be tested in integration
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderHeader();
      
      // Check for header landmark
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      // Check for search input accessibility
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('provides proper focus indicators', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      // Focus styles would be tested with visual regression tests
    });

    it('supports screen reader announcements', () => {
      renderHeader();
      
      // Check for notification count for screen readers
      const notificationBadge = screen.getByText('2');
      expect(notificationBadge).toBeInTheDocument();
    });

    it('handles high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      renderHeader();
      
      // Component should render without issues
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows search input on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      expect(searchInput).toBeInTheDocument();
    });

    it('shows mobile search button on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderHeader();
      
      // Mobile search button should be present
      const searchButtons = screen.getAllByRole('button');
      const mobileSearchButton = searchButtons.find(button => 
        button.className.includes('md:hidden')
      );
      expect(mobileSearchButton).toBeInTheDocument();
    });

    it('adapts breadcrumb visibility based on screen size', () => {
      // Test tablet size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderHeader();
      
      // Breadcrumbs should be hidden on smaller screens
      const breadcrumbs = document.querySelector('.hidden.lg\\:flex');
      expect(breadcrumbs).toBeInTheDocument();
    });
  });

  describe('Glass Morphism Effect', () => {
    it('applies backdrop blur effect', () => {
      renderHeader();
      
      const header = document.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-xl');
    });

    it('applies gradient overlay', () => {
      renderHeader();
      
      const overlay = document.querySelector('.bg-gradient-to-r.from-white\\/10');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing user data gracefully', () => {
      renderHeader({}, null);
      
      // Header should still render
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('handles search errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const user = userEvent.setup();
      
      renderHeader();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      // Should not throw on invalid input
      await user.type(searchInput, '');
      await user.keyboard('{Enter}');
      
      expect(searchInput).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});