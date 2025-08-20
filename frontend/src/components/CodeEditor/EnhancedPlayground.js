import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PlayIcon, 
  ArrowDownTrayIcon,
  BookmarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  TrashIcon,
  CheckIcon,
  ClipboardIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShareIcon,
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MonacoCodeEditor from './MonacoCodeEditor';
import { SUPPORTED_LANGUAGES, getLanguageById, MONACO_THEMES, getExecutableLanguages } from './languageConfig';
import useResponsive from '../../hooks/useResponsive';
import axios from 'axios';

const EnhancedPlayground = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { isMobile, isTablet, isSmallScreen } = useResponsive();
  
  // Core state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState(isDarkMode ? 'vs-dark' : 'vs');
  const [fontSize, setFontSize] = useState(isMobile ? 12 : 14);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExecutionStats, setShowExecutionStats] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('editor'); // 'editor' | 'output'
  
  // Save/Load state
  const [savedCodes, setSavedCodes] = useState([]);
  const [currentCodeName, setCurrentCodeName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // History and stats
  const [executionHistory, setExecutionHistory] = useState([]);
  const [executionStats, setExecutionStats] = useState(null);
  
  // Refs
  const editorRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialize with default template
  useEffect(() => {
    const currentLanguage = getLanguageById(language);
    setCode(currentLanguage.defaultTemplate);
  }, [language]);

  // Update theme when dark mode changes
  useEffect(() => {
    setTheme(isDarkMode ? 'vs-dark' : 'vs');
  }, [isDarkMode]);

  // Load saved codes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('playground_saved_codes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  // Load execution history and stats
  useEffect(() => {
    if (user) {
      loadExecutionHistory();
      loadExecutionStats();
    }
  }, [user]);

  const loadExecutionHistory = async () => {
    try {
      const response = await axios.get('/api/code/history', {
        params: { limit: 10 }
      });
      if (response.data.success) {
        setExecutionHistory(response.data.data.executions);
      }
    } catch (error) {
      console.error('Failed to load execution history:', error);
    }
  };

  const loadExecutionStats = async () => {
    try {
      const response = await axios.get('/api/code/stats');
      if (response.data.success) {
        setExecutionStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load execution stats:', error);
    }
  };

  const runCode = useCallback(async () => {
    if (isExecuting) return;
    
    // Check if language is executable
    const currentLanguage = getLanguageById(language);
    if (!currentLanguage.executionSupported) {
      setOutput(`❌ Code execution not yet supported for ${currentLanguage.name}.\nExecutable languages: ${getExecutableLanguages().map(l => l.name).join(', ')}`);
      return;
    }

    setIsExecuting(true);
    setOutput('⏳ Executing code...');
    setExecutionTime(null);
    setMemoryUsage(null);

    // Cancel previous execution if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      const response = await axios.post('/api/code/execute', {
        code,
        language,
        input: ''
      }, {
        signal: abortControllerRef.current.signal,
        timeout: 30000 // 30 second timeout
      });

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (response.data.success) {
        const result = response.data.data;
        let outputText = '';
        
        if (result.output.stdout) {
          outputText += '📤 Output:\n' + result.output.stdout + '\n';
        }
        
        if (result.output.stderr) {
          outputText += '⚠️ Errors/Warnings:\n' + result.output.stderr + '\n';
        }
        
        if (!outputText) {
          outputText = '✅ Code executed successfully (no output)';
        }
        
        // Add execution metadata
        if (result.executionTime || result.memoryUsage) {
          outputText += '\n📊 Execution Info:\n';
          if (result.executionTime) outputText += `⏱️ Time: ${result.executionTime}ms\n`;
          if (result.memoryUsage) outputText += `💾 Memory: ${result.memoryUsage}KB\n`;
        }
        
        setOutput(outputText);
        setMemoryUsage(result.memoryUsage);
        
        // Update history
        loadExecutionHistory();
        loadExecutionStats();
      } else {
        setOutput(`❌ Execution failed:\n${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        setOutput('🛑 Execution cancelled');
      } else if (error.code === 'ECONNABORTED') {
        setOutput('⏰ Execution timed out (30 seconds limit)');
      } else {
        setOutput(`❌ Network error: ${error.message}\nPlease check your connection and try again.`);
      }
    } finally {
      setIsExecuting(false);
      abortControllerRef.current = null;
    }
  }, [code, language, isExecuting]);

  const cancelExecution = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const validateCode = async () => {
    try {
      const response = await axios.post('/api/code/validate', {
        code,
        language
      });
      
      if (response.data.success && response.data.data.valid) {
        setOutput('✅ Code syntax is valid');
      } else {
        setOutput('❌ Code validation errors:\n' + response.data.data.errors.join('\n'));
      }
    } catch (error) {
      setOutput(`❌ Validation error: ${error.message}`);
    }
  };

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

  const loadCode = (savedCode) => {
    setCode(savedCode.code);
    setLanguage(savedCode.language);
    setOutput('');
  };

  const deleteSavedCode = (id) => {
    const updatedCodes = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedCodes);
    localStorage.setItem('playground_saved_codes', JSON.stringify(updatedCodes));
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Failed to copy
    }
  };

  const shareCode = async () => {
    try {
      const shareData = {
        language,
        code,
        timestamp: new Date().toISOString()
      };
      const encoded = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/playground?share=${encoded}`;
      
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Failed to share
    }
  };

  const downloadCode = () => {
    const currentLanguage = getLanguageById(language);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_code.${currentLanguage.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (templateCode) => {
    setCode(templateCode);
    setOutput('');
    setShowTemplates(false);
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const currentLanguage = getLanguageById(language);
  const executableLanguages = getExecutableLanguages();
  
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
                🚀 Enhanced Playground
              </h1>
              {user && (
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, {user.firstName}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title="Settings"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowExecutionStats(!showExecutionStats)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title="Execution Stats"
              >
                <ChartBarIcon className="h-5 w-5" />
              </button>
              
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

          {/* Settings Panel */}
          {showSettings && (
            <div className={`mb-6 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-3">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    {Object.entries(MONACO_THEMES).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    {[10, 12, 14, 16, 18, 20, 24].map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Execution Stats Panel */}
          {showExecutionStats && executionStats && (
            <div className={`mb-6 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-3">📊 Execution Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{executionStats.totalExecutions || 0}</div>
                  <div className="text-sm text-gray-600">Total Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{executionStats.successfulExecutions || 0}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{executionStats.averageExecutionTime || 0}ms</div>
                  <div className="text-sm text-gray-600">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{executionStats.favoriteLanguage || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Top Language</div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile View Toggle */}
          {isSmallScreen && !isFullscreen && (
            <div className="flex mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMobileViewMode('editor')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mobileViewMode === 'editor'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                📝 Editor
              </button>
              <button
                onClick={() => setMobileViewMode('output')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mobileViewMode === 'output'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                📤 Output
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className={`grid ${
            isFullscreen 
              ? 'grid-cols-2 h-[calc(100vh-8rem)]' 
              : isSmallScreen
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-2'
          } gap-6`}>
            {/* Code Editor Section */}
            {(!isSmallScreen || mobileViewMode === 'editor' || isFullscreen) && (
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
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.icon} {lang.name} {!lang.executionSupported && '(View Only)'}
                      </option>
                    ))}
                  </select>
                  <span className={`text-xs px-2 py-1 rounded ${
                    currentLanguage.executionSupported 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentLanguage.executionSupported ? 'Executable' : 'View Only'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Templates"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={formatCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Format Code"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </button>
                  
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
                    onClick={shareCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Share Code"
                  >
                    <ShareIcon className="h-4 w-4" />
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
              
              {/* Templates Panel */}
              {showTemplates && (
                <div className={`mb-4 p-3 border rounded-md ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => loadTemplate(currentLanguage.defaultTemplate)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Default Template
                    </button>
                  </div>
                </div>
              )}
              
              {/* Monaco Code Editor */}
              <div className="relative">
                <MonacoCodeEditor
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  language={language}
                  theme={theme}
                  height={isFullscreen ? 'calc(100vh - 20rem)' : '400px'}
                  options={{
                    fontSize: fontSize,
                    readOnly: false
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              </div>
              
              {/* Editor Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isExecuting}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-colors ${
                      isExecuting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                  </button>
                  
                  {isExecuting && (
                    <button
                      onClick={cancelExecution}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                  
                  <button
                    onClick={validateCode}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Validate
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
                
                <div className="flex items-center space-x-4">
                  {executionTime && (
                    <div className={`flex items-center space-x-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ClockIcon className="h-4 w-4" />
                      <span>{executionTime}ms</span>
                    </div>
                  )}
                  
                  {memoryUsage && (
                    <div className={`flex items-center space-x-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <CpuChipIcon className="h-4 w-4" />
                      <span>{memoryUsage}KB</span>
                    </div>
                  )}
                  
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Lines: {code.split('\n').length} | Characters: {code.length}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Output Section */}
            {(!isSmallScreen || mobileViewMode === 'output' || isFullscreen) && (
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
                  <div className="text-gray-500">
                    {currentLanguage.executionSupported 
                      ? 'Click "Run Code" to see output here...' 
                      : `${currentLanguage.name} execution not yet supported. Available languages: ${executableLanguages.map(l => l.name).join(', ')}`
                    }
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Saved Codes Section */}
          {!isFullscreen && savedCodes.length > 0 && (
            <div className={`mt-8 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                💾 Saved Codes
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
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getLanguageById(savedCode.language).icon} {getLanguageById(savedCode.language).name} • {new Date(savedCode.createdAt).toLocaleDateString()}
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
                ✨ Enhanced Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    🎨 Monaco Editor
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professional code editor with IntelliSense
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    🚀 {executableLanguages.length}+ Languages
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Multiple programming languages supported
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    📊 Real-time Stats
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Execution time and memory usage tracking
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    🔒 Secure Execution
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sandboxed Docker container execution
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
              💾 Save Code
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

export default EnhancedPlayground;