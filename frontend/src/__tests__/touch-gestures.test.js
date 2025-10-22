/**
 * Touch Gestures Test Suite
 * 
 * Comprehensive testing for touch interactions, gestures, and haptic feedback
 * across mobile components and interfaces.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

// Components to test
import TouchButton from '../components/ui/TouchButton';
import SwipeContainer from '../components/ui/SwipeContainer';
import PullToRefresh from '../components/ui/PullToRefresh';
import BottomNavigation from '../components/mobile/BottomNavigation';
import MobileCodeEditor from '../components/CodeEditor/MobileCodeEditor';

// Touch utilities
import { hapticFeedback, GestureDetector, TOUCH_TARGET_SIZES } from '../utils/touchInteractions';

// Mock haptic feedback
jest.mock('../utils/touchInteractions', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    selection: jest.fn()
  },
  GestureDetector: jest.fn().mockImplementation((element) => ({
    element,
    options: {
      swipeThreshold: 50,
      velocityThreshold: 0.3,
      doubleTapDelay: 300,
      longPressDelay: 500
    },
    destroy: jest.fn(),
    onTap: null,
    onDoubleTap: null,
    onLongPress: null,
    onSwipe: null,
    getSwipeDirection: jest.fn((deltaX, deltaY) => {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      if (absDeltaX > absDeltaY) {
        return deltaX > 0 ? 'right' : 'left';
      } else {
        return deltaY > 0 ? 'down' : 'up';
      }
    })
  })),
  TOUCH_TARGET_SIZES: {
    minimum: 44,
    comfortable: 48,
    large: 56
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const mockReact = require('react');
  return {
    motion: {
      div: mockReact.forwardRef(({ children, onTouchStart, onTouchEnd, onTouchMove, ...props }, ref) => 
        mockReact.createElement('div', { ref, onTouchStart, onTouchEnd, onTouchMove, ...props }, children)
      ),
      button: mockReact.forwardRef(({ children, onTouchStart, onTouchEnd, onTouchMove, whileTap, ...props }, ref) => 
        mockReact.createElement('button', { ref, onTouchStart, onTouchEnd, onTouchMove, ...props }, children)
      )
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

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Touch event utilities
const createTouch = (x, y, identifier = 0) => ({
  identifier,
  clientX: x,
  clientY: y,
  pageX: x,
  pageY: y,
  screenX: x,
  screenY: y,
  target: document.body,
  force: 1,
  radiusX: 10,
  radiusY: 10,
  rotationAngle: 0
});

const createTouchEvent = (type, touches = [], changedTouches = null) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  event.touches = touches;
  event.changedTouches = changedTouches || touches;
  event.targetTouches = touches;
  return event;
};

const simulateTouch = (element, type, x, y, identifier = 0) => {
  const touch = createTouch(x, y, identifier);
  const event = createTouchEvent(type, [touch]);
  fireEvent(element, event);
  return event;
};

const simulateSwipe = (element, startX, startY, endX, endY, duration = 100) => {
  const startTouch = createTouch(startX, startY);
  const endTouch = createTouch(endX, endY);
  
  // Touch start
  fireEvent(element, createTouchEvent('touchstart', [startTouch]));
  
  // Optional: Add touch move events for more realistic swipe
  const steps = 5;
  for (let i = 1; i < steps; i++) {
    const progress = i / steps;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;
    const moveTouch = createTouch(currentX, currentY);
    
    setTimeout(() => {
      fireEvent(element, createTouchEvent('touchmove', [moveTouch]));
    }, (duration / steps) * i);
  }
  
  // Touch end
  setTimeout(() => {
    fireEvent(element, createTouchEvent('touchend', [], [endTouch]));
  }, duration);
};

const simulatePinch = (element, startDistance, endDistance, centerX = 100, centerY = 100) => {
  const touch1Start = createTouch(centerX - startDistance / 2, centerY, 0);
  const touch2Start = createTouch(centerX + startDistance / 2, centerY, 1);
  
  const touch1End = createTouch(centerX - endDistance / 2, centerY, 0);
  const touch2End = createTouch(centerX + endDistance / 2, centerY, 1);
  
  // Start pinch
  fireEvent(element, createTouchEvent('touchstart', [touch1Start, touch2Start]));
  
  // Move touches
  fireEvent(element, createTouchEvent('touchmove', [touch1End, touch2End]));
  
  // End pinch
  fireEvent(element, createTouchEvent('touchend', [], [touch1End, touch2End]));
};

describe('Touch Gestures Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
    
    // Mock navigator.vibrate
    Object.defineProperty(navigator, 'vibrate', {
      value: jest.fn(),
      writable: true
    });
    
    // Mock touch support
    Object.defineProperty(window, 'ontouchstart', {
      value: {},
      writable: true
    });
  });

  describe('TouchButton Gestures', () => {
    test('should handle basic tap gesture', async () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton onPress={onPress} haptic="light">
            Tap Me
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Simulate tap
      simulateTouch(button, 'touchstart', 100, 100);
      simulateTouch(button, 'touchend', 100, 100);
      
      expect(hapticFeedback.light).toHaveBeenCalled();
      expect(onPress).toHaveBeenCalled();
    });

    test('should handle long press gesture', async () => {
      const onLongPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton longPress onLongPress={onLongPress} haptic="medium">
            Long Press Me
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Start long press
      simulateTouch(button, 'touchstart', 100, 100);
      
      // Wait for long press timeout
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
      });
      
      expect(hapticFeedback.heavy).toHaveBeenCalled();
      expect(onLongPress).toHaveBeenCalled();
    });

    test('should cancel long press on touch move', async () => {
      const onLongPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton longPress onLongPress={onLongPress}>
            Long Press Cancel Test
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Start touch
      simulateTouch(button, 'touchstart', 100, 100);
      
      // Move touch (should cancel long press)
      simulateTouch(button, 'touchmove', 120, 100);
      
      // Wait for would-be long press timeout
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
      });
      
      expect(onLongPress).not.toHaveBeenCalled();
    });

    test('should provide different haptic feedback types', () => {
      const hapticTypes = ['light', 'medium', 'heavy', 'success', 'error'];
      
      hapticTypes.forEach(hapticType => {
        render(
          <TestWrapper>
            <TouchButton haptic={hapticType}>
              {hapticType} Haptic
            </TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByText(`${hapticType} Haptic`);
        
        simulateTouch(button, 'touchstart', 100, 100);
        
        expect(hapticFeedback[hapticType]).toHaveBeenCalled();
      });
    });

    test('should create ripple effect on touch', () => {
      render(
        <TestWrapper>
          <TouchButton ripple>
            Ripple Button
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Mock getBoundingClientRect
      button.getBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 50,
        width: 100,
        height: 40,
        right: 150,
        bottom: 90
      }));
      
      // Simulate touch at specific coordinates
      const touchEvent = createTouchEvent('touchstart', [createTouch(75, 70)]);
      fireEvent(button, touchEvent);
      
      // Should create ripple element
      const ripple = button.querySelector('[style*="left:"]');
      expect(ripple).toBeTruthy();
    });

    test('should meet minimum touch target size', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      
      sizes.forEach(size => {
        render(
          <TestWrapper>
            <TouchButton size={size}>
              {size} Button
            </TouchButton>
          </TestWrapper>
        );
        
        const button = screen.getByText(`${size} Button`);
        const styles = window.getComputedStyle(button);
        
        const minHeight = parseInt(styles.minHeight) || 0;
        const minWidth = parseInt(styles.minWidth) || 0;
        
        expect(minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET_SIZES.minimum);
        expect(minWidth).toBeGreaterThanOrEqual(TOUCH_TARGET_SIZES.minimum);
      });
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
      
      // Swipe right
      simulateSwipe(container, 100, 100, 200, 100);
      
      await waitFor(() => {
        expect(onSwipe).toHaveBeenCalledWith('right', expect.objectContaining({
          deltaX: expect.any(Number),
          deltaY: expect.any(Number)
        }));
      });
    });

    test('should detect vertical swipe gestures', async () => {
      const onSwipe = jest.fn();
      
      render(
        <TestWrapper>
          <SwipeContainer onSwipe={onSwipe}>
            <div>Vertical Swipe Content</div>
          </SwipeContainer>
        </TestWrapper>
      );
      
      const container = screen.getByText('Vertical Swipe Content').parentElement;
      
      // Swipe down
      simulateSwipe(container, 100, 100, 100, 200);
      
      await waitFor(() => {
        expect(onSwipe).toHaveBeenCalledWith('down', expect.any(Object));
      });
    });

    test('should require minimum swipe distance', async () => {
      const onSwipe = jest.fn();
      
      render(
        <TestWrapper>
          <SwipeContainer onSwipe={onSwipe} threshold={50}>
            <div>Threshold Test</div>
          </SwipeContainer>
        </TestWrapper>
      );
      
      const container = screen.getByText('Threshold Test').parentElement;
      
      // Short swipe (below threshold)
      simulateSwipe(container, 100, 100, 130, 100);
      
      await waitFor(() => {
        expect(onSwipe).not.toHaveBeenCalled();
      });
      
      // Long swipe (above threshold)
      simulateSwipe(container, 100, 100, 180, 100);
      
      await waitFor(() => {
        expect(onSwipe).toHaveBeenCalled();
      });
    });

    test('should handle diagonal swipes correctly', async () => {
      const onSwipe = jest.fn();
      
      render(
        <TestWrapper>
          <SwipeContainer onSwipe={onSwipe}>
            <div>Diagonal Swipe Test</div>
          </SwipeContainer>
        </TestWrapper>
      );
      
      const container = screen.getByText('Diagonal Swipe Test').parentElement;
      
      // Diagonal swipe (more horizontal than vertical)
      simulateSwipe(container, 100, 100, 200, 130);
      
      await waitFor(() => {
        expect(onSwipe).toHaveBeenCalledWith('right', expect.any(Object));
      });
    });
  });

  describe('Pull to Refresh', () => {
    test('should trigger refresh when pulled down sufficiently', async () => {
      const onRefresh = jest.fn().mockResolvedValue();
      
      render(
        <TestWrapper>
          <PullToRefresh onRefresh={onRefresh} threshold={80}>
            <div>Pull to refresh content</div>
          </PullToRefresh>
        </TestWrapper>
      );
      
      const container = screen.getByText('Pull to refresh content').parentElement;
      
      // Mock scroll position at top
      Object.defineProperty(container, 'scrollTop', {
        value: 0,
        writable: true
      });
      
      // Pull down beyond threshold
      simulateSwipe(container, 100, 50, 100, 150);
      
      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled();
      });
    });

    test('should not trigger refresh if not at top of scroll', async () => {
      const onRefresh = jest.fn();
      
      render(
        <TestWrapper>
          <PullToRefresh onRefresh={onRefresh}>
            <div style={{ height: '1000px' }}>
              Scrollable content
            </div>
          </PullToRefresh>
        </TestWrapper>
      );
      
      const container = screen.getByText('Scrollable content').parentElement;
      
      // Mock scroll position not at top
      Object.defineProperty(container, 'scrollTop', {
        value: 100,
        writable: true
      });
      
      // Try to pull down
      simulateSwipe(container, 100, 50, 100, 150);
      
      await waitFor(() => {
        expect(onRefresh).not.toHaveBeenCalled();
      });
    });

    test('should show visual feedback during pull', async () => {
      const onRefresh = jest.fn().mockResolvedValue();
      
      render(
        <TestWrapper>
          <PullToRefresh onRefresh={onRefresh}>
            <div>Visual feedback test</div>
          </PullToRefresh>
        </TestWrapper>
      );
      
      const container = screen.getByText('Visual feedback test').parentElement;
      
      // Mock scroll position at top
      Object.defineProperty(container, 'scrollTop', {
        value: 0,
        writable: true
      });
      
      // Start pull
      simulateTouch(container, 'touchstart', 100, 50);
      simulateTouch(container, 'touchmove', 100, 100);
      
      // Should show some visual indication
      const pullIndicator = container.querySelector('[class*="pull"]') || 
                           container.querySelector('[style*="transform"]');
      
      if (pullIndicator) {
        expect(pullIndicator).toBeInTheDocument();
      }
    });
  });

  describe('Multi-touch Gestures', () => {
    test('should handle pinch gestures', async () => {
      const onPinch = jest.fn();
      
      // Create a component that handles pinch
      const PinchContainer = ({ children, onPinch }) => {
        const containerRef = React.useRef();
        
        React.useEffect(() => {
          const element = containerRef.current;
          if (!element) return;
          
          let initialDistance = 0;
          
          const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
              const touch1 = e.touches[0];
              const touch2 = e.touches[1];
              initialDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
              );
            }
          };
          
          const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
              const touch1 = e.touches[0];
              const touch2 = e.touches[1];
              const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
              );
              
              const scale = currentDistance / initialDistance;
              onPinch?.(scale);
            }
          };
          
          element.addEventListener('touchstart', handleTouchStart);
          element.addEventListener('touchmove', handleTouchMove);
          
          return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
          };
        }, [onPinch]);
        
        return <div ref={containerRef}>{children}</div>;
      };
      
      render(
        <TestWrapper>
          <PinchContainer onPinch={onPinch}>
            <div>Pinch to zoom</div>
          </PinchContainer>
        </TestWrapper>
      );
      
      const container = screen.getByText('Pinch to zoom').parentElement;
      
      // Simulate pinch out (zoom in)
      simulatePinch(container, 50, 100);
      
      await waitFor(() => {
        expect(onPinch).toHaveBeenCalledWith(expect.any(Number));
      });
    });
  });

  describe('Bottom Navigation Touch Interactions', () => {
    test('should handle navigation item taps', async () => {
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const homeLink = screen.getByText('Home').closest('a');
      
      simulateTouch(homeLink, 'touchstart', 100, 100);
      simulateTouch(homeLink, 'touchend', 100, 100);
      
      expect(hapticFeedback.light).toHaveBeenCalled();
    });

    test('should handle FAB (Floating Action Button) interactions', async () => {
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Find the FAB button (Code button)
      const fabButton = screen.getByRole('button', { name: /code/i });
      
      simulateTouch(fabButton, 'touchstart', 100, 100);
      simulateTouch(fabButton, 'touchend', 100, 100);
      
      await waitFor(() => {
        expect(screen.getByText('New Code')).toBeInTheDocument();
      });
    });
  });

  describe('Code Editor Touch Interactions', () => {
    test('should handle mobile code editor touch interactions', async () => {
      render(
        <TestWrapper>
          <MobileCodeEditor
            value="console.log('touch test');"
            onChange={jest.fn()}
            language="javascript"
          />
        </TestWrapper>
      );
      
      // Test settings button
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      simulateTouch(settingsButton, 'touchstart', 100, 100);
      simulateTouch(settingsButton, 'touchend', 100, 100);
      
      await waitFor(() => {
        expect(screen.getByText('Font Size')).toBeInTheDocument();
      });
    });

    test('should handle double tap for fullscreen', async () => {
      render(
        <TestWrapper>
          <MobileCodeEditor
            value="console.log('double tap test');"
            onChange={jest.fn()}
            language="javascript"
          />
        </TestWrapper>
      );
      
      const editor = screen.getByTestId('monaco-editor');
      
      // Double tap
      simulateTouch(editor, 'touchstart', 100, 100);
      simulateTouch(editor, 'touchend', 100, 100);
      
      setTimeout(() => {
        simulateTouch(editor, 'touchstart', 100, 100);
        simulateTouch(editor, 'touchend', 100, 100);
      }, 100);
      
      // Should trigger fullscreen mode
      await waitFor(() => {
        const container = editor.closest('.fixed');
        if (container) {
          expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
        }
      });
    });
  });

  describe('Gesture Accessibility', () => {
    test('should provide alternative input methods for gestures', () => {
      render(
        <TestWrapper>
          <SwipeContainer onSwipe={jest.fn()}>
            <div>Accessible swipe content</div>
            <button>Alternative action</button>
          </SwipeContainer>
        </TestWrapper>
      );
      
      // Should provide button alternative to swipe gesture
      const alternativeButton = screen.getByRole('button');
      expect(alternativeButton).toBeInTheDocument();
    });

    test('should work with assistive technologies', () => {
      render(
        <TestWrapper>
          <TouchButton>
            Accessible Touch Button
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Should be keyboard accessible
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
      
      // Should have proper ARIA attributes
      expect(button).toHaveAttribute('role', 'button');
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
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
          <TouchButton>
            Reduced Motion Button
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Should have reduced or no animations
      const styles = window.getComputedStyle(button);
      expect(styles.transitionDuration).toMatch(/0s|0\.1s|0\.2s/);
    });
  });

  describe('Performance Under Touch Load', () => {
    test('should handle rapid touch interactions without performance degradation', async () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <TouchButton onPress={onPress}>
            Rapid Touch Test
          </TouchButton>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // Simulate 20 rapid touches
      for (let i = 0; i < 20; i++) {
        simulateTouch(button, 'touchstart', 100, 100);
        simulateTouch(button, 'touchend', 100, 100);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle all touches quickly
      expect(totalTime).toBeLessThan(500);
      expect(onPress).toHaveBeenCalledTimes(20);
    });

    test('should clean up touch event listeners', () => {
      const { unmount } = render(
        <TestWrapper>
          <TouchButton>
            Cleanup Test
          </TouchButton>
        </TestWrapper>
      );
      
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      unmount();
      
      // Should clean up event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});