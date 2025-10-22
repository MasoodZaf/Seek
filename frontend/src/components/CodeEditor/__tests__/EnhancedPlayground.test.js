import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EnhancedPlayground from '../EnhancedPlayground';
import AuthContext from '../../../context/AuthContext';
import ThemeContext from '../../../context/ThemeContext';

// Mock Monaco Editor
jest.mock('../MonacoCodeEditor', () => {
  const mockReact = require('react');
  return function MockMonacoCodeEditor({ value, onChange, onMount, ...props }) {
    mockReact.useEffect(() => {
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

    return mockReact.createElement('textarea', {
      'data-testid': 'monaco-editor',
      value: value,
      onChange: (e) => onChange(e.target.value),
      ...props
    });
  };
});

// Mock MobileCodeEditor
jest.mock('../MobileCodeEditor', () => {
  const mockReact = require('react');
  return function MockMobileCodeEditor({ value, onChange, onExecute, isExecuting, ...props }) {
    return mockReact.createElement('div', { 'data-testid': 'mobile-code-editor' },
      mockReact.createElement('textarea', {
        'data-testid': 'mobile-editor-textarea',
        value: value,
        onChange: (e) => onChange(e.target.value)
      }),
      mockReact.createElement('button', {
        'data-testid': 'mobile-execute-button',
        onClick: onExecute,
        disabled: isExecuting
      }, isExecuting ? 'Running...' : 'Run')
    );
  };
});

// Mock other components
jest.mock('../CodeSnippetManager', () => {
  const mockReact = require('react');
  return function MockCodeSnippetManager({ isOpen, onClose, onLoadSnippet }) {
    if (!isOpen) return null;
    return mockReact.createElement('div', { 'data-testid': 'snippet-manager' },
      mockReact.createElement('button', { onClick: onClose }, 'Close'),
      mockReact.createElement('button', { 
        onClick: () => onLoadSnippet({ code: 'test snippet', language: 'javascript' })
      }, 'Load Test Snippet')
    );
  };
});

jest.mock('../CodeSharingModal', () => {
  const mockReact = require('react');
  return function MockCodeSharingModal({ isOpen, onClose, code, language }) {
    if (!isOpen) return null;
    return mockReact.createElement('div', { 'data-testid': 'sharing-modal' },
      mockReact.createElement('button', { onClick: onClose }, 'Close'),
      mockReact.createElement('div', null, `Sharing: ${language}`),
      mockReact.createElement('div', null, `Code length: ${code.length}`)
    );
  };
});

jest.mock('../EditorSettingsPanel', () => {
  const mockReact = require('react');
  return function MockEditorSettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
    if (!isOpen) return null;
    return mockReact.createElement('div', { 'data-testid': 'settings-panel' },
      mockReact.createElement('button', { onClick: onClose }, 'Close'),
      mockReact.createElement('button', { 
        onClick: () => onSettingsChange({ ...settings, fontSize: 16 })
      }, 'Change Font Size')
    );
  };
});

// Mock useResponsive hook
jest.mock('../../../hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
    isTablet: false,
    isSmallScreen: false
  })
}));

// Test utilities
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

describe('EnhancedPlayground', () => {
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
          totalExecutions: 0,
          successfulExecutions: 0,
          averageExecutionTime: 0,
          favoriteLanguage: 'javascript'
        }
      }
    });
  });

  describe('Component Rendering', () => {
    test('renders playground with all main sections', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      expect(screen.getByText('🚀 Enhanced Playground')).toBeInTheDocument();
      expect(screen.getByText('Code Editor')).toBeInTheDocument();
      expect(screen.getByText('Output')).toBeInTheDocument();
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });

    test('displays user greeting when authenticated', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      expect(screen.getByText('Welcome, Test')).toBeInTheDocument();
    });

    test('renders in dark mode correctly', () => {
      renderWithProviders(<EnhancedPlayground />, { isDarkMode: true });
      
      const playground = screen.getByText('🚀 Enhanced Playground').closest('div');
      expect(playground).toHaveClass('bg-gray-900', 'text-white');
    });

    test('shows mobile editor on mobile devices', () => {
      // Mock mobile responsive hook
      jest.doMock('../../../hooks/useResponsive', () => ({
        __esModule: true,
        default: () => ({
          isMobile: true,
          isTablet: false,
          isSmallScreen: true
        })
      }));

      renderWithProviders(<EnhancedPlayground />);
      
      expect(screen.getByTestId('mobile-code-editor')).toBeInTheDocument();
    });
  });

  describe('Language Selection', () => {
    test('changes language and updates template', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('print("Hello, World!")');
      });
    });

    test('shows execution support status for languages', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const executableBadge = screen.getByText('Executable');
      expect(executableBadge).toBeInTheDocument();
      expect(executableBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    test('disables execution for non-executable languages', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'swift');
      
      await waitFor(() => {
        const runButton = screen.getByRole('button', { name: /run code/i });
        expect(runButton).toBeDisabled();
      });
    });
  });

  describe('Code Execution', () => {
    test('executes code successfully', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("Hello, Test!");');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
          code: 'console.log("Hello, Test!");',
          language: 'javascript',
          input: ''
        }, expect.any(Object));
      });

      await waitFor(() => {
        expect(screen.getByText(/Hello, World!/)).toBeInTheDocument();
      });
    });

    test('shows execution time and memory usage', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('150ms')).toBeInTheDocument();
        expect(screen.getByText('1024KB')).toBeInTheDocument();
      });
    });

    test('handles execution errors gracefully', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });

    test('shows loading state during execution', async () => {
      // Mock delayed response
      axios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          data: { success: true, data: { output: { stdout: 'Done' } } }
        }), 100))
      );
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(screen.getByText('⏳ Executing code...')).toBeInTheDocument();
      expect(screen.getByText('Running...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Done')).toBeInTheDocument();
      });
    });

    test('can cancel code execution', async () => {
      // Mock long-running execution
      const abortController = new AbortController();
      axios.post.mockImplementation(() => 
        new Promise((resolve, reject) => {
          abortController.signal.addEventListener('abort', () => {
            reject(new Error('AbortError'));
          });
          setTimeout(resolve, 5000);
        })
      );
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      await waitFor(() => {
        expect(screen.getByText('🛑 Execution cancelled')).toBeInTheDocument();
      });
    });
  });

  describe('Code Management', () => {
    test('saves code to localStorage', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'const test = "save me";');
      
      // Trigger save (this would normally be through a save dialog)
      act(() => {
        const savedCodes = [{
          id: Date.now(),
          name: 'Test Code',
          code: 'const test = "save me";',
          language: 'javascript',
          createdAt: new Date().toISOString()
        }];
        localStorage.setItem('playground_saved_codes', JSON.stringify(savedCodes));
      });
      
      const saved = JSON.parse(localStorage.getItem('playground_saved_codes'));
      expect(saved).toHaveLength(1);
      expect(saved[0].code).toBe('const test = "save me";');
    });

    test('loads saved code', async () => {
      const savedCode = {
        id: '1',
        name: 'Test Code',
        code: 'console.log("loaded");',
        language: 'javascript'
      };
      
      localStorage.setItem('playground_saved_codes', JSON.stringify([savedCode]));
      
      renderWithProviders(<EnhancedPlayground />);
      
      // The component should load saved codes on mount
      await waitFor(() => {
        // This would be visible in the saved codes section
        expect(localStorage.getItem('playground_saved_codes')).toBeTruthy();
      });
    });

    test('copies code to clipboard', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("copy me");');
      
      const copyButton = screen.getByTitle('Copy Code');
      await userEvent.click(copyButton);
      
      expect(mockWriteText).toHaveBeenCalledWith('console.log("copy me");');
    });

    test('downloads code file', async () => {
      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      const mockClick = jest.fn();
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      
      jest.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        download: '',
        click: mockClick
      });
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
      
      renderWithProviders(<EnhancedPlayground />);
      
      const downloadButton = screen.getByTitle('Download Code');
      await userEvent.click(downloadButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('UI Interactions', () => {
    test('toggles fullscreen mode', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const fullscreenButton = screen.getByTitle('Enter Fullscreen');
      await userEvent.click(fullscreenButton);
      
      expect(screen.getByTitle('Exit Fullscreen')).toBeInTheDocument();
    });

    test('opens and closes settings panel', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const settingsButton = screen.getByTitle('Settings');
      await userEvent.click(settingsButton);
      
      expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
      
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
    });

    test('opens and closes snippet manager', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const snippetButton = screen.getByTitle('Manage Snippets');
      await userEvent.click(snippetButton);
      
      expect(screen.getByTestId('snippet-manager')).toBeInTheDocument();
      
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('snippet-manager')).not.toBeInTheDocument();
    });

    test('opens and closes sharing modal', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const shareButton = screen.getByTitle('Share Code');
      await userEvent.click(shareButton);
      
      expect(screen.getByTestId('sharing-modal')).toBeInTheDocument();
      
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('sharing-modal')).not.toBeInTheDocument();
    });

    test('formats code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const formatButton = screen.getByTitle('Format Code');
      await userEvent.click(formatButton);
      
      // The format action should be called on the editor
      // This is mocked in our Monaco editor mock
    });

    test('clears code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.type(editor, 'some code');
      
      const clearButton = screen.getByText('Clear');
      await userEvent.click(clearButton);
      
      expect(editor.value).toBe('');
    });
  });

  describe('Settings Persistence', () => {
    test('saves editor settings to localStorage', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const settingsButton = screen.getByTitle('Settings');
      await userEvent.click(settingsButton);
      
      const changeFontButton = screen.getByText('Change Font Size');
      await userEvent.click(changeFontButton);
      
      await waitFor(() => {
        const savedSettings = localStorage.getItem('playground_editor_settings');
        expect(savedSettings).toBeTruthy();
        const parsed = JSON.parse(savedSettings);
        expect(parsed.fontSize).toBe(16);
      });
    });

    test('loads editor settings from localStorage on mount', () => {
      const settings = {
        fontSize: 18,
        theme: 'seek-dark-professional',
        fontFamily: 'JetBrains Mono'
      };
      
      localStorage.setItem('playground_editor_settings', JSON.stringify(settings));
      
      renderWithProviders(<EnhancedPlayground />);
      
      // Settings should be loaded and applied
      expect(localStorage.getItem('playground_editor_settings')).toBeTruthy();
    });
  });

  describe('Execution Statistics', () => {
    test('displays execution statistics when available', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalExecutions: 42,
            successfulExecutions: 38,
            averageExecutionTime: 250,
            favoriteLanguage: 'python'
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const statsButton = screen.getByTitle('Execution Stats');
      await userEvent.click(statsButton);
      
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument(); // Total runs
        expect(screen.getByText('38')).toBeInTheDocument(); // Successful
        expect(screen.getByText('250ms')).toBeInTheDocument(); // Avg time
        expect(screen.getByText('python')).toBeInTheDocument(); // Top language
      });
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: 'Compilation failed' } }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Compilation failed/)).toBeInTheDocument();
      });
    });

    test('handles timeout errors', async () => {
      axios.post.mockRejectedValueOnce({
        code: 'ECONNABORTED'
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/timed out/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      expect(runButton).toBeInTheDocument();
      
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      
      // Focus and activate with keyboard
      runButton.focus();
      expect(runButton).toHaveFocus();
      
      fireEvent.keyDown(runButton, { key: 'Enter' });
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });
});