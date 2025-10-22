import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../../context/ThemeContext';
import MobileCodeEditor from '../../CodeEditor/MobileCodeEditor';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock Monaco Editor
jest.mock('../../CodeEditor/MonacoCodeEditor', () => {
  return function MockMonacoEditor({ onMount, onChange, value }) {
    React.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          onDidChangeCursorPosition: jest.fn(),
          onDidChangeCursorSelection: jest.fn(),
          onDidChangeModelContent: jest.fn(),
          getDomNode: () => document.createElement('div'),
          addCommand: jest.fn(),
          getAction: jest.fn(() => ({ run: jest.fn() })),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getModel: () => ({
            getValueInRange: () => '',
            getLineContent: () => '',
            getFullModelRange: () => ({})
          }),
          executeEdits: jest.fn(),
          focus: jest.fn(),
          getSelection: () => null
        };
        onMount(mockEditor, {});
      }
    }, [onMount]);

    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  };
});

// Mock touch interactions
jest.mock('../../../utils/touchInteractions', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    selection: jest.fn()
  },
  useGestures: jest.fn()
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('MobileCodeEditor', () => {
  const defaultProps = {
    value: 'console.log("Hello World");',
    onChange: jest.fn(),
    language: 'javascript',
    onExecute: jest.fn(),
    isExecuting: false,
    theme: 'vs-dark'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mobile code editor with basic elements', () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByText('Run Code')).toBeInTheDocument();
  });

  test('displays cursor position and font size', () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    expect(screen.getByText('1:1')).toBeInTheDocument();
    expect(screen.getByText('14px')).toBeInTheDocument();
  });

  test('toggles settings panel', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Font Size')).toBeInTheDocument();
      expect(screen.getByText('Line Numbers')).toBeInTheDocument();
      expect(screen.getByText('Word Wrap')).toBeInTheDocument();
    });
  });

  test('adjusts font size', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    // Open settings
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      const plusButton = screen.getByRole('button', { name: /plus/i });
      fireEvent.click(plusButton);
      
      expect(screen.getByText('15px')).toBeInTheDocument();
    });
  });

  test('toggles keyboard helper', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const keyboardButton = screen.getByRole('button', { name: /keyboard/i });
    fireEvent.click(keyboardButton);
    
    await waitFor(() => {
      expect(screen.getByText('()')).toBeInTheDocument();
      expect(screen.getByText('{}')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  test('toggles quick actions panel', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const quickActionsButton = screen.getByRole('button', { name: /document/i });
    fireEvent.click(quickActionsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Code Actions')).toBeInTheDocument();
      expect(screen.getByText('Format Code')).toBeInTheDocument();
      expect(screen.getByText('Toggle Comment')).toBeInTheDocument();
      expect(screen.getByText('Code Snippets')).toBeInTheDocument();
    });
  });

  test('toggles find/replace panel', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const findButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Find...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Replace...')).toBeInTheDocument();
    });
  });

  test('toggles fullscreen mode', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
    fireEvent.click(fullscreenButton);
    
    // Check if the component has fullscreen classes
    const container = screen.getByTestId('monaco-editor').closest('.fixed');
    expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  test('executes code when run button is clicked', () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);
    
    expect(defaultProps.onExecute).toHaveBeenCalled();
  });

  test('disables run button when executing', () => {
    renderWithTheme(
      <MobileCodeEditor {...defaultProps} isExecuting={true} />
    );
    
    const runButton = screen.getByText('Running...');
    expect(runButton).toBeDisabled();
  });

  test('shows read-only indicator when readOnly is true', () => {
    renderWithTheme(
      <MobileCodeEditor {...defaultProps} readOnly={true} />
    );
    
    expect(screen.getByText('Read Only')).toBeInTheDocument();
  });

  test('displays code statistics', () => {
    const multiLineCode = 'console.log("Hello");\nconsole.log("World");';
    renderWithTheme(
      <MobileCodeEditor {...defaultProps} value={multiLineCode} />
    );
    
    expect(screen.getByText('2 lines')).toBeInTheDocument();
    expect(screen.getByText(/\d+ chars/)).toBeInTheDocument();
  });

  test('calls onSave when save button is clicked', () => {
    const onSave = jest.fn();
    renderWithTheme(
      <MobileCodeEditor {...defaultProps} onSave={onSave} />
    );
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(defaultProps.value);
  });

  test('shows gesture hints when not in fullscreen', () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    expect(screen.getByText(/Double tap for fullscreen/)).toBeInTheDocument();
  });

  test('handles language-specific snippets', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} language="python" />);
    
    const quickActionsButton = screen.getByRole('button', { name: /document/i });
    fireEvent.click(quickActionsButton);
    
    await waitFor(() => {
      expect(screen.getByText('print')).toBeInTheDocument();
      expect(screen.getByText('def function')).toBeInTheDocument();
    });
  });

  test('updates editor options based on settings', async () => {
    renderWithTheme(<MobileCodeEditor {...defaultProps} />);
    
    // Open settings and toggle line numbers
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      const lineNumbersButton = screen.getByText('Line Numbers');
      fireEvent.click(lineNumbersButton);
      
      // The editor should re-render with updated options
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });
  });
});