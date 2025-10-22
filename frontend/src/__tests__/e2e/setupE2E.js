/**
 * End-to-End Test Setup
 * 
 * Global setup and configuration for E2E tests.
 * Includes mocks, utilities, and test environment preparation.
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 10000,
  computedStyleSupportsPseudoElements: true
});

// Mock browser APIs that might not be available in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock Web APIs
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

// Mock geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};

// Mock clipboard API
global.navigator.clipboard = {
  writeText: jest.fn().mockResolvedValue(),
  readText: jest.fn().mockResolvedValue(''),
  write: jest.fn().mockResolvedValue(),
  read: jest.fn().mockResolvedValue()
};

// Mock performance API
global.performance.mark = jest.fn();
global.performance.measure = jest.fn();
global.performance.getEntriesByName = jest.fn().mockReturnValue([]);
global.performance.getEntriesByType = jest.fn().mockReturnValue([]);

// Mock memory API for performance testing
global.performance.memory = {
  usedJSHeapSize: 50 * 1024 * 1024, // 50MB
  totalJSHeapSize: 100 * 1024 * 1024, // 100MB
  jsHeapSizeLimit: 2 * 1024 * 1024 * 1024 // 2GB
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation(cb => {
  return setTimeout(cb, 16);
});

global.cancelAnimationFrame = jest.fn().mockImplementation(id => {
  clearTimeout(id);
});

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, language, theme, options, ...props }) => {
    return React.createElement('div', {
      'data-testid': 'monaco-editor',
      'data-language': language,
      'data-theme': theme,
      className: 'monaco-editor professional-theme',
      ...props
    }, [
      React.createElement('textarea', {
        key: 'code-input',
        'data-testid': 'code-input',
        value: value || '',
        onChange: (e) => onChange && onChange(e.target.value),
        className: 'code-editor-textarea'
      })
    ]);
  }
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  useParams: () => ({})
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn().mockReturnValue({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connected: true
  })
}));

// Global test utilities
global.testUtils = {
  // Wait for animations to complete
  waitForAnimation: (element, animationName) => {
    return new Promise(resolve => {
      const handleAnimationEnd = (event) => {
        if (event.animationName === animationName) {
          element.removeEventListener('animationend', handleAnimationEnd);
          resolve();
        }
      };
      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  // Simulate network delay
  simulateNetworkDelay: (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Mock API response
  mockApiResponse: (data, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data, status: 200 }), delay);
    });
  },

  // Mock API error
  mockApiError: (error, delay = 0) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error(error)), delay);
    });
  },

  // Generate test data
  generateTestData: (type, count = 10) => {
    const generators = {
      tutorials: (n) => Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        title: `Tutorial ${i + 1}`,
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
        progress: Math.random() * 100,
        estimatedTime: Math.floor(Math.random() * 120) + 30
      })),
      
      achievements: (n) => Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        name: `Achievement ${i + 1}`,
        description: `Description for achievement ${i + 1}`,
        unlocked: i < n / 2,
        progress: Math.random() * 100
      })),
      
      codeSnippets: (n) => Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        title: `Snippet ${i + 1}`,
        code: `console.log("Snippet ${i + 1}");`,
        language: ['javascript', 'python', 'java'][i % 3],
        shared: Math.random() > 0.5
      }))
    };

    return generators[type] ? generators[type](count) : [];
  },

  // Performance measurement utilities
  measurePerformance: (fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    return {
      result,
      duration: end - start,
      memory: global.performance.memory ? {
        used: global.performance.memory.usedJSHeapSize,
        total: global.performance.memory.totalJSHeapSize
      } : null
    };
  },

  // Accessibility testing utilities
  checkAccessibility: async (container) => {
    const { axe } = await import('axe-core');
    const results = await axe.run(container);
    return results;
  }
};

// Console override for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Filter out known React warnings in tests
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Warning: ReactDOM.render is no longer supported') ||
     message.includes('Warning: componentWillReceiveProps has been renamed'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  // Filter out known warnings
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('Warning: ')
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset any global state
  if (global.testState) {
    global.testState = {};
  }
  
  // Clear timers
  jest.clearAllTimers();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export test utilities for use in test files
export { global as testUtils };