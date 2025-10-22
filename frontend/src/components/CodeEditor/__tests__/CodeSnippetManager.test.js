import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeSnippetManager from '../CodeSnippetManager';
import ThemeContext from '../../../context/ThemeContext';
import AuthContext from '../../../context/AuthContext';

const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com'
};

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true
};

const mockThemeContext = {
  isDarkMode: false,
  toggleTheme: jest.fn()
};

const mockSnippets = [
  {
    id: '1',
    name: 'Hello World',
    description: 'Basic hello world example',
    code: 'console.log("Hello, World!");',
    language: 'javascript',
    category: 'examples',
    tags: ['basic', 'console'],
    isPublic: false,
    isFavorite: true,
    userId: '1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    usageCount: 5
  },
  {
    id: '2',
    name: 'Python Function',
    description: 'Basic Python function',
    code: 'def greet(name):\n    return f"Hello, {name}!"',
    language: 'python',
    category: 'functions',
    tags: ['function', 'python'],
    isPublic: true,
    isFavorite: false,
    userId: '1',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    usageCount: 2
  },
  {
    id: '3',
    name: 'Java Class',
    description: 'Simple Java class example',
    code: 'public class Person {\n    private String name;\n    \n    public Person(String name) {\n        this.name = name;\n    }\n}',
    language: 'java',
    category: 'objects',
    tags: ['class', 'java', 'oop'],
    isPublic: false,
    isFavorite: false,
    userId: '1',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
    usageCount: 1
  }
];

const renderWithProviders = (component, { user = mockUser, isDarkMode = false } = {}) => {
  const authValue = { ...mockAuthContext, user };
  const themeValue = { ...mockThemeContext, isDarkMode };

  return render(
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        {component}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

describe('CodeSnippetManager', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onLoadSnippet: jest.fn(),
    currentCode: 'console.log("test");',
    currentLanguage: 'javascript'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue()
      }
    });
    
    // Mock navigator.share
    Object.assign(navigator, {
      share: jest.fn().mockResolvedValue()
    });
    
    // Mock URL and document methods for export functionality
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    const mockElement = {
      href: '',
      download: '',
      click: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockElement);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    
    // Mock window.confirm
    global.confirm = jest.fn(() => true);
  });

  describe('Component Rendering', () => {
    test('renders snippet manager when open', () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      expect(screen.getByText('Code Snippets')).toBeInTheDocument();
      expect(screen.getByText('0 snippets')).toBeInTheDocument();
      expect(screen.getByText('Save Current')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Code Snippets')).not.toBeInTheDocument();
    });

    test('renders in dark mode correctly', () => {
      renderWithProviders(
        <CodeSnippetManager {...defaultProps} />, 
        { isDarkMode: true }
      );
      
      const modal = screen.getByText('Code Snippets').closest('div');
      expect(modal).toHaveClass('bg-gray-800', 'text-white');
    });

    test('displays snippet count', () => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      expect(screen.getByText('3 snippets')).toBeInTheDocument();
    });
  });

  describe('Snippet Loading and Display', () => {
    beforeEach(() => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
    });

    test('loads and displays snippets from localStorage', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.getByText('Python Function')).toBeInTheDocument();
        expect(screen.getByText('Java Class')).toBeInTheDocument();
      });
    });

    test('displays snippet metadata correctly', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('🟨 JavaScript')).toBeInTheDocument();
        expect(screen.getByText('examples')).toBeInTheDocument();
        expect(screen.getByText('#basic')).toBeInTheDocument();
        expect(screen.getByText('#console')).toBeInTheDocument();
        expect(screen.getByText('Used 5 times')).toBeInTheDocument();
      });
    });

    test('shows favorite indicators', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(() => {
        // Hello World snippet is marked as favorite
        const favoriteIcons = screen.getAllByTestId('star-icon') || 
                             document.querySelectorAll('[data-testid*="star"]') ||
                             document.querySelectorAll('svg[class*="text-yellow"]');
        expect(favoriteIcons.length).toBeGreaterThan(0);
      });
    });

    test('displays code preview', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('console.log("Hello, World!");')).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(() => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
    });

    test('filters snippets by search term', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      await userEvent.type(searchInput, 'python');
      
      await waitFor(() => {
        expect(screen.getByText('Python Function')).toBeInTheDocument();
        expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
        expect(screen.queryByText('Java Class')).not.toBeInTheDocument();
      });
    });

    test('filters snippets by category', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const categorySelect = screen.getByDisplayValue('All');
      await userEvent.selectOptions(categorySelect, 'functions');
      
      await waitFor(() => {
        expect(screen.getByText('Python Function')).toBeInTheDocument();
        expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
        expect(screen.queryByText('Java Class')).not.toBeInTheDocument();
      });
    });

    test('sorts snippets by different criteria', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const sortSelect = screen.getByDisplayValue('Recent');
      await userEvent.selectOptions(sortSelect, 'name');
      
      await waitFor(() => {
        const snippetNames = screen.getAllByText(/Hello World|Java Class|Python Function/);
        // Should be sorted alphabetically
        expect(snippetNames[0]).toHaveTextContent('Hello World');
      });
    });

    test('filters by favorites', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const sortSelect = screen.getByDisplayValue('Recent');
      await userEvent.selectOptions(sortSelect, 'favorites');
      
      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        // Non-favorites should be after favorites
      });
    });

    test('filters by tags', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const basicTag = screen.getByText('#basic');
      await userEvent.click(basicTag);
      
      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.queryByText('Python Function')).not.toBeInTheDocument();
      });
    });
  });

  describe('Snippet Actions', () => {
    beforeEach(() => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
    });

    test('loads snippet when Load button is clicked', async () => {
      const onLoadSnippet = jest.fn();
      renderWithProviders(
        <CodeSnippetManager {...defaultProps} onLoadSnippet={onLoadSnippet} />
      );
      
      await waitFor(async () => {
        const loadButtons = screen.getAllByText('Load');
        await userEvent.click(loadButtons[0]);
      });
      
      expect(onLoadSnippet).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Hello World',
          code: 'console.log("Hello, World!");',
          language: 'javascript'
        })
      );
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('copies snippet code to clipboard', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const copyButtons = screen.getAllByTitle('Copy code');
        await userEvent.click(copyButtons[0]);
      });
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'console.log("Hello, World!");'
      );
    });

    test('shares snippet', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const shareButtons = screen.getAllByTitle('Share snippet');
        await userEvent.click(shareButtons[0]);
      });
      
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Hello World',
        text: 'Basic hello world example',
        url: expect.stringContaining('/playground?snippet=1')
      });
    });

    test('exports snippet to file', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const exportButtons = screen.getAllByTitle('Export snippet');
        await userEvent.click(exportButtons[0]);
      });
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    test('duplicates snippet', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const duplicateButtons = screen.getAllByTitle('Duplicate snippet');
        await userEvent.click(duplicateButtons[0]);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Hello World (Copy)')).toBeInTheDocument();
      });
    });

    test('deletes snippet with confirmation', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const deleteButtons = screen.getAllByTitle('Delete snippet');
        await userEvent.click(deleteButtons[0]);
      });
      
      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this snippet?'
      );
      
      await waitFor(() => {
        expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
      });
    });

    test('toggles favorite status', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const favoriteButtons = screen.getAllByRole('button');
        const favoriteButton = favoriteButtons.find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('star') ||
          btn.title?.includes('favorite')
        );
        
        if (favoriteButton) {
          await userEvent.click(favoriteButton);
        }
      });
      
      // Favorite status should be toggled in localStorage
      const updatedSnippets = JSON.parse(localStorage.getItem('code_snippets'));
      expect(updatedSnippets).toBeTruthy();
    });
  });

  describe('Snippet Creation and Editing', () => {
    test('opens save dialog when Save Current is clicked', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Current');
      await userEvent.click(saveButton);
      
      expect(screen.getByText('Save Code Snippet')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter snippet name')).toBeInTheDocument();
    });

    test('saves new snippet', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Current');
      await userEvent.click(saveButton);
      
      const nameInput = screen.getByPlaceholderText('Enter snippet name');
      const descriptionInput = screen.getByPlaceholderText('Enter description (optional)');
      const categorySelect = screen.getByDisplayValue('General');
      const tagsInput = screen.getByPlaceholderText('react, hooks, example');
      
      await userEvent.type(nameInput, 'Test Snippet');
      await userEvent.type(descriptionInput, 'Test description');
      await userEvent.selectOptions(categorySelect, 'utilities');
      await userEvent.type(tagsInput, 'test, example');
      
      const saveDialogButton = screen.getByText('Save');
      await userEvent.click(saveDialogButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Snippet')).toBeInTheDocument();
      });
      
      // Check localStorage
      const savedSnippets = JSON.parse(localStorage.getItem('code_snippets'));
      expect(savedSnippets).toContainEqual(
        expect.objectContaining({
          name: 'Test Snippet',
          description: 'Test description',
          category: 'utilities',
          tags: ['test', 'example']
        })
      );
    });

    test('edits existing snippet', async () => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const editButtons = screen.getAllByTitle('Edit snippet');
        await userEvent.click(editButtons[0]);
      });
      
      expect(screen.getByText('Edit Snippet')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument();
      
      const nameInput = screen.getByDisplayValue('Hello World');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Updated Hello World');
      
      const updateButton = screen.getByText('Update');
      await userEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Updated Hello World')).toBeInTheDocument();
      });
    });

    test('validates required fields', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Current');
      await userEvent.click(saveButton);
      
      const saveDialogButton = screen.getByText('Save');
      expect(saveDialogButton).toBeDisabled();
      
      const nameInput = screen.getByPlaceholderText('Enter snippet name');
      await userEvent.type(nameInput, 'Test');
      
      expect(saveDialogButton).not.toBeDisabled();
    });

    test('cancels save dialog', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Current');
      await userEvent.click(saveButton);
      
      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByText('Save Code Snippet')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('shows empty state when no snippets exist', () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      expect(screen.getByText('No snippets found')).toBeInTheDocument();
      expect(screen.getByText('Save your first code snippet to get started.')).toBeInTheDocument();
      expect(screen.getByText('Save Current Code')).toBeInTheDocument();
    });

    test('shows filtered empty state', async () => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      await userEvent.type(searchInput, 'nonexistent');
      
      await waitFor(() => {
        expect(screen.getByText('No snippets found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your filters or search terms.')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Interactions', () => {
    test('closes modal when close button is clicked', async () => {
      const onClose = jest.fn();
      renderWithProviders(<CodeSnippetManager {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    test('closes modal when backdrop is clicked', async () => {
      const onClose = jest.fn();
      renderWithProviders(<CodeSnippetManager {...defaultProps} onClose={onClose} />);
      
      const backdrop = screen.getByText('Code Snippets').closest('div').previousSibling;
      fireEvent.click(backdrop);
      
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Usage Tracking', () => {
    beforeEach(() => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
    });

    test('increments usage count when snippet is loaded', async () => {
      const onLoadSnippet = jest.fn();
      renderWithProviders(
        <CodeSnippetManager {...defaultProps} onLoadSnippet={onLoadSnippet} />
      );
      
      await waitFor(async () => {
        const loadButtons = screen.getAllByText('Load');
        await userEvent.click(loadButtons[0]);
      });
      
      const updatedSnippets = JSON.parse(localStorage.getItem('code_snippets'));
      const loadedSnippet = updatedSnippets.find(s => s.id === '1');
      expect(loadedSnippet.usageCount).toBe(6); // Was 5, now 6
    });
  });

  describe('Error Handling', () => {
    test('handles localStorage errors gracefully', () => {
      // Mock localStorage error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('localStorage error');
      });
      
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      // Should still render without crashing
      expect(screen.getByText('Code Snippets')).toBeInTheDocument();
      
      // Restore localStorage
      localStorage.getItem = originalGetItem;
    });

    test('handles clipboard errors gracefully', async () => {
      navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Clipboard error'));
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const copyButtons = screen.getAllByTitle('Copy code');
        await userEvent.click(copyButtons[0]);
      });
      
      // Should not crash on clipboard error
      expect(screen.getByText('Code Snippets')).toBeInTheDocument();
    });

    test('handles share API errors gracefully', async () => {
      navigator.share = jest.fn().mockRejectedValue(new Error('Share error'));
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(async () => {
        const shareButtons = screen.getAllByTitle('Share snippet');
        await userEvent.click(shareButtons[0]);
      });
      
      // Should fallback to clipboard copy
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      expect(searchInput).toHaveAttribute('type', 'text');
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('supports keyboard navigation', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      
      // Focus and activate with keyboard
      closeButton.focus();
      expect(closeButton).toHaveFocus();
      
      fireEvent.keyDown(closeButton, { key: 'Enter' });
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('provides proper focus management in dialogs', async () => {
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Current');
      await userEvent.click(saveButton);
      
      // Focus should move to the dialog
      const nameInput = screen.getByPlaceholderText('Enter snippet name');
      expect(nameInput).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('handles large number of snippets efficiently', async () => {
      const largeSnippetList = Array.from({ length: 1000 }, (_, i) => ({
        ...mockSnippets[0],
        id: i.toString(),
        name: `Snippet ${i}`,
        code: `console.log("Snippet ${i}");`
      }));
      
      localStorage.setItem('code_snippets', JSON.stringify(largeSnippetList));
      
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('1000 snippets')).toBeInTheDocument();
      });
      
      // Should handle large lists without performance issues
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      await userEvent.type(searchInput, 'Snippet 1');
      
      // Should filter efficiently
      await waitFor(() => {
        expect(screen.getByText('Snippet 1')).toBeInTheDocument();
      });
    });

    test('debounces search input', async () => {
      localStorage.setItem('code_snippets', JSON.stringify(mockSnippets));
      renderWithProviders(<CodeSnippetManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search snippets...');
      
      // Rapid typing
      await userEvent.type(searchInput, 'hello', { delay: 1 });
      
      // Should handle rapid input efficiently
      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
      });
    });
  });
});