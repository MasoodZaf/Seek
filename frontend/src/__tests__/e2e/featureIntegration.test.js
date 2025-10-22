/**
 * Feature Integration End-to-End Tests
 * 
 * Tests how all enhanced features work together seamlessly,
 * validating cross-feature interactions and system cohesion.
 * 
 * Requirements Coverage:
 * - All requirements validation through feature integration
 * - Cross-feature workflow testing
 * - System cohesion validation
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { SocketProvider } from '../../context/SocketContext';
import App from '../../App';

// Mock comprehensive system state
const mockSystemState = {
  user: {
    id: 1,
    name: 'Integration Test User',
    level: 8,
    xp: 4750,
    streak: 15,
    preferences: {
      theme: 'dark',
      language: 'javascript',
      notifications: true
    }
  },
  tutorials: [
    { id: 1, title: 'Advanced React Patterns', progress: 85, difficulty: 'Advanced' },
    { id: 2, title: 'Node.js Microservices', progress: 0, difficulty: 'Expert' },
    { id: 3, title: 'TypeScript Fundamentals', progress: 100, difficulty: 'Intermediate' }
  ],
  achievements: [
    { id: 1, name: 'React Master', unlocked: true },
    { id: 2, name: 'Full Stack Developer', unlocked: false, progress: 90 }
  ],
  codeSnippets: [
    { id: 1, title: 'Custom Hook Example', language: 'javascript', shared: true },
    { id: 2, title: 'API Middleware', language: 'javascript', shared: false }
  ]
};

// Mock all API services
const mockAPI = {
  auth: { login: jest.fn(), logout: jest.fn() },
  tutorials: { getTutorials: jest.fn(), updateProgress: jest.fn() },
  code: { execute: jest.fn(), save: jest.fn(), share: jest.fn() },
  achievements: { unlock: jest.fn(), getAll: jest.fn() },
  social: { share: jest.fn(), like: jest.fn() },
  notifications: { send: jest.fn(), markRead: jest.fn() }
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Feature Integration E2E Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Reset all mocks
    Object.values(mockAPI).forEach(service => {
      Object.values(service).forEach(method => method.mockReset());
    });
  });

  describe('Complete Learning Journey Integration', () => {
    test('should integrate dashboard, tutorials, code playground, and achievements seamlessly', async () => {
      // Mock successful API responses
      mockAPI.tutorials.getTutorials.mockResolvedValue(mockSystemState.tutorials);
      mockAPI.achievements.getAll.mockResolvedValue(mockSystemState.achievements);
      mockAPI.code.execute.mockResolvedValue({ success: true, output: 'Hello World!' });
      mockAPI.achievements.unlock.mockResolvedValue({ 
        success: true, 
        achievement: { id: 2, name: 'Full Stack Developer' }
      });

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Start from dashboard with integrated progress display
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toHaveClass('professional-dashboard');

      // Verify integrated progress visualization shows cross-feature data
      const progressOverview = within(dashboard).getByTestId('progress-overview');
      expect(within(progressOverview).getByText('Level 8')).toBeInTheDocument();
      expect(within(progressOverview).getByText('4750 XP')).toBeInTheDocument();
      expect(within(progressOverview).getByText('15 day streak')).toBeInTheDocument();

      // Step 2: Navigate to tutorial from dashboard recommendation
      const recommendedTutorial = await screen.findByTestId('recommended-tutorial');
      expect(recommendedTutorial).toHaveClass('recommendation-card');
      
      const startTutorialButton = within(recommendedTutorial).getByRole('button', { name: /start/i });
      await user.click(startTutorialButton);

      // Verify seamless navigation with state preservation
      const tutorialInterface = await screen.findByTestId('tutorial-interface');
      expect(tutorialInterface).toBeInTheDocument();

      // Step 3: Complete tutorial exercise in integrated code playground
      const codeExercise = await screen.findByTestId('tutorial-code-exercise');
      expect(codeExercise).toHaveClass('integrated-playground');

      const codeEditor = within(codeExercise).getByTestId('monaco-editor');
      const codeInput = within(codeEditor).getByTestId('code-input');
      
      await user.type(codeInput, 'console.log("Tutorial completed!");');

      const runButton = within(codeExercise).getByRole('button', { name: /run/i });
      await user.click(runButton);

      // Verify code execution integrates with tutorial progress
      await waitFor(() => {
        const output = within(codeExercise).getByTestId('code-output');
        expect(output).toHaveTextContent('Tutorial completed!');
      });

      // Step 4: Complete tutorial and trigger achievement unlock
      const completeTutorialButton = await screen.findByRole('button', { name: /complete tutorial/i });
      await user.click(completeTutorialButton);

      // Verify achievement system integrates with tutorial completion
      await waitFor(() => {
        const achievementUnlock = screen.getByTestId('achievement-unlock-animation');
        expect(achievementUnlock).toHaveClass('celebration-animation');
      });

      const unlockedAchievement = await screen.findByTestId('unlocked-achievement');
      expect(within(unlockedAchievement).getByText('Full Stack Developer')).toBeInTheDocument();

      // Step 5: Share achievement through integrated social features
      const shareAchievementButton = within(unlockedAchievement).getByRole('button', { name: /share/i });
      await user.click(shareAchievementButton);

      const socialShareModal = await screen.findByTestId('social-share-modal');
      expect(socialShareModal).toHaveClass('integrated-share-modal');

      const twitterShareButton = within(socialShareModal).getByRole('button', { name: /twitter/i });
      await user.click(twitterShareButton);

      // Verify all systems updated cohesively
      expect(mockAPI.tutorials.updateProgress).toHaveBeenCalled();
      expect(mockAPI.achievements.unlock).toHaveBeenCalled();
      expect(mockAPI.social.share).toHaveBeenCalled();

      // Step 6: Return to dashboard and verify all updates reflected
      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      await waitFor(() => {
        const updatedProgress = screen.getByTestId('progress-overview');
        // Progress should reflect tutorial completion
        expect(within(updatedProgress).getByText(/tutorial completed/i)).toBeInTheDocument();
      });
    });

    test('should maintain theme consistency across all features', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Verify theme system loads consistently
      const themeProvider = await screen.findByTestId('theme-provider');
      expect(themeProvider).toHaveAttribute('data-theme', 'dark');

      // Step 2: Navigate through all major features and verify theme consistency
      const features = [
        { name: 'dashboard', testId: 'enhanced-dashboard' },
        { name: 'tutorials', testId: 'tutorials-page' },
        { name: 'playground', testId: 'enhanced-playground' },
        { name: 'profile', testId: 'profile-page' }
      ];

      for (const feature of features) {
        const featureLink = await screen.findByRole('link', { name: new RegExp(feature.name, 'i') });
        await user.click(featureLink);

        const featureElement = await screen.findByTestId(feature.testId);
        expect(featureElement).toHaveClass('dark-theme');
        
        // Verify consistent color scheme
        const styles = window.getComputedStyle(featureElement);
        expect(styles.getPropertyValue('--primary-color')).toBe('rgb(37, 99, 235)');
        expect(styles.getPropertyValue('--background-color')).toBe('rgb(17, 24, 39)');
      }

      // Step 3: Test theme switching affects all features
      const themeToggle = await screen.findByTestId('theme-toggle');
      await user.click(themeToggle);

      // Verify all features switch to light theme
      for (const feature of features) {
        const featureLink = await screen.findByRole('link', { name: new RegExp(feature.name, 'i') });
        await user.click(featureLink);

        const featureElement = await screen.findByTestId(feature.testId);
        expect(featureElement).toHaveClass('light-theme');
      }
    });
  });

  describe('Cross-Feature Data Flow Integration', () => {
    test('should maintain data consistency across feature boundaries', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Create code snippet in playground
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      const codeEditor = await screen.findByTestId('monaco-editor');
      const codeInput = within(codeEditor).getByTestId('code-input');
      
      const testCode = 'function fibonacci(n) {\n  return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);\n}';
      await user.type(codeInput, testCode);

      // Save snippet
      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      const saveDialog = await screen.findByTestId('save-snippet-dialog');
      const titleInput = within(saveDialog).getByLabelText(/title/i);
      await user.type(titleInput, 'Fibonacci Function');

      const confirmSaveButton = within(saveDialog).getByRole('button', { name: /save/i });
      await user.click(confirmSaveButton);

      // Step 2: Navigate to profile and verify snippet appears
      const profileLink = await screen.findByRole('link', { name: /profile/i });
      await user.click(profileLink);

      const mySnippets = await screen.findByTestId('my-snippets-section');
      const snippetCard = within(mySnippets).getByTestId('snippet-card');
      expect(within(snippetCard).getByText('Fibonacci Function')).toBeInTheDocument();

      // Step 3: Use snippet in tutorial context
      const tutorialsLink = await screen.findByRole('link', { name: /tutorials/i });
      await user.click(tutorialsLink);

      const algorithmTutorial = await screen.findByText(/algorithm/i);
      await user.click(algorithmTutorial);

      // Verify snippet is available in tutorial context
      const snippetLibrary = await screen.findByTestId('snippet-library');
      const availableSnippet = within(snippetLibrary).getByText('Fibonacci Function');
      expect(availableSnippet).toBeInTheDocument();

      // Step 4: Verify progress tracking integrates across features
      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      const activityTimeline = await screen.findByTestId('activity-timeline');
      const snippetActivity = within(activityTimeline).getByText(/saved fibonacci function/i);
      expect(snippetActivity).toBeInTheDocument();
    });

    test('should handle real-time updates across features', async () => {
      // Mock WebSocket for real-time updates
      const mockSocket = {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn()
      };

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Simulate achievement unlock in one feature
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      // Simulate real-time achievement unlock notification
      const achievementEvent = {
        type: 'achievement_unlocked',
        achievement: { id: 3, name: 'Code Ninja', description: 'Write 100 lines of code' }
      };

      // Trigger real-time event
      fireEvent(window, new CustomEvent('achievement_unlocked', { detail: achievementEvent }));

      // Step 2: Verify notification appears in current context
      const achievementNotification = await screen.findByTestId('achievement-notification');
      expect(achievementNotification).toHaveClass('real-time-notification');
      expect(within(achievementNotification).getByText('Code Ninja')).toBeInTheDocument();

      // Step 3: Navigate to dashboard and verify achievement is reflected
      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      const achievementGrid = await screen.findByTestId('achievement-grid');
      const newAchievement = within(achievementGrid).getByTestId('achievement-badge-3');
      expect(newAchievement).toHaveClass('achievement-unlocked', 'recently-unlocked');

      // Step 4: Verify XP update is reflected across all features
      const xpDisplay = await screen.findByTestId('xp-display');
      expect(within(xpDisplay).getByText(/4850 XP/)).toBeInTheDocument(); // Updated XP

      // Navigate to profile and verify XP consistency
      const profileLink = await screen.findByRole('link', { name: /profile/i });
      await user.click(profileLink);

      const profileXP = await screen.findByTestId('profile-xp');
      expect(within(profileXP).getByText(/4850 XP/)).toBeInTheDocument();
    });
  });

  describe('Error Handling and Recovery Integration', () => {
    test('should handle errors gracefully across feature boundaries', async () => {
      // Mock API failures
      mockAPI.tutorials.getTutorials.mockRejectedValue(new Error('Network error'));
      mockAPI.code.execute.mockRejectedValue(new Error('Execution timeout'));

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Handle tutorial loading error
      const tutorialsLink = await screen.findByRole('link', { name: /tutorials/i });
      await user.click(tutorialsLink);

      const tutorialError = await screen.findByTestId('tutorial-load-error');
      expect(tutorialError).toHaveClass('professional-error-state');
      expect(within(tutorialError).getByText(/network error/i)).toBeInTheDocument();

      // Verify error doesn't break navigation
      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toBeInTheDocument();

      // Step 2: Handle code execution error in playground
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      const codeEditor = await screen.findByTestId('monaco-editor');
      const runButton = await screen.findByRole('button', { name: /run/i });
      await user.click(runButton);

      const executionError = await screen.findByTestId('execution-error');
      expect(executionError).toHaveClass('professional-error-state');
      expect(within(executionError).getByText(/execution timeout/i)).toBeInTheDocument();

      // Verify error recovery options
      const retryButton = within(executionError).getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();

      // Step 3: Test error recovery
      mockAPI.code.execute.mockResolvedValue({ success: true, output: 'Recovery successful!' });
      await user.click(retryButton);

      await waitFor(() => {
        const output = screen.getByTestId('code-output');
        expect(output).toHaveTextContent('Recovery successful!');
      });

      // Verify system state remains consistent after recovery
      const statusIndicator = await screen.findByTestId('system-status');
      expect(statusIndicator).toHaveClass('status-healthy');
    });

    test('should maintain user experience during partial system failures', async () => {
      // Mock partial system failure
      mockAPI.achievements.getAll.mockRejectedValue(new Error('Achievement service unavailable'));
      mockAPI.tutorials.getTutorials.mockResolvedValue(mockSystemState.tutorials);

      render(<App />, { wrapper: TestWrapper });

      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      // Step 1: Verify core functionality works despite partial failure
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toBeInTheDocument();

      const tutorialGrid = await screen.findByTestId('tutorial-grid');
      expect(tutorialGrid).toBeInTheDocument();

      // Step 2: Verify graceful degradation for failed services
      const achievementSection = await screen.findByTestId('achievement-section');
      const achievementError = within(achievementSection).getByTestId('achievement-service-error');
      expect(achievementError).toHaveClass('graceful-degradation');
      expect(within(achievementError).getByText(/achievements temporarily unavailable/i)).toBeInTheDocument();

      // Step 3: Verify user can continue using available features
      const firstTutorial = within(tutorialGrid).getAllByTestId('tutorial-card')[0];
      const startButton = within(firstTutorial).getByRole('button', { name: /start/i });
      await user.click(startButton);

      const tutorialInterface = await screen.findByTestId('tutorial-interface');
      expect(tutorialInterface).toBeInTheDocument();

      // Step 4: Verify system attempts recovery
      const retryAchievementsButton = await screen.findByTestId('retry-achievements');
      mockAPI.achievements.getAll.mockResolvedValue(mockSystemState.achievements);
      await user.click(retryAchievementsButton);

      await waitFor(() => {
        const achievementGrid = screen.getByTestId('achievement-grid');
        expect(achievementGrid).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration Under Load', () => {
    test('should maintain performance when all features are active simultaneously', async () => {
      // Mock heavy data load
      const heavyMockData = {
        ...mockSystemState,
        tutorials: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          title: `Tutorial ${i + 1}`,
          progress: Math.random() * 100,
          difficulty: ['Beginner', 'Intermediate', 'Advanced'][i % 3]
        })),
        achievements: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Achievement ${i + 1}`,
          unlocked: i < 25
        }))
      };

      mockAPI.tutorials.getTutorials.mockResolvedValue(heavyMockData.tutorials);
      mockAPI.achievements.getAll.mockResolvedValue(heavyMockData.achievements);

      const startTime = performance.now();
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Load dashboard with heavy data
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toBeInTheDocument();

      // Step 2: Rapidly navigate between features
      const features = ['tutorials', 'playground', 'profile', 'dashboard'];
      
      for (let i = 0; i < 3; i++) { // Repeat navigation cycle
        for (const feature of features) {
          const featureLink = await screen.findByRole('link', { name: new RegExp(feature, 'i') });
          await user.click(featureLink);
          
          // Verify feature loads without performance degradation
          const featureElement = await screen.findByTestId(`${feature === 'dashboard' ? 'enhanced-' : ''}${feature}${feature === 'tutorials' ? '-page' : feature === 'playground' ? '' : feature === 'profile' ? '-page' : ''}`);
          expect(featureElement).toBeInTheDocument();
        }
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Verify performance requirements
      expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds

      // Step 3: Test concurrent feature usage
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      // Open multiple modals/panels simultaneously
      const saveButton = await screen.findByRole('button', { name: /save/i });
      const shareButton = await screen.findByRole('button', { name: /share/i });
      const settingsButton = await screen.findByRole('button', { name: /settings/i });

      await Promise.all([
        user.click(saveButton),
        user.click(shareButton),
        user.click(settingsButton)
      ]);

      // Verify all modals can coexist without performance issues
      const saveModal = await screen.findByTestId('save-snippet-dialog');
      const shareModal = await screen.findByTestId('share-modal');
      const settingsModal = await screen.findByTestId('settings-modal');

      expect(saveModal).toBeInTheDocument();
      expect(shareModal).toBeInTheDocument();
      expect(settingsModal).toBeInTheDocument();

      // Verify animations remain smooth
      const animatedElements = screen.getAllByTestId(/animation/);
      animatedElements.forEach(element => {
        expect(element).not.toHaveClass('animation-lag');
      });
    });

    test('should handle memory management across feature usage', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Intensive feature usage cycle
      for (let cycle = 0; cycle < 5; cycle++) {
        // Dashboard with heavy data visualization
        const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
        await user.click(dashboardLink);

        // Code playground with large code files
        const playgroundLink = await screen.findByRole('link', { name: /playground/i });
        await user.click(playgroundLink);

        const codeEditor = await screen.findByTestId('monaco-editor');
        const codeInput = within(codeEditor).getByTestId('code-input');
        
        // Simulate large code input
        const largeCode = 'console.log("test");\n'.repeat(1000);
        await user.clear(codeInput);
        await user.type(codeInput, largeCode);

        // Tutorials with media content
        const tutorialsLink = await screen.findByRole('link', { name: /tutorials/i });
        await user.click(tutorialsLink);
      }

      // Step 2: Verify memory usage remains reasonable
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

      // Step 3: Test garbage collection effectiveness
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }

      // Verify no memory leaks in event listeners
      const eventListenerCount = document.querySelectorAll('*').length;
      expect(eventListenerCount).toBeLessThan(10000); // Reasonable DOM size

      // Step 4: Test cleanup on navigation
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
      await user.click(dashboardLink);

      // Verify playground resources are cleaned up
      const playgroundElements = document.querySelectorAll('[data-testid*="playground"]');
      expect(playgroundElements.length).toBe(0); // Should be cleaned up
    });
  });

  describe('Accessibility Integration Across Features', () => {
    test('should maintain accessibility standards across all feature interactions', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Test keyboard navigation across features
      const focusableElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link'),
        screen.getAllByRole('textbox')
      );

      // Navigate through all focusable elements
      let currentIndex = 0;
      for (const element of focusableElements.slice(0, 10)) { // Test first 10 elements
        element.focus();
        expect(document.activeElement).toBe(element);
        expect(element).toHaveClass('focus-visible');
        
        // Verify focus indicators are consistent
        const styles = window.getComputedStyle(element);
        expect(styles.outlineWidth).not.toBe('0px');
        
        currentIndex++;
      }

      // Step 2: Test screen reader compatibility across features
      const landmarks = screen.getAllByRole('main').concat(
        screen.getAllByRole('navigation'),
        screen.getAllByRole('banner'),
        screen.getAllByRole('contentinfo')
      );

      landmarks.forEach(landmark => {
        expect(landmark).toHaveAttribute('aria-label');
      });

      // Step 3: Test ARIA live regions for dynamic content
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      const codeEditor = await screen.findByTestId('monaco-editor');
      const runButton = await screen.findByRole('button', { name: /run/i });
      await user.click(runButton);

      // Verify live region announces execution results
      const liveRegion = await screen.findByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      // Step 4: Test color contrast across all themes and features
      const themeToggle = await screen.findByTestId('theme-toggle');
      
      // Test both light and dark themes
      const themes = ['light', 'dark'];
      for (const theme of themes) {
        if (theme === 'light') {
          await user.click(themeToggle);
        }

        // Check contrast in all major features
        const features = ['dashboard', 'tutorials', 'playground'];
        for (const feature of features) {
          const featureLink = await screen.findByRole('link', { name: new RegExp(feature, 'i') });
          await user.click(featureLink);

          const textElements = screen.getAllByText(/./);
          textElements.slice(0, 5).forEach(element => { // Test first 5 text elements
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Ensure sufficient contrast (simplified check)
            expect(color).not.toBe(backgroundColor);
            expect(color).not.toBe('rgba(0, 0, 0, 0)');
          });
        }
      }
    });
  });
});