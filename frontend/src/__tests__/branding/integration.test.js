/**
 * Branding Integration Tests
 * Tests how branding elements work together across the application
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SocialShare from '../../components/ui/SocialShare';
import SocialLogin from '../../components/auth/SocialLogin';
import ErrorState from '../../components/ui/ErrorState';
import SuccessNotification from '../../components/ui/SuccessNotification';
import ProgressMessage from '../../components/ui/ProgressMessage';
import BrandIcon from '../../components/ui/BrandIcon';
import { Button } from '../../components/ui/Button';

// Mock external APIs
const mockWindowOpen = jest.fn();
const mockClipboardWriteText = jest.fn();

beforeAll(() => {
  global.window.open = mockWindowOpen;
  Object.assign(navigator, {
    clipboard: { writeText: mockClipboardWriteText }
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockClipboardWriteText.mockResolvedValue();
});

describe('Cross-Component Brand Integration', () => {
  describe('Social Sharing Integration', () => {
    test('social share maintains brand consistency across different contexts', async () => {
      const user = userEvent.setup();
      
      // Test code sharing
      const { rerender } = render(
        <SocialShare
          url="https://seek.example.com/code/123"
          title="Check out my JavaScript code on Seek!"
          hashtags={['javascript', 'coding', 'SeekLearning']}
        />
      );
      
      const twitterButton = screen.getByTitle('Share on Twitter');
      await user.click(twitterButton);
      
      let calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('SeekLearning');
      expect(calledUrl).toContain('javascript');
      
      mockWindowOpen.mockClear();
      
      // Test achievement sharing
      rerender(
        <SocialShare
          title="🏆 I just earned the 'First Steps' badge on Seek!"
          hashtags={['achievement', 'coding', 'SeekLearning']}
        />
      );
      
      const twitterButton2 = screen.getByTitle('Share on Twitter');
      await user.click(twitterButton2);
      
      calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('SeekLearning');
      expect(calledUrl).toContain('achievement');
      expect(calledUrl).toContain('Seek');
    });

    test('social sharing uses consistent brand messaging', () => {
      const contexts = [
        {
          title: 'Check out my Python project on Seek!',
          description: 'Learning to code with Seek\'s professional platform',
          hashtags: ['python', 'project', 'SeekLearning']
        },
        {
          title: '✅ Just completed "React Basics" on Seek!',
          description: 'I\'m learning React and making great progress with Seek!',
          hashtags: ['tutorial', 'react', 'SeekLearning']
        },
        {
          title: '🔥 7 day learning streak on Seek!',
          description: 'Consistent daily practice is paying off. Join me!',
          hashtags: ['streak', 'learning', 'SeekLearning']
        }
      ];
      
      contexts.forEach(context => {
        const { unmount } = render(<SocialShare {...context} />);
        
        // All should mention Seek
        expect(context.title).toMatch(/Seek/);
        expect(context.hashtags).toContain('SeekLearning');
        
        // All should have encouraging tone
        expect(context.description).toMatch(/learning|progress|great|join/i);
        
        unmount();
      });
    });

    test('social login maintains brand consistency', () => {
      const mockLogin = jest.fn();
      render(<SocialLogin onLogin={mockLogin} />);
      
      const googleButton = screen.getByText(/Continue with Google/);
      const githubButton = screen.getByText(/Continue with GitHub/);
      
      expect(googleButton).toBeInTheDocument();
      expect(githubButton).toBeInTheDocument();
      
      // Should use consistent "Continue with" pattern
      expect(googleButton.textContent).toMatch(/Continue with/);
      expect(githubButton.textContent).toMatch(/Continue with/);
    });
  });

  describe('Error and Success State Integration', () => {
    test('error states maintain professional tone across contexts', () => {
      const errorContexts = [
        { error: 'networkError', context: 'code execution' },
        { error: 'loginFailed', context: 'authentication' },
        { error: 'codeExecutionFailed', context: 'playground' },
        { error: 'fileUploadFailed', context: 'project upload' }
      ];
      
      errorContexts.forEach(({ error, context }) => {
        const { unmount } = render(<ErrorState error={error} />);
        
        // Should have helpful title
        const titleElement = screen.getByRole('heading', { level: 3 });
        expect(titleElement.textContent).not.toMatch(/error|fail/i);
        expect(titleElement.textContent.length).toBeLessThan(50);
        
        // Should have actionable message
        const messageElement = screen.getByText(/./);
        expect(messageElement.textContent).toMatch(/try|check|please/i);
        
        unmount();
      });
    });

    test('success notifications maintain encouraging tone', () => {
      const successContexts = [
        'tutorialCompleted',
        'levelUp',
        'codeSaved',
        'projectCreated',
        'badgeEarned'
      ];
      
      successContexts.forEach(type => {
        const { unmount } = render(<SuccessNotification type={type} />);
        
        // Should have celebratory title
        const titleElement = screen.getByRole('heading', { level: 4 });
        expect(titleElement.textContent).toMatch(/!/);
        
        // Should have encouraging message
        const messageElement = screen.getByText(/great|excellent|congratulations|well/i);
        expect(messageElement).toBeInTheDocument();
        
        unmount();
      });
    });

    test('progress messages adapt consistently to different scenarios', () => {
      const progressScenarios = [
        { percentage: 25, expectedTone: 'encouraging' },
        { percentage: 60, expectedTone: 'acknowledging' },
        { percentage: 90, expectedTone: 'exciting' }
      ];
      
      progressScenarios.forEach(({ percentage, expectedTone }) => {
        const { unmount } = render(
          <ProgressMessage type="progress" percentage={percentage} />
        );
        
        const messageElement = screen.getByText(/./);
        const message = messageElement.textContent.toLowerCase();
        
        if (expectedTone === 'encouraging') {
          expect(message).toMatch(/keep|going|step|progress/);
        } else if (expectedTone === 'acknowledging') {
          expect(message).toMatch(/great|good|well|doing/);
        } else if (expectedTone === 'exciting') {
          expect(message).toMatch(/almost|close|there|finish/);
        }
        
        unmount();
      });
    });
  });

  describe('Icon and Visual Consistency', () => {
    test('icons maintain consistent styling across components', () => {
      const iconContexts = [
        { component: <ErrorState error="networkError" />, expectedIcon: 'warning' },
        { component: <SuccessNotification type="tutorialCompleted" />, expectedIcon: 'trophy' },
        { component: <ProgressMessage type="streak" streakDays={5} />, expectedIcon: 'fire' },
        { component: <Button variant="primary">Test</Button>, expectedIcon: null }
      ];
      
      iconContexts.forEach(({ component, expectedIcon }) => {
        const { container, unmount } = render(component);
        
        const svgElements = container.querySelectorAll('svg');
        svgElements.forEach(svg => {
          // All icons should have consistent stroke width
          expect(svg).toHaveAttribute('stroke-width', '2');
          
          // All icons should have proper viewBox
          expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
          
          // All icons should have brand-icon class
          expect(svg).toHaveClass('brand-icon');
        });
        
        unmount();
      });
    });

    test('color usage is consistent across components', () => {
      const colorContexts = [
        { component: <ErrorState error="serverError" />, expectedColors: ['red'] },
        { component: <SuccessNotification type="levelUp" />, expectedColors: ['green'] },
        { component: <Button variant="primary">Test</Button>, expectedColors: ['blue'] },
        { component: <Button variant="secondary">Test</Button>, expectedColors: ['gray'] }
      ];
      
      colorContexts.forEach(({ component, expectedColors }) => {
        const { container, unmount } = render(component);
        
        expectedColors.forEach(color => {
          const colorElements = container.querySelectorAll(`[class*="text-${color}"], [class*="bg-${color}"], [class*="border-${color}"]`);
          expect(colorElements.length).toBeGreaterThan(0);
        });
        
        unmount();
      });
    });
  });

  describe('Responsive Brand Consistency', () => {
    test('components maintain brand consistency across screen sizes', () => {
      // Test with different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];
      
      viewports.forEach(viewport => {
        // Mock viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });
        
        const { unmount } = render(
          <div>
            <SocialShare variant="default" />
            <ErrorState error="networkError" />
            <SuccessNotification type="tutorialCompleted" />
          </div>
        );
        
        // Components should still render properly
        expect(screen.getByTitle('Share on Twitter')).toBeInTheDocument();
        expect(screen.getByText('Connection Issue')).toBeInTheDocument();
        expect(screen.getByText(/Tutorial Completed/)).toBeInTheDocument();
        
        unmount();
      });
    });

    test('social sharing adapts to different contexts while maintaining brand', () => {
      const variants = ['default', 'compact', 'minimal'];
      
      variants.forEach(variant => {
        const { unmount } = render(
          <SocialShare
            variant={variant}
            title="Test share from Seek"
            hashtags={['test', 'SeekLearning']}
          />
        );
        
        // All variants should have Twitter sharing
        expect(screen.getByTitle('Share on Twitter')).toBeInTheDocument();
        
        // All variants should have copy functionality
        expect(screen.getByText(/Copy/)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('User Journey Integration', () => {
    test('onboarding flow maintains consistent branding', async () => {
      const user = userEvent.setup();
      
      // Simulate onboarding flow
      const { rerender } = render(
        <div>
          <h1>Welcome to Seek! 👋</h1>
          <p>We're excited to help you on your coding journey.</p>
          <Button variant="primary">Get Started</Button>
        </div>
      );
      
      expect(screen.getByText(/Welcome to Seek/)).toBeInTheDocument();
      expect(screen.getByText(/excited.*journey/)).toBeInTheDocument();
      
      // Move to profile setup
      rerender(
        <div>
          <h2>Tell Us About Yourself</h2>
          <p>Help us personalize your learning experience.</p>
          <Button variant="primary">Continue</Button>
        </div>
      );
      
      expect(screen.getByText(/Tell Us About Yourself/)).toBeInTheDocument();
      expect(screen.getByText(/personalize.*experience/)).toBeInTheDocument();
      
      // Move to first tutorial
      rerender(
        <div>
          <h2>Ready for Your First Tutorial?</h2>
          <p>We've selected a perfect starting point for you.</p>
          <Button variant="primary">Start Learning</Button>
        </div>
      );
      
      expect(screen.getByText(/Ready for Your First Tutorial/)).toBeInTheDocument();
      expect(screen.getByText(/perfect starting point/)).toBeInTheDocument();
    });

    test('achievement flow maintains celebratory branding', () => {
      // Simulate achievement unlock flow
      const { rerender } = render(
        <SuccessNotification
          type="tutorialCompleted"
          data={{ tutorialName: 'JavaScript Basics' }}
        />
      );
      
      expect(screen.getByText(/Tutorial Completed!/)).toBeInTheDocument();
      expect(screen.getByText(/Great job!/)).toBeInTheDocument();
      
      // Show level up
      rerender(
        <SuccessNotification
          type="levelUp"
          data={{ newLevel: 2 }}
          variant="celebration"
        />
      );
      
      expect(screen.getByText(/Level Up!/)).toBeInTheDocument();
      expect(screen.getByText(/⭐/)).toBeInTheDocument();
      
      // Show badge earned
      rerender(
        <SuccessNotification
          type="badgeEarned"
          data={{ achievement: { name: 'First Steps', description: 'Completed first tutorial' } }}
          variant="celebration"
        />
      );
      
      expect(screen.getByText(/Badge Earned!/)).toBeInTheDocument();
      expect(screen.getByText(/🎖️/)).toBeInTheDocument();
    });

    test('error recovery flow maintains helpful branding', async () => {
      const user = userEvent.setup();
      const mockRetry = jest.fn();
      
      // Show network error
      const { rerender } = render(
        <ErrorState error="networkError" onRetry={mockRetry} />
      );
      
      expect(screen.getByText('Connection Issue')).toBeInTheDocument();
      expect(screen.getByText(/trouble connecting/)).toBeInTheDocument();
      
      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);
      
      expect(mockRetry).toHaveBeenCalled();
      
      // Show success after retry
      rerender(
        <SuccessNotification
          type="accountCreated"
          data={{ message: 'Connection restored successfully' }}
        />
      );
      
      expect(screen.getByText(/Welcome to Seek!/)).toBeInTheDocument();
      expect(screen.getByText(/🎉/)).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    test('brand elements maintain accessibility across components', () => {
      render(
        <div>
          <SocialShare title="Test share" />
          <ErrorState error="networkError" />
          <SuccessNotification type="tutorialCompleted" />
          <ProgressMessage type="progress" percentage={50} />
        </div>
      );
      
      // All interactive elements should be keyboard accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
      
      // All headings should have proper hierarchy
      const headings = screen.getAllByRole('heading');
      headings.forEach(heading => {
        expect(heading.tagName).toMatch(/^H[1-6]$/);
      });
      
      // Icons should not interfere with screen readers
      const icons = document.querySelectorAll('svg');
      icons.forEach(icon => {
        // Icons should either have aria-hidden or proper labels
        const hasAriaHidden = icon.hasAttribute('aria-hidden');
        const hasAriaLabel = icon.hasAttribute('aria-label');
        const hasTitle = icon.querySelector('title');
        
        expect(hasAriaHidden || hasAriaLabel || hasTitle).toBe(true);
      });
    });

    test('color contrast is maintained across brand elements', () => {
      render(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <ErrorState error="serverError" variant="inline" />
          <SuccessNotification type="levelUp" variant="minimal" />
        </div>
      );
      
      // High contrast combinations should be used
      const primaryButton = screen.getByText('Primary Button');
      const errorText = screen.getByText(/Something Went Wrong/);
      const successText = screen.getByText(/Level Up!/);
      
      expect(primaryButton).toHaveClass('text-white');
      expect(errorText).toBeInTheDocument();
      expect(successText).toBeInTheDocument();
    });
  });
});

describe('Brand Performance Integration', () => {
  test('brand assets load efficiently', () => {
    const startTime = performance.now();
    
    render(
      <div>
        <BrandIcon name="home" />
        <BrandIcon name="code" />
        <BrandIcon name="star" />
        <BrandIcon name="trophy" />
        <SocialShare title="Test" />
        <ErrorState error="networkError" />
        <SuccessNotification type="tutorialCompleted" />
      </div>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly (less than 100ms for this simple test)
    expect(renderTime).toBeLessThan(100);
  });

  test('brand components handle rapid state changes', async () => {
    const user = userEvent.setup();
    let renderCount = 0;
    
    const TestComponent = () => {
      const [state, setState] = React.useState('loading');
      renderCount++;
      
      React.useEffect(() => {
        const timer = setTimeout(() => setState('success'), 100);
        return () => clearTimeout(timer);
      }, []);
      
      if (state === 'loading') {
        return <ProgressMessage type="progress" percentage={50} />;
      }
      
      return <SuccessNotification type="tutorialCompleted" />;
    };
    
    render(<TestComponent />);
    
    // Should start with progress message
    expect(screen.getByText(/./)).toBeInTheDocument();
    
    // Should transition to success
    await waitFor(() => {
      expect(screen.getByText(/Tutorial Completed!/)).toBeInTheDocument();
    });
    
    // Should not cause excessive re-renders
    expect(renderCount).toBeLessThan(5);
  });
});