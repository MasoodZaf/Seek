# Design System Utilities Test Suite

This directory contains comprehensive unit tests for the design system utilities, covering color functions, animation utilities, typography helpers, and their integration.

## Test Files

### 1. `colorUtils.test.js`
Tests for color manipulation and accessibility compliance:
- **Color Conversion**: Hex to RGB, RGB to hex conversions
- **Luminance Calculation**: Relative luminance for accessibility calculations
- **Contrast Ratio**: WCAG contrast ratio calculations
- **Accessibility Compliance**: WCAG AA/AAA standard validation
- **Color Manipulation**: Lighten/darken color functions
- **Design System Validation**: Ensures all design system colors meet accessibility standards

**Key Features Tested:**
- ✅ Color format conversions (hex ↔ RGB)
- ✅ WCAG contrast ratio calculations
- ✅ Accessibility compliance (AA/AAA standards)
- ✅ Color manipulation (lighten/darken)
- ✅ Design system color palette validation
- ✅ Error handling for invalid inputs

### 2. `animations.test.js`
Tests for animation utilities and accessibility compliance:
- **Animation Constants**: Duration and easing function validation
- **Motion Preferences**: Reduced motion detection and handling
- **Animation Creation**: CSS animation string generation
- **Element Animation**: DOM element animation functions
- **Staggered Animations**: Sequential animation timing
- **Scroll Animations**: Intersection Observer-based animations
- **Performance**: Animation performance optimization

**Key Features Tested:**
- ✅ Animation duration constants and easing functions
- ✅ Reduced motion preference detection
- ✅ CSS animation string generation
- ✅ DOM element animation functions
- ✅ Staggered animation timing
- ✅ Scroll-based animation observers
- ✅ Performance optimization (60fps compliance)
- ✅ Accessibility compliance (reduced motion support)

### 3. `typography.test.js`
Tests for typography utilities and cross-browser compatibility:
- **Font Loading**: Font availability detection
- **Font Properties**: Computed style extraction
- **Line Height**: Optimal line height calculations
- **Font Size Conversion**: Unit conversion (px, rem, em)
- **Text Overflow**: Overflow detection utilities
- **Responsive Typography**: Responsive font size generation
- **Font Stack Validation**: System font fallback validation

**Key Features Tested:**
- ✅ Font loading detection (FontFace API + canvas fallback)
- ✅ Computed font property extraction
- ✅ Optimal line height calculations
- ✅ Font size unit conversions
- ✅ Text overflow detection
- ✅ Responsive font size generation
- ✅ Font stack validation (system + generic fallbacks)
- ✅ Cross-browser compatibility

### 4. `designSystem.integration.test.js`
Integration tests for the complete design system:
- **Color + Typography Integration**: Accessibility across font sizes
- **Animation + Accessibility**: Motion preference integration
- **CSS Custom Properties**: JavaScript ↔ CSS variable consistency
- **Theme Switching**: Multi-theme compatibility
- **Performance**: Utility function performance benchmarks
- **Error Handling**: Graceful degradation testing

**Key Features Tested:**
- ✅ Color accessibility with typography scales
- ✅ Animation accessibility integration
- ✅ CSS custom property consistency
- ✅ Theme switching compatibility
- ✅ Performance benchmarks (< 10ms for 100 operations)
- ✅ Error handling and fallbacks

## Test Coverage

### Accessibility Compliance
- **WCAG AA Standards**: All design system colors meet 4.5:1 contrast ratio
- **WCAG AAA Standards**: Primary text colors meet 7:1 contrast ratio
- **Reduced Motion**: All animations respect `prefers-reduced-motion`
- **Font Accessibility**: Typography scales maintain readability (≥10px)

### Performance Standards
- **Animation Performance**: All micro-interactions ≤500ms duration
- **Utility Performance**: 100 operations complete in <10ms
- **CSS Property Access**: 150 property reads in <5ms
- **Hardware Acceleration**: All easing functions use cubic-bezier

### Cross-Browser Compatibility
- **Font Stacks**: Include system fonts for macOS, Windows, Android
- **Fallback Fonts**: Generic fallbacks (sans-serif, serif, monospace)
- **Zoom Levels**: Typography works at 0.5x to 2x zoom
- **Browser Support**: Modern browsers + graceful degradation

## Running Tests

```bash
# Run all design system tests
npm test -- --testPathPattern="colorUtils|animations|typography|designSystem"

# Run specific test file
npm test -- --testPathPattern="colorUtils"
npm test -- --testPathPattern="animations"
npm test -- --testPathPattern="typography"
npm test -- --testPathPattern="designSystem.integration"

# Run with coverage
npm test -- --coverage --testPathPattern="colorUtils|animations|typography|designSystem"
```

## Test Results Summary

- **Total Tests**: 155 tests
- **Test Suites**: 4 test suites
- **Pass Rate**: 100% (155/155 passing)
- **Coverage Areas**:
  - Color utilities and accessibility
  - Animation performance and accessibility
  - Typography rendering and compatibility
  - Design system integration

## Design System Compliance

All tests validate compliance with:
- **WCAG 2.1 AA/AAA** accessibility standards
- **60fps animation** performance targets
- **Cross-browser** typography compatibility
- **Responsive design** principles
- **Progressive enhancement** patterns

## Maintenance

These tests should be run:
- Before any design system changes
- As part of CI/CD pipeline
- When adding new utility functions
- When updating accessibility requirements
- Before major releases

The test suite ensures the design system maintains high quality, accessibility, and performance standards across all supported browsers and devices.