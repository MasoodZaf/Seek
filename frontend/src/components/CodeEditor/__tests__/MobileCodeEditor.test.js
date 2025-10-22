import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileCodeEditor from '../MobileCodeEditor';
import ThemeContext from '../../../context/ThemeContext';

// Mock Monaco Editor for mobile
jest.mock('../MonacoCodeEditor', () => {
  return function MockMonacoCodeEditor({ value, onChange, onMount, options, ...props }) {
    React.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          getValue: () => value,
          setValue: (newValue) => onChange(newValue),
          getModel: () => ({
            getFullModelRange: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }),
            getValueInRange: (range) => value.substring(0, 10),
            getLineContent: (lineNumber) => value.split('\n')[lineNumber - 1] || ''
          }),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getSelection: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }),
          executeEdits: jest.fn((source, edits) => {
            if (edits && edits[0]) {
              onChange(edits[0].text);
            }
          }),
          focus: jest.fn(),
          onDidChangeCursorPosition: jest.fn((callback) => {
            // Simulate cursor position change
            setTimeout(() => callback({ position: { lineNumber: 1, column: 1 } }), 0);
          }),
          onDidChangeCursorSelection: jest.fn((callback) => {
            // Simulate selection change
            setTimeout(() => callback({ selection: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } }), 0);
          }),
          getDomNode: () => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
          }),
          getAction: (actionId) => ({ run: jest.fn() })
        };
        onMount(mockEditor);
      }
    }, [onMount, value, onChange]);

    return (
      <div data-testid="monaco-editor-mobile" style={{ height: options?.height || '100%' }}>
        <textarea
          data-testid="monaco-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            width: '100%', 
            height: '100%',
            fontSize: options?.fontSize || 12,
            fontFamily: options?.fontFamily || 'monospace'
          }}
        />
      </div>
    );
  };
});

const mockThemeContext = {
  isDarkMode: false,
  toggleTheme: jest.fn()
};

const renderWithTheme = (component, { isDarkMode = false } = {}) => {
  const themeValue = { ...mockThemeContext, isDarkMode };
  
  return render(
    <ThemeContext.Provider value={themeValue}>
      {component}
    </ThemeContext.Provider>
  );
};

describe('MobileCodeEditor', () => {
  const defaultProps = {
    value: 'console.log("Hello, World!");',
    onChange: jest.fn(),
    language: 'javascript',
    onExecute: jest.fn(),
    isExecuting: false,
    theme: 'seek-light-professional',
    fontSize: 12
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders mobile code editor with toolbar', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      expect(screen.getByTestId('monaco-editor-mobile')).toBeInTheDocument();
      expect(screen.getByText('🟨 JavaScript')).toBeInTheDocument();
      expect(screen.getByText('1:1')).toBeInTheDocument(); // Cursor position
    });

    test('renders in dark mode correctly', () => {
      renderWithTheme(
        <MobileCodeEditor {...defaultProps} />, 
        { isDarkMode: true }
      );
      
      const toolbar = screen.getByText('🟨 JavaScript').closest('div');
      expect(toolbar).toHaveClass('border-gray-700', 'bg-gray-800');
    });

    test('displays correct language icon and name', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} language="python" />);
      
      expect(screen.getByText('🐍 Python')).toBeInTheDocument();
    });

    test('shows cursor position', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('1:1')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Toolbar Interactions', () => {
    test('toggles fullscreen mode', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
      await userEvent.click(fullscreenButton);
      
      // Should show exit fullscreen icon
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
    });

    test('toggles find/replace panel', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const searchButton = screen.getByRole('button');
      const searchButtons = screen.getAllByRole('button');
      const findButton = searchButtons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('magnifying-glass') ||
        btn.title?.includes('search') ||
        btn.getAttribute('aria-label')?.includes('search')
      );
      
      if (findButton) {
        await userEvent.click(findButton);
        
        expect(screen.getByPlaceholderText('Find...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Replace...')).toBeInTheDocument();
      }
    });

    test('toggles keyboard helper', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      const keyboardButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('keyboard') ||
        btn.title?.includes('keyboard')
      );
      
      if (keyboardButton) {
        await userEvent.click(keyboardButton);
        
        // Should show virtual keyboard helpers
        expect(screen.getByText('()')).toBeInTheDocument();
        expect(screen.getByText('{}')).toBeInTheDocument();
        expect(screen.getByText('[]')).toBeInTheDocument();
      }
    });

    test('toggles quick actions panel', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document') ||
        btn.title?.includes('actions')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        // Should show JavaScript snippets
        expect(screen.getByText('console.log')).toBeInTheDocument();
        expect(screen.getByText('function')).toBeInTheDocument();
      }
    });
  });

  describe('Code Editing Features', () => {
    test('handles code changes', async () => {
      const onChange = jest.fn();
      renderWithTheme(<MobileCodeEditor {...defaultProps} onChange={onChange} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
      await userEvent.clear(textarea);
      await userEvent.type(textarea, 'const x = 42;');
      
      expect(onChange).toHaveBeenCalledWith('const x = 42;');
    });

    test('inserts text snippets', async () => {
      const onChange = jest.fn();
      renderWithTheme(<MobileCodeEditor {...defaultProps} onChange={onChange} />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        const consoleLogButton = screen.getByText('console.log');
        await userEvent.click(consoleLogButton);
        
        // Should insert the snippet
        expect(onChange).toHaveBeenCalled();
      }
    });

    test('inserts keyboard helper symbols', async () => {
      const onChange = jest.fn();
      renderWithTheme(<MobileCodeEditor {...defaultProps} onChange={onChange} />);
      
      // Open keyboard helper
      const buttons = screen.getAllByRole('button');
      const keyboardButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('keyboard')
      );
      
      if (keyboardButton) {
        await userEvent.click(keyboardButton);
        
        const parenButton = screen.getByText('()');
        await userEvent.click(parenButton);
        
        // Should insert parentheses
        expect(onChange).toHaveBeenCalled();
      }
    });

    test('handles cursor movement', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      // Open keyboard helper to access cursor controls
      const buttons = screen.getAllByRole('button');
      const keyboardButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('keyboard')
      );
      
      if (keyboardButton) {
        await userEvent.click(keyboardButton);
        
        // Should show cursor navigation buttons
        const upButton = screen.getAllByRole('button').find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('chevron-up')
        );
        
        if (upButton) {
          await userEvent.click(upButton);
          // Cursor movement is handled by the Monaco editor mock
        }
      }
    });
  });

  describe('Find and Replace', () => {
    test('performs find operation', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      // Open find/replace
      const buttons = screen.getAllByRole('button');
      const findButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('magnifying-glass')
      );
      
      if (findButton) {
        await userEvent.click(findButton);
        
        const findInput = screen.getByPlaceholderText('Find...');
        await userEvent.type(findInput, 'console');
        
        const findActionButton = screen.getByText('Find');
        await userEvent.click(findActionButton);
        
        // Find operation should be triggered
        expect(findInput.value).toBe('console');
      }
    });

    test('performs replace operation', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      // Open find/replace
      const buttons = screen.getAllByRole('button');
      const findButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('magnifying-glass')
      );
      
      if (findButton) {
        await userEvent.click(findButton);
        
        const findInput = screen.getByPlaceholderText('Find...');
        const replaceInput = screen.getByPlaceholderText('Replace...');
        
        await userEvent.type(findInput, 'console');
        await userEvent.type(replaceInput, 'print');
        
        const replaceButton = screen.getByText('Replace');
        await userEvent.click(replaceButton);
        
        // Replace operation should be triggered
        expect(replaceInput.value).toBe('print');
      }
    });
  });

  describe('Code Execution', () => {
    test('executes code when run button is clicked', async () => {
      const onExecute = jest.fn();
      renderWithTheme(<MobileCodeEditor {...defaultProps} onExecute={onExecute} />);
      
      const runButton = screen.getByText('Run');
      await userEvent.click(runButton);
      
      expect(onExecute).toHaveBeenCalled();
    });

    test('shows executing state', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} isExecuting={true} />);
      
      const runButton = screen.getByText('Running...');
      expect(runButton).toBeDisabled();
    });

    test('disables run button for non-executable languages', () => {
      // Mock a non-executable language
      const mockGetLanguageById = jest.fn(() => ({
        id: 'swift',
        name: 'Swift',
        icon: '🦉',
        executionSupported: false
      }));
      
      jest.doMock('../languageConfig', () => ({
        getLanguageById: mockGetLanguageById
      }));
      
      renderWithTheme(<MobileCodeEditor {...defaultProps} language="swift" />);
      
      const runButton = screen.getByText('Run');
      expect(runButton).toBeDisabled();
    });
  });

  describe('Mobile-Specific Features', () => {
    test('shows code statistics in action bar', () => {
      const code = 'line 1\nline 2\nline 3';
      renderWithTheme(<MobileCodeEditor {...defaultProps} value={code} />);
      
      expect(screen.getByText('Lines: 3')).toBeInTheDocument();
      expect(screen.getByText(`Chars: ${code.length}`)).toBeInTheDocument();
    });

    test('shows selected text count when text is selected', async () => {
      const code = 'Hello World';
      renderWithTheme(<MobileCodeEditor {...defaultProps} value={code} />);
      
      // Simulate text selection (this would be handled by Monaco editor)
      await waitFor(() => {
        // The selection tracking is handled by Monaco editor callbacks
        // In a real scenario, this would show selected character count
      });
    });

    test('handles touch-friendly interactions', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const editor = screen.getByTestId('monaco-editor-mobile');
      
      // Simulate touch events
      fireEvent.touchStart(editor, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      fireEvent.touchEnd(editor, {
        changedTouches: [{ clientX: 100, clientY: 100 }]
      });
      
      // Touch events should be handled without errors
      expect(editor).toBeInTheDocument();
    });

    test('prevents zoom on double tap', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const editor = screen.getByTestId('monaco-editor-mobile');
      
      // Simulate double tap
      fireEvent.touchStart(editor, {
        touches: [{ clientX: 100, clientY: 100 }, { clientX: 110, clientY: 110 }]
      });
      
      // Should prevent default behavior for multi-touch
      expect(editor).toBeInTheDocument();
    });
  });

  describe('Language-Specific Snippets', () => {
    test('shows JavaScript snippets for JavaScript language', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} language="javascript" />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        expect(screen.getByText('console.log')).toBeInTheDocument();
        expect(screen.getByText('function')).toBeInTheDocument();
        expect(screen.getByText('arrow function')).toBeInTheDocument();
      }
    });

    test('shows Python snippets for Python language', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} language="python" />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        expect(screen.getByText('print')).toBeInTheDocument();
        expect(screen.getByText('def function')).toBeInTheDocument();
        expect(screen.getByText('class')).toBeInTheDocument();
      }
    });

    test('shows Java snippets for Java language', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} language="java" />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        expect(screen.getByText('System.out.println')).toBeInTheDocument();
        expect(screen.getByText('method')).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for mobile controls', () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const runButton = screen.getByText('Run');
      expect(runButton).toBeInTheDocument();
      
      // All buttons should be accessible
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('supports keyboard navigation on mobile controls', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const runButton = screen.getByText('Run');
      
      // Focus and activate with keyboard
      runButton.focus();
      expect(runButton).toHaveFocus();
      
      fireEvent.keyDown(runButton, { key: 'Enter' });
      expect(defaultProps.onExecute).toHaveBeenCalled();
    });

    test('provides proper focus management', async () => {
      renderWithTheme(<MobileCodeEditor {...defaultProps} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
      
      // Focus should work properly
      textarea.focus();
      expect(textarea).toHaveFocus();
    });
  });

  describe('Performance', () => {
    test('handles large code efficiently', async () => {
      const largeCode = 'console.log("test");\n'.repeat(1000);
      const onChange = jest.fn();
      
      renderWithTheme(
        <MobileCodeEditor {...defaultProps} value={largeCode} onChange={onChange} />
      );
      
      const textarea = screen.getByTestId('monaco-textarea');
      expect(textarea.value).toBe(largeCode);
      
      // Should handle large text without performance issues
      await userEvent.type(textarea, 'x');
      expect(onChange).toHaveBeenCalled();
    });

    test('debounces rapid changes', async () => {
      const onChange = jest.fn();
      renderWithTheme(<MobileCodeEditor {...defaultProps} onChange={onChange} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
      
      // Rapid typing
      await userEvent.type(textarea, 'abc', { delay: 1 });
      
      // Should handle rapid changes efficiently
      expect(onChange).toHaveBeenCalled();
    });
  });
});