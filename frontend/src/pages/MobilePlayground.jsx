import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  ArrowPathIcon,
  ShareIcon,
  BookmarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button, Badge, Card } from '../components/ui';
import MobileCodeEditor from '../components/CodeEditor/MobileCodeEditor';
import AITutorButton from '../components/ai/AITutorButton';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOBILE_TEMPLATES = {
  javascript: `// Welcome to Seek Mobile Coding!
// Swipe and pinch to navigate

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Try this example
console.log("Fib(7):", fibonacci(7));`,

  python: `# Mobile Python Coding
# Touch-friendly interface

def hello_world():
    print("Hello from mobile!")
    
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
hello_world()
print(f"Fib(7): {fibonacci(7)}")`,

  java: `// Mobile Java Environment
public class MobileCode {
    public static void main(String[] args) {
        System.out.println("Java on mobile!");
        
        int result = fibonacci(7);
        System.out.println("Fib(7): " + result);
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
}`
};

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500', emoji: '🟨' },
  { id: 'python', name: 'Python', color: 'bg-blue-500', emoji: '🐍' },
  { id: 'java', name: 'Java', color: 'bg-red-500', emoji: '☕' },
  { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600', emoji: '🔷' },
  { id: 'cpp', name: 'C++', color: 'bg-purple-600', emoji: '⚡' },
];

const MobilePlayground = () => {
  const { user } = useAuth();
  const [code, setCode] = useState(MOBILE_TEMPLATES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    // Load saved code for current language
    const saved = localStorage.getItem(`mobile-playground-${language}`);
    if (saved) {
      setCode(saved);
    } else {
      setCode(MOBILE_TEMPLATES[language] || '');
    }
  }, [language]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    // Auto-save to localStorage
    localStorage.setItem(`mobile-playground-${language}`, newCode);
    
    // Clear previous outputs when code changes
    if (output || error) {
      setOutput('');
      setError('');
    }
  }, [language, output, error]);

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    if (!user) {
      toast.error('Please login to run code');
      return;
    }

    setIsExecuting(true);
    setShowOutput(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/v1/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          language,
          input: ''
        })
      });

      const result = await response.json();

      if (result.success) {
        const executionOutput = result.data?.output || result.output;
        let formattedOutput = executionOutput?.stdout || 'Code executed successfully!';
        formattedOutput = formattedOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        
        setOutput(formattedOutput);
        
        if (executionOutput?.stderr) {
          setError(executionOutput.stderr);
        }

        // Add to execution history
        setExecutionHistory(prev => [{
          id: Date.now(),
          code: code.slice(0, 50) + (code.length > 50 ? '...' : ''),
          timestamp: new Date(),
          success: true,
          language,
          output: formattedOutput.slice(0, 100) + (formattedOutput.length > 100 ? '...' : '')
        }, ...prev.slice(0, 4)]);

        toast.success('Code executed successfully!');
      } else {
        setError(result.error || 'Execution failed');
        toast.error('Execution failed');
      }
    } catch (err) {
      // Fallback for JavaScript
      if (language === 'javascript') {
        try {
          let output = '';
          const originalLog = console.log;
          const originalError = console.error;
          
          console.log = (...args) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };
          
          console.error = (...args) => {
            setError(args.join(' '));
          };

          // Execute code using eval as fallback (limited to simple expressions)
          // This is not ideal but provides basic JavaScript execution for demo purposes
          try {
            // Create a safe execution context
            const result = eval(`(function() { ${code}; return undefined; })()`);
            if (result !== undefined) {
              output += String(result) + '\n';
            }
          } catch (evalError) {
            throw evalError;
          }
          
          console.log = originalLog;
          console.error = originalError;
          
          setOutput(output || 'Code executed successfully!');
          toast.success('Executed locally');
        } catch (execError) {
          setError(execError.toString());
          toast.error('Execution error');
        }
      } else {
        setError(`Network error: ${err.message}`);
        toast.error('Network error');
      }
    }
    
    setIsExecuting(false);
  }, [code, language, user]);

  const resetCode = useCallback(() => {
    setCode(MOBILE_TEMPLATES[language] || '');
    setOutput('');
    setError('');
    localStorage.removeItem(`mobile-playground-${language}`);
    toast.success('Code reset!');
  }, [language]);

  const shareCode = useCallback(async () => {
    try {
      await navigator.share({
        title: 'Check out my code!',
        text: code,
        url: window.location.href
      });
      toast.success('Code shared!');
    } catch (err) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
      } catch {
        toast.error('Unable to share code');
      }
    }
  }, [code]);

  const saveCode = useCallback(() => {
    const timestamp = new Date().toISOString();
    const savedCode = {
      code,
      language,
      timestamp,
      id: Date.now()
    };
    
    const saved = JSON.parse(localStorage.getItem('mobile-saved-codes') || '[]');
    saved.unshift(savedCode);
    localStorage.setItem('mobile-saved-codes', JSON.stringify(saved.slice(0, 10))); // Keep last 10
    
    toast.success('Code saved locally!');
  }, [code, language]);

  const currentLanguage = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-secondary-50 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-16 bg-white border-b border-secondary-200 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-secondary-900">
              Mobile Playground
            </h1>
            
            {/* Language Selector */}
            <button
              onClick={() => setShowLanguageSelector(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 rounded-lg"
            >
              <span className="text-lg">{currentLanguage.emoji}</span>
              <span className="font-medium">{currentLanguage.name}</span>
            </button>
          </div>
          
          {user ? (
            <p className="text-sm text-secondary-500 mt-1">
              Ready to code, {user.firstName}! 🚀
            </p>
          ) : (
            <p className="text-sm text-error-500 mt-1">
              Please login to run your code
            </p>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-4">
        <Card className="p-0 overflow-hidden">
          <MobileCodeEditor
            ref={editorRef}
            value={code}
            onChange={handleCodeChange}
            language={language}
            onRun={executeCode}
            height="50vh"
            placeholder={`Start coding in ${currentLanguage.name}...`}
          />
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={executeCode}
            disabled={isExecuting || !user}
          >
            {isExecuting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Running
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowOutput(!showOutput)}
            className="relative"
          >
            {showOutput ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronUpIcon className="h-5 w-5" />}
            {(output || error) && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary-500 rounded-full" />
            )}
          </Button>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button variant="secondary" size="sm" onClick={resetCode}>
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button variant="secondary" size="sm" onClick={shareCode}>
            <ShareIcon className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="secondary" size="sm" onClick={saveCode}>
            <BookmarkIcon className="h-4 w-4 mr-1" />
            Save
          </Button>
          <AITutorButton
            variant="ghost"
            size="sm"
            context={{
              type: 'codeReview',
              page: 'mobile-playground',
              language
            }}
            code={code}
            language={language}
          >
            AI Help
          </AITutorButton>
        </div>
      </div>

      {/* Output Panel */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mb-4"
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-secondary-900">Output</h3>
                {(output || error) && (
                  <div className="flex items-center space-x-2">
                    {error ? (
                      <ExclamationTriangleIcon className="h-4 w-4 text-error-500" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4 text-success-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Output Content */}
              <div className="min-h-[100px] max-h-[200px] overflow-auto">
                {isExecuting ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                    <span className="ml-2 text-secondary-600">Executing code...</span>
                  </div>
                ) : output || error ? (
                  <div className="space-y-2">
                    {output && (
                      <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                        <pre className="text-sm text-success-800 font-mono whitespace-pre-wrap break-words">
                          {output}
                        </pre>
                      </div>
                    )}
                    {error && (
                      <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-error-800">Error</span>
                          <AITutorButton
                            variant="ghost"
                            size="sm"
                            context={{
                              type: 'debugging',
                              page: 'mobile-playground',
                              language,
                              hasError: true
                            }}
                            code={code}
                            language={language}
                          >
                            Debug Help
                          </AITutorButton>
                        </div>
                        <pre className="text-sm text-error-700 font-mono whitespace-pre-wrap break-words">
                          {error}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary-400">
                    <PlayIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>Run your code to see output here</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <div className="px-4 mb-4">
          <Card className="p-4">
            <h3 className="font-medium text-secondary-900 mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Recent Runs
            </h3>
            <div className="space-y-2">
              {executionHistory.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-2 bg-secondary-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={run.success ? 'success' : 'error'}
                        size="sm"
                      >
                        {LANGUAGES.find(l => l.id === run.language)?.emoji || '📝'}
                      </Badge>
                      <span className="text-sm text-secondary-700 truncate">
                        {run.code}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      {run.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Language Selector Modal */}
      <AnimatePresence>
        {showLanguageSelector && (
          <div className="fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowLanguageSelector(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full bg-white rounded-t-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Choose Language
              </h3>
              
              <div className="space-y-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setShowLanguageSelector(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors
                      ${language === lang.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:bg-secondary-50'
                      }
                    `}
                  >
                    <span className="text-2xl">{lang.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium text-secondary-900">
                        {lang.name}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {lang.id === 'javascript' && 'Modern ES6+ support'}
                        {lang.id === 'python' && 'Python 3.x ready'}
                        {lang.id === 'java' && 'Object-oriented'}
                        {lang.id === 'typescript' && 'Type-safe JavaScript'}
                        {lang.id === 'cpp' && 'High performance'}
                      </div>
                    </div>
                    {language === lang.id && (
                      <CheckCircleIcon className="h-5 w-5 text-primary-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobilePlayground;