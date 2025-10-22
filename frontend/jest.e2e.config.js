/**
 * Jest Configuration for End-to-End Tests
 * 
 * Specialized configuration for running comprehensive E2E tests
 * with extended timeouts and proper test environment setup.
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/__tests__/e2e/**/*.test.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js',
    '<rootDir>/src/__tests__/e2e/setupE2E.js'
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css'
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'json'
  ],
  
  // Test timeout (extended for E2E tests)
  testTimeout: 60000,
  
  // Retry configuration
  retry: 2,
  
  // Coverage configuration
  collectCoverage: false, // Disabled for E2E tests
  
  // Verbose output
  verbose: true,
  
  // Reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './e2e-test-reports',
      filename: 'e2e-test-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'Seek E2E Test Report'
    }]
  ],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/src/__tests__/e2e/globalSetup.js',
  globalTeardown: '<rootDir>/src/__tests__/e2e/globalTeardown.js',
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Mock configuration
  clearMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Performance monitoring
  detectOpenHandles: true,
  detectLeaks: true,
  
  // Parallel execution
  maxWorkers: '50%',
  
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest-e2e'
};