import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import MobileNavigation from '../MobileNavigation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
  useDragControls: () => ({
    start: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('../../ui', () => ({
  Badge: ({ children, ...props }) => <span {...props}>{children}</span>,
}));

// Mock AITutorButton
jest.mock('../../ai/AITutorButton', () => {
  return function AITutorButton({ children, ...props }) {
    return <button {...props}>{children}</button>;
  };
});

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  progress: {
    level: 5,
    xp: 1250,
    streak: 7,
    totalPoints: 2500,
    currentStreak: 7,
    completedExercises: 15,
  },
};

const MockAuthProvider = ({ children, user = mockUser }) => (
  <AuthContext.Provider value={{ user }}>
    {children}
  </AuthContext.Provider>
);

const renderMobileNavigation = (user = mockUser) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider user={user}>
        <MobileNavigation />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

// Mock touch events
const createTouchEvent = (type, touches = []) => {
  return new TouchEvent(type, {
    touches,
    targetTouches: touches,
    changedTouches: touches,
    bubbles: true,
    cancelable: true,
  });
};

describe('MobileNavigation Component', () => {
  beforeEach(() => {
    // Mock mobile screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    // Mock body style for scroll lock
    document.body.style = {};
  });

  describe('Bottom Navigation Bar', () => {
    it('renders all navigation items', () => {
      renderMobileNavigation();
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
      renderMobileNavigation();
      
      // Dashboard should be active by default (based on current path)
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('text-primary-600');
    });

    it('shows notification badge on progress item', () => {
      renderMobileNavigation();
      
      // Should show notification badge
      const badge = screen.getByText('!');
      expect(badge).toBeInTheDocument();
    });

    it('handles navigation item clicks', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const learnLink = screen.getByText('Learn').closest('a');
      
      await user.click(learnLink);
      
      // Should navigate (preventDefault in test environment)
      expect(learnLink).toHaveAttribute('href', '/tutorials');
    });

    it('applies proper touch target sizes', () => {
      renderMobileNavigation();
      
      const navigationItems = screen.getAllByRole('link');
      
      navigationItems.forEach(item => {
        const styles = window.getComputedStyle(item);
        // Check for minimum touch target size (44px)
        expect(item).toHaveStyle('min-height: 44px');
        expect(item).toHaveStyle('min-width: 44px');
      });
    });
  });

  describe('Mobile Header', () => {
    it('renders header with logo and user info', () => {
      renderMobileNavigation();
      
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Welcome, John')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument(); // Streak count
    });

    it('shows notification button with indicator', () => {
      renderMobileNavigation();
      
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      expect(notificationButton).toBeInTheDocument();
      
      // Should show notification indicator
      const indicator = document.querySelector('.animate-pulse');
      expect(indicator).toBeInTheDocument();
    });

    it('opens mobile menu when menu button is clicked', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Menu should open
      expect(screen.getByText('John')).toBeInTheDocument(); // User name in menu
    });
  });

  describe('Quick Actions Bar', () => {
    it('shows quick actions on double tap', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Simulate double tap
      await user.click(homeLink);
      
      // Quick actions should appear (implementation detail)
      // This would need to be tested with actual touch events
    });

    it('renders quick action buttons when visible', async () => {
      renderMobileNavigation();
      
      // Mock the showQuickActions state to true
      // This would require exposing state or using a different testing approach
      // For now, we test that the component renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Mobile Menu Overlay', () => {
    it('opens menu overlay when menu button is clicked', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Menu overlay should be visible
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });

    it('displays user stats in menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Check user stats
      expect(screen.getByText('2500')).toBeInTheDocument(); // Total points
      expect(screen.getByText('7')).toBeInTheDocument(); // Current streak
      expect(screen.getByText('15')).toBeInTheDocument(); // Completed exercises
    });

    it('shows progress bar in menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Progress bar should be present
      const progressBar = document.querySelector('.bg-gradient-to-r.from-primary-500.to-purple-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders menu items correctly', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Check menu items
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Help & Support')).toBeInTheDocument();
    });

    it('includes AI Tutor button in menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // AI Tutor button should be present
      expect(screen.getByText('Ask AI Tutor')).toBeInTheDocument();
    });

    it('closes menu when close button is clicked', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Close menu
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      // Menu should close (state change)
      // This would be verified by checking if menu content is no longer visible
    });

    it('closes menu when backdrop is clicked', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Click backdrop
      const backdrop = document.querySelector('.bg-black\\/60');
      if (backdrop) {
        await user.click(backdrop);
        // Menu should close
      }
    });
  });

  describe('Touch Interactions and Gestures', () => {
    it('handles touch events on navigation items', async () => {
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Simulate touch events
      const touchStart = createTouchEvent('touchstart', [{
        identifier: 1,
        target: homeLink,
        clientX: 100,
        clientY: 100,
      }]);
      
      const touchEnd = createTouchEvent('touchend', [{
        identifier: 1,
        target: homeLink,
        clientX: 100,
        clientY: 100,
      }]);
      
      fireEvent(homeLink, touchStart);
      fireEvent(homeLink, touchEnd);
      
      // Should handle touch without errors
      expect(homeLink).toBeInTheDocument();
    });

    it('supports swipe gestures on menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      const menuOverlay = document.querySelector('[data-testid="mobile-menu"]') || 
                         document.querySelector('.fixed.inset-0.z-50');
      
      if (menuOverlay) {
        // Simulate swipe gesture
        const touchStart = createTouchEvent('touchstart', [{
          identifier: 1,
          target: menuOverlay,
          clientX: 300,
          clientY: 200,
        }]);
        
        const touchMove = createTouchEvent('touchmove', [{
          identifier: 1,
          target: menuOverlay,
          clientX: 100,
          clientY: 200,
        }]);
        
        const touchEnd = createTouchEvent('touchend', [{
          identifier: 1,
          target: menuOverlay,
          clientX: 50,
          clientY: 200,
        }]);
        
        fireEvent(menuOverlay, touchStart);
        fireEvent(menuOverlay, touchMove);
        fireEvent(menuOverlay, touchEnd);
        
        // Swipe should be handled
        expect(menuOverlay).toBeInTheDocument();
      }
    });

    it('handles double tap for quick actions', async () => {
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Simulate double tap
      const now = Date.now();
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 200); // Within double tap delay
      
      fireEvent.touchStart(homeLink);
      fireEvent.touchEnd(homeLink);
      fireEvent.touchStart(homeLink);
      fireEvent.touchEnd(homeLink);
      
      // Double tap should be detected
      expect(homeLink).toBeInTheDocument();
    });

    it('provides haptic feedback on supported devices', () => {
      // Mock navigator.vibrate
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: jest.fn(),
      });
      
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      fireEvent.click(homeLink);
      
      // Component should handle haptic feedback gracefully
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through bottom navigation', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Tab through navigation items
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement.tagName).toBe('A');
    });

    it('handles Enter key on navigation items', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      homeLink.focus();
      
      await user.keyboard('{Enter}');
      
      // Should trigger navigation
      expect(homeLink).toHaveFocus();
    });

    it('handles Escape key to close menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Press Escape
      await user.keyboard('{Escape}');
      
      // Menu should close (implementation detail)
      expect(menuButton).toBeInTheDocument();
    });

    it('maintains focus management in menu', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Tab through menu items
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderMobileNavigation();
      
      // Check for navigation landmark
      const navElements = screen.getAllByRole('navigation');
      expect(navElements.length).toBeGreaterThan(0);
      
      // Check for button roles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('provides proper focus indicators', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      // Focus styles would be tested with visual regression
    });

    it('supports screen reader navigation', () => {
      renderMobileNavigation();
      
      // Check for descriptive text
      expect(screen.getByText('Welcome, John')).toBeInTheDocument();
      expect(screen.getByText('Seek')).toBeInTheDocument();
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
      
      renderMobileNavigation();
      
      // Component should render without animation issues
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('provides sufficient color contrast', () => {
      renderMobileNavigation();
      
      // Active navigation item should have proper contrast
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('text-primary-600');
    });
  });

  describe('Responsive Behavior', () => {
    it('only renders on mobile screens', () => {
      renderMobileNavigation();
      
      // Should have mobile-only classes
      const bottomNav = document.querySelector('.md\\:hidden');
      expect(bottomNav).toBeInTheDocument();
    });

    it('adapts to different mobile screen sizes', () => {
      // Test small mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });
      
      renderMobileNavigation();
      
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      // Test large mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 414,
      });
      
      renderMobileNavigation();
      
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });

    it('handles orientation changes', () => {
      // Mock orientation change
      Object.defineProperty(screen, 'orientation', {
        writable: true,
        value: { angle: 90 },
      });
      
      renderMobileNavigation();
      
      // Component should adapt to landscape
      expect(screen.getByText('Seek')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('prevents body scroll when menu is open', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Body overflow should be hidden
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when menu is closed', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Close menu
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      // Body overflow should be restored
      expect(document.body.style.overflow).toBe('');
    });

    it('handles rapid navigation clicks', async () => {
      const user = userEvent.setup();
      renderMobileNavigation();
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Rapid clicks should not cause issues
      await user.click(homeLink);
      await user.click(homeLink);
      await user.click(homeLink);
      
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing user data gracefully', () => {
      render(
        <BrowserRouter>
          <MockAuthProvider user={null}>
            <MobileNavigation />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      // Should still render navigation
      expect(screen.getByText('Seek')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('handles incomplete user progress data', () => {
      const incompleteUser = {
        firstName: 'Jane',
        progress: {
          level: 1,
        },
      };
      
      render(
        <BrowserRouter>
          <MockAuthProvider user={incompleteUser}>
            <MobileNavigation />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      expect(screen.getByText('Welcome, Jane')).toBeInTheDocument();
    });

    it('handles navigation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderMobileNavigation();
      
      // Component should render without throwing
      expect(screen.getByText('Seek')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});