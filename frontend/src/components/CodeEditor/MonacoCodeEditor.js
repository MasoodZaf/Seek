import React, { useRef, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Configure Monaco Editor
loader.config({ monaco });

const MonacoCodeEditor = ({ 
  value, 
  onChange, 
  language, 
  theme = 'vs-dark',
  height = '400px',
  options = {},
  onMount
}) => {
  const editorRef = useRef(null);

  const defaultOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    contextmenu: true,
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true
    },
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
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    parameterHints: { enabled: true },
    hover: { enabled: true },
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    ...options
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure language-specific settings
    setupLanguageSupport(monaco);
    
    // Add custom keyboard shortcuts
    addCustomKeyboardShortcuts(editor);
    
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const setupLanguageSupport = (monaco) => {
    // Enhanced JavaScript/TypeScript support
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true
    });

    // Add common libraries for JavaScript
    const libUri = 'ts:filename/facts.d.ts';
    const libSource = `
      declare const console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
      };
      
      declare const setTimeout: (callback: () => void, delay: number) => number;
      declare const setInterval: (callback: () => void, delay: number) => number;
      declare const clearTimeout: (id: number) => void;
      declare const clearInterval: (id: number) => void;
    `;

    if (!monaco.languages.typescript.javascriptDefaults.getExtraLibs()[libUri]) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
    }
  };

  const addCustomKeyboardShortcuts = (editor) => {
    // Ctrl+/ or Cmd+/ for toggle comment
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine').run();
    });

    // Ctrl+D or Cmd+D for duplicate line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.copyLinesDownAction').run();
    });

    // Alt+Up/Down for move line
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.moveLinesUpAction').run();
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.moveLinesDownAction').run();
    });

    // Ctrl+Shift+K or Cmd+Shift+K for delete line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
      editor.getAction('editor.action.deleteLines').run();
    });

    // F2 for rename symbol
    editor.addCommand(monaco.KeyCode.F2, () => {
      editor.getAction('editor.action.rename').run();
    });

    // Ctrl+F or Cmd+F for find
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    // Ctrl+H or Cmd+H for replace
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });
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