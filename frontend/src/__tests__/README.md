# Accessibility & Performance Testing Suite

This directory contains comprehensive tests for accessibility and performance compliance in the Seek frontend application.

## Overview

The testing suite ensures that the application meets:
- **WCAG 2.1 AA** accessibility standards
- **Performance** best practices and Core Web Vitals
- **Keyboard navigation** requirements
- **Screen reader** compatibility

## Test Files

### Accessibility Tests
- `accessibility-simple.test.js` - Core accessibility compliance tests
- `axe.config.js` - Configuration for axe-core accessibility testing

### Performance Tests
- `performance-simple.test.js` - Performance metrics and optimization tests

### Keyboard Navigation Tests
- `keyboardNavigation-simple.test.js` - Comprehensive keyboard accessibility tests

### Test Infrastructure
- `testRunner.js` - Orchestrates all testing approaches and generates reports
- `README.md` - This documentation file

## Running Tests

### Individual Test Suites

```bash
# Run accessibility tests
npm run test:accessibility

# Run performance tests
npm run test:performance

# Run keyboard navigation tests
npm run test:keyboard
```

### All Tests Together

```bash
# Run all accessibility and performance tests
npm run test:a11y-perf
```

### Comprehensive Test Runner

```bash
# Run comprehensive test suite with reporting
npm run test:comprehensive
```

### Lighthouse Performance Testing

```bash
# Run Lighthouse CI for performance auditing
npm run lighthouse
```

## Test Categories

### 1. Accessibility Tests (`accessibility-simple.test.js`)

#### Basic HTML Elements
- Button accessibility and ARIA compliance
- Form element labeling and associations
- Navigation structure and landmarks

#### Keyboard Navigation
- Tab order and focus management
- Keyboard event handling
- Interactive element accessibility

#### ARIA Support
- Proper ARIA labels and descriptions
- Live regions and announcements
- Complex widget patterns (tabs, dropdowns)

#### Focus Management
- Logical focus order
- Modal focus trapping
- Focus restoration

#### Color Contrast & Visual Accessibility
- WCAG color contrast compliance
- Reduced motion preferences
- High contrast mode support

#### Error Handling
- Accessible error messages
- Form validation feedback
- Screen reader announcements

### 2. Performance Tests (`performance-simple.test.js`)

#### Component Rendering Performance
- Render time measurements
- List rendering efficiency
- Component initialization speed

#### Memory Usage
- Memory leak detection
- Event listener cleanup
- Component unmounting

#### Animation Performance
- 60fps animation targets
- Reduced motion preferences
- Non-blocking animations

#### Bundle Size & Loading
- Lazy loading implementation
- Image optimization
- Resource loading strategies

#### Core Web Vitals Simulation
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

#### Network Performance
- Loading state handling
- Error boundary implementation
- Caching strategies

#### JavaScript Performance
- Main thread optimization
- Debouncing expensive operations
- Async operation handling

### 3. Keyboard Navigation Tests (`keyboardNavigation-simple.test.js`)

#### Basic Element Navigation
- Tab navigation through interactive elements
- Button keyboard activation (Enter/Space)
- Form navigation and submission

#### Link Navigation
- Link keyboard activation
- Skip link implementation
- Navigation structure

#### Modal & Dialog Navigation
- Modal keyboard interactions
- Escape key handling
- Focus trapping

#### Complex Widget Navigation
- Dropdown keyboard controls
- Tab list navigation (arrow keys)
- Roving tabindex patterns

#### Focus Management
- Logical focus order
- Focus restoration after modals
- Dynamic content focus

#### Keyboard Shortcuts
- Common shortcuts (Ctrl+S, Ctrl+C)
- Application-specific shortcuts
- Shortcut accessibility

#### Accessibility Features
- Focus indicators
- Screen reader announcements
- High contrast support

## Configuration

### Axe-core Configuration (`axe.config.js`)

The axe-core configuration includes:
- WCAG 2.1 AA rule sets
- Custom rule configurations
- Component-specific exclusions
- Strict and development modes

### Lighthouse Configuration (`lighthouserc.js`)

Lighthouse CI configuration includes:
- Performance budgets
- Accessibility thresholds
- Best practices checks
- SEO requirements

## Test Setup (`setupTests.js`)

The test setup includes:
- Axe-core integration
- Mock implementations for:
  - IntersectionObserver
  - ResizeObserver
  - matchMedia
  - Performance API
  - PointerEvent
- Console warning suppression
- Third-party library mocks

## Reporting

### HTML Reports
Tests generate comprehensive HTML reports with:
- Visual test results
- Performance metrics
- Accessibility violations
- Recommendations

### JSON Reports
Machine-readable reports for CI/CD integration:
- Test results summary
- Detailed violation information
- Performance measurements
- Trend analysis data

## CI/CD Integration

### GitHub Actions
The `.github/workflows/accessibility-performance-tests.yml` workflow:
- Runs on push and pull requests
- Tests multiple Node.js versions
- Generates and uploads reports
- Comments on pull requests with results

### Performance Budgets
- LCP: < 2.5 seconds
- FID: < 100ms
- CLS: < 0.1
- Accessibility score: > 95%

## Best Practices

### Writing Accessible Components
1. Use semantic HTML elements
2. Provide proper ARIA labels
3. Ensure keyboard navigation
4. Maintain focus management
5. Test with screen readers

### Performance Optimization
1. Lazy load non-critical components
2. Optimize images and assets
3. Implement proper caching
4. Monitor Core Web Vitals
5. Use performance budgets

### Testing Guidelines
1. Test with real user scenarios
2. Include edge cases
3. Test across different devices
4. Validate with assistive technologies
5. Monitor performance regressions

## Troubleshooting

### Common Issues

#### Accessibility Test Failures
- Check ARIA label associations
- Verify color contrast ratios
- Ensure proper heading hierarchy
- Test keyboard navigation paths

#### Performance Test Failures
- Review component render times
- Check for memory leaks
- Optimize heavy computations
- Implement proper lazy loading

#### Keyboard Navigation Issues
- Verify tab order logic
- Check focus trap implementation
- Test escape key handling
- Validate roving tabindex patterns

### Debugging Tips
1. Use browser dev tools accessibility panel
2. Test with screen readers (NVDA, JAWS, VoiceOver)
3. Use keyboard-only navigation
4. Monitor performance in dev tools
5. Check console for accessibility warnings

## Resources

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Testing Library Accessibility](https://testing-library.com/docs/guide-which-query/)

### Performance
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)

### Keyboard Navigation
- [Keyboard Navigation Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Focus Management](https://developers.google.com/web/fundamentals/accessibility/focus)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)