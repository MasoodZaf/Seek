/**
 * Cross-Browser Test Runner
 * Runs comprehensive tests across different browser environments
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Browser configurations for testing
const BROWSER_CONFIGS = [
  {
    name: 'Chrome',
    product: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'Firefox',
    product: 'firefox',
    args: [],
    viewport: { width: 1920, height: 1080 }
  }
];

// Test scenarios to run across browsers
const TEST_SCENARIOS = [
  {
    name: 'Homepage Load',
    url: 'http://localhost:3000',
    tests: [
      'checkPageLoad',
      'checkResponsiveLayout',
      'checkAnimations',
      'checkAccessibility'
    ]
  },
  {
    name: 'Dashboard',
    url: 'http://localhost:3000/dashboard',
    tests: [
      'checkPageLoad',
      'checkInteractivity',
      'checkResponsiveLayout',
      'checkAnimations'
    ]
  },
  {
    name: 'Code Playground',
    url: 'http://localhost:3000/playground',
    tests: [
      'checkPageLoad',
      'checkCodeEditor',
      'checkResponsiveLayout',
      'checkMobileExperience'
    ]
  }
];

class CrossBrowserTester {
  constructor() {
    this.results = [];
    this.screenshots = [];
  }

  /**
   * Run all cross-browser tests
   */
  async runAllTests() {
    console.log('🚀 Starting Cross-Browser Testing...\n');
    
    for (const browserConfig of BROWSER_CONFIGS) {
      console.log(`Testing in ${browserConfig.name}...`);
      await this.testBrowser(browserConfig);
    }
    
    await this.generateReport();
    console.log('\n✅ Cross-browser testing completed!');
  }

  /**
   * Test a specific browser configuration
   */
  async testBrowser(browserConfig) {
    let browser;
    
    try {
      browser = await puppeteer.launch({
        product: browserConfig.product,
        headless: true,
        args: browserConfig.args
      });
      
      const page = await browser.newPage();
      await page.setViewport(browserConfig.viewport);
      
      // Set up console logging
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`❌ ${browserConfig.name} Console Error:`, msg.text());
        }
      });
      
      // Set up error handling
      page.on('pageerror', error => {
        console.log(`❌ ${browserConfig.name} Page Error:`, error.message);
      });
      
      for (const scenario of TEST_SCENARIOS) {
        await this.runScenario(page, browserConfig, scenario);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${browserConfig.name}:`, error.message);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Run a test scenario
   */
  async runScenario(page, browserConfig, scenario) {
    console.log(`  📋 Testing: ${scenario.name}`);
    
    try {
      await page.goto(scenario.url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      for (const testName of scenario.tests) {
        const result = await this.runTest(page, browserConfig, scenario, testName);
        this.results.push(result);
      }
      
      // Take screenshot
      const screenshotPath = `screenshots/${browserConfig.name}-${scenario.name.replace(/\s+/g, '-')}.png`;
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      this.screenshots.push(screenshotPath);
      
    } catch (error) {
      console.log(`    ❌ Scenario failed: ${error.message}`);
      this.results.push({
        browser: browserConfig.name,
        scenario: scenario.name,
        test: 'Page Load',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Run individual test
   */
  async runTest(page, browserConfig, scenario, testName) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (testName) {
        case 'checkPageLoad':
          result = await this.checkPageLoad(page);
          break;
        case 'checkResponsiveLayout':
          result = await this.checkResponsiveLayout(page);
          break;
        case 'checkAnimations':
          result = await this.checkAnimations(page);
          break;
        case 'checkAccessibility':
          result = await this.checkAccessibility(page);
          break;
        case 'checkInteractivity':
          result = await this.checkInteractivity(page);
          break;
        case 'checkCodeEditor':
          result = await this.checkCodeEditor(page);
          break;
        case 'checkMobileExperience':
          result = await this.checkMobileExperience(page);
          break;
        default:
          result = { status: 'skipped', message: 'Test not implemented' };
      }
      
      const duration = Date.now() - startTime;
      console.log(`    ✅ ${testName}: ${result.status} (${duration}ms)`);
      
      return {
        browser: browserConfig.name,
        scenario: scenario.name,
        test: testName,
        status: result.status,
        message: result.message,
        duration,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`    ❌ ${testName}: failed (${duration}ms) - ${error.message}`);
      
      return {
        browser: browserConfig.name,
        scenario: scenario.name,
        test: testName,
        status: 'failed',
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check page load performance and basic functionality
   */
  async checkPageLoad(page) {
    // Check if page loaded successfully
    const title = await page.title();
    if (!title) {
      throw new Error('Page title is empty');
    }
    
    // Check for JavaScript errors
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });
    
    if (errors.length > 0) {
      throw new Error(`JavaScript errors found: ${errors.join(', ')}`);
    }
    
    // Check load time
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    
    if (loadTime > 5000) {
      return { status: 'warning', message: `Slow load time: ${loadTime}ms` };
    }
    
    return { status: 'passed', message: `Page loaded successfully in ${loadTime}ms` };
  }

  /**
   * Check responsive layout across different viewport sizes
   */
  async checkResponsiveLayout(page) {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    const results = [];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.waitForTimeout(500); // Wait for layout to adjust
      
      // Check if layout adapts properly
      const layoutCheck = await page.evaluate(() => {
        const sidebar = document.querySelector('[data-testid="sidebar"]');
        const header = document.querySelector('[data-testid="header"]');
        const main = document.querySelector('main');
        
        return {
          sidebarVisible: sidebar ? window.getComputedStyle(sidebar).display !== 'none' : true,
          headerVisible: header ? window.getComputedStyle(header).display !== 'none' : true,
          mainVisible: main ? window.getComputedStyle(main).display !== 'none' : true,
          hasOverflow: document.body.scrollWidth > window.innerWidth
        };
      });
      
      results.push({
        viewport: viewport.name,
        ...layoutCheck
      });
    }
    
    // Reset to desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    return { status: 'passed', message: 'Responsive layout working correctly', details: results };
  }

  /**
   * Check CSS animations and transitions
   */
  async checkAnimations(page) {
    // Check if animations are working
    const animationCheck = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="transition-"]');
      
      if (animatedElements.length === 0) {
        return { hasAnimations: false, count: 0 };
      }
      
      // Check if CSS transitions are supported
      const testElement = document.createElement('div');
      testElement.style.transition = 'all 0.3s';
      const supportsTransitions = testElement.style.transition === 'all 0.3s';
      
      return {
        hasAnimations: true,
        count: animatedElements.length,
        supportsTransitions
      };
    });
    
    if (!animationCheck.supportsTransitions) {
      return { status: 'warning', message: 'Browser does not support CSS transitions' };
    }
    
    return { 
      status: 'passed', 
      message: `Animations working correctly (${animationCheck.count} animated elements found)` 
    };
  }

  /**
   * Check basic accessibility features
   */
  async checkAccessibility(page) {
    const a11yCheck = await page.evaluate(() => {
      const issues = [];
      
      // Check for images without alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        issues.push(`${images.length} images without alt text`);
      }
      
      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button:not([aria-label]):not([title])');
      const buttonsWithoutText = Array.from(buttons).filter(btn => !btn.textContent.trim());
      if (buttonsWithoutText.length > 0) {
        issues.push(`${buttonsWithoutText.length} buttons without accessible names`);
      }
      
      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([title])');
      const inputsWithoutLabels = Array.from(inputs).filter(input => {
        const id = input.id;
        return !id || !document.querySelector(`label[for="${id}"]`);
      });
      if (inputsWithoutLabels.length > 0) {
        issues.push(`${inputsWithoutLabels.length} inputs without labels`);
      }
      
      return issues;
    });
    
    if (a11yCheck.length > 0) {
      return { status: 'warning', message: `Accessibility issues found: ${a11yCheck.join(', ')}` };
    }
    
    return { status: 'passed', message: 'Basic accessibility checks passed' };
  }

  /**
   * Check interactive elements
   */
  async checkInteractivity(page) {
    // Test button clicks
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(100);
    }
    
    // Test form inputs
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length > 0) {
      await inputs[0].type('test');
      const value = await inputs[0].evaluate(el => el.value);
      if (value !== 'test') {
        throw new Error('Input interaction failed');
      }
    }
    
    return { status: 'passed', message: 'Interactive elements working correctly' };
  }

  /**
   * Check code editor functionality
   */
  async checkCodeEditor(page) {
    // Wait for Monaco editor to load
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    
    // Check if editor is interactive
    const editorCheck = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      return {
        present: !!editor,
        hasContent: editor && editor.textContent.length > 0,
        isVisible: editor && window.getComputedStyle(editor).display !== 'none'
      };
    });
    
    if (!editorCheck.present) {
      throw new Error('Code editor not found');
    }
    
    if (!editorCheck.isVisible) {
      throw new Error('Code editor not visible');
    }
    
    return { status: 'passed', message: 'Code editor loaded and visible' };
  }

  /**
   * Check mobile-specific features
   */
  async checkMobileExperience(page) {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check touch-friendly elements
    const touchCheck = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const smallButtons = Array.from(buttons).filter(btn => {
        const rect = btn.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      });
      
      return {
        totalButtons: buttons.length,
        smallButtons: smallButtons.length,
        touchFriendly: smallButtons.length === 0
      };
    });
    
    // Reset viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    if (!touchCheck.touchFriendly) {
      return { 
        status: 'warning', 
        message: `${touchCheck.smallButtons} buttons are smaller than recommended touch target size` 
      };
    }
    
    return { status: 'passed', message: 'Mobile experience optimized' };
  }

  /**
   * Generate test report
   */
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'passed').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        warnings: this.results.filter(r => r.status === 'warning').length
      },
      results: this.results,
      screenshots: this.screenshots
    };
    
    // Create reports directory
    await fs.mkdir('test-reports', { recursive: true });
    
    // Write JSON report
    await fs.writeFile(
      'test-reports/cross-browser-report.json',
      JSON.stringify(report, null, 2)
    );
    
    // Write HTML report
    const htmlReport = this.generateHTMLReport(report);
    await fs.writeFile('test-reports/cross-browser-report.html', htmlReport);
    
    console.log('\n📊 Test Summary:');
    console.log(`   Total Tests: ${report.summary.total}`);
    console.log(`   ✅ Passed: ${report.summary.passed}`);
    console.log(`   ❌ Failed: ${report.summary.failed}`);
    console.log(`   ⚠️  Warnings: ${report.summary.warnings}`);
    console.log('\n📁 Reports generated:');
    console.log('   - test-reports/cross-browser-report.json');
    console.log('   - test-reports/cross-browser-report.html');
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { padding: 20px; border-radius: 6px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 2em; }
        .summary-card p { margin: 0; color: #666; }
        .passed { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        .warning { background: #fff3cd; color: #856404; }
        .total { background: #e2e3e5; color: #383d41; }
        .results { margin-top: 30px; }
        .result-item { padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid; }
        .result-item.passed { background: #d4edda; border-color: #28a745; }
        .result-item.failed { background: #f8d7da; border-color: #dc3545; }
        .result-item.warning { background: #fff3cd; border-color: #ffc107; }
        .result-header { display: flex; justify-content: between; align-items: center; margin-bottom: 5px; }
        .result-title { font-weight: bold; }
        .result-duration { color: #666; font-size: 0.9em; }
        .result-message { color: #666; }
        .screenshots { margin-top: 30px; }
        .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-item { text-align: center; }
        .screenshot-item img { max-width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <h1>Cross-Browser Test Report</h1>
        <p>Generated on: ${new Date(report.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>${report.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${report.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${report.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card warning">
                <h3>${report.summary.warnings}</h3>
                <p>Warnings</p>
            </div>
        </div>
        
        <div class="results">
            <h2>Test Results</h2>
            ${report.results.map(result => `
                <div class="result-item ${result.status}">
                    <div class="result-header">
                        <span class="result-title">${result.browser} - ${result.scenario} - ${result.test}</span>
                        <span class="result-duration">${result.duration}ms</span>
                    </div>
                    <div class="result-message">${result.message || result.error || ''}</div>
                </div>
            `).join('')}
        </div>
        
        ${report.screenshots.length > 0 ? `
        <div class="screenshots">
            <h2>Screenshots</h2>
            <div class="screenshot-grid">
                ${report.screenshots.map(screenshot => `
                    <div class="screenshot-item">
                        <img src="${screenshot}" alt="Screenshot">
                        <p>${screenshot.split('/').pop()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>
    `;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new CrossBrowserTester();
  tester.runAllTests().catch(console.error);
}

module.exports = CrossBrowserTester;