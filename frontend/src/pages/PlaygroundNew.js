import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayIcon, 
  ArrowDownTrayIcon,
  BookmarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  TrashIcon,
  CheckIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PlaygroundNew = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedCodes, setSavedCodes] = useState([]);
  const [currentCodeName, setCurrentCodeName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);
  const consoleRef = useRef([]);

  // Enhanced code execution with console capture
  const runCode = () => {
    consoleRef.current = [];
    
    // Override console methods to capture output
    const originalConsole = { ...console };
    const captureConsole = (method) => {
      console[method] = (...args) => {
        consoleRef.current.push(`${method.toUpperCase()}: ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`);
        originalConsole[method](...args);
      };
    };
    
    ['log', 'warn', 'error', 'info'].forEach(captureConsole);
    
    try {
      if (language === 'javascript') {
        // Execute JavaScript code using eval (for demo purposes only)
        // Note: This is not ideal for production but provides basic execution
        let result;
        try {
          result = eval(`(function() { ${code}; return undefined; })()`);
        } catch (evalError) {
          throw evalError;
        }
        
        let output = '';
        if (consoleRef.current.length > 0) {
          output += consoleRef.current.join('\n') + '\n';
        }
        if (result !== undefined) {
          output += `Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`;
        }
        if (!output) {
          output = 'Code executed successfully';
        }
        setOutput(output);
      } else {
        setOutput(`${language} execution not implemented yet. Available: JavaScript`);
      }
    } catch (error) {
      let errorOutput = `❌ Error: ${error.message}`;
      if (consoleRef.current.length > 0) {
        errorOutput = consoleRef.current.join('\n') + '\n' + errorOutput;
      }
      setOutput(errorOutput);
    } finally {
      // Restore original console
      Object.assign(console, originalConsole);
    }
  };

  // Code templates
  const codeTemplates = {
    javascript: {
      'Hello World': `// Hello World Example
console.log('Hello, World!');

// Try modifying this message
const message = 'Welcome to Seek Playground!';
console.log(message);`,
      'Variables & Functions': `// Variables and Functions
let name = 'Developer';
const age = 25;

function greet(person, years) {
  return \`Hello \${person}, you are \${years} years old!\`;
}

const greeting = greet(name, age);
console.log(greeting);

// Arrow function
const square = (n) => n * n;
console.log('Square of 5:', square(5));`,
      'Arrays & Objects': `// Working with Arrays and Objects
const fruits = ['apple', 'banana', 'orange'];
const person = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'coding', 'hiking']
};

console.log('Fruits:', fruits);
console.log('Person:', person);

// Array methods
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('Uppercase fruits:', upperFruits);

// Object destructuring
const { name, hobbies } = person;
console.log(\`\${name} enjoys: \${hobbies.join(', ')}\`);`,
      'Async/Await': `// Async/Await Example
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncExample() {
  console.log('Starting async operation...');
  
  await delay(1000);
  console.log('Operation completed after 1 second!');
  
  return 'Async function finished';
}

// Call the async function
asyncExample().then(result => {
  console.log(result);
});`
    },
    python: {
      'Hello World': `# Hello World in Python
print("Hello, World!")

# Variables
name = "Developer"
age = 25
print(f"Hello {name}, you are {age} years old!")`,
      'Lists & Dictionaries': `# Working with Lists and Dictionaries
fruits = ['apple', 'banana', 'orange']
person = {
    'name': 'Alice',
    'age': 30,
    'hobbies': ['reading', 'coding', 'hiking']
}

print('Fruits:', fruits)
print('Person:', person)

# List comprehension
upper_fruits = [fruit.upper() for fruit in fruits]
print('Uppercase fruits:', upper_fruits)`
    },
    java: {
      'Hello World': `// Hello World in Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "Developer";
        int age = 25;
        System.out.println("Hello " + name + ", you are " + age + " years old!");
    }
}`,
      'Classes & Objects': `// Classes and Objects in Java
class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void greet() {
        System.out.println("Hello, I'm " + name + " and I'm " + age + " years old.");
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice", 30);
        person.greet();
    }
}`
    }
  };

  // Load saved codes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('playground_saved_codes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  // Save code functionality
  const saveCode = () => {
    if (!currentCodeName.trim()) return;
    
    const newSavedCode = {
      id: Date.now(),
      name: currentCodeName,
      code,
      language,
      createdAt: new Date().toISOString(),
      userId: user?.id
    };
    
    const updatedCodes = [...savedCodes, newSavedCode];
    setSavedCodes(updatedCodes);
    localStorage.setItem('playground_saved_codes', JSON.stringify(updatedCodes));
    setCurrentCodeName('');
    setShowSaveDialog(false);
  };

  // Load saved code
  const loadCode = (savedCode) => {
    setCode(savedCode.code);
    setLanguage(savedCode.language);
    setOutput('');
  };

  // Delete saved code
  const deleteSavedCode = (id) => {
    const updatedCodes = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedCodes);
    localStorage.setItem('playground_saved_codes', JSON.stringify(updatedCodes));
  };

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Failed to copy code
    }
  };

  // Download code as file
  const downloadCode = () => {
    const fileExtensions = {
      javascript: 'js',
      python: 'py',
      java: 'java'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_code.${fileExtensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load template
  const loadTemplate = (templateName) => {
    const template = codeTemplates[language]?.[templateName];
    if (template) {
      setCode(template);
      setOutput('');
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-white" 
    : "min-h-screen";
    
  const bgClasses = isDarkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-50 text-gray-900";

  return (
    <div className={`${containerClasses} ${bgClasses} transition-colors duration-300`}>
      <div className={`${isFullscreen ? 'h-full' : ''} p-6`}>
        <div className="max-w-7xl mx-auto h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Code Playground
              </h1>
              {user && (
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, {user.firstName}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className={`grid ${isFullscreen ? 'grid-cols-2 h-[calc(100vh-8rem)]' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
            {/* Code Editor Section */}
            <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Code Editor
                  </h2>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Templates Dropdown */}
                  <select
                    onChange={(e) => e.target.value && loadTemplate(e.target.value)}
                    value=""
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Load Template...</option>
                    {Object.keys(codeTemplates[language] || {}).map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                  
                  {/* Action Buttons */}
                  <button
                    onClick={copyCode}
                    className={`p-2 rounded-lg transition-colors ${
                      copySuccess
                        ? 'bg-green-600 text-white'
                        : isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Copy Code"
                  >
                    {copySuccess ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={downloadCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Download Code"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Save Code"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Code Editor */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full ${isFullscreen ? 'h-[calc(100vh-16rem)]' : 'h-80'} p-4 border rounded-md font-mono text-sm resize-none ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>
              
              {/* Editor Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={runCode}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>Run Code</span>
                  </button>
                  
                  <button
                    onClick={() => setCode('')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear
                  </button>
                </div>
                
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lines: {code.split('\n').length} | Characters: {code.length}
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Output
                </h2>
                <button
                  onClick={() => setOutput('')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
              
              <div className={`${isFullscreen ? 'h-[calc(100vh-16rem)]' : 'h-80'} p-4 border rounded-md font-mono text-sm overflow-auto ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-900 text-green-400' 
                  : 'border-gray-300 bg-gray-900 text-green-400'
              }`}>
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500">Click "Run Code" to see output here...</div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Codes Section */}
          {!isFullscreen && savedCodes.length > 0 && (
            <div className={`mt-8 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Saved Codes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCodes.map((savedCode) => (
                  <div key={savedCode.id} className={`p-4 border rounded-lg ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {savedCode.name}
                      </h3>
                      <button
                        onClick={() => deleteSavedCode(savedCode.id)}
                        className={`p-1 rounded hover:bg-red-100 text-red-600`}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {savedCode.language} • {new Date(savedCode.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => loadCode(savedCode)}
                      className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Load Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {!isFullscreen && (
            <div className={`mt-8 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Syntax Highlighting
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Beautiful code highlighting
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Save & Load
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Save your code snippets
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Templates
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Pre-built code examples
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Console Capture
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    See all console output
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Save Code
            </h3>
            <input
              type="text"
              value={currentCodeName}
              onChange={(e) => setCurrentCodeName(e.target.value)}
              placeholder="Enter a name for your code..."
              className={`w-full p-3 border rounded-md mb-4 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setCurrentCodeName('');
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveCode}
                disabled={!currentCodeName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundNew;