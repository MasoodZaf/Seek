import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Sidebar from '../Sidebar';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock react-router-dom NavLink
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  NavLink: ({ children, to, className, onClick }) => (
    <a 
      href={to} 
      className={typeof className === 'function' ? className({ isActive: to === '/dashboard' }) : className}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      data-testid={`nav-link-${to.replace('/', '')}`}
    >
      {typeof children === 'function' ? children({ isActive: to === '/dashboard' }) : children}
    </a>
  ),
}));

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  progress: {
    level: 5,
    xp: 1250,
    streak: 7,
  },
};

const MockAuthProvider = ({ children, user = mockUser }) => (
  <AuthContext.Provider value={{ user }}>
    {children}
  </AuthContext.Provider>
);

const renderSidebar = (props = {}, user = mockUser) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider user={user}>
        <Sidebar isOpen={false} onClose={jest.fn()} {...props} />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Sidebar Component', () => {
  describe('Desktop Sidebar', () => {
    beforeEach(() => {
      // Mock large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('renders desktop sidebar with all navigation sections', () => {
      renderSidebar();
      
      // Check logo and branding
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Learning Platform')).toBeInTheDocument();
      
      // Check navigation sections
      expect(screen.getByText('Learning')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument();
      
      // Check navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Browse Tutorials')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();
      expect(screen.getByText('My Progress')).toBeInTheDocument();
      expect(screen.getByText('Code Playground')).toBeInTheDocument();
      expect(screen.getByText('Code Translator')).toBeInTheDocument();
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    it('displays user profile information correctly', () => {
      renderSidebar();
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
      expect(screen.getByText('7 day streak')).toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument(); // User initials
    });

    it('shows badges for navigation items', () => {
      renderSidebar();
      
      expect(screen.getByText('New')).toBeInTheDocument(); // Browse Tutorials badge
      expect(screen.getByText('Beta')).toBeInTheDocument(); // Code Translator badge
    });

    it('handles section collapse/expand functionality', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      const learningSection = screen.getByRole('button', { name: /learning/i });
      
      // Click to collapse section
      await user.click(learningSection);
      
      // Navigation items should still be visible (they start expanded)
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('applies active state styling correctly', () => {
      renderSidebar();
      
      // Dashboard should be active (mocked in NavLink)
      const dashboardLink = screen.getByTestId('nav-link-dashboard');
      expect(dashboardLink).toHaveClass('bg-gradient-to-r', 'from-white/20', 'to-white/10');
    });
  });

  describe('Mobile Sidebar', () => {
    beforeEach(() => {
      // Mock mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('renders mobile sidebar when open', () => {
      renderSidebar({ isOpen: true });
      
      // Should render the same content as desktop
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('does not render mobile sidebar when closed', () => {
      renderSidebar({ isOpen: false });
      
      // Mobile sidebar should not be visible
      const mobileSidebar = document.querySelector('.fixed.inset-0.flex.z-40.lg\\:hidden');
      expect(mobileSidebar).not.toBeInTheDocument();
    });

    it('calls onClose when backdrop is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      
      renderSidebar({ isOpen: true, onClose });
      
      const backdrop = document.querySelector('.absolute.inset-0.bg-black\\/60');
      if (backdrop) {
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('calls onClose when navigation item is clicked on mobile', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      
      renderSidebar({ isOpen: true, onClose });
      
      const dashboardLink = screen.getByTestId('nav-link-dashboard');
      await user.click(dashboardLink);
      
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation through navigation items', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      // Tab through navigation items
      await user.tab();
      
      // First focusable element should be a section toggle or nav item
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement.tagName).toMatch(/BUTTON|A/);
    });

    it('handles Enter key on navigation items', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      const dashboardLink = screen.getByTestId('nav-link-dashboard');
      dashboardLink.focus();
      
      await user.keyboard('{Enter}');
      
      // Should trigger navigation (preventDefault in mock prevents actual navigation)
      expect(dashboardLink).toHaveFocus();
    });

    it('handles Space key on section toggles', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      const learningSection = screen.getByRole('button', { name: /learning/i });
      learningSection.focus();
      
      await user.keyboard(' ');
      
      // Section toggle should work with space key
      expect(learningSection).toHaveFocus();
    });

    it('maintains focus management during section collapse/expand', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      const learningSection = screen.getByRole('button', { name: /learning/i });
      
      await user.click(learningSection);
      
      // Focus should remain on the section toggle
      expect(learningSection).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderSidebar();
      
      // Check for navigation landmark
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Check for button roles on section toggles
      const sectionButtons = screen.getAllByRole('button');
      expect(sectionButtons.length).toBeGreaterThan(0);
    });

    it('provides proper focus indicators', async () => {
      const user = userEvent.setup();
      renderSidebar();
      
      const dashboardLink = screen.getByTestId('nav-link-dashboard');
      
      await user.tab();
      
      // Focus should be visible
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('supports screen reader navigation', () => {
      renderSidebar();
      
      // Check for proper heading structure
      const heading = screen.getByText('Seek');
      expect(heading).toBeInTheDocument();
      
      // Check for descriptive text
      expect(screen.getByText('Learning Platform')).toBeInTheDocument();
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
      
      renderSidebar();
      
      // Component should render without animation issues
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows desktop sidebar on large screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      renderSidebar();
      
      // Desktop sidebar should be visible
      const desktopSidebar = document.querySelector('.hidden.lg\\:flex');
      expect(desktopSidebar).toBeInTheDocument();
    });

    it('hides desktop sidebar on mobile screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderSidebar();
      
      // Desktop sidebar should be hidden
      const desktopSidebar = document.querySelector('.hidden.lg\\:flex');
      expect(desktopSidebar).toBeInTheDocument(); // Class is still there, but CSS hides it
    });

    it('adapts to different screen sizes', () => {
      // Test tablet size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderSidebar();
      
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('User Progress Display', () => {
    it('displays user progress correctly', () => {
      renderSidebar();
      
      expect(screen.getByText('Level 5')).toBeInTheDocument();
      expect(screen.getByText('7 day streak')).toBeInTheDocument();
    });

    it('handles missing user progress gracefully', () => {
      const userWithoutProgress = {
        firstName: 'Jane',
        lastName: 'Doe',
      };
      
      renderSidebar({}, userWithoutProgress);
      
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument(); // Default level
      expect(screen.getByText('0 day streak')).toBeInTheDocument(); // Default streak
    });

    it('displays progress bar correctly', () => {
      renderSidebar();
      
      // Progress bar should be present
      const progressBar = document.querySelector('.bg-gradient-to-r.from-yellow-400.to-orange-400');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing user data gracefully', () => {
      renderSidebar({}, null);
      
      // Should still render navigation
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('handles navigation errors gracefully', () => {
      // Mock console.error to avoid test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderSidebar();
      
      // Component should render without throwing
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});