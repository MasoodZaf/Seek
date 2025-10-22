import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecommendationEngine from '../RecommendationEngine';

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

const mockUserProfile = {
  id: 1,
  level: 'intermediate',
  interests: ['javascript', 'react'],
  learningGoals: ['frontend', 'fullstack'],
};

const mockUserProgress = {
  languages: ['javascript', 'python'],
  categories: ['frontend', 'programming'],
  completed: [1, 3],
  currentStreak: 5,
};

const mockTutorials = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript',
    language: 'javascript',
    difficulty: 'beginner',
    category: 'programming',
    estimatedDuration: 120,
    rating: 4.5,
    enrolledCount: 1500,
    recentEnrollments: 150,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'React Fundamentals',
    description: 'Build modern UIs with React',
    language: 'javascript',
    difficulty: 'intermediate',
    category: 'frontend',
    estimatedDuration: 180,
    rating: 4.8,
    enrolledCount: 2000,
    recentEnrollments: 200,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    description: 'Start your Python journey',
    language: 'python',
    difficulty: 'beginner',
    category: 'programming',
    estimatedDuration: 90,
    rating: 4.3,
    enrolledCount: 1200,
    recentEnrollments: 80,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    createdAt: '2024-01-10',
  },
  {
    id: 4,
    title: 'Advanced CSS',
    description: 'Master advanced CSS techniques',
    language: 'css',
    difficulty: 'advanced',
    category: 'frontend',
    estimatedDuration: 150,
    rating: 4.6,
    enrolledCount: 800,
    recentEnrollments: 60,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    createdAt: '2024-01-25',
  },
  {
    id: 5,
    title: 'Quick HTML Tips',
    description: 'Essential HTML tips in 30 minutes',
    language: 'html',
    difficulty: 'beginner',
    category: 'frontend',
    estimatedDuration: 30,
    rating: 4.2,
    enrolledCount: 600,
    recentEnrollments: 40,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    createdAt: '2024-01-05',
  },
];

describe('RecommendationEngine', () => {
  const user = userEvent.setup();
  const mockOnTutorialClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    });

    it('displays recommendation header and description', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      expect(screen.getByText(/personalized tutorials based on your learning journey/i)).toBeInTheDocument();
    });

    it('shows refresh button', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <RecommendationEngine
          className="custom-class"
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Category Filters', () => {
    it('displays all recommendation categories', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      expect(screen.getByText('All Recommendations')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('Quick Wins')).toBeInTheDocument();
      expect(screen.getByText('Level Up')).toBeInTheDocument();
    });

    it('highlights active category', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const allRecommendationsButton = screen.getByText('All Recommendations');
      expect(allRecommendationsButton).toHaveClass('bg-primary-500');
    });

    it('switches between categories', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      expect(personalizedButton).toHaveClass('bg-primary-500');
      expect(screen.getByText('All Recommendations')).not.toHaveClass('bg-primary-500');
    });
  });

  describe('Recommendation Generation', () => {
    it('shows loading state initially', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const loadingSkeletons = screen.getAllByTestId('loading-skeleton');
      expect(loadingSkeletons.length).toBeGreaterThan(0);
    });

    it('generates recommendations after loading', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      // Fast-forward past the loading delay
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
    });

    it('limits recommendations to maxRecommendations', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
          maxRecommendations={2}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendationCards = screen.getAllByTestId('tutorial-card');
        expect(recommendationCards.length).toBeLessThanOrEqual(2);
      });
    });

    it('refreshes recommendations when refresh button is clicked', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });
      
      const refreshButton = screen.getByText('Refresh');
      await user.click(refreshButton);
      
      // Should show loading again
      expect(screen.getAllByTestId('loading-skeleton').length).toBeGreaterThan(0);
    });
  });

  describe('Personalized Recommendations', () => {
    it('filters out completed tutorials', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Tutorial with id 1 and 3 are completed, should not appear
        expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument();
        expect(screen.queryByText('Python for Beginners')).not.toBeInTheDocument();
      });
    });

    it('prioritizes user languages', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Should show JavaScript tutorials (user language)
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
    });

    it('matches user difficulty level', async () => {
      const beginnerProfile = { ...mockUserProfile, level: 'beginner' };
      
      render(
        <RecommendationEngine
          userProfile={beginnerProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Should prioritize beginner tutorials
        const tutorialCards = screen.getAllByTestId('tutorial-card');
        expect(tutorialCards.length).toBeGreaterThan(0);
      });
    });

    it('shows personalization reason', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Based on your learning path')).toBeInTheDocument();
      });
    });
  });

  describe('Trending Recommendations', () => {
    it('shows trending tutorials', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const trendingButton = screen.getByText('Trending');
      await user.click(trendingButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
    });

    it('shows trending reason', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const trendingButton = screen.getByText('Trending');
      await user.click(trendingButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Trending this week')).toBeInTheDocument();
      });
    });
  });

  describe('Popular Recommendations', () => {
    it('shows popular tutorials', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const popularButton = screen.getByText('Popular');
      await user.click(popularButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Tutorials with >500 enrollments
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      });
    });

    it('shows popular reason', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const popularButton = screen.getByText('Popular');
      await user.click(popularButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Popular with learners')).toBeInTheDocument();
      });
    });
  });

  describe('Quick Wins Recommendations', () => {
    it('shows short duration tutorials', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const quickButton = screen.getByText('Quick Wins');
      await user.click(quickButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Tutorial with 30 minutes duration
        expect(screen.getByText('Quick HTML Tips')).toBeInTheDocument();
      });
    });

    it('shows quick completion reason', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const quickButton = screen.getByText('Quick Wins');
      await user.click(quickButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Quick to complete')).toBeInTheDocument();
      });
    });
  });

  describe('Level Up Recommendations', () => {
    it('shows next difficulty level tutorials', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const levelUpButton = screen.getByText('Level Up');
      await user.click(levelUpButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // For intermediate user, should show advanced tutorials
        expect(screen.getByText('Advanced CSS')).toBeInTheDocument();
      });
    });

    it('shows level up reason', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const levelUpButton = screen.getByText('Level Up');
      await user.click(levelUpButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Ready for advanced level')).toBeInTheDocument();
      });
    });

    it('adapts to beginner users', async () => {
      const beginnerProfile = { ...mockUserProfile, level: 'beginner' };
      
      render(
        <RecommendationEngine
          userProfile={beginnerProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const levelUpButton = screen.getByText('Level Up');
      await user.click(levelUpButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Ready for intermediate level')).toBeInTheDocument();
      });
    });
  });

  describe('Recommendation Badges', () => {
    it('shows recommendation badges on tutorial cards', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendedBadges = screen.getAllByText('Recommended');
        expect(recommendedBadges.length).toBeGreaterThan(0);
      });
    });

    it('shows appropriate icons for different recommendation types', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const personalizedButton = screen.getByText('For You');
      await user.click(personalizedButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const reasonIcons = screen.getAllByTestId('recommendation-icon');
        expect(reasonIcons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Tutorial Interactions', () => {
    it('calls onTutorialClick when tutorial is clicked', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
          onTutorialClick={mockOnTutorialClick}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const tutorial = screen.getByText('React Fundamentals');
        fireEvent.click(tutorial);
        
        expect(mockOnTutorialClick).toHaveBeenCalled();
      });
    });

    it('marks tutorials as recommended', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
          onTutorialClick={mockOnTutorialClick}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const tutorialCards = screen.getAllByTestId('tutorial-card');
        tutorialCards.forEach(card => {
          expect(card).toHaveAttribute('data-recommended', 'true');
        });
      });
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no recommendations available', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={[]}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('No recommendations available')).toBeInTheDocument();
        expect(screen.getByText(/complete a few tutorials to get personalized recommendations/i)).toBeInTheDocument();
      });
    });

    it('shows browse all tutorials button in empty state', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={[]}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Browse All Tutorials')).toBeInTheDocument();
      });
    });

    it('handles category with no matching tutorials', async () => {
      const limitedTutorials = [mockTutorials[0]]; // Only one tutorial
      
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={limitedTutorials}
        />
      );
      
      const quickButton = screen.getByText('Quick Wins');
      await user.click(quickButton);
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('No recommendations available')).toBeInTheDocument();
      });
    });
  });

  describe('Recommendation Insights', () => {
    it('shows recommendation insights when recommendations are available', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Why these recommendations?')).toBeInTheDocument();
        expect(screen.getByText(/our ai analyzes your learning patterns/i)).toBeInTheDocument();
      });
    });

    it('hides insights when no recommendations', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={[]}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.queryByText('Why these recommendations?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('adapts grid layout for different screen sizes', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendationGrid = screen.getByTestId('recommendation-grid');
        expect(recommendationGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
      });
    });

    it('wraps category filters on mobile', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const categoryFilters = screen.getByTestId('category-filters');
      expect(categoryFilters).toHaveClass('flex-wrap');
    });
  });

  describe('Performance', () => {
    it('memoizes recommendation calculations', () => {
      const { rerender } = render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      // Re-render with same props
      rerender(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      // Should not cause unnecessary recalculations
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    });

    it('handles large tutorial datasets efficiently', async () => {
      const largeTutorialList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        title: `Tutorial ${i + 1}`,
        description: `Description ${i + 1}`,
        language: 'javascript',
        difficulty: 'beginner',
        category: 'programming',
        estimatedDuration: 60,
        rating: 4.0,
        enrolledCount: 100,
        recentEnrollments: 10,
        isFeatured: false,
        isTrending: false,
        isNew: false,
        createdAt: '2024-01-01',
      }));
      
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={largeTutorialList}
          maxRecommendations={6}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendationCards = screen.getAllByTestId('tutorial-card');
        expect(recommendationCards.length).toBeLessThanOrEqual(6);
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for category buttons', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const categoryButtons = screen.getAllByRole('button');
      categoryButtons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('supports keyboard navigation', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const firstCategoryButton = screen.getByText('All Recommendations');
      firstCategoryButton.focus();
      
      expect(firstCategoryButton).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText('For You')).toHaveFocus();
    });

    it('maintains proper heading hierarchy', () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Recommended for You');
    });

    it('provides alternative text for recommendation icons', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendationIcons = screen.getAllByTestId('recommendation-icon');
        recommendationIcons.forEach(icon => {
          expect(icon).toHaveAttribute('aria-label');
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing user profile gracefully', async () => {
      render(
        <RecommendationEngine
          userProfile={null}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      });
    });

    it('handles missing user progress gracefully', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={null}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      });
    });

    it('handles malformed tutorial data', async () => {
      const malformedTutorials = [
        { id: 1, title: null, description: undefined },
        { id: 2, language: '', difficulty: null },
      ];
      
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={malformedTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Should not crash and should render gracefully
        expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      });
    });
  });

  describe('Animation', () => {
    it('applies staggered animations to recommendation cards', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const recommendationCards = screen.getAllByTestId('tutorial-card');
        recommendationCards.forEach((card, index) => {
          expect(card).toHaveAttribute('data-animation-delay', (index * 0.1).toString());
        });
      });
    });

    it('animates recommendation reason text', async () => {
      render(
        <RecommendationEngine
          userProfile={mockUserProfile}
          userProgress={mockUserProgress}
          tutorials={mockTutorials}
        />
      );
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        const reasonTexts = screen.getAllByTestId('recommendation-reason');
        reasonTexts.forEach((text, index) => {
          expect(text).toHaveAttribute('data-animation-delay', (index * 0.1 + 0.3).toString());
        });
      });
    });
  });
});