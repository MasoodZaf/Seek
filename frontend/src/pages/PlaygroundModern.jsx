import React, { useState, useEffect } from 'react';
import { PlayIcon, DocumentArrowDownIcon, CodeBracketIcon, SparklesIcon } from '@heroicons/react/24/outline';
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

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '📜', color: 'from-yellow-400 to-yellow-600' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-500 to-blue-700' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'from-blue-400 to-blue-600' },
    { id: 'java', name: 'Java', icon: '☕', color: 'from-red-400 to-red-600' },
    { id: 'go', name: 'Go', icon: '🔹', color: 'from-cyan-400 to-cyan-600' },
    { id: 'cpp', name: 'C++', icon: '⚡', color: 'from-purple-400 to-purple-600' },
    { id: 'rust', name: 'Rust', icon: '🦀', color: 'from-orange-400 to-orange-600' },
    { id: 'php', name: 'PHP', icon: '🐘', color: 'from-indigo-400 to-indigo-600' },
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

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('No code to execute');
      return;
    }

    console.log('Executing code:', { language, codeLength: code.length, codePreview: code.substring(0, 100) });
    setIsExecuting(true);
    setOutput('⏳ Executing...');

    try {
      const response = await api.post('/code/execute', { code, language, input: '' });
      const result = response.data;
      console.log('Execution result:', result);

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
    console.log('Loading template for:', language);
    if (templates[language]) {
      const template = templates[language];
      console.log('Template loaded, length:', template.length);
      setCode(template);
      setOutput('');
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentLang = languages.find(l => l.id === language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 backdrop-blur-xl bg-gray-900/50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <CodeBracketIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Code Playground
                  </h1>
                  <p className="text-xs text-gray-400">Write, run, and share code</p>
                </div>
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Language Selector */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                <CodeBracketIcon className="w-4 h-4 mr-2" />
                Language
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      language === lang.id
                        ? `bg-gradient-to-br ${lang.color} shadow-lg scale-105`
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.icon}</div>
                    <div className="text-xs font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 min-h-fit">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Editor Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Theme</label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm"
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
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 min-h-fit">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Code Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Lines</span>
                  <span className="font-mono text-blue-400">{code.split('\n').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Characters</span>
                  <span className="font-mono text-purple-400">{code.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor & Output */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Editor */}
            <div className="flex-1 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">code.{currentLang?.name.toLowerCase()}</span>
                </div>
                <button
                  onClick={downloadCode}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              <div className="flex-1 relative">
                <MonacoEditor
                  value={code}
                  onChange={(value) => setCode(value || '')}
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
                    fontLigatures: true
                  }}
                />
              </div>
              <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
                <button
                  onClick={runCode}
                  disabled={isExecuting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                </button>
                <button
                  onClick={() => { setCode(''); setOutput(''); }}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="h-72 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden flex flex-col">
              <div className="px-6 py-3 border-b border-gray-700/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">Output</h3>
                <button
                  onClick={() => setOutput('')}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 p-6 overflow-auto font-mono text-sm">
                {output ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500 text-center py-12">
                    <CodeBracketIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Run your code to see output here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundModern;
