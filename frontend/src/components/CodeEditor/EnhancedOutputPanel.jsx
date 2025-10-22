import React, { useState, useEffect, useRef } from 'react';
import { 
  TrashIcon, 
  ClipboardIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const EnhancedOutputPanel = ({ 
  output, 
  onClear, 
  height = 'h-80',
  language = 'text',
  executionTime,
  memoryUsage,
  isExecuting = false,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [outputFormat, setOutputFormat] = useState('formatted'); // 'raw', 'formatted', 'json'
  const outputRef = useRef(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current && !isExecuting) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isExecuting]);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy output:', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseOutput = (rawOutput) => {
    if (!rawOutput) return { sections: [], hasErrors: false, hasWarnings: false };

    const lines = rawOutput.split('\n');
    const sections = [];
    let currentSection = null;
    let hasErrors = false;
    let hasWarnings = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Detect different types of output
      if (trimmedLine.startsWith('📤 Output:')) {
        currentSection = { type: 'output', title: 'Output', lines: [], icon: InformationCircleIcon };
        sections.push(currentSection);
      } else if (trimmedLine.startsWith('⚠️ Errors/Warnings:')) {
        currentSection = { type: 'warning', title: 'Warnings', lines: [], icon: ExclamationTriangleIcon };
        sections.push(currentSection);
        hasWarnings = true;
      } else if (trimmedLine.startsWith('❌')) {
        currentSection = { type: 'error', title: 'Error', lines: [], icon: XCircleIcon };
        sections.push(currentSection);
        hasErrors = true;
      } else if (trimmedLine.startsWith('✅')) {
        currentSection = { type: 'success', title: 'Success', lines: [], icon: CheckCircleIcon };
        sections.push(currentSection);
      } else if (trimmedLine.startsWith('📊 Execution Info:')) {
        currentSection = { type: 'info', title: 'Execution Info', lines: [], icon: InformationCircleIcon };
        sections.push(currentSection);
      } else if (currentSection && trimmedLine) {
        currentSection.lines.push(line);
      } else if (!currentSection && trimmedLine) {
        // Default section for unformatted output
        if (sections.length === 0) {
          currentSection = { type: 'output', title: 'Output', lines: [], icon: InformationCircleIcon };
          sections.push(currentSection);
        }
        if (currentSection) {
          currentSection.lines.push(line);
        }
      }
    });

    return { sections, hasErrors, hasWarnings };
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
  };

  const formatOutput = (rawOutput) => {
    if (outputFormat === 'raw') return rawOutput;
    
    if (outputFormat === 'json') {
      try {
        const parsed = JSON.parse(rawOutput);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return rawOutput;
      }
    }

    // Default formatted output
    return rawOutput;
  };

  const { sections, hasErrors, hasWarnings } = parseOutput(output);
  const formattedOutput = formatOutput(output);

  const getSectionColor = (type) => {
    switch (type) {
      case 'error':
        return isDarkMode ? 'text-red-400 border-red-500' : 'text-red-600 border-red-400';
      case 'warning':
        return isDarkMode ? 'text-yellow-400 border-yellow-500' : 'text-yellow-600 border-yellow-400';
      case 'success':
        return isDarkMode ? 'text-green-400 border-green-500' : 'text-green-600 border-green-400';
      case 'info':
        return isDarkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-400';
      default:
        return isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Output
          </h2>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {hasErrors && (
              <div className="flex items-center space-x-1 text-red-500">
                <XCircleIcon className="h-4 w-4" />
                <span className="text-xs">Errors</span>
              </div>
            )}
            {hasWarnings && (
              <div className="flex items-center space-x-1 text-yellow-500">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span className="text-xs">Warnings</span>
              </div>
            )}
            {!hasErrors && !hasWarnings && output && (
              <div className="flex items-center space-x-1 text-green-500">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-xs">Success</span>
              </div>
            )}
          </div>

          {/* Execution metrics */}
          {(executionTime || memoryUsage) && (
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {executionTime && (
                <span>⏱️ {executionTime}ms</span>
              )}
              {memoryUsage && (
                <span>💾 {memoryUsage}KB</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              showSearch
                ? 'bg-blue-600 text-white'
                : isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Search in output"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </button>

          {/* Format toggle */}
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className={`px-2 py-1 text-xs border rounded ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="formatted">Formatted</option>
            <option value="raw">Raw</option>
            <option value="json">JSON</option>
          </select>
          
          {/* Copy button */}
          <button
            onClick={copyOutput}
            disabled={!output}
            className={`p-2 rounded-lg transition-colors ${
              copySuccess
                ? 'bg-green-600 text-white'
                : isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300 disabled:text-gray-600' 
                  : 'hover:bg-gray-200 text-gray-600 disabled:text-gray-400'
            }`}
            title="Copy output"
          >
            {copySuccess ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
          </button>

          {/* Download button */}
          <button
            onClick={downloadOutput}
            disabled={!output}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300 disabled:text-gray-600' 
                : 'hover:bg-gray-200 text-gray-600 disabled:text-gray-400'
            }`}
            title="Download output"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
          
          {/* Clear button */}
          <button
            onClick={onClear}
            disabled={!output}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300 disabled:text-gray-600' 
                : 'hover:bg-gray-200 text-gray-600 disabled:text-gray-400'
            }`}
            title="Clear output"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in output..."
            className={`w-full px-3 py-2 text-sm border rounded-md ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      )}
      
      {/* Output content */}
      <div 
        ref={outputRef}
        className={`${height} p-4 overflow-auto font-mono text-sm ${
          isDarkMode 
            ? 'bg-gray-900 text-green-400' 
            : 'bg-gray-900 text-green-400'
        }`}
      >
        {isExecuting ? (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
            <span>Executing code...</span>
          </div>
        ) : output ? (
          outputFormat === 'formatted' && sections.length > 0 ? (
            // Formatted output with sections
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className={`border-l-4 pl-4 ${getSectionColor(section.type)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <section.icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{section.title}</span>
                  </div>
                  <div className="space-y-1">
                    {section.lines.map((line, lineIndex) => (
                      <div 
                        key={lineIndex}
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSearchTerm(line) 
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Raw or JSON output
            <pre 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: highlightSearchTerm(formattedOutput) 
              }}
            />
          )
        ) : (
          <div className="text-gray-500 text-center py-8">
            <InformationCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Click "Run Code" to see output here...</p>
          </div>
        )}
      </div>

      {/* Footer with additional info */}
      {output && (
        <div className={`px-4 py-2 text-xs border-t ${
          isDarkMode 
            ? 'border-gray-700 text-gray-400 bg-gray-800' 
            : 'border-gray-200 text-gray-500 bg-gray-50'
        }`}>
          <div className="flex justify-between items-center">
            <span>
              Lines: {output.split('\n').length} | Characters: {output.length}
            </span>
            <span>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOutputPanel;