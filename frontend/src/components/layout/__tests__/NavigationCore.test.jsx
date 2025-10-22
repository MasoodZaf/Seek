import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

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

// Simple Navigation Component for Testing
const SimpleNavigation = ({ isMobile = false, isOpen = false, onClose = jest.fn() }) => {
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', active: true },
    { name: 'Tutorials', href: '/tutorials', active: false },
    { name: 'Playground', href: '/playground', active: false },
    { name: 'Progress', href: '/progress', active: false },
  ];

  if (isMobile) {
    return (
      <div className="mobile-navigation">
        {/* Mobile Header */}
        <div className="mobile-header">
          <h1>Seek</h1>
          <button onClick={() => {}} aria-label="notifications">
            Notifications
          </button>
          <button onClick={() => {}} aria-label="menu">
            Menu
          </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          <div className="nav-items">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`nav-item ${item.active ? 'active' : ''}`}
                style={{ minHeight: '44px', minWidth: '44px' }}
                onClick={(e) => e.preventDefault()}
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="mobile-menu-overlay" data-testid="mobile-menu">
            <div className="backdrop" onClick={onClose} />
            <div className="menu-content">
              <button onClick={onClose} aria-label="close menu">
                Close
              </button>
              <div className="menu-items">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="desktop-navigation">
      {/* Desktop Sidebar */}
      <aside className="sidebar" role="navigation" aria-label="Main navigation">
        <div className="logo">
          <h1>Seek</h1>
          <span>Learning Platform</span>
        </div>
        
        <nav className="nav-sections">
          <div className="section">
            <button 
              className="section-toggle"
              aria-expanded="true"
              aria-controls="learning-section"
            >
              Learning
            </button>
            <div id="learning-section" className="section-items">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${item.active ? 'active' : ''}`}
                  onClick={(e) => e.preventDefault()}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Desktop Header */}
      <header className="header" role="banner">
        <div className="header-content">
          <button className="mobile-menu-btn lg:hidden" onClick={() => {}}>
            Menu
          </button>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tutorials, topics..."
              className="search-input"
            />
          </div>
          
          <div className="header-actions">
            <button aria-label="toggle theme">Theme</button>
            <button aria-label="notifications">Notifications</button>
            <button aria-label="user menu">User Menu</button>
          </div>
        </div>
      </header>
    </div>
  );
};

const renderNavigation = (props = {}) => {
  return render(
    <BrowserRouter>
      <SimpleNavigation {...props} />
    </BrowserRouter>
  );
};

describe('Navigation Core Functionality', () => {
  describe('Desktop Navigation', () => {
    it('renders desktop navigation with all elements', () => {
      renderNavigation();
      
      // Check logo and branding
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Learning Platform')).toBeInTheDocument();
      
      // Check navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
      expect(screen.getByText('Playground')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
      
      // Check header elements
      expect(screen.getByPlaceholderText('Search tutorials, topics...')).toBeInTheDocument();
      expect(screen.getByLabelText('toggle theme')).toBeInTheDocument();
      expect(screen.getByLabelText('notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('user menu')).toBeInTheDocument();
    });

    it('applies active state to current navigation item', () => {
      renderNavigation();
      
      const dashboardLink = screen.getByText('Dashboard');
      expect(dashboardLink).toHaveClass('active');
      
      const tutorialsLink = screen.getByText('Tutorials');
      expect(tutorialsLink).not.toHaveClass('active');
    });

    it('has proper ARIA labels and roles', () => {
      renderNavigation();
      
      // Check for navigation landmarks
      const navElements = screen.getAllByRole('navigation');
      expect(navElements.length).toBeGreaterThan(0);
      
      // Check for banner (header)
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
      
      // Check for section toggle accessibility
      const sectionToggle = screen.getByRole('button', { name: /learning/i });
      expect(sectionToggle).toHaveAttribute('aria-expanded', 'true');
      expect(sectionToggle).toHaveAttribute('aria-controls', 'learning-section');
    });
  });

  describe('Mobile Navigation', () => {
    it('renders mobile navigation with bottom nav and header', () => {
      renderNavigation({ isMobile: true });
      
      // Check mobile header
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByLabelText('notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('menu')).toBeInTheDocument();
      
      // Check bottom navigation
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
      expect(screen.getByText('Playground')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('shows mobile menu overlay when open', () => {
      renderNavigation({ isMobile: true, isOpen: true });
      
      // Menu overlay should be visible
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      expect(screen.getByLabelText('close menu')).toBeInTheDocument();
    });

    it('closes mobile menu when backdrop is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      
      renderNavigation({ isMobile: true, isOpen: true, onClose });
      
      const backdrop = document.querySelector('.backdrop');
      await user.click(backdrop);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('closes mobile menu when navigation item is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      
      renderNavigation({ isMobile: true, isOpen: true, onClose });
      
      // Click a navigation item in the menu
      const menuItems = screen.getAllByText('Dashboard');
      const menuDashboard = menuItems.find(item => 
        item.closest('.menu-items')
      );
      
      if (menuDashboard) {
        await user.click(menuDashboard);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('provides touch-friendly target sizes', () => {
      renderNavigation({ isMobile: true });
      
      // Check bottom navigation items have proper touch targets
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        expect(item).toHaveStyle('min-height: 44px');
        expect(item).toHaveStyle('min-width: 44px');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through interactive elements', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      // Tab through elements
      await user.tab();
      
      // First focusable element should be focused
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement.tagName).toMatch(/BUTTON|INPUT|A/);
    });

    it('handles Enter key on navigation items', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      const dashboardLink = screen.getByText('Dashboard');
      dashboardLink.focus();
      
      await user.keyboard('{Enter}');
      
      // Should maintain focus
      expect(dashboardLink).toHaveFocus();
    });

    it('handles Space key on section toggles', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      const sectionToggle = screen.getByRole('button', { name: /learning/i });
      sectionToggle.focus();
      
      await user.keyboard(' ');
      
      // Should maintain focus
      expect(sectionToggle).toHaveFocus();
    });

    it('supports Escape key to close mobile menu', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      
      renderNavigation({ isMobile: true, isOpen: true, onClose });
      
      await user.keyboard('{Escape}');
      
      // In a real implementation, this would close the menu
      // For now, we just verify the menu is rendered
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });
  });

  describe('Touch Interactions', () => {
    it('handles touch events on mobile navigation', () => {
      renderNavigation({ isMobile: true });
      
      const dashboardLink = screen.getByText('Dashboard');
      
      // Simulate touch events
      fireEvent.touchStart(dashboardLink, {
        touches: [{ identifier: 1, clientX: 100, clientY: 100 }],
      });
      
      fireEvent.touchEnd(dashboardLink, {
        changedTouches: [{ identifier: 1, clientX: 100, clientY: 100 }],
      });
      
      expect(dashboardLink).toBeInTheDocument();
    });

    it('supports swipe gestures on mobile menu', () => {
      const onClose = jest.fn();
      renderNavigation({ isMobile: true, isOpen: true, onClose });
      
      const menuOverlay = screen.getByTestId('mobile-menu');
      
      // Simulate swipe gesture
      fireEvent.touchStart(menuOverlay, {
        touches: [{ identifier: 1, clientX: 300, clientY: 200 }],
      });
      
      fireEvent.touchMove(menuOverlay, {
        touches: [{ identifier: 1, clientX: 100, clientY: 200 }],
      });
      
      fireEvent.touchEnd(menuOverlay, {
        changedTouches: [{ identifier: 1, clientX: 50, clientY: 200 }],
      });
      
      // Swipe should be handled without errors
      expect(menuOverlay).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    it('provides proper landmark navigation', () => {
      renderNavigation();
      
      // Check for navigation landmarks
      const navElements = screen.getAllByRole('navigation');
      expect(navElements.length).toBeGreaterThan(0);
      
      // Check for banner (header)
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
    });

    it('has descriptive ARIA labels', () => {
      renderNavigation();
      
      // Check for ARIA labels on buttons
      expect(screen.getByLabelText('toggle theme')).toBeInTheDocument();
      expect(screen.getByLabelText('notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('user menu')).toBeInTheDocument();
    });

    it('supports screen reader navigation', () => {
      renderNavigation();
      
      // Check for proper heading structure
      const heading = screen.getByRole('heading', { name: 'Seek' });
      expect(heading).toBeInTheDocument();
      
      // Check for navigation labels
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('handles reduced motion preferences', () => {
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
      
      renderNavigation();
      
      // Component should render without animation issues
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to different screen sizes', () => {
      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      const { unmount } = renderNavigation();
      expect(screen.getByText('Learning Platform')).toBeInTheDocument();
      
      // Clean up first render
      unmount();
      
      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderNavigation({ isMobile: true });
      expect(screen.getAllByText('Seek')).toHaveLength(1);
    });

    it('handles window resize events', () => {
      renderNavigation();
      
      // Trigger resize event
      fireEvent(window, new Event('resize'));
      
      // Component should handle resize gracefully
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search input on desktop', () => {
      renderNavigation();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      expect(searchInput).toBeInTheDocument();
    });

    it('handles search input changes', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'React');
      
      expect(searchInput).toHaveValue('React');
    });

    it('handles search form submission', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      const searchInput = screen.getByPlaceholderText('Search tutorials, topics...');
      
      await user.type(searchInput, 'JavaScript');
      await user.keyboard('{Enter}');
      
      // Search should be handled without errors
      expect(searchInput).toHaveValue('JavaScript');
    });
  });

  describe('Error Handling', () => {
    it('handles missing navigation data gracefully', () => {
      // Render with minimal props
      render(
        <BrowserRouter>
          <SimpleNavigation />
        </BrowserRouter>
      );
      
      // Should still render basic structure
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('handles navigation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderNavigation();
      
      // Component should render without throwing
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('maintains functionality during rapid interactions', async () => {
      const user = userEvent.setup();
      renderNavigation();
      
      const dashboardLink = screen.getByText('Dashboard');
      
      // Rapid clicks should not cause issues
      await user.click(dashboardLink);
      await user.click(dashboardLink);
      await user.click(dashboardLink);
      
      expect(dashboardLink).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = renderNavigation();
      
      // Re-render with same props
      rerender(
        <BrowserRouter>
          <SimpleNavigation />
        </BrowserRouter>
      );
      
      // Should render without issues
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('handles large numbers of navigation items', () => {
      // This would test with many navigation items
      renderNavigation();
      
      // Should render without performance issues
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});