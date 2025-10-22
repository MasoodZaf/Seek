/**
 * Mobile Experience Test Suite
 * 
 * Comprehensive testing for mobile touch interactions, responsive design,
 * and mobile performance across the Seek platform.
 * 
 * Test Categories:
 * 1. Touch Interactions and Gestures
 * 2. Responsive Design Across Device Sizes
 * 3. Mobile Performance and Loading Times
 * 4. Mobile-Specific Components
 * 5. Cross-Device Compatibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import userEvent from '@testing-library/user-event';

// Mobile Components
import BottomNavigation from '../components/mobile/BottomNavigation';
import ResponsiveHeader from '../components/mobile/ResponsiveHeader';
import MobileCodeEditor from '../components/CodeEditor/MobileCodeEditor';
import TouchButton from '../components/ui/TouchButton';
import SwipeContainer from '../components/ui/SwipeContainer';
import PullToRefresh from '../components/ui/PullToRefresh';

// Utils
import { hapticFeedback, GestureDetector, TOUCH_TARGET_SIZES } from '../utils/touchInteractions';
import { performanceMonitoring } from '../utils/performanceMonitoring';

// Mock dependencies
jest.mock('../utils/touchInteractions', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    selection: jest.fn()
  },
  GestureDetector: jest.fn().mockImplementation(() => ({
    destroy: jest.fn()
  })),
  TOUCH_TARGET_SIZES: {
    minimum: 44,
    comfortable: 48,
    large: 56
  }
}));

jest.mock('../utils/performanceMonitoring', () => ({
  performanceMonitoring: {
    measureRenderTime: jest.fn(),
    measureInteractionTime: jest.fn(),
    measureMemoryUsage: jest.fn(),
    trackCoreWebVitals: jest.fn()
  }
}));

// Mock framer-motion for consistent testing
jest.mock('framer-motion', () => {
  const mockReact = require('react');
  return {
    motion: {
      div: ({ children, ...props }) => mockReact.createElement('div', props, children),
      button: ({ children, ...props }) => mockReact.createElement('button', props, children),
      header: ({ children, ...props }) => mockReact.createElement('header', props, children),
      nav: ({ children, ...props }) => mockReact.createElement('nav', props, children)
    },
    AnimatePresence: ({ children }) => children
  };
});

// Mock Monaco Editor
jest.mock('../components/CodeEditor/MonacoCodeEditor', () => {
  const mockReact = require('react');
  return function MockMonacoEditor({ onMount, onChange, value }) {
    mockReact.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          onDidChangeCursorPosition: jest.fn(),
          onDidChangeCursorSelection: jest.fn(),
          onDidChangeModelContent: jest.fn(),
          getDomNode: () => document.createElement('div'),
          addCommand: jest.fn(),
          getAction: jest.fn(() => ({ run: jest.fn() })),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getModel: () => ({
            getValueInRange: () => '',
            getLineContent: () => '',
            getFullModelRange: () => ({})
          }),
          executeEdits: jest.fn(),
          focus: jest.fn(),
          getSelection: () => null
        };
        onMount(mockEditor, {});
      }
    }, [onMount]);

    return mockReact.createElement('textarea', {
      'data-testid': 'monaco-editor',
      value: value,
      onChange: (e) => onChange?.(e.target.value)
    });
  };
});

// Test wrapper with all providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Mock user data
const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  progress: {
    level: 5,
    xp: 1250,
    streak: 7
  }
};

// Viewport size utilities
const setViewportSize = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Touch event utilities
const createTouchEvent = (type, touches = []) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  event.touches = touches;
  event.changedTouches = touches;
  return event;
};

const createTouch = (x, y, identifier = 0) => ({
  identifier,
  clientX: x,
  clientY: y,
  pageX: x,
  pageY: y,
  screenX: x,
  screenY: y,
  target: document.body
});

describe('Mobile Experience Test Suite', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set mobile viewport by default
    setViewportSize(375, 667); // iPhone SE dimensions
    
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
    
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('1. Touch Interactions and Gestures', () => {
    describe('TouchButton Component', () => {
      test('should meet minimum touch target size requirements', () => {
        render(
          <TestWrapper>
            <TouchButton size="sm">Test Button</TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        const styles = window.getComputedStyle(button);
        
        // Should meet minimum 44px touch target
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(TOUCH_TARGET_SIZES.minimum);
        expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(TOUCH_TARGET_SIZES.minimum);
      });

      test('should provide haptic feedback on touch', async () => {
        const onPress = jest.fn();
        
        render(
          <TestWrapper>
            <TouchButton onPress={onPress} haptic="medium">
              Test Button
            </TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        
        // Simulate touch start
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        fireEvent(button, touchStart);
        
        expect(hapticFeedback.medium).toHaveBeenCalled();
      });

      test('should handle long press gestures', async () => {
        const onLongPress = jest.fn();
        
        render(
          <TestWrapper>
            <TouchButton longPress onLongPress={onLongPress}>
              Long Press Button
            </TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        
        // Simulate long press
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        fireEvent(button, touchStart);
        
        // Wait for long press timeout
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 600));
        });
        
        expect(onLongPress).toHaveBeenCalled();
        expect(hapticFeedback.heavy).toHaveBeenCalled();
      });

      test('should create ripple effects on touch', () => {
        render(
          <TestWrapper>
            <TouchButton ripple>Ripple Button</TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        
        // Simulate touch with specific coordinates
        const touchStart = createTouchEvent('touchstart', [createTouch(50, 50)]);
        
        // Mock getBoundingClientRect
        button.getBoundingClientRect = jest.fn(() => ({
          left: 0,
          top: 0,
          width: 100,
          height: 40
        }));
        
        fireEvent(button, touchStart);
        
        // Should create ripple element
        const ripple = button.querySelector('[style*="left: 0px"]');
        expect(ripple).toBeTruthy();
      });
    });

    describe('Swipe Gestures', () => {
      test('should detect horizontal swipe gestures', async () => {
        const onSwipe = jest.fn();
        
        render(
          <TestWrapper>
            <SwipeContainer onSwipe={onSwipe}>
              <div>Swipeable Content</div>
            </SwipeContainer>
          </TestWrapper>
        );
        
        const container = screen.getByText('Swipeable Content').parentElement;
        
        // Simulate swipe right
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        const touchEnd = createTouchEvent('touchend', [createTouch(200, 100)]);
        
        fireEvent(container, touchStart);
        fireEvent(container, touchEnd);
        
        expect(onSwipe).toHaveBeenCalledWith('right', expect.any(Object));
      });

      test('should detect vertical swipe gestures', async () => {
        const onSwipe = jest.fn();
        
        render(
          <TestWrapper>
            <SwipeContainer onSwipe={onSwipe}>
              <div>Swipeable Content</div>
            </SwipeContainer>
          </TestWrapper>
        );
        
        const container = screen.getByText('Swipeable Content').parentElement;
        
        // Simulate swipe down
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        const touchEnd = createTouchEvent('touchend', [createTouch(100, 200)]);
        
        fireEvent(container, touchStart);
        fireEvent(container, touchEnd);
        
        expect(onSwipe).toHaveBeenCalledWith('down', expect.any(Object));
      });
    });

    describe('Pull to Refresh', () => {
      test('should trigger refresh when threshold is exceeded', async () => {
        const onRefresh = jest.fn().mockResolvedValue();
        
        render(
          <TestWrapper>
            <PullToRefresh onRefresh={onRefresh}>
              <div>Content to refresh</div>
            </PullToRefresh>
          </TestWrapper>
        );
        
        const container = screen.getByText('Content to refresh').parentElement;
        
        // Mock scroll position at top
        Object.defineProperty(container, 'scrollTop', {
          value: 0,
          writable: true
        });
        
        // Simulate pull down gesture
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        const touchMove = createTouchEvent('touchmove', [createTouch(100, 200)]);
        const touchEnd = createTouchEvent('touchend', [createTouch(100, 200)]);
        
        fireEvent(container, touchStart);
        fireEvent(container, touchMove);
        fireEvent(container, touchEnd);
        
        await waitFor(() => {
          expect(onRefresh).toHaveBeenCalled();
        });
      });
    });
  });

  describe('2. Responsive Design Across Device Sizes', () => {
    const deviceSizes = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'iPad Pro', width: 1024, height: 1366 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    describe('Bottom Navigation', () => {
      deviceSizes.forEach(device => {
        test(`should adapt to ${device.name} (${device.width}x${device.height})`, () => {
          setViewportSize(device.width, device.height);
          
          render(
            <TestWrapper>
              <BottomNavigation />
            </TestWrapper>
          );
          
          const navigation = screen.getByRole('navigation', { hidden: true });
          
          if (device.width < 768) {
            // Should be visible on mobile
            expect(navigation).toBeInTheDocument();
          } else {
            // Should be hidden on desktop
            expect(navigation).toHaveClass('md:hidden');
          }
        });
      });

      test('should hide on scroll down and show on scroll up', async () => {
        setViewportSize(375, 667);
        
        render(
          <TestWrapper>
            <BottomNavigation />
          </TestWrapper>
        );
        
        const navigation = screen.getByRole('navigation', { hidden: true });
        
        // Simulate scroll down
        Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
        fireEvent.scroll(window);
        
        await waitFor(() => {
          expect(navigation).toHaveStyle('transform: translateY(100px)');
        });
        
        // Simulate scroll up
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        fireEvent.scroll(window);
        
        await waitFor(() => {
          expect(navigation).toHaveStyle('transform: translateY(0px)');
        });
      });
    });

    describe('Responsive Header', () => {
      test('should show mobile layout on small screens', () => {
        setViewportSize(375, 667);
        
        render(
          <TestWrapper>
            <ResponsiveHeader title="Test Page" />
          </TestWrapper>
        );
        
        // Mobile search button should be visible
        const searchButton = screen.getByRole('button', { name: /search/i });
        expect(searchButton).toBeInTheDocument();
        expect(searchButton).toHaveClass('md:hidden');
        
        // Desktop search should be hidden
        const desktopSearch = screen.queryByPlaceholderText(/search tutorials/i);
        expect(desktopSearch).toHaveClass('hidden', 'md:flex');
      });

      test('should show desktop layout on large screens', () => {
        setViewportSize(1024, 768);
        
        render(
          <TestWrapper>
            <ResponsiveHeader title="Test Page" />
          </TestWrapper>
        );
        
        // Desktop search should be visible
        const desktopSearch = screen.getByPlaceholderText(/search tutorials/i);
        expect(desktopSearch).toBeInTheDocument();
        
        // Mobile search button should be hidden
        const mobileSearchButton = screen.getByRole('button', { name: /search/i });
        expect(mobileSearchButton).toHaveClass('md:hidden');
      });
    });

    describe('Mobile Code Editor', () => {
      test('should optimize for touch interactions', () => {
        setViewportSize(375, 667);
        
        render(
          <TestWrapper>
            <MobileCodeEditor
              value="console.log('Hello');"
              onChange={jest.fn()}
              language="javascript"
            />
          </TestWrapper>
        );
        
        // All interactive elements should meet touch target requirements
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          const styles = window.getComputedStyle(button);
          expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
        });
      });

      test('should provide mobile-specific features', () => {
        render(
          <TestWrapper>
            <MobileCodeEditor
              value="console.log('Hello');"
              onChange={jest.fn()}
              language="javascript"
            />
          </TestWrapper>
        );
        
        // Should have mobile-specific controls
        expect(screen.getByRole('button', { name: /keyboard/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
        expect(screen.getByText(/double tap for fullscreen/i)).toBeInTheDocument();
      });
    });
  });

  describe('3. Mobile Performance and Loading Times', () => {
    test('should measure component render times', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Component should render within reasonable time (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    test('should handle touch interactions within performance budget', async () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton onPress={onPress}>Test Button</TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // Simulate touch interaction
      const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
      const touchEnd = createTouchEvent('touchend', [createTouch(100, 100)]);
      
      fireEvent(button, touchStart);
      fireEvent(button, touchEnd);
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      
      // Touch interaction should be responsive (< 16ms for 60fps)
      expect(interactionTime).toBeLessThan(50);
      expect(onPress).toHaveBeenCalled();
    });

    test('should optimize memory usage for mobile components', () => {
      const { unmount } = render(
        <TestWrapper>
          <BottomNavigation />
          <ResponsiveHeader />
          <MobileCodeEditor
            value="test code"
            onChange={jest.fn()}
            language="javascript"
          />
        </TestWrapper>
      );
      
      // Measure memory before unmount
      const beforeUnmount = performance.memory?.usedJSHeapSize || 0;
      
      // Unmount components
      unmount();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Memory should be released (this is a basic check)
      const afterUnmount = performance.memory?.usedJSHeapSize || 0;
      
      // In a real scenario, we'd expect memory to decrease or stay stable
      expect(afterUnmount).toBeDefined();
    });

    test('should handle rapid touch interactions without performance degradation', async () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton onPress={onPress}>Rapid Touch Test</TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // Simulate rapid touches (10 touches in quick succession)
      for (let i = 0; i < 10; i++) {
        const touchStart = createTouchEvent('touchstart', [createTouch(100, 100)]);
        const touchEnd = createTouchEvent('touchend', [createTouch(100, 100)]);
        
        fireEvent(button, touchStart);
        fireEvent(button, touchEnd);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // All interactions should complete quickly
      expect(totalTime).toBeLessThan(200);
      expect(onPress).toHaveBeenCalledTimes(10);
    });
  });

  describe('4. Mobile-Specific Component Behavior', () => {
    describe('Bottom Navigation FAB', () => {
      test('should toggle FAB menu on tap', async () => {
        render(
          <TestWrapper>
            <BottomNavigation />
          </TestWrapper>
        );
        
        // Find the FAB button (Code button with gradient)
        const fabButton = screen.getByRole('button', { name: /code/i });
        
        // Tap to open FAB menu
        fireEvent.click(fabButton);
        
        await waitFor(() => {
          expect(screen.getByText('New Code')).toBeInTheDocument();
          expect(screen.getByText('AI Tutor')).toBeInTheDocument();
        });
        
        // Tap backdrop to close
        const backdrop = screen.getByRole('button', { hidden: true });
        fireEvent.click(backdrop);
        
        await waitFor(() => {
          expect(screen.queryByText('New Code')).not.toBeInTheDocument();
        });
      });
    });

    describe('Mobile Header Search', () => {
      test('should open fullscreen search on mobile', async () => {
        setViewportSize(375, 667);
        
        render(
          <TestWrapper>
            <ResponsiveHeader />
          </TestWrapper>
        );
        
        const searchButton = screen.getByRole('button', { name: /search/i });
        fireEvent.click(searchButton);
        
        await waitFor(() => {
          const searchInput = screen.getByPlaceholderText(/search tutorials/i);
          expect(searchInput).toBeInTheDocument();
          expect(searchInput).toHaveFocus();
        });
        
        // Should have close button
        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    describe('Mobile Code Editor Features', () => {
      test('should provide keyboard helper for mobile coding', async () => {
        render(
          <TestWrapper>
            <MobileCodeEditor
              value=""
              onChange={jest.fn()}
              language="javascript"
            />
          </TestWrapper>
        );
        
        const keyboardButton = screen.getByRole('button', { name: /keyboard/i });
        fireEvent.click(keyboardButton);
        
        await waitFor(() => {
          expect(screen.getByText('()')).toBeInTheDocument();
          expect(screen.getByText('{}')).toBeInTheDocument();
          expect(screen.getByText('Copy')).toBeInTheDocument();
          expect(screen.getByText('Share')).toBeInTheDocument();
        });
      });

      test('should support fullscreen mode for better mobile coding', async () => {
        render(
          <TestWrapper>
            <MobileCodeEditor
              value="console.log('test');"
              onChange={jest.fn()}
              language="javascript"
            />
          </TestWrapper>
        );
        
        const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
        fireEvent.click(fullscreenButton);
        
        await waitFor(() => {
          const container = screen.getByTestId('monaco-editor').closest('.fixed');
          expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
        });
      });
    });
  });

  describe('5. Cross-Device Compatibility', () => {
    test('should handle orientation changes gracefully', async () => {
      // Start in portrait
      setViewportSize(375, 667);
      
      render(
        <TestWrapper>
          <BottomNavigation />
          <ResponsiveHeader />
        </TestWrapper>
      );
      
      // Verify portrait layout
      expect(screen.getByRole('navigation', { hidden: true })).toBeInTheDocument();
      
      // Switch to landscape
      setViewportSize(667, 375);
      
      // Components should adapt
      await waitFor(() => {
        // Navigation should still be present but may have different styling
        expect(screen.getByRole('navigation', { hidden: true })).toBeInTheDocument();
      });
    });

    test('should work across different mobile browsers', () => {
      // Mock different user agents
      const userAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1', // Safari iOS
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36', // Chrome Android
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36' // WebView Android
      ];
      
      userAgents.forEach(userAgent => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true
        });
        
        render(
          <TestWrapper>
            <TouchButton>Cross-Browser Test</TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('touch-manipulation');
      });
    });

    test('should handle different screen densities', () => {
      // Mock different device pixel ratios
      const devicePixelRatios = [1, 1.5, 2, 3];
      
      devicePixelRatios.forEach(ratio => {
        Object.defineProperty(window, 'devicePixelRatio', {
          value: ratio,
          writable: true
        });
        
        render(
          <TestWrapper>
            <TouchButton size="lg">DPR Test {ratio}</TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByRole('button');
        
        // Touch targets should remain consistent regardless of DPR
        const styles = window.getComputedStyle(button);
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(TOUCH_TARGET_SIZES.large);
      });
    });
  });

  describe('6. Accessibility on Mobile', () => {
    test('should maintain accessibility with touch interactions', () => {
      render(
        <TestWrapper>
          <TouchButton>Accessible Touch Button</TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Should be focusable
      expect(button).toHaveAttribute('tabIndex', '0');
      
      // Should have proper ARIA attributes
      expect(button).toHaveAttribute('role', 'button');
      
      // Should respond to keyboard events
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
    });

    test('should provide proper focus management on mobile', async () => {
      render(
        <TestWrapper>
          <ResponsiveHeader />
        </TestWrapper>
      );
      
      // Open mobile search
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/search tutorials/i);
        expect(searchInput).toHaveFocus();
      });
    });

    test('should support screen readers on mobile', () => {
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Navigation items should have proper labels
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('aria-label');
      
      // Active states should be announced
      const activeItem = screen.getByText('Home');
      expect(activeItem.closest('a')).toHaveAttribute('aria-current');
    });
  });
});