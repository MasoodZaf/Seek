/**
 * Global Setup for E2E Tests
 * 
 * Runs before all E2E tests to prepare the test environment.
 * Sets up test database, starts services, and configures global test state.
 */

const { performance } = require('perf_hooks');

module.exports = async () => {
  console.log('🔧 Setting up E2E test environment...');
  
  const setupStart = performance.now();

  try {
    // Set global test environment variables
    process.env.NODE_ENV = 'test';
    process.env.REACT_APP_API_URL = 'http://localhost:3001';
    process.env.REACT_APP_SOCKET_URL = 'http://localhost:3001';
    process.env.REACT_APP_TEST_MODE = 'true';

    // Initialize test database (mock)
    await initializeTestDatabase();

    // Start mock services
    await startMockServices();

    // Prepare test data
    await prepareTestData();

    // Configure browser environment
    await configureBrowserEnvironment();

    const setupEnd = performance.now();
    const setupDuration = (setupEnd - setupStart).toFixed(2);
    
    console.log(`✅ E2E test environment setup completed in ${setupDuration}ms`);
    
    // Store setup info globally
    global.__E2E_SETUP__ = {
      startTime: setupStart,
      endTime: setupEnd,
      duration: setupDuration,
      services: ['mockApi', 'mockSocket', 'testDatabase'],
      testDataReady: true
    };

  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error);
    throw error;
  }
};

async function initializeTestDatabase() {
  console.log('📊 Initializing test database...');
  
  // Mock database initialization
  global.__TEST_DB__ = {
    users: [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        level: 5,
        xp: 2450,
        streak: 12
      },
      {
        id: 2,
        name: 'Advanced User',
        email: 'advanced@example.com',
        level: 10,
        xp: 5000,
        streak: 25
      }
    ],
    tutorials: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Tutorial ${i + 1}`,
      difficulty: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][i % 4],
      progress: Math.random() * 100,
      estimatedTime: Math.floor(Math.random() * 120) + 30,
      content: `Content for tutorial ${i + 1}`,
      exercises: Array.from({ length: 5 }, (_, j) => ({
        id: j + 1,
        question: `Exercise ${j + 1} for tutorial ${i + 1}`,
        code: `// Exercise ${j + 1}\nconsole.log("Hello World");`
      }))
    })),
    achievements: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Achievement ${i + 1}`,
      description: `Description for achievement ${i + 1}`,
      unlocked: i < 15,
      progress: Math.random() * 100,
      xpReward: Math.floor(Math.random() * 200) + 50
    })),
    codeSnippets: Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Snippet ${i + 1}`,
      code: `function snippet${i + 1}() {\n  return "Snippet ${i + 1}";\n}`,
      language: ['javascript', 'python', 'java', 'cpp', 'typescript'][i % 5],
      shared: Math.random() > 0.5,
      userId: Math.floor(Math.random() * 2) + 1
    }))
  };

  console.log('✅ Test database initialized with mock data');
}

async function startMockServices() {
  console.log('🚀 Starting mock services...');

  // Mock API service
  global.__MOCK_API__ = {
    baseUrl: 'http://localhost:3001',
    endpoints: {
      '/api/auth/login': { method: 'POST', delay: 500 },
      '/api/auth/register': { method: 'POST', delay: 800 },
      '/api/tutorials': { method: 'GET', delay: 300 },
      '/api/tutorials/:id': { method: 'GET', delay: 200 },
      '/api/code/execute': { method: 'POST', delay: 1000 },
      '/api/achievements': { method: 'GET', delay: 250 },
      '/api/snippets': { method: 'GET', delay: 200 },
      '/api/snippets/save': { method: 'POST', delay: 400 }
    },
    responses: {
      success: true,
      errorRate: 0.05, // 5% error rate for testing
      networkDelay: { min: 100, max: 2000 }
    }
  };

  // Mock WebSocket service
  global.__MOCK_SOCKET__ = {
    url: 'http://localhost:3001',
    events: [
      'achievement_unlocked',
      'tutorial_completed',
      'user_progress_updated',
      'code_shared',
      'real_time_notification'
    ],
    connected: true,
    latency: 50
  };

  // Mock code execution service
  global.__MOCK_CODE_EXECUTION__ = {
    languages: ['javascript', 'python', 'java', 'cpp', 'typescript'],
    executionTime: { min: 100, max: 3000 },
    memoryUsage: { min: 1024, max: 10240 }, // KB
    successRate: 0.95 // 95% success rate
  };

  console.log('✅ Mock services started');
}

async function prepareTestData() {
  console.log('📝 Preparing test data...');

  // Test scenarios data
  global.__TEST_SCENARIOS__ = {
    userJourneys: {
      newUser: {
        name: 'New User',
        email: 'newuser@example.com',
        expectedFlow: ['registration', 'onboarding', 'firstTutorial']
      },
      returningUser: {
        name: 'Returning User',
        email: 'returning@example.com',
        progress: { level: 3, xp: 1250, streak: 7 },
        expectedFlow: ['login', 'dashboard', 'continueTutorial']
      },
      powerUser: {
        name: 'Power User',
        email: 'power@example.com',
        progress: { level: 8, xp: 4750, streak: 15 },
        expectedFlow: ['login', 'playground', 'advancedFeatures']
      }
    },
    
    performanceScenarios: {
      lightLoad: { users: 5, duration: 30000 },
      mediumLoad: { users: 15, duration: 60000 },
      heavyLoad: { users: 25, duration: 90000 },
      stressTest: { users: 50, duration: 120000 }
    },

    mobileScenarios: {
      phone: { width: 375, height: 667, userAgent: 'iPhone' },
      tablet: { width: 768, height: 1024, userAgent: 'iPad' },
      landscape: { width: 667, height: 375, userAgent: 'iPhone' }
    }
  };

  // Performance benchmarks
  global.__PERFORMANCE_BENCHMARKS__ = {
    loadTime: { target: 2000, warning: 3000, critical: 5000 },
    interactionTime: { target: 100, warning: 200, critical: 500 },
    frameRate: { target: 60, warning: 45, critical: 30 },
    memoryUsage: { target: 50, warning: 100, critical: 200 }, // MB
    errorRate: { target: 0.01, warning: 0.05, critical: 0.1 } // 1%, 5%, 10%
  };

  console.log('✅ Test data prepared');
}

async function configureBrowserEnvironment() {
  console.log('🌐 Configuring browser environment...');

  // Set up viewport configurations
  global.__VIEWPORT_CONFIGS__ = {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  };

  // Browser feature detection mocks
  global.__BROWSER_FEATURES__ = {
    webGL: true,
    webWorkers: true,
    serviceWorkers: true,
    localStorage: true,
    sessionStorage: true,
    indexedDB: true,
    webSockets: true,
    notifications: true,
    geolocation: true,
    camera: false, // Disabled in test environment
    microphone: false // Disabled in test environment
  };

  // Network conditions for testing
  global.__NETWORK_CONDITIONS__ = {
    fast: { downloadThroughput: 10000000, uploadThroughput: 5000000, latency: 20 },
    slow: { downloadThroughput: 1000000, uploadThroughput: 500000, latency: 200 },
    offline: { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
  };

  console.log('✅ Browser environment configured');
}

// Cleanup function (called by globalTeardown)
global.__E2E_CLEANUP__ = async () => {
  console.log('🧹 Cleaning up E2E test environment...');

  // Clear global test data
  delete global.__TEST_DB__;
  delete global.__MOCK_API__;
  delete global.__MOCK_SOCKET__;
  delete global.__MOCK_CODE_EXECUTION__;
  delete global.__TEST_SCENARIOS__;
  delete global.__PERFORMANCE_BENCHMARKS__;
  delete global.__VIEWPORT_CONFIGS__;
  delete global.__BROWSER_FEATURES__;
  delete global.__NETWORK_CONDITIONS__;

  console.log('✅ E2E test environment cleaned up');
};