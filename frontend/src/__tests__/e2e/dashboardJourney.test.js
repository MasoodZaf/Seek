/**
 * Dashboard and Analytics End-to-End Journey Tests
 * 
 * Tests complete dashboard interaction and progress tracking workflows,
 * validating enhanced visualizations and gamification features.
 * 
 * Requirements Coverage:
 * - Requirement 4: Dashboard & Analytics Enhancement
 * - Requirement 1: Visual Design System Enhancement
 * - Requirement 2: Enhanced User Experience & Ergonomics
 * - Requirement 8: Branding & Professional Identity
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import EnhancedDashboard from '../../components/dashboard/EnhancedDashboard';

// Mock dashboard data
const mockDashboardData = {
  user: {
    id: 1,
    name: 'Test User',
    level: 5,
    xp: 2450,
    xpToNextLevel: 550,
    streak: 12,
    joinDate: '2024-01-15'
  },
  progress: {
    totalTutorials: 25,
    completedTutorials: 18,
    inProgressTutorials: 3,
    averageScore: 87,
    timeSpent: 4320, // minutes
    skillsLearned: ['JavaScript', 'Python', 'React', 'Node.js']
  },
  achievements: [
    { id: 1, name: 'First Steps', description: 'Complete your first tutorial', unlocked: true, unlockedAt: '2024-01-16' },
    { id: 2, name: 'Code Warrior', description: 'Complete 10 tutorials', unlocked: true, unlockedAt: '2024-02-01' },
    { id: 3, name: 'Streak Master', description: 'Maintain a 7-day streak', unlocked: true, unlockedAt: '2024-02-10' },
    { id: 4, name: 'JavaScript Ninja', description: 'Master JavaScript fundamentals', unlocked: false, progress: 75 }
  ],
  recentActivity: [
    { id: 1, type: 'tutorial_completed', title: 'Advanced React Hooks', timestamp: '2024-03-09T10:30:00Z', xpGained: 150 },
    { id: 2, type: 'achievement_unlocked', title: 'Streak Master', timestamp: '2024-03-08T14:20:00Z' },
    { id: 3, type: 'tutorial_started', title: 'Node.js Fundamentals', timestamp: '2024-03-07T16:45:00Z' }
  ],
  recommendations: [
    { id: 1, title: 'Advanced JavaScript Patterns', difficulty: 'Advanced', estimatedTime: 45, reason: 'Based on your JavaScript progress' },
    { id: 2, title: 'React Testing Library', difficulty: 'Intermediate', estimatedTime: 30, reason: 'Complements your React skills' }
  ]
};

// Mock API services
const mockAPI = {
  dashboard: {
    getDashboardData: jest.fn(() => Promise.resolve(mockDashboardData)),
    updateProgress: jest.fn(),
    getRecommendations: jest.fn()
  },
  tutorials: {
    getTutorials: jest.fn(),
    startTutorial: jest.fn(),
    continueTutorial: jest.fn()
  },
  achievements: {
    getAchievements: jest.fn(),
    unlockAchievement: jest.fn()
  }
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

describe('Dashboard Complete Journey E2E Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    Object.values(mockAPI).forEach(service => {
      Object.values(service).forEach(method => {
        if (typeof method === 'function') method.mockReset();
      });
    });
  });

  describe('Dashboard Loading and Visual Hierarchy Journey', () => {
    test('should load dashboard with professional visual hierarchy and animations', async () => {
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify hero section loads with gradient background (Requirement 4.1)
      const heroSection = await screen.findByTestId('hero-section');
      expect(heroSection).toHaveClass('gradient-background', 'professional-hero');
      
      // Verify personalized greeting
      const greeting = within(heroSection).getByTestId('personalized-greeting');
      expect(greeting).toHaveTextContent(/welcome back, test user/i);
      expect(greeting).toHaveClass('hero-text');

      // Step 2: Verify progress overview with animations (Requirement 4.1)
      const progressOverview = await screen.findByTestId('progress-overview');
      expect(progressOverview).toHaveClass('animated-entrance');

      // Verify level display with professional styling
      const levelDisplay = within(progressOverview).getByTestId('level-display');
      expect(levelDisplay).toHaveTextContent('Level 5');
      expect(levelDisplay).toHaveClass('level-badge', 'gradient-text');

      // Verify XP progress with animated bar
      const xpProgress = within(progressOverview).getByTestId('xp-progress-bar');
      expect(xpProgress).toHaveAttribute('aria-valuenow', '2450');
      expect(xpProgress).toHaveAttribute('aria-valuemax', '3000');
      expect(xpProgress).toHaveClass('animated-progress');

      // Step 3: Verify statistics grid with animated counters (Requirement 4.1)
      const statsGrid = await screen.findByTestId('statistics-grid');
      expect(statsGrid).toHaveClass('responsive-grid');

      const statCards = within(statsGrid).getAllByTestId('stat-card');
      expect(statCards).toHaveLength(4); // Completed, In Progress, Average Score, Time Spent

      statCards.forEach(card => {
        expect(card).toHaveClass('enhanced-card', 'hover-animation');
        
        // Verify animated counters
        const counter = within(card).getByTestId('animated-counter');
        expect(counter).toHaveClass('count-up-animation');
      });

      // Step 4: Verify streak indicator with fire animation (Requirement 4.2)
      const streakIndicator = await screen.findByTestId('streak-indicator');
      expect(streakIndicator).toHaveTextContent('12 day streak');
      expect(streakIndicator).toHaveClass('fire-animation', 'streak-active');

      expect(mockAPI.dashboard.getDashboardData).toHaveBeenCalled();
    });

    test('should display loading states with professional branding', async () => {
      // Mock delayed API response
      mockAPI.dashboard.getDashboardData.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockDashboardData), 1000))
      );

      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Verify branded loading states (Requirement 5.4)
      const loadingSpinner = await screen.findByTestId('dashboard-loading');
      expect(loadingSpinner).toHaveClass('branded-spinner', 'professional-loading');

      const loadingText = within(loadingSpinner).getByText(/loading your progress/i);
      expect(loadingText).toHaveClass('loading-message');

      // Verify skeleton loaders match actual content layout
      const skeletonCards = screen.getAllByTestId('skeleton-card');
      expect(skeletonCards.length).toBeGreaterThan(0);
      
      skeletonCards.forEach(skeleton => {
        expect(skeleton).toHaveClass('skeleton-animation', 'card-skeleton');
      });

      // Wait for actual content to load
      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Progress Visualization and Gamification Journey', () => {
    test('should display and interact with progress visualizations', async () => {
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify skill tree visualization (Requirement 4.2)
      const skillTree = await screen.findByTestId('skill-tree');
      expect(skillTree).toHaveClass('interactive-skill-tree');

      const skillNodes = within(skillTree).getAllByTestId('skill-node');
      expect(skillNodes.length).toBe(4); // JavaScript, Python, React, Node.js

      // Test skill node interactions
      const jsNode = skillNodes.find(node => 
        within(node).queryByText('JavaScript')
      );
      expect(jsNode).toHaveClass('skill-completed', 'glow-effect');

      await user.hover(jsNode);
      
      // Verify hover tooltip
      const tooltip = await screen.findByTestId('skill-tooltip');
      expect(tooltip).toHaveTextContent(/javascript/i);
      expect(tooltip).toHaveClass('professional-tooltip');

      // Step 2: Verify learning streak with visual indicators (Requirement 4.2)
      const streakVisualization = await screen.findByTestId('streak-visualization');
      expect(streakVisualization).toHaveClass('streak-calendar');

      const streakDays = within(streakVisualization).getAllByTestId('streak-day');
      expect(streakDays.length).toBe(14); // Show last 2 weeks

      // Verify current streak highlighting
      const activeStreakDays = streakDays.filter(day => 
        day.classList.contains('streak-active')
      );
      expect(activeStreakDays.length).toBe(12);

      // Step 3: Verify XP and level progression animations (Requirement 4.2)
      const xpVisualization = await screen.findByTestId('xp-visualization');
      expect(xpVisualization).toHaveClass('xp-progress-container');

      const progressRing = within(xpVisualization).getByTestId('progress-ring');
      expect(progressRing).toHaveClass('animated-ring');
      
      // Verify progress ring animation
      const progressValue = progressRing.getAttribute('data-progress');
      expect(parseFloat(progressValue)).toBeCloseTo(81.67, 1); // 2450/3000 * 100

      // Step 4: Test milestone celebration trigger
      const milestoneButton = await screen.findByTestId('milestone-trigger');
      await user.click(milestoneButton);

      const celebration = await screen.findByTestId('milestone-celebration');
      expect(celebration).toHaveClass('confetti-animation', 'celebration-modal');
      
      const celebrationText = within(celebration).getByText(/congratulations/i);
      expect(celebrationText).toBeInTheDocument();
    });

    test('should handle achievement system with unlock animations', async () => {
      // Mock achievement unlock
      mockAPI.achievements.unlockAchievement.mockResolvedValue({
        success: true,
        achievement: {
          id: 4,
          name: 'JavaScript Ninja',
          description: 'Master JavaScript fundamentals',
          unlocked: true,
          unlockedAt: new Date().toISOString()
        }
      });

      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify achievement grid display (Requirement 4.3)
      const achievementGrid = await screen.findByTestId('achievement-grid');
      expect(achievementGrid).toHaveClass('achievement-showcase');

      const achievementBadges = within(achievementGrid).getAllByTestId('achievement-badge');
      expect(achievementBadges.length).toBe(4);

      // Verify unlocked achievements styling
      const unlockedBadges = achievementBadges.filter(badge => 
        badge.classList.contains('achievement-unlocked')
      );
      expect(unlockedBadges.length).toBe(3);

      // Verify locked achievement styling
      const lockedBadge = achievementBadges.find(badge => 
        badge.classList.contains('achievement-locked')
      );
      expect(lockedBadge).toBeInTheDocument();

      // Step 2: Test achievement unlock animation
      const progressBar = within(lockedBadge).getByTestId('achievement-progress');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');

      // Simulate achievement unlock
      fireEvent.click(lockedBadge);

      // Verify unlock animation sequence (Requirement 4.3)
      await waitFor(() => {
        const unlockAnimation = screen.getByTestId('achievement-unlock-animation');
        expect(unlockAnimation).toHaveClass('particle-explosion');
      });

      const unlockModal = await screen.findByTestId('achievement-unlock-modal');
      expect(unlockModal).toHaveClass('celebration-modal');
      
      const badgeDisplay = within(unlockModal).getByTestId('unlocked-badge');
      expect(badgeDisplay).toHaveClass('badge-glow', 'scale-animation');

      // Step 3: Test achievement sharing (Requirement 4.3, 8.3)
      const shareButton = within(unlockModal).getByRole('button', { name: /share achievement/i });
      await user.click(shareButton);

      const shareModal = await screen.findByTestId('achievement-share-modal');
      expect(shareModal).toHaveClass('social-share-modal');

      const socialButtons = within(shareModal).getAllByTestId('social-share-button');
      expect(socialButtons.length).toBeGreaterThan(0);

      expect(mockAPI.achievements.unlockAchievement).toHaveBeenCalledWith(4);
    });
  });

  describe('Tutorial Discovery and Recommendation Journey', () => {
    test('should display and interact with tutorial grid and recommendations', async () => {
      mockAPI.tutorials.getTutorials.mockResolvedValue([
        { id: 1, title: 'React Hooks Deep Dive', difficulty: 'Advanced', progress: 0, estimatedTime: 60 },
        { id: 2, title: 'JavaScript ES6+', difficulty: 'Intermediate', progress: 45, estimatedTime: 40 },
        { id: 3, title: 'Node.js API Development', difficulty: 'Advanced', progress: 0, estimatedTime: 90 }
      ]);

      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify tutorial grid with enhanced cards (Requirement 4.4)
      const tutorialGrid = await screen.findByTestId('tutorial-grid');
      expect(tutorialGrid).toHaveClass('responsive-tutorial-grid');

      const tutorialCards = within(tutorialGrid).getAllByTestId('tutorial-card');
      expect(tutorialCards.length).toBeGreaterThan(0);

      tutorialCards.forEach(card => {
        expect(card).toHaveClass('enhanced-tutorial-card', 'hover-transform');
        
        // Verify card components
        const cardHeader = within(card).getByTestId('card-header');
        const difficultyBadge = within(card).getByTestId('difficulty-badge');
        const progressIndicator = within(card).getByTestId('progress-indicator');
        
        expect(cardHeader).toBeInTheDocument();
        expect(difficultyBadge).toHaveClass('difficulty-badge');
        expect(progressIndicator).toHaveClass('circular-progress');
      });

      // Step 2: Test tutorial filtering and search (Requirement 4.4)
      const filterSection = await screen.findByTestId('tutorial-filters');
      expect(filterSection).toHaveClass('filter-controls');

      const searchInput = within(filterSection).getByLabelText(/search tutorials/i);
      expect(searchInput).toHaveClass('enhanced-search-input');

      await user.type(searchInput, 'React');

      // Verify instant search results
      await waitFor(() => {
        const filteredCards = within(tutorialGrid).getAllByTestId('tutorial-card');
        const reactCards = filteredCards.filter(card => 
          within(card).queryByText(/react/i)
        );
        expect(reactCards.length).toBeGreaterThan(0);
      });

      // Test difficulty filter
      const difficultyFilter = within(filterSection).getByTestId('difficulty-filter');
      await user.click(difficultyFilter);
      
      const advancedOption = await screen.findByRole('option', { name: /advanced/i });
      await user.click(advancedOption);

      await waitFor(() => {
        const advancedCards = within(tutorialGrid).getAllByTestId('tutorial-card');
        advancedCards.forEach(card => {
          const badge = within(card).getByTestId('difficulty-badge');
          expect(badge).toHaveTextContent(/advanced/i);
        });
      });

      // Step 3: Verify personalized recommendations (Requirement 4.4)
      const recommendationSection = await screen.findByTestId('recommendations-section');
      expect(recommendationSection).toHaveClass('recommendations-showcase');

      const recommendedCards = within(recommendationSection).getAllByTestId('recommendation-card');
      expect(recommendedCards.length).toBe(2);

      recommendedCards.forEach(card => {
        expect(card).toHaveClass('recommendation-card', 'glow-border');
        
        const reasonText = within(card).getByTestId('recommendation-reason');
        expect(reasonText).toHaveClass('recommendation-reason');
      });

      // Step 4: Test tutorial start workflow
      const firstTutorial = tutorialCards[0];
      const startButton = within(firstTutorial).getByRole('button', { name: /start/i });
      expect(startButton).toHaveClass('gradient-button', 'start-button');

      await user.click(startButton);

      // Verify navigation to tutorial
      expect(mockAPI.tutorials.startTutorial).toHaveBeenCalled();
    });

    test('should handle tutorial continuation workflow', async () => {
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify continue learning section
      const continueSection = await screen.findByTestId('continue-learning-section');
      expect(continueSection).toHaveClass('continue-section');

      const continueCard = within(continueSection).getByTestId('continue-tutorial-card');
      expect(continueCard).toHaveClass('continue-card', 'pulse-glow');

      // Verify progress display
      const progressDisplay = within(continueCard).getByTestId('tutorial-progress');
      expect(progressDisplay).toHaveAttribute('aria-valuenow', '45');
      expect(progressDisplay).toHaveClass('animated-progress');

      // Step 2: Test continue button interaction
      const continueButton = within(continueCard).getByRole('button', { name: /continue/i });
      expect(continueButton).toHaveClass('continue-button', 'gradient-pulse');

      await user.click(continueButton);

      // Verify tutorial continuation
      expect(mockAPI.tutorials.continueTutorial).toHaveBeenCalledWith(2);

      // Step 3: Verify recent activity timeline
      const activityTimeline = await screen.findByTestId('recent-activity-timeline');
      expect(activityTimeline).toHaveClass('activity-timeline');

      const activityItems = within(activityTimeline).getAllByTestId('activity-item');
      expect(activityItems.length).toBe(3);

      activityItems.forEach((item, index) => {
        expect(item).toHaveClass('timeline-item', 'fade-in-animation');
        
        const timestamp = within(item).getByTestId('activity-timestamp');
        expect(timestamp).toHaveClass('relative-time');
        
        const activityIcon = within(item).getByTestId('activity-icon');
        expect(activityIcon).toHaveClass('activity-icon');
      });
    });
  });

  describe('Responsive and Mobile Dashboard Journey', () => {
    test('should adapt dashboard layout for mobile devices', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      // Trigger resize event
      fireEvent(window, new Event('resize'));

      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Step 1: Verify mobile-optimized layout (Requirement 7.4)
      const dashboard = await screen.findByTestId('enhanced-dashboard');
      expect(dashboard).toHaveClass('mobile-dashboard');

      const mobileHero = within(dashboard).getByTestId('mobile-hero-section');
      expect(mobileHero).toHaveClass('mobile-hero', 'compact-layout');

      // Step 2: Verify mobile statistics cards
      const mobileStatsGrid = await screen.findByTestId('mobile-stats-grid');
      expect(mobileStatsGrid).toHaveClass('mobile-grid', 'swipe-container');

      const mobileStatCards = within(mobileStatsGrid).getAllByTestId('mobile-stat-card');
      mobileStatCards.forEach(card => {
        expect(card).toHaveClass('mobile-card', 'touch-friendly');
        
        // Verify touch target size
        const cardRect = card.getBoundingClientRect();
        expect(cardRect.height).toBeGreaterThanOrEqual(44);
      });

      // Step 3: Test mobile swipe navigation
      const swipeContainer = await screen.findByTestId('mobile-swipe-container');
      
      // Simulate swipe gesture
      fireEvent.touchStart(swipeContainer, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      fireEvent.touchMove(swipeContainer, {
        touches: [{ clientX: 200, clientY: 100 }]
      });
      
      fireEvent.touchEnd(swipeContainer, {
        changedTouches: [{ clientX: 200, clientY: 100 }]
      });

      // Verify swipe navigation
      await waitFor(() => {
        const nextSection = screen.getByTestId('next-dashboard-section');
        expect(nextSection).toHaveClass('active-section');
      });

      // Step 4: Verify mobile tutorial grid
      const mobileTutorialGrid = await screen.findByTestId('mobile-tutorial-grid');
      expect(mobileTutorialGrid).toHaveClass('mobile-tutorial-layout');

      const mobileTutorialCards = within(mobileTutorialGrid).getAllByTestId('mobile-tutorial-card');
      mobileTutorialCards.forEach(card => {
        expect(card).toHaveClass('mobile-tutorial-card', 'stack-layout');
      });
    });

    test('should handle mobile pull-to-refresh functionality', async () => {
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      const pullToRefresh = await screen.findByTestId('pull-to-refresh');
      expect(pullToRefresh).toHaveClass('mobile-pull-refresh');

      // Simulate pull-to-refresh gesture
      fireEvent.touchStart(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 50 }]
      });
      
      fireEvent.touchMove(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify pull indicator
      await waitFor(() => {
        const pullIndicator = screen.getByTestId('pull-indicator');
        expect(pullIndicator).toHaveClass('pull-active');
      });

      fireEvent.touchEnd(pullToRefresh, {
        changedTouches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify refresh trigger
      await waitFor(() => {
        const refreshSpinner = screen.getByTestId('refresh-spinner');
        expect(refreshSpinner).toHaveClass('refresh-animation');
      });

      // Verify data refresh
      expect(mockAPI.dashboard.getDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance and Accessibility Dashboard Journey', () => {
    test('should maintain performance with large datasets', async () => {
      // Mock large dataset
      const largeMockData = {
        ...mockDashboardData,
        achievements: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Achievement ${i + 1}`,
          description: `Description for achievement ${i + 1}`,
          unlocked: i < 25,
          progress: Math.random() * 100
        })),
        recentActivity: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          type: 'tutorial_completed',
          title: `Tutorial ${i + 1}`,
          timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          xpGained: Math.floor(Math.random() * 200) + 50
        }))
      };

      mockAPI.dashboard.getDashboardData.mockResolvedValue(largeMockData);

      const startTime = performance.now();
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Wait for dashboard to fully load
      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Verify performance requirements (Requirement 6.1)
      expect(loadTime).toBeLessThan(2000); // Should load in under 2 seconds

      // Verify virtual scrolling for large lists
      const activityTimeline = await screen.findByTestId('recent-activity-timeline');
      const visibleItems = within(activityTimeline).getAllByTestId('activity-item');
      
      // Should only render visible items, not all 100
      expect(visibleItems.length).toBeLessThan(20);
      expect(visibleItems.length).toBeGreaterThan(0);

      // Verify achievement grid virtualization
      const achievementGrid = await screen.findByTestId('achievement-grid');
      const visibleAchievements = within(achievementGrid).getAllByTestId('achievement-badge');
      
      // Should only render visible achievements
      expect(visibleAchievements.length).toBeLessThan(50);
      expect(visibleAchievements.length).toBeGreaterThan(0);
    });

    test('should provide comprehensive keyboard accessibility', async () => {
      render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Test keyboard navigation through dashboard sections
      const focusableElements = [
        'hero-section',
        'continue-learning-button',
        'tutorial-search-input',
        'achievement-grid',
        'activity-timeline'
      ];

      // Start navigation
      const firstElement = await screen.findByTestId(focusableElements[0]);
      firstElement.focus();

      // Navigate through all sections with Tab
      for (let i = 1; i < focusableElements.length; i++) {
        await user.tab();
        
        const currentElement = await screen.findByTestId(focusableElements[i]);
        expect(document.activeElement).toBe(currentElement);
        expect(currentElement).toHaveClass('focus-visible');
      }

      // Test keyboard shortcuts
      await user.keyboard('{Control>}k{/Control}'); // Quick search
      
      const searchModal = await screen.findByTestId('quick-search-modal');
      expect(searchModal).toBeInTheDocument();
      expect(document.activeElement).toBe(
        within(searchModal).getByRole('textbox')
      );

      // Test Escape to close modal
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByTestId('quick-search-modal')).not.toBeInTheDocument();
      });

      // Test arrow key navigation in grids
      const tutorialGrid = await screen.findByTestId('tutorial-grid');
      const firstCard = within(tutorialGrid).getAllByTestId('tutorial-card')[0];
      firstCard.focus();

      await user.keyboard('{ArrowRight}');
      
      const secondCard = within(tutorialGrid).getAllByTestId('tutorial-card')[1];
      expect(document.activeElement).toBe(secondCard);
    });

    test('should meet WCAG 2.1 AA accessibility standards', async () => {
      const { container } = render(<EnhancedDashboard />, { wrapper: TestWrapper });

      // Test semantic HTML structure
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();

      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);

      // Verify heading hierarchy
      const h1 = container.querySelector('h1');
      const h2s = container.querySelectorAll('h2');
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);

      // Test ARIA labels and descriptions
      const progressBars = container.querySelectorAll('[role="progressbar"]');
      progressBars.forEach(progressBar => {
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin');
        expect(progressBar).toHaveAttribute('aria-valuemax');
        expect(progressBar).toHaveAttribute('aria-label');
      });

      // Test color contrast (simplified check)
      const textElements = container.querySelectorAll('p, span, div');
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Ensure text has sufficient contrast
        expect(color).not.toBe(backgroundColor);
      });

      // Test focus management
      const interactiveElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      interactiveElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });

      // Test screen reader content
      const srOnlyElements = container.querySelectorAll('.sr-only');
      expect(srOnlyElements.length).toBeGreaterThan(0);
    });
  });
});