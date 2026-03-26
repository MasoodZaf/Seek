import React from 'react';
import { Loader2 } from 'lucide-react';
import './OutputPanel.css';

const ERROR_HINTS = [
  {
    pattern: /NullPointerException/i,
    hint: "Looks like a null reference. Check that your variable is initialized before you use it.",
  },
  {
    pattern: /null pointer|segmentation fault|segfault/i,
    hint: "A null/dangling pointer was accessed. Make sure all pointers are initialized and in-bounds.",
  },
  {
    pattern: /undefined is not a function/i,
    hint: "You're calling something that isn't a function. Check the variable name and that it's properly imported.",
  },
  {
    pattern: /cannot read propert(y|ies) of (null|undefined)/i,
    hint: "You're accessing a property on null or undefined. Add a null check before accessing it.",
  },
  {
    pattern: /is not defined/i,
    hint: "Variable not found. Check for typos or make sure it's declared before use.",
  },
  {
    pattern: /SyntaxError/i,
    hint: "Your code has a syntax error. Look for missing brackets, parentheses, or semicolons.",
  },
  {
    pattern: /IndentationError/i,
    hint: "Python is sensitive to indentation. Make sure you're using consistent spaces (not tabs mixed with spaces).",
  },
  {
    pattern: /NameError/i,
    hint: "A name isn't defined. Check for typos or make sure the variable/function is declared before use.",
  },
  {
    pattern: /TypeError/i,
    hint: "Wrong type used in an operation. Check that you're passing the right types to functions.",
  },
  {
    pattern: /IndexError|ArrayIndexOutOfBounds/i,
    hint: "Array index is out of bounds. Remember arrays are 0-indexed — check your loop limits.",
  },
  {
    pattern: /StackOverflow|stack overflow|maximum call stack/i,
    hint: "Infinite recursion detected. Make sure your recursive function has a base case that stops it.",
  },
  {
    pattern: /ClassNotFoundException|class not found/i,
    hint: "Java can't find the class. Make sure your class name matches the public class in the file.",
  },
  {
    pattern: /error: expected|error: missing|undeclared identifier/i,
    hint: "Compilation error. Check for missing semicolons, undeclared variables, or mismatched braces.",
  },
  {
    pattern: /Division by zero|ZeroDivisionError/i,
    hint: "Division by zero. Add a check to ensure the divisor is not zero before dividing.",
  },
  {
    pattern: /timeout|time limit exceeded/i,
    hint: "Your code took too long. Check for infinite loops or very slow algorithms.",
  },
];

function getFriendlyHint(errorText) {
  for (const { pattern, hint } of ERROR_HINTS) {
    if (pattern.test(errorText)) return hint;
  }
  return null;
}

const OutputPanel = ({
  output,
  error,
  isLoading = false,
  height = '150px',
  maxHeight = '300px',
  title = 'Output'
}) => {
  const hasContent = output || error;
  const statusClass = error ? 'error' : 'success';

  return (
    <div className="output-panel" style={{ height, maxHeight }}>
      <div className="output-header">
        <span className="output-title">{title}</span>
        {isLoading && (
          <span className="output-loading">
            <Loader2 className="loading-spinner" />
            Running...
          </span>
        )}
        {hasContent && !isLoading && (
          <span className={`output-status ${statusClass}`}>
            {error ? 'Error' : 'Success'}
          </span>
        )}
      </div>
      <div className="output-content">
        {isLoading ? (
          <div className="output-loading-content">
            <div className="loading-spinner"></div>
            <span>Executing code...</span>
          </div>
        ) : error ? (
          <div className="error-content">
            <pre>{error}</pre>
            {getFriendlyHint(error) && (
              <div className="error-hint">
                <span className="error-hint-icon">💡</span>
                <span>{getFriendlyHint(error)}</span>
              </div>
            )}
          </div>
        ) : output ? (
          <div className="output-text-container">
            <pre className="output-text">{output}</pre>
          </div>
        ) : (
          <div className="empty-output">
            <div>
              <div className="text-secondary-400">▶ Press "Run Code" to execute</div>
              <div className="text-secondary-500 text-sm mt-1">Output will appear here</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
