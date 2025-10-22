/**
 * Performance Optimization Utilities
 * Provides comprehensive performance monitoring and optimization features
 */

/**
 * Core Web Vitals Monitoring
 */
class CoreWebVitalsMonitor {
  constructor() {
    this.metrics = {
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      FCP: null, // First Contentful Paint
      TTFB: null // Time to First Byte
    };
    this.observers = [];
    this.callbacks = [];
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  init() {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
    this.observeNavigationTiming();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.FID);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.CLS = clsValue;
        this.reportMetric('CLS', clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  /**
   * Observe Time to First Byte
   */
  observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.metrics.TTFB = entry.responseStart - entry.requestStart;
            this.reportMetric('TTFB', this.metrics.TTFB);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  /**
   * Observe navigation timing
   */
  observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
        };
        
        Object.entries(metrics).forEach(([key, value]) => {
          this.reportMetric(key, value);
        });
      }
    });
  }

  /**
   * Report metric to callbacks
   */
  reportMetric(name, value) {
    const metric = { name, value, timestamp: Date.now() };
    this.callbacks.forEach(callback => callback(metric));
  }

  /**
   * Add callback for metric reporting
   */
  onMetric(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Performance Budget Monitor
 */
class PerformanceBudgetMonitor {
  constructor() {
    this.budgets = {
      LCP: 2500, // 2.5 seconds
      FID: 100,  // 100 milliseconds
      CLS: 0.1,  // 0.1
      FCP: 1800, // 1.8 seconds
      TTFB: 800, // 800 milliseconds
      bundleSize: 250000, // 250KB
      imageSize: 100000   // 100KB per image
    };
    this.violations = [];
  }

  /**
   * Check if metric exceeds budget
   */
  checkBudget(metric, value) {
    const budget = this.budgets[metric];
    if (budget && value > budget) {
      const violation = {
        metric,
        value,
        budget,
        excess: value - budget,
        timestamp: Date.now()
      };
      this.violations.push(violation);
      this.reportViolation(violation);
      return false;
    }
    return true;
  }

  /**
   * Report budget violation
   */
  reportViolation(violation) {
    console.warn(`Performance Budget Violation:`, violation);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(violation);
    }
  }

  /**
   * Send violation to analytics
   */
  sendToAnalytics(violation) {
    // Implementation would send to your analytics service
    // Example: Google Analytics, DataDog, New Relic, etc.
    if (window.gtag) {
      window.gtag('event', 'performance_budget_violation', {
        metric: violation.metric,
        value: violation.value,
        budget: violation.budget,
        excess: violation.excess
      });
    }
  }

  /**
   * Get all violations
   */
  getViolations() {
    return [...this.violations];
  }

  /**
   * Update budget for a metric
   */
  setBudget(metric, value) {
    this.budgets[metric] = value;
  }
}

/**
 * Resource Loading Optimizer
 */
class ResourceLoadingOptimizer {
  constructor() {
    this.loadedResources = new Set();
    this.preloadQueue = [];
    this.criticalResources = new Set();
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/fonts/jetbrains-mono-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
    ];

    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  /**
   * Preload a resource
   */
  preloadResource({ href, as, type, crossorigin }) {
    if (this.loadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;

    link.onload = () => {
      this.loadedResources.add(href);
    };

    document.head.appendChild(link);
  }

  /**
   * Lazy load images with intersection observer
   */
  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Optimize image loading
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" for non-critical images
      if (!this.criticalResources.has(img.src)) {
        img.loading = 'lazy';
      }

      // Add proper sizing attributes
      if (!img.width || !img.height) {
        img.addEventListener('load', () => {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
        });
      }
    });
  }

  /**
   * Prefetch next page resources
   */
  prefetchNextPageResources(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

/**
 * Memory Usage Monitor
 */
class MemoryUsageMonitor {
  constructor() {
    this.measurements = [];
    this.thresholds = {
      warning: 50 * 1024 * 1024, // 50MB
      critical: 100 * 1024 * 1024 // 100MB
    };
  }

  /**
   * Measure current memory usage
   */
  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const measurement = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };

      this.measurements.push(measurement);
      this.checkMemoryThresholds(measurement);
      
      return measurement;
    }
    return null;
  }

  /**
   * Check memory thresholds
   */
  checkMemoryThresholds(measurement) {
    const { usedJSHeapSize } = measurement;
    
    if (usedJSHeapSize > this.thresholds.critical) {
      console.error('Critical memory usage detected:', usedJSHeapSize);
      this.reportMemoryIssue('critical', measurement);
    } else if (usedJSHeapSize > this.thresholds.warning) {
      console.warn('High memory usage detected:', usedJSHeapSize);
      this.reportMemoryIssue('warning', measurement);
    }
  }

  /**
   * Report memory issue
   */
  reportMemoryIssue(level, measurement) {
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Implementation would send to your monitoring service
      console.log(`Memory ${level}:`, measurement);
    }
  }

  /**
   * Get memory usage trend
   */
  getMemoryTrend() {
    if (this.measurements.length < 2) return null;
    
    const recent = this.measurements.slice(-10);
    const trend = recent.reduce((acc, curr, index) => {
      if (index === 0) return acc;
      const prev = recent[index - 1];
      return acc + (curr.usedJSHeapSize - prev.usedJSHeapSize);
    }, 0) / (recent.length - 1);

    return trend;
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(interval = 30000) { // 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.measureMemoryUsage();
    }, interval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

/**
 * Performance Optimization Manager
 */
class PerformanceOptimizationManager {
  constructor() {
    this.coreWebVitals = new CoreWebVitalsMonitor();
    this.budgetMonitor = new PerformanceBudgetMonitor();
    this.resourceOptimizer = new ResourceLoadingOptimizer();
    this.memoryMonitor = new MemoryUsageMonitor();
    this.isInitialized = false;
  }

  /**
   * Initialize all performance monitoring
   */
  init() {
    if (this.isInitialized) return;

    // Initialize Core Web Vitals monitoring
    this.coreWebVitals.init();
    
    // Set up metric reporting
    this.coreWebVitals.onMetric((metric) => {
      this.budgetMonitor.checkBudget(metric.name, metric.value);
    });

    // Initialize resource optimization
    this.resourceOptimizer.preloadCriticalResources();
    this.resourceOptimizer.lazyLoadImages();
    this.resourceOptimizer.optimizeImages();

    // Start memory monitoring
    this.memoryMonitor.startMonitoring();

    // Set up performance observer for long tasks
    this.observeLongTasks();

    // Set up error tracking
    this.setupErrorTracking();

    this.isInitialized = true;
    console.log('Performance optimization initialized');
  }

  /**
   * Observe long tasks that block the main thread
   */
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * Set up error tracking
   */
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack
      });
    });
  }

  /**
   * Report error to monitoring service
   */
  reportError(error) {
    console.error('Application error:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (e.g., Sentry, Bugsnag)
      // Implementation would depend on your error tracking service
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      coreWebVitals: this.coreWebVitals.getMetrics(),
      budgetViolations: this.budgetMonitor.getViolations(),
      memoryUsage: this.memoryMonitor.measureMemoryUsage(),
      memoryTrend: this.memoryMonitor.getMemoryTrend(),
      timestamp: Date.now()
    };
  }

  /**
   * Optimize for specific scenarios
   */
  optimizeForScenario(scenario) {
    switch (scenario) {
      case 'mobile':
        this.optimizeForMobile();
        break;
      case 'slow-connection':
        this.optimizeForSlowConnection();
        break;
      case 'low-memory':
        this.optimizeForLowMemory();
        break;
      default:
        console.warn('Unknown optimization scenario:', scenario);
    }
  }

  /**
   * Mobile-specific optimizations
   */
  optimizeForMobile() {
    // Reduce image quality for mobile
    document.querySelectorAll('img').forEach(img => {
      if (img.srcset) {
        // Use smaller images for mobile
        const srcset = img.srcset.split(',').map(src => {
          const [url, size] = src.trim().split(' ');
          return `${url} ${size}`;
        }).join(', ');
        img.srcset = srcset;
      }
    });

    // Disable non-essential animations on mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
    }
  }

  /**
   * Slow connection optimizations
   */
  optimizeForSlowConnection() {
    // Disable autoplay videos
    document.querySelectorAll('video[autoplay]').forEach(video => {
      video.removeAttribute('autoplay');
    });

    // Reduce image quality
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.lowQualitySrc) {
        img.src = img.dataset.lowQualitySrc;
      }
    });
  }

  /**
   * Low memory optimizations
   */
  optimizeForLowMemory() {
    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('temp')) {
            caches.delete(name);
          }
        });
      });
    }

    // Reduce the number of DOM elements
    document.querySelectorAll('[data-lazy]').forEach(element => {
      if (!element.getBoundingClientRect().top < window.innerHeight) {
        element.style.display = 'none';
      }
    });
  }

  /**
   * Cleanup all monitoring
   */
  cleanup() {
    this.coreWebVitals.cleanup();
    this.memoryMonitor.stopMonitoring();
    this.isInitialized = false;
  }
}

// Create singleton instance
const performanceOptimizer = new PerformanceOptimizationManager();

export default performanceOptimizer;
export {
  CoreWebVitalsMonitor,
  PerformanceBudgetMonitor,
  ResourceLoadingOptimizer,
  MemoryUsageMonitor,
  PerformanceOptimizationManager
};