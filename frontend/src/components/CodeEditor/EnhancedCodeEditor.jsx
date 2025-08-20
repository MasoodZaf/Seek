import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSyntaxHelp, extractTokens } from './SyntaxHelper';
import SyntaxTooltip from './SyntaxTooltip';

const EnhancedCodeEditor = ({ 
  code, 
  onChange, 
  language = 'javascript', 
  placeholder = 'Enter your code here...', 
  className = '',
  readOnly = false,
  showLineNumbers = true,
  isDark = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredToken, setHoveredToken] = useState(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const highlightRef = useRef(null);

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

  // Handle mouse move over the highlighted code
  const handleMouseMove = useCallback((event) => {
    if (readOnly) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Get the character position from coordinates
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Simple token detection - in a real implementation you'd want more sophisticated parsing
    const lines = code.split('\n');
    
    // Estimate line and character position (simplified)
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const charWidth = 8; // Approximate character width in monospace
    
    const lineIndex = Math.floor(y / lineHeight);
    const charIndex = Math.floor(x / charWidth);
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      const wordStart = findWordStart(line, charIndex);
      const wordEnd = findWordEnd(line, charIndex);
      const word = line.substring(wordStart, wordEnd);
      
      if (word && word.length > 1) {
        const helpData = getSyntaxHelp(language, word);
        
        if (helpData && word !== hoveredToken) {
          setHoveredToken(word);
          setTooltipData(helpData);
          setTooltipPosition({ 
            x: rect.left + (wordStart * charWidth), 
            y: rect.top + (lineIndex * lineHeight) 
          });
          setShowTooltip(true);
        } else if (!helpData && showTooltip) {
          setShowTooltip(false);
          setHoveredToken(null);
        }
      } else if (showTooltip) {
        setShowTooltip(false);
        setHoveredToken(null);
      }
    }
  }, [code, language, hoveredToken, showTooltip, readOnly]);

  // Find word boundaries
  const findWordStart = (line, index) => {
    let start = index;
    while (start > 0 && /\w/.test(line[start - 1])) {
      start--;
    }
    return start;
  };

  const findWordEnd = (line, index) => {
    let end = index;
    while (end < line.length && /\w/.test(line[end])) {
      end++;
    }
    return end;
  };

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
    setHoveredToken(null);
  }, []);

  // Handle textarea scroll to sync with highlighting
  const handleScroll = useCallback(() => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle input change
  const handleChange = useCallback((event) => {
    if (onChange && !readOnly) {
      onChange(event.target.value);
    }
  }, [onChange, readOnly]);

  // Sync scroll between textarea and highlighting
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const editorStyle = `
    w-full h-full p-4 font-mono text-sm resize-none 
    bg-transparent text-transparent caret-gray-900 dark:caret-white
    border-0 outline-none relative z-10
    ${className}
  `;

  const highlightStyle = `
    absolute top-0 left-0 w-full h-full p-4 font-mono text-sm
    pointer-events-none overflow-hidden
    ${readOnly ? 'pointer-events-auto' : ''}
  `;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Syntax highlighted background */}
      <div 
        ref={highlightRef}
        className={highlightStyle}
        onMouseMove={readOnly ? undefined : handleMouseMove}
        onMouseLeave={readOnly ? undefined : handleMouseLeave}
        style={{ 
          pointerEvents: readOnly ? 'auto' : 'none',
          cursor: readOnly ? 'default' : 'text'
        }}
      >
        <SyntaxHighlighter
          language={getPrismLanguage(language)}
          style={isDark ? tomorrow : prism}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
          codeTagProps={{
            style: {
              fontSize: 'inherit',
              lineHeight: 'inherit'
            }
          }}
        >
          {code || ' '}
        </SyntaxHighlighter>
      </div>

      {/* Input textarea (invisible but functional) */}
      {!readOnly && (
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          placeholder={placeholder}
          className={editorStyle}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            resize: 'none',
            whiteSpace: 'pre',
            wordWrap: 'break-word'
          }}
        />
      )}

      {/* Syntax help tooltip */}
      <SyntaxTooltip
        helpData={tooltipData}
        position={tooltipPosition}
        isVisible={showTooltip}
      />
    </div>
  );
};

export default EnhancedCodeEditor;