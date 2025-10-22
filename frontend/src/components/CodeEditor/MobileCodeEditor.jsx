import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon,
  KeyboardIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  DocumentTextIcon,
  ClipboardIcon,
  ShareIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import MonacoCodeEditor from './MonacoCodeEditor';
import { getLanguageById } from './languageConfig';
import TouchButton from '../ui/TouchButton';
import { hapticFeedback, useGestures } from '../../utils/touchInteractions';

const MobileCodeEditor = ({
  value,
  onChange,
  language,
  onExecute,
  isExecuting,
  theme,
  fontSize = 14,
  className = '',
  onShare,
  onSave,
  readOnly = false
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboardHelper, setShowKeyboardHelper] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectedText, setSelectedText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Mobile-specific editor options
  const mobileOptions = {
    fontSize: currentFontSize,
    fontFamily: 'JetBrains Mono, SF Mono, Consolas, monospace',
    lineHeight: 1.8, // Increased for better touch targets
    minimap: { enabled: false }, // Disabled for mobile
    scrollBeyondLastLine: false,
    wordWrap: wordWrap ? 'on' : 'off',
    lineNumbers: showLineNumbers ? 'on' : 'off',
    renderLineHighlight: 'all',
    contextmenu: false, // Disabled for mobile
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    readOnly: readOnly,
    
    // Touch-friendly settings
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    
    // Mobile scrolling
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: false,
      verticalScrollbarSize: 24, // Larger for touch
      horizontalScrollbarSize: 24,
      alwaysConsumeMouseWheel: false
    },
    
    // Enhanced touch support
    multiCursorModifier: 'ctrlCmd',
    wordBasedSuggestions: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    
    // Simplified suggestions for mobile
    suggest: {
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showKeywords: true,
      maxVisibleSuggestions: 6, // Reduced for mobile
      insertMode: 'replace',
      filterGraceful: true,
      snippetsPreventQuickSuggestions: false
    },
    
    // Mobile-friendly find
    find: {
      seedSearchStringFromSelection: 'always',
      autoFindInSelection: 'never'
    },
    
    // Better mobile performance
    renderValidationDecorations: 'on',
    renderWhitespace: 'none',
    occurrencesHighlight: false,
    selectionHighlight: false,
    codeLens: false,
    
    // Touch gestures
    dragAndDrop: false, // Disabled for mobile
    links: false, // Disabled to prevent accidental navigation
    
    // Accessibility
    accessibilitySupport: 'auto',
    ariaLabel: 'Mobile Code Editor'
  };

  // Common code snippets for mobile
  const quickSnippets = {
    javascript: [
      { label: 'console.log', code: 'console.log();', cursor: -2 },
      { label: 'function', code: 'function name() {\n  \n}', cursor: -3 },
      { label: 'if statement', code: 'if (condition) {\n  \n}', cursor: -3 },
      { label: 'for loop', code: 'for (let i = 0; i < length; i++) {\n  \n}', cursor: -3 },
      { label: 'arrow function', code: 'const name = () => {\n  \n};', cursor: -4 },
      { label: 'try-catch', code: 'try {\n  \n} catch (error) {\n  console.error(error);\n}', cursor: -25 }
    ],
    python: [
      { label: 'print', code: 'print()', cursor: -1 },
      { label: 'def function', code: 'def name():\n    pass', cursor: -4 },
      { label: 'if statement', code: 'if condition:\n    pass', cursor: -4 },
      { label: 'for loop', code: 'for item in items:\n    pass', cursor: -4 },
      { label: 'class', code: 'class Name:\n    def __init__(self):\n        pass', cursor: -4 },
      { label: 'try-except', code: 'try:\n    pass\nexcept Exception as e:\n    print(e)', cursor: -25 }
    ],
    java: [
      { label: 'System.out.println', code: 'System.out.println();', cursor: -2 },
      { label: 'method', code: 'public void methodName() {\n    \n}', cursor: -3 },
      { label: 'if statement', code: 'if (condition) {\n    \n}', cursor: -3 },
      { label: 'for loop', code: 'for (int i = 0; i < length; i++) {\n    \n}', cursor: -3 },
      { label: 'try-catch', code: 'try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}', cursor: -35 }
    ]
  };

  // Virtual keyboard helper buttons
  const keyboardHelpers = [
    { label: '()', code: '()', cursor: -1 },
    { label: '{}', code: '{}', cursor: -1 },
    { label: '[]', code: '[]', cursor: -1 },
    { label: '""', code: '""', cursor: -1 },
    { label: "''", code: "''", cursor: -1 },
    { label: ';', code: ';', cursor: 0 },
    { label: ':', code: ':', cursor: 0 },
    { label: '=>', code: ' => ', cursor: 0 },
    { label: '===', code: ' === ', cursor: 0 },
    { label: '!==', code: ' !== ', cursor: 0 },
    { label: '&&', code: ' && ', cursor: 0 },
    { label: '||', code: ' || ', cursor: 0 }
  ];

  const insertText = (text, cursorOffset = 0) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || editor.getModel().getFullModelRange();
      
      editor.executeEdits('mobile-insert', [{
        range: range,
        text: text
      }]);
      
      // Position cursor
      if (cursorOffset !== 0) {
        const position = editor.getPosition();
        const newPosition = {
          lineNumber: position.lineNumber,
          column: position.column + cursorOffset
        };
        editor.setPosition(newPosition);
      }
      
      editor.focus();
    }
  };

  const insertSnippet = (snippet) => {
    insertText(snippet.code, snippet.cursor);
    setShowQuickActions(false);
  };

  const moveCursor = (direction) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const position = editor.getPosition();
    let newPosition = { ...position };
    
    switch (direction) {
      case 'up':
        newPosition.lineNumber = Math.max(1, position.lineNumber - 1);
        break;
      case 'down':
        newPosition.lineNumber = position.lineNumber + 1;
        break;
      case 'left':
        if (position.column > 1) {
          newPosition.column = position.column - 1;
        } else if (position.lineNumber > 1) {
          newPosition.lineNumber = position.lineNumber - 1;
          const line = editor.getModel().getLineContent(newPosition.lineNumber);
          newPosition.column = line.length + 1;
        }
        break;
      case 'right':
        const currentLine = editor.getModel().getLineContent(position.lineNumber);
        if (position.column <= currentLine.length) {
          newPosition.column = position.column + 1;
        } else {
          newPosition.lineNumber = position.lineNumber + 1;
          newPosition.column = 1;
        }
        break;
    }
    
    editor.setPosition(newPosition);
    editor.focus();
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });
    
    // Track selection
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getModel().getValueInRange(e.selection);
      setSelectedText(selection);
    });
    
    // Mobile-specific event handlers
    const domNode = editor.getDomNode();
    if (domNode) {
      // Prevent zoom on double tap
      domNode.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      });
      
      // Handle touch gestures
      let lastTouchEnd = 0;
      domNode.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      
      // Add pinch-to-zoom for font size
      let initialDistance = 0;
      let initialFontSize = currentFontSize;
      
      domNode.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          initialDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          initialFontSize = currentFontSize;
        }
      });
      
      domNode.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const distance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          
          const scale = distance / initialDistance;
          const newFontSize = Math.max(10, Math.min(24, initialFontSize * scale));
          
          if (Math.abs(newFontSize - currentFontSize) > 0.5) {
            setCurrentFontSize(Math.round(newFontSize));
            hapticFeedback.selection();
          }
        }
      });
    }
    
    // Add keyboard shortcuts for mobile
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      setShowKeyboardHelper(!showKeyboardHelper);
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      setShowQuickActions(!showQuickActions);
    });
    
    // Auto-save functionality
    let saveTimeout;
    editor.onDidChangeModelContent(() => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        onSave?.(value);
      }, 2000); // Auto-save after 2 seconds of inactivity
    });
  };

  const findNext = () => {
    if (!editorRef.current || !findText) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('actions.find');
    if (action) {
      action.run();
    }
  };

  const replaceNext = () => {
    if (!editorRef.current || !findText || !replaceText) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('editor.action.startFindReplaceAction');
    if (action) {
      action.run();
    }
  };

  // Mobile-specific utilities
  const adjustFontSize = (delta) => {
    const newSize = Math.max(10, Math.min(24, currentFontSize + delta));
    setCurrentFontSize(newSize);
    hapticFeedback.light();
  };

  const formatCode = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('editor.action.formatDocument');
    if (action) {
      action.run();
      hapticFeedback.success();
    }
  };

  const duplicateLine = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('editor.action.copyLinesDownAction');
    if (action) {
      action.run();
      hapticFeedback.medium();
    }
  };

  const deleteLine = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('editor.action.deleteLines');
    if (action) {
      action.run();
      hapticFeedback.medium();
    }
  };

  const toggleComment = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const action = editor.getAction('editor.action.commentLine');
    if (action) {
      action.run();
      hapticFeedback.light();
    }
  };

  const shareCode = async () => {
    if (navigator.share && value.trim()) {
      try {
        await navigator.share({
          title: `${currentLanguage.name} Code`,
          text: value,
        });
        hapticFeedback.success();
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedText || value);
      hapticFeedback.success();
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = selectedText || value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      hapticFeedback.success();
    }
  };

  // Gesture handlers
  useGestures(containerRef, {
    onSwipe: (direction) => {
      switch (direction) {
        case 'right':
          if (showKeyboardHelper || showQuickActions || showFindReplace) {
            setShowKeyboardHelper(false);
            setShowQuickActions(false);
            setShowFindReplace(false);
          }
          break;
        case 'left':
          setShowKeyboardHelper(true);
          break;
        case 'up':
          setShowQuickActions(true);
          break;
        case 'down':
          if (showQuickActions) setShowQuickActions(false);
          if (showKeyboardHelper) setShowKeyboardHelper(false);
          break;
      }
    },
    onDoubleTap: () => {
      setIsFullscreen(!isFullscreen);
      hapticFeedback.medium();
    }
  });

  const currentLanguage = getLanguageById(language);
  const snippets = quickSnippets[language] || [];

  // Enhanced snippets with more mobile-friendly options
  const mobileSnippets = [
    ...snippets,
    { label: 'TODO', code: '// TODO: ', cursor: 0 },
    { label: 'FIXME', code: '// FIXME: ', cursor: 0 },
    { label: 'NOTE', code: '// NOTE: ', cursor: 0 },
  ];

  return (
    <motion.div 
      ref={containerRef}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Mobile Toolbar */}
      <motion.div 
        className={`flex items-center justify-between p-3 border-b backdrop-blur-sm ${
          isDarkMode ? 'border-gray-700 bg-gray-800/95' : 'border-gray-200 bg-gray-50/95'
        }`}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="flex items-center space-x-2"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">{currentLanguage.icon}</span>
            <div>
              <span className="text-sm font-semibold">{currentLanguage.name}</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{cursorPosition.line}:{cursorPosition.column}</span>
                <span>•</span>
                <span>{currentFontSize}px</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-1">
          <TouchButton
            variant="ghost"
            size="sm"
            onPress={() => setShowSettings(!showSettings)}
            className={showSettings ? 'bg-primary-100 text-primary-600' : ''}
            haptic="light"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="sm"
            onPress={() => setShowFindReplace(!showFindReplace)}
            className={showFindReplace ? 'bg-primary-100 text-primary-600' : ''}
            haptic="light"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="sm"
            onPress={() => setShowKeyboardHelper(!showKeyboardHelper)}
            className={showKeyboardHelper ? 'bg-primary-100 text-primary-600' : ''}
            haptic="light"
          >
            <KeyboardIcon className="h-5 w-5" />
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="sm"
            onPress={() => setShowQuickActions(!showQuickActions)}
            className={showQuickActions ? 'bg-primary-100 text-primary-600' : ''}
            haptic="light"
          >
            <DocumentTextIcon className="h-5 w-5" />
          </TouchButton>
          
          <TouchButton
            variant="ghost"
            size="sm"
            onPress={() => setIsFullscreen(!isFullscreen)}
            haptic="medium"
          >
            {isFullscreen ? 
              <ArrowsPointingInIcon className="h-5 w-5" /> : 
              <ArrowsPointingOutIcon className="h-5 w-5" />
            }
          </TouchButton>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-b overflow-hidden ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Font Size Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Font Size</span>
                <div className="flex items-center space-x-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => adjustFontSize(-1)}
                    haptic="light"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </TouchButton>
                  <span className="text-sm font-mono w-8 text-center">{currentFontSize}</span>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => adjustFontSize(1)}
                    haptic="light"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </TouchButton>
                </div>
              </div>

              {/* Display Options */}
              <div className="grid grid-cols-2 gap-4">
                <TouchButton
                  variant={showLineNumbers ? "primary" : "ghost"}
                  size="sm"
                  onPress={() => setShowLineNumbers(!showLineNumbers)}
                  haptic="light"
                  className="justify-start"
                >
                  <span className="text-sm">Line Numbers</span>
                </TouchButton>
                
                <TouchButton
                  variant={wordWrap ? "primary" : "ghost"}
                  size="sm"
                  onPress={() => setWordWrap(!wordWrap)}
                  haptic="light"
                  className="justify-start"
                >
                  <span className="text-sm">Word Wrap</span>
                </TouchButton>
              </div>

              {/* Theme Toggle */}
              <TouchButton
                variant="ghost"
                size="sm"
                onPress={toggleTheme}
                haptic="medium"
                className="w-full justify-between"
              >
                <span className="text-sm">Theme</span>
                {isDarkMode ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
              </TouchButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Find/Replace Bar */}
      {showFindReplace && (
        <div className={`p-3 border-b space-y-2 ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find..."
              className={`flex-1 px-2 py-1 text-sm border rounded ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            <button
              onClick={findNext}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Find
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace..."
              className={`flex-1 px-2 py-1 text-sm border rounded ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            <button
              onClick={replaceNext}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-b overflow-hidden ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Code Actions */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Code Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={formatCode}
                    haptic="light"
                    className="justify-start text-sm"
                  >
                    Format Code
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={toggleComment}
                    haptic="light"
                    className="justify-start text-sm"
                  >
                    Toggle Comment
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={duplicateLine}
                    haptic="light"
                    className="justify-start text-sm"
                  >
                    Duplicate Line
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={deleteLine}
                    haptic="medium"
                    className="justify-start text-sm"
                  >
                    Delete Line
                  </TouchButton>
                </div>
              </div>

              {/* Code Snippets */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Code Snippets
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {mobileSnippets.map((snippet, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TouchButton
                        variant="ghost"
                        size="sm"
                        onPress={() => insertSnippet(snippet)}
                        haptic="light"
                        className="justify-start text-sm w-full"
                      >
                        {snippet.label}
                      </TouchButton>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monaco Editor */}
      <div className={isFullscreen ? 'h-screen' : 'h-64'}>
        <MonacoCodeEditor
          value={value}
          onChange={onChange}
          language={language}
          theme={theme}
          height="100%"
          options={mobileOptions}
          onMount={handleEditorMount}
          enableProfessionalFeatures={false} // Simplified for mobile
          enableAnimations={false} // Disabled for performance
        />
      </div>

      {/* Enhanced Virtual Keyboard Helper */}
      <AnimatePresence>
        {showKeyboardHelper && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-t overflow-hidden ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Cursor Navigation */}
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => moveCursor('up')}
                    haptic="selection"
                    className="w-12 h-12"
                  >
                    <ChevronUpIcon className="h-5 w-5" />
                  </TouchButton>
                  <div></div>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => moveCursor('left')}
                    haptic="selection"
                    className="w-12 h-12"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => moveCursor('down')}
                    haptic="selection"
                    className="w-12 h-12"
                  >
                    <ChevronDownIcon className="h-5 w-5" />
                  </TouchButton>
                  <TouchButton
                    variant="ghost"
                    size="sm"
                    onPress={() => moveCursor('right')}
                    haptic="selection"
                    className="w-12 h-12"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </TouchButton>
                </div>
              </div>
              
              {/* Helper Buttons */}
              <div className="grid grid-cols-6 gap-2">
                {keyboardHelpers.map((helper, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      onPress={() => insertText(helper.code, helper.cursor)}
                      haptic="selection"
                      className="w-full h-10 text-sm font-mono"
                    >
                      {helper.label}
                    </TouchButton>
                  </motion.div>
                ))}
              </div>

              {/* Additional Actions */}
              <div className="flex justify-center space-x-2">
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onPress={copyToClipboard}
                  haptic="light"
                  className="flex items-center space-x-1"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </TouchButton>
                
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onPress={shareCode}
                  haptic="light"
                  className="flex items-center space-x-1"
                >
                  <ShareIcon className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </TouchButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Action Bar */}
      <motion.div 
        className={`flex items-center justify-between p-4 border-t backdrop-blur-sm ${
          isDarkMode ? 'border-gray-700 bg-gray-800/95' : 'border-gray-200 bg-gray-50/95'
        }`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <TouchButton
            variant={currentLanguage.executionSupported ? "primary" : "ghost"}
            size="lg"
            onPress={onExecute}
            disabled={isExecuting || !currentLanguage.executionSupported || readOnly}
            loading={isExecuting}
            haptic="medium"
            className="flex items-center space-x-2"
          >
            <PlayIcon className="h-5 w-5" />
            <span className="font-medium">
              {isExecuting ? 'Running...' : 'Run Code'}
            </span>
          </TouchButton>

          {onSave && (
            <TouchButton
              variant="ghost"
              size="md"
              onPress={() => onSave(value)}
              haptic="light"
              className="border border-gray-300 dark:border-gray-600"
            >
              Save
            </TouchButton>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{value.split('\n').length} lines</span>
            <span>•</span>
            <span>{value.length} chars</span>
          </div>
          {selectedText && (
            <div className="text-xs text-primary-600 font-medium">
              {selectedText.length} selected
            </div>
          )}
          {readOnly && (
            <div className="text-xs text-orange-600 font-medium">
              Read Only
            </div>
          )}
        </div>
      </motion.div>

      {/* Gesture Hints */}
      {!isFullscreen && (
        <motion.div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          <div className={`text-xs px-2 py-1 rounded-full ${
            isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
          }`}>
            Double tap for fullscreen • Swipe for tools
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileCodeEditor;