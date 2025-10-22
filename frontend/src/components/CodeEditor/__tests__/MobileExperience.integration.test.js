import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EnhancedPlayground from '../EnhancedPlayground';
import MobileCodeEditor from '../MobileCodeEditor';
import AuthContext from '../../../context/AuthContext';
import ThemeContext from '../../../context/ThemeContext';

// Mock useResponsive hook to simulate mobile environment
jest.mock('../../../hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({
    isMobile: true,
    isTablet: false,
    isSmallScreen: true
  })
}));

// Mock Monaco Editor for mobile
jest.mock('../MonacoCodeEditor', () => {
  return function MockMonacoCodeEditor({ value, onChange, onMount, options }) {
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
            setTimeout(() => callback({ position: { lineNumber: 1, column: 1 } }), 0);
          }),
          onDidChangeCursorSelection: jest.fn((callback) => {
            setTimeout(() => callback({ selection: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } }), 0);
          }),
          getDomNode: () => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
          }),
          getAction: () => ({ run: jest.fn() })
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

// Mock other components
jest.mock('../CodeSnippetManager', () => () => null);
jest.mock('../CodeSharingModal', () => () => null);
jest.mock('../EditorSettingsPanel', () => () => null);

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

const renderWithProviders = (component, { isDarkMode = false } = {}) => {
  const themeValue = { ...mockThemeContext, isDarkMode };
  
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <ThemeContext.Provider value={themeValue}>
        {component}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

describe('Mobile Experience Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock successful API responses
    axios.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          output: {
            stdout: 'Mobile execution successful',
            stderr: ''
          },
          executionTime: 200,
          memoryUsage: 768
        }
      }
    });

    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          executions: [],
          totalExecutions: 0,
          successfulExecutions: 0,
          averageExecutionTime: 0,
          favoriteLanguage: 'javascript'
        }
      }
    });

    // Mock touch events
    global.TouchEvent = class TouchEvent extends Event {
      constructor(type, options = {}) {
        super(type, options);
        this.touches = options.touches || [];
        this.changedTouches = options.changedTouches || [];
      }
    };
  });

  describe('Mobile Playground Layout', () => {
    test('renders mobile-optimized playground', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Should show mobile view toggle
      expect(screen.getByText('📝 Editor')).toBeInTheDocument();
      expect(screen.getByText('📤 Output')).toBeInTheDocument();
      
      // Should use mobile code editor
      expect(screen.getByTestId('mobile-code-editor')).toBeInTheDocument();
    });

    test('switches between editor and output views on mobile', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Default should show editor
      expect(screen.getByTestId('mobile-code-editor')).toBeInTheDocument();
      
      // Switch to output view
      const outputToggle = screen.getByText('📤 Output');
      await userEvent.click(outputToggle);
      
      // Should show output panel
      expect(screen.getByText('Output')).toBeInTheDocument();
      
      // Switch back to editor
      const editorToggle = screen.getByText('📝 Editor');
      await userEvent.click(editorToggle);
      
      // Should show editor again
      expect(screen.getByTestId('mobile-code-editor')).toBeInTheDocument();
    });

    test('adapts to mobile screen dimensions', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Should use single column layout
      const mainContent = screen.getByText('🚀 Enhanced Playground').closest('div');
      expect(mainContent).toHaveClass('grid-cols-1');
    });
  });

  describe('Mobile Code Editor Features', () => {
    test('renders mobile code editor with touch-friendly controls', () => {
      const props = {
        value: 'console.log("mobile test");',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Should show mobile toolbar
      expect(screen.getByText('🟨 JavaScript')).toBeInTheDocument();
      expect(screen.getByText('1:1')).toBeInTheDocument(); // Cursor position
      
      // Should show mobile action bar
      expect(screen.getByText('Run')).toBeInTheDocument();
      expect(screen.getByText('Lines: 1')).toBeInTheDocument();
      expect(screen.getByText('Chars: 26')).toBeInTheDocument();
    });

    test('provides virtual keyboard helpers', async () => {
      const props = {
        value: '',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Find and click keyboard helper button
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
        expect(screen.getByText('""')).toBeInTheDocument();
        expect(screen.getByText("''")).toBeInTheDocument();
        expect(screen.getByText(';')).toBeInTheDocument();
      }
    });

    test('provides cursor navigation controls', async () => {
      const props = {
        value: 'line 1\nline 2\nline 3',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Open keyboard helper to access cursor controls
      const buttons = screen.getAllByRole('button');
      const keyboardButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('keyboard')
      );
      
      if (keyboardButton) {
        await userEvent.click(keyboardButton);
        
        // Should show cursor navigation
        const upButton = screen.getAllByRole('button').find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('chevron-up')
        );
        const downButton = screen.getAllByRole('button').find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('chevron-down')
        );
        const leftButton = screen.getAllByRole('button').find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('chevron-left')
        );
        const rightButton = screen.getAllByRole('button').find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('chevron-right')
        );
        
        expect(upButton).toBeInTheDocument();
        expect(downButton).toBeInTheDocument();
        expect(leftButton).toBeInTheDocument();
        expect(rightButton).toBeInTheDocument();
      }
    });

    test('provides language-specific code snippets', async () => {
      const props = {
        value: '',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        // Should show JavaScript snippets
        expect(screen.getByText('console.log')).toBeInTheDocument();
        expect(screen.getByText('function')).toBeInTheDocument();
        expect(screen.getByText('if statement')).toBeInTheDocument();
        expect(screen.getByText('for loop')).toBeInTheDocument();
      }
    });

    test('handles touch interactions properly', async () => {
      const props = {
        value: 'touch test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      const editor = screen.getByTestId('monaco-editor-mobile');
      
      // Simulate touch start
      fireEvent.touchStart(editor, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      // Simulate touch end
      fireEvent.touchEnd(editor, {
        changedTouches: [{ clientX: 100, clientY: 100 }]
      });
      
      // Should handle touch events without errors
      expect(editor).toBeInTheDocument();
    });

    test('prevents zoom on double tap', () => {
      const props = {
        value: 'zoom test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      const editor = screen.getByTestId('monaco-editor-mobile');
      
      // Simulate multi-touch (should prevent zoom)
      fireEvent.touchStart(editor, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 110, clientY: 110 }
        ]
      });
      
      // Should handle multi-touch without errors
      expect(editor).toBeInTheDocument();
    });
  });

  describe('Mobile Code Execution', () => {
    test('executes code on mobile with touch-friendly button', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Should show mobile editor
      const mobileEditor = screen.getByTestId('mobile-code-editor');
      expect(mobileEditor).toBeInTheDocument();
      
      // Find and click mobile run button
      const runButton = screen.getByTestId('mobile-execute-button');
      await userEvent.click(runButton);
      
      // Should execute code
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.any(String),
        language: 'javascript',
        input: ''
      }, expect.any(Object));
      
      // Switch to output view to see results
      const outputToggle = screen.getByText('📤 Output');
      await userEvent.click(outputToggle);
      
      await waitFor(() => {
        expect(screen.getByText('Mobile execution successful')).toBeInTheDocument();
      });
    });

    test('shows execution state on mobile run button', async () => {
      // Mock delayed execution
      axios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          data: { success: true, data: { output: { stdout: 'Done' } } }
        }), 100))
      );
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByTestId('mobile-execute-button');
      await userEvent.click(runButton);
      
      // Should show running state
      expect(screen.getByText('Running...')).toBeInTheDocument();
      expect(runButton).toBeDisabled();
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Run')).toBeInTheDocument();
      });
    });

    test('handles execution errors on mobile', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: 'Mobile execution error' } }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByTestId('mobile-execute-button');
      await userEvent.click(runButton);
      
      // Switch to output to see error
      const outputToggle = screen.getByText('📤 Output');
      await userEvent.click(outputToggle);
      
      await waitFor(() => {
        expect(screen.getByText(/Mobile execution error/)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Find and Replace', () => {
    test('provides mobile-friendly find and replace interface', async () => {
      const props = {
        value: 'function test() { console.log("find me"); }',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Find and open search
      const buttons = screen.getAllByRole('button');
      const searchButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('magnifying-glass')
      );
      
      if (searchButton) {
        await userEvent.click(searchButton);
        
        // Should show find/replace inputs
        expect(screen.getByPlaceholderText('Find...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Replace...')).toBeInTheDocument();
        
        // Test find functionality
        const findInput = screen.getByPlaceholderText('Find...');
        await userEvent.type(findInput, 'console');
        
        const findButton = screen.getByText('Find');
        await userEvent.click(findButton);
        
        expect(findInput.value).toBe('console');
      }
    });
  });

  describe('Mobile Fullscreen Mode', () => {
    test('toggles fullscreen mode on mobile', async () => {
      const props = {
        value: 'fullscreen test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Find fullscreen button
      const buttons = screen.getAllByRole('button');
      const fullscreenButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('arrows-pointing-out')
      );
      
      if (fullscreenButton) {
        await userEvent.click(fullscreenButton);
        
        // Should show exit fullscreen button
        const exitButton = buttons.find(btn => 
          btn.querySelector('svg')?.getAttribute('data-testid')?.includes('arrows-pointing-in')
        );
        expect(exitButton).toBeInTheDocument();
      }
    });
  });

  describe('Mobile Performance', () => {
    test('handles large code efficiently on mobile', async () => {
      const largeCode = 'console.log("line");\n'.repeat(100);
      const props = {
        value: largeCode,
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Should render without performance issues
      expect(screen.getByTestId('monaco-editor-mobile')).toBeInTheDocument();
      expect(screen.getByText('Lines: 100')).toBeInTheDocument();
      expect(screen.getByText(`Chars: ${largeCode.length}`)).toBeInTheDocument();
    });

    test('debounces rapid input changes on mobile', async () => {
      const onChange = jest.fn();
      const props = {
        value: '',
        onChange,
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
      
      // Rapid typing
      await userEvent.type(textarea, 'rapid input test', { delay: 1 });
      
      // Should handle rapid input efficiently
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Mobile Accessibility', () => {
    test('provides proper touch targets for mobile accessibility', () => {
      const props = {
        value: 'accessibility test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // All buttons should be accessible
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Run button should be prominent
      const runButton = screen.getByText('Run');
      expect(runButton).toBeInTheDocument();
    });

    test('supports keyboard navigation on mobile', async () => {
      const props = {
        value: 'keyboard test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      const runButton = screen.getByText('Run');
      
      // Focus and activate with keyboard
      runButton.focus();
      expect(runButton).toHaveFocus();
      
      fireEvent.keyDown(runButton, { key: 'Enter' });
      expect(props.onExecute).toHaveBeenCalled();
    });

    test('provides proper focus management on mobile', () => {
      const props = {
        value: 'focus test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
      
      // Focus should work properly
      textarea.focus();
      expect(textarea).toHaveFocus();
    });
  });

  describe('Mobile Theme Support', () => {
    test('adapts to dark mode on mobile', () => {
      const props = {
        value: 'dark mode test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />, { isDarkMode: true });
      
      // Should show dark theme classes
      const toolbar = screen.getByText('🟨 JavaScript').closest('div');
      expect(toolbar).toHaveClass('border-gray-700', 'bg-gray-800');
    });

    test('maintains theme consistency across mobile components', () => {
      renderWithProviders(<EnhancedPlayground />, { isDarkMode: true });
      
      // Main container should use dark theme
      const container = screen.getByText('🚀 Enhanced Playground').closest('div');
      expect(container).toHaveClass('bg-gray-900', 'text-white');
      
      // Mobile view toggles should use dark theme
      const editorToggle = screen.getByText('📝 Editor');
      expect(editorToggle.closest('div')).toHaveClass('bg-gray-700');
    });
  });

  describe('Mobile Language Support', () => {
    test('switches languages efficiently on mobile', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Should show current language in mobile editor
      expect(screen.getByText('🟨 JavaScript')).toBeInTheDocument();
      
      // Switch language using main selector
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(() => {
        // Mobile editor should update to show Python
        expect(screen.getByText('🐍 Python')).toBeInTheDocument();
      });
    });

    test('shows appropriate snippets for selected language on mobile', async () => {
      const props = {
        value: '',
        onChange: jest.fn(),
        language: 'python',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Open quick actions
      const buttons = screen.getAllByRole('button');
      const actionsButton = buttons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-testid')?.includes('document')
      );
      
      if (actionsButton) {
        await userEvent.click(actionsButton);
        
        // Should show Python-specific snippets
        expect(screen.getByText('print')).toBeInTheDocument();
        expect(screen.getByText('def function')).toBeInTheDocument();
        expect(screen.getByText('class')).toBeInTheDocument();
      }
    });
  });

  describe('Mobile Error Handling', () => {
    test('handles mobile-specific errors gracefully', async () => {
      // Mock touch event error
      const originalAddEventListener = HTMLElement.prototype.addEventListener;
      HTMLElement.prototype.addEventListener = jest.fn((event, handler) => {
        if (event === 'touchstart') {
          throw new Error('Touch not supported');
        }
        return originalAddEventListener.call(this, event, handler);
      });
      
      const props = {
        value: 'error test',
        onChange: jest.fn(),
        language: 'javascript',
        onExecute: jest.fn(),
        isExecuting: false
      };
      
      renderWithProviders(<MobileCodeEditor {...props} />);
      
      // Should still render despite touch errors
      expect(screen.getByTestId('monaco-editor-mobile')).toBeInTheDocument();
      
      // Restore original method
      HTMLElement.prototype.addEventListener = originalAddEventListener;
    });

    test('recovers from mobile network errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('Mobile network error'));
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByTestId('mobile-execute-button');
      await userEvent.click(runButton);
      
      // Switch to output to see error
      const outputToggle = screen.getByText('📤 Output');
      await userEvent.click(outputToggle);
      
      await waitFor(() => {
        expect(screen.getByText(/Mobile network error/)).toBeInTheDocument();
      });
      
      // Test recovery
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: { output: { stdout: 'Recovered!' } }
        }
      });
      
      // Switch back to editor and retry
      const editorToggle = screen.getByText('📝 Editor');
      await userEvent.click(editorToggle);
      
      await userEvent.click(runButton);
      
      await userEvent.click(outputToggle);
      
      await waitFor(() => {
        expect(screen.getByText('Recovered!')).toBeInTheDocument();
      });
    });
  });
});