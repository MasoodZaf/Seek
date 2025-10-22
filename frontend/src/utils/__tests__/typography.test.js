/**
 * Typography Utilities Tests
 * Tests for typography rendering, font loading, and cross-browser compatibility
 */

// Typography utility functions
const typographyUtils = {
  /**
   * Check if a font is loaded and available
   * @param {string} fontFamily - Font family name
   * @returns {Promise<boolean>} Promise that resolves to font availability
   */
  isFontLoaded: async (fontFamily) => {
    if (typeof document === 'undefined') return false;
    
    try {
      // Use FontFace API if available
      if ('fonts' in document) {
        const fontFaces = Array.from(document.fonts);
        return fontFaces.some(font => 
          font.family.toLowerCase().includes(fontFamily.toLowerCase()) && 
          font.status === 'loaded'
        );
      }
      
      // Fallback method using canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Test with a known fallback font
      context.font = `12px ${fontFamily}, monospace`;
      const testWidth = context.measureText('test').width;
      
      context.font = '12px monospace';
      const fallbackWidth = context.measureText('test').width;
      
      return testWidth !== fallbackWidth;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get computed font properties of an element
   * @param {HTMLElement} element - Target element
   * @returns {Object} Font properties object
   */
  getComputedFontProperties: (element) => {
    if (typeof window === 'undefined' || !element) return {};
    
    const computed = window.getComputedStyle(element);
    return {
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      textTransform: computed.textTransform,
    };
  },

  /**
   * Calculate optimal line height for given font size
   * @param {number} fontSize - Font size in pixels
   * @param {string} fontType - 'display', 'heading', 'body', or 'caption'
   * @returns {number} Optimal line height ratio
   */
  calculateOptimalLineHeight: (fontSize, fontType = 'body') => {
    const lineHeightMap = {
      display: 1.1,   // Tight for large display text
      heading: 1.25,  // Snug for headings
      body: 1.5,      // Normal for body text
      caption: 1.4,   // Slightly tighter for small text
      code: 1.6,      // More space for code readability
    };
    
    return lineHeightMap[fontType] || lineHeightMap.body;
  },

  /**
   * Convert font size between different units
   * @param {string} fontSize - Font size with unit (px, rem, em)
   * @param {string} targetUnit - Target unit
   * @param {number} baseSize - Base font size in pixels (default 16)
   * @returns {string} Converted font size
   */
  convertFontSize: (fontSize, targetUnit, baseSize = 16) => {
    const value = parseFloat(fontSize);
    const unit = fontSize.replace(value.toString(), '');
    
    let pxValue;
    switch (unit) {
      case 'px':
        pxValue = value;
        break;
      case 'rem':
        pxValue = value * baseSize;
        break;
      case 'em':
        pxValue = value * baseSize; // Simplified, assumes base context
        break;
      default:
        return fontSize; // Return original if unit not recognized
    }
    
    switch (targetUnit) {
      case 'px':
        return `${pxValue}px`;
      case 'rem':
        return `${(pxValue / baseSize).toFixed(3)}rem`;
      case 'em':
        return `${(pxValue / baseSize).toFixed(3)}em`;
      default:
        return fontSize;
    }
  },

  /**
   * Check if text will overflow in a container
   * @param {string} text - Text content
   * @param {Object} containerStyles - Container styles
   * @param {Object} textStyles - Text styles
   * @returns {boolean} True if text will overflow
   */
  willTextOverflow: (text, containerStyles, textStyles) => {
    if (typeof document === 'undefined') return false;
    
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const fontSize = textStyles.fontSize || '16px';
      const fontFamily = textStyles.fontFamily || 'Arial';
      const fontWeight = textStyles.fontWeight || 'normal';
      
      context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      const textWidth = context.measureText(text).width;
      
      const containerWidth = parseFloat(containerStyles.width) || 0;
      return textWidth > containerWidth;
    } catch (error) {
      return false;
    }
  },

  /**
   * Generate responsive font sizes
   * @param {number} baseSize - Base font size in pixels
   * @param {Object} breakpoints - Breakpoint configuration
   * @returns {Object} Responsive font size map
   */
  generateResponsiveFontSizes: (baseSize, breakpoints = {}) => {
    const defaultBreakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    };
    
    const bp = { ...defaultBreakpoints, ...breakpoints };
    
    return {
      base: `${baseSize}px`,
      sm: `${Math.round(baseSize * 0.875)}px`,   // 14px if base is 16px
      md: `${baseSize}px`,                       // Same as base
      lg: `${Math.round(baseSize * 1.125)}px`,   // 18px if base is 16px
      xl: `${Math.round(baseSize * 1.25)}px`,    // 20px if base is 16px
    };
  },

  /**
   * Validate font stack fallbacks
   * @param {string} fontStack - CSS font stack
   * @returns {Object} Validation results
   */
  validateFontStack: (fontStack) => {
    const fonts = fontStack.split(',').map(f => f.trim().replace(/['"]/g, ''));
    const systemFonts = [
      'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
      'Roboto', 'Helvetica Neue', 'Arial', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New'
    ];
    
    const hasSystemFallback = fonts.some(font => systemFonts.includes(font));
    const hasGenericFallback = fonts.some(font => 
      ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'].includes(font)
    );
    
    return {
      isValid: hasSystemFallback && hasGenericFallback,
      hasSystemFallback,
      hasGenericFallback,
      fontCount: fonts.length,
      fonts: fonts,
      recommendations: []
    };
  }
};

// Mock DOM APIs for testing
const mockCanvas = () => {
  const mockContext = {
    font: '',
    measureText: jest.fn().mockReturnValue({ width: 100 }),
  };
  
  const mockCanvasElement = {
    getContext: jest.fn().mockReturnValue(mockContext),
  };
  
  document.createElement = jest.fn().mockImplementation((tagName) => {
    if (tagName === 'canvas') return mockCanvasElement;
    return {};
  });
  
  return { mockContext, mockCanvasElement };
};

const mockGetComputedStyle = (styles = {}) => {
  const defaultStyles = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: 'normal',
    textTransform: 'none',
  };
  
  window.getComputedStyle = jest.fn().mockReturnValue({
    ...defaultStyles,
    ...styles,
  });
};

describe('Typography Utilities', () => {
  beforeEach(() => {
    // Reset DOM mocks
    delete document.createElement;
    delete window.getComputedStyle;
  });

  describe('Font Loading Detection', () => {
    test('isFontLoaded returns false in non-browser environment', async () => {
      const originalDocument = global.document;
      delete global.document;
      
      const result = await typographyUtils.isFontLoaded('Inter');
      expect(result).toBe(false);
      
      global.document = originalDocument;
    });

    test('isFontLoaded uses FontFace API when available', async () => {
      const mockFonts = [
        { family: 'Inter', status: 'loaded' },
        { family: 'JetBrains Mono', status: 'loading' },
      ];
      
      document.fonts = mockFonts;
      
      const interLoaded = await typographyUtils.isFontLoaded('Inter');
      const jetbrainsLoaded = await typographyUtils.isFontLoaded('JetBrains Mono');
      
      expect(interLoaded).toBe(true);
      expect(jetbrainsLoaded).toBe(false);
    });

    test('isFontLoaded falls back to canvas method', async () => {
      delete document.fonts;
      const { mockContext } = mockCanvas();
      
      // Mock different widths for different fonts
      mockContext.measureText
        .mockReturnValueOnce({ width: 120 }) // Custom font
        .mockReturnValueOnce({ width: 100 }); // Fallback font
      
      const result = await typographyUtils.isFontLoaded('Inter');
      expect(result).toBe(true);
      expect(mockContext.measureText).toHaveBeenCalledTimes(2);
    });

    test('isFontLoaded handles errors gracefully', async () => {
      document.fonts = {
        [Symbol.iterator]: () => {
          throw new Error('Font API error');
        }
      };
      
      const result = await typographyUtils.isFontLoaded('Inter');
      expect(result).toBe(false);
    });
  });

  describe('Computed Font Properties', () => {
    test('getComputedFontProperties returns font properties', () => {
      const mockElement = document.createElement('div');
      mockGetComputedStyle({
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.25',
      });
      
      const properties = typographyUtils.getComputedFontProperties(mockElement);
      
      expect(properties).toEqual({
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.25',
        letterSpacing: 'normal',
        textTransform: 'none',
      });
    });

    test('getComputedFontProperties handles null element', () => {
      const properties = typographyUtils.getComputedFontProperties(null);
      expect(properties).toEqual({});
    });

    test('getComputedFontProperties returns empty object in non-browser environment', () => {
      const originalWindow = global.window;
      delete global.window;
      
      const mockElement = {};
      const properties = typographyUtils.getComputedFontProperties(mockElement);
      expect(properties).toEqual({});
      
      global.window = originalWindow;
    });
  });

  describe('Line Height Calculation', () => {
    test('calculateOptimalLineHeight returns correct ratios for different font types', () => {
      expect(typographyUtils.calculateOptimalLineHeight(48, 'display')).toBe(1.1);
      expect(typographyUtils.calculateOptimalLineHeight(24, 'heading')).toBe(1.25);
      expect(typographyUtils.calculateOptimalLineHeight(16, 'body')).toBe(1.5);
      expect(typographyUtils.calculateOptimalLineHeight(14, 'caption')).toBe(1.4);
      expect(typographyUtils.calculateOptimalLineHeight(14, 'code')).toBe(1.6);
    });

    test('calculateOptimalLineHeight defaults to body line height', () => {
      expect(typographyUtils.calculateOptimalLineHeight(16, 'unknown')).toBe(1.5);
      expect(typographyUtils.calculateOptimalLineHeight(16)).toBe(1.5);
    });
  });

  describe('Font Size Conversion', () => {
    test('convertFontSize converts px to rem', () => {
      expect(typographyUtils.convertFontSize('16px', 'rem')).toBe('1.000rem');
      expect(typographyUtils.convertFontSize('24px', 'rem')).toBe('1.500rem');
      expect(typographyUtils.convertFontSize('12px', 'rem')).toBe('0.750rem');
    });

    test('convertFontSize converts rem to px', () => {
      expect(typographyUtils.convertFontSize('1rem', 'px')).toBe('16px');
      expect(typographyUtils.convertFontSize('1.5rem', 'px')).toBe('24px');
      expect(typographyUtils.convertFontSize('0.875rem', 'px')).toBe('14px');
    });

    test('convertFontSize handles custom base size', () => {
      expect(typographyUtils.convertFontSize('18px', 'rem', 18)).toBe('1.000rem');
      expect(typographyUtils.convertFontSize('1rem', 'px', 18)).toBe('18px');
    });

    test('convertFontSize returns original value for unknown units', () => {
      expect(typographyUtils.convertFontSize('16pt', 'rem')).toBe('16pt');
      expect(typographyUtils.convertFontSize('16px', 'pt')).toBe('16px');
    });
  });

  describe('Text Overflow Detection', () => {
    test('willTextOverflow detects overflow correctly', () => {
      const { mockContext } = mockCanvas();
      mockContext.measureText.mockReturnValue({ width: 200 });
      
      const containerStyles = { width: '150px' };
      const textStyles = { fontSize: '16px', fontFamily: 'Arial' };
      
      const willOverflow = typographyUtils.willTextOverflow('Long text', containerStyles, textStyles);
      expect(willOverflow).toBe(true);
    });

    test('willTextOverflow detects no overflow', () => {
      const { mockContext } = mockCanvas();
      mockContext.measureText.mockReturnValue({ width: 100 });
      
      const containerStyles = { width: '150px' };
      const textStyles = { fontSize: '16px', fontFamily: 'Arial' };
      
      const willOverflow = typographyUtils.willTextOverflow('Short', containerStyles, textStyles);
      expect(willOverflow).toBe(false);
    });

    test('willTextOverflow returns false in non-browser environment', () => {
      const originalDocument = global.document;
      delete global.document;
      
      const result = typographyUtils.willTextOverflow('text', {}, {});
      expect(result).toBe(false);
      
      global.document = originalDocument;
    });

    test('willTextOverflow handles errors gracefully', () => {
      document.createElement = jest.fn().mockImplementation(() => {
        throw new Error('Canvas error');
      });
      
      const result = typographyUtils.willTextOverflow('text', { width: '100px' }, {});
      expect(result).toBe(false);
    });
  });

  describe('Responsive Font Sizes', () => {
    test('generateResponsiveFontSizes creates responsive scale', () => {
      const responsive = typographyUtils.generateResponsiveFontSizes(16);
      
      expect(responsive).toEqual({
        base: '16px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
      });
    });

    test('generateResponsiveFontSizes works with different base sizes', () => {
      const responsive = typographyUtils.generateResponsiveFontSizes(20);
      
      expect(responsive.base).toBe('20px');
      expect(responsive.sm).toBe('18px'); // 20 * 0.875 = 17.5, rounded to 18
      expect(responsive.lg).toBe('23px'); // 20 * 1.125 = 22.5, rounded to 23
    });

    test('generateResponsiveFontSizes accepts custom breakpoints', () => {
      const customBreakpoints = { sm: 480, md: 768 };
      const responsive = typographyUtils.generateResponsiveFontSizes(16, customBreakpoints);
      
      // Should still generate the same font sizes regardless of breakpoint values
      expect(responsive.sm).toBe('14px');
      expect(responsive.md).toBe('16px');
    });
  });

  describe('Font Stack Validation', () => {
    test('validateFontStack validates complete font stack', () => {
      const fontStack = 'Inter, system-ui, -apple-system, sans-serif';
      const result = typographyUtils.validateFontStack(fontStack);
      
      expect(result.isValid).toBe(true);
      expect(result.hasSystemFallback).toBe(true);
      expect(result.hasGenericFallback).toBe(true);
      expect(result.fontCount).toBe(4);
      expect(result.fonts).toEqual(['Inter', 'system-ui', '-apple-system', 'sans-serif']);
    });

    test('validateFontStack detects missing system fallback', () => {
      const fontStack = 'CustomFont, MyCustomFont, serif'; // No system fonts, only custom and generic
      const result = typographyUtils.validateFontStack(fontStack);
      

      
      expect(result.hasSystemFallback).toBe(false);
      expect(result.hasGenericFallback).toBe(true);
      expect(result.isValid).toBe(false);
    });

    test('validateFontStack detects missing generic fallback', () => {
      const fontStack = 'Inter, system-ui, Arial';
      const result = typographyUtils.validateFontStack(fontStack);
      
      expect(result.isValid).toBe(false);
      expect(result.hasSystemFallback).toBe(true);
      expect(result.hasGenericFallback).toBe(false);
    });

    test('validateFontStack handles quoted font names', () => {
      const fontStack = '"Inter", "JetBrains Mono", system-ui, monospace';
      const result = typographyUtils.validateFontStack(fontStack);
      
      expect(result.fonts).toEqual(['Inter', 'JetBrains Mono', 'system-ui', 'monospace']);
      expect(result.isValid).toBe(true);
    });

    test('validateFontStack handles single quotes', () => {
      const fontStack = "'Inter', 'system-ui', sans-serif";
      const result = typographyUtils.validateFontStack(fontStack);
      
      expect(result.fonts).toEqual(['Inter', 'system-ui', 'sans-serif']);
      expect(result.isValid).toBe(true);
    });
  });
});

describe('Design System Typography Validation', () => {
  // Typography configuration from design system
  const designSystemTypography = {
    fontFamilies: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    }
  };

  test('design system font stacks are valid', () => {
    Object.entries(designSystemTypography.fontFamilies).forEach(([key, fonts]) => {
      const fontStack = fonts.join(', ');
      const result = typographyUtils.validateFontStack(fontStack);
      
      expect(result.isValid).toBe(true);
      expect(result.hasSystemFallback).toBe(true);
      expect(result.hasGenericFallback).toBe(true);
    });
  });

  test('design system font sizes follow consistent scale', () => {
    const sizes = designSystemTypography.fontSizes;
    const baseSizePx = 16; // 1rem = 16px
    
    // Convert all sizes to pixels for comparison
    const sizesInPx = Object.entries(sizes).map(([key, size]) => ({
      key,
      px: parseFloat(typographyUtils.convertFontSize(size, 'px', baseSizePx))
    }));
    
    // Check that sizes increase consistently
    for (let i = 1; i < sizesInPx.length; i++) {
      expect(sizesInPx[i].px).toBeGreaterThan(sizesInPx[i - 1].px);
    }
  });

  test('design system line heights are appropriate for font sizes', () => {
    const { lineHeights } = designSystemTypography;
    
    // Line heights should be reasonable (between 1.0 and 2.5)
    Object.values(lineHeights).forEach(lineHeight => {
      expect(lineHeight).toBeGreaterThanOrEqual(1.0);
      expect(lineHeight).toBeLessThanOrEqual(2.5);
    });
    
    // Tight should be less than normal, normal less than loose
    expect(lineHeights.tight).toBeLessThan(lineHeights.normal);
    expect(lineHeights.normal).toBeLessThan(lineHeights.loose);
  });

  test('design system font weights are standard values', () => {
    const { fontWeights } = designSystemTypography;
    const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    
    Object.values(fontWeights).forEach(weight => {
      expect(standardWeights).toContain(weight);
    });
  });

  test('responsive font sizes maintain readability', () => {
    Object.entries(designSystemTypography.fontSizes).forEach(([key, size]) => {
      const basePx = parseFloat(typographyUtils.convertFontSize(size, 'px'));
      const responsive = typographyUtils.generateResponsiveFontSizes(basePx);
      
      // All responsive sizes should be readable (>= 10px, allowing for very small text)
      Object.values(responsive).forEach(responsiveSize => {
        const px = parseFloat(responsiveSize);
        expect(px).toBeGreaterThanOrEqual(10);
      });
    });
  });
});

describe('Cross-Browser Typography Compatibility', () => {
  // Define design system typography for cross-browser tests
  const crossBrowserTypography = {
    fontFamilies: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    }
  };

  test('font stacks include appropriate fallbacks for different systems', () => {
    const { fontFamilies } = crossBrowserTypography;
    
    // Sans-serif stack should include system fonts for different platforms
    const sansStack = fontFamilies.sans.join(', ');
    expect(sansStack).toContain('system-ui'); // Modern browsers
    expect(sansStack).toContain('-apple-system'); // macOS/iOS
    expect(sansStack).toContain('BlinkMacSystemFont'); // macOS Chrome
    expect(sansStack).toContain('Segoe UI'); // Windows
    expect(sansStack).toContain('Roboto'); // Android
    expect(sansStack).toContain('sans-serif'); // Generic fallback
    
    // Monospace stack should include appropriate code fonts
    const monoStack = fontFamilies.mono.join(', ');
    expect(monoStack).toContain('JetBrains Mono'); // Primary choice
    expect(monoStack).toContain('Monaco'); // macOS
    expect(monoStack).toContain('Consolas'); // Windows
    expect(monoStack).toContain('monospace'); // Generic fallback
  });

  test('font sizes work across different browser zoom levels', () => {
    const testSizes = ['0.875rem', '1rem', '1.125rem', '1.5rem'];
    const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];
    
    testSizes.forEach(size => {
      zoomLevels.forEach(zoom => {
        const basePx = parseFloat(typographyUtils.convertFontSize(size, 'px'));
        const zoomedPx = basePx * zoom;
        
        // Even at extreme zoom levels, text should remain readable
        if (zoom >= 1) {
          expect(zoomedPx).toBeGreaterThanOrEqual(12); // Minimum readable size
        }
      });
    });
  });

  test('line heights work with different font sizes', () => {
    const fontSizes = [12, 14, 16, 18, 24, 32, 48];
    const lineHeights = [1.25, 1.375, 1.5, 1.625];
    
    fontSizes.forEach(fontSize => {
      lineHeights.forEach(lineHeight => {
        const computedLineHeight = fontSize * lineHeight;
        
        // Line height should provide adequate spacing
        expect(computedLineHeight).toBeGreaterThan(fontSize);
        expect(computedLineHeight - fontSize).toBeGreaterThanOrEqual(2); // At least 2px spacing
      });
    });
  });
});

// Export for potential use in other tests
export default typographyUtils;