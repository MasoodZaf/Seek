/**
 * Comprehensive User Journey End-to-End Tests
 * 
 * Tests complete user workflows from registration to course completion,
 * validating all enhanced features work together seamlessly.
 * 
 * Requirements Coverage:
 * - Requirement 1: Visual Design System Enhancement
 * - Requirement 2: Enhanced User Experience & Ergonomics
 * - Requirement 4: Dashboard & Analytics Enhancement
 * - Requirement 8: Branding & Professional Identity
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import App from '../../App';

// Mock API responses
const mockAPI = {
  auth: {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn()
  },
  tutorials: {
    getTutorials: jest.fn(),
    getTutorial: jest.fn(),
    updateProgress: jest.fn()
  },
  progress: {
    getProgress: jest.fn(),
    updateProgress: jest.fn()
  }
};

// Test wrapper with all providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Complete User Journey E2E Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Reset all mocks
    Object.values(mockAPI).forEach(service => {
      Object.values(service).forEach(method => method.mockReset());
    });
  });

  describe('New User Registration and Onboarding Journey', () => {
    test('should complete full registration to first tutorial workflow', async () => {
      // Mock successful registration
      mockAPI.auth.register.mockResolvedValue({
        success: true,
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
      });

      mockAPI.tutorials.getTutorials.mockResolvedValue([
        {
          id: 1,
          title: 'JavaScript Basics',
          difficulty: 'Beginner',
          progress: 0,
          estimatedTime: '30 minutes'
        }
      ]);

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Navigate to registration
      const getStartedButton = await screen.findByRole('button', { name: /get started/i });
      expect(getStartedButton).toHaveClass('gradient', 'animate'); // Requirement 1: Enhanced design
      await user.click(getStartedButton);

      // Step 2: Fill registration form with enhanced UI
      const nameInput = await screen.findByLabelText(/name/i);
      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);

      // Validate enhanced form styling (Requirement 5: Component standardization)
      expect(nameInput).toHaveClass('enhanced-input');
      expect(emailInput).toHaveClass('enhanced-input');
      expect(passwordInput).toHaveClass('enhanced-input');

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Step 3: Submit registration
      const registerButton = screen.getByRole('button', { name: /create account/i });
      await user.click(registerButton);

      // Step 4: Verify successful registration and redirect to dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome to seek/i)).toBeInTheDocument();
      });

      // Step 5: Validate dashboard elements (Requirement 4: Dashboard enhancement)
      const heroSection = await screen.findByTestId('hero-section');
      expect(heroSection).toHaveClass('gradient-background');
      
      const progressOverview = await screen.findByTestId('progress-overview');
      expect(progressOverview).toBeInTheDocument();

      const tutorialGrid = await screen.findByTestId('tutorial-grid');
      expect(tutorialGrid).toBeInTheDocument();

      // Step 6: Start first tutorial
      const firstTutorial = await within(tutorialGrid).findByText('JavaScript Basics');
      await user.click(firstTutorial);

      // Step 7: Verify tutorial page loads with enhanced UI
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      });

      const codeEditor = await screen.findByTestId('code-editor');
      expect(codeEditor).toHaveClass('professional-theme');

      // Validate complete journey success
      expect(mockAPI.auth.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    test('should handle registration errors gracefully with professional messaging', async () => {
      // Mock registration error
      mockAPI.auth.register.mockRejectedValue({
        message: 'Email already exists'
      });

      render(<App />, { wrapper: TestWrapper });

      const getStartedButton = await screen.findByRole('button', { name: /get started/i });
      await user.click(getStartedButton);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const registerButton = screen.getByRole('button', { name: /create account/i });
      await user.click(registerButton);

      // Verify professional error handling (Requirement 8: Professional identity)
      const errorMessage = await screen.findByTestId('error-state');
      expect(errorMessage).toHaveClass('professional-error');
      expect(errorMessage).toHaveTextContent(/email already exists/i);
      
      const retryButton = within(errorMessage).getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Returning User Login and Progress Journey', () => {
    test('should complete login to dashboard to tutorial continuation workflow', async () => {
      // Mock successful login with existing progress
      mockAPI.auth.login.mockResolvedValue({
        success: true,
        user: { 
          id: 1, 
          name: 'Returning User', 
          email: 'returning@example.com',
          progress: {
            totalXP: 1250,
            level: 3,
            streak: 7,
            completedTutorials: 5
          }
        }
      });

      mockAPI.progress.getProgress.mockResolvedValue({
        currentTutorial: {
          id: 2,
          title: 'Advanced JavaScript',
          progress: 65,
          lastPosition: 'functions-chapter'
        },
        achievements: [
          { id: 1, name: 'First Steps', unlocked: true },
          { id: 2, name: 'Code Warrior', unlocked: true }
        ]
      });

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Navigate to login
      const loginButton = await screen.findByRole('button', { name: /sign in/i });
      await user.click(loginButton);

      // Step 2: Login with credentials
      await user.type(screen.getByLabelText(/email/i), 'returning@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Step 3: Verify dashboard loads with user progress (Requirement 4)
      await waitFor(() => {
        expect(screen.getByText(/welcome back, returning user/i)).toBeInTheDocument();
      });

      // Validate progress visualizations
      const xpDisplay = await screen.findByTestId('xp-progress');
      expect(xpDisplay).toHaveTextContent('1250 XP');
      
      const levelDisplay = await screen.findByTestId('level-display');
      expect(levelDisplay).toHaveTextContent('Level 3');
      
      const streakDisplay = await screen.findByTestId('streak-indicator');
      expect(streakDisplay).toHaveTextContent('7 day streak');
      expect(streakDisplay).toHaveClass('fire-animation'); // Enhanced animations

      // Step 4: Continue current tutorial
      const continueButton = await screen.findByRole('button', { name: /continue learning/i });
      expect(continueButton).toHaveClass('gradient', 'pulse-animation');
      await user.click(continueButton);

      // Step 5: Verify tutorial resumes at correct position
      await waitFor(() => {
        expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
      });

      const progressBar = await screen.findByTestId('tutorial-progress');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
      
      // Validate journey completion
      expect(mockAPI.auth.login).toHaveBeenCalled();
      expect(mockAPI.progress.getProgress).toHaveBeenCalled();
    });
  });

  describe('Achievement and Gamification Journey', () => {
    test('should complete tutorial and unlock achievement with celebrations', async () => {
      // Mock tutorial completion
      mockAPI.tutorials.updateProgress.mockResolvedValue({
        success: true,
        completed: true,
        newAchievements: [
          { id: 3, name: 'JavaScript Master', description: 'Completed JavaScript Basics' }
        ],
        xpGained: 100
      });

      // Start with user in tutorial
      render(<App />, { wrapper: TestWrapper });
      
      // Simulate being in a tutorial near completion
      const completeButton = await screen.findByRole('button', { name: /complete tutorial/i });
      await user.click(completeButton);

      // Step 1: Verify completion animation and feedback (Requirement 2: UX enhancement)
      const completionAnimation = await screen.findByTestId('completion-celebration');
      expect(completionAnimation).toHaveClass('confetti-animation');

      // Step 2: Verify achievement unlock animation (Requirement 4: Dashboard enhancement)
      const achievementUnlock = await screen.findByTestId('achievement-unlock');
      expect(achievementUnlock).toHaveClass('unlock-animation');
      expect(achievementUnlock).toHaveTextContent('JavaScript Master');

      // Step 3: Verify XP gain animation
      const xpGain = await screen.findByTestId('xp-gain-animation');
      expect(xpGain).toHaveTextContent('+100 XP');
      expect(xpGain).toHaveClass('bounce-in');

      // Step 4: Verify dashboard updates with new progress
      await waitFor(() => {
        const updatedProgress = screen.getByTestId('progress-overview');
        expect(updatedProgress).toBeInTheDocument();
      });

      expect(mockAPI.tutorials.updateProgress).toHaveBeenCalled();
    });
  });

  describe('Social Sharing and Community Journey', () => {
    test('should complete code sharing workflow with social integration', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Navigate to code playground
      const playgroundLink = await screen.findByRole('link', { name: /playground/i });
      await user.click(playgroundLink);

      // Write some code
      const codeEditor = await screen.findByTestId('monaco-editor');
      await user.click(codeEditor);
      await user.type(codeEditor, 'console.log("Hello, World!");');

      // Share code
      const shareButton = await screen.findByRole('button', { name: /share/i });
      await user.click(shareButton);

      // Verify social sharing modal (Requirement 8: Branding & social integration)
      const shareModal = await screen.findByTestId('social-share-modal');
      expect(shareModal).toBeInTheDocument();

      const twitterShare = within(shareModal).getByRole('button', { name: /share on twitter/i });
      const linkedinShare = within(shareModal).getByRole('button', { name: /share on linkedin/i });
      
      expect(twitterShare).toBeInTheDocument();
      expect(linkedinShare).toBeInTheDocument();

      // Test copy link functionality
      const copyLinkButton = within(shareModal).getByRole('button', { name: /copy link/i });
      await user.click(copyLinkButton);

      const successMessage = await screen.findByText(/link copied to clipboard/i);
      expect(successMessage).toHaveClass('success-notification');
    });
  });

  describe('Error Recovery and Resilience Journey', () => {
    test('should handle network errors gracefully and allow recovery', async () => {
      // Mock network error
      mockAPI.tutorials.getTutorials.mockRejectedValue(new Error('Network error'));

      render(<App />, { wrapper: TestWrapper });

      // Wait for error state to appear
      const errorState = await screen.findByTestId('network-error');
      expect(errorState).toHaveClass('professional-error-state');
      expect(errorState).toHaveTextContent(/connection issue/i);

      // Verify retry functionality
      const retryButton = within(errorState).getByRole('button', { name: /try again/i });
      expect(retryButton).toHaveClass('gradient-button');

      // Mock successful retry
      mockAPI.tutorials.getTutorials.mockResolvedValue([
        { id: 1, title: 'JavaScript Basics', difficulty: 'Beginner' }
      ]);

      await user.click(retryButton);

      // Verify recovery
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Responsiveness Journey', () => {
    test('should maintain performance during intensive interactions', async () => {
      const performanceObserver = jest.fn();
      global.PerformanceObserver = jest.fn().mockImplementation(() => ({
        observe: performanceObserver,
        disconnect: jest.fn()
      }));

      render(<App />, { wrapper: TestWrapper });

      // Simulate rapid navigation and interactions
      const startTime = performance.now();

      // Rapid navigation between sections
      for (let i = 0; i < 5; i++) {
        const dashboardLink = await screen.findByRole('link', { name: /dashboard/i });
        await user.click(dashboardLink);
        
        const playgroundLink = await screen.findByRole('link', { name: /playground/i });
        await user.click(playgroundLink);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Verify performance remains acceptable (Requirement 6: Performance optimization)
      expect(totalTime).toBeLessThan(2000); // Should complete in under 2 seconds

      // Verify animations remain smooth
      const animatedElements = screen.getAllByTestId(/animation/);
      animatedElements.forEach(element => {
        expect(element).not.toHaveClass('animation-lag');
      });
    });
  });
});

// Helper functions for E2E testing
export const waitForAnimation = (element, animationName) => {
  return new Promise(resolve => {
    const handleAnimationEnd = (event) => {
      if (event.animationName === animationName) {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      }
    };
    element.addEventListener('animationend', handleAnimationEnd);
  });
};

export const simulateSlowNetwork = () => {
  // Mock slow network conditions
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((...args) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(originalFetch(...args)), 2000);
    });
  });
};

export const restoreNetwork = () => {
  global.fetch.mockRestore();
};