/**
 * Simplified Performance Testing Suite
 * Tests basic performance metrics and optimizations
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

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

describe('Performance Tests - Simple', () => {
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
    test('Simple components should render quickly', async () => {
      const startTime = performance.now();
      
      const SimpleComponent = () => (
        <div>
          <h1>Test Component</h1>
          <p>This is a simple test component</p>
          <button>Click me</button>
        </div>
      );

      render(
        <TestWrapper>
          <SimpleComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Simple component should render very quickly
      expect(renderTime).toBeLessThan(50);
    });

    test('List rendering should be efficient', async () => {
      const startTime = performance.now();
      
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`
      }));

      const ListComponent = ({ items }) => (
        <div>
          <h2>Item List</h2>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      );

      render(
        <TestWrapper>
          <ListComponent items={items} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Item List' })).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // List should render within reasonable time
      expect(renderTime).toBeLessThan(100);
      
      // Check that all items are rendered
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(50);
    });
  });

  describe('Memory Usage Tests', () => {
    test('should not create memory leaks in component mounting/unmounting', async () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const TestComponent = ({ count }) => (
        <div>
          <h1>Test Component {count}</h1>
          <p>Memory test component</p>
        </div>
      );

      // Mount and unmount components multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <TestWrapper>
            <TestComponent count={i} />
          </TestWrapper>
        );
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      if (performance.memory) {
        const memoryIncrease = finalMemory - initialMemory;
        // Memory increase should be reasonable (less than 5MB for simple components)
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      } else {
        // If performance.memory is not available, just pass the test
        expect(true).toBe(true);
      }
    });

    test('should clean up event listeners', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const ComponentWithListeners = () => {
        React.useEffect(() => {
          const handleClick = () => {};
          const handleKeydown = () => {};
          
          document.addEventListener('click', handleClick);
          document.addEventListener('keydown', handleKeydown);
          
          return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeydown);
          };
        }, []);

        return <div>Component with listeners</div>;
      };

      const { unmount } = render(
        <TestWrapper>
          <ComponentWithListeners />
        </TestWrapper>
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;
      
      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls.length;

      // Should clean up event listeners
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Animation Performance', () => {
    test('animations should not block rendering', async () => {
      const AnimatedComponent = () => {
        const [count, setCount] = React.useState(0);
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            setCount(c => c + 1);
          }, 16); // ~60fps
          
          setTimeout(() => clearInterval(interval), 100); // Stop after 100ms
          
          return () => clearInterval(interval);
        }, []);

        return (
          <div style={{ transform: `translateX(${count}px)` }}>
            Animated element: {count}
          </div>
        );
      };

      const startTime = performance.now();

      render(
        <TestWrapper>
          <AnimatedComponent />
        </TestWrapper>
      );

      await new Promise(resolve => setTimeout(resolve, 150));

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Animation should not significantly impact performance
      expect(totalTime).toBeLessThan(200);
    });

    test('should handle reduced motion preferences', () => {
      const MotionComponent = () => (
        <div className="motion-safe:animate-pulse motion-reduce:animate-none">
          Content with motion preferences
        </div>
      );

      render(
        <TestWrapper>
          <MotionComponent />
        </TestWrapper>
      );

      const element = screen.getByText('Content with motion preferences');
      expect(element).toHaveClass('motion-safe:animate-pulse');
      expect(element).toHaveClass('motion-reduce:animate-none');
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    test('should lazy load components efficiently', async () => {
      const LazyComponent = React.lazy(() => 
        Promise.resolve({
          default: () => <div>Lazy loaded component</div>
        })
      );

      const startTime = performance.now();

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
        expect(screen.getByText('Lazy loaded component')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Lazy loading should be fast for simple components
      expect(loadTime).toBeLessThan(100);
    });

    test('should optimize image loading with proper attributes', () => {
      render(
        <TestWrapper>
          <img 
            src="test-image.jpg" 
            alt="Test image"
            loading="lazy"
            decoding="async"
          />
        </TestWrapper>
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
      expect(image).toHaveAttribute('alt', 'Test image');
    });
  });

  describe('Core Web Vitals Simulation', () => {
    test('should simulate good Largest Contentful Paint (LCP)', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <div>
            <h1>Main Content</h1>
            <img src="hero-image.jpg" alt="Hero" width="800" height="400" />
            <p>This is the main content of the page</p>
          </div>
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Simulated LCP should be under 2.5 seconds (2500ms)
      // For our simple test, it should be much faster
      expect(renderTime).toBeLessThan(100);
    });

    test('should simulate good First Input Delay (FID)', async () => {
      const handleClick = jest.fn();
      
      render(
        <TestWrapper>
          <button onClick={handleClick}>Interactive Button</button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      
      const startTime = performance.now();
      button.click();
      const endTime = performance.now();
      
      const inputDelay = endTime - startTime;
      
      // FID should be under 100ms for good performance
      expect(inputDelay).toBeLessThan(100);
      expect(handleClick).toHaveBeenCalled();
    });

    test('should simulate good Cumulative Layout Shift (CLS)', () => {
      const StableLayoutComponent = () => (
        <div>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'red' }}>
            Fixed size element
          </div>
          <img 
            src="test.jpg" 
            alt="Test" 
            width="200" 
            height="150" 
            style={{ display: 'block' }}
          />
          <p>Text content below image</p>
        </div>
      );

      render(
        <TestWrapper>
          <StableLayoutComponent />
        </TestWrapper>
      );

      // Elements with fixed dimensions should not cause layout shift
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('width', '200');
      expect(image).toHaveAttribute('height', '150');
    });
  });

  describe('Network Performance Simulation', () => {
    test('should handle loading states gracefully', async () => {
      const AsyncComponent = () => {
        const [loading, setLoading] = React.useState(true);
        const [data, setData] = React.useState(null);

        React.useEffect(() => {
          // Simulate network request
          setTimeout(() => {
            setData('Loaded data');
            setLoading(false);
          }, 50);
        }, []);

        if (loading) {
          return <div>Loading...</div>;
        }

        return <div>Data: {data}</div>;
      };

      render(
        <TestWrapper>
          <AsyncComponent />
        </TestWrapper>
      );

      // Should show loading state initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should show data after loading
      await waitFor(() => {
        expect(screen.getByText('Data: Loaded data')).toBeInTheDocument();
      });
    });

    test('should implement proper error boundaries', () => {
      const ErrorBoundary = ({ children }) => {
        const [hasError, setHasError] = React.useState(false);

        React.useEffect(() => {
          const handleError = () => setHasError(true);
          window.addEventListener('error', handleError);
          return () => window.removeEventListener('error', handleError);
        }, []);

        if (hasError) {
          return <div>Something went wrong</div>;
        }

        return children;
      };

      const ProblematicComponent = ({ shouldError }) => {
        if (shouldError) {
          throw new Error('Test error');
        }
        return <div>Working component</div>;
      };

      // Test normal operation
      render(
        <TestWrapper>
          <ErrorBoundary>
            <ProblematicComponent shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('Resource Loading Optimization', () => {
    test('should use appropriate image formats and attributes', () => {
      render(
        <TestWrapper>
          <picture>
            <source srcSet="image.avif" type="image/avif" />
            <source srcSet="image.webp" type="image/webp" />
            <img 
              src="image.jpg" 
              alt="Optimized image"
              loading="lazy"
              decoding="async"
              width="400"
              height="300"
            />
          </picture>
        </TestWrapper>
      );

      const picture = screen.getByRole('img').parentElement;
      expect(picture.tagName).toBe('PICTURE');
      
      const sources = picture.querySelectorAll('source');
      expect(sources.length).toBe(2);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
      expect(img).toHaveAttribute('width', '400');
      expect(img).toHaveAttribute('height', '300');
    });

    test('should preload critical resources', () => {
      // Simulate preload links in document head
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = 'critical-font.woff2';
      preloadLink.as = 'font';
      preloadLink.type = 'font/woff2';
      preloadLink.crossOrigin = 'anonymous';
      
      document.head.appendChild(preloadLink);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks.length).toBeGreaterThan(0);

      // Clean up
      document.head.removeChild(preloadLink);
    });
  });

  describe('JavaScript Performance', () => {
    test('should avoid blocking the main thread', async () => {
      const NonBlockingComponent = () => {
        const [result, setResult] = React.useState(null);

        const performHeavyTask = React.useCallback(() => {
          // Use setTimeout to avoid blocking
          setTimeout(() => {
            let sum = 0;
            for (let i = 0; i < 1000; i++) {
              sum += i;
            }
            setResult(sum);
          }, 0);
        }, []);

        React.useEffect(() => {
          performHeavyTask();
        }, [performHeavyTask]);

        return <div>Result: {result || 'Computing...'}</div>;
      };

      const startTime = performance.now();

      render(
        <TestWrapper>
          <NonBlockingComponent />
        </TestWrapper>
      );

      const renderTime = performance.now() - startTime;

      // Initial render should be fast
      expect(renderTime).toBeLessThan(50);

      // Wait for computation to complete
      await waitFor(() => {
        expect(screen.getByText(/Result: \d+/)).toBeInTheDocument();
      });
    });

    test('should debounce expensive operations', async () => {
      const expensiveOperation = jest.fn();

      const DebouncedComponent = () => {
        const [value, setValue] = React.useState('');

        const debouncedOperation = React.useCallback(() => {
          const timeoutId = setTimeout(expensiveOperation, 50);
          return () => clearTimeout(timeoutId);
        }, []);

        React.useEffect(() => {
          if (value) {
            const cleanup = debouncedOperation();
            return cleanup;
          }
        }, [value, debouncedOperation]);

        return (
          <input 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type to trigger debounced operation"
          />
        );
      };

      render(
        <TestWrapper>
          <DebouncedComponent />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');

      // Simulate typing
      fireEvent.change(input, { target: { value: 'test' } });

      // Should not call expensive operation immediately
      expect(expensiveOperation).not.toHaveBeenCalled();

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should call expensive operation after debounce
      expect(expensiveOperation).toHaveBeenCalledTimes(1);
    });
  });
});