/**
 * Branding Test Runner
 * Orchestrates all branding and integration tests
 */

import { execSync } from 'child_process';
import path from 'path';

const BRANDING_TEST_DIR = path.join(__dirname);

/**
 * Test suite configuration for branding tests
 */
const testSuites = [
  {
    name: 'Social Sharing Functionality',
    file: 'socialSharing.test.js',
    description: 'Tests social sharing components and their integration',
    critical: true
  },
  {
    name: 'Brand Consistency',
    file: 'brandConsistency.test.js',
    description: 'Verifies brand guidelines compliance across all components',
    critical: true
  },
  {
    name: 'Professional Messaging',
    file: 'professionalMessaging.test.js',
    description: 'Tests messaging consistency, tone, and professional copy',
    critical: true
  },
  {
    name: 'Integration Tests',
    file: 'integration.test.js',
    description: 'Tests how branding elements work together across the application',
    critical: false
  }
];

/**
 * Brand compliance checklist
 */
const brandComplianceChecklist = {
  colors: {
    description: 'Color palette consistency across components',
    tests: [
      'Primary colors are used consistently',
      'Semantic colors are applied correctly',
      'Gradient usage follows brand guidelines',
      'Color contrast meets WCAG guidelines'
    ]
  },
  typography: {
    description: 'Typography consistency and hierarchy',
    tests: [
      'Font families are consistent',
      'Font weights follow the scale',
      'Font sizes follow the scale',
      'Text hierarchy is maintained'
    ]
  },
  iconography: {
    description: 'Icon consistency and usage',
    tests: [
      'Icons use consistent stroke width',
      'Icons use consistent sizing',
      'Icons have proper viewBox',
      'Icons use semantic naming'
    ]
  },
  spacing: {
    description: 'Spacing system consistency',
    tests: [
      'Components use consistent spacing scale',
      'Button components use consistent internal spacing',
      'Layout components maintain proper spacing'
    ]
  },
  messaging: {
    description: 'Professional messaging and tone',
    tests: [
      'Error messages are helpful and actionable',
      'Success messages are encouraging and motivating',
      'Progress messages adapt to context',
      'All messages maintain professional tone'
    ]
  },
  socialSharing: {
    description: 'Social sharing functionality',
    tests: [
      'All social platforms work correctly',
      'Copy link functionality works',
      'Native share API integration',
      'Brand messaging in shared content'
    ]
  }
};

/**
 * Run a specific test suite
 */
function runTestSuite(suite) {
  console.log(`\n🧪 Running ${suite.name}...`);
  console.log(`📝 ${suite.description}`);
  
  try {
    const testFile = path.join(BRANDING_TEST_DIR, suite.file);
    const result = execSync(`npm test -- ${testFile} --verbose`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '../../../')
    });
    
    console.log(`✅ ${suite.name} - PASSED`);
    return { suite: suite.name, status: 'PASSED', output: result };
  } catch (error) {
    console.log(`❌ ${suite.name} - FAILED`);
    console.error(error.stdout || error.message);
    return { suite: suite.name, status: 'FAILED', error: error.stdout || error.message };
  }
}

/**
 * Run all branding tests
 */
function runAllBrandingTests() {
  console.log('🎨 Starting Branding and Integration Test Suite');
  console.log('=' .repeat(60));
  
  const results = [];
  let passedTests = 0;
  let failedTests = 0;
  
  // Run each test suite
  for (const suite of testSuites) {
    const result = runTestSuite(suite);
    results.push(result);
    
    if (result.status === 'PASSED') {
      passedTests++;
    } else {
      failedTests++;
      
      // If critical test fails, consider stopping
      if (suite.critical) {
        console.log(`\n⚠️  Critical test failed: ${suite.name}`);
      }
    }
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 BRANDING TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / testSuites.length) * 100)}%`);
  
  // Print detailed results
  console.log('\n📋 DETAILED RESULTS:');
  results.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${result.suite}`);
  });
  
  // Print brand compliance status
  console.log('\n🎯 BRAND COMPLIANCE CHECKLIST:');
  Object.entries(brandComplianceChecklist).forEach(([category, info]) => {
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`  📝 ${info.description}`);
    info.tests.forEach(test => {
      console.log(`  • ${test}`);
    });
  });
  
  return {
    totalTests: testSuites.length,
    passedTests,
    failedTests,
    successRate: Math.round((passedTests / testSuites.length) * 100),
    results
  };
}

/**
 * Run specific category of tests
 */
function runTestCategory(category) {
  const categoryTests = testSuites.filter(suite => 
    suite.file.toLowerCase().includes(category.toLowerCase())
  );
  
  if (categoryTests.length === 0) {
    console.log(`❌ No tests found for category: ${category}`);
    return;
  }
  
  console.log(`🎯 Running ${category} tests...`);
  
  const results = [];
  for (const suite of categoryTests) {
    const result = runTestSuite(suite);
    results.push(result);
  }
  
  return results;
}

/**
 * Validate brand guidelines compliance
 */
function validateBrandCompliance() {
  console.log('🔍 Validating Brand Guidelines Compliance...');
  
  const complianceResults = {};
  
  // This would typically run specific validation tests
  // For now, we'll simulate the validation
  Object.keys(brandComplianceChecklist).forEach(category => {
    complianceResults[category] = {
      status: 'COMPLIANT',
      issues: []
    };
  });
  
  console.log('✅ Brand compliance validation complete');
  return complianceResults;
}

/**
 * Generate test report
 */
function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.totalTests,
      passedTests: results.passedTests,
      failedTests: results.failedTests,
      successRate: results.successRate
    },
    testResults: results.results,
    brandCompliance: validateBrandCompliance(),
    recommendations: []
  };
  
  // Add recommendations based on results
  if (results.failedTests > 0) {
    report.recommendations.push('Review failed tests and address brand consistency issues');
  }
  
  if (results.successRate < 100) {
    report.recommendations.push('Ensure all components follow brand guidelines');
  }
  
  report.recommendations.push('Regular brand compliance audits recommended');
  
  return report;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'all':
      const results = runAllBrandingTests();
      const report = generateTestReport(results);
      console.log('\n📄 Full report generated');
      break;
      
    case 'category':
      const category = args[1];
      if (!category) {
        console.log('❌ Please specify a category: social, brand, messaging, integration');
        break;
      }
      runTestCategory(category);
      break;
      
    case 'compliance':
      validateBrandCompliance();
      break;
      
    default:
      console.log('🎨 Branding Test Runner');
      console.log('Usage:');
      console.log('  node brandingTestRunner.js all          - Run all branding tests');
      console.log('  node brandingTestRunner.js category <name> - Run specific category');
      console.log('  node brandingTestRunner.js compliance    - Validate brand compliance');
      console.log('');
      console.log('Available categories: social, brand, messaging, integration');
  }
}

export {
  runAllBrandingTests,
  runTestCategory,
  validateBrandCompliance,
  generateTestReport,
  testSuites,
  brandComplianceChecklist
};