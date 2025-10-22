/**
 * Performance monitoring utilities for Core Web Vitals tracking
 */

// Core Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
};

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isEnabled = process.env.NODE_ENV === 'production';
    
    if (this.isEnabled) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    // Performance Observer for navigation and resource timing
    if ('PerformanceObserver' in window) {
      try {
        // Observe navigation timing
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.handleNavigationTiming(entry);
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.handlePaintTiming(entry);
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('FID', entry.processingStart - entry.startTime);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Observe layout shifts
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.recordMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }

    // Track custom metrics
    this.trackCustomMetrics();
  }

  handleNavigationTiming(entry) {
    // Time to First Byte
    const ttfb = entry.responseStart - entry.requestStart;
    this.recordMetric('TTFB', ttfb);

    // DOM Content Loaded
    const dcl = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    this.recordMetric('DCL', dcl);

    // Load Complete
    const loadComplete = entry.loadEventEnd - entry.loadEventStart;
    this.recordMetric('LoadComplete', loadComplete);
  }

  handlePaintTiming(entry) {
    if (entry.name === 'first-contentful-paint') {
      this.recordMetric('FCP', entry.startTime);
    }
  }

  recordMetric(name, value) {
    this.metrics[name] = {
      value,
      timestamp: Date.now(),
      rating: this.getRating(name, value)
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value}ms (${this.metrics[name].rating})`);
    }

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(name, value, this.metrics[name].rating);
  }

  getRating(metricName, value) {
    const threshold = THRESHOLDS[metricName];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  trackCustomMetrics() {
    // Track React component render times
    this.trackReactRenderTime();
    
    // Track route changes
    this.trackRouteChanges();
    
    // Track resource loading
    this.trackResourceLoading();
  }

  trackReactRenderTime() {
    // Use React DevTools Profiler API if available
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      // This would integrate with React DevTools profiling
      // Implementation depends on specific React DevTools integration
    }
  }

  trackRouteChanges() {
    let routeStartTime = performance.now();

    // Listen for route changes (works with React Router)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const trackRouteChange = () => {
      const routeEndTime = performance.now();
      const routeChangeTime = routeEndTime - routeStartTime;
      this.recordMetric('RouteChange', routeChangeTime);
      routeStartTime = performance.now();
    };

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      trackRouteChange();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      trackRouteChange();
    };

    window.addEventListener('popstate', trackRouteChange);
  }

  trackResourceLoading() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Track slow resources
          if (entry.duration > 1000) {
            this.recordMetric(`SlowResource_${entry.initiatorType}`, entry.duration);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  sendToAnalytics(metricName, value, rating) {
    // Implement based on your analytics provider
    // Example for Google Analytics 4:
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        metric_name: metricName,
        metric_value: Math.round(value),
        metric_rating: rating,
        custom_parameter: window.location.pathname
      });
    }

    // Example for custom analytics endpoint:
    if (this.isEnabled && navigator.sendBeacon) {
      const data = JSON.stringify({
        metric: metricName,
        value: Math.round(value),
        rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      });
      
      navigator.sendBeacon('/api/analytics/performance', data);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getMetricsSummary() {
    const summary = {};
    Object.entries(this.metrics).forEach(([name, data]) => {
      summary[name] = {
        value: Math.round(data.value),
        rating: data.rating
      };
    });
    return summary;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = {};
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const trackCustomEvent = (eventName, duration) => {
  performanceMonitor.recordMetric(`Custom_${eventName}`, duration);
};

export const trackComponentRender = (componentName, renderTime) => {
  performanceMonitor.recordMetric(`Component_${componentName}`, renderTime);
};

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics();
};

export const getPerformanceSummary = () => {
  return performanceMonitor.getMetricsSummary();
};

export default performanceMonitor;