# Performance Best Practices

This document outlines performance best practices for the Seek frontend application to ensure optimal user experience and meet Core Web Vitals standards.

## Core Web Vitals Targets

### Largest Contentful Paint (LCP)
- **Target**: < 2.5 seconds
- **Strategies**:
  - Optimize images with WebP format and proper sizing
  - Preload critical resources (fonts, hero images)
  - Use CDN for static assets
  - Minimize render-blocking resources

### First Input Delay (FID)
- **Target**: < 100 milliseconds
- **Strategies**:
  - Break up long tasks (> 50ms)
  - Use code splitting and lazy loading
  - Optimize JavaScript execution
  - Defer non-critical JavaScript

### Cumulative Layout Shift (CLS)
- **Target**: < 0.1
- **Strategies**:
  - Set explicit dimensions for images and videos
  - Reserve space for dynamic content
  - Avoid inserting content above existing content
  - Use CSS transforms for animations

## Performance Optimization Strategies

### 1. Code Splitting and Lazy Loading

```javascript
// Route-based code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Playground = React.lazy(() => import('./pages/Playground'));

// Component-based lazy loading
const HeavyComponent = React.lazy(() => import('./components/HeavyComponent'));

// Conditional loading
const AdminPanel = React.lazy(() => 
  import('./components/AdminPanel').then(module => ({
    default: module.AdminPanel
  }))
);
```

### 2. Image Optimization

```jsx
// Use optimized images with proper sizing
<img
  src="/images/hero-800w.webp"
  srcSet="/images/hero-400w.webp 400w, /images/hero-800w.webp 800w, /images/hero-1200w.webp 1200w"
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Hero image"
  loading="lazy"
  width="800"
  height="600"
/>

// Use next-gen formats with fallbacks
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero image" />
</picture>
```

### 3. Resource Preloading

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/jetbrains-mono-var.woff2" as="font" type="font/woff2" crossorigin="anonymous">

<!-- Preload critical CSS -->
<link rel="preload" href="/css/critical.css" as="style">

<!-- Prefetch next page resources -->
<link rel="prefetch" href="/js/dashboard.chunk.js">
```

### 4. Bundle Optimization

```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};

// Tree shaking - import only what you need
import { debounce } from 'lodash/debounce'; // ✅ Good
import _ from 'lodash'; // ❌ Bad - imports entire library
```

### 5. Memory Management

```javascript
// Cleanup event listeners
useEffect(() => {
  const handleScroll = () => {
    // Handle scroll
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

// Cleanup intervals and timeouts
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

// Use weak references for large objects
const cache = new WeakMap();
```

### 6. Efficient State Management

```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

### 7. Animation Performance

```css
/* Use transform and opacity for animations */
.animate-slide {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.animate-slide.active {
  transform: translateX(0);
}

/* Avoid animating layout properties */
.bad-animation {
  transition: width 0.3s; /* ❌ Causes layout */
}

.good-animation {
  transition: transform 0.3s; /* ✅ Composite layer */
}

/* Use will-change for complex animations */
.complex-animation {
  will-change: transform;
}
```

## Performance Monitoring

### 1. Core Web Vitals Monitoring

```javascript
import performanceOptimizer from './utils/performanceOptimization';

// Initialize monitoring
performanceOptimizer.init();

// Get performance report
const report = performanceOptimizer.getPerformanceReport();
console.log('Performance metrics:', report);
```

### 2. Performance Budgets

```javascript
// Set performance budgets
const budgetMonitor = new PerformanceBudgetMonitor();
budgetMonitor.setBudget('LCP', 2500); // 2.5 seconds
budgetMonitor.setBudget('FID', 100);  // 100 milliseconds
budgetMonitor.setBudget('CLS', 0.1);  // 0.1

// Monitor violations
budgetMonitor.onViolation((violation) => {
  console.warn('Performance budget exceeded:', violation);
});
```

### 3. Real User Monitoring (RUM)

```javascript
// Track real user metrics
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    // Send to analytics
    analytics.track('performance_metric', {
      name: entry.name,
      value: entry.value,
      timestamp: entry.startTime
    });
  });
});

observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
```

## Development Guidelines

### 1. Performance Testing

```bash
# Run performance tests
npm run test:performance

# Lighthouse audit
npm run lighthouse

# Bundle analysis
npm run build:analyze
```

### 2. Performance Checklist

Before deploying:

- [ ] Run Lighthouse audit (score > 90)
- [ ] Check Core Web Vitals metrics
- [ ] Verify bundle size is within budget
- [ ] Test on slow 3G connection
- [ ] Test on low-end devices
- [ ] Validate image optimization
- [ ] Check for memory leaks
- [ ] Verify lazy loading works
- [ ] Test offline functionality

### 3. Continuous Monitoring

```javascript
// Set up performance monitoring in CI/CD
// .github/workflows/performance.yml
name: Performance Tests
on: [push, pull_request]
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        run: |
          npm ci
          npm run build
          npm run lighthouse:ci
```

## Common Performance Anti-patterns

### ❌ What NOT to do:

```javascript
// Don't create objects in render
function Component() {
  return <div style={{ marginTop: 10 }} />; // Creates new object every render
}

// Don't use array index as key for dynamic lists
{items.map((item, index) => (
  <Item key={index} data={item} /> // Can cause unnecessary re-renders
))}

// Don't perform expensive operations in render
function Component({ data }) {
  const processedData = expensiveOperation(data); // Runs every render
  return <div>{processedData}</div>;
}

// Don't forget to cleanup
useEffect(() => {
  const subscription = subscribe();
  // Missing cleanup - memory leak!
}, []);
```

### ✅ What TO do:

```javascript
// Create objects outside render or use useMemo
const styles = { marginTop: 10 };
function Component() {
  return <div style={styles} />;
}

// Use stable keys for dynamic lists
{items.map((item) => (
  <Item key={item.id} data={item} />
))}

// Use useMemo for expensive operations
function Component({ data }) {
  const processedData = useMemo(() => expensiveOperation(data), [data]);
  return <div>{processedData}</div>;
}

// Always cleanup effects
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

## Performance Metrics Dashboard

Access the performance monitoring dashboard in development:

1. Start the development server: `npm run dev`
2. Click the performance monitor button (bottom right)
3. Monitor real-time Core Web Vitals
4. Check for budget violations
5. Monitor memory usage

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Performance Budget](https://web.dev/performance-budgets-101/)

## Support

For performance-related questions or issues:

1. Check the performance monitoring dashboard
2. Run the performance test suite
3. Review this documentation
4. Contact the development team

Remember: Performance is a feature, not an afterthought. Always consider performance implications when adding new features or making changes.