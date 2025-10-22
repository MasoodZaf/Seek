module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/playground',
        'http://localhost:3000/tutorials',
        'http://localhost:3000/profile'
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'webpack compiled',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: [
          'canonical',
          'maskable-icon',
          'offline-start-url',
          'service-worker'
        ]
      }
    },
    assert: {
      assertions: {
        // Performance assertions
        'categories:performance': ['error', { minScore: 0.8 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Accessibility assertions
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'list': 'error',
        'meta-viewport': 'error',
        
        // Best practices assertions
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'uses-https': 'error',
        'uses-http2': 'off', // May not be available in development
        'no-vulnerable-libraries': 'error',
        
        // SEO assertions
        'categories:seo': ['error', { minScore: 0.8 }],
        'document-title': 'error',
        'meta-description': 'error',
        'robots-txt': 'off' // May not be needed for SPA
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};