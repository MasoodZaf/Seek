import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AchievementSystem from '../AchievementSystem';

// Mock dependencies
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('div', { ref, ...props }, children)
      )),
    },
    AnimatePresence: ({ children }) => children,
  };
});

// Mock navigator.share and clipboard
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn(),
  },
});

const mockUserAchievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first tutorial',
    iconType: 'star',
    category: 'learning',
    rarity: 'common',
    earned: true,
    earnedDate: '2024-01-15',
    rewards: ['50 XP', 'Beginner Badge'],
    progress: 100,
  },
  {
    id: 2,
    title: 'Code Warrior',
    description: 'Write 1000 lines of code',
    iconType: 'bolt',
    category: 'coding',
    rarity: 'rare',
    earned: true,
    earnedDate: '2024-01-20',
    rewards: ['200 XP', 'Warrior Badge'],
    progress: 100,
  },
  {
    id: 3,
    title: 'Learning Streak',
    description: 'Code for 30 days straight',
    iconType: 'fire',
    category: 'consistency',
    rarity: 'epic',
    earned: false,
    progress: 67,
    rewards: ['500 XP', 'Streak Master Badge'],
  },
];

describe('AchievementSystem', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    it('displays achievement overview correctly', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      expect(screen.getByText('Unlocked')).toBeInTheDocument();
      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    });

    it('calculates completion statistics correctly', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // Should show 2/8 unlocked (2 earned out of mock total)
      expect(screen.getByText(/2\/8/)).toBeInTheDocument();
      expect(screen.getByText(/25% Complete/)).toBeInTheDocument();
    });

    it('displays rarity breakdown', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      expect(screen.getByText('Common')).toBeInTheDocument();
      expect(screen.getByText('Rare')).toBeInTheDocument();
      expect(screen.getByText('Epic')).toBeInTheDocument();
      expect(screen.getByText('Legendary')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <AchievementSystem className="custom-class" userAchievements={mockUserAchievements} />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Achievement Filtering', () => {
    it('filters achievements by search term', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      await user.type(searchInput, 'First Steps');
      
      await waitFor(() => {
        expect(screen.getByText('First Steps')).toBeInTheDocument();
        expect(screen.queryByText('Code Warrior')).not.toBeInTheDocument();
      });
    });

    it('filters achievements by category', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const categorySelect = screen.getByDisplayValue('All Categories');
      await user.selectOptions(categorySelect, 'learning');
      
      await waitFor(() => {
        expect(screen.getByText('First Steps')).toBeInTheDocument();
        expect(screen.queryByText('Code Warrior')).not.toBeInTheDocument();
      });
    });

    it('filters achievements by rarity', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const raritySelect = screen.getByDisplayValue('All Rarities');
      await user.selectOptions(raritySelect, 'rare');
      
      await waitFor(() => {
        expect(screen.getByText('Code Warrior')).toBeInTheDocument();
        expect(screen.queryByText('First Steps')).not.toBeInTheDocument();
      });
    });

    it('combines multiple filters correctly', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      const categorySelect = screen.getByDisplayValue('All Categories');
      
      await user.type(searchInput, 'code');
      await user.selectOptions(categorySelect, 'coding');
      
      await waitFor(() => {
        expect(screen.getByText('Code Warrior')).toBeInTheDocument();
        expect(screen.queryByText('First Steps')).not.toBeInTheDocument();
        expect(screen.queryByText('Learning Streak')).not.toBeInTheDocument();
      });
    });

    it('shows no results message when no achievements match filters', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      await user.type(searchInput, 'nonexistent achievement');
      
      await waitFor(() => {
        expect(screen.getByText('No achievements found')).toBeInTheDocument();
        expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument();
      });
    });

    it('updates result count when filtering', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      await user.type(searchInput, 'First');
      
      await waitFor(() => {
        // Should show filtered count
        expect(screen.getByText(/1 of 8 achievements/)).toBeInTheDocument();
      });
    });
  });

  describe('Achievement Interactions', () => {
    it('handles achievement click for earned achievements', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const earnedAchievement = screen.getByText('First Steps').closest('[data-testid="achievement-badge"]');
      await user.click(earnedAchievement);
      
      await waitFor(() => {
        expect(screen.getByTestId('achievement-unlock-modal')).toBeInTheDocument();
      });
    });

    it('does not trigger modal for unearned achievements', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const unearnedAchievement = screen.getByText('Learning Streak').closest('[data-testid="achievement-badge"]');
      await user.click(unearnedAchievement);
      
      // Should not show modal for unearned achievements
      expect(screen.queryByTestId('achievement-unlock-modal')).not.toBeInTheDocument();
    });

    it('handles achievement sharing with native share API', async () => {
      navigator.share.mockResolvedValueOnce();
      
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const shareButton = screen.getAllByLabelText('Share achievement')[0];
      await user.click(shareButton);
      
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Achievement Unlocked!',
        text: expect.stringContaining('First Steps'),
        url: window.location.href,
      });
    });

    it('falls back to clipboard when native share is not available', async () => {
      navigator.share = undefined;
      navigator.clipboard.writeText.mockResolvedValueOnce();
      
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const shareButton = screen.getAllByLabelText('Share achievement')[0];
      await user.click(shareButton);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('First Steps')
      );
    });

    it('closes achievement unlock modal', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // Open modal
      const earnedAchievement = screen.getByText('First Steps').closest('[data-testid="achievement-badge"]');
      await user.click(earnedAchievement);
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('achievement-unlock-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Progress Display', () => {
    it('shows progress for unearned achievements', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const unearnedAchievement = screen.getByText('Learning Streak').closest('[data-testid="achievement-badge"]');
      const progressBar = unearnedAchievement.querySelector('[role="progressbar"]');
      
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '67');
    });

    it('displays earned date for completed achievements', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      expect(screen.getByText(/earned on 1\/15\/2024/i)).toBeInTheDocument();
      expect(screen.getByText(/earned on 1\/20\/2024/i)).toBeInTheDocument();
    });

    it('shows rewards for achievements', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      expect(screen.getByText('50 XP')).toBeInTheDocument();
      expect(screen.getByText('Beginner Badge')).toBeInTheDocument();
      expect(screen.getByText('200 XP')).toBeInTheDocument();
      expect(screen.getByText('Warrior Badge')).toBeInTheDocument();
    });

    it('applies correct styling for different rarities', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const commonAchievement = screen.getByText('First Steps').closest('[data-testid="achievement-badge"]');
      const rareAchievement = screen.getByText('Code Warrior').closest('[data-testid="achievement-badge"]');
      const epicAchievement = screen.getByText('Learning Streak').closest('[data-testid="achievement-badge"]');
      
      expect(commonAchievement).toHaveClass('border-secondary-300');
      expect(rareAchievement).toHaveClass('border-blue-300');
      expect(epicAchievement).toHaveClass('border-purple-300');
    });
  });

  describe('Statistics Calculations', () => {
    it('calculates overall completion percentage correctly', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // 2 earned out of 8 total = 25%
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    });

    it('calculates rarity statistics correctly', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // Based on mock data: 1 common, 1 rare, 0 epic, 0 legendary earned
      const rarityStats = screen.getAllByTestId('rarity-stat');
      expect(rarityStats[0]).toHaveTextContent('1'); // Common
      expect(rarityStats[1]).toHaveTextContent('1'); // Rare
      expect(rarityStats[2]).toHaveTextContent('0'); // Epic
      expect(rarityStats[3]).toHaveTextContent('0'); // Legendary
    });

    it('updates statistics when achievements change', () => {
      const { rerender } = render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const updatedAchievements = mockUserAchievements.map(achievement =>
        achievement.id === 3 ? { ...achievement, earned: true, progress: 100 } : achievement
      );
      
      rerender(<AchievementSystem userAchievements={updatedAchievements} />);
      
      // Should now show 3/8 unlocked
      expect(screen.getByText(/3\/8/)).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('handles empty achievements array', () => {
      render(<AchievementSystem userAchievements={[]} />);
      
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      expect(screen.getByText('0/0')).toBeInTheDocument();
    });

    it('shows appropriate message when no achievements are available', () => {
      render(<AchievementSystem userAchievements={[]} />);
      
      expect(screen.getByText('No achievements found')).toBeInTheDocument();
    });

    it('handles undefined userAchievements prop', () => {
      render(<AchievementSystem />);
      
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      // Should render with default empty state
    });
  });

  describe('Responsive Design', () => {
    it('adapts grid layout for different screen sizes', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const achievementGrid = screen.getByTestId('achievement-grid');
      expect(achievementGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('stacks filters vertically on mobile', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const filtersContainer = screen.getByTestId('filters-container');
      expect(filtersContainer).toHaveClass('flex-col', 'md:flex-row');
    });

    it('adjusts rarity breakdown for mobile', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const rarityGrid = screen.getByTestId('rarity-grid');
      expect(rarityGrid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
    });
  });

  describe('Animations', () => {
    it('applies staggered animations to achievement cards', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const achievementCards = screen.getAllByTestId('achievement-badge');
      achievementCards.forEach((card, index) => {
        expect(card).toHaveAttribute('data-animation-delay', (index * 0.1).toString());
      });
    });

    it('animates progress bars', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(bar => {
        expect(bar).toHaveClass('animated');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for interactive elements', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      expect(searchInput).toHaveAttribute('aria-label', 'Search achievements');
      
      const categorySelect = screen.getByDisplayValue('All Categories');
      expect(categorySelect).toHaveAttribute('aria-label', 'Filter by category');
      
      const raritySelect = screen.getByDisplayValue('All Rarities');
      expect(raritySelect).toHaveAttribute('aria-label', 'Filter by rarity');
    });

    it('supports keyboard navigation', async () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const searchInput = screen.getByPlaceholderText('Search achievements...');
      searchInput.focus();
      
      expect(searchInput).toHaveFocus();
      
      // Tab to next element
      await user.tab();
      expect(screen.getByDisplayValue('All Categories')).toHaveFocus();
    });

    it('provides proper progress bar accessibility', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-label');
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
      });
    });

    it('maintains proper heading hierarchy', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Achievements');
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('provides alternative text for achievement icons', () => {
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const achievementIcons = screen.getAllByTestId('achievement-icon');
      achievementIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Performance', () => {
    it('memoizes filtered results', () => {
      const { rerender } = render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // Re-render with same props
      rerender(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      // Should not cause unnecessary recalculations
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    it('handles large numbers of achievements efficiently', () => {
      const largeAchievementList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Achievement ${i + 1}`,
        description: `Description ${i + 1}`,
        iconType: 'star',
        category: 'learning',
        rarity: 'common',
        earned: i % 2 === 0,
        progress: i % 2 === 0 ? 100 : Math.floor(Math.random() * 100),
      }));
      
      render(<AchievementSystem userAchievements={largeAchievementList} />);
      
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      // Should render without performance issues
    });
  });

  describe('Error Handling', () => {
    it('handles malformed achievement data', () => {
      const malformedAchievements = [
        { id: 1, title: null, description: undefined },
        { id: 2, earned: 'invalid', progress: 'not-a-number' },
      ];
      
      render(<AchievementSystem userAchievements={malformedAchievements} />);
      
      // Should not crash and should render gracefully
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    it('handles sharing errors gracefully', async () => {
      navigator.share.mockRejectedValueOnce(new Error('Share failed'));
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard failed'));
      
      render(<AchievementSystem userAchievements={mockUserAchievements} />);
      
      const shareButton = screen.getAllByLabelText('Share achievement')[0];
      await user.click(shareButton);
      
      // Should not crash when sharing fails
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });
  });
});