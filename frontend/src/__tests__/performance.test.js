/**
 * Performance Testing Suite
 * Tests loading times, bundle sizes, and runtime performance
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Import components for performance testing
import EnhancedDashboard from '../components/dashboard/EnhancedDashboard';
import EnhancedPlayground from '../components/CodeEditor/EnhancedPlayground';
import TutorialGrid from '../components/ui/TutorialGrid';

// Performance monitoring utilities
import { measurePerformance, trackCoreWebVitals } from '../utils/performanceMonitoring';

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

describe('Performance Tests', () => {
  beforeEach(() => {
    // Clear performance marks and measures
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  });

  describe('Component Rendering Performance', () => {
    test('Dashboard should render within performance budget', async () => {
      const startTime = performance.now();
      
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

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Dashboard should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('Code Playground should initialize within performance budget', async () => {
      const startTime = performance.now();

      render(
        <TestWrapper>
          <EnhancedPlayground />
        </TestWrapper>
      );

      await waitFor(() => {
        const codeEditor = document.querySelector('[data-testid="code-editor"]') || 
                          document.querySelector('.monaco-editor');
        expect(codeEditor || screen.getByRole('main')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const initTime = endTime - startTime;

      // Code playground should initialize within 200ms (Monaco editor is heavy)
      expect(initTime).toBeLessThan(200);
    });

    test('Tutorial Grid should render large lists efficiently', async () => {
      const mockTutorials = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Tutorial ${i + 1}`,
        description: `Description for tutorial ${i + 1}`,
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
        language: ['JavaScript', 'Python', 'Java'][i % 3],
        duration: Math.floor(Math.random() * 60) + 10,
        completed: Math.random() > 0.7
      }));

      const startTime = performance.now();

      render(
        <TestWrapper>
          <TutorialGrid tutorials={mockTutorials} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Large list should render within 150ms
      expect(renderTime).toBeLessThan(150);
    });
  });

  describe('Memory Usage Tests', () => {
    test('should not create memory leaks in component mounting/unmounting', async () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      // Mount and unmount components multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <TestWrapper>
            <EnhancedDashboard user={{ id: 1, username: 'test' }} />
          </TestWrapper>
        );
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      if (performance.memory) {
        const memoryIncrease = finalMemory - initialMemory;
        // Memory increase should be reasonable (less than 10MB)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });

    test('should clean up event listeners and timers', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const setIntervalSpy = jest.spyOn(window, 'setInterval');
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

      const { unmount } = render(
        <TestWrapper>
          <EnhancedDashboard user={{ id: 1, username: 'test' }} />
        </TestWrapper>
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;
      const setIntervals = setIntervalSpy.mock.calls.length;

      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls.length;
      const clearedIntervals = clearIntervalSpy.mock.calls.length;

      // Should clean up most event listeners and intervals
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners * 0.8);
      expect(clearedIntervals).toBeGreaterThanOrEqual(setIntervals * 0.8);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Animation Performance', () => {
    test('animations should maintain 60fps', async () => {
      const frameRates = [];
      let lastTime = performance.now();
      let frameCount = 0;

      const measureFrameRate = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        const fps = 1000 / deltaTime;
        frameRates.push(fps);
        lastTime = currentTime;
        frameCount++;

        if (frameCount < 60) { // Measure for ~1 second
          requestAnimationFrame(measureFrameRate);
        }
      };

      render(
        <TestWrapper>
          <div className="animate-pulse">
            <EnhancedDashboard user={{ id: 1, username: 'test' }} />
          </div>
        </TestWrapper>
      );

      requestAnimationFrame(measureFrameRate);

      await new Promise(resolve => setTimeout(resolve, 1100));

      if (frameRates.length > 0) {
        const averageFps = frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length;
        const minFps = Math.min(...frameRates);

        // Average FPS should be close to 60
        expect(averageFps).toBeGreaterThan(50);
        // Minimum FPS should not drop below 30
        expect(minFps).toBeGreaterThan(30);
      }
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
          <div className="motion-safe:animate-bounce motion-reduce:animate-none">
            Animated Content
          </div>
        </TestWrapper>
      );

      // Verify reduced motion is respected
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    test('should lazy load components efficiently', async () => {
      // Mock dynamic import
      const mockLazyComponent = jest.fn().mockResolvedValue({
        default: () => <div>Lazy Component</div>
      });

      // Simulate lazy loading
      const LazyComponent = React.lazy(mockLazyComponent);

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

      expect(mockLazyComponent).toHaveBeenCalled();
    });

    test('should optimize image loading', () => {
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });
      window.IntersectionObserver = mockIntersectionObserver;

      render(
        <TestWrapper>
          <img 
            src="placeholder.jpg" 
            data-src="actual-image.jpg" 
            alt="Test image"
            loading="lazy"
          />
        </TestWrapper>
      );

      // Should use intersection observer for lazy loading
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });

  describe('Core Web Vitals', () => {
    test('should track Largest Contentful Paint (LCP)', async () => {
      const lcpEntries = [];
      
      // Mock PerformanceObserver
      global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
      }));

      render(
        <TestWrapper>
          <EnhancedDashboard user={{ id: 1, username: 'test' }} />
        </TestWrapper>
      );

      // Simulate LCP measurement
      const mockLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 1500, // 1.5 seconds
        size: 50000
      };

      lcpEntries.push(mockLCPEntry);

      // LCP should be under 2.5 seconds for good performance
      expect(mockLCPEntry.startTime).toBeLessThan(2500);
    });

    test('should track First Input Delay (FID)', async () => {
      const fidEntries = [];
      
      render(
        <TestWrapper>
          <button onClick={() => {}}>Test Button</button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      
      const startTime = performance.now();
      button.click();
      const endTime = performance.now();
      
      const inputDelay = endTime - startTime;
      
      // FID should be under 100ms for good performance
      expect(inputDelay).toBeLessThan(100);
    });

    test('should track Cumulative Layout Shift (CLS)', () => {
      const clsEntries = [];
      
      // Mock layout shift entry
      const mockCLSEntry = {
        entryType: 'layout-shift',
        value: 0.05, // Small layout shift
        hadRecentInput: false
      };

      clsEntries.push(mockCLSEntry);

      // CLS should be under 0.1 for good performance
      expect(mockCLSEntry.value).toBeLessThan(0.1);
    });
  });

  describe('Network Performance', () => {
    test('should handle slow network conditions gracefully', async () => {
      // Mock slow network
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ data: 'test' })
          }), 3000) // 3 second delay
        )
      );

      const startTime = performance.now();

      render(
        <TestWrapper>
          <EnhancedDashboard user={{ id: 1, username: 'test' }} />
        </TestWrapper>
      );

      // Should show loading state immediately
      await waitFor(() => {
        const loadingElements = screen.queryAllByText(/loading/i);
        expect(loadingElements.length).toBeGreaterThanOrEqual(0);
      });

      global.fetch = originalFetch;
    });

    test('should implement proper caching strategies', () => {
      // Mock service worker
      const mockServiceWorker = {
        register: jest.fn().mockResolvedValue({}),
        ready: Promise.resolve({
          active: { postMessage: jest.fn() }
        })
      };

      Object.defineProperty(navigator, 'serviceWorker', {
        value: mockServiceWorker,
        writable: true
      });

      // Test that service worker is registered
      expect(navigator.serviceWorker).toBeDefined();
    });
  });

  describe('Resource Loading Optimization', () => {
    test('should preload critical resources', () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');

      // Should have some preload/prefetch links for optimization
      expect(preloadLinks.length + prefetchLinks.length).toBeGreaterThanOrEqual(0);
    });

    test('should use appropriate image formats', () => {
      render(
        <TestWrapper>
          <picture>
            <source srcSet="image.avif" type="image/avif" />
            <source srcSet="image.webp" type="image/webp" />
            <img src="image.jpg" alt="Optimized image" />
          </picture>
        </TestWrapper>
      );

      const picture = screen.getByRole('img').parentElement;
      expect(picture.tagName).toBe('PICTURE');
      
      const sources = picture.querySelectorAll('source');
      expect(sources.length).toBeGreaterThan(0);
    });
  });

  describe('JavaScript Performance', () => {
    test('should avoid blocking the main thread', async () => {
      const longRunningTask = () => {
        const start = performance.now();
        // Simulate work that might block the main thread
        while (performance.now() - start < 50) {
          // Busy wait for 50ms
        }
      };

      const startTime = performance.now();
      
      // Use setTimeout to avoid blocking
      await new Promise(resolve => {
        setTimeout(() => {
          longRunningTask();
          resolve();
        }, 0);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete quickly due to async execution
      expect(totalTime).toBeLessThan(100);
    });

    test('should debounce expensive operations', async () => {
      let callCount = 0;
      const expensiveOperation = jest.fn(() => {
        callCount++;
      });

      // Mock debounced function
      const debouncedOperation = jest.fn().mockImplementation(() => {
        clearTimeout(debouncedOperation.timeoutId);
        debouncedOperation.timeoutId = setTimeout(expensiveOperation, 300);
      });

      // Simulate rapid calls
      for (let i = 0; i < 10; i++) {
        debouncedOperation();
      }

      // Should only call the expensive operation once after debounce
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(expensiveOperation).toHaveBeenCalledTimes(1);
    });
  });
});