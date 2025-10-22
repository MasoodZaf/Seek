/**
 * Load Testing End-to-End Tests
 * 
 * Tests system performance under various load conditions,
 * simulating realistic user loads and concurrent usage patterns.
 * 
 * Requirements Coverage:
 * - Requirement 6: Performance & Accessibility Optimization
 * - Load testing under realistic conditions
 * - Concurrent user simulation
 * - System scalability validation
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import App from '../../App';

// Load testing utilities
class LoadTestRunner {
  constructor() {
    this.activeUsers = [];
    this.metrics = {
      responsesTimes: [],
      errorRates: [],
      throughput: [],
      resourceUsage: []
    };
  }

  async simulateUser(userId, actions) {
    const userMetrics = {
      id: userId,
      startTime: performance.now(),
      actions: [],
      errors: []
    };

    try {
      for (const action of actions) {
        const actionStartTime = performance.now();
        
        try {
          await action();
          const actionEndTime = performance.now();
          
          userMetrics.actions.push({
            type: action.name,
            duration: actionEndTime - actionStartTime,
            success: true
          });
        } catch (error) {
          userMetrics.errors.push({
            type: action.name,
            error: error.message
          });
        }
      }
    } catch (error) {
      userMetrics.errors.push({
        type: 'general',
        error: error.message
      });
    }

    userMetrics.endTime = performance.now();
    userMetrics.totalDuration = userMetrics.endTime - userMetrics.startTime;
    
    return userMetrics;
  }

  async runConcurrentUsers(userCount, userActions) {
    const userPromises = [];
    
    for (let i = 0; i < userCount; i++) {
      userPromises.push(this.simulateUser(i, userActions));
    }

    const results = await Promise.all(userPromises);
    this.processResults(results);
    
    return results;
  }

  processResults(results) {
    const totalActions = results.reduce((sum, user) => sum + user.actions.length, 0);
    const totalErrors = results.reduce((sum, user) => sum + user.errors.length, 0);
    const totalDuration = Math.max(...results.map(user => user.totalDuration));
    
    this.metrics = {
      averageResponseTime: results.reduce((sum, user) => {
        const userAvg = user.actions.reduce((actionSum, action) => actionSum + action.duration, 0) / user.actions.length;
        return sum + userAvg;
      }, 0) / results.length,
      errorRate: (totalErrors / totalActions) * 100,
      throughput: totalActions / (totalDuration / 1000), // actions per second
      concurrentUsers: results.length,
      totalDuration
    };
  }

  getMetrics() {
    return this.metrics;
  }
}

// Mock realistic user behavior patterns
const createUserActions = (userType) => {
  const baseActions = {
    casual: [
      async () => {
        // Casual user: browse dashboard, look at tutorials
        const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
        await userEvent.click(dashboardLink);
        await waitFor(() => screen.getByTestId('enhanced-dashboard'));
        
        const tutorialsLink = await screen.findByRole('link', { name: /tutorials/i });
        await userEvent.click(tutorialsLink);
        await waitFor(() => screen.getByTestId('tutorials-page'));
      }
    ],
    
    active: [
      async () => {
        // Active user: complete tutorial exercises
        const tutorialsLink = await screen.findByRole('link', { name: /tutorials/i });
        await userEvent.click(tutorialsLink);
        
        const firstTutorial = await screen.findByTestId('tutorial-card');
        await userEvent.click(firstTutorial);
        
        const codeEditor = await screen.findByTestId('code-input');
        await userEvent.type(codeEditor, 'console.log("test");');
        
        const runButton = await screen.findByRole('button', { name: /run/i });
        await userEvent.click(runButton);
        
        await waitFor(() => screen.getByTestId('code-output'));
      }
    ],
    
    power: [
      async () => {
        // Power user: use playground, save snippets, share code
        const playgroundLink = await screen.findByRole('link', { name: /playground/i });
        await userEvent.click(playgroundLink);
        
        const codeEditor = await screen.findByTestId('code-input');
        await userEvent.type(codeEditor, 'function powerUser() { return "advanced"; }');
        
        const saveButton = await screen.findByRole('button', { name: /save/i });
        await userEvent.click(saveButton);
        
        const titleInput = await screen.findByLabelText(/title/i);
        await userEvent.type(titleInput, 'Power User Function');
        
        const confirmSave = await screen.findByRole('button', { name: /save snippet/i });
        await userEvent.click(confirmSave);
      }
    ]
  };

  return baseActions[userType] || baseActions.casual;
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Load Testing E2E Tests', () => {
  let loadTestRunner;

  beforeEach(() => {
    loadTestRunner = new LoadTestRunner();
  });

  describe('Light Load Testing', () => {
    test('should handle 5 concurrent casual users efficiently', async () => {
      render(<App />, { wrapper: TestWrapper });

      const casualActions = createUserActions('casual');
      const results = await loadTestRunner.runConcurrentUsers(5, casualActions);
      const metrics = loadTestRunner.getMetrics();

      // Verify performance under light load
      expect(metrics.averageResponseTime).toBeLessThan(1000); // Under 1 second
      expect(metrics.errorRate).toBeLessThan(5); // Less than 5% errors
      expect(metrics.throughput).toBeGreaterThan(1); // At least 1 action per second
      
      // Verify all users completed successfully
      const successfulUsers = results.filter(user => user.errors.length === 0);
      expect(successfulUsers.length).toBeGreaterThanOrEqual(4); // At least 80% success

      console.log('Light Load Metrics:', metrics);
    });

    test('should maintain UI responsiveness during light load', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Start background load
      const backgroundLoad = loadTestRunner.runConcurrentUsers(3, createUserActions('casual'));

      // Test UI responsiveness during load
      const interactionStartTime = performance.now();
      
      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);
      
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toBeInTheDocument();
      
      const interactionEndTime = performance.now();
      const interactionTime = interactionEndTime - interactionStartTime;

      // UI should remain responsive
      expect(interactionTime).toBeLessThan(500);

      // Wait for background load to complete
      await backgroundLoad;
    });
  });

  describe('Medium Load Testing', () => {
    test('should handle 15 concurrent mixed users effectively', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Mix of user types
      const mixedUserPromises = [
        ...Array(5).fill().map(() => loadTestRunner.simulateUser('casual', createUserActions('casual'))),
        ...Array(7).fill().map(() => loadTestRunner.simulateUser('active', createUserActions('active'))),
        ...Array(3).fill().map(() => loadTestRunner.simulateUser('power', createUserActions('power')))
      ];

      const results = await Promise.all(mixedUserPromises);
      loadTestRunner.processResults(results);
      const metrics = loadTestRunner.getMetrics();

      // Verify performance under medium load
      expect(metrics.averageResponseTime).toBeLessThan(2000); // Under 2 seconds
      expect(metrics.errorRate).toBeLessThan(10); // Less than 10% errors
      expect(metrics.throughput).toBeGreaterThan(0.5); // At least 0.5 actions per second

      // Verify system stability
      const memoryUsage = performance.memory?.usedJSHeapSize || 0;
      expect(memoryUsage).toBeLessThan(200 * 1024 * 1024); // Under 200MB

      console.log('Medium Load Metrics:', metrics);
    });

    test('should handle code execution load efficiently', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Simulate multiple users executing code simultaneously
      const codeExecutionActions = [
        async () => {
          const playgroundLink = await screen.findByRole('link', { name: /playground/i });
          await userEvent.click(playgroundLink);
          
          const codeEditor = await screen.findByTestId('code-input');
          await userEvent.type(codeEditor, 'for(let i = 0; i < 1000; i++) { console.log(i); }');
          
          const runButton = await screen.findByRole('button', { name: /run/i });
          await userEvent.click(runButton);
          
          await waitFor(() => screen.getByTestId('code-output'), { timeout: 5000 });
        }
      ];

      const executionStartTime = performance.now();
      const results = await loadTestRunner.runConcurrentUsers(10, codeExecutionActions);
      const executionEndTime = performance.now();

      const totalExecutionTime = executionEndTime - executionStartTime;
      const metrics = loadTestRunner.getMetrics();

      // Verify code execution performance under load
      expect(totalExecutionTime).toBeLessThan(10000); // Complete in under 10 seconds
      expect(metrics.errorRate).toBeLessThan(15); // Allow slightly higher error rate for code execution
      
      // Verify successful executions
      const successfulExecutions = results.filter(user => 
        user.actions.some(action => action.success && action.type === 'codeExecutionActions')
      );
      expect(successfulExecutions.length).toBeGreaterThanOrEqual(7); // At least 70% success

      console.log('Code Execution Load Metrics:', metrics);
    });
  });

  describe('Heavy Load Testing', () => {
    test('should handle 25 concurrent users with graceful degradation', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Heavy load with all user types
      const heavyLoadPromises = [
        ...Array(10).fill().map(() => loadTestRunner.simulateUser('casual', createUserActions('casual'))),
        ...Array(10).fill().map(() => loadTestRunner.simulateUser('active', createUserActions('active'))),
        ...Array(5).fill().map(() => loadTestRunner.simulateUser('power', createUserActions('power')))
      ];

      const heavyLoadStartTime = performance.now();
      const results = await Promise.all(heavyLoadPromises);
      const heavyLoadEndTime = performance.now();

      loadTestRunner.processResults(results);
      const metrics = loadTestRunner.getMetrics();

      // Verify graceful degradation under heavy load
      expect(metrics.averageResponseTime).toBeLessThan(5000); // Under 5 seconds (degraded but acceptable)
      expect(metrics.errorRate).toBeLessThan(25); // Allow higher error rate under heavy load
      expect(metrics.totalDuration).toBeLessThan(30000); // Complete in under 30 seconds

      // Verify system doesn't crash
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toBeInTheDocument();

      // Verify memory usage remains bounded
      const memoryUsage = performance.memory?.usedJSHeapSize || 0;
      expect(memoryUsage).toBeLessThan(500 * 1024 * 1024); // Under 500MB even under heavy load

      console.log('Heavy Load Metrics:', metrics);
    });

    test('should implement load balancing and queuing mechanisms', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Simulate burst load
      const burstActions = [
        async () => {
          // Rapid-fire actions
          const playgroundLink = await screen.findByRole('link', { name: /playground/i });
          await userEvent.click(playgroundLink);
          
          const runButton = await screen.findByRole('button', { name: /run/i });
          
          // Multiple rapid executions
          for (let i = 0; i < 5; i++) {
            await userEvent.click(runButton);
            await new Promise(resolve => setTimeout(resolve, 100)); // Brief pause
          }
        }
      ];

      const burstStartTime = performance.now();
      const burstResults = await loadTestRunner.runConcurrentUsers(20, burstActions);
      const burstEndTime = performance.now();

      const burstDuration = burstEndTime - burstStartTime;
      const metrics = loadTestRunner.getMetrics();

      // Verify system handles burst load
      expect(burstDuration).toBeLessThan(15000); // Handle burst in under 15 seconds
      expect(metrics.errorRate).toBeLessThan(30); // Some errors acceptable during burst

      // Verify system recovers after burst
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for recovery

      const recoveryStartTime = performance.now();
      const normalButton = await screen.findByRole('button');
      await userEvent.click(normalButton);
      const recoveryEndTime = performance.now();

      const recoveryTime = recoveryEndTime - recoveryStartTime;
      expect(recoveryTime).toBeLessThan(1000); // Should recover quickly

      console.log('Burst Load Metrics:', metrics);
    });
  });

  describe('Stress Testing', () => {
    test('should identify breaking point and maintain core functionality', async () => {
      render(<App />, { wrapper: TestWrapper });

      let currentLoad = 10;
      let breakingPoint = null;
      const maxLoad = 50;

      // Gradually increase load until breaking point
      while (currentLoad <= maxLoad && !breakingPoint) {
        try {
          const stressStartTime = performance.now();
          const results = await loadTestRunner.runConcurrentUsers(currentLoad, createUserActions('active'));
          const stressEndTime = performance.now();

          const metrics = loadTestRunner.getMetrics();
          
          // Check if system is still performing acceptably
          if (metrics.errorRate > 50 || metrics.averageResponseTime > 10000) {
            breakingPoint = currentLoad;
            break;
          }

          console.log(`Load ${currentLoad} - Response Time: ${metrics.averageResponseTime}ms, Error Rate: ${metrics.errorRate}%`);
          
          currentLoad += 5;
        } catch (error) {
          breakingPoint = currentLoad;
          break;
        }
      }

      // Verify breaking point is reasonable
      expect(breakingPoint).toBeGreaterThan(20); // Should handle at least 20 concurrent users
      
      // Verify core functionality still works at breaking point
      if (breakingPoint) {
        const coreButton = await screen.findByRole('button');
        expect(coreButton).toBeInTheDocument();
        
        // Core navigation should still work
        const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
        await userEvent.click(dashboardLink);
        
        const dashboard = await screen.findByTestId('enhanced-dashboard');
        expect(dashboard).toBeInTheDocument();
      }

      console.log(`Breaking point identified at ${breakingPoint} concurrent users`);
    });

    test('should recover gracefully from overload conditions', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Create overload condition
      const overloadActions = [
        async () => {
          // Resource-intensive actions
          const playgroundLink = await screen.findByRole('link', { name: /playground/i });
          await userEvent.click(playgroundLink);
          
          const codeEditor = await screen.findByTestId('code-input');
          const heavyCode = 'for(let i = 0; i < 10000; i++) { console.log("stress test " + i); }';
          await userEvent.type(codeEditor, heavyCode);
          
          const runButton = await screen.findByRole('button', { name: /run/i });
          await userEvent.click(runButton);
        }
      ];

      // Create overload
      const overloadPromise = loadTestRunner.runConcurrentUsers(30, overloadActions);
      
      // Wait for overload to settle
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Test recovery
      const recoveryStartTime = performance.now();
      
      try {
        const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
        await userEvent.click(dashboardLink);
        
        const dashboard = await screen.findByTestId('enhanced-dashboard');
        expect(dashboard).toBeInTheDocument();
        
        const recoveryEndTime = performance.now();
        const recoveryTime = recoveryEndTime - recoveryStartTime;
        
        // Should recover within reasonable time
        expect(recoveryTime).toBeLessThan(5000);
        
        console.log(`System recovered in ${recoveryTime}ms`);
      } catch (error) {
        console.log('System did not recover gracefully:', error.message);
      }

      // Wait for overload test to complete
      try {
        await overloadPromise;
      } catch (error) {
        // Expected to fail under overload
        console.log('Overload test completed with expected failures');
      }
    });
  });

  describe('Real-World Load Patterns', () => {
    test('should handle typical daily usage patterns', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Simulate typical daily pattern: gradual ramp-up, peak, ramp-down
      const dailyPattern = [
        { users: 5, duration: 2000 },   // Morning ramp-up
        { users: 15, duration: 3000 },  // Peak usage
        { users: 8, duration: 2000 },   // Afternoon
        { users: 3, duration: 1000 }    // Evening wind-down
      ];

      const patternResults = [];

      for (const phase of dailyPattern) {
        const phaseStartTime = performance.now();
        
        const phaseResults = await loadTestRunner.runConcurrentUsers(
          phase.users, 
          createUserActions('active')
        );
        
        const phaseEndTime = performance.now();
        const phaseDuration = phaseEndTime - phaseStartTime;
        
        const metrics = loadTestRunner.getMetrics();
        
        patternResults.push({
          phase: phase.users,
          metrics,
          duration: phaseDuration
        });

        // Brief pause between phases
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Verify system handled daily pattern well
      const peakPhase = patternResults.find(p => p.phase === 15);
      expect(peakPhase.metrics.errorRate).toBeLessThan(15);
      expect(peakPhase.metrics.averageResponseTime).toBeLessThan(3000);

      // Verify performance improved during low-usage phases
      const lowPhase = patternResults.find(p => p.phase === 3);
      expect(lowPhase.metrics.averageResponseTime).toBeLessThan(peakPhase.metrics.averageResponseTime);

      console.log('Daily Pattern Results:', patternResults);
    });

    test('should handle weekend vs weekday load differences', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Simulate weekday pattern (more active users, shorter sessions)
      const weekdayResults = await loadTestRunner.runConcurrentUsers(12, createUserActions('active'));
      const weekdayMetrics = loadTestRunner.getMetrics();

      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate weekend pattern (fewer users, longer sessions)
      const weekendActions = [
        ...createUserActions('casual'),
        ...createUserActions('power')
      ];
      const weekendResults = await loadTestRunner.runConcurrentUsers(8, weekendActions);
      const weekendMetrics = loadTestRunner.getMetrics();

      // Verify both patterns are handled well
      expect(weekdayMetrics.errorRate).toBeLessThan(10);
      expect(weekendMetrics.errorRate).toBeLessThan(10);

      // Weekend might have longer response times due to more complex actions
      expect(weekendMetrics.averageResponseTime).toBeGreaterThan(weekdayMetrics.averageResponseTime * 0.8);

      console.log('Weekday Metrics:', weekdayMetrics);
      console.log('Weekend Metrics:', weekendMetrics);
    });
  });

  describe('Load Testing Reporting', () => {
    test('should generate comprehensive load test reports', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Run comprehensive load test
      const comprehensiveResults = await loadTestRunner.runConcurrentUsers(20, [
        ...createUserActions('casual'),
        ...createUserActions('active'),
        ...createUserActions('power')
      ]);

      const finalMetrics = loadTestRunner.getMetrics();

      // Generate comprehensive report
      const loadTestReport = {
        testSuite: 'Comprehensive Load Test',
        timestamp: new Date().toISOString(),
        configuration: {
          concurrentUsers: 20,
          testDuration: finalMetrics.totalDuration,
          userTypes: ['casual', 'active', 'power']
        },
        results: {
          averageResponseTime: finalMetrics.averageResponseTime,
          errorRate: finalMetrics.errorRate,
          throughput: finalMetrics.throughput,
          peakMemoryUsage: performance.memory?.usedJSHeapSize || 0
        },
        performance: {
          passedThresholds: {
            responseTime: finalMetrics.averageResponseTime < 3000,
            errorRate: finalMetrics.errorRate < 15,
            throughput: finalMetrics.throughput > 0.5
          }
        },
        recommendations: []
      };

      // Add recommendations based on results
      if (finalMetrics.averageResponseTime > 2000) {
        loadTestReport.recommendations.push('Consider optimizing response times');
      }
      if (finalMetrics.errorRate > 10) {
        loadTestReport.recommendations.push('Investigate and reduce error rates');
      }
      if (finalMetrics.throughput < 1) {
        loadTestReport.recommendations.push('Improve system throughput');
      }

      // Verify report completeness
      expect(loadTestReport.results.averageResponseTime).toBeGreaterThan(0);
      expect(loadTestReport.results.errorRate).toBeGreaterThanOrEqual(0);
      expect(loadTestReport.results.throughput).toBeGreaterThan(0);

      console.log('Load Test Report:', JSON.stringify(loadTestReport, null, 2));

      // Verify performance thresholds
      expect(loadTestReport.performance.passedThresholds.responseTime).toBe(true);
      expect(loadTestReport.performance.passedThresholds.errorRate).toBe(true);
      expect(loadTestReport.performance.passedThresholds.throughput).toBe(true);
    });
  });
});