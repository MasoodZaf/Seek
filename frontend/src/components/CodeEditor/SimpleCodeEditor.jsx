import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSyntaxHelp } from './SyntaxHelper';

const SimpleCodeEditor = ({ 
  code, 
  onChange, 
  language = 'javascript', 
  placeholder = 'Enter your code here...', 
  className = '',
  readOnly = false,
  isDark = false
}) => {
  const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 });
  const textareaRef = useRef(null);

  // Map language names to Prism language identifiers
  const getPrismLanguage = (lang) => {
    const languageMap = {
      'javascript': 'javascript',
      'typescript': 'typescript', 
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    return languageMap[lang] || 'javascript';
  };

  // Handle word hover for tooltips
  const handleWordHover = (event) => {
    if (readOnly) {
      const word = event.target.textContent;
      if (word && word.trim().length > 1) {
        const helpData = getSyntaxHelp(language, word.trim());
        
        if (helpData) {
          const rect = event.target.getBoundingClientRect();
          setTooltip({
            show: true,
            content: helpData,
            x: rect.left,
            y: rect.top - 10
          });
        }
      }
    }
  };

  // Hide tooltip
  const hideTooltip = () => {
    setTooltip({ show: false, content: null, x: 0, y: 0 });
  };

  if (readOnly) {
    // Read-only version with hover tooltips
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div 
          className="w-full h-full p-4 font-mono text-sm overflow-auto"
          onMouseLeave={hideTooltip}
        >
          <SyntaxHighlighter
            language={getPrismLanguage(language)}
            style={isDark ? tomorrow : prism}
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              minHeight: '100%'
            }}
            codeTagProps={{
              style: {
                fontSize: 'inherit',
                lineHeight: 'inherit'
              },
              onMouseOver: handleWordHover,
              onMouseOut: hideTooltip
            }}
            wrapLines={true}
            lineProps={(_lineNumber) => ({
              style: { display: 'block', width: 'fit-content' },
              onMouseOver: handleWordHover,
              onMouseOut: hideTooltip
            })}
          >
            {code || placeholder}
          </SyntaxHighlighter>
        </div>

        {/* Tooltip */}
        {tooltip.show && tooltip.content && (
          <div
            className="fixed z-50 max-w-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-3"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">
                {tooltip.content.category === 'keyword' ? '🔑' : '⚡'}
              </span>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {tooltip.content.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                tooltip.content.category === 'keyword' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                {tooltip.content.category}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              {tooltip.content.description}
            </p>
            <div className="text-xs">
              <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Syntax:</div>
              <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                {tooltip.content.syntax}
              </code>
            </div>
            {tooltip.content.example && (
              <div className="text-xs mt-2">
                <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Example:</div>
                <code className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs whitespace-pre-wrap">
                  {tooltip.content.example}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Editable version (simple textarea)
  return (
    <div className={`relative w-full h-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default SimpleCodeEditor;