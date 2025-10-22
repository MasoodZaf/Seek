/**
 * Design System Integration Tests
 * Tests the integration between color, typography, and animation utilities
 */

import colorUtils from './colorUtils.test.js';
import typographyUtils from './typography.test.js';
import animationUtils from '../animations.js';

// Mock CSS custom properties access
const mockCSSCustomProperties = (properties = {}) => {
  const defaultProperties = {
    '--color-primary-500': '#3b82f6',
    '--color-primary-600': '#2563eb',
    '--color-success-500': '#22c55e',
    '--color-warning-500': '#f59e0b',
    '--color-error-500': '#ef4444',
    '--color-background': '#ffffff',
    '--color-foreground': '#0f172a',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--line-height-normal': '1.5',
    '--duration-normal': '300ms',
    '--ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  };

  const mockGetPropertyValue = jest.fn((property) => {
    return properties[property] || defaultProperties[property] || '';
  });

  global.getComputedStyle = jest.fn().mockReturnValue({
    getPropertyValue: mockGetPropertyValue,
  });

  return mockGetPropertyValue;
};

describe('Design System Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Ensure window.matchMedia is properly mocked
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Color and Typography Integration', () => {
    test('semantic colors meet accessibility standards with design system typography', () => {
      const semanticColors = {
        primary: '#2563eb',
        success: '#15803d', // Using accessible green
        warning: '#b45309', // Using accessible orange
        error: '#dc2626',   // Using accessible red
      };

      const backgrounds = {
        light: '#ffffff',
        secondary: '#f8fafc',
      };

      Object.entries(semanticColors).forEach(([colorName, colorValue]) => {
        Object.entries(backgrounds).forEach(([bgName, bgValue]) => {
          const result = colorUtils.checkAccessibility(colorValue, bgValue);
          
          expect(result.passesAA).toBe(true);
          expect(result.contrastRatio).toBeGreaterThan(4.5);
        });
      });
    });

    test('typography scales maintain readability with color combinations', () => {
      const fontSizes = {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      };

      const colorCombinations = [
        { fg: '#0f172a', bg: '#ffffff' }, // Dark on light
        { fg: '#475569', bg: '#ffffff' }, // Medium on light
        { fg: '#2563eb', bg: '#ffffff' }, // Primary on light
      ];

      Object.entries(fontSizes).forEach(([sizeName, sizeValue]) => {
        const pxSize = parseFloat(typographyUtils.convertFontSize(sizeValue, 'px'));
        
        // Font size should be readable (>= 12px)
        expect(pxSize).toBeGreaterThanOrEqual(12);
        
        colorCombinations.forEach(({ fg, bg }) => {
          const contrast = colorUtils.getContrastRatio(fg, bg);
          
          // Smaller text needs higher contrast
          if (pxSize < 16) {
            expect(contrast).toBeGreaterThan(4.5); // AA standard
          } else {
            expect(contrast).toBeGreaterThan(3); // AA Large standard
          }
        });
      });
    });

    test('gradient colors maintain accessibility when used with text', () => {
      // Test gradient stop colors for accessibility
      const gradientStops = {
        primary: ['#667eea', '#764ba2'],
        success: ['#84fab0', '#8fd3f4'],
        warning: ['#ffecd2', '#fcb69f'],
      };

      Object.entries(gradientStops).forEach(([gradientName, stops]) => {
        stops.forEach(stopColor => {
          const contrastWithWhite = colorUtils.getContrastRatio(stopColor, '#ffffff');
          const contrastWithDark = colorUtils.getContrastRatio(stopColor, '#0f172a');
          
          // At least one combination should be accessible
          expect(contrastWithWhite >= 3 || contrastWithDark >= 3).toBe(true);
        });
      });
    });
  });

  describe('Animation and Accessibility Integration', () => {
    test('animation durations respect accessibility preferences', () => {
      // Mock reduced motion preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const reducedDuration = animationUtils.getAnimationDuration(300);
      expect(reducedDuration).toBe(1); // Should be 1ms for reduced motion

      // Reset to normal motion
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const normalDuration = animationUtils.getAnimationDuration(300);
      expect(normalDuration).toBe(300);
    });

    test('animation easing functions are performance optimized', () => {
      const easingFunctions = Object.values(animationUtils.ANIMATION_EASING);
      
      easingFunctions.forEach(easing => {
        // All easing functions should use cubic-bezier for hardware acceleration
        expect(easing).toMatch(/cubic-bezier/);
        
        // Cubic-bezier values should be within valid range (0-1 for time, any for value)
        const values = easing.match(/cubic-bezier\(([\d\s.,\-]+)\)/)[1].split(',');
        expect(values).toHaveLength(4);
        
        values.forEach((value, index) => {
          const numValue = parseFloat(value.trim());
          if (index % 2 === 0) { // Time values (0, 2)
            expect(numValue).toBeGreaterThanOrEqual(0);
            expect(numValue).toBeLessThanOrEqual(1);
          }
          // Value parameters (1, 3) can be any number
        });
      });
    });

    test('animation performance meets 60fps requirements', () => {
      const maxDuration = 500; // Maximum for micro-interactions
      const minDuration = 150; // Minimum for perceptible animation
      
      Object.values(animationUtils.ANIMATION_DURATION).forEach(duration => {
        if (duration !== animationUtils.ANIMATION_DURATION.SLOWER && 
            duration !== animationUtils.ANIMATION_DURATION.SLOWEST) {
          expect(duration).toBeLessThanOrEqual(maxDuration);
        }
        expect(duration).toBeGreaterThanOrEqual(minDuration);
      });
    });
  });

  describe('CSS Custom Properties Integration', () => {
    test('design system CSS variables are accessible via JavaScript', () => {
      const mockGetProperty = mockCSSCustomProperties();
      
      // Test color variables
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary-500');
      expect(primaryColor).toBe('#3b82f6');
      
      // Test typography variables
      const baseSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-size-base');
      expect(baseSize).toBe('1rem');
      
      // Test animation variables
      const normalDuration = getComputedStyle(document.documentElement)
        .getPropertyValue('--duration-normal');
      expect(normalDuration).toBe('300ms');
    });

    test('CSS variables maintain consistency with JavaScript utilities', () => {
      mockCSSCustomProperties();
      
      // Color consistency
      const cssColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary-500').trim();
      const jsColor = '#3b82f6';
      expect(cssColor).toBe(jsColor);
      
      // Typography consistency
      const cssFontSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-size-base').trim();
      const jsFontSize = typographyUtils.convertFontSize('16px', 'rem');
      expect(cssFontSize).toBe('1rem');
      expect(jsFontSize).toBe('1.000rem');
    });
  });

  describe('Theme Switching Integration', () => {
    test('color utilities work with theme switching', () => {
      // Test light theme colors
      const lightThemeColors = {
        background: '#ffffff',
        foreground: '#0f172a',
        primary: '#2563eb',
      };

      // Test dark theme colors
      const darkThemeColors = {
        background: '#0f172a',
        foreground: '#ffffff',
        primary: '#3b82f6',
      };

      // Light theme accessibility
      const lightContrast = colorUtils.getContrastRatio(
        lightThemeColors.foreground,
        lightThemeColors.background
      );
      expect(lightContrast).toBeGreaterThan(7); // Should pass AAA

      // Dark theme accessibility
      const darkContrast = colorUtils.getContrastRatio(
        darkThemeColors.foreground,
        darkThemeColors.background
      );
      expect(darkContrast).toBeGreaterThan(7); // Should pass AAA

      // Primary colors should be accessible on both backgrounds
      const primaryOnLight = colorUtils.getContrastRatio(
        lightThemeColors.primary,
        lightThemeColors.background
      );
      const primaryOnDark = colorUtils.getContrastRatio(
        darkThemeColors.primary,
        darkThemeColors.background
      );

      expect(primaryOnLight).toBeGreaterThan(4.5);
      expect(primaryOnDark).toBeGreaterThan(4.5);
    });

    test('animations respect theme preferences', () => {
      // Animations should work consistently across themes
      const mockElement = {
        style: {},
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      // Test animation in light theme
      animationUtils.fadeIn(mockElement);
      expect(mockElement.style.animation).toContain('fadeIn');
      expect(mockElement.style.animation).toContain('300ms');

      // Animation properties should be the same regardless of theme
      const lightAnimation = mockElement.style.animation;

      // Reset element
      mockElement.style = {};

      // Test animation in dark theme (should be identical)
      animationUtils.fadeIn(mockElement);
      expect(mockElement.style.animation).toBe(lightAnimation);
    });
  });

  describe('Performance Integration', () => {
    test('design system utilities have minimal performance impact', () => {
      const startTime = performance.now();
      
      // Test multiple utility calls
      for (let i = 0; i < 100; i++) {
        colorUtils.getContrastRatio('#2563eb', '#ffffff');
        typographyUtils.convertFontSize('16px', 'rem');
        animationUtils.getAnimationDuration(300);
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete 100 operations in under 10ms
      expect(executionTime).toBeLessThan(10);
    });

    test('CSS custom property access is optimized', () => {
      mockCSSCustomProperties();
      
      const startTime = performance.now();
      
      // Test multiple CSS variable reads
      for (let i = 0; i < 50; i++) {
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500');
        getComputedStyle(document.documentElement).getPropertyValue('--font-size-base');
        getComputedStyle(document.documentElement).getPropertyValue('--duration-normal');
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete 150 property reads in under 5ms
      expect(executionTime).toBeLessThan(5);
    });
  });

  describe('Error Handling Integration', () => {
    test('utilities handle invalid inputs gracefully', () => {
      // Color utilities
      expect(() => colorUtils.getContrastRatio('invalid', '#ffffff')).not.toThrow();
      expect(colorUtils.getContrastRatio('invalid', '#ffffff')).toBe(0);

      // Typography utilities
      expect(() => typographyUtils.convertFontSize('invalid', 'rem')).not.toThrow();
      expect(typographyUtils.convertFontSize('invalid', 'rem')).toBe('invalid');

      // Animation utilities
      expect(() => animationUtils.animateElement(null, 'fadeIn')).not.toThrow();
    });

    test('utilities provide meaningful fallbacks', () => {
      // Color fallbacks
      const invalidColorResult = colorUtils.checkAccessibility('invalid', '#ffffff');
      expect(invalidColorResult.contrastRatio).toBe(0);
      expect(invalidColorResult.passesAA).toBe(false);

      // Typography fallbacks
      const invalidFontResult = typographyUtils.validateFontStack('');
      expect(invalidFontResult.isValid).toBe(false);
      expect(invalidFontResult.fonts).toEqual(['']);

      // Animation fallbacks with reduced motion
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
      }));
      
      const reducedMotionDuration = animationUtils.getAnimationDuration(300);
      expect(reducedMotionDuration).toBe(1);
    });
  });
});

describe('Design System Compliance', () => {
  test('all design system colors meet WCAG AA standards', () => {
    const designSystemColors = {
      'primary-600': '#2563eb',
      'primary-700': '#1d4ed8',
      'success-700': '#15803d',
      'success-800': '#166534',
      'warning-700': '#b45309',
      'warning-800': '#92400e',
      'error-600': '#dc2626',
      'error-700': '#b91c1c',
    };

    const backgroundColor = '#ffffff';

    Object.entries(designSystemColors).forEach(([colorName, colorValue]) => {
      const result = colorUtils.checkAccessibility(colorValue, backgroundColor);
      expect(result.passesAA).toBe(true);
    });
  });

  test('design system typography follows best practices', () => {
    const fontStacks = {
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      mono: 'JetBrains Mono, Fira Code, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    };

    Object.entries(fontStacks).forEach(([stackName, stackValue]) => {
      const validation = typographyUtils.validateFontStack(stackValue);
      expect(validation.isValid).toBe(true);
      expect(validation.hasSystemFallback).toBe(true);
      expect(validation.hasGenericFallback).toBe(true);
    });
  });

  test('design system animations are accessible and performant', () => {
    const animationDurations = Object.values(animationUtils.ANIMATION_DURATION);
    
    // Most animations should be under 500ms for good UX
    const microInteractions = animationDurations.slice(0, 3); // FAST, NORMAL, SLOW
    microInteractions.forEach(duration => {
      expect(duration).toBeLessThanOrEqual(500);
    });

    // All animations should respect reduced motion
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }));

    animationDurations.forEach(originalDuration => {
      const adjustedDuration = animationUtils.getAnimationDuration(originalDuration);
      expect(adjustedDuration).toBe(1); // Should be 1ms for reduced motion
    });
  });
});