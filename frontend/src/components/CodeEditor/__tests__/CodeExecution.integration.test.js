import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EnhancedPlayground from '../EnhancedPlayground';
import AuthContext from '../../../context/AuthContext';
import ThemeContext from '../../../context/ThemeContext';
import { SUPPORTED_LANGUAGES, getExecutableLanguages } from '../languageConfig';

// Mock components
jest.mock('../MonacoCodeEditor', () => {
  return function MockMonacoCodeEditor({ value, onChange, onMount }) {
    React.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          getValue: () => value,
          setValue: (newValue) => onChange(newValue),
          getAction: () => ({ run: jest.fn() }),
          getModel: () => ({
            getFullModelRange: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 })
          }),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getSelection: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }),
          executeEdits: jest.fn(),
          focus: jest.fn(),
          onDidChangeCursorPosition: jest.fn(),
          onDidChangeCursorSelection: jest.fn(),
          getDomNode: () => ({ addEventListener: jest.fn(), removeEventListener: jest.fn() })
        };
        onMount(mockEditor);
      }
    }, [onMount, value, onChange]);

    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

jest.mock('../MobileCodeEditor', () => {
  return function MockMobileCodeEditor({ value, onChange }) {
    return (
      <textarea
        data-testid="mobile-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

// Mock other components as simple divs
jest.mock('../CodeSnippetManager', () => () => null);
jest.mock('../CodeSharingModal', () => () => null);
jest.mock('../EditorSettingsPanel', () => () => null);

jest.mock('../../../hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({ isMobile: false, isTablet: false, isSmallScreen: false })
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

const renderWithProviders = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <ThemeContext.Provider value={mockThemeContext}>
        {component}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

describe('Code Execution Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Default successful response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          output: {
            stdout: 'Execution successful',
            stderr: ''
          },
          executionTime: 100,
          memoryUsage: 512
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

  describe('JavaScript Execution', () => {
    test('executes basic JavaScript code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log("Hello JavaScript!");');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: 'console.log("Hello JavaScript!");',
        language: 'javascript',
        input: ''
      }, expect.any(Object));
      
      await waitFor(() => {
        expect(screen.getByText('Execution successful')).toBeInTheDocument();
      });
    });

    test('executes JavaScript with complex logic', async () => {
      const complexCode = `
        function fibonacci(n) {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
        console.log(fibonacci(10));
      `;
      
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, complexCode);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: complexCode,
        language: 'javascript',
        input: ''
      }, expect.any(Object));
    });

    test('handles JavaScript runtime errors', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: {
              stdout: '',
              stderr: 'ReferenceError: undefinedVariable is not defined'
            }
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const editor = screen.getByTestId('monaco-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'console.log(undefinedVariable);');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/ReferenceError: undefinedVariable is not defined/)).toBeInTheDocument();
      });
    });
  });

  describe('Python Execution', () => {
    test('executes basic Python code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      // Switch to Python
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('print("Hello, World!")');
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.stringContaining('print("Hello, World!")'),
        language: 'python',
        input: ''
      }, expect.any(Object));
    });

    test('executes Python with imports and functions', async () => {
      const pythonCode = `
import math

def calculate_area(radius):
    return math.pi * radius ** 2

print(f"Area of circle with radius 5: {calculate_area(5)}")
      `;
      
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(async () => {
        const editor = screen.getByTestId('monaco-editor');
        await userEvent.clear(editor);
        await userEvent.type(editor, pythonCode);
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: pythonCode,
        language: 'python',
        input: ''
      }, expect.any(Object));
    });

    test('handles Python syntax errors', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: false,
          error: 'SyntaxError: invalid syntax (line 1)'
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'python');
      
      await waitFor(async () => {
        const editor = screen.getByTestId('monaco-editor');
        await userEvent.clear(editor);
        await userEvent.type(editor, 'print("missing quote');
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/SyntaxError: invalid syntax/)).toBeInTheDocument();
      });
    });
  });

  describe('Java Execution', () => {
    test('executes basic Java code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'java');
      
      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('public class Main');
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.stringContaining('public class Main'),
        language: 'java',
        input: ''
      }, expect.any(Object));
    });

    test('handles Java compilation errors', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: false,
          error: 'Main.java:1: error: \';\' expected'
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'java');
      
      await waitFor(async () => {
        const editor = screen.getByTestId('monaco-editor');
        await userEvent.clear(editor);
        await userEvent.type(editor, 'public class Main { public static void main(String[] args) { System.out.println("Hello") } }');
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error: ';' expected/)).toBeInTheDocument();
      });
    });
  });

  describe('C++ Execution', () => {
    test('executes basic C++ code', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'cpp');
      
      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('#include <iostream>');
      });
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.stringContaining('#include <iostream>'),
        language: 'cpp',
        input: ''
      }, expect.any(Object));
    });
  });

  describe('All Executable Languages', () => {
    test('can execute code in all supported executable languages', async () => {
      const executableLanguages = getExecutableLanguages();
      
      for (const language of executableLanguages) {
        renderWithProviders(<EnhancedPlayground />);
        
        const languageSelect = screen.getByDisplayValue(/JavaScript|Python|Java|C\+\+|C|Go|Rust|C#|PHP|Ruby|Kotlin|Scala|R|Julia|Perl|Dart|Elixir|Haskell|Lua/);
        await userEvent.selectOptions(languageSelect, language.id);
        
        await waitFor(() => {
          const editor = screen.getByTestId('monaco-editor');
          expect(editor.value).toContain(language.defaultTemplate.split('\n')[0]);
        });
        
        const runButton = screen.getByRole('button', { name: /run code/i });
        await userEvent.click(runButton);
        
        expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
          code: expect.any(String),
          language: language.id,
          input: ''
        }, expect.any(Object));
        
        // Clear mocks for next iteration
        jest.clearAllMocks();
        axios.post.mockResolvedValue({
          data: {
            success: true,
            data: {
              output: { stdout: 'Success', stderr: '' }
            }
          }
        });
      }
    });

    test('shows correct execution status for all languages', async () => {
      renderWithProviders(<EnhancedPlayground />);
      
      for (const language of SUPPORTED_LANGUAGES) {
        const languageSelect = screen.getByRole('combobox');
        await userEvent.selectOptions(languageSelect, language.id);
        
        await waitFor(() => {
          if (language.executionSupported) {
            expect(screen.getByText('Executable')).toBeInTheDocument();
            expect(screen.getByText('Executable')).toHaveClass('bg-green-100', 'text-green-800');
          } else {
            expect(screen.getByText('View Only')).toBeInTheDocument();
            expect(screen.getByText('View Only')).toHaveClass('bg-yellow-100', 'text-yellow-800');
          }
        });
      }
    });
  });

  describe('Execution Performance Metrics', () => {
    test('displays execution time and memory usage', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: {
              stdout: 'Performance test',
              stderr: ''
            },
            executionTime: 250,
            memoryUsage: 2048
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('250ms')).toBeInTheDocument();
        expect(screen.getByText('2048KB')).toBeInTheDocument();
      });
    });

    test('handles missing performance metrics gracefully', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: {
              stdout: 'No metrics',
              stderr: ''
            }
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('No metrics')).toBeInTheDocument();
        // Should not crash when metrics are missing
      });
    });
  });

  describe('Execution Error Handling', () => {
    test('handles network timeouts', async () => {
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

    test('handles server errors', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: 'Internal server error' }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
      });
    });

    test('handles malformed responses', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: false,
          // Missing error field
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Execution failed/)).toBeInTheDocument();
      });
    });
  });

  describe('Execution Cancellation', () => {
    test('cancels execution using AbortController', async () => {
      let abortController;
      axios.post.mockImplementation(({ signal }) => {
        abortController = signal;
        return new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject({ name: 'AbortError' });
          });
          setTimeout(() => resolve({
            data: { success: true, data: { output: { stdout: 'Done' } } }
          }), 1000);
        });
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      // Verify execution started
      expect(screen.getByText('Running...')).toBeInTheDocument();
      
      // Cancel execution
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);
      
      await waitFor(() => {
        expect(screen.getByText('🛑 Execution cancelled')).toBeInTheDocument();
      });
    });

    test('prevents multiple simultaneous executions', async () => {
      // Mock long-running execution
      axios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          data: { success: true, data: { output: { stdout: 'Done' } } }
        }), 1000))
      );
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      
      // Start first execution
      await userEvent.click(runButton);
      expect(screen.getByText('Running...')).toBeInTheDocument();
      
      // Try to start second execution
      await userEvent.click(runButton);
      
      // Should only have one API call
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('Code Validation', () => {
    test('validates code syntax before execution', async () => {
      axios.post.mockImplementation((url) => {
        if (url === '/api/code/validate') {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                valid: true,
                errors: []
              }
            }
          });
        }
        return Promise.resolve({
          data: {
            success: true,
            data: { output: { stdout: 'Valid code executed' } }
          }
        });
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const validateButton = screen.getByText('Validate');
      await userEvent.click(validateButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/validate', {
        code: expect.any(String),
        language: 'javascript'
      });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Code syntax is valid')).toBeInTheDocument();
      });
    });

    test('shows validation errors', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            valid: false,
            errors: ['Syntax error on line 1', 'Missing semicolon']
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const validateButton = screen.getByText('Validate');
      await userEvent.click(validateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Syntax error on line 1/)).toBeInTheDocument();
        expect(screen.getByText(/Missing semicolon/)).toBeInTheDocument();
      });
    });
  });

  describe('Output Formatting', () => {
    test('formats output with different sections', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: {
              stdout: 'Hello World!',
              stderr: 'Warning: deprecated function'
            },
            executionTime: 150,
            memoryUsage: 1024
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText(/📤 Output:/)).toBeInTheDocument();
        expect(screen.getByText('Hello World!')).toBeInTheDocument();
        expect(screen.getByText(/⚠️ Errors\/Warnings:/)).toBeInTheDocument();
        expect(screen.getByText('Warning: deprecated function')).toBeInTheDocument();
        expect(screen.getByText(/📊 Execution Info:/)).toBeInTheDocument();
        expect(screen.getByText(/⏱️ Time: 150ms/)).toBeInTheDocument();
        expect(screen.getByText(/💾 Memory: 1024KB/)).toBeInTheDocument();
      });
    });

    test('handles empty output gracefully', async () => {
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            output: {
              stdout: '',
              stderr: ''
            }
          }
        }
      });
      
      renderWithProviders(<EnhancedPlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('✅ Code executed successfully (no output)')).toBeInTheDocument();
      });
    });
  });

  describe('Language-Specific Execution Features', () => {
    test('handles compiled languages differently from interpreted', async () => {
      // Test compiled language (Java)
      renderWithProviders(<EnhancedPlayground />);
      
      const languageSelect = screen.getByDisplayValue(/JavaScript/);
      await userEvent.selectOptions(languageSelect, 'java');
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.stringContaining('public class Main'),
        language: 'java',
        input: ''
      }, expect.any(Object));
      
      // Test interpreted language (Python)
      await userEvent.selectOptions(languageSelect, 'python');
      await userEvent.click(runButton);
      
      expect(axios.post).toHaveBeenCalledWith('/api/code/execute', {
        code: expect.any(String),
        language: 'python',
        input: ''
      }, expect.any(Object));
    });

    test('shows appropriate error messages for different languages', async () => {
      const languageErrors = {
        javascript: 'ReferenceError: variable is not defined',
        python: 'NameError: name \'variable\' is not defined',
        java: 'error: cannot find symbol',
        cpp: 'error: \'variable\' was not declared in this scope'
      };
      
      for (const [lang, error] of Object.entries(languageErrors)) {
        axios.post.mockResolvedValueOnce({
          data: {
            success: false,
            error: error
          }
        });
        
        renderWithProviders(<EnhancedPlayground />);
        
        const languageSelect = screen.getByRole('combobox');
        await userEvent.selectOptions(languageSelect, lang);
        
        const runButton = screen.getByRole('button', { name: /run code/i });
        await userEvent.click(runButton);
        
        await waitFor(() => {
          expect(screen.getByText(new RegExp(error.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
        });
        
        // Clear for next iteration
        jest.clearAllMocks();
      }
    });
  });
});