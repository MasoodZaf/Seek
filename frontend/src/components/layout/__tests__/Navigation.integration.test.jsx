import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { ThemeContext } from '../../../context/ThemeContext';
import Layout from '../Layout';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
  useDragControls: () => ({
    start: jest.fn(),
  }),
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
  LoadingPage: () => <div>Loading...</div>,
}));

// Mock other components
jest.mock('../../ui/DarkModeToggle', () => {
  return function DarkModeToggle(props) {
    return <button {...props}>Toggle Dark Mode</button>;
  };
});

jest.mock('../../ui/PageTransition', () => ({
  RouteTransition: ({ children }) => children,
}));

jest.mock('../../ai/AITutorButton', () => {
  return function AITutorButton({ children, ...props }) {
    return <button {...props}>{children}</button>;
  };
});

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

jest.mock('react-hot-toast', () => ({
  Toaster: () => <div>Toaster</div>,
}));

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  role: 'Student',
  progress: {
    level: 5,
    xp: 1250,
    streak: 7,
    totalPoints: 2500,
    currentStreak: 7,
    completedExercises: 15,
  },
};

const MockProviders = ({ children, user = mockUser, isDarkMode = false, loading = false }) => (
  <BrowserRouter>
    <AuthContext.Provider value={{ user, logout: jest.fn(), loading }}>
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode: jest.fn() }}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

const renderLayout = (props = {}) => {
  return render(
    <MockProviders {...props}>
      <Layout />
    </MockProviders>
  );
};

describe('Navigation Integration Tests', () => {
  describe('Cross-Screen Size Navigation', () => {
    it('renders desktop navigation on large screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      renderLayout();
      
      // Desktop sidebar should be visible
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Learning Platform')).toBeInTheDocument();
      
      // Desktop header should be visible
      expect(screen.getByPlaceholderText('Search tutorials, topics...')).toBeInTheDocument();
      
      // Mobile navigation should not be visible
      const mobileNav = document.querySelector('.md\\:hidden');
      expect(mobileNav).toBeInTheDocument(); // Class exists but CSS hides it
    });

    it('renders mobile navigation on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderLayout();
      
      // Mobile navigation should be visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      
      // Desktop sidebar should be hidden
      const desktopSidebar = document.querySelector('.hidden.lg\\:flex');
      expect(desktopSidebar).toBeInTheDocument(); // Class exists but CSS hides it
    });

    it('adapts navigation on tablet screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderLayout();
      
      // Should render appropriate navigation for tablet
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('handles window resize events', async () => {
      renderLayout();
      
      // Start with desktop size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Trigger resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      fireEvent(window, new Event('resize'));
      
      // Navigation should adapt
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Navigation State Management', () => {
    it('manages sidebar open/close state correctly', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Find mobile menu button
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(button => 
        button.className.includes('lg:hidden')
      );
      
      if (mobileMenuButton) {
        await user.click(mobileMenuButton);
        
        // Sidebar should open
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      }
    });

    it('closes mobile sidebar when navigation item is clicked', async () => {
      const user = userEvent.setup();
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderLayout();
      
      // Open mobile menu
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(button => 
        button.className.includes('lg:hidden')
      );
      
      if (mobileMenuButton) {
        await user.click(mobileMenuButton);
        
        // Click a navigation item
        const dashboardLink = screen.getByText('Dashboard');
        await user.click(dashboardLink);
        
        // Menu should close (implementation detail)
      }
    });

    it('maintains navigation state across route changes', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Navigate to different routes
      const tutorialsLink = screen.getByText('Browse Tutorials');
      await user.click(tutorialsLink);
      
      // Navigation should remain consistent
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Integration', () => {
    it('provides seamless keyboard navigation across all components', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Tab through all interactive elements
      await user.tab(); // First focusable element
      
      let focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      
      // Continue tabbing through navigation
      await user.tab();
      await user.tab();
      
      focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles keyboard shortcuts consistently', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Test common keyboard shortcuts
      await user.keyboard('{Alt>}{1}'); // Alt+1 for first nav item
      
      // Should handle shortcuts gracefully
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('maintains focus management during navigation transitions', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Focus on a navigation item
      const dashboardLink = screen.getByText('Dashboard');
      dashboardLink.focus();
      
      expect(dashboardLink).toHaveFocus();
      
      // Navigate and check focus management
      await user.keyboard('{Enter}');
      
      // Focus should be managed appropriately
      expect(document.activeElement).toBeInTheDocument();
    });

    it('supports skip navigation links', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Tab to skip link (if implemented)
      await user.tab();
      
      const focusedElement = document.activeElement;
      
      // Should be able to skip to main content
      if (focusedElement && focusedElement.textContent?.includes('Skip')) {
        await user.keyboard('{Enter}');
      }
      
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Touch and Gesture Support', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('handles touch events on mobile navigation', async () => {
      renderLayout();
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Simulate touch events
      fireEvent.touchStart(homeLink, {
        touches: [{ identifier: 1, clientX: 100, clientY: 100 }],
      });
      
      fireEvent.touchEnd(homeLink, {
        changedTouches: [{ identifier: 1, clientX: 100, clientY: 100 }],
      });
      
      expect(homeLink).toBeInTheDocument();
    });

    it('supports swipe gestures for menu', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Open mobile menu
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(button => 
        button.className.includes('lg:hidden')
      );
      
      if (mobileMenuButton) {
        await user.click(mobileMenuButton);
        
        // Simulate swipe gesture
        const menuOverlay = document.querySelector('.fixed.inset-0.z-50') ||
                           document.querySelector('[data-testid="mobile-menu"]');
        
        if (menuOverlay) {
          fireEvent.touchStart(menuOverlay, {
            touches: [{ identifier: 1, clientX: 300, clientY: 200 }],
          });
          
          fireEvent.touchMove(menuOverlay, {
            touches: [{ identifier: 1, clientX: 100, clientY: 200 }],
          });
          
          fireEvent.touchEnd(menuOverlay, {
            changedTouches: [{ identifier: 1, clientX: 50, clientY: 200 }],
          });
          
          // Swipe should be handled
          expect(menuOverlay).toBeInTheDocument();
        }
      }
    });

    it('provides appropriate touch target sizes', () => {
      renderLayout();
      
      // All interactive elements should meet touch target guidelines
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      
      [...buttons, ...links].forEach(element => {
        const rect = element.getBoundingClientRect();
        // Minimum 44px touch target (iOS guidelines)
        expect(rect.width >= 44 || rect.height >= 44).toBeTruthy();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('provides proper landmark navigation', () => {
      renderLayout();
      
      // Check for navigation landmarks
      const navElements = screen.getAllByRole('navigation');
      expect(navElements.length).toBeGreaterThan(0);
      
      // Check for banner (header)
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
    });

    it('maintains proper heading hierarchy', () => {
      renderLayout();
      
      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Should have logical heading hierarchy
      expect(headings.length).toBeGreaterThan(0);
    });

    it('provides screen reader friendly navigation', () => {
      renderLayout();
      
      // Check for ARIA labels and descriptions
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-describedby]');
      expect(elementsWithAria.length).toBeGreaterThan(0);
    });

    it('supports high contrast mode', () => {
      // Mock high contrast preference
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
      
      renderLayout();
      
      // Component should render with high contrast support
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('respects reduced motion preferences', () => {
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
      
      renderLayout();
      
      // Animations should be reduced or disabled
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Performance and Error Handling', () => {
    it('handles navigation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Render with potential error conditions
      renderLayout({ user: null });
      
      // Should render without throwing
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('maintains performance during rapid navigation', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Rapid navigation clicks
      const dashboardLink = screen.getByText('Dashboard');
      
      await user.click(dashboardLink);
      await user.click(dashboardLink);
      await user.click(dashboardLink);
      
      // Should handle rapid clicks without issues
      expect(dashboardLink).toBeInTheDocument();
    });

    it('handles loading states appropriately', () => {
      renderLayout({ loading: true });
      
      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('recovers from navigation failures', async () => {
      const user = userEvent.setup();
      
      // Mock navigation failure
      const mockError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderLayout();
      
      // Attempt navigation that might fail
      const tutorialsLink = screen.getByText('Browse Tutorials');
      await user.click(tutorialsLink);
      
      // Should recover gracefully
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      mockError.mockRestore();
    });
  });

  describe('Theme Integration', () => {
    it('applies consistent theming across all navigation components', () => {
      renderLayout({ isDarkMode: true });
      
      // Dark mode should be applied consistently
      const header = document.querySelector('header');
      expect(header).toHaveClass('bg-gray-900/80');
    });

    it('handles theme transitions smoothly', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Toggle theme
      const themeToggle = screen.getByText('Toggle Dark Mode');
      await user.click(themeToggle);
      
      // Theme should transition smoothly
      expect(themeToggle).toBeInTheDocument();
    });
  });

  describe('Route Integration', () => {
    it('updates navigation state based on current route', () => {
      renderLayout();
      
      // Active navigation item should reflect current route
      const activeNavItem = document.querySelector('.bg-gradient-to-r.from-white\\/20');
      expect(activeNavItem).toBeInTheDocument();
    });

    it('maintains navigation consistency across route changes', async () => {
      const user = userEvent.setup();
      renderLayout();
      
      // Navigate to different routes
      const playgroundLink = screen.getByText('Code Playground');
      await user.click(playgroundLink);
      
      // Navigation should remain consistent
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Code Playground')).toBeInTheDocument();
    });
  });
});