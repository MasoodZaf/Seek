/**
 * Performance Audit Tests
 * Comprehensive performance testing and validation
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import performanceOptimizer, { 
  CoreWebVitalsMonitor,
  PerformanceBudgetMonitor,
  ResourceLoadingOptimizer,
  MemoryUsageMonitor
} from '../../utils/performanceOptimization';

// Mock performance APIs
const mockPerformanceObserver = jest.fn();
const mockPerformanceMemory = {
  usedJSHeapSize: 10 * 1024 * 1024, // 10MB
  totalJSHeapSize: 20 * 1024 * 1024, // 20MB
  jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB
};

global.PerformanceObserver = mockPerformanceObserver;
global.performance.memory = mockPerformanceMemory;

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Performance Audit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset performance optimizer
    performanceOptimizer.cleanup();
  });

  describe('Core Web Vitals Monitoring', () => {
    test('should initialize Core Web Vitals monitoring', () => {
      const monitor = new CoreWebVitalsMonitor();
      expect(monitor).toBeInstanceOf(CoreWebVitalsMonitor);
      expect(monitor.metrics).toEqual({
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null
      });
    });

    test('should track metrics when reported', () => {
      const monitor = new CoreWebVitalsMonitor();
      const mockCallback = jest.fn();
      
      monitor.onMetric(mockCallback);
      monitor.reportMetric('LCP', 2000);
      
      expect(mockCallback).toHaveBeenCalledWith({
        name: 'LCP',
        value: 2000,
        timestamp: expect.any(Number)
      });
    });

    test('should provide current metrics', () => {
      const monitor = new CoreWebVitalsMonitor();
      monitor.metrics.LCP = 2000;
      monitor.metrics.FID = 50;
      
      const metrics = monitor.getMetrics();
      expect(metrics.LCP).toBe(2000);
      expect(metrics.FID).toBe(50);
    });
  });

  describe('Performance Budget Monitoring', () => {
    test('should detect budget violations', () => {
      const budgetMonitor = new PerformanceBudgetMonitor();
      
      // Test within budget
      expect(budgetMonitor.checkBudget('LCP', 2000)).toBe(true);
      
      // Test budget violation
      expect(budgetMonitor.checkBudget('LCP', 3000)).toBe(false);
      
      const violations = budgetMonitor.getViolations();
      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        metric: 'LCP',
        value: 3000,
        budget: 2500,
        excess: 500
      });
    });

    test('should allow custom budget configuration', () => {
      const budgetMonitor = new PerformanceBudgetMonitor();
      
      budgetMonitor.setBudget('LCP', 3000);
      expect(budgetMonitor.checkBudget('LCP', 2800)).toBe(true);
      expect(budgetMonitor.checkBudget('LCP', 3200)).toBe(false);
    });
  });

  describe('Resource Loading Optimization', () => {
    test('should preload critical resources', () => {
      const optimizer = new ResourceLoadingOptimizer();
      
      // Mock document.head.appendChild
      const mockAppendChild = jest.fn();
      document.head.appendChild = mockAppendChild;
      
      optimizer.preloadResource({
        href: '/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous'
      });
      
      expect(mockAppendChild).toHaveBeenCalled();
      const linkElement = mockAppendChild.mock.calls[0][0];
      expect(linkElement.rel).toBe('preload');
      expect(linkElement.href).toBe('/fonts/inter-var.woff2');
      expect(linkElement.as).toBe('font');
    });

    test('should optimize images for lazy loading', () => {
      const optimizer = new ResourceLoadingOptimizer();
      
      // Create test images
      document.body.innerHTML = `
        <img data-src="/image1.jpg" alt="Test 1" />
        <img data-src="/image2.jpg" alt="Test 2" />
        <img src="/critical.jpg" alt="Critical" />
      `;
      
      // Mock IntersectionObserver
      const mockObserve = jest.fn();
      global.IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }));
      
      optimizer.lazyLoadImages();
      
      expect(mockObserve).toHaveBeenCalledTimes(2); // Only images with data-src
    });

    test('should prefetch next page resources', () => {
      const optimizer = new ResourceLoadingOptimizer();
      const mockAppendChild = jest.fn();
      document.head.appendChild = mockAppendChild;
      
      optimizer.prefetchNextPageResources(['/page1', '/page2']);
      
      expect(mockAppendChild).toHaveBeenCalledTimes(2);
      const links = mockAppendChild.mock.calls.map(call => call[0]);
      expect(links[0].rel).toBe('prefetch');
      expect(links[0].href).toBe('/page1');
      expect(links[1].href).toBe('/page2');
    });
  });

  describe('Memory Usage Monitoring', () => {
    test('should measure memory usage when available', () => {
      const memoryMonitor = new MemoryUsageMonitor();
      
      const measurement = memoryMonitor.measureMemoryUsage();
      
      expect(measurement).toMatchObject({
        usedJSHeapSize: 10 * 1024 * 1024,
        totalJSHeapSize: 20 * 1024 * 1024,
        jsHeapSizeLimit: 100 * 1024 * 1024,
        timestamp: expect.any(Number)
      });
    });

    test('should detect memory threshold violations', () => {
      const memoryMonitor = new MemoryUsageMonitor();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Simulate high memory usage
      global.performance.memory.usedJSHeapSize = 60 * 1024 * 1024; // 60MB
      
      memoryMonitor.measureMemoryUsage();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'High memory usage detected:',
        60 * 1024 * 1024
      );
      
      consoleSpy.mockRestore();
    });

    test('should calculate memory usage trend', () => {
      const memoryMonitor = new MemoryUsageMonitor();
      
      // Add some measurements
      memoryMonitor.measurements = [
        { usedJSHeapSize: 10 * 1024 * 1024, timestamp: Date.now() - 2000 },
        { usedJSHeapSize: 12 * 1024 * 1024, timestamp: Date.now() - 1000 },
        { usedJSHeapSize: 15 * 1024 * 1024, timestamp: Date.now() }
      ];
      
      const trend = memoryMonitor.getMemoryTrend();
      expect(trend).toBeGreaterThan(0); // Memory is increasing
    });
  });

  describe('Performance Optimization Manager', () => {
    test('should initialize all monitoring systems', () => {
      const initSpy = jest.spyOn(performanceOptimizer.coreWebVitals, 'init');
      const preloadSpy = jest.spyOn(performanceOptimizer.resourceOptimizer, 'preloadCriticalResources');
      
      performanceOptimizer.init();
      
      expect(initSpy).toHaveBeenCalled();
      expect(preloadSpy).toHaveBeenCalled();
      expect(performanceOptimizer.isInitialized).toBe(true);
    });

    test('should generate comprehensive performance report', () => {
      performanceOptimizer.init();
      
      const report = performanceOptimizer.getPerformanceReport();
      
      expect(report).toHaveProperty('coreWebVitals');
      expect(report).toHaveProperty('budgetViolations');
      expect(report).toHaveProperty('memoryUsage');
      expect(report).toHaveProperty('memoryTrend');
      expect(report).toHaveProperty('timestamp');
    });

    test('should optimize for mobile scenario', () => {
      // Mock mobile media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('max-width: 768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      });
      
      // Create test elements
      document.body.innerHTML = `
        <img srcset="/image-small.jpg 480w, /image-large.jpg 1200w" alt="Test" />
        <video autoplay>Test video</video>
      `;
      
      performanceOptimizer.optimizeForScenario('mobile');
      
      // Check that optimizations were applied
      const video = document.querySelector('video');
      expect(video.hasAttribute('autoplay')).toBe(false);
    });

    test('should optimize for slow connection', () => {
      document.body.innerHTML = `
        <video autoplay>Test video</video>
        <img src="/high-quality.jpg" data-low-quality-src="/low-quality.jpg" alt="Test" />
      `;
      
      performanceOptimizer.optimizeForScenario('slow-connection');
      
      const video = document.querySelector('video');
      const img = document.querySelector('img');
      
      expect(video.hasAttribute('autoplay')).toBe(false);
      expect(img.src).toBe('/low-quality.jpg');
    });

    test('should handle error reporting', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const testError = {
        type: 'javascript',
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5
      };
      
      performanceOptimizer.reportError(testError);
      
      expect(consoleSpy).toHaveBeenCalledWith('Application error:', testError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance Budget Validation', () => {
    test('should validate Core Web Vitals against industry standards', () => {
      const budgetMonitor = new PerformanceBudgetMonitor();
      
      // Good scores
      expect(budgetMonitor.checkBudget('LCP', 2000)).toBe(true); // < 2.5s
      expect(budgetMonitor.checkBudget('FID', 80)).toBe(true);   // < 100ms
      expect(budgetMonitor.checkBudget('CLS', 0.05)).toBe(true); // < 0.1
      
      // Poor scores
      expect(budgetMonitor.checkBudget('LCP', 4000)).toBe(false); // > 2.5s
      expect(budgetMonitor.checkBudget('FID', 200)).toBe(false);  // > 100ms
      expect(budgetMonitor.checkBudget('CLS', 0.3)).toBe(false);  // > 0.1
    });

    test('should track performance over time', () => {
      const budgetMonitor = new PerformanceBudgetMonitor();
      
      // Simulate multiple measurements
      budgetMonitor.checkBudget('LCP', 3000); // Violation
      budgetMonitor.checkBudget('LCP', 2000); // Good
      budgetMonitor.checkBudget('FID', 150);  // Violation
      
      const violations = budgetMonitor.getViolations();
      expect(violations).toHaveLength(2);
      expect(violations[0].metric).toBe('LCP');
      expect(violations[1].metric).toBe('FID');
    });
  });

  describe('Real-world Performance Scenarios', () => {
    test('should handle component rendering performance', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <div className="performance-test">
            {/* Simulate heavy component */}
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="test-item">
                <h3>Item {i}</h3>
                <p>Description for item {i}</p>
              </div>
            ))}
          </div>
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within reasonable time
      expect(renderTime).toBeLessThan(100); // 100ms threshold
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 99')).toBeInTheDocument();
    });

    test('should handle async operations efficiently', async () => {
      const mockAsyncOperation = jest.fn().mockResolvedValue('success');
      
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <AsyncTestComponent asyncOperation={mockAsyncOperation} />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Loading complete')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
      expect(mockAsyncOperation).toHaveBeenCalled();
    });
  });
});

// Test component for async operations
const AsyncTestComponent = ({ asyncOperation }) => {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    asyncOperation().then((data) => {
      setResult(data);
      setLoading(false);
    });
  }, [asyncOperation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Loading complete</div>;
};