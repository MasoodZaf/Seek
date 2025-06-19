import React, { useState, useCallback } from 'react';
import CodeEditor from '../components/editor/CodeEditor/CodeEditor';
import OutputPanel from '../components/editor/OutputPanel/OutputPanel';
import './Playground.css';

const DEFAULT_CODE = `// Welcome to Seek!
console.log("Hello, World!");`;

const Playground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState('javascript');

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    // Clear previous outputs when code changes
    setError('');
    setOutput('');
  }, []);

  const handleLanguageChange = useCallback((event) => {
    setEditorLanguage(event.target.value);
    setCode(''); // Clear code when language changes
    setError('');
    setOutput('');
  }, []);

  const executeCode = useCallback(async () => {
    setIsExecuting(true);
    setError('');
    setOutput('');

    try {
      // Temporary implementation until backend is ready
      setTimeout(() => {
        try {
          // For JavaScript, we can use Function to evaluate the code
          if (editorLanguage === 'javascript') {
            const originalConsoleLog = console.log;
            let output = '';
            
            // Override console.log to capture output
            console.log = (...args) => {
              output += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ') + '\n';
            };

            // Execute the code
            new Function(code)();

            // Restore console.log
            console.log = originalConsoleLog;
            
            setOutput(output);
          } else {
            setOutput(`Language '${editorLanguage}' execution is not yet implemented.\nBackend integration pending.`);
          }
        } catch (execError) {
          setError(execError.toString());
        }
        setIsExecuting(false);
      }, 500); // Add a small delay to show loading state
    } catch (err) {
      setError(err.message);
      setIsExecuting(false);
    }
  }, [code, editorLanguage]);

  const handleEditorValidation = useCallback((errors) => {
    // Handle editor validation errors
    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => `Line ${err.line}: ${err.message}`)
        .join('\n');
      setError(errorMessages);
    } else {
      setError('');
    }
  }, []);

  return (
    <div className="playground">
      <div className="playground-header">
        <h1>Code Playground</h1>
        <div className="playground-controls">
          <select 
            value={editorLanguage}
            onChange={handleLanguageChange}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
          </select>
          <button 
            onClick={executeCode}
            disabled={isExecuting}
            className="execute-button"
          >
            {isExecuting ? 'Executing...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="playground-container">
        <div className="editor-container">
          <CodeEditor
            value={code}
            language={editorLanguage}
            theme="seek-dark"
            onChange={handleCodeChange}
            onValidate={handleEditorValidation}
            height="calc(100vh - 280px)"
          />
        </div>
        <div className="output-container">
          <OutputPanel
            output={output}
            error={error}
            isLoading={isExecuting}
            height="calc(100vh - 280px)"
            title="Console Output"
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
