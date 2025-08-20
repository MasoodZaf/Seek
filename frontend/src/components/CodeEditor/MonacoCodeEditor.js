import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

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
    addCustomKeyboardShortcuts(editor, monaco);
    
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const setupLanguageSupport = (monaco) => {
    // Basic JavaScript/TypeScript support
    try {
      if (monaco.languages && monaco.languages.typescript) {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          noEmit: true,
          allowJs: true
        });
      }
    } catch (error) {
      console.warn('Monaco language setup failed:', error);
    }
  };

  const addCustomKeyboardShortcuts = (editor, monaco) => {
    try {
      // Basic keyboard shortcuts
      if (monaco.KeyMod && monaco.KeyCode) {
        // Ctrl+/ or Cmd+/ for toggle comment
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
          const action = editor.getAction('editor.action.commentLine');
          if (action) action.run();
        });
      }
    } catch (error) {
      console.warn('Monaco keyboard shortcuts setup failed:', error);
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