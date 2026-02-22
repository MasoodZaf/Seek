/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, DocumentArrowDownIcon, CodeBracketIcon, SparklesIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import MonacoEditor from '@monaco-editor/react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PlaygroundModern = () => {
  const { user } = useAuth();
  const [code, setCode] = useState(`// Welcome to Code Playground\nconsole.log("Hello, World!");`);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    // Clear markers when user edits the code
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelMarkers(model, "owner", []);
    }
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '📜' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'go', name: 'Go', icon: '🔹' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
    { id: 'php', name: 'PHP', icon: '🐘' },
  ];

  const templates = {
    javascript: `// Modern JavaScript\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet("Developer"));\n\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Doubled:", doubled);`,
    typescript: `// Modern TypeScript\ninterface Person {\n  name: string;\n  age: number;\n}\n\nconst greet = (person: Person): string => {\n  return \`Hello, \${person.name}! You are \${person.age} years old.\`;\n};\n\nconst developer: Person = {\n  name: "Developer",\n  age: 25\n};\n\nconsole.log(greet(developer));\n\nconst numbers: number[] = [1, 2, 3, 4, 5];\nconst doubled = numbers.map((n: number) => n * 2);\nconsole.log("Doubled:", doubled);`,
    python: `# Modern Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Developer"))\n\nnumbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(f"Doubled: {doubled}")`,
    java: `// Modern Java\npublic class Main {\n    public static void main(String[] args) {\n        String name = "Developer";\n        System.out.println("Hello, " + name + "!");\n        \n        int[] numbers = {1, 2, 3, 4, 5};\n        System.out.println("Sum: " + sum(numbers));\n    }\n    \n    static int sum(int[] arr) {\n        int total = 0;\n        for (int n : arr) total += n;\n        return total;\n    }\n}`,
    go: `// Modern Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    name := "Developer"\n    fmt.Printf("Hello, %s!\\n", name)\n    \n    numbers := []int{1, 2, 3, 4, 5}\n    fmt.Println("Numbers:", numbers)\n}`,
    cpp: `// Modern C++\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string name = "Developer";\n    cout << "Hello, " << name << "!" << endl;\n    \n    vector<int> numbers = {1, 2, 3, 4, 5};\n    cout << "Size: " << numbers.size() << endl;\n    return 0;\n}`,
    rust: `// Modern Rust\nfn main() {\n    let name = "Developer";\n    println!("Hello, {}!", name);\n    \n    let numbers = vec![1, 2, 3, 4, 5];\n    let sum: i32 = numbers.iter().sum();\n    println!("Sum: {}", sum);\n}`,
    php: `<?php\n// Modern PHP\n$name = "Developer";\necho "Hello, " . $name . "!\\n";\n\n$numbers = [1, 2, 3, 4, 5];\n$sum = array_sum($numbers);\necho "Sum: " . $sum . "\\n";\n?>`
  };

  const playgroundExamples = {
    javascript: [
      { id: 'js1', name: 'Fibonacci Sequence', code: 'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\nfor (let i = 0; i < 10; i++) {\n  console.log(`Fibonacci(${i}) = ${fib(i)}`);\n}' },
      { id: 'js2', name: 'Reverse String', code: 'const reverse = (str) => str.split("").reverse().join("");\n\nconsole.log(reverse("Hello Developer World!"));' },
      { id: 'js3', name: 'Palindrome Check', code: 'function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true\nconsole.log(isPalindrome("Hello World")); // false' }
    ],
    python: [
      { id: 'py1', name: 'Fibonacci Sequence', code: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nfor i in range(10):\n    print(f"Fibonacci({i}) = {fib(i)}")' },
      { id: 'py2', name: 'Reverse String', code: 'def reverse_str(s):\n    return s[::-1]\n\nprint(reverse_str("Hello Developer World!"))' },
      { id: 'py3', name: 'Palindrome Check', code: 'def is_palindrome(s):\n    clean = "".join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]\n\nprint(is_palindrome("A man, a plan, a canal: Panama")) # True\nprint(is_palindrome("Hello World")) # False' }
    ],
    java: [
      { id: 'ja1', name: 'Fibonacci Sequence', code: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++) {\n            System.out.println("Fibonacci(" + i + ") = " + fib(i));\n        }\n    }\n    \n    static int fib(int n) {\n        if (n <= 1) return n;\n        return fib(n-1) + fib(n-2);\n    }\n}' },
      { id: 'ja2', name: 'Reverse String', code: 'public class Main {\n    public static void main(String[] args) {\n        String str = "Hello Developer World!";\n        StringBuilder sb = new StringBuilder(str);\n        System.out.println(sb.reverse().toString());\n    }\n}' }
    ],
    cpp: [
      { id: 'cpp1', name: 'Fibonacci Sequence', code: '#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        cout << "Fibonacci(" << i << ") = " << fib(i) << endl;\n    }\n    return 0;\n}' }
    ]
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('No code to execute');
      return;
    }

    setIsExecuting(true);
    setOutput('⏳ Executing...');

    try {
      // Clear previous error markers
      if (monacoRef.current && editorRef.current) {
        monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "owner", []);
      }

      const response = await api.post('/code/execute', { code, language, input: '' });
      const result = response.data;

      if (result.success) {
        const data = result.data;
        let outputText = '';

        if (typeof data.output === 'string') {
          outputText = data.output.trim();
        } else if (data.output?.stdout) {
          outputText = data.output.stdout.trim();
        } else if (data.output?.output) {
          outputText = data.output.output.trim();
        }

        if (data.output?.stderr) {
          outputText += `\n\n❌ Error:\n${data.output.stderr}`;
        }

        if (data.error) {
          outputText += `\n\n❌ ${data.error}`;
        }

        // Parse error line for highlighting
        let foundErrorLine = null;
        const errStrToMatch = (data.output?.stderr || '') + ' ' + (data.error || '');
        const stderrMatches = errStrToMatch.match(/line (\d+)/i) || errStrToMatch.match(/:(\d+):\d+/i);

        if (stderrMatches && stderrMatches[1]) {
          foundErrorLine = parseInt(stderrMatches[1], 10);
        }

        if (foundErrorLine) {
          outputText += `\n\n📌 Exact Error at Line -> ${foundErrorLine}`;

          if (monacoRef.current && editorRef.current) {
            const model = editorRef.current.getModel();
            monacoRef.current.editor.setModelMarkers(model, "owner", [
              {
                startLineNumber: foundErrorLine,
                startColumn: 1,
                endLineNumber: foundErrorLine,
                endColumn: 1000,
                message: "Syntax Error or Exception",
                severity: monacoRef.current.MarkerSeverity.Error
              }
            ]);
          }
        }

        const time = data.executionTime ? `\n\n⏱️ ${data.executionTime}ms` : '';
        setOutput(outputText || '✅ Success (no output)' + time);
        toast.success('Code executed!');
      } else {
        setOutput(`❌ Failed: ${result.message || 'Unknown error'}`);
        toast.error('Execution failed');
      }
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
      toast.error('Network error');
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadCode = () => {
    const ext = { javascript: 'js', typescript: 'ts', python: 'py', java: 'java', go: 'go', cpp: 'cpp', rust: 'rs', php: 'php' }[language];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  useEffect(() => {
    if (templates[language]) {
      setCode(templates[language]);
      setOutput('');
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentLang = languages.find(l => l.id === language);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] w-full bg-gray-900 text-white overflow-hidden rounded-xl shadow-2xl border border-gray-700/50">

      {/* Header / Toolbar */}
      <div className="flex-shrink-0 bg-gray-800/80 border-b border-gray-700/50 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold hidden sm:block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Playground
            </h1>
          </div>

          <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>

          {/* Language Selector in Toolbar */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-gray-700/80 border border-gray-600 text-sm rounded-lg px-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-700 cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-base">
              {currentLang?.icon}
            </div>
          </div>

          {/* Examples Selector */}
          {playgroundExamples[language] && (
            <div className="relative ml-2">
              <select
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCode(templates[language]);
                  } else {
                    const ex = playgroundExamples[language].find(x => x.id === e.target.value);
                    if (ex) setCode(ex.code);
                  }
                  e.target.value = ""; // reset to placeholder
                }}
                className="appearance-none bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium rounded-lg pl-8 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:bg-indigo-600/30 cursor-pointer"
              >
                <option value="">Load Example...</option>
                {playgroundExamples[language].map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-base">
                💡
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadCode}
            className="hidden sm:flex px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors items-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Download</span>
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-300" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Editor Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Theme</label>
                    <select
                      value={editorTheme}
                      onChange={(e) => setEditorTheme(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm outline-none"
                    >
                      <option value="vs-dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="hc-black">High Contrast</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={runCode}
            disabled={isExecuting}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all font-medium text-sm flex items-center shadow-lg"
          >
            <PlayIcon className="w-4 h-4 mr-1.5" />
            <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Content - Split layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full">

        {/* Left Side: Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-700/50 min-h-0 relative">
          <div className="px-4 py-2 bg-gray-800/30 text-xs font-mono text-gray-400 border-b border-gray-700/50 flex justify-between items-center shadow-inner">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
              </div>
              <span>code.{currentLang?.id || 'js'}</span>
            </div>
            <div className="flex space-x-3 text-gray-500">
              <span>Lines: {code.split('\n').length}</span>
              <span>Chars: {code.length}</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <MonacoEditor
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              language={language === 'cpp' ? 'cpp' : language}
              theme={editorTheme}
              options={{
                fontSize,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
              }}
            />
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex-1 flex flex-col bg-gray-900 min-h-0 lg:max-w-xl xl:max-w-2xl border-t lg:border-t-0 border-gray-700/50">
          <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700/50 flex justify-between items-center shadow-inner">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Output Console</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success('Output copied to clipboard!');
                }}
                className="text-xs px-3 py-1 font-medium rounded-md bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed">
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <CodeBracketIcon className="w-10 h-10 mb-2 opacity-50" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaygroundModern;
