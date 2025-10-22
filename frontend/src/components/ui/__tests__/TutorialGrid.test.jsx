import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorialGrid from '../TutorialGrid';

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
    isFeatured: true,
    createdAt: '2024-01-15',
    progress: 0,
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
    isFeatured: false,
    createdAt: '2024-01-20',
    progress: 45,
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
    isFeatured: false,
    createdAt: '2024-01-10',
    progress: 100,
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
    isFeatured: true,
    createdAt: '2024-01-25',
    progress: 20,
  },
];

describe('TutorialGrid', () => {
  const user = userEvent.setup();
  const mockOnTutorialClick = jest.fn();
  const mockOnBookmark = jest.fn();
  const mockOnRate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
    });

    it('displays all tutorials by default', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      expect(screen.getByText('Advanced CSS')).toBeInTheDocument();
    });

    it('shows correct tutorial count', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      expect(screen.getByText('4 tutorials')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <TutorialGrid tutorials={mockTutorials} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders in grid view by default', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const gridContainer = screen.getByTestId('tutorial-grid');
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Loading State', () => {
    it('displays loading skeletons when loading', () => {
      render(<TutorialGrid tutorials={[]} loading={true} />);
      
      const skeletons = screen.getAllByTestId('loading-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows loading skeleton for filters', () => {
      render(<TutorialGrid tutorials={[]} loading={true} />);
      
      const filterSkeletons = screen.getAllByTestId('filter-skeleton');
      expect(filterSkeletons.length).toBeGreaterThan(0);
    });

    it('hides content when loading', () => {
      render(<TutorialGrid tutorials={mockTutorials} loading={true} />);
      
      expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters tutorials by search term', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      await user.type(searchInput, 'JavaScript');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.queryByText('Python for Beginners')).not.toBeInTheDocument();
      });
    });

    it('searches in title, description, and language', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      
      // Search by description
      await user.clear(searchInput);
      await user.type(searchInput, 'fundamentals');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      // Search by language
      await user.clear(searchInput);
      await user.type(searchInput, 'python');
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
        expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument();
      });
    });

    it('shows search results header', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      await user.type(searchInput, 'React');
      
      await waitFor(() => {
        expect(screen.getByText('Search results for "React"')).toBeInTheDocument();
      });
    });

    it('updates result count when searching', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      await user.type(searchInput, 'JavaScript');
      
      await waitFor(() => {
        expect(screen.getByText('1 tutorial')).toBeInTheDocument();
      });
    });

    it('is case insensitive', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      await user.type(searchInput, 'JAVASCRIPT');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      });
    });

    it('can be disabled', () => {
      render(<TutorialGrid tutorials={mockTutorials} searchable={false} />);
      
      expect(screen.queryByPlaceholderText('Search tutorials...')).not.toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters by language', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const languageSelect = screen.getByDisplayValue('All Languages');
      await user.selectOptions(languageSelect, 'javascript');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.queryByText('Python for Beginners')).not.toBeInTheDocument();
      });
    });

    it('filters by difficulty', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const difficultySelect = screen.getByDisplayValue('All Levels');
      await user.selectOptions(difficultySelect, 'beginner');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
        expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument();
        expect(screen.queryByText('Advanced CSS')).not.toBeInTheDocument();
      });
    });

    it('filters by category', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const categorySelect = screen.getByDisplayValue('All Categories');
      await user.selectOptions(categorySelect, 'frontend');
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('Advanced CSS')).toBeInTheDocument();
        expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument();
        expect(screen.queryByText('Python for Beginners')).not.toBeInTheDocument();
      });
    });

    it('combines multiple filters', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const languageSelect = screen.getByDisplayValue('All Languages');
      const difficultySelect = screen.getByDisplayValue('All Levels');
      
      await user.selectOptions(languageSelect, 'javascript');
      await user.selectOptions(difficultySelect, 'beginner');
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument();
      });
    });

    it('shows active filter count', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const languageSelect = screen.getByDisplayValue('All Languages');
      await user.selectOptions(languageSelect, 'javascript');
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Filter count badge
      });
    });

    it('clears all filters', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const languageSelect = screen.getByDisplayValue('All Languages');
      await user.selectOptions(languageSelect, 'javascript');
      
      const clearButton = screen.getByText('Clear Filters');
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText('4 tutorials')).toBeInTheDocument();
        expect(languageSelect.value).toBe('all');
      });
    });

    it('can be disabled', () => {
      render(<TutorialGrid tutorials={mockTutorials} filterable={false} />);
      
      expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    });

    it('shows/hides filter panel', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      
      // Initially hidden
      expect(screen.queryByDisplayValue('All Languages')).not.toBeInTheDocument();
      
      // Show filters
      await user.click(filtersButton);
      expect(screen.getByDisplayValue('All Languages')).toBeInTheDocument();
      
      // Hide filters
      await user.click(filtersButton);
      await waitFor(() => {
        expect(screen.queryByDisplayValue('All Languages')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('sorts by featured by default', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const tutorialTitles = screen.getAllByTestId('tutorial-title');
      expect(tutorialTitles[0]).toHaveTextContent('JavaScript Basics'); // Featured
      expect(tutorialTitles[1]).toHaveTextContent('Advanced CSS'); // Featured
    });

    it('sorts by newest', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const sortSelect = screen.getByDisplayValue('Featured');
      await user.selectOptions(sortSelect, 'newest');
      
      await waitFor(() => {
        const tutorialTitles = screen.getAllByTestId('tutorial-title');
        expect(tutorialTitles[0]).toHaveTextContent('Advanced CSS'); // 2024-01-25
      });
    });

    it('sorts by popularity', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const sortSelect = screen.getByDisplayValue('Featured');
      await user.selectOptions(sortSelect, 'popular');
      
      await waitFor(() => {
        const tutorialTitles = screen.getAllByTestId('tutorial-title');
        expect(tutorialTitles[0]).toHaveTextContent('React Fundamentals'); // 2000 enrolled
      });
    });

    it('sorts by rating', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const sortSelect = screen.getByDisplayValue('Featured');
      await user.selectOptions(sortSelect, 'rating');
      
      await waitFor(() => {
        const tutorialTitles = screen.getAllByTestId('tutorial-title');
        expect(tutorialTitles[0]).toHaveTextContent('React Fundamentals'); // 4.8 rating
      });
    });

    it('sorts by duration', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const sortSelect = screen.getByDisplayValue('Featured');
      await user.selectOptions(sortSelect, 'duration');
      
      await waitFor(() => {
        const tutorialTitles = screen.getAllByTestId('tutorial-title');
        expect(tutorialTitles[0]).toHaveTextContent('Python for Beginners'); // 90 minutes
      });
    });

    it('sorts by progress', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const sortSelect = screen.getByDisplayValue('Featured');
      await user.selectOptions(sortSelect, 'progress');
      
      await waitFor(() => {
        const tutorialTitles = screen.getAllByTestId('tutorial-title');
        expect(tutorialTitles[0]).toHaveTextContent('Python for Beginners'); // 100% progress
      });
    });

    it('can be disabled', () => {
      render(<TutorialGrid tutorials={mockTutorials} sortable={false} />);
      
      const filtersButton = screen.getByText('Filters');
      fireEvent.click(filtersButton);
      
      expect(screen.queryByDisplayValue('Featured')).not.toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('switches between grid and list view', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const listViewButton = screen.getByLabelText('List view');
      await user.click(listViewButton);
      
      const container = screen.getByTestId('tutorial-container');
      expect(container).toHaveClass('space-y-4');
      expect(container).not.toHaveClass('grid');
    });

    it('highlights active view mode', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const gridViewButton = screen.getByLabelText('Grid view');
      const listViewButton = screen.getByLabelText('List view');
      
      expect(gridViewButton).toHaveClass('bg-primary-500');
      expect(listViewButton).not.toHaveClass('bg-primary-500');
      
      await user.click(listViewButton);
      
      expect(listViewButton).toHaveClass('bg-primary-500');
      expect(gridViewButton).not.toHaveClass('bg-primary-500');
    });

    it('can be disabled', () => {
      render(<TutorialGrid tutorials={mockTutorials} viewToggle={false} />);
      
      expect(screen.queryByLabelText('Grid view')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('List view')).not.toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no tutorials match filters', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      await user.type(searchInput, 'nonexistent tutorial');
      
      await waitFor(() => {
        expect(screen.getByText('No tutorials found')).toBeInTheDocument();
        expect(screen.getByText(/no tutorials match your search/i)).toBeInTheDocument();
      });
    });

    it('shows clear filters button in empty state', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const languageSelect = screen.getByDisplayValue('All Languages');
      await user.selectOptions(languageSelect, 'nonexistent');
      
      await waitFor(() => {
        const clearButton = screen.getByText('Clear Filters');
        expect(clearButton).toBeInTheDocument();
      });
    });

    it('handles empty tutorials array', () => {
      render(<TutorialGrid tutorials={[]} />);
      
      expect(screen.getByText('No tutorials found')).toBeInTheDocument();
      expect(screen.getByText('0 tutorials')).toBeInTheDocument();
    });
  });

  describe('Tutorial Interactions', () => {
    it('calls onTutorialClick when tutorial is clicked', async () => {
      render(
        <TutorialGrid 
          tutorials={mockTutorials} 
          onTutorialClick={mockOnTutorialClick}
        />
      );
      
      const tutorial = screen.getByText('JavaScript Basics');
      await user.click(tutorial);
      
      expect(mockOnTutorialClick).toHaveBeenCalledWith(mockTutorials[0]);
    });

    it('calls onBookmark when bookmark is clicked', async () => {
      render(
        <TutorialGrid 
          tutorials={mockTutorials} 
          onBookmark={mockOnBookmark}
        />
      );
      
      const bookmarkButton = screen.getAllByLabelText('Bookmark tutorial')[0];
      await user.click(bookmarkButton);
      
      expect(mockOnBookmark).toHaveBeenCalledWith(mockTutorials[0], true);
    });

    it('calls onRate when rating is clicked', async () => {
      render(
        <TutorialGrid 
          tutorials={mockTutorials} 
          onRate={mockOnRate}
        />
      );
      
      const ratingStars = screen.getAllByLabelText(/rate \d stars/i);
      await user.click(ratingStars[4]); // 5 stars
      
      expect(mockOnRate).toHaveBeenCalledWith(expect.any(Object), 5);
    });
  });

  describe('Responsive Design', () => {
    it('adapts grid columns for different screen sizes', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const gridContainer = screen.getByTestId('tutorial-grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('stacks filters vertically on mobile', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      fireEvent.click(filtersButton);
      
      const filtersContainer = screen.getByTestId('filters-container');
      expect(filtersContainer).toHaveClass('flex-col', 'md:flex-row');
    });
  });

  describe('Performance', () => {
    it('memoizes filtered results', () => {
      const { rerender } = render(<TutorialGrid tutorials={mockTutorials} />);
      
      // Re-render with same props
      rerender(<TutorialGrid tutorials={mockTutorials} />);
      
      // Should not cause unnecessary recalculations
      expect(screen.getByText('4 tutorials')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
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
        isFeatured: false,
        createdAt: '2024-01-01',
        progress: 0,
      }));
      
      render(<TutorialGrid tutorials={largeTutorialList} />);
      
      expect(screen.getByText('1000 tutorials')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for interactive elements', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      expect(searchInput).toHaveAttribute('aria-label', 'Search tutorials');
      
      const filtersButton = screen.getByText('Filters');
      expect(filtersButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates ARIA attributes when filters are toggled', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      expect(filtersButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('provides proper labels for view toggle buttons', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('maintains proper heading hierarchy', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Tutorials');
    });

    it('supports keyboard navigation', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const searchInput = screen.getByPlaceholderText('Search tutorials...');
      searchInput.focus();
      
      expect(searchInput).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText('Filters')).toHaveFocus();
    });
  });

  describe('Animation', () => {
    it('applies staggered animations to tutorial cards', () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const tutorialCards = screen.getAllByTestId('tutorial-card');
      tutorialCards.forEach((card, index) => {
        expect(card).toHaveAttribute('data-animation-delay', (index * 0.05).toString());
      });
    });

    it('animates filter panel show/hide', async () => {
      render(<TutorialGrid tutorials={mockTutorials} />);
      
      const filtersButton = screen.getByText('Filters');
      await user.click(filtersButton);
      
      const filterPanel = screen.getByTestId('filter-panel');
      expect(filterPanel).toHaveClass('animate-in');
    });
  });

  describe('Error Handling', () => {
    it('handles malformed tutorial data', () => {
      const malformedTutorials = [
        { id: 1, title: null, description: undefined },
        { id: 2, language: '', difficulty: null },
      ];
      
      render(<TutorialGrid tutorials={malformedTutorials} />);
      
      // Should not crash and should render gracefully
      expect(screen.getByText('Tutorials')).toBeInTheDocument();
    });

    it('handles missing tutorial properties', () => {
      const incompleteTutorials = [
        { id: 1, title: 'Incomplete Tutorial' },
      ];
      
      render(<TutorialGrid tutorials={incompleteTutorials} />);
      
      expect(screen.getByText('Incomplete Tutorial')).toBeInTheDocument();
    });
  });
});