import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EnhancedPlayground from '../EnhancedPlayground';
import AuthContext from '../../../context/AuthContext';
import ThemeContext from '../../../context/ThemeContext';
import { SUPPORTED_LANGUAGES } from '../languageConfig';

// Mock all the child components
jest.mock('../MonacoCodeEditor', () => {
  return function MockMonacoCodeEditor({ value, onChange, onMount, ...props }) {
    React.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          getValue: () => value,
          setValue: (newValue) => onChange(newValue),
          getAction: (actionId) => ({ run: jest.fn() }),
          getModel: () => ({
            getFullModelRange: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }),
            getValueInRange: () => '',
            getLineContent: () => ''
          }),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getSelection: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }),
          executeEdits: jest.fn(),
          focus: jest.fn(),
          onDidChangeCursorPosition: jest.fn(),
          onDidChangeCursorSelection: jest.fn(),
          getDomNode: () => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
          })
        };
        onMount(mockEditor);
      }
    }, [onMount, value, onChange]);

    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    );
  };
});

jest.mock('../MobileCodeEditor', () => {
  return function MockMobileCodeEditor({ value, onChange, onExecute, isExecuting }) {
    return (
      <div data-testid="mobile-code-editor">
        <textarea
          data-testid="mobile-editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          data-testid="mobile-execute-button"
          onClick={onExecute}
          disabled={isExecuting}
        >
          {isExecuting ? 'Running...' : 'Run'}
        </button>
      </div>
    );
  };
});

jest.mock('../CodeSnippetManager', () => {
  return function MockCodeSnippetManager({ isOpen, onClose, onLoadSnippet }) {
    if (!isOpen) return null;
    return (
      <div data-testid="snippet-manager">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onLoadSnippet({ 
          code: 'function test() { return "loaded"; }', 
          language: 'javascript',
          name: 'Test Snippet'
        })}>
          Load Test Snippet
        </button>
      </div>
    );
  };
});

jest.mock('../CodeSharingModal', () => {
  return function MockCodeSharingModal({ isOpen, onClose, code, language }) {
    if (!isOpen) return null;
    return (
      <div data-testid="sharing-modal">
        <button onClick={onClose}>Close</button>
        <div>Sharing: {language}</div>
        <div>Code length: {code.length}</div>
      </div>
    );
  };
});

jest.mock('../EditorSettingsPanel', () => {
  return function MockEditorSettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
    if (!isOpen) return null;
    return (
      <div data-testid="settings-panel">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSettingsChange({ ...settings, fontSize: 16 })}>
          Change Font Size
        </button>
        <button onClick={() => onSettingsChange({ ...settings, theme: 'seek-dark-professional' })}>
          Change Theme
        </button>
      </div>
    );
  };
});

jest.mock('../../../hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
    isTablet: false,
    isSmallScreen: false
  })
}));

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

describe('Code Playground Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock successful API responses
    axios.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          output: {
            stdout: 'Hello, World!',
            stderr: ''
          },
          executionTime: 150,
          memoryUsage: 1024
        }
      }
    });

    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          executions: [],
          totalExecutions: 10,
          successfulExecutions: 8,
          averageExecutionTime: 200,
          favoriteLanguage: 'javascript'
        }
      }
    });
  });

  describe('Complete Code Execution Workflow', () => {
    test('executes JavaScript code end-to-end', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Write code
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("Integration test!");');
      
      // 2. Execute code
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // 3. Verify API call
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: 'console.log("Integration test!");',
        language: 'javascript',
        input: ''
      }, expect.any(Object));
      
      // 4. Verify output display
      await waitFor(() => {
        expect(screen.getByText(/Hello, World!/)).toBeInTheDocument();
      });
      
      // 5. Verify execution metrics
      await waitFor(() => {
        expect(screen.getByText('150ms')).toBeInTheDocument();
        expect(screen.getByText('1024KB')).toBeInTheDocument();
      });
    });

    test('handles execution errors and recovery', async () => {
      // Mock error response
      axios.post.mockRejectedValueOnce({
        response: { data: { error: 'Syntax error on line 1' } }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Write invalid code
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log(');
      
      // 2. Execute code
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // 3. Verify error display
      await waitFor(() => {
        expect(screen.getByText(/Syntax error on line 1/)).toBeInTheDocument();
      });
      
      // 4. Fix code and retry
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: { stdout: 'Fixed!', stderr: '' }
          }
        }
      });
      
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("Fixed!");');
      await userEvent.click(runButton);
      
      // 5. Verify successful execution
      await waitFor(() => {
        expect(screen.getByText('Fixed!')).toBeInTheDocument();
      });
    });

    test('cancels long-running execution', async () => {
      // Mock long-running execution
      let abortController;
      axios.post.mockImplementation(({ signal }) => {
        abortController = signal;
        return new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject({ name: 'AbortError' });
          });
          setTimeout(() => resolve({
            data: { success: true, data: { output: { stdout: 'Done' } } }
          }), 5000);
        });
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Start execution
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // 2. Verify running state
      expect(screen.getByText('Running...')).toBeInTheDocument();
      expect(screen.getByText('⏳ Executing code...')).toBeInTheDocument();
      
      // 3. Cancel execution
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      // 4. Verify cancellation
      await waitFor(() => {
        expect(screen.getByText('🛑 Execution cancelled')).toBeInTheDocument();
      });
    });
  });

  describe('Multi-Language Support Workflow', () => {
    test('switches between languages and executes code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Test JavaScript
      let editor = screen.getByTestId('monaco-editor');
      expect(editor.value).toContain('console.log');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/api/code/execute', 
          expect.objectContaining({ language: 'javascript' }), 
          expect.any(Object)
        );
      });
      
      // Switch to Python
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(() => {
        editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('print("Hello, World!")');
      });
      
      // Execute Python code
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/api/code/execute', 
          expect.objectContaining({ language: 'python' }), 
          expect.any(Object)
        );
      });
      
      // Switch to Java
      await userEvent.selectOptions(languageSelect, 'java');
      
      await waitFor(() => {
        editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('public class Main');
      });
    });

    test('handles non-executable languages correctly', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Switch to Swift (non-executable)
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'swift');
      
      await waitFor(() => {
        const runButton = screen.getByRole('button', { name: /not executable/i });
        expect(runButton).toBeDisabled();
        expect(screen.getByText('View Only')).toBeInTheDocument();
      });
      
      // Verify output shows non-executable message
      expect(screen.getByText(/Swift execution not yet supported/)).toBeInTheDocument();
    });
  });

  describe('Code Management Workflow', () => {
    test('saves, loads, and manages code snippets', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Write some code
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'function greet() { return "Hello!"; }');
      
      // 2. Open snippet manager
      const snippetButton = screen.getByTitle('Manage Snippets');
      await userEvent.click(snippetButton);
      
      expect(screen.getByTestId('snippet-manager')).toBeInTheDocument();
      
      // 3. Load a test snippet
      const loadSnippetButton = screen.getByText('Load Test Snippet');
      await userEvent.click(loadSnippetButton);
      
      // 4. Verify snippet was loaded
      await waitFor(() => {
        expect(editor.value).toBe('function test() { return "loaded"; }');
      });
      
      // 5. Verify snippet manager closed
      expect(screen.queryByTestId('snippet-manager')).not.toBeInTheDocument();
    });

    test('copies and downloads code', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      // Mock download functionality
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      const mockClick = jest.fn();
      jest.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        download: '',
        click: mockClick
      });
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'const message = "test code";');
      
      // Test copy functionality
      const copyButton = screen.getByTitle('Copy Code');
      await userEvent.click(copyButton);
      
      expect(mockWriteText).toHaveBeenCalledWith('const message = "test code";');
      
      // Test download functionality
      const downloadButton = screen.getByTitle('Download Code');
      await userEvent.click(downloadButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Code Sharing Workflow', () => {
    test('opens sharing modal and generates share content', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Write code to share
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("Share this code!");');
      
      // 2. Open sharing modal
      const shareButton = screen.getByTitle('Share Code');
      await userEvent.click(shareButton);
      
      // 3. Verify modal opened with correct content
      expect(screen.getByTestId('sharing-modal')).toBeInTheDocument();
      expect(screen.getByText('Sharing: javascript')).toBeInTheDocument();
      expect(screen.getByText('Code length: 30')).toBeInTheDocument();
      
      // 4. Close modal
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('sharing-modal')).not.toBeInTheDocument();
    });
  });

  describe('Settings and Customization Workflow', () => {
    test('changes editor settings and persists them', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Open settings panel
      const settingsButton = screen.getByTitle('Settings');
      await userEvent.click(settingsButton);
      
      expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
      
      // 2. Change font size
      const changeFontButton = screen.getByText('Change Font Size');
      await userEvent.click(changeFontButton);
      
      // 3. Verify settings persisted to localStorage
      await waitFor(() => {
        const savedSettings = localStorage.getItem('playground_editor_settings');
        expect(savedSettings).toBeTruthy();
        const parsed = JSON.parse(savedSettings);
        expect(parsed.fontSize).toBe(16);
      });
      
      // 4. Change theme
      const changeThemeButton = screen.getByText('Change Theme');
      await userEvent.click(changeThemeButton);
      
      await waitFor(() => {
        const savedSettings = localStorage.getItem('playground_editor_settings');
        const parsed = JSON.parse(savedSettings);
        expect(parsed.theme).toBe('seek-dark-professional');
      });
      
      // 5. Close settings
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
    });

    test('toggles fullscreen mode', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Enter fullscreen
      const fullscreenButton = screen.getByTitle('Enter Fullscreen');
      await userEvent.click(fullscreenButton);
      
      // 2. Verify fullscreen state
      expect(screen.getByTitle('Exit Fullscreen')).toBeInTheDocument();
      
      // 3. Exit fullscreen
      const exitFullscreenButton = screen.getByTitle('Exit Fullscreen');
      await userEvent.click(exitFullscreenButton);
      
      expect(screen.getByTitle('Enter Fullscreen')).toBeInTheDocument();
    });
  });

  describe('Statistics and Analytics Workflow', () => {
    test('displays and updates execution statistics', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Open statistics panel
      const statsButton = screen.getByTitle('Execution Stats');
      await userEvent.click(statsButton);
      
      // 2. Verify statistics display
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // Total runs
        expect(screen.getByText('8')).toBeInTheDocument(); // Successful
        expect(screen.getByText('200ms')).toBeInTheDocument(); // Avg time
        expect(screen.getByText('javascript')).toBeInTheDocument(); // Top language
      });
      
      // 3. Execute code to update stats
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // 4. Verify stats API calls were made
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/api/code/history', expect.any(Object));
        expect(axios.get).toHaveBeenCalledWith('/api/code/stats');
      });
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('recovers from network errors', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Simulate network error
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // 2. Verify error display
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
      
      // 3. Simulate network recovery
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: { stdout: 'Network recovered!', stderr: '' }
          }
        }
      });
      
      // 4. Retry execution
      await userEvent.click(runButton);
      
      // 5. Verify successful recovery
      await waitFor(() => {
        expect(screen.getByText('Network recovered!')).toBeInTheDocument();
      });
    });

    test('handles localStorage failures gracefully', async () => {
      // Mock localStorage failure
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage full');
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      // Should still function without localStorage
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.type(editor, 'test code');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // Should execute successfully despite localStorage error
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
      
      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Performance and Responsiveness', () => {
    test('handles rapid user interactions', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      const runButton = screen.getByRole('button', { name: /run code/i });
      
      // Rapid interactions
      await userEvent.type(editor, 'console.log("test1");');
      await userEvent.click(runButton);
      
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("test2");');
      await userEvent.click(runButton);
      
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("test3");');
      await userEvent.click(runButton);
      
      // Should handle rapid interactions without issues
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(3);
      });
    });

    test('handles large code efficiently', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Generate large code
      const largeCode = 'console.log("line");\n'.repeat(1000);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, largeCode.substring(0, 100)); // Type subset for performance
      
      // Should handle large code without performance issues
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility Integration', () => {
    test('supports complete keyboard navigation workflow', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // 1. Navigate to language selector
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      languageSelect.focus();
      expect(languageSelect).toHaveFocus();
      
      // 2. Change language with keyboard
      fireEvent.keyDown(languageSelect, { key: 'ArrowDown' });
      fireEvent.change(languageSelect, { target: { value: 'python' } });
      
      // 3. Navigate to editor (simulated)
      const editor = screen.getByTestId('monaco-editor');
      editor.focus();
      expect(editor).toHaveFocus();
      
      // 4. Navigate to run button
      const runButton = screen.getByRole('button', { name: /run code/i });
      runButton.focus();
      expect(runButton).toHaveFocus();
      
      // 5. Execute with keyboard
      fireEvent.keyDown(runButton, { key: 'Enter' });
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });

    test('provides proper screen reader support', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Verify ARIA labels and roles
      const runButton = screen.getByRole('button', { name: /run code/i });
      expect(runButton).toBeInTheDocument();
      
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toBeInTheDocument();
      
      // Verify status indicators
      const executableBadge = screen.getByText('Executable');
      expect(executableBadge).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    test('switches between light and dark themes', async () => {
      const { rerender } = renderWithProviders(<EnhancedPlayground />);
      
      // Verify light theme
      const lightContainer = screen.getByText('🚀 Enhanced Playground').closest('div');
      expect(lightContainer).toHaveClass('bg-gray-50', 'text-gray-900');
      
      // Switch to dark theme
      rerender(
        <AuthContext.Provider value={mockAuthContext}>
          <ThemeContext.Provider value={{ ...mockThemeContext, isDarkMode: true }}>
            <EnhancedPlayground />
          </ThemeContext.Provider>
        </AuthContext.Provider>
      );
      
      // Verify dark theme
      const darkContainer = screen.getByText('🚀 Enhanced Playground').closest('div');
      expect(darkContainer).toHaveClass('bg-gray-900', 'text-white');
    });
  });
});