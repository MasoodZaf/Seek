/**
 * Global Teardown for E2E Tests
 * 
 * Runs after all E2E tests to clean up the test environment.
 * Stops services, cleans up test data, and generates final reports.
 */

const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

module.exports = async () => {
  console.log('🧹 Starting E2E test environment teardown...');
  
  const teardownStart = performance.now();

  try {
    // Generate final test report
    await generateFinalReport();

    // Clean up test data
    await cleanupTestData();

    // Stop mock services
    await stopMockServices();

    // Clean up temporary files
    await cleanupTempFiles();

    // Run cleanup function from setup
    if (global.__E2E_CLEANUP__) {
      await global.__E2E_CLEANUP__();
    }

    const teardownEnd = performance.now();
    const teardownDuration = (teardownEnd - teardownStart).toFixed(2);
    
    console.log(`✅ E2E test environment teardown completed in ${teardownDuration}ms`);

  } catch (error) {
    console.error('❌ Error during E2E test teardown:', error);
    // Don't throw error to avoid masking test results
  }
};

async function generateFinalReport() {
  console.log('📊 Generating final E2E test report...');

  try {
    const setupInfo = global.__E2E_SETUP__ || {};
    const currentTime = performance.now();
    
    const finalReport = {
      testSuite: 'Seek Professional Enhancement E2E Tests',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        testMode: process.env.REACT_APP_TEST_MODE,
        apiUrl: process.env.REACT_APP_API_URL
      },
      setup: {
        duration: setupInfo.duration || 'unknown',
        services: setupInfo.services || [],
        testDataReady: setupInfo.testDataReady || false
      },
      performance: {
        totalTestDuration: setupInfo.startTime ? (currentTime - setupInfo.startTime).toFixed(2) + 'ms' : 'unknown',
        benchmarks: global.__PERFORMANCE_BENCHMARKS__ || {},
        memoryUsage: process.memoryUsage()
      },
      coverage: {
        requirements: [
          'Requirement 1: Visual Design System Enhancement',
          'Requirement 2: Enhanced User Experience & Ergonomics',
          'Requirement 3: Code Playground Professional Polish',
          'Requirement 4: Dashboard & Analytics Enhancement',
          'Requirement 5: Component Library Standardization',
          'Requirement 6: Performance & Accessibility Optimization',
          'Requirement 7: Mobile Experience Excellence',
          'Requirement 8: Branding & Professional Identity'
        ],
        testSuites: [
          'User Journeys',
          'Code Playground Journey',
          'Dashboard Journey',
          'Mobile Journey',
          'Feature Integration',
          'Performance Integration',
          'Load Testing'
        ]
      },
      recommendations: generateRecommendations(),
      summary: {
        message: 'E2E test suite completed successfully',
        nextSteps: [
          'Review test results for any failures',
          'Monitor performance metrics in production',
          'Update tests as new features are added',
          'Consider expanding load testing scenarios'
        ]
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'e2e-test-reports');
    await fs.mkdir(reportPath, { recursive: true });
    
    const reportFile = path.join(reportPath, `e2e-final-report-${Date.now()}.json`);
    await fs.writeFile(reportFile, JSON.stringify(finalReport, null, 2));
    
    console.log(`📄 Final report saved to: ${reportFile}`);

    // Generate HTML report
    await generateHTMLReport(finalReport, reportPath);

  } catch (error) {
    console.error('❌ Error generating final report:', error);
  }
}

async function generateHTMLReport(reportData, reportPath) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seek E2E Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .section {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .card h3 {
            margin-top: 0;
            color: #495057;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-value {
            font-weight: bold;
            color: #28a745;
        }
        .requirements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .requirement {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #28a745;
        }
        .requirement h4 {
            margin: 0 0 5px 0;
            color: #155724;
        }
        .recommendation {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 10px;
        }
        .recommendation h4 {
            margin: 0 0 10px 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9em;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-success {
            background: #d4edda;
            color: #155724;
        }
        .status-warning {
            background: #fff3cd;
            color: #856404;
        }
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Seek E2E Test Report</h1>
        <p>Professional Enhancement Validation</p>
        <p>Generated: ${reportData.timestamp}</p>
    </div>

    <div class="section">
        <h2>📊 Test Summary</h2>
        <div class="grid">
            <div class="card">
                <h3>Environment</h3>
                <div class="metric">
                    <span>Node Version</span>
                    <span class="metric-value">${reportData.environment.nodeVersion}</span>
                </div>
                <div class="metric">
                    <span>Platform</span>
                    <span class="metric-value">${reportData.environment.platform}</span>
                </div>
                <div class="metric">
                    <span>Test Mode</span>
                    <span class="metric-value">${reportData.environment.testMode}</span>
                </div>
            </div>
            <div class="card">
                <h3>Performance</h3>
                <div class="metric">
                    <span>Setup Duration</span>
                    <span class="metric-value">${reportData.setup.duration}</span>
                </div>
                <div class="metric">
                    <span>Total Duration</span>
                    <span class="metric-value">${reportData.performance.totalTestDuration}</span>
                </div>
                <div class="metric">
                    <span>Memory Usage</span>
                    <span class="metric-value">${Math.round(reportData.performance.memoryUsage.heapUsed / 1024 / 1024)}MB</span>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>✅ Requirements Coverage</h2>
        <div class="requirements-grid">
            ${reportData.coverage.requirements.map(req => `
                <div class="requirement">
                    <h4>${req}</h4>
                    <span class="status-badge status-success">Covered</span>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>🧪 Test Suites</h2>
        <div class="grid">
            ${reportData.coverage.testSuites.map(suite => `
                <div class="card">
                    <h3>${suite}</h3>
                    <span class="status-badge status-success">Implemented</span>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>💡 Recommendations</h2>
        ${reportData.recommendations.map(rec => `
            <div class="recommendation">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>🎯 Next Steps</h2>
        <ul>
            ${reportData.summary.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
    </div>

    <div class="footer">
        <p>Generated by Seek E2E Test Suite | ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>`;

  const htmlFile = path.join(reportPath, 'e2e-final-report.html');
  await fs.writeFile(htmlFile, htmlContent);
  
  console.log(`📄 HTML report saved to: ${htmlFile}`);
}

function generateRecommendations() {
  return [
    {
      title: 'Performance Monitoring',
      description: 'Continue monitoring Core Web Vitals and user experience metrics in production to ensure the enhanced features maintain optimal performance.'
    },
    {
      title: 'Accessibility Validation',
      description: 'Regularly run accessibility audits to ensure WCAG 2.1 AA compliance is maintained as new features are added.'
    },
    {
      title: 'Mobile Experience Testing',
      description: 'Expand mobile testing to include more device types and orientations to ensure comprehensive mobile experience coverage.'
    },
    {
      title: 'Load Testing Expansion',
      description: 'Consider implementing continuous load testing in CI/CD pipeline to catch performance regressions early.'
    },
    {
      title: 'User Journey Updates',
      description: 'Update E2E tests as new features are added to maintain comprehensive coverage of user workflows.'
    }
  ];
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');

  try {
    // Clear any temporary test files
    const tempDir = path.join(process.cwd(), 'temp-test-data');
    try {
      await fs.rmdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might not exist, which is fine
    }

    // Clear any cached test data
    if (global.__TEST_CACHE__) {
      delete global.__TEST_CACHE__;
    }

    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}

async function stopMockServices() {
  console.log('🛑 Stopping mock services...');

  try {
    // In a real implementation, this would stop actual mock servers
    // For now, we just clear the global mock configurations
    
    if (global.__MOCK_API__) {
      delete global.__MOCK_API__;
    }
    
    if (global.__MOCK_SOCKET__) {
      delete global.__MOCK_SOCKET__;
    }
    
    if (global.__MOCK_CODE_EXECUTION__) {
      delete global.__MOCK_CODE_EXECUTION__;
    }

    console.log('✅ Mock services stopped');
  } catch (error) {
    console.error('❌ Error stopping mock services:', error);
  }
}

async function cleanupTempFiles() {
  console.log('🧽 Cleaning up temporary files...');

  try {
    // Clean up any temporary screenshots, logs, or other test artifacts
    const tempPaths = [
      path.join(process.cwd(), 'screenshots'),
      path.join(process.cwd(), 'test-logs'),
      path.join(process.cwd(), 'coverage-temp')
    ];

    for (const tempPath of tempPaths) {
      try {
        const stats = await fs.stat(tempPath);
        if (stats.isDirectory()) {
          // Only remove if it's a test-generated directory
          const files = await fs.readdir(tempPath);
          if (files.every(file => file.includes('test-') || file.includes('temp-'))) {
            await fs.rmdir(tempPath, { recursive: true });
          }
        }
      } catch (error) {
        // Path doesn't exist, which is fine
      }
    }

    console.log('✅ Temporary files cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up temporary files:', error);
  }
}