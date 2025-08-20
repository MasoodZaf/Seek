import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import {
  PlusIcon,
  MinusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlayIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui';

const MobileCodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  height = '400px',
  placeholder = 'Start coding...',
  onRun,
  className = '',
  ...props
}) => {
  const [code, setCode] = useState(value);
  const [fontSize, setFontSize] = useState(14);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showGestureHints, setShowGestureHints] = useState(true);
  
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Common programming shortcuts and templates
  const shortcuts = {
    javascript: [
      { key: 'func', template: 'function functionName() {\n  \n}', cursor: 21 },
      { key: 'if', template: 'if (condition) {\n  \n}', cursor: 4 },
      { key: 'for', template: 'for (let i = 0; i < length; i++) {\n  \n}', cursor: 13 },
      { key: 'log', template: 'console.log();', cursor: 12 },
      { key: 'const', template: 'const variable = ;', cursor: 15 },
      { key: 'let', template: 'let variable = ;', cursor: 13 },
    ],
    python: [
      { key: 'def', template: 'def function_name():\n    pass', cursor: 4 },
      { key: 'if', template: 'if condition:\n    pass', cursor: 3 },
      { key: 'for', template: 'for item in items:\n    pass', cursor: 8 },
      { key: 'print', template: 'print()', cursor: 6 },
      { key: 'class', template: 'class ClassName:\n    pass', cursor: 6 },
    ],
    java: [
      { key: 'main', template: 'public static void main(String[] args) {\n    \n}', cursor: 44 },
      { key: 'sout', template: 'System.out.println();', cursor: 19 },
      { key: 'if', template: 'if (condition) {\n    \n}', cursor: 4 },
      { key: 'for', template: 'for (int i = 0; i < length; i++) {\n    \n}', cursor: 17 },
    ]
  };

  // Spring animation for fullscreen toggle
  const fullscreenSpring = useSpring({
    transform: isFullscreen ? 'scale(1)' : 'scale(0.95)',
    opacity: isFullscreen ? 1 : 0.95,
    config: config.gentle
  });

  // Gesture handling for swipe actions and pinch to zoom
  const bind = useGesture({
    onPinch: ({ offset: [scale], memo }) => {
      const newFontSize = Math.max(10, Math.min(24, 14 * scale));
      setFontSize(newFontSize);
      return memo;
    },
    onWheel: ({ delta: [, dy], ctrlKey }) => {
      if (ctrlKey) {
        // Zoom with Ctrl + scroll
        const newFontSize = Math.max(10, Math.min(24, fontSize - dy * 0.1));
        setFontSize(newFontSize);
      }
    },
    onSwipe: ({ direction: [dx, dy], velocity: [vx, vy] }) => {
      // Swipe gestures for quick actions
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && vx > 0.5) {
          // Swipe right - redo
          redo();
        } else if (dx < 0 && vx < -0.5) {
          // Swipe left - undo
          undo();
        }
      } else {
        if (dy > 0 && vy > 0.5) {
          // Swipe down - show keyboard helpers
          setIsKeyboardVisible(true);
        } else if (dy < 0 && vy < -0.5) {
          // Swipe up - hide keyboard helpers
          setIsKeyboardVisible(false);
        }
      }
    }
  });

  useEffect(() => {
    setCode(value);
  }, [value]);

  useEffect(() => {
    // Hide gesture hints after 5 seconds
    const timer = setTimeout(() => setShowGestureHints(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const updateCode = useCallback((newCode) => {
    setCode(newCode);
    onChange?.(newCode);
    
    // Add to history
    if (newCode !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newCode);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [onChange, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newCode = history[newIndex];
      setCode(newCode);
      onChange?.(newCode);
    }
  }, [historyIndex, history, onChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newCode = history[newIndex];
      setCode(newCode);
      onChange?.(newCode);
    }
  }, [historyIndex, history, onChange]);

  const insertTemplate = useCallback((template, cursorOffset = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + template + code.substring(end);
    
    updateCode(newCode);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  }, [code, updateCode]);

  const insertText = useCallback((text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + text + code.substring(end);
    
    updateCode(newCode);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [code, updateCode]);

  const handleTextareaChange = useCallback((e) => {
    const newCode = e.target.value;
    updateCode(newCode);
    
    // Update cursor position
    const textarea = e.target;
    const lines = newCode.substring(0, textarea.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  }, [updateCode]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullscreen]);

  const getLines = useCallback(() => {
    return code.split('\n');
  }, [code]);

  const currentShortcuts = shortcuts[language] || shortcuts.javascript;

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Gesture Hints Overlay */}
      {showGestureHints && (
        <div className="absolute top-2 left-2 right-2 bg-primary-600 text-white p-2 rounded-lg text-xs z-10">
          <div className="flex items-center justify-between">
            <span>📱 Pinch to zoom • Swipe ← → to undo/redo</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGestureHints(false)}
              className="text-white p-1"
            >
              <XMarkIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Toolbar */}
      <div className="bg-secondary-100 border-b border-secondary-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            disabled={fontSize <= 10}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-mono">{fontSize}px</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 1))}
            disabled={fontSize >= 24}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
          >
            {showLineNumbers ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </Button>
          {onRun && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRun(code)}
            >
              <PlayIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <animated.div
        {...bind()}
        style={fullscreenSpring}
        className="relative flex-1 overflow-hidden touch-pan-x touch-pan-y"
        ref={editorRef}
      >
        <div className="relative h-full flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div
              className="bg-secondary-50 text-secondary-400 text-right pr-3 py-3 font-mono select-none border-r border-secondary-200"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
            >
              {getLines().map((_, index) => (
                <div key={index} className="whitespace-nowrap">
                  {index + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code Editor */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className={`
              flex-1 p-3 bg-white font-mono resize-none border-none outline-none overflow-auto
              ${theme === 'dark' ? 'bg-secondary-900 text-secondary-100' : 'bg-white text-secondary-900'}
              ${readOnly ? 'cursor-default' : 'cursor-text'}
            `}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
              height: '100%',
              minHeight: isFullscreen ? '100vh' : height,
              tabSize: 2,
              WebkitAppearance: 'none',
              WebkitTouchCallout: 'none'
            }}
            {...props}
          />
        </div>
      </animated.div>

      {/* Mobile Keyboard Helper */}
      <div className="bg-secondary-50 border-t border-secondary-200 p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-secondary-600">
            Line {cursorPosition.line}, Column {cursorPosition.column}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
          >
            <Bars3Icon className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Insert Buttons */}
        {isKeyboardVisible && (
          <div className="space-y-2">
            {/* Common Characters */}
            <div className="flex flex-wrap gap-1">
              {['()', '[]', '{}', ';', ':', '"', "'", '=', '+', '-', '*', '/', '%', '&', '|', '!'].map((char) => (
                <Button
                  key={char}
                  variant="ghost"
                  size="sm"
                  onClick={() => insertText(char)}
                  className="min-w-[32px] h-8 p-1 text-xs font-mono"
                >
                  {char}
                </Button>
              ))}
            </div>

            {/* Language-specific Templates */}
            <div className="flex flex-wrap gap-1">
              {currentShortcuts.map((shortcut) => (
                <Button
                  key={shortcut.key}
                  variant="secondary"
                  size="sm"
                  onClick={() => insertTemplate(shortcut.template, shortcut.cursor)}
                  className="text-xs"
                >
                  {shortcut.key}
                </Button>
              ))}
            </div>

            {/* Indentation and Navigation */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('  ')} // 2 spaces
                className="text-xs"
              >
                Indent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText('\n')}
                className="text-xs"
              >
                New Line
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(0, 0);
                  }
                }}
                className="text-xs"
              >
                Start
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(code.length, code.length);
                  }
                }}
                className="text-xs"
              >
                End
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCodeEditor;