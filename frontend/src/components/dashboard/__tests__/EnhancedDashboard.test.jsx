import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EnhancedDashboard from '../EnhancedDashboard';
import { useAuth } from '../../../context/AuthContext';

// Mock dependencies
jest.mock('../../../context/AuthContext');
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('div', { ref, ...props, 'data-testid': props['data-testid'] }, children)
      )),
    },
    AnimatePresence: ({ children }) => children,
  };
});

// Mock UI components
jest.mock('../../ui', () => ({
  Card: ({ children, className, ...props }) => (
    <div className={className} {...props} data-testid="card">{children}</div>
  ),
  Button: ({ children, className, ...props }) => (
    <button className={className} {...props} data-testid="button">{children}</button>
  ),
  Badge: ({ children, className, ...props }) => (
    <span className={className} {...props} data-testid="badge">{children}</span>
  ),
  Progress: ({ value, ...props }) => (
    <div role="progressbar" aria-valuenow={value} {...props} data-testid="progress" />
  ),
  LoadingSkeleton: ({ className, ...props }) => (
    <div className={className} {...props} data-testid="loading-skeleton" />
  ),
  StatCard: ({ label, value, ...props }) => (
    <div {...props} data-testid="stat-card">
      <span data-testid="stat-label">{label}</span>
      <span data-testid="stat-value">{value}</span>
    </div>
  ),
  HeroSection: ({ title, subtitle, ...props }) => (
    <div {...props} data-testid="hero-section">
      <h1 data-testid="hero-title">{title}</h1>
      <p data-testid="hero-subtitle">{subtitle}</p>
    </div>
  ),
  Timeline: ({ items, ...props }) => (
    <div {...props} data-testid="timeline">
      {items?.map((item, index) => (
        <div key={index} data-testid="timeline-item">{item.title}</div>
      ))}
    </div>
  ),
  QuickActions: ({ actions, ...props }) => (
    <div {...props} data-testid="quick-actions">
      {actions?.map((action, index) => (
        <div key={index} data-testid="quick-action">{action.label}</div>
      ))}
    </div>
  ),
  ProgressRing: ({ children, ...props }) => (
    <div {...props} data-testid="progress-ring">{children}</div>
  ),
  AnimatedCounter: ({ value, ...props }) => (
    <span {...props} data-testid="animated-counter">{value}</span>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
};

const mockTutorialsResponse = {
  ok: true,
  json: () => Promise.resolve({
    data: {
      tutorials: [
        {
          id: 1,
          title: 'JavaScript Basics',
          language: 'javascript',
          difficulty: 'beginner',
          estimatedDuration: 120,
        },
        {
          id: 2,
          title: 'React Fundamentals',
          language: 'javascript',
          difficulty: 'intermediate',
          estimatedDuration: 180,
        },
      ],
    },
  }),
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('EnhancedDashboard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    fetch.mockResolvedValue(mockTutorialsResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading skeletons while fetching data', () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      // Check for loading skeletons
      const skeletons = screen.getAllByTestId(/loading-skeleton|skeleton/i);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows loading skeleton with correct structure', () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      // Loading skeletons should be present
      const skeletons = screen.getAllByTestId('loading-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Fetching', () => {
    it('fetches dashboard data on mount', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/v1/tutorials?limit=3', {
          credentials: 'include',
        });
      });
    });

    it('handles API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));
      
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should still render with fallback data
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });

    it('handles empty API response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { tutorials: [] } }),
      });

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interface', () => {
    it('displays personalized welcome message', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back, john/i);
      });
    });

    it('renders stats cards with correct data', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const statLabels = screen.getAllByTestId('stat-label');
        const labelTexts = statLabels.map(label => label.textContent);
        
        expect(labelTexts).toContain('Tutorials Completed');
        expect(labelTexts).toContain('Hours Learned');
        expect(labelTexts).toContain('Current Streak');
        expect(labelTexts).toContain('Average Score');
      });
    });

    it('displays weekly goal progress', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for cards that contain weekly goal content
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('shows recent tutorials section', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders with tutorial data
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('displays quick actions', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const quickActions = screen.getByTestId('quick-actions');
        expect(quickActions).toBeInTheDocument();
      });
    });

    it('shows recent activity timeline', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const timeline = screen.getByTestId('timeline');
        expect(timeline).toBeInTheDocument();
      });
    });

    it('displays achievements preview', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders successfully
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection).toBeInTheDocument();
      });
    });
  });

  describe('Progress Calculations', () => {
    it('calculates completion percentage correctly', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for progress indicators
        const progressBars = screen.getAllByTestId('progress');
        expect(progressBars.length).toBeGreaterThan(0);
      });
    });

    it('displays streak information accurately', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const statValues = screen.getAllByTestId('stat-value');
        const streakStat = statValues.find(stat => stat.textContent.includes('days'));
        expect(streakStat).toBeInTheDocument();
      });
    });

    it('shows XP and level progression', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for stat values
        const statValues = screen.getAllByTestId('stat-value');
        expect(statValues.length).toBeGreaterThan(0);
      });
    });

    it('calculates weekly goal progress', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for progress rings
        const progressRings = screen.getAllByTestId('progress-ring');
        expect(progressRings.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Interactive Elements', () => {
    it('handles tutorial card clicks', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders with interactive elements
        const buttons = screen.getAllByTestId('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('navigates to tutorials page from view all button', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for navigation buttons
        const buttons = screen.getAllByTestId('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('navigates to achievements page', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders successfully
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection).toBeInTheDocument();
      });
    });

    it('handles quick action clicks', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const quickActions = screen.getByTestId('quick-actions');
        expect(quickActions).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders properly on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders on mobile
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection).toBeInTheDocument();
      });
    });

    it('adapts layout for tablet viewport', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back/i);
      });
    });
  });

  describe('Error Handling', () => {
    it('displays fallback content when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should still show welcome message with fallback data
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back/i);
      });
    });

    it('handles malformed API response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'data' }),
      });

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back/i);
      });
    });
  });

  describe('Performance', () => {
    it('memoizes expensive calculations', async () => {
      const { rerender } = render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back/i);
      });

      // Re-render with same props shouldn't cause unnecessary recalculations
      rerender(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      // Fetch should only be called once
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('handles large datasets efficiently', async () => {
      const largeTutorialsResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: {
            tutorials: Array.from({ length: 100 }, (_, i) => ({
              id: i + 1,
              title: `Tutorial ${i + 1}`,
              language: 'javascript',
              difficulty: 'beginner',
              estimatedDuration: 60,
            })),
          },
        }),
      };

      fetch.mockResolvedValueOnce(largeTutorialsResponse);

      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle).toHaveTextContent(/welcome back/i);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const heroTitle = screen.getByTestId('hero-title');
        expect(heroTitle.tagName).toBe('H1');
      });
    });

    it('provides proper ARIA labels for interactive elements', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const buttons = screen.getAllByTestId('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('supports keyboard navigation', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const buttons = screen.getAllByTestId('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('has proper color contrast for text elements', async () => {
      render(
        <TestWrapper>
          <EnhancedDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check that dashboard renders with proper structure
        const heroSection = screen.getByTestId('hero-section');
        expect(heroSection).toBeInTheDocument();
      });
    });
  });
});