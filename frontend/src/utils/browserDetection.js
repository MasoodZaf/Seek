/**
 * Browser Detection and Feature Support Utilities
 * Provides browser detection and progressive enhancement features
 */

/**
 * Detect the current browser
 * @returns {Object} Browser information
 */
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;
  
  let browser = {
    name: 'unknown',
    version: 'unknown',
    engine: 'unknown',
    mobile: false,
    tablet: false
  };

  // Detect mobile/tablet
  browser.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  browser.tablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

  // Detect browser
  if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
    browser.name = 'chrome';
    browser.engine = 'blink';
    const match = userAgent.match(/Chrome\/(\d+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (/Firefox/.test(userAgent)) {
    browser.name = 'firefox';
    browser.engine = 'gecko';
    const match = userAgent.match(/Firefox\/(\d+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (/Safari/.test(userAgent) && /Apple Computer/.test(vendor)) {
    browser.name = 'safari';
    browser.engine = 'webkit';
    const match = userAgent.match(/Version\/(\d+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (/Edge/.test(userAgent)) {
    browser.name = 'edge';
    browser.engine = 'blink';
    const match = userAgent.match(/Edge\/(\d+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (/MSIE|Trident/.test(userAgent)) {
    browser.name = 'ie';
    browser.engine = 'trident';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    browser.version = match ? match[1] : 'unknown';
  }

  return browser;
};

/**
 * Check if a CSS feature is supported
 * @param {string} property - CSS property to check
 * @param {string} value - CSS value to check
 * @returns {boolean} Whether the feature is supported
 */
export const supportsCSSFeature = (property, value) => {
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports(property, value);
  }
  
  // Fallback for older browsers
  const element = document.createElement('div');
  element.style[property] = value;
  return element.style[property] === value;
};

/**
 * Check for various browser capabilities
 * @returns {Object} Capability flags
 */
export const getBrowserCapabilities = () => {
  const capabilities = {
    // CSS Features
    cssGrid: supportsCSSFeature('display', 'grid'),
    cssFlexbox: supportsCSSFeature('display', 'flex'),
    cssCustomProperties: supportsCSSFeature('color', 'var(--test)'),
    cssBackdropFilter: supportsCSSFeature('backdrop-filter', 'blur(10px)'),
    cssTransforms: supportsCSSFeature('transform', 'translateX(10px)'),
    cssTransitions: supportsCSSFeature('transition', 'all 0.3s'),
    cssAnimations: supportsCSSFeature('animation', 'test 1s'),
    cssStickyPosition: supportsCSSFeature('position', 'sticky'),
    cssObjectFit: supportsCSSFeature('object-fit', 'cover'),
    
    // JavaScript Features
    es6Modules: typeof Symbol !== 'undefined',
    asyncAwait: (async () => {})().constructor === Promise,
    fetch: typeof fetch !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    resizeObserver: typeof ResizeObserver !== 'undefined',
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })(),
    
    // Web APIs
    serviceWorker: 'serviceWorker' in navigator,
    webWorkers: typeof Worker !== 'undefined',
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    
    // Media Features
    webP: (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })(),
    
    // Touch and Input
    touchEvents: 'ontouchstart' in window,
    pointerEvents: 'onpointerdown' in window,
    
    // Accessibility
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  };
  
  return capabilities;
};

/**
 * Add browser-specific classes to document
 */
export const addBrowserClasses = () => {
  const browser = detectBrowser();
  const capabilities = getBrowserCapabilities();
  const html = document.documentElement;
  
  // Add browser classes
  html.classList.add(`browser-${browser.name}`);
  html.classList.add(`engine-${browser.engine}`);
  html.classList.add(`version-${browser.version}`);
  
  if (browser.mobile) html.classList.add('mobile');
  if (browser.tablet) html.classList.add('tablet');
  
  // Add capability classes
  Object.entries(capabilities).forEach(([feature, supported]) => {
    html.classList.add(supported ? `supports-${feature}` : `no-${feature}`);
  });
  
  // Remove no-js class if JavaScript is enabled
  html.classList.remove('no-js');
  html.classList.add('js');
};

/**
 * Load polyfills based on browser capabilities
 */
export const loadPolyfills = async () => {
  const capabilities = getBrowserCapabilities();
  const polyfills = [];

  // CSS Grid is well supported in modern browsers
  // Polyfill removed as it's no longer maintained

  // Intersection Observer polyfill
  if (!capabilities.intersectionObserver && typeof IntersectionObserver === 'undefined') {
    // Intersection Observer is now widely supported, fallback gracefully
    console.warn('IntersectionObserver not supported');
  }

  // Resize Observer polyfill
  if (!capabilities.resizeObserver && typeof ResizeObserver === 'undefined') {
    // ResizeObserver is now widely supported, fallback gracefully
    console.warn('ResizeObserver not supported');
  }

  // Focus visible is handled by modern CSS
  if (!capabilities.cssCustomProperties) {
    // Modern browsers support CSS custom properties
  }
  
  // Load all polyfills
  if (polyfills.length > 0) {
    try {
      await Promise.all(polyfills);
      console.log('Polyfills loaded successfully');
    } catch (error) {
      console.warn('Some polyfills failed to load:', error);
    }
  }
};

/**
 * Get browser-specific optimizations
 * @returns {Object} Optimization settings
 */
export const getBrowserOptimizations = () => {
  const browser = detectBrowser();
  const capabilities = getBrowserCapabilities();
  
  const optimizations = {
    // Animation settings
    animations: {
      enabled: !capabilities.reducedMotion,
      duration: capabilities.reducedMotion ? 0 : 300,
      easing: capabilities.cssTransitions ? 'ease-in-out' : 'linear'
    },
    
    // Image settings
    images: {
      format: capabilities.webP ? 'webp' : 'jpg',
      lazy: capabilities.intersectionObserver,
      responsive: true
    },
    
    // Performance settings
    performance: {
      prefetch: browser.name === 'chrome' && parseInt(browser.version) >= 85,
      preload: capabilities.fetch,
      serviceWorker: capabilities.serviceWorker && !browser.mobile
    },
    
    // Layout settings
    layout: {
      grid: capabilities.cssGrid,
      flexbox: capabilities.cssFlexbox,
      sticky: capabilities.cssStickyPosition
    }
  };
  
  return optimizations;
};

/**
 * Initialize browser detection and enhancements
 */
export const initializeBrowserSupport = () => {
  // Add browser classes
  addBrowserClasses();
  
  // Load polyfills
  loadPolyfills();
  
  // Log browser information for debugging
  if (process.env.NODE_ENV === 'development') {
    const browser = detectBrowser();
    const capabilities = getBrowserCapabilities();
    console.log('Browser Detection:', browser);
    console.log('Browser Capabilities:', capabilities);
  }
  
  return {
    browser: detectBrowser(),
    capabilities: getBrowserCapabilities(),
    optimizations: getBrowserOptimizations()
  };
};