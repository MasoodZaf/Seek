import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { 
  ArrowRightIcon, 
  ArrowPathIcon,
  DocumentDuplicateIcon,
  LanguageIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import SimpleCodeEditor from '../components/CodeEditor/SimpleCodeEditor';

const CodeTranslator = () => {
  const { t } = useTranslation();
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [fromLanguage, setFromLanguage] = useState('javascript');
  const [toLanguage, setToLanguage] = useState('python');
  const [isTranslating, setIsTranslating] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Calculate current line count
  const currentLineCount = sourceCode.split('\n').length;

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Language examples for quick start
  const languageExamples = {
    javascript: `function greet(name) {
    console.log("Hello, " + name + "!");
}

let userName = "World";
greet(userName);`,
    python: `def greet(name):
    print(f"Hello, {name}!")

user_name = "World"
greet(user_name)`,
    java: `public class HelloWorld {
    public static void main(String[] args) {
        String name = "World";
        greet(name);
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}`,
    cpp: `#include <iostream>
#include <string>
using namespace std;

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    string userName = "World";
    greet(userName);
    return 0;
}`,
    c: `#include <stdio.h>

void greet(char* name) {
    printf("Hello, %s!\\n", name);
}

int main() {
    char* userName = "World";
    greet(userName);
    return 0;
}`,
    typescript: `function greet(name: string): void {
    console.log(\`Hello, \${name}!\`);
}

const userName: string = "World";
greet(userName);`
  };

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('/api/v1/translation/languages');
      const result = await response.json();
      
      if (result.success) {
        setSupportedLanguages(result.data.languages);
      } else {
        toast.error('Failed to load supported languages');
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error loading languages');
    }
  };

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please enter some code to translate');
      setTranslatedCode('// Please enter your code in the left panel\\n// Then click "Translate Code" to convert it');
      return;
    }

    // Check educational line limit (1000 lines)
    const lineCount = sourceCode.split('\n').length;
    if (lineCount > 1000) {
      toast.error(`Code exceeds educational limit of 1000 lines (current: ${lineCount})`);
      setTranslatedCode(`// Educational System Limit Exceeded\\n// Current lines: ${lineCount}\\n// Maximum allowed: 1000 lines\\n// Please use smaller code snippets for learning purposes`);
      return;
    }

    if (fromLanguage === toLanguage) {
      toast.error('Please select different source and target languages');
      setTranslatedCode('// Please select different source and target languages\\n// Use the language dropdowns above to choose different languages');
      return;
    }

    setIsTranslating(true);
    
    try {
      // Try to get token from multiple sources
      let token = localStorage.getItem('token');
      if (!token) {
        token = localStorage.getItem('accessToken');
      }
      
      if (!token) {
        toast.error('Please log in to use the code translator');
        setTranslatedCode('// Authentication Required\\n// Please log in to use the code translator');
        setIsTranslating(false);
        return;
      }

      const response = await fetch('/api/v1/translation/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: sourceCode,
          fromLanguage,
          toLanguage
        })
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          
          toast.error('Your session has expired. Please log in again.');
          setTranslatedCode('// Session Expired\\n// Please log in again to use the translator');
          
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        } else if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
          setTranslatedCode('// Server Error\\n// Please try again later');
          return;
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          toast.error(errorData.message || `Error ${response.status}: Translation failed`);
          setTranslatedCode(`// Error ${response.status}\\n// ${errorData.message || 'Translation failed'}`);
          return;
        }
      }

      const result = await response.json();

      if (result.success) {
        setTranslatedCode(result.data.translatedCode);
        toast.success(`Code translated from ${fromLanguage} to ${toLanguage}!`);
      } else {
        toast.error(result.message || 'Translation failed');
        setTranslatedCode(`// Translation Error:\\n// ${result.error || result.message || 'Please check your code and try again'}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
        setTranslatedCode('// Network Error\\n// Please check your internet connection and try again');
      } else {
        toast.error('Error during translation');
        setTranslatedCode('// Unexpected Error\\n// Please try again or contact support');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempLang);
    
    // Swap the code too if there's translated code
    if (translatedCode && translatedCode !== '// Error: Unable to translate code') {
      setSourceCode(translatedCode);
      setTranslatedCode('');
    }
  };

  const handleCopyCode = (code, type) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`${type} code copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy code');
    });
  };

  const loadExample = () => {
    const example = languageExamples[fromLanguage];
    if (example) {
      setSourceCode(example);
      setTranslatedCode('');
      toast.success(`${fromLanguage.toUpperCase()} example loaded!`);
    }
  };

  const clearCode = () => {
    setSourceCode('');
    setTranslatedCode('');
  };

  const getLanguageName = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.name : langId.toUpperCase();
  };

  const getLanguageIcon = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.icon : '📄';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <LanguageIcon className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Code Translator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your code between different programming languages instantly. 
            Like a currency converter, but for code! 🔄
          </p>
        </div>

        {/* Language Selection */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center space-x-4">
              {/* From Language */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getLanguageIcon(fromLanguage)}</span>
                  <select
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLanguages}
                className="p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                title="Swap languages"
              >
                <ArrowPathIcon className="w-6 h-6" />
              </button>

              {/* To Language */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getLanguageIcon(toLanguage)}</span>
                  <select
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Load Example</span>
              </button>
              <button
                onClick={clearCode}
                className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Code Translation Panel */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getLanguageIcon(fromLanguage)}</span>
                    <span>{getLanguageName(fromLanguage)} Code</span>
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      currentLineCount > 1000 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                        : currentLineCount > 800 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {currentLineCount}/1000 lines
                    </span>
                    <button
                      onClick={() => handleCopyCode(sourceCode, 'Source')}
                      disabled={!sourceCode.trim()}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative" style={{height: '384px'}}>
                  <SimpleCodeEditor
                    code={sourceCode}
                    onChange={setSourceCode}
                    language={fromLanguage}
                    placeholder={`Enter your ${getLanguageName(fromLanguage)} code here...`}
                    isDark={isDarkMode}
                    readOnly={false}
                  />
                </div>
                
                {/* Syntax Help Info */}
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <InformationCircleIcon className="w-4 h-4 mr-1" />
                  <span>Hover over keywords and functions for syntax help</span>
                </div>
              </div>
            </div>

            {/* Translation Arrow & Button */}
            <div className="lg:hidden flex justify-center">
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !sourceCode.trim()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isTranslating ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRightIcon className="w-5 h-5" />
                )}
                <span>{isTranslating ? 'Translating...' : 'Translate Code'}</span>
              </button>
            </div>

            {/* Translated Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getLanguageIcon(toLanguage)}</span>
                    <span>{getLanguageName(toLanguage)} Code</span>
                  </h3>
                  <button
                    onClick={() => handleCopyCode(translatedCode, 'Translated')}
                    disabled={!translatedCode.trim()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="relative" style={{height: '384px'}}>
                  <SimpleCodeEditor
                    code={translatedCode}
                    onChange={() => {}} // Read-only
                    language={toLanguage}
                    placeholder={`Translated ${getLanguageName(toLanguage)} code will appear here...`}
                    isDark={isDarkMode}
                    readOnly={true}
                  />
                </div>
                
                {/* Translation Help Info */}
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <InformationCircleIcon className="w-4 h-4 mr-1" />
                  <span>Hover over translated code for syntax explanations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Translate Button */}
          <div className="hidden lg:flex justify-center mt-8">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceCode.trim()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-lg"
            >
              {isTranslating ? (
                <ArrowPathIcon className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRightIcon className="w-6 h-6" />
              )}
              <span>{isTranslating ? 'Translating...' : 'Translate Code'}</span>
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              🔍 How Code Translation Works
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Analyzes your source code structure (variables, functions, control flow)</li>
              <li>• Maps language-specific constructs to equivalent patterns</li>
              <li>• Generates syntactically correct code in the target language</li>
              <li>• Provides TODO comments where manual implementation is needed</li>
              <li>• Educational limit: Maximum 1000 lines for optimal learning</li>
              <li>• Best for learning syntax differences between languages</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-300 mt-4 text-sm">
              <strong>Note:</strong> Translated code provides a structural foundation but may need manual refinement 
              for complex logic, library-specific features, and optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTranslator;