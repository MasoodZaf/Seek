import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { SEEK_PROFESSIONAL_THEMES, getThemeByName, LANGUAGE_SPECIFIC_THEMES } from './themes/seekProfessional';
import {
  createAutocompleteProviders,
  createHoverProviders,
  createCodeActionProviders,
  setupInlineSuggestions
} from './autocompleteProviders';
import { getSnippetsForLanguage } from './codeSnippets';

const MonacoCodeEditor = ({ 
  value, 
  onChange, 
  language, 
  theme = 'seek-dark-professional',
  height = '400px',
  options = {},
  onMount,
  enableProfessionalFeatures = true,
  fontSize = 14,
  fontFamily = 'JetBrains Mono, Consolas, "Courier New", monospace',
  enableAnimations = true
}) => {
  const editorRef = useRef(null);
  const [isThemeRegistered, setIsThemeRegistered] = useState(false);

  const defaultOptions = {
    // Basic editor options
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    contextmenu: true,
    
    // Professional typography
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontLigatures: true,
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 1.6,
    
    // Enhanced minimap
    minimap: { 
      enabled: true,
      side: 'right',
      showSlider: 'always',
      renderCharacters: true,
      maxColumn: 120,
      scale: 1
    },
    
    // Professional folding
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    foldingHighlight: true,
    
    // Enhanced bracket matching
    bracketPairColorization: { 
      enabled: true,
      independentColorPoolPerBracketType: true
    },
    matchBrackets: 'always',
    
    // Professional guides
    guides: {
      bracketPairs: true,
      bracketPairsHorizontal: true,
      highlightActiveBracketPair: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    
    // Enhanced rulers and margins
    rulers: [80, 120],
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    
    // Professional scrolling
    smoothScrolling: enableAnimations,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: true,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 14,
      horizontalScrollbarSize: 14
    },
    
    // Enhanced suggestions
    suggest: {
      enabled: true,
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showKeywords: true,
      showWords: true,
      showColorPresentations: true,
      showTextPresentation: true,
      showSnippets: true,
      showUsers: true,
      showIssues: true,
      insertMode: 'insert',
      filterGraceful: true,
      snippetsPreventQuickSuggestions: false,
      localityBonus: true,
      shareSuggestSelections: true,
      showIcons: true,
      maxVisibleSuggestions: 12,
      showStatusBar: true
    },
    
    // Professional quick suggestions
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    quickSuggestionsDelay: 100,
    
    // Enhanced IntelliSense
    parameterHints: { 
      enabled: true,
      cycle: true
    },
    hover: { 
      enabled: true,
      delay: 300,
      sticky: true
    },
    
    // Professional editing
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: true,
    wordBasedSuggestionsOnlySameLanguage: false,
    
    // Enhanced find/replace
    find: {
      seedSearchStringFromSelection: 'always',
      autoFindInSelection: 'never',
      globalFindClipboard: false,
      addExtraSpaceOnTop: true,
      loop: true
    },
    
    // Professional cursor
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: enableAnimations,
    cursorWidth: 2,
    
    // Enhanced selection
    multiCursorModifier: 'ctrlCmd',
    multiCursorMergeOverlapping: true,
    selectionHighlight: true,
    occurrencesHighlight: true,
    
    // Professional formatting
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full',
    insertSpaces: true,
    tabSize: 2,
    detectIndentation: true,
    trimAutoWhitespace: true,
    
    // Enhanced error handling
    showUnused: true,
    showDeprecated: true,
    
    // Performance optimizations
    renderValidationDecorations: 'on',
    renderFinalNewline: true,
    
    // Accessibility
    accessibilitySupport: 'auto',
    accessibilityPageSize: 10,
    
    // Merge with custom options
    ...options
  };

  // Register professional themes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.monaco && !isThemeRegistered) {
      registerProfessionalThemes(window.monaco);
      setIsThemeRegistered(true);
    }
  }, [isThemeRegistered]);

  const registerProfessionalThemes = (monaco) => {
    try {
      Object.entries(SEEK_PROFESSIONAL_THEMES).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, themeData);
      });
    } catch (error) {
      console.warn('Failed to register professional themes:', error);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register professional themes
    registerProfessionalThemes(monaco);
    setIsThemeRegistered(true);

    // Configure language-specific settings
    setupLanguageSupport(monaco);

    // Add custom keyboard shortcuts
    addCustomKeyboardShortcuts(editor, monaco);

    // Setup professional features
    if (enableProfessionalFeatures) {
      setupProfessionalFeatures(editor, monaco);
    }

    // Apply language-specific theme enhancements
    applyLanguageSpecificTheme(monaco, language, theme);

    // ========== NEW: Setup Enhanced Autocomplete ==========
    try {
      // Create autocomplete providers for all supported languages
      createAutocompleteProviders(monaco);

      // Create hover providers for documentation on hover
      createHoverProviders(monaco);

      // Create code action providers for quick fixes
      createCodeActionProviders(monaco);

      // Setup inline suggestions
      setupInlineSuggestions(editor, monaco);

      console.log('✅ Enhanced autocomplete features activated');
    } catch (error) {
      console.error('Error setting up autocomplete:', error);
    }
    // ====================================================

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const setupLanguageSupport = (monaco) => {
    try {
      // Enhanced JavaScript/TypeScript support
      if (monaco.languages && monaco.languages.typescript) {
        // JavaScript configuration
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
          noSuggestionDiagnostics: false,
          diagnosticCodesToIgnore: []
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          allowJs: true,
          typeRoots: ['node_modules/@types'],
          lib: ['ES2020', 'DOM', 'DOM.Iterable']
        });

        // TypeScript configuration
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
          noSuggestionDiagnostics: false
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          allowJs: true,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable']
        });
      }

      // Enhanced JSON support
      if (monaco.languages && monaco.languages.json) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: true,
          schemas: [],
          enableSchemaRequest: true
        });
      }

      // Enhanced CSS support
      if (monaco.languages && monaco.languages.css) {
        monaco.languages.css.cssDefaults.setOptions({
          validate: true,
          lint: {
            compatibleVendorPrefixes: 'ignore',
            vendorPrefix: 'warning',
            duplicateProperties: 'warning',
            emptyRules: 'warning',
            importStatement: 'ignore',
            boxModel: 'ignore',
            universalSelector: 'ignore',
            zeroUnits: 'ignore',
            fontFaceProperties: 'warning',
            hexColorLength: 'error',
            argumentsInColorFunction: 'error',
            unknownProperties: 'warning',
            ieHack: 'ignore',
            unknownVendorSpecificProperties: 'ignore',
            propertyIgnoredDueToDisplay: 'warning',
            important: 'ignore',
            float: 'ignore',
            idSelector: 'ignore'
          }
        });
      }

      // Enhanced HTML support
      if (monaco.languages && monaco.languages.html) {
        monaco.languages.html.htmlDefaults.setOptions({
          format: {
            tabSize: 2,
            insertSpaces: true,
            wrapLineLength: 120,
            unformatted: 'default',
            contentUnformatted: 'pre,code,textarea',
            indentInnerHtml: false,
            preserveNewLines: true,
            maxPreserveNewLines: 2,
            indentHandlebars: false,
            endWithNewline: false,
            extraLiners: 'head, body, /html',
            wrapAttributes: 'auto'
          },
          suggest: {
            html5: true,
            angular1: false,
            ionic: false
          }
        });
      }
    } catch (error) {
      console.warn('Monaco language setup failed:', error);
    }
  };

  const addCustomKeyboardShortcuts = (editor, monaco) => {
    try {
      if (monaco.KeyMod && monaco.KeyCode) {
        // Enhanced commenting
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
          const action = editor.getAction('editor.action.commentLine');
          if (action) action.run();
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Slash, () => {
          const action = editor.getAction('editor.action.blockComment');
          if (action) action.run();
        });

        // Professional formatting
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
          const action = editor.getAction('editor.action.formatDocument');
          if (action) action.run();
        });

        // Enhanced selection
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
          const action = editor.getAction('editor.action.addSelectionToNextFindMatch');
          if (action) action.run();
        });

        // Professional navigation
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
          const action = editor.getAction('editor.action.gotoLine');
          if (action) action.run();
        });

        // Enhanced folding
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
          const action = editor.getAction('editor.foldAll');
          if (action) action.run();
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
          const action = editor.getAction('editor.unfoldAll');
          if (action) action.run();
        });

        // Professional code actions
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period, () => {
          const action = editor.getAction('editor.action.quickFix');
          if (action) action.run();
        });

        // Enhanced find/replace
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL, () => {
          const action = editor.getAction('editor.action.selectHighlights');
          if (action) action.run();
        });
      }
    } catch (error) {
      console.warn('Monaco keyboard shortcuts setup failed:', error);
    }
  };

  const setupProfessionalFeatures = (editor, monaco) => {
    try {
      // Enhanced error handling and diagnostics
      editor.onDidChangeModelDecorations(() => {
        const model = editor.getModel();
        if (model) {
          const markers = monaco.editor.getModelMarkers({ resource: model.uri });
          // Could emit events for error tracking here
        }
      });

      // Professional cursor tracking
      editor.onDidChangeCursorPosition((e) => {
        // Could implement cursor position tracking for analytics
      });

      // Enhanced content change tracking
      editor.onDidChangeModelContent((e) => {
        // Could implement real-time collaboration features here
      });

      // Professional focus management
      editor.onDidFocusEditorWidget(() => {
        // Could implement focus analytics
      });

      editor.onDidBlurEditorWidget(() => {
        // Could implement blur analytics
      });

    } catch (error) {
      console.warn('Professional features setup failed:', error);
    }
  };

  const applyLanguageSpecificTheme = (monaco, currentLanguage, currentTheme) => {
    try {
      const languageTheme = LANGUAGE_SPECIFIC_THEMES[currentLanguage];
      if (languageTheme && languageTheme.additionalRules) {
        const baseTheme = getThemeByName(currentTheme);
        const enhancedTheme = {
          ...baseTheme,
          rules: [...baseTheme.rules, ...languageTheme.additionalRules]
        };
        
        const enhancedThemeName = `${currentTheme}-${currentLanguage}`;
        monaco.editor.defineTheme(enhancedThemeName, enhancedTheme);
        monaco.editor.setTheme(enhancedThemeName);
      }
    } catch (error) {
      console.warn('Language-specific theme application failed:', error);
    }
  };

  // Language mappings for Monaco
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      javascript: 'javascript',
      js: 'javascript',
      typescript: 'typescript',
      ts: 'typescript',
      python: 'python',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'csharp',
      cs: 'csharp',
      php: 'php',
      ruby: 'ruby',
      rb: 'ruby',
      go: 'go',
      golang: 'go',
      rust: 'rust',
      rs: 'rust',
      swift: 'swift',
      kotlin: 'kotlin',
      kt: 'kotlin',
      scala: 'scala',
      r: 'r',
      julia: 'julia',
      perl: 'perl',
      dart: 'dart',
      elixir: 'elixir',
      haskell: 'haskell',
      hs: 'haskell',
      lua: 'lua',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
      markdown: 'markdown',
      md: 'markdown',
      sql: 'sql',
      shell: 'shell',
      bash: 'shell',
      sh: 'shell'
    };

    return languageMap[lang?.toLowerCase()] || 'plaintext';
  };

  return (
    <Editor
      height={height}
      language={getMonacoLanguage(language)}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme={theme}
      options={defaultOptions}
      loading={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    />
  );
};

export default MonacoCodeEditor;