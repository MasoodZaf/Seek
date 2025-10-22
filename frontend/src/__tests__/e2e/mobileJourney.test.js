/**
 * Mobile Experience End-to-End Journey Tests
 * 
 * Tests complete mobile user journeys with touch interactions,
 * responsive design, and mobile-specific optimizations.
 * 
 * Requirements Coverage:
 * - Requirement 7: Mobile Experience Excellence
 * - Requirement 2: Enhanced User Experience & Ergonomics
 * - Requirement 6: Performance & Accessibility Optimization
 * - Requirement 3: Code Playground Professional Polish (Mobile)
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import App from '../../App';

// Mock mobile environment
const mockMobileEnvironment = () => {
  // Mock mobile viewport
  Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
  
  // Mock touch device
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
  Object.defineProperty(navigator, 'userAgent', { 
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    configurable: true 
  });

  // Mock device pixel ratio
  Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

  // Mock orientation
  Object.defineProperty(screen, 'orientation', {
    value: { angle: 0, type: 'portrait-primary' },
    configurable: true
  });
};

// Mock tablet environment
const mockTabletEnvironment = () => {
  Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 10, configurable: true });
};

// Mock haptic feedback
const mockHapticFeedback = jest.fn();
Object.defineProperty(navigator, 'vibrate', { value: mockHapticFeedback, configurable: true });

// Mock native share API
const mockNativeShare = jest.fn();
Object.defineProperty(navigator, 'share', { value: mockNativeShare, configurable: true });

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Mobile Experience Complete Journey E2E Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockMobileEnvironment();
    mockHapticFeedback.mockReset();
    mockNativeShare.mockReset();
  });

  afterEach(() => {
    // Reset viewport
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
  });

  describe('Mobile Navigation and Touch Interactions Journey', () => {
    test('should provide touch-friendly navigation with proper touch targets', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Verify mobile navigation loads (Requirement 7.3)
      const mobileNav = await screen.findByTestId('mobile-navigation');
      expect(mobileNav).toHaveClass('mobile-nav', 'touch-optimized');

      // Verify bottom navigation for mobile
      const bottomNav = await screen.findByTestId('bottom-navigation');
      expect(bottomNav).toHaveClass('bottom-nav', 'mobile-sticky');

      const navItems = within(bottomNav).getAllByTestId('nav-item');
      expect(navItems.length).toBeGreaterThan(0);

      // Verify touch target sizes (Requirement 7.1)
      navItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44); // Minimum 44px touch target
        expect(rect.height).toBeGreaterThanOrEqual(44);
        expect(item).toHaveClass('touch-target');
      });

      // Step 2: Test mobile header with collapsible elements
      const mobileHeader = await screen.findByTestId('mobile-header');
      expect(mobileHeader).toHaveClass('mobile-header', 'compact-header');

      const hamburgerButton = within(mobileHeader).getByTestId('hamburger-menu');
      expect(hamburgerButton).toHaveClass('hamburger-button', 'touch-friendly');

      // Test hamburger menu interaction
      await user.click(hamburgerButton);

      const slideOutMenu = await screen.findByTestId('slide-out-menu');
      expect(slideOutMenu).toHaveClass('slide-animation', 'mobile-menu');

      // Verify menu items have proper spacing for touch
      const menuItems = within(slideOutMenu).getAllByTestId('menu-item');
      menuItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(48); // Comfortable touch spacing
        expect(item).toHaveClass('mobile-menu-item');
      });

      // Step 3: Test swipe gestures for navigation (Requirement 7.1)
      const swipeContainer = await screen.findByTestId('swipe-navigation-container');
      
      // Simulate swipe right to open sidebar
      fireEvent.touchStart(swipeContainer, {
        touches: [{ clientX: 10, clientY: 300 }]
      });
      
      fireEvent.touchMove(swipeContainer, {
        touches: [{ clientX: 150, clientY: 300 }]
      });
      
      fireEvent.touchEnd(swipeContainer, {
        changedTouches: [{ clientX: 150, clientY: 300 }]
      });

      // Verify swipe gesture opens sidebar
      await waitFor(() => {
        const sidebar = screen.getByTestId('mobile-sidebar');
        expect(sidebar).toHaveClass('sidebar-open', 'swipe-opened');
      });

      // Verify haptic feedback on swipe (Requirement 7.1)
      expect(mockHapticFeedback).toHaveBeenCalledWith([10]); // Light haptic feedback
    });

    test('should handle mobile search and filtering with touch optimization', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Navigate to tutorials page
      const tutorialsTab = await screen.findByRole('tab', { name: /tutorials/i });
      await user.click(tutorialsTab);

      // Step 1: Verify mobile search interface
      const mobileSearch = await screen.findByTestId('mobile-search');
      expect(mobileSearch).toHaveClass('mobile-search-container');

      const searchInput = within(mobileSearch).getByRole('textbox', { name: /search/i });
      expect(searchInput).toHaveClass('mobile-search-input', 'touch-friendly');

      // Verify search input has proper mobile keyboard
      expect(searchInput).toHaveAttribute('inputmode', 'search');

      // Step 2: Test mobile filter interface
      const filterButton = await screen.findByTestId('mobile-filter-button');
      expect(filterButton).toHaveClass('filter-button', 'mobile-button');

      await user.click(filterButton);

      const filterModal = await screen.findByTestId('mobile-filter-modal');
      expect(filterModal).toHaveClass('mobile-modal', 'slide-up-animation');

      // Verify filter options are touch-friendly
      const filterOptions = within(filterModal).getAllByTestId('filter-option');
      filterOptions.forEach(option => {
        const rect = option.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
        expect(option).toHaveClass('touch-checkbox');
      });

      // Step 3: Test mobile sorting with touch gestures
      const sortButton = await screen.findByTestId('mobile-sort-button');
      await user.click(sortButton);

      const sortOptions = await screen.findByTestId('mobile-sort-options');
      expect(sortOptions).toHaveClass('mobile-sort-menu');

      // Test drag-to-reorder functionality
      const sortItems = within(sortOptions).getAllByTestId('sort-item');
      const firstItem = sortItems[0];
      const secondItem = sortItems[1];

      // Simulate drag gesture
      fireEvent.touchStart(firstItem, {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      fireEvent.touchMove(firstItem, {
        touches: [{ clientX: 100, clientY: 150 }]
      });

      fireEvent.touchEnd(firstItem, {
        changedTouches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify reorder with haptic feedback
      expect(mockHapticFeedback).toHaveBeenCalledWith([20]); // Medium haptic feedback
    });
  });

  describe('Mobile Code Editing and Playground Journey', () => {
    test('should provide optimized mobile code editing experience', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Navigate to playground
      const playgroundTab = await screen.findByRole('tab', { name: /playground/i });
      await user.click(playgroundTab);

      // Step 1: Verify mobile code editor loads (Requirement 7.2)
      const mobileCodeEditor = await screen.findByTestId('mobile-code-editor');
      expect(mobileCodeEditor).toHaveClass('mobile-editor', 'touch-optimized');

      // Verify mobile-specific editor controls
      const mobileControls = within(mobileCodeEditor).getByTestId('mobile-editor-controls');
      expect(mobileControls).toHaveClass('mobile-controls', 'sticky-controls');

      const controlButtons = within(mobileControls).getAllByRole('button');
      controlButtons.forEach(button => {
        const rect = button.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });

      // Step 2: Test mobile code templates and snippets (Requirement 7.2)
      const templatesButton = await screen.findByTestId('mobile-templates-button');
      await user.click(templatesButton);

      const templatesPanel = await screen.findByTestId('mobile-templates-panel');
      expect(templatesPanel).toHaveClass('mobile-panel', 'slide-up');

      const templateCards = within(templatesPanel).getAllByTestId('template-card');
      templateCards.forEach(card => {
        expect(card).toHaveClass('mobile-template-card', 'touch-card');
        
        // Verify template preview is readable on mobile
        const preview = within(card).getByTestId('template-preview');
        expect(preview).toHaveClass('mobile-code-preview');
      });

      // Test template insertion
      const firstTemplate = templateCards[0];
      await user.click(firstTemplate);

      // Verify template inserts into editor
      const codeTextarea = await screen.findByTestId('mobile-code-textarea');
      expect(codeTextarea.value).not.toBe('');

      // Step 3: Test mobile virtual keyboard optimization
      await user.click(codeTextarea);

      // Verify keyboard toolbar appears
      const keyboardToolbar = await screen.findByTestId('mobile-keyboard-toolbar');
      expect(keyboardToolbar).toHaveClass('keyboard-toolbar', 'mobile-sticky');

      const quickInsertButtons = within(keyboardToolbar).getAllByTestId('quick-insert-button');
      expect(quickInsertButtons.length).toBeGreaterThan(0);

      // Test quick insert functionality
      const bracesButton = quickInsertButtons.find(btn => 
        within(btn).queryByText('{}')
      );
      await user.click(bracesButton);

      // Verify braces inserted with cursor positioning
      expect(codeTextarea.value).toContain('{}');

      // Step 4: Test mobile code execution with optimized output
      const mobileRunButton = await screen.findByTestId('mobile-run-button');
      expect(mobileRunButton).toHaveClass('mobile-run-button', 'prominent-button');

      await user.click(mobileRunButton);

      // Verify mobile output panel
      const mobileOutput = await screen.findByTestId('mobile-output-panel');
      expect(mobileOutput).toHaveClass('mobile-output', 'expandable-panel');

      // Test output panel expansion
      const expandButton = within(mobileOutput).getByTestId('expand-output-button');
      await user.click(expandButton);

      await waitFor(() => {
        expect(mobileOutput).toHaveClass('expanded');
      });
    });

    test('should handle mobile code sharing with native integration', async () => {
      mockNativeShare.mockResolvedValue(true);

      render(<App />, { wrapper: TestWrapper });

      // Navigate to playground and write code
      const playgroundTab = await screen.findByRole('tab', { name: /playground/i });
      await user.click(playgroundTab);

      const codeTextarea = await screen.findByTestId('mobile-code-textarea');
      await user.type(codeTextarea, 'console.log("Hello Mobile!");');

      // Step 1: Test mobile share interface (Requirement 7.2)
      const mobileShareButton = await screen.findByTestId('mobile-share-button');
      expect(mobileShareButton).toHaveClass('mobile-share-button');

      await user.click(mobileShareButton);

      const mobileShareModal = await screen.findByTestId('mobile-share-modal');
      expect(mobileShareModal).toHaveClass('mobile-share-modal', 'bottom-sheet');

      // Step 2: Test native share API integration
      const nativeShareButton = within(mobileShareModal).getByTestId('native-share-button');
      expect(nativeShareButton).toHaveClass('native-share-button');

      await user.click(nativeShareButton);

      // Verify native share API called
      expect(mockNativeShare).toHaveBeenCalledWith({
        title: 'My Code Snippet',
        text: 'Check out my code on Seek!',
        url: expect.stringContaining('seek.com')
      });

      // Step 3: Test mobile-specific sharing options
      const copyLinkButton = within(mobileShareModal).getByTestId('mobile-copy-link');
      await user.click(copyLinkButton);

      // Verify haptic feedback on copy
      expect(mockHapticFeedback).toHaveBeenCalledWith([15]);

      const copySuccess = await screen.findByTestId('copy-success-toast');
      expect(copySuccess).toHaveClass('mobile-toast', 'slide-in-animation');

      // Step 4: Test QR code generation for mobile sharing
      const qrCodeButton = within(mobileShareModal).getByTestId('qr-code-button');
      await user.click(qrCodeButton);

      const qrCodeModal = await screen.findByTestId('qr-code-modal');
      expect(qrCodeModal).toHaveClass('mobile-qr-modal');

      const qrCodeImage = within(qrCodeModal).getByTestId('qr-code-image');
      expect(qrCodeImage).toHaveAttribute('alt', 'QR Code for sharing');
    });
  });

  describe('Mobile Dashboard and Progress Journey', () => {
    test('should provide mobile-optimized dashboard experience', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Navigate to dashboard
      const dashboardTab = await screen.findByRole('tab', { name: /dashboard/i });
      await user.click(dashboardTab);

      // Step 1: Verify mobile dashboard layout (Requirement 7.4)
      const mobileDashboard = await screen.findByTestId('mobile-dashboard');
      expect(mobileDashboard).toHaveClass('mobile-dashboard', 'stack-layout');

      // Verify mobile hero section
      const mobileHero = within(mobileDashboard).getByTestId('mobile-hero-section');
      expect(mobileHero).toHaveClass('mobile-hero', 'compact-hero');

      // Step 2: Test mobile progress cards with swipe navigation
      const progressCardsContainer = await screen.findByTestId('mobile-progress-cards');
      expect(progressCardsContainer).toHaveClass('swipe-container', 'mobile-cards');

      const progressCards = within(progressCardsContainer).getAllByTestId('mobile-progress-card');
      expect(progressCards.length).toBeGreaterThan(0);

      // Test horizontal swipe through progress cards
      fireEvent.touchStart(progressCardsContainer, {
        touches: [{ clientX: 200, clientY: 100 }]
      });

      fireEvent.touchMove(progressCardsContainer, {
        touches: [{ clientX: 50, clientY: 100 }]
      });

      fireEvent.touchEnd(progressCardsContainer, {
        changedTouches: [{ clientX: 50, clientY: 100 }]
      });

      // Verify card navigation with haptic feedback
      await waitFor(() => {
        const activeCard = within(progressCardsContainer).getByTestId('active-progress-card');
        expect(activeCard).toHaveClass('card-active');
      });

      expect(mockHapticFeedback).toHaveBeenCalled();

      // Step 3: Test mobile achievement showcase
      const mobileAchievements = await screen.findByTestId('mobile-achievements');
      expect(mobileAchievements).toHaveClass('mobile-achievements', 'grid-mobile');

      const achievementBadges = within(mobileAchievements).getAllByTestId('mobile-achievement-badge');
      achievementBadges.forEach(badge => {
        expect(badge).toHaveClass('mobile-badge', 'touch-badge');
        
        // Verify badge size for mobile
        const rect = badge.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(60);
        expect(rect.height).toBeGreaterThanOrEqual(60);
      });

      // Test achievement detail modal on mobile
      const firstBadge = achievementBadges[0];
      await user.click(firstBadge);

      const achievementModal = await screen.findByTestId('mobile-achievement-modal');
      expect(achievementModal).toHaveClass('mobile-modal', 'full-screen-modal');

      // Step 4: Test pull-to-refresh functionality (Requirement 7.1)
      const pullToRefresh = await screen.findByTestId('mobile-pull-to-refresh');
      expect(pullToRefresh).toHaveClass('pull-to-refresh', 'mobile-refresh');

      // Simulate pull-to-refresh gesture
      fireEvent.touchStart(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 50 }]
      });

      fireEvent.touchMove(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify pull indicator appears
      const pullIndicator = await screen.findByTestId('pull-indicator');
      expect(pullIndicator).toHaveClass('pull-indicator', 'active');

      fireEvent.touchEnd(pullToRefresh, {
        changedTouches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify refresh animation and haptic feedback
      await waitFor(() => {
        const refreshSpinner = screen.getByTestId('mobile-refresh-spinner');
        expect(refreshSpinner).toHaveClass('refresh-animation');
      });

      expect(mockHapticFeedback).toHaveBeenCalledWith([25]); // Strong haptic feedback
    });

    test('should handle mobile tutorial browsing with touch optimization', async () => {
      render(<App />, { wrapper: TestWrapper });

      const tutorialsTab = await screen.findByRole('tab', { name: /tutorials/i });
      await user.click(tutorialsTab);

      // Step 1: Verify mobile tutorial grid
      const mobileTutorialGrid = await screen.findByTestId('mobile-tutorial-grid');
      expect(mobileTutorialGrid).toHaveClass('mobile-grid', 'touch-grid');

      const tutorialCards = within(mobileTutorialGrid).getAllByTestId('mobile-tutorial-card');
      tutorialCards.forEach(card => {
        expect(card).toHaveClass('mobile-tutorial-card', 'touch-card');
        
        // Verify card has proper touch feedback
        const rect = card.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(120); // Minimum card height for mobile
      });

      // Step 2: Test mobile tutorial filtering with bottom sheet
      const filterButton = await screen.findByTestId('mobile-filter-button');
      await user.click(filterButton);

      const filterBottomSheet = await screen.findByTestId('mobile-filter-bottom-sheet');
      expect(filterBottomSheet).toHaveClass('bottom-sheet', 'slide-up');

      // Test filter chips for mobile
      const filterChips = within(filterBottomSheet).getAllByTestId('filter-chip');
      filterChips.forEach(chip => {
        expect(chip).toHaveClass('mobile-chip', 'touch-chip');
        
        const rect = chip.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(36);
      });

      // Step 3: Test mobile tutorial preview with gesture navigation
      const firstTutorial = tutorialCards[0];
      await user.click(firstTutorial);

      const tutorialPreview = await screen.findByTestId('mobile-tutorial-preview');
      expect(tutorialPreview).toHaveClass('mobile-preview', 'full-screen');

      // Test swipe to navigate between tutorial sections
      const previewContent = within(tutorialPreview).getByTestId('preview-content');
      
      fireEvent.touchStart(previewContent, {
        touches: [{ clientX: 300, clientY: 200 }]
      });

      fireEvent.touchMove(previewContent, {
        touches: [{ clientX: 100, clientY: 200 }]
      });

      fireEvent.touchEnd(previewContent, {
        changedTouches: [{ clientX: 100, clientY: 200 }]
      });

      // Verify section navigation
      await waitFor(() => {
        const nextSection = within(previewContent).getByTestId('next-section');
        expect(nextSection).toHaveClass('section-active');
      });

      // Step 4: Test mobile tutorial start with optimized flow
      const startButton = await screen.findByTestId('mobile-start-tutorial');
      expect(startButton).toHaveClass('mobile-cta-button', 'prominent');

      await user.click(startButton);

      // Verify mobile tutorial interface loads
      const mobileTutorialInterface = await screen.findByTestId('mobile-tutorial-interface');
      expect(mobileTutorialInterface).toHaveClass('mobile-tutorial', 'full-screen-learning');
    });
  });

  describe('Mobile Performance and Accessibility Journey', () => {
    test('should maintain performance on mobile devices', async () => {
      // Mock slower mobile performance
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      let frameCount = 0;
      window.requestAnimationFrame = jest.fn((callback) => {
        frameCount++;
        return setTimeout(() => {
          callback(performance.now());
        }, 16.67); // 60fps
      });

      const startTime = performance.now();
      render(<App />, { wrapper: TestWrapper });

      // Wait for app to fully load
      await waitFor(() => {
        expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Verify mobile performance requirements (Requirement 6.1)
      expect(loadTime).toBeLessThan(3000); // Mobile should load in under 3 seconds

      // Test animation performance
      const animatedElements = screen.getAllByTestId(/animation/);
      animatedElements.forEach(element => {
        expect(element).not.toHaveClass('animation-lag');
      });

      // Verify frame rate during interactions
      const interactiveElement = await screen.findByTestId('mobile-navigation');
      
      const interactionStart = performance.now();
      await user.click(interactiveElement);
      const interactionEnd = performance.now();
      
      const interactionTime = interactionEnd - interactionStart;
      expect(interactionTime).toBeLessThan(100); // Interactions should be under 100ms

      window.requestAnimationFrame = originalRequestAnimationFrame;
    });

    test('should provide mobile accessibility features', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Test mobile screen reader support
      const mobileNav = await screen.findByTestId('mobile-navigation');
      expect(mobileNav).toHaveAttribute('role', 'navigation');
      expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation');

      // Verify mobile-specific ARIA labels
      const bottomNavItems = screen.getAllByTestId('nav-item');
      bottomNavItems.forEach(item => {
        expect(item).toHaveAttribute('aria-label');
        expect(item).toHaveAttribute('role', 'tab');
      });

      // Step 2: Test mobile focus management
      const focusableElements = screen.getAllByRole('button');
      focusableElements.forEach(element => {
        // Verify focus indicators are visible on mobile
        element.focus();
        expect(element).toHaveClass('focus-visible');
        
        // Verify focus ring is appropriate for mobile
        const styles = window.getComputedStyle(element);
        expect(styles.outlineWidth).not.toBe('0px');
      });

      // Step 3: Test mobile gesture accessibility
      const swipeContainer = await screen.findByTestId('swipe-navigation-container');
      expect(swipeContainer).toHaveAttribute('aria-label', 'Swipe to navigate');
      expect(swipeContainer).toHaveAttribute('role', 'region');

      // Verify alternative navigation for users who can't swipe
      const alternativeNavButtons = screen.getAllByTestId('alternative-nav-button');
      expect(alternativeNavButtons.length).toBeGreaterThan(0);

      // Step 4: Test mobile text scaling support
      // Mock increased text size
      document.documentElement.style.fontSize = '20px'; // 125% scaling

      await waitFor(() => {
        const textElements = screen.getAllByText(/./);
        textElements.forEach(element => {
          const styles = window.getComputedStyle(element);
          const fontSize = parseFloat(styles.fontSize);
          expect(fontSize).toBeGreaterThan(14); // Text should scale appropriately
        });
      });

      // Reset font size
      document.documentElement.style.fontSize = '';
    });

    test('should handle mobile orientation changes gracefully', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Step 1: Verify portrait layout
      const portraitLayout = await screen.findByTestId('mobile-layout');
      expect(portraitLayout).toHaveClass('portrait-layout');

      // Step 2: Simulate orientation change to landscape
      Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
      Object.defineProperty(screen, 'orientation', {
        value: { angle: 90, type: 'landscape-primary' },
        configurable: true
      });

      fireEvent(window, new Event('orientationchange'));
      fireEvent(window, new Event('resize'));

      // Step 3: Verify landscape layout adaptation
      await waitFor(() => {
        const landscapeLayout = screen.getByTestId('mobile-layout');
        expect(landscapeLayout).toHaveClass('landscape-layout');
      });

      // Verify navigation adapts to landscape
      const landscapeNav = await screen.findByTestId('mobile-navigation');
      expect(landscapeNav).toHaveClass('landscape-nav');

      // Step 4: Test code editor in landscape mode
      const playgroundTab = await screen.findByRole('tab', { name: /playground/i });
      await user.click(playgroundTab);

      const landscapeEditor = await screen.findByTestId('mobile-code-editor');
      expect(landscapeEditor).toHaveClass('landscape-editor');

      // Verify editor takes advantage of wider screen
      const editorRect = landscapeEditor.getBoundingClientRect();
      expect(editorRect.width).toBeGreaterThan(500);

      // Step 5: Return to portrait and verify layout switches back
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      Object.defineProperty(screen, 'orientation', {
        value: { angle: 0, type: 'portrait-primary' },
        configurable: true
      });

      fireEvent(window, new Event('orientationchange'));
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        const portraitLayoutAgain = screen.getByTestId('mobile-layout');
        expect(portraitLayoutAgain).toHaveClass('portrait-layout');
      });
    });
  });

  describe('Tablet Experience Journey', () => {
    test('should provide optimized tablet experience', async () => {
      mockTabletEnvironment();

      render(<App />, { wrapper: TestWrapper });

      // Step 1: Verify tablet layout detection
      const tabletLayout = await screen.findByTestId('tablet-layout');
      expect(tabletLayout).toHaveClass('tablet-layout', 'hybrid-interface');

      // Step 2: Verify tablet navigation combines mobile and desktop features
      const tabletNav = await screen.findByTestId('tablet-navigation');
      expect(tabletNav).toHaveClass('tablet-nav', 'hybrid-nav');

      // Should have both sidebar and bottom navigation
      const sidebar = within(tabletNav).getByTestId('tablet-sidebar');
      const bottomNav = within(tabletNav).getByTestId('tablet-bottom-nav');
      
      expect(sidebar).toBeInTheDocument();
      expect(bottomNav).toBeInTheDocument();

      // Step 3: Test tablet code editor with split view
      const playgroundTab = await screen.findByRole('tab', { name: /playground/i });
      await user.click(playgroundTab);

      const tabletEditor = await screen.findByTestId('tablet-code-editor');
      expect(tabletEditor).toHaveClass('tablet-editor', 'split-view');

      // Verify split view with code and output side by side
      const codePanel = within(tabletEditor).getByTestId('code-panel');
      const outputPanel = within(tabletEditor).getByTestId('output-panel');
      
      expect(codePanel).toHaveClass('split-panel');
      expect(outputPanel).toHaveClass('split-panel');

      // Step 4: Test tablet dashboard with grid layout
      const dashboardTab = await screen.findByRole('tab', { name: /dashboard/i });
      await user.click(dashboardTab);

      const tabletDashboard = await screen.findByTestId('tablet-dashboard');
      expect(tabletDashboard).toHaveClass('tablet-dashboard', 'grid-layout');

      // Verify dashboard uses tablet-optimized grid
      const dashboardGrid = within(tabletDashboard).getByTestId('tablet-dashboard-grid');
      expect(dashboardGrid).toHaveClass('tablet-grid', 'responsive-grid');

      const gridItems = within(dashboardGrid).getAllByTestId('dashboard-grid-item');
      expect(gridItems.length).toBeGreaterThan(4); // More items visible on tablet
    });
  });
});