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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Enhanced Mobile Header with Glassmorphism */}
      <div className="sticky top-16 bg-white/80 backdrop-blur-xl border-b border-white/50 z-20 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Code Playground
              </h1>
            </motion.div>

            {/* Enhanced Language Selector */}
            <motion.button
              onClick={() => setShowLanguageSelector(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${currentLanguage.color} rounded-xl shadow-lg border border-white/30 backdrop-blur-sm`}
            >
              <span className="text-xl">{currentLanguage.emoji}</span>
              <span className="font-bold text-white drop-shadow-sm">{currentLanguage.name}</span>
            </motion.button>
          </div>

          {user ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium"
            >
              Ready to code, {user.firstName}! 🚀
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-red-500 mt-2 font-semibold"
            >
              Please login to run your code
            </motion.p>
          )}
        </div>
      </div>

      {/* Enhanced Code Editor with Glassmorphism */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-0 overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50">
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
        </motion.div>
      </div>

      {/* Enhanced Action Buttons with Glassmorphism */}
      <div className="px-4 mb-4">
        <div className="flex space-x-3">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl border-0 relative overflow-hidden group"
              onClick={executeCode}
              disabled={isExecuting || !user}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              {isExecuting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  <span className="font-bold">Running...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 mr-2" />
                  <span className="font-bold">Run Code</span>
                </>
              )}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowOutput(!showOutput)}
              className="relative bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg"
            >
              {showOutput ? <ChevronDownIcon className="h-6 w-6" /> : <ChevronUpIcon className="h-6 w-6" />}
              {(output || error) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                />
              )}
            </Button>
          </motion.div>
        </div>

        <div className="flex space-x-2 mt-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetCode}
              className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-md"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={shareCode}
              className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-md"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={saveCode}
              className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-md"
            >
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Save
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
            >
              AI Help
            </AITutorButton>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Output Panel with Glassmorphism */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mb-4"
          >
            <Card className="p-5 shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 text-lg flex items-center">
                  <span className="mr-2">Output</span>
                  {(output || error) && (
                    <div className="flex items-center space-x-2">
                      {error ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </h3>
              </div>

              {/* Output Content */}
              <div className="min-h-[120px] max-h-[250px] overflow-auto">
                {isExecuting ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full" />
                      <div className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full" />
                    </div>
                    <span className="mt-4 text-gray-700 font-semibold">Executing code...</span>
                  </div>
                ) : output || error ? (
                  <div className="space-y-3">
                    {output && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl" />
                        <pre className="relative text-sm text-green-800 font-mono whitespace-pre-wrap break-words font-semibold">
                          {output}
                        </pre>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-red-800 flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            Error
                          </span>
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
                            className="bg-white/50 border border-red-300"
                          >
                            Debug Help
                          </AITutorButton>
                        </div>
                        <pre className="relative text-sm text-red-700 font-mono whitespace-pre-wrap break-words font-semibold">
                          {error}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <PlayIcon className="h-12 w-12 mx-auto mb-3 text-indigo-400" />
                    </motion.div>
                    <p className="font-semibold text-gray-600">Run your code to see output here</p>
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

      {/* Enhanced Language Selector Modal with Glassmorphism */}
      <AnimatePresence>
        {showLanguageSelector && (
          <div className="fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLanguageSelector(false)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full bg-white/95 backdrop-blur-2xl rounded-t-3xl p-6 shadow-2xl border-t-2 border-white/50"
            >
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
                Choose Language
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {LANGUAGES.map((lang, index) => (
                  <motion.button
                    key={lang.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setLanguage(lang.id);
                      setShowLanguageSelector(false);
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                      ${language === lang.id
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:bg-white/80 hover:border-gray-300'
                      }
                    `}
                  >
                    {language === lang.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                    )}
                    <div className="relative z-10 flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md ${language === lang.id ? 'bg-white' : 'bg-gray-100'}`}>
                        {lang.emoji}
                      </div>
                      <div className="text-left flex-1">
                        <div className={`font-black ${language === lang.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {lang.name}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {lang.id === 'javascript' && 'Modern ES6+ support'}
                          {lang.id === 'python' && 'Python 3.x ready'}
                          {lang.id === 'java' && 'Object-oriented'}
                          {lang.id === 'typescript' && 'Type-safe JavaScript'}
                          {lang.id === 'cpp' && 'High performance'}
                        </div>
                      </div>
                      {language === lang.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative"
                        >
                          <CheckCircleIcon className="h-7 w-7 text-indigo-600" />
                          <div className="absolute inset-0 bg-indigo-400/30 blur-lg rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Bottom Safe Area */}
              <div className="h-6" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobilePlayground;