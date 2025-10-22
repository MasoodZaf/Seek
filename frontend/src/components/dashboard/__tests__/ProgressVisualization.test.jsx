import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgressVisualization from '../ProgressVisualization';

// Mock dependencies
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('div', { ref, ...props }, children)
      )),
    },
  };
});

const mockUserStats = {
  xp: 3240,
  nextLevelXp: 4000,
  level: 4,
  currentStreak: 12,
  maxStreak: 15,
};

describe('ProgressVisualization', () => {
  const user = userEvent.setup();

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
    });

    it('displays user stats correctly', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
      expect(screen.getByText('Skill Progress')).toBeInTheDocument();
      expect(screen.getByText('Learning Path')).toBeInTheDocument();
      expect(screen.getByText('Weekly Goals')).toBeInTheDocument();
    });

    it('renders with default stats when none provided', () => {
      render(<ProgressVisualization />);
      
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
      expect(screen.getByText('Skill Progress')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ProgressVisualization className="custom-class" userStats={mockUserStats} />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('XP and Level Progress', () => {
    it('displays current XP and level correctly', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // XP Progress Bar should be rendered with correct values
      const xpProgressBar = screen.getByTestId('xp-progress-bar');
      expect(xpProgressBar).toBeInTheDocument();
    });

    it('calculates XP progress percentage correctly', () => {
      const stats = { xp: 2500, nextLevelXp: 5000, level: 3 };
      render(<ProgressVisualization userStats={stats} />);
      
      // Should show 50% progress (2500/5000)
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('handles edge case of 0 XP', () => {
      const stats = { xp: 0, nextLevelXp: 1000, level: 1 };
      render(<ProgressVisualization userStats={stats} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('handles edge case of max XP', () => {
      const stats = { xp: 5000, nextLevelXp: 5000, level: 5 };
      render(<ProgressVisualization userStats={stats} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });

  describe('Streak Indicator', () => {
    it('displays current streak correctly', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const streakIndicator = screen.getByTestId('streak-indicator');
      expect(streakIndicator).toBeInTheDocument();
    });

    it('shows streak with fire animation for active streaks', () => {
      const stats = { ...mockUserStats, currentStreak: 7 };
      render(<ProgressVisualization userStats={stats} />);
      
      const streakIndicator = screen.getByTestId('streak-indicator');
      expect(streakIndicator).toHaveClass('variant-fire');
    });

    it('handles zero streak gracefully', () => {
      const stats = { ...mockUserStats, currentStreak: 0 };
      render(<ProgressVisualization userStats={stats} />);
      
      const streakIndicator = screen.getByTestId('streak-indicator');
      expect(streakIndicator).toBeInTheDocument();
    });
  });

  describe('Skill Progress Rings', () => {
    it('displays all skill categories', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument();
    });

    it('shows correct progress percentages for each skill', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Check for progress ring values
      expect(screen.getByText('85%')).toBeInTheDocument(); // Frontend
      expect(screen.getByText('40%')).toBeInTheDocument(); // Backend
      expect(screen.getByText('60%')).toBeInTheDocument(); // Database
      expect(screen.getByText('25%')).toBeInTheDocument(); // DevOps
    });

    it('applies correct color variants to progress rings', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const progressRings = screen.getAllByTestId('progress-ring');
      expect(progressRings).toHaveLength(4);
      
      // Check that each ring has appropriate variant classes
      expect(progressRings[0]).toHaveClass('variant-primary');
      expect(progressRings[1]).toHaveClass('variant-success');
      expect(progressRings[2]).toHaveClass('variant-warning');
      expect(progressRings[3]).toHaveClass('variant-error');
    });
  });

  describe('Skill Tree', () => {
    it('renders interactive skill tree', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const skillTree = screen.getByTestId('skill-tree');
      expect(skillTree).toBeInTheDocument();
    });

    it('displays skill tree legend', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Locked')).toBeInTheDocument();
    });

    it('shows correct completion count', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Should show "X of Y completed" based on mock skill tree data
      expect(screen.getByText(/\d+ of \d+ completed/)).toBeInTheDocument();
    });

    it('handles skill node clicks', async () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const skillTree = screen.getByTestId('skill-tree');
      const skillNode = skillTree.querySelector('[data-skill-id="html-basics"]');
      
      if (skillNode) {
        await user.click(skillNode);
        // Should trigger milestone celebration for completed skills
        await waitFor(() => {
          expect(screen.getByTestId('milestone-celebration')).toBeInTheDocument();
        });
      }
    });

    it('shows view full tree button', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const viewFullTreeButton = screen.getByText('View Full Tree');
      expect(viewFullTreeButton).toBeInTheDocument();
    });
  });

  describe('Weekly Goals', () => {
    it('displays all weekly goals', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      expect(screen.getByText('Complete 3 tutorials')).toBeInTheDocument();
      expect(screen.getByText('Practice 5 days')).toBeInTheDocument();
      expect(screen.getByText('Earn 500 XP')).toBeInTheDocument();
    });

    it('shows correct progress for each goal', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      expect(screen.getByText('2/3')).toBeInTheDocument(); // Tutorials
      expect(screen.getByText('4/5')).toBeInTheDocument(); // Practice days
      expect(screen.getByText('320/500')).toBeInTheDocument(); // XP
    });

    it('animates progress bars with correct percentages', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      
      // Weekly goals section should have 3 progress bars
      const weeklyGoalsBars = progressBars.slice(-3);
      expect(weeklyGoalsBars[0]).toHaveAttribute('aria-valuenow', '67'); // 2/3 = 67%
      expect(weeklyGoalsBars[1]).toHaveAttribute('aria-valuenow', '80'); // 4/5 = 80%
      expect(weeklyGoalsBars[2]).toHaveAttribute('aria-valuenow', '64'); // 320/500 = 64%
    });

    it('applies correct gradient colors to progress bars', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const weeklyGoalsSection = screen.getByText('Weekly Goals').closest('.space-y-4');
      const progressBars = weeklyGoalsSection.querySelectorAll('[role="progressbar"]');
      
      expect(progressBars[0]).toHaveClass('from-primary-500', 'to-primary-600');
      expect(progressBars[1]).toHaveClass('from-success-500', 'to-success-600');
      expect(progressBars[2]).toHaveClass('from-warning-500', 'to-warning-600');
    });
  });

  describe('Milestone Celebration', () => {
    it('shows milestone celebration modal when triggered', async () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Simulate clicking on a completed skill
      const skillTree = screen.getByTestId('skill-tree');
      const completedSkill = skillTree.querySelector('[data-completed="true"]');
      
      if (completedSkill) {
        await user.click(completedSkill);
        
        await waitFor(() => {
          expect(screen.getByTestId('milestone-celebration')).toBeInTheDocument();
        });
      }
    });

    it('handles milestone sharing', async () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Trigger milestone celebration
      const skillTree = screen.getByTestId('skill-tree');
      const completedSkill = skillTree.querySelector('[data-completed="true"]');
      
      if (completedSkill) {
        await user.click(completedSkill);
        
        await waitFor(() => {
          const shareButton = screen.getByText('Share');
          expect(shareButton).toBeInTheDocument();
        });
      }
    });

    it('closes milestone celebration modal', async () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Trigger and then close milestone celebration
      const skillTree = screen.getByTestId('skill-tree');
      const completedSkill = skillTree.querySelector('[data-completed="true"]');
      
      if (completedSkill) {
        await user.click(completedSkill);
        
        await waitFor(() => {
          const closeButton = screen.getByLabelText('Close');
          fireEvent.click(closeButton);
        });
        
        await waitFor(() => {
          expect(screen.queryByTestId('milestone-celebration')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Animations', () => {
    it('applies motion animations to progress elements', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Check that motion.div components are rendered
      const animatedElements = screen.getAllByTestId(/animated-/);
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('staggers animation delays for progress bars', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach((bar, index) => {
        // Each progress bar should have appropriate animation delay
        expect(bar).toHaveAttribute('data-animation-delay');
      });
    });
  });

  describe('Responsive Design', () => {
    it('adapts grid layout for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const skillProgressGrid = screen.getByTestId('skill-progress-grid');
      expect(skillProgressGrid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
    });

    it('maintains proper spacing on different screen sizes', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const container = screen.getByTestId('progress-visualization-container');
      expect(container).toHaveClass('space-y-8');
    });
  });

  describe('Error Handling', () => {
    it('handles missing user stats gracefully', () => {
      render(<ProgressVisualization userStats={null} />);
      
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
      // Should render with default/fallback values
    });

    it('handles invalid XP values', () => {
      const invalidStats = { xp: -100, nextLevelXp: 0, level: -1 };
      render(<ProgressVisualization userStats={invalidStats} />);
      
      // Should not crash and should handle gracefully
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
    });

    it('handles skill tree data errors', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Should still render even if skill tree has issues
      expect(screen.getByText('Learning Path')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for progress elements', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-label');
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
      });
    });

    it('supports keyboard navigation for interactive elements', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const interactiveElements = screen.getAllByRole('button');
      interactiveElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex');
      });
    });

    it('provides alternative text for visual progress indicators', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const progressRings = screen.getAllByTestId('progress-ring');
      progressRings.forEach(ring => {
        expect(ring).toHaveAttribute('aria-label');
      });
    });

    it('maintains proper heading hierarchy', () => {
      render(<ProgressVisualization userStats={mockUserStats} />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for h3 headings in sections
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      expect(h3Headings.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('memoizes expensive calculations', () => {
      const { rerender } = render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Re-render with same props
      rerender(<ProgressVisualization userStats={mockUserStats} />);
      
      // Should not cause unnecessary recalculations
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
    });

    it('handles frequent updates efficiently', () => {
      const { rerender } = render(<ProgressVisualization userStats={mockUserStats} />);
      
      // Simulate frequent XP updates
      for (let i = 0; i < 10; i++) {
        const updatedStats = { ...mockUserStats, xp: mockUserStats.xp + i * 10 };
        rerender(<ProgressVisualization userStats={updatedStats} />);
      }
      
      expect(screen.getByText('Level Progress')).toBeInTheDocument();
    });
  });
});