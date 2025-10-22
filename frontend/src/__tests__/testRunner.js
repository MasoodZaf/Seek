/**
 * Comprehensive Test Runner for Accessibility and Performance
 * Orchestrates all testing approaches and generates reports
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class TestRunner {
  constructor() {
    this.results = {
      accessibility: {},
      performance: {},
      keyboardNavigation: {},
      summary: {}
    };
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive accessibility and performance testing...\n');

    try {
      // Run Jest tests for accessibility and keyboard navigation
      await this.runJestTests();
      
      // Run Lighthouse CI for performance testing
      await this.runLighthouseTests();
      
      // Generate comprehensive report
      await this.generateReport();
      
      console.log('✅ All tests completed successfully!');
      return this.results;
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      throw error;
    }
  }

  async runJestTests() {
    console.log('📋 Running Jest accessibility and keyboard navigation tests...');
    
    try {
      // Run accessibility tests
      const accessibilityOutput = execSync(
        'npm test -- --testPathPattern=accessibility.test.js --watchAll=false --coverage=false --verbose',
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      this.results.accessibility.jest = {
        status: 'passed',
        output: accessibilityOutput,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Accessibility tests passed');
      
      // Run keyboard navigation tests
      const keyboardOutput = execSync(
        'npm test -- --testPathPattern=keyboardNavigation.test.js --watchAll=false --coverage=false --verbose',
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      this.results.keyboardNavigation.jest = {
        status: 'passed',
        output: keyboardOutput,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Keyboard navigation tests passed');
      
      // Run performance tests
      const performanceOutput = execSync(
        'npm test -- --testPathPattern=performance.test.js --watchAll=false --coverage=false --verbose',
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      this.results.performance.jest = {
        status: 'passed',
        output: performanceOutput,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Performance tests passed');
      
    } catch (error) {
      console.error('❌ Jest tests failed:', error.message);
      this.results.accessibility.jest = { status: 'failed', error: error.message };
      this.results.keyboardNavigation.jest = { status: 'failed', error: error.message };
      this.results.performance.jest = { status: 'failed', error: error.message };
    }
  }

  async runLighthouseTests() {
    console.log('🔍 Running Lighthouse CI performance tests...');
    
    try {
      // Check if Lighthouse CI is configured
      if (!fs.existsSync('lighthouserc.js')) {
        console.log('⚠️  Lighthouse CI config not found, skipping Lighthouse tests');
        return;
      }
      
      const lighthouseOutput = execSync(
        'npx lhci autorun',
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      this.results.performance.lighthouse = {
        status: 'passed',
        output: lighthouseOutput,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Lighthouse tests passed');
      
    } catch (error) {
      console.error('❌ Lighthouse tests failed:', error.message);
      this.results.performance.lighthouse = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async generateReport() {
    console.log('📊 Generating comprehensive test report...');
    
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    this.results.summary = {
      totalDuration: duration,
      timestamp: new Date().toISOString(),
      testCounts: {
        accessibility: this.countTests('accessibility'),
        performance: this.countTests('performance'),
        keyboardNavigation: this.countTests('keyboardNavigation')
      },
      overallStatus: this.calculateOverallStatus()
    };
    
    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    const reportPath = path.join(process.cwd(), 'test-reports', 'accessibility-performance-report.html');
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, htmlReport);
    
    // Generate JSON report
    const jsonReportPath = path.join(process.cwd(), 'test-reports', 'accessibility-performance-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(this.results, null, 2));
    
    console.log(`📄 Reports generated:`);
    console.log(`   HTML: ${reportPath}`);
    console.log(`   JSON: ${jsonReportPath}`);
  }

  countTests(category) {
    const categoryResults = this.results[category];
    let passed = 0;
    let failed = 0;
    
    Object.values(categoryResults).forEach(result => {
      if (result.status === 'passed') passed++;
      else if (result.status === 'failed') failed++;
    });
    
    return { passed, failed, total: passed + failed };
  }

  calculateOverallStatus() {
    const allResults = [
      ...Object.values(this.results.accessibility),
      ...Object.values(this.results.performance),
      ...Object.values(this.results.keyboardNavigation)
    ];
    
    const hasFailures = allResults.some(result => result.status === 'failed');
    return hasFailures ? 'failed' : 'passed';
  }

  generateHTMLReport() {
    const { summary } = this.results;
    const statusColor = summary.overallStatus === 'passed' ? '#22c55e' : '#ef4444';
    const statusIcon = summary.overallStatus === 'passed' ? '✅' : '❌';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility & Performance Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${statusColor};
        }
        .summary-card h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 1.2rem;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            background-color: ${statusColor};
            color: white;
        }
        .test-section {
            background: white;
            margin-bottom: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .test-section h2 {
            background: #f8fafc;
            margin: 0;
            padding: 20px 25px;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
            font-size: 1.5rem;
        }
        .test-content {
            padding: 25px;
        }
        .test-result {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #e5e7eb;
        }
        .test-result.passed {
            background-color: #f0fdf4;
            border-left-color: #22c55e;
        }
        .test-result.failed {
            background-color: #fef2f2;
            border-left-color: #ef4444;
        }
        .test-result h4 {
            margin: 0 0 10px 0;
            color: #1f2937;
        }
        .test-output {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .metric {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
        }
        .metric-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6b7280;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${statusIcon} Accessibility & Performance Test Report</h1>
        <p>Generated on ${new Date(summary.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Overall Status</h3>
            <span class="status-badge">${summary.overallStatus.toUpperCase()}</span>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${Math.round(summary.totalDuration / 1000)}s</div>
                    <div class="metric-label">Total Duration</div>
                </div>
            </div>
        </div>
        
        <div class="summary-card">
            <h3>Accessibility Tests</h3>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.accessibility.passed}</div>
                    <div class="metric-label">Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.accessibility.failed}</div>
                    <div class="metric-label">Failed</div>
                </div>
            </div>
        </div>
        
        <div class="summary-card">
            <h3>Performance Tests</h3>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.performance.passed}</div>
                    <div class="metric-label">Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.performance.failed}</div>
                    <div class="metric-label">Failed</div>
                </div>
            </div>
        </div>
        
        <div class="summary-card">
            <h3>Keyboard Navigation</h3>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.keyboardNavigation.passed}</div>
                    <div class="metric-label">Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${summary.testCounts.keyboardNavigation.failed}</div>
                    <div class="metric-label">Failed</div>
                </div>
            </div>
        </div>
    </div>

    ${this.generateTestSectionHTML('Accessibility Tests', this.results.accessibility)}
    ${this.generateTestSectionHTML('Performance Tests', this.results.performance)}
    ${this.generateTestSectionHTML('Keyboard Navigation Tests', this.results.keyboardNavigation)}

    <div class="footer">
        <p>Report generated by Seek Professional Enhancement Test Suite</p>
        <p>For detailed logs and raw data, see the accompanying JSON report</p>
    </div>
</body>
</html>`;
  }

  generateTestSectionHTML(title, results) {
    const testResults = Object.entries(results).map(([testName, result]) => {
      const statusClass = result.status === 'passed' ? 'passed' : 'failed';
      const statusIcon = result.status === 'passed' ? '✅' : '❌';
      
      return `
        <div class="test-result ${statusClass}">
            <h4>${statusIcon} ${testName}</h4>
            <p><strong>Status:</strong> ${result.status}</p>
            <p><strong>Timestamp:</strong> ${result.timestamp || 'N/A'}</p>
            ${result.output ? `
                <details>
                    <summary>View Output</summary>
                    <div class="test-output">${result.output}</div>
                </details>
            ` : ''}
            ${result.error ? `
                <details>
                    <summary>View Error</summary>
                    <div class="test-output">${result.error}</div>
                </details>
            ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="test-section">
          <h2>${title}</h2>
          <div class="test-content">
              ${testResults || '<p>No test results available</p>'}
          </div>
      </div>
    `;
  }
}

// Export for use in other scripts
export default TestRunner;

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}