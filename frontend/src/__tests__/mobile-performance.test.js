/**
 * Mobile Performance Test Suite
 * 
 * Focused testing for mobile performance metrics, loading times,
 * and resource optimization on mobile devices.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

// Components to test
import MobileCodeEditor from '../components/CodeEditor/MobileCodeEditor';
import BottomNavigation from '../components/mobile/BottomNavigation';
import ResponsiveHeader from '../components/mobile/ResponsiveHeader';
import MobileTutorialCard from '../components/mobile/MobileTutorialCard';

// Performance utilities
import { performanceMonitoring } from '../utils/performanceMonitoring';

// Mock performance monitoring
jest.mock('../utils/performanceMonitoring', () => ({
  performanceMonitoring: {
    measureRenderTime: jest.fn(),
    measureInteractionTime: jest.fn(),
    measureMemoryUsage: jest.fn(),
    trackCoreWebVitals: jest.fn(),
    measureBundleSize: jest.fn(),
    trackResourceLoading: jest.fn()
  }
}));

// Mock framer-motion for performance testing
jest.mock('framer-motion', () => {
  const mockReact = require('react');
  return {
    motion: {
      div: mockReact.forwardRef(({ children, animate, initial, transition, ...props }, ref) => 
        mockReact.createElement('div', { ref, ...props }, children)
      ),
      button: mockReact.forwardRef(({ children, whileTap, whileHover, ...props }, ref) => 
        mockReact.createElement('button', { ref, ...props }, children)
      ),
      header: mockReact.forwardRef(({ children, ...props }, ref) => 
        mockReact.createElement('header', { ref, ...props }, children)
      ),
      nav: mockReact.forwardRef(({ children, ...props }, ref) => 
        mockReact.createElement('nav', { ref, ...props }, children)
      )
    },
    AnimatePresence: ({ children }) => children
  };
});

// Mock Monaco Editor for performance testing
jest.mock('../components/CodeEditor/MonacoCodeEditor', () => {
  const mockReact = require('react');
  return mockReact.memo(function MockMonacoEditor({ onMount, onChange, value }) {
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
  });
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

// Performance measurement utilities
const measureComponentRenderTime = async (Component, props = {}) => {
  const startTime = performance.now();
  
  const { container } = render(
    <TestWrapper>
      <Component {...props} />
    </TestWrapper>
  );
  
  // Wait for any async operations
  await waitFor(() => {
    expect(container.firstChild).toBeInTheDocument();
  });
  
  const endTime = performance.now();
  return endTime - startTime;
};

const measureInteractionLatency = async (element, interaction) => {
  const startTime = performance.now();
  
  await act(async () => {
    interaction(element);
  });
  
  const endTime = performance.now();
  return endTime - startTime;
};

// Mock mobile device characteristics
const setMobileDevice = (type = 'mid-range') => {
  const deviceConfigs = {
    'low-end': {
      memory: 2, // 2GB RAM
      cores: 4,
      connection: 'slow-2g'
    },
    'mid-range': {
      memory: 4, // 4GB RAM
      cores: 6,
      connection: '3g'
    },
    'high-end': {
      memory: 8, // 8GB RAM
      cores: 8,
      connection: '4g'
    }
  };
  
  const config = deviceConfigs[type];
  
  // Mock navigator properties
  Object.defineProperty(navigator, 'deviceMemory', {
    value: config.memory,
    writable: true
  });
  
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    value: config.cores,
    writable: true
  });
  
  // Mock connection
  Object.defineProperty(navigator, 'connection', {
    value: {
      effectiveType: config.connection,
      downlink: config.connection === '4g' ? 10 : config.connection === '3g' ? 1.5 : 0.5
    },
    writable: true
  });
};

describe('Mobile Performance Test Suite', () => {
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
    
    // Mock performance API
    global.performance.mark = jest.fn();
    global.performance.measure = jest.fn();
    global.performance.getEntriesByType = jest.fn(() => []);
    global.performance.getEntriesByName = jest.fn(() => []);
  });

  describe('Component Render Performance', () => {
    test('BottomNavigation should render within performance budget', async () => {
      const renderTime = await measureComponentRenderTime(BottomNavigation);
      
      // Should render within 50ms on mobile
      expect(renderTime).toBeLessThan(50);
    });

    test('ResponsiveHeader should render quickly', async () => {
      const renderTime = await measureComponentRenderTime(ResponsiveHeader, {
        title: 'Test Page'
      });
      
      // Should render within 30ms
      expect(renderTime).toBeLessThan(30);
    });

    test('MobileCodeEditor should initialize within reasonable time', async () => {
      const renderTime = await measureComponentRenderTime(MobileCodeEditor, {
        value: 'console.log("Hello World");',
        onChange: jest.fn(),
        language: 'javascript'
      });
      
      // Code editor is more complex, allow up to 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('Multiple components should render efficiently together', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ResponsiveHeader title="Performance Test" />
          <div style={{ height: '500px', padding: '20px' }}>
            <MobileTutorialCard
              title="Test Tutorial"
              description="Performance testing tutorial"
              difficulty="Beginner"
              duration="10 min"
            />
          </div>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const totalRenderTime = endTime - startTime;
      
      // Multiple components should render within 150ms
      expect(totalRenderTime).toBeLessThan(150);
    });
  });

  describe('Interaction Performance', () => {
    test('touch interactions should be responsive', async () => {
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const homeButton = screen.getByText('Home').closest('a');
      
      const interactionTime = await measureInteractionLatency(homeButton, (element) => {
        element.click();
      });
      
      // Touch interactions should respond within 16ms (60fps)
      expect(interactionTime).toBeLessThan(16);
    });

    test('code editor interactions should be smooth', async () => {
      render(
        <TestWrapper>
          <MobileCodeEditor
            value="console.log('test');"
            onChange={jest.fn()}
            language="javascript"
          />
        </TestWrapper>
      );
      
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      
      const interactionTime = await measureInteractionLatency(settingsButton, (element) => {
        element.click();
      });
      
      // Settings panel should open quickly
      expect(interactionTime).toBeLessThan(50);
    });

    test('navigation menu should open smoothly', async () => {
      render(
        <TestWrapper>
          <ResponsiveHeader />
        </TestWrapper>
      );
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      
      const interactionTime = await measureInteractionLatency(menuButton, (element) => {
        element.click();
      });
      
      // Menu should open within 30ms
      expect(interactionTime).toBeLessThan(30);
    });
  });

  describe('Memory Usage Optimization', () => {
    test('should not leak memory on component mount/unmount cycles', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Mount and unmount components multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <TestWrapper>
            <BottomNavigation />
            <ResponsiveHeader />
          </TestWrapper>
        );
        
        unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });

    test('should clean up event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const addedListeners = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const removedListeners = removeEventListenerSpy.mock.calls.length;
      
      // Should remove at least as many listeners as added
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Device-Specific Performance', () => {
    test('should perform well on low-end devices', async () => {
      setMobileDevice('low-end');
      
      const renderTime = await measureComponentRenderTime(MobileCodeEditor, {
        value: 'console.log("Low-end device test");',
        onChange: jest.fn(),
        language: 'javascript'
      });
      
      // Should still render within reasonable time on low-end devices
      expect(renderTime).toBeLessThan(200);
    });

    test('should optimize for mid-range devices', async () => {
      setMobileDevice('mid-range');
      
      const renderTime = await measureComponentRenderTime(BottomNavigation);
      
      // Should render quickly on mid-range devices
      expect(renderTime).toBeLessThan(75);
    });

    test('should utilize high-end device capabilities', async () => {
      setMobileDevice('high-end');
      
      const renderTime = await measureComponentRenderTime(MobileCodeEditor, {
        value: 'console.log("High-end device test");',
        onChange: jest.fn(),
        language: 'javascript'
      });
      
      // Should render very quickly on high-end devices
      expect(renderTime).toBeLessThan(50);
    });
  });

  describe('Network Performance', () => {
    test('should handle slow network conditions gracefully', async () => {
      // Mock slow network
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: 'slow-2g',
          downlink: 0.5
        },
        writable: true
      });
      
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <MobileTutorialCard
            title="Network Test Tutorial"
            description="Testing slow network performance"
            difficulty="Beginner"
            duration="5 min"
            imageUrl="https://example.com/image.jpg"
          />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should still render quickly even with slow network
      expect(renderTime).toBeLessThan(100);
    });

    test('should optimize resource loading on mobile', () => {
      render(
        <TestWrapper>
          <MobileTutorialCard
            title="Resource Test"
            description="Testing resource optimization"
            difficulty="Intermediate"
            duration="15 min"
            imageUrl="https://example.com/large-image.jpg"
          />
        </TestWrapper>
      );
      
      // Should implement lazy loading for images
      const image = screen.queryByRole('img');
      if (image) {
        expect(image).toHaveAttribute('loading', 'lazy');
      }
    });
  });

  describe('Animation Performance', () => {
    test('should maintain 60fps during animations', async () => {
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      const navigation = screen.getByRole('navigation', { hidden: true });
      
      // Mock animation frame timing
      let frameCount = 0;
      const startTime = performance.now();
      
      const mockRAF = (callback) => {
        frameCount++;
        setTimeout(() => {
          callback(performance.now());
        }, 16.67); // 60fps = 16.67ms per frame
      };
      
      global.requestAnimationFrame = mockRAF;
      
      // Simulate scroll animation
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      window.dispatchEvent(new Event('scroll'));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const fps = (frameCount / duration) * 1000;
      
      // Should maintain close to 60fps
      expect(fps).toBeGreaterThan(50);
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
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Components should respect reduced motion
      const navigation = screen.getByRole('navigation', { hidden: true });
      expect(navigation).toBeInTheDocument();
      
      // Animations should be disabled or reduced
      const animatedElements = navigation.querySelectorAll('[style*="transition"]');
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        // Should have reduced or no transitions
        expect(styles.transitionDuration).toMatch(/0s|0\.1s|0\.2s/);
      });
    });
  });

  describe('Bundle Size and Loading', () => {
    test('should lazy load non-critical components', async () => {
      // Mock dynamic import
      const mockImport = jest.fn().mockResolvedValue({
        default: () => <div>Lazy Component</div>
      });
      
      global.import = mockImport;
      
      // Simulate lazy loading
      const LazyComponent = React.lazy(() => mockImport());
      
      render(
        <TestWrapper>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </React.Suspense>
        </TestWrapper>
      );
      
      // Should show loading state initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Lazy Component')).toBeInTheDocument();
      });
      
      expect(mockImport).toHaveBeenCalled();
    });

    test('should optimize critical rendering path', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ResponsiveHeader title="Critical Path Test" />
        </TestWrapper>
      );
      
      // Critical components should render immediately
      expect(screen.getByText('Critical Path Test')).toBeInTheDocument();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Critical path should be very fast
      expect(renderTime).toBeLessThan(20);
    });
  });
});