import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSyntaxHelp } from './SyntaxHelper';

// Custom lighter dark theme for better readability
const lightDarkTheme = {
  'code[class*="language-"]': {
    color: '#f8f8f2',
    background: 'rgb(55, 65, 81)', // gray-700
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '1em',
    lineHeight: '1.5',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: 4,
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: '#f8f8f2',
    background: 'rgb(55, 65, 81)', // gray-700
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '1em',
    lineHeight: '1.5',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: 4,
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em'
  },
  token: {
    comment: { color: '#8292a2' },
    prolog: { color: '#8292a2' },
    doctype: { color: '#8292a2' },
    cdata: { color: '#8292a2' },
    punctuation: { color: '#f8f8f2' },
    namespace: { opacity: '.7' },
    property: { color: '#66d9ef' },
    tag: { color: '#f92672' },
    constant: { color: '#66d9ef' },
    symbol: { color: '#66d9ef' },
    deleted: { color: '#f92672' },
    boolean: { color: '#ae81ff' },
    number: { color: '#ae81ff' },
    selector: { color: '#a6e22e' },
    'attr-name': { color: '#a6e22e' },
    string: { color: '#e6db74' },
    char: { color: '#e6db74' },
    builtin: { color: '#a6e22e' },
    inserted: { color: '#a6e22e' },
    variable: { color: '#f8f8f2' },
    operator: { color: '#f92672' },
    entity: { color: '#f8f8f2', cursor: 'help' },
    url: { color: '#f8f8f2' },
    keyword: { color: '#f92672' },
    atrule: { color: '#e6db74' },
    'attr-value': { color: '#e6db74' },
    regex: { color: '#e6db74' },
    important: { color: '#f92672', fontWeight: 'bold' },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    function: { color: '#66d9ef' },
    'class-name': { color: '#a6e22e' }
  }
};

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
          className={`w-full h-full font-mono text-sm overflow-auto rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}
          onMouseLeave={hideTooltip}
        >
          {code ? (
            <SyntaxHighlighter
              language={getPrismLanguage(language)}
              style={isDark ? lightDarkTheme : prism}
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                minHeight: '100%',
                borderRadius: '0.5rem'
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
              {code}
            </SyntaxHighlighter>
          ) : (
            <div className={`flex items-center justify-center h-full ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="text-center">
                <div className="text-lg mb-2">📝</div>
                <div className="text-sm italic">{placeholder}</div>
              </div>
            </div>
          )}
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
        className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none placeholder-gray-500 dark:placeholder-gray-400"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default SimpleCodeEditor;