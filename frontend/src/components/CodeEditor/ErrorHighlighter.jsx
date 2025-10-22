import React, { useEffect, useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  LightBulbIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ErrorHighlighter = ({ 
  errors = [], 
  warnings = [], 
  suggestions = [],
  onErrorClick,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('errors');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getErrorSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return isDarkMode ? 'text-red-400 bg-red-900/20 border-red-500' : 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return isDarkMode ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return isDarkMode ? 'text-blue-400 bg-blue-900/20 border-blue-500' : 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-900/20 border-gray-500' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getErrorIcon = (severity) => {
    switch (severity) {
      case 'error':
        return XCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'info':
        return InformationCircleIcon;
      default:
        return CodeBracketIcon;
    }
  };

  const formatErrorMessage = (message) => {
    // Enhanced error message formatting with helpful suggestions
    const commonErrors = {
      'SyntaxError': {
        suggestion: 'Check for missing brackets, semicolons, or quotes',
        icon: CodeBracketIcon
      },
      'ReferenceError': {
        suggestion: 'Variable might not be declared or is out of scope',
        icon: ExclamationTriangleIcon
      },
      'TypeError': {
        suggestion: 'Check data types and method calls',
        icon: InformationCircleIcon
      },
      'RangeError': {
        suggestion: 'Value is outside the valid range',
        icon: ExclamationTriangleIcon
      }
    };

    const errorType = Object.keys(commonErrors).find(type => message.includes(type));
    return {
      message,
      suggestion: errorType ? commonErrors[errorType].suggestion : null,
      icon: errorType ? commonErrors[errorType].icon : CodeBracketIcon
    };
  };

  const renderErrorItem = (item, index, type) => {
    const id = `${type}-${index}`;
    const isExpanded = expandedItems.has(id);
    const Icon = getErrorIcon(item.severity || type);
    const formattedError = formatErrorMessage(item.message);

    return (
      <div
        key={id}
        className={`border rounded-lg p-3 mb-2 transition-all duration-200 ${
          getErrorSeverityColor(item.severity || type)
        }`}
      >
        <div 
          className="flex items-start space-x-3 cursor-pointer"
          onClick={() => {
            toggleExpanded(id);
            if (onErrorClick && item.line) {
              onErrorClick(item.line, item.column);
            }
          }}
        >
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">
                {formattedError.message}
              </p>
              {(item.line || item.column) && (
                <span className="text-xs opacity-75 ml-2">
                  Line {item.line}{item.column ? `:${item.column}` : ''}
                </span>
              )}
            </div>
            
            {isExpanded && (
              <div className="mt-2 space-y-2">
                {item.details && (
                  <p className="text-xs opacity-80">
                    {item.details}
                  </p>
                )}
                
                {formattedError.suggestion && (
                  <div className="flex items-start space-x-2 p-2 rounded bg-black bg-opacity-10">
                    <LightBulbIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs">
                      <span className="font-medium">Suggestion:</span> {formattedError.suggestion}
                    </p>
                  </div>
                )}
                
                {item.code && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Code:</p>
                    <pre className="text-xs bg-black bg-opacity-20 p-2 rounded overflow-x-auto">
                      {item.code}
                    </pre>
                  </div>
                )}
                
                {item.fix && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Suggested Fix:</p>
                    <pre className="text-xs bg-green-900 bg-opacity-20 p-2 rounded overflow-x-auto">
                      {item.fix}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'errors', label: 'Errors', count: errors.length, color: 'text-red-500' },
    { id: 'warnings', label: 'Warnings', count: warnings.length, color: 'text-yellow-500' },
    { id: 'suggestions', label: 'Suggestions', count: suggestions.length, color: 'text-blue-500' }
  ];

  const hasAnyIssues = errors.length > 0 || warnings.length > 0 || suggestions.length > 0;

  if (!hasAnyIssues) return null;

  return (
    <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      {/* Header with tabs */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-white border-b-2 border-blue-400'
                    : 'bg-gray-50 text-gray-900 border-b-2 border-blue-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${tab.color} bg-current bg-opacity-20`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'errors' && (
          <div>
            {errors.length > 0 ? (
              errors.map((error, index) => renderErrorItem(error, index, 'error'))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <XCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No errors found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'warnings' && (
          <div>
            {warnings.length > 0 ? (
              warnings.map((warning, index) => renderErrorItem(warning, index, 'warning'))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No warnings found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => renderErrorItem(suggestion, index, 'info'))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <LightBulbIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for parsing errors from output
export const useErrorParser = () => {
  const parseErrors = (output) => {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!output) return { errors, warnings, suggestions };

    const lines = output.split('\n');
    
    lines.forEach((line, index) => {
      // Parse JavaScript errors
      if (line.includes('SyntaxError') || line.includes('ReferenceError') || line.includes('TypeError')) {
        const match = line.match(/(\w+Error): (.+)/);
        if (match) {
          errors.push({
            message: match[0],
            details: match[2],
            severity: 'error',
            line: extractLineNumber(line),
            column: extractColumnNumber(line)
          });
        }
      }
      
      // Parse warnings
      if (line.includes('Warning:') || line.includes('⚠️')) {
        warnings.push({
          message: line.replace(/^⚠️\s*/, ''),
          severity: 'warning',
          line: extractLineNumber(line)
        });
      }
      
      // Parse compilation errors
      if (line.includes('error:') && line.includes('line')) {
        const match = line.match(/line (\d+)/);
        errors.push({
          message: line,
          severity: 'error',
          line: match ? parseInt(match[1]) : null
        });
      }
    });

    return { errors, warnings, suggestions };
  };

  const extractLineNumber = (text) => {
    const match = text.match(/line (\d+)|:(\d+):/);
    return match ? parseInt(match[1] || match[2]) : null;
  };

  const extractColumnNumber = (text) => {
    const match = text.match(/:(\d+):(\d+)/);
    return match ? parseInt(match[2]) : null;
  };

  return { parseErrors };
};

export default ErrorHighlighter;