import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlayIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, Card } from '../components/ui';
import CodeEditor from '../components/editor/CodeEditor/CodeEditor';
import OutputPanel from '../components/editor/OutputPanel/OutputPanel';
import AITutorButton from '../components/ai/AITutorButton';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEFAULT_TEMPLATES = {
  javascript: `// Welcome to Seek Code Playground!
// Try running this example or write your own code

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 fibonacci numbers
console.log("First 10 Fibonacci numbers:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Fun fact: You can use modern JavaScript features!
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`,

  python: `# Welcome to Seek Code Playground!
# Python execution coming soon...

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Calculate first 10 fibonacci numbers
print("First 10 Fibonacci numbers:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# List comprehension example
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled numbers:", doubled)`,

  typescript: `// Welcome to Seek Code Playground!
// TypeScript execution coming soon...

interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user: User = { name: "Alice", age: 25 };
console.log(greetUser(user));

// Generic function example
function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<string>("Hello TypeScript!"));
console.log(identity<number>(42));`,

  java: `// Welcome to Seek Code Playground!
// Java execution coming soon...

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Calculate fibonacci numbers
        System.out.println("First 10 Fibonacci numbers:");
        for (int i = 0; i < 10; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,

  gml: `// Welcome to Seek Code Playground!
// GameMaker Language (GML) execution coming soon...

// Initialize variables
var i, result;
var numbers;

// Show message
show_message("Hello from GML!");

// Calculate fibonacci numbers
show_message("First 10 Fibonacci numbers:");
for (i = 0; i < 10; i++) {
    result = fibonacci(i);
    show_message("F(" + string(i) + ") = " + string(result));
}

// Array operations
numbers = [1, 2, 3, 4, 5];
var doubled = [];
for (i = 0; i < array_length_1d(numbers); i++) {
    doubled[i] = numbers[i] * 2;
}
show_message("Original: " + string(numbers));
show_message("Doubled: " + string(doubled));

// Function definition
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,

  cpp: `// Welcome to Seek Code Playground!
// C++ execution coming soon...

#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Function declaration
int fibonacci(int n);

int main() {
    cout << "Hello from C++!" << endl;
    
    // Calculate fibonacci numbers
    cout << "First 10 Fibonacci numbers:" << endl;
    for (int i = 0; i < 10; i++) {
        cout << "F(" << i << ") = " << fibonacci(i) << endl;
    }
    
    // Vector operations
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> doubled;
    
    for (int num : numbers) {
        doubled.push_back(num * 2);
    }
    
    cout << "Doubled numbers: ";
    for (int num : doubled) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}

// Function definition
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,

  c: `// Welcome to Seek Code Playground!
// C execution coming soon...

#include <stdio.h>
#include <stdlib.h>

// Function declaration
int fibonacci(int n);

int main() {
    printf("Hello from C!\\n");
    
    // Calculate fibonacci numbers
    printf("First 10 Fibonacci numbers:\\n");
    for (int i = 0; i < 10; i++) {
        printf("F(%d) = %d\\n", i, fibonacci(i));
    }
    
    // Array operations
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Doubled numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i] * 2);
    }
    printf("\\n");
    
    return 0;
}

// Function definition
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
};

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500', available: true },
  { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600', available: true },
  { id: 'python', name: 'Python', color: 'bg-blue-500', available: true },
  { id: 'java', name: 'Java', color: 'bg-red-500', available: true },
  { id: 'cpp', name: 'C++', color: 'bg-purple-600', available: true },
  { id: 'c', name: 'C', color: 'bg-gray-600', available: true },
  { id: 'gml', name: 'GML', color: 'bg-green-600', available: true },
];

const Playground = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(DEFAULT_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [settings, setSettings] = useState({
    theme: 'vs-dark',
    fontSize: 14,
    wordWrap: true,
    minimap: true,
  });
  const [executionHistory, setExecutionHistory] = useState([]);
  
  const { user } = useAuth();
  const editorRef = useRef(null);

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`playground-code-${editorLanguage}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_TEMPLATES[editorLanguage]);
    }
  }, [editorLanguage]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    // Save to localStorage
    localStorage.setItem(`playground-code-${editorLanguage}`, newCode);
    // Clear previous outputs when code changes
    if (error || output) {
      setError('');
      setOutput('');
    }
  }, [editorLanguage, error, output]);

  const handleLanguageChange = useCallback((newLanguage) => {
    setEditorLanguage(newLanguage);
    setError('');
    setOutput('');
  }, []);

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error(String(t('playground.writeCodeFirst') || 'Please write some code first'));
      return;
    }

    if (!user) {
      toast.error(String(t('auth.loginRequired') || 'Login required'));
      setError('Authentication required: Please login to use the code execution feature.');
      return;
    }

    const language = LANGUAGES.find(l => l.id === editorLanguage);
    if (!language?.available) {
      toast.error(`${language?.name} execution is coming soon!`);
      return;
    }

    setIsExecuting(true);
    setError('');
    setOutput('');

    try {
      // Call backend API for code execution
      const response = await fetch('/api/v1/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Use cookies for authentication
        body: JSON.stringify({
          code,
          language: editorLanguage,
          input: ''
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 Playground API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 401) {
          throw new Error('Authentication failed: Please logout and login again to refresh your session.');
        } else if (response.status === 403) {
          throw new Error('Access denied: You do not have permission to execute code.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded: Please wait a moment before executing code again.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        const output = result.data?.output || result.output;
        const executionTime = result.data?.executionTime || result.executionTime;
        
        // Process and format output
        console.log('Backend response:', result);
        console.log('Output data:', output);
        let formattedOutput = output?.stdout || String(t('playground.codeExecutedSuccessfully') || 'Code executed successfully');
        // Unescape newlines and other escape sequences
        formattedOutput = formattedOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        console.log('Formatted output:', formattedOutput);
        setOutput(formattedOutput);
        if (output?.stderr) {
          setError(output.stderr);
        }
        
        // Add to execution history
        setExecutionHistory(prev => [{
          id: Date.now(),
          code: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
          timestamp: new Date(),
          success: true,
          executionTime: executionTime,
        }, ...prev.slice(0, 9)]);
        
      } else {
        setError(result.error || 'Execution failed');
        setExecutionHistory(prev => [{
          id: Date.now(),
          code: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
          timestamp: new Date(),
          success: false,
          error: result.error,
        }, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      // Fall back to client-side execution
      
      // Fallback to client-side execution for JavaScript
      if (editorLanguage === 'javascript') {
        try {
          const originalConsoleLog = console.log;
          const originalConsoleError = console.error;
          let output = '';
          
          console.log = (...args) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };
          
          console.error = (...args) => {
            output += 'Error: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };

          // eslint-disable-next-line no-new-func
          new Function(code)();
          setOutput(output || String(t('playground.codeExecutedSuccessfully') || 'Code executed successfully'));
          setError('ℹ️ ' + String(t('playground.executedLocally') || 'Executed locally'));
          
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
        } catch (execError) {
          setError(execError.toString());
        }
      } else {
        setError(`Network error: ${err.message}. Please check your connection.`);
      }
    }
    
    setIsExecuting(false);
  }, [code, editorLanguage, user]);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_TEMPLATES[editorLanguage]);
    setError('');
    setOutput('');
    localStorage.removeItem(`playground-code-${editorLanguage}`);
    toast.success(String(t('playground.codeReset') || 'Code reset'));
  }, [editorLanguage]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(String(t('playground.codeCopied') || 'Code copied'));
    } catch (err) {
      toast.error(String(t('playground.failedToCopy') || 'Failed to copy'));
    }
  }, [code]);

  const shareCode = useCallback(() => {
    // Simulate sharing functionality
    toast.success(String(t('playground.sharingComingSoon') || 'Sharing coming soon'));
  }, [t]);

  const saveCode = useCallback(() => {
    // Simulate saving functionality
    toast.success(String(t('playground.saveComingSoon') || 'Save coming soon'));
  }, [t]);

  const handleEditorValidation = useCallback((errors) => {
    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => `Line ${err.startLineNumber}: ${err.message}`)
        .join('\n');
      setError(errorMessages);
    } else if (error) {
      setError('');
    }
  }, [error]);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {t('playground.title')}
          </h1>
          <p className="text-secondary-600">
            {t('playground.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={editorLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-white border border-secondary-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} {!lang.available && '(Coming Soon)'}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          </div>
          
          {/* Language Badge */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${LANGUAGES.find(l => l.id === editorLanguage)?.color}`} />
            <Badge variant={LANGUAGES.find(l => l.id === editorLanguage)?.available ? 'success' : 'secondary'}>
              {LANGUAGES.find(l => l.id === editorLanguage)?.name}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Card className="p-0 h-full flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-secondary-900">{t('playground.editor')}</h3>
                {user ? (
                  <span className="text-sm text-secondary-500">
                    Welcome, {user.firstName}!
                  </span>
                ) : (
                  <span className="text-sm text-red-500">
                    {t('auth.loginRequired')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <AITutorButton
                  variant="ghost"
                  size="sm"
                  context={{
                    type: 'codeReview',
                    page: 'playground',
                    language: editorLanguage
                  }}
                  code={code}
                  language={editorLanguage}
                >
                  AI Review (Pro)
                </AITutorButton>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                  icon={DocumentDuplicateIcon}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shareCode}
                  icon={ShareIcon}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveCode}
                  icon={BookmarkIcon}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  icon={ArrowPathIcon}
                />
              </div>
            </div>
            
            {/* Editor */}
            <div className="flex-1 min-h-0">
              <CodeEditor
                ref={editorRef}
                value={code}
                language={editorLanguage}
                theme={settings.theme}
                onChange={handleCodeChange}
                onValidate={handleEditorValidation}
                height="100%"
                options={{
                  fontSize: settings.fontSize,
                  wordWrap: settings.wordWrap ? 'on' : 'off',
                  minimap: { enabled: settings.minimap },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col space-y-6">
          {/* Controls */}
          <Card className="p-4">
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={executeCode}
                loading={isExecuting}
                disabled={!user}
                icon={PlayIcon}
                iconPosition="left"
              >
                {isExecuting ? String(t('playground.running') || 'Running...') : !user ? String(t('playground.loginRequired') || 'Login Required') : String(t('playground.runCode') || 'Run Code')}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSettings({ ...settings })}
                  icon={Cog6ToothIcon}
                  className="w-full"
                >
                  {t('playground.settings')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  icon={ArrowPathIcon}
                  className="w-full"
                >
                  {t('playground.reset')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="p-0 flex-1 min-h-0 flex flex-col">
            <div className="p-4 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-secondary-900">{t('playground.output')}</h3>
                <div className="flex items-center space-x-2">
                  {error && (
                    <AITutorButton
                      variant="ghost"
                      size="sm"
                      context={{
                        type: 'debugging',
                        page: 'playground',
                        language: editorLanguage,
                        hasError: true
                      }}
                      code={code}
                      language={editorLanguage}
                    >
                      AI Debug (Pro)
                    </AITutorButton>
                  )}
                  {executionHistory.length > 0 && executionHistory[0].executionTime && (
                    <span className="text-sm text-secondary-500">
                      {executionHistory[0].executionTime.toFixed(2)}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <OutputPanel
                output={output}
                error={error}
                isLoading={isExecuting}
                height="100%"
                className="rounded-none border-0"
              />
            </div>
          </Card>

          {/* Execution History */}
          {executionHistory.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium text-secondary-900 mb-3">{t('playground.recentRuns')}</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {executionHistory.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded"
                  >
                    <span className="truncate flex-1 mr-2">{run.code}</span>
                    <div className="flex items-center space-x-1">
                      <Badge variant={run.success ? 'success' : 'error'} size="sm">
                        {run.success ? '✓' : '✗'}
                      </Badge>
                      <span className="text-xs text-secondary-500">
                        {run.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* AI Tutor Floating Button */}
      <AITutorButton
        variant="floating"
        context={{
          type: 'general',
          page: 'playground',
          language: editorLanguage
        }}
        code={code}
        language={editorLanguage}
      />
    </div>
  );
};

export default Playground;
