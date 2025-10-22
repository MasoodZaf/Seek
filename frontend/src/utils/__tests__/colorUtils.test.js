/**
 * Color Utility Functions Tests
 * Tests for color manipulation, contrast calculations, and accessibility compliance
 */

// Color utility functions to be tested
const colorUtils = {
  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color string
   * @returns {Object} RGB object with r, g, b properties
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Convert RGB to hex
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {string} Hex color string
   */
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * Calculate relative luminance of a color
   * @param {Object} rgb - RGB object with r, g, b properties
   * @returns {number} Relative luminance value
   */
  getLuminance: (rgb) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex)
   * @param {string} color2 - Second color (hex)
   * @returns {number} Contrast ratio
   */
  getContrastRatio: (color1, color2) => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = colorUtils.getLuminance(rgb1);
    const lum2 = colorUtils.getLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if color combination meets WCAG AA standards
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @param {string} level - 'AA' or 'AAA'
   * @returns {Object} Accessibility compliance results
   */
  checkAccessibility: (foreground, background, level = 'AA') => {
    const contrastRatio = colorUtils.getContrastRatio(foreground, background);
    const aaThreshold = 4.5;
    const aaaThreshold = 7;
    const aaLargeThreshold = 3;
    const aaaLargeThreshold = 4.5;
    
    return {
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      passesAA: contrastRatio >= aaThreshold,
      passesAAA: contrastRatio >= aaaThreshold,
      passesAALarge: contrastRatio >= aaLargeThreshold,
      passesAAALarge: contrastRatio >= aaaLargeThreshold,
      level: level,
      meetsRequirement: level === 'AA' ? contrastRatio >= aaThreshold : contrastRatio >= aaaThreshold
    };
  },

  /**
   * Lighten a color by a percentage
   * @param {string} hex - Hex color string
   * @param {number} percent - Percentage to lighten (0-100)
   * @returns {string} Lightened hex color
   */
  lighten: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = percent / 100;
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);
    
    return colorUtils.rgbToHex(r, g, b);
  },

  /**
   * Darken a color by a percentage
   * @param {string} hex - Hex color string
   * @param {number} percent - Percentage to darken (0-100)
   * @returns {string} Darkened hex color
   */
  darken: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = 1 - (percent / 100);
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    
    return colorUtils.rgbToHex(r, g, b);
  }
};

describe('Color Utility Functions', () => {
  describe('hexToRgb', () => {
    test('converts valid hex colors to RGB', () => {
      expect(colorUtils.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(colorUtils.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(colorUtils.hexToRgb('#2563eb')).toEqual({ r: 37, g: 99, b: 235 });
      expect(colorUtils.hexToRgb('2563eb')).toEqual({ r: 37, g: 99, b: 235 });
    });

    test('returns null for invalid hex colors', () => {
      expect(colorUtils.hexToRgb('invalid')).toBeNull();
      expect(colorUtils.hexToRgb('#gggggg')).toBeNull();
      expect(colorUtils.hexToRgb('#12345')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    test('converts RGB values to hex', () => {
      expect(colorUtils.rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(colorUtils.rgbToHex(0, 0, 0)).toBe('#000000');
      expect(colorUtils.rgbToHex(37, 99, 235)).toBe('#2563eb');
    });

    test('handles edge cases', () => {
      expect(colorUtils.rgbToHex(0, 0, 0)).toBe('#000000');
      expect(colorUtils.rgbToHex(255, 255, 255)).toBe('#ffffff');
    });
  });

  describe('getLuminance', () => {
    test('calculates correct luminance values', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      const blue = { r: 37, g: 99, b: 235 };

      expect(colorUtils.getLuminance(white)).toBeCloseTo(1, 2);
      expect(colorUtils.getLuminance(black)).toBeCloseTo(0, 2);
      expect(colorUtils.getLuminance(blue)).toBeGreaterThan(0);
      expect(colorUtils.getLuminance(blue)).toBeLessThan(1);
    });
  });

  describe('getContrastRatio', () => {
    test('calculates correct contrast ratios', () => {
      // White on black should have maximum contrast
      expect(colorUtils.getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
      
      // Same colors should have minimum contrast
      expect(colorUtils.getContrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 0);
      
      // Primary blue on white should have good contrast
      const blueWhiteContrast = colorUtils.getContrastRatio('#2563eb', '#ffffff');
      expect(blueWhiteContrast).toBeGreaterThan(4.5); // Should pass AA
    });

    test('handles invalid colors gracefully', () => {
      expect(colorUtils.getContrastRatio('invalid', '#ffffff')).toBe(0);
      expect(colorUtils.getContrastRatio('#ffffff', 'invalid')).toBe(0);
    });
  });

  describe('checkAccessibility', () => {
    test('correctly identifies WCAG AA compliance', () => {
      const result = colorUtils.checkAccessibility('#2563eb', '#ffffff', 'AA');
      
      expect(result).toHaveProperty('contrastRatio');
      expect(result).toHaveProperty('passesAA');
      expect(result).toHaveProperty('passesAAA');
      expect(result).toHaveProperty('meetsRequirement');
      expect(typeof result.contrastRatio).toBe('number');
      expect(typeof result.passesAA).toBe('boolean');
    });

    test('validates design system color combinations', () => {
      // Test primary colors from design system (using accessible versions)
      const primaryOnWhite = colorUtils.checkAccessibility('#2563eb', '#ffffff');
      const successOnWhite = colorUtils.checkAccessibility('#15803d', '#ffffff'); // Using darker green (700)
      const errorOnWhite = colorUtils.checkAccessibility('#dc2626', '#ffffff'); // Using darker red
      
      expect(primaryOnWhite.passesAA).toBe(true);
      expect(successOnWhite.passesAA).toBe(true);
      expect(errorOnWhite.passesAA).toBe(true);
    });

    test('identifies failing combinations', () => {
      // Light gray on white should fail
      const result = colorUtils.checkAccessibility('#f1f5f9', '#ffffff');
      expect(result.passesAA).toBe(false);
    });
  });

  describe('lighten', () => {
    test('lightens colors correctly', () => {
      const original = '#2563eb';
      const lightened = colorUtils.lighten(original, 20);
      
      expect(lightened).not.toBe(original);
      
      // Lightened color should have higher RGB values
      const originalRgb = colorUtils.hexToRgb(original);
      const lightenedRgb = colorUtils.hexToRgb(lightened);
      
      expect(lightenedRgb.r).toBeGreaterThanOrEqual(originalRgb.r);
      expect(lightenedRgb.g).toBeGreaterThanOrEqual(originalRgb.g);
      expect(lightenedRgb.b).toBeGreaterThanOrEqual(originalRgb.b);
    });

    test('handles edge cases', () => {
      expect(colorUtils.lighten('#ffffff', 50)).toBe('#ffffff'); // Already white
      expect(colorUtils.lighten('invalid', 50)).toBe('invalid'); // Invalid input
    });
  });

  describe('darken', () => {
    test('darkens colors correctly', () => {
      const original = '#2563eb';
      const darkened = colorUtils.darken(original, 20);
      
      expect(darkened).not.toBe(original);
      
      // Darkened color should have lower RGB values
      const originalRgb = colorUtils.hexToRgb(original);
      const darkenedRgb = colorUtils.hexToRgb(darkened);
      
      expect(darkenedRgb.r).toBeLessThanOrEqual(originalRgb.r);
      expect(darkenedRgb.g).toBeLessThanOrEqual(originalRgb.g);
      expect(darkenedRgb.b).toBeLessThanOrEqual(originalRgb.b);
    });

    test('handles edge cases', () => {
      expect(colorUtils.darken('#000000', 50)).toBe('#000000'); // Already black
      expect(colorUtils.darken('invalid', 50)).toBe('invalid'); // Invalid input
    });
  });
});

describe('Design System Color Palette Validation', () => {
  // Design system colors from tailwind.config.js (using accessible versions)
  const designSystemColors = {
    primary: {
      600: '#2563eb', // This passes AA
      700: '#1d4ed8',
      800: '#1e40af',
    },
    success: {
      700: '#15803d', // This passes AA
      800: '#166534',
    },
    warning: {
      700: '#b45309', // This passes AA
      800: '#92400e',
    },
    error: {
      600: '#dc2626', // This passes AA
      700: '#b91c1c',
    },
    background: {
      default: '#ffffff',
      secondary: '#f8fafc',
    },
    foreground: {
      default: '#0f172a',
      secondary: '#475569',
    }
  };

  test('primary colors meet accessibility standards on white background', () => {
    Object.values(designSystemColors.primary).forEach(color => {
      const result = colorUtils.checkAccessibility(color, designSystemColors.background.default);
      expect(result.passesAA).toBe(true);
    });
  });

  test('semantic colors meet accessibility standards', () => {
    const semanticColors = [
      ...Object.values(designSystemColors.success),
      ...Object.values(designSystemColors.warning),
      ...Object.values(designSystemColors.error)
    ];

    semanticColors.forEach(color => {
      const result = colorUtils.checkAccessibility(color, designSystemColors.background.default);
      expect(result.passesAA).toBe(true);
    });
  });

  test('foreground colors have sufficient contrast on backgrounds', () => {
    const foregroundResult = colorUtils.checkAccessibility(
      designSystemColors.foreground.default,
      designSystemColors.background.default
    );
    expect(foregroundResult.passesAAA).toBe(true);

    const secondaryResult = colorUtils.checkAccessibility(
      designSystemColors.foreground.secondary,
      designSystemColors.background.default
    );
    expect(secondaryResult.passesAA).toBe(true);
  });

  test('color palette maintains consistent contrast ratios', () => {
    const contrastRatios = [];
    
    Object.values(designSystemColors.primary).forEach(color => {
      const ratio = colorUtils.getContrastRatio(color, designSystemColors.background.default);
      contrastRatios.push(ratio);
    });

    // Darker shades should have higher contrast ratios
    expect(contrastRatios[0]).toBeLessThan(contrastRatios[1]); // 500 < 600
    expect(contrastRatios[1]).toBeLessThan(contrastRatios[2]); // 600 < 700
  });
});

// Export for potential use in other tests
export default colorUtils;